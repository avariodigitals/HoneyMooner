import { authService } from './authService';
import { ASSETS } from '../config/images';
import type { 
  Destination, 
  TravelPackage, 
  Lead, 
  ContactMessage,
  BlogPost, 
  Testimonial,
  PackageReview,
  HomeContent,
  BookingContent,
  Continent, 
  PackageCategory,
  PricingTier,
  PackageInclusion,
  ExclusionItem,
  Departure,
  PricingBasis,
  RouteIdea
} from '../types';

const WP_BASE_URL = import.meta.env.VITE_WP_BASE_URL ?? 'https://cms.thehoneymoonertravel.com/wp-json';
const WP_SYNC_ENABLED = (import.meta.env.VITE_WP_SYNC_ENABLED ?? 'true') === 'true';
const WP_PUBLIC_LEAD_ENDPOINT = import.meta.env.VITE_WP_PUBLIC_LEAD_ENDPOINT ?? '/custom/v1/leads';
const WP_PUBLIC_LEAD_ENDPOINTS = import.meta.env.VITE_WP_PUBLIC_LEAD_ENDPOINTS ?? '';
const WP_LEADS_READ_ENABLED = (import.meta.env.VITE_WP_LEADS_READ_ENABLED ?? 'false') === 'true';
const WP_PACKAGE_REVIEWS_ENDPOINT = import.meta.env.VITE_WP_PACKAGE_REVIEWS_ENDPOINT ?? '/custom/v1/package-reviews';
const WP_CONTACT_MESSAGES_ENDPOINT = import.meta.env.VITE_WP_CONTACT_MESSAGES_ENDPOINT ?? '/custom/v1/contact-messages';

let wpReachable: boolean | null = null;
let wpCheckPromise: Promise<boolean> | null = null;
let lastWPCheckAt = 0;
let siteImageFallbacksPromise: Promise<SiteImageFallbacks> | null = null;
const WP_CHECK_RETRY_INTERVAL_MS = 10 * 1000;
const mediaUrlCache = new Map<number, string>();

interface SiteImageFallbacks {
  hero: string;
  package: string;
  destination: string;
  testimonial: string;
  general: string;
}

const DEFAULT_SITE_IMAGE_FALLBACKS: SiteImageFallbacks = {
  hero: ASSETS.FALLBACK_HERO,
  package: ASSETS.FALLBACK_PACKAGE,
  destination: ASSETS.FALLBACK_DESTINATION,
  testimonial: ASSETS.TESTIMONIALS.SARAH,
  general: ASSETS.FALLBACK_PACKAGE
};

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    coupleName: 'The Adewales',
    location: 'Lagos, Nigeria',
    destination: 'Maldives',
    quote: 'A dream beyond our wildest imagination.',
    story: 'From private seaplane arrivals to candlelit dinners, every detail was carefully planned and executed.',
    image: '/images/placeholder-travel.svg',
    rating: 5,
    date: 'Dec 2023'
  },
  {
    id: 't2',
    coupleName: 'Sarah & James',
    location: 'London, UK',
    destination: 'Santorini',
    quote: 'Every sunset felt like a painting made just for us.',
    story: 'Our villa and private experiences were perfectly matched to what we wanted from the trip.',
    image: '/images/placeholder-travel.svg',
    rating: 5,
    date: 'Sept 2023'
  },
  {
    id: 't3',
    coupleName: 'David & Elena',
    location: 'New York, USA',
    destination: 'Paris',
    quote: 'The level of detail was unlike anything we have experienced.',
    story: 'From hidden dining spots to seamless logistics, the trip felt effortless from beginning to end.',
    image: '/images/placeholder-travel.svg',
    rating: 5,
    date: 'June 2023'
  }
];

const FALLBACK_PACKAGE_REVIEWS: PackageReview[] = [
  {
    id: 'pr1',
    packageId: 'fallback-maldives',
    packageSlug: 'maldives-honeymoon',
    packageTitle: 'Maldives Honeymoon Experience',
    reviewerName: 'The Okafors',
    reviewerEmail: 'okafors@example.com',
    rating: 5,
    message: 'Every detail felt thoughtful, soft, and deeply personal. We still talk about the sunset dinner every week.',
    createdAt: '2026-02-10T00:00:00.000Z'
  },
  {
    id: 'pr2',
    packageId: 'fallback-santorini',
    packageSlug: 'santorini-honeymoon',
    packageTitle: 'Santorini Honeymoon Experience',
    reviewerName: 'Nana & Tunde',
    reviewerEmail: 'nana.tunde@example.com',
    rating: 5,
    message: 'The whole flow was beautifully paced. We never felt rushed, and every moment looked like a postcard.',
    createdAt: '2026-01-21T00:00:00.000Z'
  },
  {
    id: 'pr3',
    packageId: 'fallback-bali',
    packageSlug: 'bali-honeymoon',
    packageTitle: 'Bali Honeymoon Experience',
    reviewerName: 'Alicia & Mark',
    reviewerEmail: 'alicia.mark@example.com',
    rating: 5,
    message: 'We loved how calm and curated everything felt. It was romantic without being overwhelming.',
    createdAt: '2025-12-18T00:00:00.000Z'
  }
];

function bearerHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`
  };
}

function normalizeWishlistItems(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === 'string' || typeof item === 'number') {
        const normalized = String(item).trim();
        return normalized || null;
      }

      if (item && typeof item === 'object') {
        const candidate =
          'id' in item ? (item as { id?: unknown }).id
            : 'ID' in item ? (item as { ID?: unknown }).ID
              : null;

        if (typeof candidate === 'string' || typeof candidate === 'number') {
          const normalized = String(candidate).trim();
          return normalized || null;
        }
      }

      return null;
    })
    .filter((item): item is string => Boolean(item));
}

async function checkWP(): Promise<boolean> {
  if (!WP_SYNC_ENABLED) {
    return false;
  }
  const now = Date.now();
  if (wpReachable === true) return true;
  if (wpReachable === false && now - lastWPCheckAt < WP_CHECK_RETRY_INTERVAL_MS) return false;
  if (wpCheckPromise) return wpCheckPromise;

  wpCheckPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${WP_BASE_URL}/wp/v2`, { signal: controller.signal });
      clearTimeout(timeout);
      lastWPCheckAt = Date.now();
      wpReachable = res.ok;
      return res.ok;
    } catch {
      lastWPCheckAt = Date.now();
      wpReachable = false;
      return false;
    } finally {
      wpCheckPromise = null;
    }
  })();

  return wpCheckPromise;
}

interface WPResponseItem {
  id: number;
  title?: { rendered?: string; raw?: string };
  slug: string;
  content?: { rendered?: string };
  excerpt?: { rendered?: string };
  date: string;
  featured_image_url?: string;
  meta?: {
    country?: string;
    continent?: Continent;
    image?: string | number | { url?: string; source_url?: string };
    category?: PackageCategory;
    summary?: string;
    featured_image?: string | number | { url?: string; source_url?: string };
    gallery?: string[] | string;
    destination_id?: string | number | Array<number | { ID?: number; id?: number }>;
    duration?: { days: number; nights: number } | string;
    days?: number;
    nights?: number;
    pricing_tiers?: PricingTier[] | {
      premium?: Partial<PricingTier>;
      luxuria?: Partial<PricingTier>;
      ultra_luxuria?: Partial<PricingTier>;
    };
    inclusions?: PackageInclusion[] | string;
    exclusions?: string[] | string;
    tags?: string[] | string;
    departures?: Departure[] | string;
    seo?: { title: string; description: string; keywords: string[] } | string;
    seo_title?: string;
    meta_description?: string;
    experience_content?: string;
    experience_seo_content?: string;
    package_experience_content?: string;
  };
  hm_package_data?: {
    package_id?: string;
    destination_id?: string | number;
    category?: PackageCategory;
    subtitle?: string;
    summary?: string;
    intro_content?: string;
    days?: number;
    nights?: number;
    starting_price?: number;
    currency?: string;
    pricing_basis?: string;
    rating?: number;
    review_count?: number;
    pricing_tiers?: PricingTier[];
    inclusions?: PackageInclusion[];
    exclusions?: string[];
    departures?: Departure[];
    itinerary?: unknown[];
    seo_title?: string;
    meta_description?: string;
    canonical_url?: string;
  };
  hm_destination_data?: {
    subtitle?: string;
    intro_content?: string;
    best_time_to_visit?: string;
    seo_title?: string;
    meta_description?: string;
    canonical_url?: string;
    highlights?: Array<{ title?: string; description?: string }>;
  };
  acf?: {
    country?: string;
    continent?: Continent;
    image?: string | number | { url?: string; source_url?: string };
    category?: PackageCategory;
    summary?: string;
    featured_image?: string | number | { url?: string; source_url?: string };
    gallery?: string[] | string;
    destination_id?: string | number | Array<number | { ID?: number; id?: number }>;
    duration?: { days: number; nights: number } | string;
    pricing_tiers?: PricingTier[] | {
      premium?: Partial<PricingTier>;
      luxuria?: Partial<PricingTier>;
      ultra_luxuria?: Partial<PricingTier>;
    };
    inclusions?: PackageInclusion[] | string;
    exclusions?: string[] | string;
    tags?: string[] | string;
    departures?: Departure[] | string;
    seo?: { title: string; description: string; keywords: string[] } | string;
    experience_content?: string;
    experience_seo_content?: string;
    package_experience_content?: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<Array<{ name: string }>>;
    'author'?: Array<{ name: string }>;
  };
}

interface WPReviewItem {
  id: number;
  title?: { rendered?: string; raw?: string };
  slug: string;
  content?: { rendered?: string };
  date: string;
  acf?: {
    package_id?: string;
    package_slug?: string;
    package_title?: string;
    reviewer_name?: string;
    reviewer_email?: string;
    rating?: number;
  };
}

interface WPPageItem {
  id: number;
  hm_featured_content?: {
    hero_image?: string;
    hero_title?: string;
    hero_subtitle?: string;
    cta1_label?: string;
    cta1_url?: string;
    cta2_label?: string;
    cta2_url?: string;
    featured_destination_ids?: number[];
  };
  acf?: {
    hero_title?: string;
    hero_subtitle?: string;
    hero_image?: string | number | { url?: string; source_url?: string };
    hero_cta?: string;
    destinations_title?: string;
    destinations_subtitle?: string;
    destinations_description?: string;
    packages_title?: string;
    packages_subtitle?: string;
    packages_description?: string;
    gift_eyebrow?: string;
    gift_title?: string;
    gift_description?: string;
    gift_note?: string;
    gift_image?: string | number | { url?: string; source_url?: string };
    gift_image_alt?: string;
    gift_primary_cta_label?: string;
    gift_primary_cta_url?: string;
    gift_secondary_cta_label?: string;
    gift_secondary_cta_url?: string;
    browse_style_beach_image?: string | number | { url?: string; source_url?: string };
    browse_style_island_image?: string | number | { url?: string; source_url?: string };
    browse_style_adventure_image?: string | number | { url?: string; source_url?: string };
    browse_style_city_image?: string | number | { url?: string; source_url?: string };
    fallback_hero_image?: string | number | { url?: string; source_url?: string };
    fallback_package_image?: string | number | { url?: string; source_url?: string };
    fallback_destination_image?: string | number | { url?: string; source_url?: string };
    fallback_testimonial_image?: string | number | { url?: string; source_url?: string };
    fallback_general_image?: string | number | { url?: string; source_url?: string };
    booking_hero_eyebrow?: string;
    booking_hero_title?: string;
    booking_hero_description?: string;
    booking_success_title?: string;
    booking_success_message?: string;
    booking_success_cta?: string;
    booking_bespoke_title?: string;
    booking_bespoke_description?: string;
    booking_bespoke_features?: string[] | string;
    booking_bespoke_budget_options?: string[] | string;
    booking_package_benefits?: string[] | string;
    booking_fallback_title?: string;
    booking_fallback_description?: string;
    booking_fallback_satisfaction_title?: string;
    booking_fallback_satisfaction_subtitle?: string;
    booking_consultation_title?: string;
    booking_consultation_description?: string;
    booking_consultation_cta?: string;
    booking_label_package?: string;
    booking_label_tier?: string;
    booking_label_departure_date?: string;
    booking_label_country?: string;
    booking_label_travellers?: string;
    booking_label_adults?: string;
    booking_label_children?: string;
    booking_label_special_requests?: string;
    booking_label_submit?: string;
    booking_label_submitting?: string;
    booking_label_loading?: string;
    booking_label_occasion?: string;
    booking_placeholder_package?: string;
    booking_placeholder_tier?: string;
  };
}

interface WPCategoryItem {
  id: number;
  slug: string;
}

interface TestimonialMeta {
  location?: string;
  destination?: string;
  rating?: number;
  date?: string;
}

function parseJson<T>(value: unknown): T | null {
  if (typeof value !== 'string') return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function parseStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean);
  if (typeof value !== 'string') return [];
  const parsed = parseJson<string[]>(value);
  if (Array.isArray(parsed)) return parsed.map((item) => String(item)).filter(Boolean);
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseGallery(value: unknown): string[] {
  return parseStringList(value);
}

function parseExperienceContent(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function parseDuration(value: unknown): { days: number; nights: number } {
  if (value && typeof value === 'object' && 'days' in (value as Record<string, unknown>) && 'nights' in (value as Record<string, unknown>)) {
    const raw = value as { days?: unknown; nights?: unknown };
    return {
      days: Number(raw.days ?? 7),
      nights: Number(raw.nights ?? 6)
    };
  }
  const parsed = parseJson<{ days?: number; nights?: number }>(value);
  if (parsed && typeof parsed === 'object') {
    return {
      days: Number(parsed.days ?? 7),
      nights: Number(parsed.nights ?? 6)
    };
  }
  return { days: 7, nights: 6 };
}

function parseDestinationId(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value) && value.length > 0) {
    const first = value[0];
    if (typeof first === 'number' || typeof first === 'string') return String(first);
    if (first && typeof first === 'object') {
      const record = first as { ID?: number; id?: number };
      if (record.ID) return String(record.ID);
      if (record.id) return String(record.id);
    }
  }
  return '';
}

function parsePricingTiers(value: unknown): PricingTier[] {
  if (Array.isArray(value)) {
    return value
      .map((raw, index) => {
        if (!raw || typeof raw !== 'object') return null;
        const tier = raw as Record<string, unknown>;
        const rawName = String(tier.name ?? tier.tier_name ?? '').trim();
        const normalizedName = rawName.toLowerCase().includes('ultra')
          ? 'Ultra Luxuria'
          : rawName.toLowerCase().includes('luxuria')
            ? 'Luxuria'
            : 'Premium';
        const rawPrice = tier.price ?? tier.tier_price;
        const price = Number(rawPrice ?? 0);
        if (!Number.isFinite(price) || price <= 0) return null;
        return {
          id: String(tier.id ?? tier.tier_id ?? `${normalizedName.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`),
          name: normalizedName as PricingTier['name'],
          price,
          basis: String(tier.basis ?? tier.tier_basis ?? 'per couple') as PricingTier['basis']
        };
      })
      .filter((tier): tier is PricingTier => Boolean(tier));
  }

  if (value && typeof value === 'object') {
    const obj = value as {
      premium?: Partial<PricingTier>;
      luxuria?: Partial<PricingTier>;
      ultra_luxuria?: Partial<PricingTier>;
    };
    const toTier = (tierKey: 'premium' | 'luxuria' | 'ultra_luxuria', fallbackName: PricingTier['name']): PricingTier | null => {
      const tier = obj[tierKey];
      if (!tier || tier.price === undefined || tier.price === null) return null;
      return {
        id: String(tier.id || tierKey),
        name: (tier.name as PricingTier['name']) || fallbackName,
        price: Number(tier.price),
        basis: (tier.basis as PricingTier['basis']) || 'per couple'
      };
    };
    return [
      toTier('premium', 'Premium'),
      toTier('luxuria', 'Luxuria'),
      toTier('ultra_luxuria', 'Ultra Luxuria')
    ].filter((tier): tier is PricingTier => Boolean(tier));
  }

  return [];
}

function parseInclusions(value: unknown): PackageInclusion[] {
  const raw = Array.isArray(value) ? value : parseJson<unknown[]>(value);
  if (!Array.isArray(raw)) return [];

  return raw
    .map((inc: unknown): PackageInclusion | null => {
      if (!inc || typeof inc !== 'object') return null;
      const record = inc as { category?: string; items?: unknown[] };
      return {
        category: (record.category || 'extras') as PackageInclusion['category'],
        items: Array.isArray(record.items) ? record.items.map((i: unknown) => String(i)).filter(Boolean) : []
      };
    })
    .filter((inc): inc is PackageInclusion => inc !== null);
}

function parseExclusions(value: unknown): ExclusionItem[] {
  const raw = Array.isArray(value) ? value : parseJson<unknown[]>(value);
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item: unknown): ExclusionItem | null => {
      if (!item) return null;
      if (typeof item === 'string') return item.trim();
      if (typeof item === 'object') {
        const record = item as Record<string, unknown>;
        // Handle common ACF repeater formats: { title, description } or { text }
        if ('title' in record || 'description' in record) {
          return {
            title: record.title ? String(record.title).trim() : undefined,
            description: record.description ? String(record.description).trim() : undefined
          };
        }
        if ('text' in record) return String(record.text).trim();
        if ('item' in record) return String(record.item).trim();
        
        // Fallback for other objects: try to find any string property
        const firstString = Object.values(record).find(v => typeof v === 'string') as string | undefined;
        return firstString ? firstString.trim() : null;
      }
      return String(item).trim();
    })
    .filter((item): item is ExclusionItem => item !== null);
}

function parseDepartures(value: unknown): Departure[] {
  const raw = Array.isArray(value) ? value : parseJson<unknown[]>(value);
  if (!Array.isArray(raw)) return [];

  return raw
    .map((dep: unknown): Departure | null => {
      if (!dep || typeof dep !== 'object') return null;
      const record = dep as { id?: string | number; date?: string; availability?: string; priceAdjustment?: number };
      const date = String(record.date || '');
      if (!date) return null;

      return {
        id: String(record.id || date || Math.random()),
        date,
        availability: (record.availability || 'available') as Departure['availability'],
        priceAdjustment: typeof record.priceAdjustment === 'number' ? record.priceAdjustment : 0
      };
    })
    .filter((dep): dep is Departure => dep !== null);
}

function parseSeo(value: unknown): { title: string; description: string; keywords: string[] } {
  if (value && typeof value === 'object') {
    const record = value as { title?: string; description?: string; keywords?: string[] | string };
    return {
      title: record.title || '',
      description: record.description || '',
      keywords: parseStringList(record.keywords)
    };
  }
  const parsed = parseJson<{ title?: string; description?: string; keywords?: string[] | string }>(value);
  if (parsed) {
    return {
      title: parsed.title || '',
      description: parsed.description || '',
      keywords: parseStringList(parsed.keywords)
    };
  }
  return { title: '', description: '', keywords: [] };
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>?/gm, '').trim();
}

function decodeHtml(value: string): string {
  if (typeof document === 'undefined') return value;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

function cleanText(value: string): string {
  return decodeHtml(stripHtml(value || '')).trim();
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (item === null || item === undefined) return [];
        if (typeof item === 'string') return [item];
        if (typeof item === 'object' && item !== null) {
          const itemObj = item as Record<string, unknown>;
          return [
            itemObj.text,
            itemObj.stop_name,
            itemObj.value,
            itemObj.name
          ].filter((field): field is string => typeof field === 'string');
        }
        return [String(item)];
      })
      .map((item) => cleanText(item))
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeStringArray(parsed);
      } catch {
        try {
          const normalized = trimmed.replace(/'/g, '"');
          const parsed = JSON.parse(normalized);
          return normalizeStringArray(parsed);
        } catch {
          // fall back to splitting below
        }
      }
    }

    return trimmed
      .replace(/^[\[\(]+|[\]\)]+$/g, '')
      .split(/[,|;\/>\u2192\u2013\u2014\n]+/) // commas, pipes, semicolons, arrows, slashes, newlines
      .map((item) => cleanText(item.replace(/^['"]+|['"]+$/g, '')))
      .filter(Boolean);
  }

  return [];
}

function humanizeSlug(value: string): string {
  if (!value) return '';
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
    .trim();
}

function parseTestimonialMeta(contentHtml: string): TestimonialMeta {
  const match = contentHtml.match(/<!--\s*hm_testimonial_meta:(\{[\s\S]*?\})\s*-->/);
  if (!match?.[1]) return {};
  const parsed = parseJson<TestimonialMeta>(match[1]);
  return parsed || {};
}

async function getCategoryIdBySlug(slug: string): Promise<number | null> {
  try {
    const response = await fetch(`${WP_BASE_URL}/wp/v2/categories?slug=${encodeURIComponent(slug)}&per_page=1`);
    if (!response.ok) return null;
    const data = await response.json() as WPCategoryItem[];
    return data[0]?.id ?? null;
  } catch {
    return null;
  }
}

async function resolveImageValue(value: unknown): Promise<string> {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const record = value as { url?: string; source_url?: string };
    if (record.url) return record.url;
    if (record.source_url) return record.source_url;
  }
  if (typeof value === 'number') {
    const cached = mediaUrlCache.get(value);
    if (cached) return cached;
    try {
      const response = await fetch(`${WP_BASE_URL}/wp/v2/media/${value}`);
      if (!response.ok) return '';
      const data = await response.json() as { source_url?: string };
      const resolved = data.source_url || '';
      if (resolved) mediaUrlCache.set(value, resolved);
      return resolved;
    } catch {
      return '';
    }
  }
  return '';
}

async function getSiteImageFallbacks(): Promise<SiteImageFallbacks> {
  if (siteImageFallbacksPromise) return siteImageFallbacksPromise;

  siteImageFallbacksPromise = (async () => {
    const ok = await checkWP();
    if (!ok) return DEFAULT_SITE_IMAGE_FALLBACKS;

    try {
      const response = await fetch(`${WP_BASE_URL}/wp/v2/pages?slug=home-settings&per_page=1`);
      if (!response.ok) return DEFAULT_SITE_IMAGE_FALLBACKS;

      const data = await response.json() as WPPageItem[];
      const page = data[0];
      if (!page?.acf) return DEFAULT_SITE_IMAGE_FALLBACKS;

      const [hero, packageImage, destination, testimonial, general] = await Promise.all([
        resolveImageValue(page.acf.fallback_hero_image),
        resolveImageValue(page.acf.fallback_package_image),
        resolveImageValue(page.acf.fallback_destination_image),
        resolveImageValue(page.acf.fallback_testimonial_image),
        resolveImageValue(page.acf.fallback_general_image)
      ]);

      return {
        hero: hero || DEFAULT_SITE_IMAGE_FALLBACKS.hero,
        package: packageImage || DEFAULT_SITE_IMAGE_FALLBACKS.package,
        destination: destination || DEFAULT_SITE_IMAGE_FALLBACKS.destination,
        testimonial: testimonial || DEFAULT_SITE_IMAGE_FALLBACKS.testimonial,
        general: general || DEFAULT_SITE_IMAGE_FALLBACKS.general
      };
    } catch {
      return DEFAULT_SITE_IMAGE_FALLBACKS;
    } finally {
      siteImageFallbacksPromise = null;
    }
  })();

  return siteImageFallbacksPromise;
}

export const dataService = {
  checkWP,
  // --- Destinations ---
  async getDestinations(): Promise<Destination[]> {
    try {
      const ok = await checkWP();
      if (!ok) return [];
      const siteImageFallbacks = await getSiteImageFallbacks();
      const response = await fetch(`${WP_BASE_URL}/wp/v2/destinations?_embed&per_page=100`);
      if (!response.ok) return [];
      const raw = await response.json();
      const data = Array.isArray(raw) ? raw as WPResponseItem[] : [];
      return await Promise.all(data.map(async (item) => ({
        ...item,
        _resolvedImage:
          item?.featured_image_url ||
          item?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
          await resolveImageValue(item?.acf?.image || item?.meta?.image)
      }))).then((items) => items.map((item) => ({
        id: String(item?.id ?? ''),
        name: cleanText(item?.title?.rendered || 'Destination'),
        country: cleanText(item.acf?.country || item.meta?.country || ''),
        continent: item.acf?.continent || item.meta?.continent || 'Africa',
        description: cleanText(item?.content?.rendered || ''),
        image: (item as WPResponseItem & { _resolvedImage?: string })._resolvedImage || siteImageFallbacks.destination,
        slug: item?.slug || `destination-${item?.id ?? 'unknown'}`
      }))).then((items) => items.filter((item) => Boolean(item.id)));
    } catch (error) {
      console.error('Error fetching destinations:', error);
      return [];
    }
  },

  async updateDestination(dest: Destination): Promise<boolean> {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const ok = await checkWP();
      if (!ok) return false;
      const response = await fetch(`${WP_BASE_URL}/wp/v2/destinations/${dest.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...bearerHeaders(token)
        },
        body: JSON.stringify({
          title: dest.name,
          acf: {
            country: dest.country,
            continent: dest.continent,
            image: dest.image
          }
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating destination:', error);
      return false;
    }
  },

  // --- Packages ---
  async getPackages(): Promise<TravelPackage[]> {
    try {
      const ok = await checkWP();
      if (!ok) return [];
      const siteImageFallbacks = await getSiteImageFallbacks();
      const response = await fetch(`${WP_BASE_URL}/wp/v2/packages?_embed&per_page=100`);
      if (!response.ok) return [];
      const raw = await response.json();
      const data = Array.isArray(raw) ? raw as WPResponseItem[] : [];
      return await Promise.all(data.map(async (item: WPResponseItem) => {
        const packageData = item.hm_package_data;
        const gallery = parseGallery(item?.acf?.gallery || item?.meta?.gallery || packageData?.itinerary?.map(() => '').filter(Boolean));
        let resolvedFeaturedImage = item?.featured_image_url || item?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
        if (!resolvedFeaturedImage) {
          resolvedFeaturedImage = await resolveImageValue(item?.acf?.featured_image || item?.meta?.featured_image);
        }
        const featuredImage = item?.featured_image_url || item?._embedded?.['wp:featuredmedia']?.[0]?.source_url || resolvedFeaturedImage || gallery[0] || siteImageFallbacks.package;
        const tiers = parsePricingTiers(item?.acf?.pricing_tiers || item?.meta?.pricing_tiers || packageData?.pricing_tiers);
        const duration = item?.acf?.duration || item?.meta?.duration || packageData?.days || packageData?.nights ? {
          days: Number(item?.meta?.days ?? packageData?.days ?? 7),
          nights: Number(item?.meta?.nights ?? packageData?.nights ?? 6)
        } : { days: 7, nights: 6 };
        const parsedSeo = parseSeo(item?.acf?.seo || item?.meta?.seo || {
          title: packageData?.seo_title || '',
          description: packageData?.meta_description || '',
          keywords: []
        });
        const seo = (parsedSeo.title || parsedSeo.description)
          ? parsedSeo
          : {
              title: packageData?.seo_title || item?.meta?.seo_title || '',
              description: packageData?.meta_description || item?.meta?.meta_description || '',
              keywords: []
            };
        return {
          id: String(item?.id ?? ''),
          title:
            cleanText(item?.title?.rendered || '') ||
            cleanText(item?.title?.raw || '') ||
            humanizeSlug(item?.slug || '') ||
            'Travel Package',
          slug: item?.slug || `package-${item?.id ?? 'unknown'}`,
          category: item.acf?.category || item.meta?.category || packageData?.category || 'honeymoon',
          summary: 
            cleanText(item.acf?.summary || item.meta?.summary || packageData?.summary || '') ||
            cleanText(item?.excerpt?.rendered || '') ||
            (cleanText(item?.content?.rendered || '').substring(0, 160) + '...'),
          description: cleanText(item?.content?.rendered || ''),
          experienceContent:
            parseExperienceContent(item.acf?.experience_content || item.meta?.experience_content || packageData?.intro_content) ||
            parseExperienceContent(item.acf?.experience_seo_content || item.meta?.experience_seo_content) ||
            parseExperienceContent(item.acf?.package_experience_content || item.meta?.package_experience_content),
          featuredImage,
          gallery: gallery.length > 0 ? gallery : [featuredImage],
          destinationId: parseDestinationId(item.acf?.destination_id || item.meta?.destination_id || packageData?.destination_id),
          duration: parseDuration(duration),
          tiers: tiers.length > 0
            ? tiers
            : packageData?.starting_price
              ? [{ id: 'starter', name: 'Premium' as const, price: Number(packageData.starting_price), basis: (packageData.pricing_basis as PricingBasis) || 'per couple' as const }]
              : [{ id: 'fallback-premium', name: 'Premium' as const, price: 0, basis: 'per couple' as const }],
          inclusions: parseInclusions(item.acf?.inclusions || item.meta?.inclusions),
          exclusions: parseExclusions(item.acf?.exclusions || item.meta?.exclusions || packageData?.exclusions),
          tags: parseStringList(item.acf?.tags || item.meta?.tags),
          departures: parseDepartures(item.acf?.departures || item.meta?.departures),
          seo
        };
      })).then((items) => items.filter((item) => Boolean(item.id)));
    } catch (error) {
      console.error('Error fetching packages:', error);
      return [];
    }
  },

  async updatePackage(pkg: TravelPackage): Promise<boolean> {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const ok = await checkWP();
      if (!ok) return false;
      const response = await fetch(`${WP_BASE_URL}/wp/v2/packages/${pkg.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...bearerHeaders(token)
        },
        body: JSON.stringify({
          title: pkg.title,
          acf: {
            category: pkg.category,
            summary: pkg.summary,
            experience_content: pkg.experienceContent || '',
            featured_image: pkg.featuredImage,
            gallery: pkg.gallery,
            destination_id: pkg.destinationId,
            duration: pkg.duration,
            pricing_tiers: pkg.tiers,
            inclusions: pkg.inclusions,
            exclusions: pkg.exclusions,
            tags: pkg.tags,
            departures: pkg.departures,
            seo: pkg.seo
          }
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating package:', error);
      return false;
    }
  },

  // --- Leads / Enquiries ---
  async getLeads(): Promise<Lead[]> {
    if (!WP_LEADS_READ_ENABLED) return [];

    const token = authService.getToken();
    if (!token) return [];

    try {
      const ok = await checkWP();
      if (!ok) return [];
      const response = await fetch(`${WP_BASE_URL}/wp/v2/leads?per_page=100&orderby=date&order=desc`, {
        headers: bearerHeaders(token)
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403 || response.status === 404) return [];
        return [];
      }
      return await response.json();
    } catch (error) {
      console.warn('Lead sync is unavailable in this environment:', error);
      return [];
    }
  },

  async createLead(lead: Lead): Promise<boolean> {
    try {
      const ok = await checkWP();
      if (!ok) return false;

      const leadPayload = {
        ...lead,
        // Avario endpoint keys
        packageId: lead.packageId,
        packageName: lead.packageName,
        packageTier: lead.tierName ?? '',
        departureDate: lead.departureDate,
        travelerName: lead.travelerName,
        countryOfResidence: lead.countryOfResidence,
        // Core endpoint keys
        package_id: lead.packageId,
        package_name: lead.packageName,
        package_tier: lead.tierName ?? '',
        departure_date: lead.departureDate,
        traveler_name: lead.travelerName,
        country_of_residence: lead.countryOfResidence,
        source_url: window.location.href
      };

      const parsedEndpoints = WP_PUBLIC_LEAD_ENDPOINTS
        .split(',')
        .map((value: string) => value.trim())
        .filter(Boolean);
      const publicEndpoints = Array.from(new Set([
        ...parsedEndpoints,
        WP_PUBLIC_LEAD_ENDPOINT,
        '/custom/v1/leads',
        '/honeymooner/v1/leads'
      ]));

      for (const endpoint of publicEndpoints) {
        const publicResponse = await fetch(`${WP_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload)
        });

        if (publicResponse.ok) {
          return true;
        }

        const publicError = await publicResponse.text();
        console.warn('Public lead endpoint failed, trying next endpoint:', {
          endpoint,
          status: publicResponse.status,
          body: publicError
        });
      }

      const token = authService.getToken();
      if (!token) {
        return false;
      }

      const response = await fetch(`${WP_BASE_URL}/wp/v2/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...bearerHeaders(token)
        },
        body: JSON.stringify({
          title: `New Enquiry from ${lead.travelerName}`,
          status: 'publish',
          acf: lead
        })
      });

      if (!response.ok) {
        const fallbackError = await response.text();
        console.error('Authenticated lead creation failed:', {
          status: response.status,
          body: fallbackError
        });
      }

      return response.ok;
    } catch (error) {
      console.error('Error creating lead:', error);
      return false;
    }
  },

  async getPackageReviews(packageSlug?: string): Promise<PackageReview[]> {
    try {
      const ok = await checkWP();
      if (!ok) {
        return packageSlug
          ? FALLBACK_PACKAGE_REVIEWS.filter((review) => review.packageSlug === packageSlug)
          : FALLBACK_PACKAGE_REVIEWS;
      }

      const query = packageSlug ? `?per_page=50&package_slug=${encodeURIComponent(packageSlug)}` : '?per_page=50';
      const response = await fetch(`${WP_BASE_URL}${WP_PACKAGE_REVIEWS_ENDPOINT}${query}`);
      if (!response.ok) {
        return packageSlug
          ? FALLBACK_PACKAGE_REVIEWS.filter((review) => review.packageSlug === packageSlug)
          : FALLBACK_PACKAGE_REVIEWS;
      }

      const data = await response.json() as WPReviewItem[];
      if (!Array.isArray(data) || data.length === 0) {
        return packageSlug
          ? FALLBACK_PACKAGE_REVIEWS.filter((review) => review.packageSlug === packageSlug)
          : FALLBACK_PACKAGE_REVIEWS;
      }

      return data.map((item) => ({
        id: String(item.id),
        packageId: String(item.acf?.package_id || ''),
        packageSlug: item.acf?.package_slug || '',
        packageTitle: item.acf?.package_title || '',
        reviewerName: item.acf?.reviewer_name || cleanText(item.title?.rendered || 'Guest'),
        reviewerEmail: item.acf?.reviewer_email || '',
        rating: Number(item.acf?.rating || 5),
        message: cleanText(item.content?.rendered || ''),
        createdAt: item.date
      })).filter((review) => !packageSlug || review.packageSlug === packageSlug || review.packageId === packageSlug);
    } catch (error) {
      console.error('Error fetching package reviews:', error);
      return packageSlug
        ? FALLBACK_PACKAGE_REVIEWS.filter((review) => review.packageSlug === packageSlug)
        : FALLBACK_PACKAGE_REVIEWS;
    }
  },

  async createPackageReview(review: {
    packageId: string;
    packageSlug: string;
    packageTitle: string;
    reviewerName: string;
    reviewerEmail: string;
    rating: number;
    message: string;
  }): Promise<boolean> {
    try {
      const ok = await checkWP();
      if (!ok) return false;

      const response = await fetch(`${WP_BASE_URL}${WP_PACKAGE_REVIEWS_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Package review endpoint rejected request:', {
          status: response.status,
          body: errorBody
        });
      }

      return response.ok;
    } catch (error) {
      console.error('Error creating package review:', error);
      return false;
    }
  },

  // --- Journal / Blog ---
  async getPosts(): Promise<BlogPost[]> {
    try {
      const ok = await checkWP();
      if (!ok) return [];
      const siteImageFallbacks = await getSiteImageFallbacks();
      const testimonialsCategoryId = await getCategoryIdBySlug('testimonials');
      const categoriesExclude = testimonialsCategoryId ? `&categories_exclude=${testimonialsCategoryId}` : '';
      const response = await fetch(`${WP_BASE_URL}/wp/v2/posts?_embed&per_page=20${categoriesExclude}`);
      if (!response.ok) return [];
      const data = await response.json() as WPResponseItem[];
      return data.map((item) => ({
        id: item.id.toString(),
        title: cleanText(item.title?.rendered || ''),
        excerpt: `${cleanText(item.excerpt?.rendered || '').substring(0, 160)}...`,
        category: cleanText(item._embedded?.['wp:term']?.[0]?.[0]?.name || 'Travel'),
        author: cleanText(item._embedded?.author?.[0]?.name || 'The Honeymooner Travel'),
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || siteImageFallbacks.general,
        readTime: '8 min read',
        slug: item.slug,
        content: item.content?.rendered || ''
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const ok = await checkWP();
      if (!ok) return FALLBACK_TESTIMONIALS;
      const siteImageFallbacks = await getSiteImageFallbacks();

      const categoryId = await getCategoryIdBySlug('testimonials');
      if (!categoryId) return FALLBACK_TESTIMONIALS;

      const response = await fetch(`${WP_BASE_URL}/wp/v2/posts?_embed&per_page=20&categories=${categoryId}`);
      if (!response.ok) return FALLBACK_TESTIMONIALS;

      const data = await response.json() as WPResponseItem[];

      if (!Array.isArray(data) || data.length === 0) {
        return FALLBACK_TESTIMONIALS;
      }

      return data.map((item) => {
        const meta = parseTestimonialMeta(item.content?.rendered || '');
        const quote = cleanText(item.excerpt?.rendered || '');
        const story = cleanText((item.content?.rendered || '').replace(/<!--\s*hm_testimonial_meta:[\s\S]*?-->/, ''));
        return {
          id: item.id.toString(),
          coupleName: cleanText(item.title?.rendered || 'Anonymous Couple'),
          location: cleanText(meta.location || ''),
          destination: cleanText(meta.destination || ''),
          quote,
          story,
          image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || siteImageFallbacks.testimonial,
          rating: Number(meta.rating || 5),
          date: meta.date || new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
      });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return FALLBACK_TESTIMONIALS;
    }
  },

  async getHomeContent(): Promise<HomeContent | null> {
    try {
      const ok = await checkWP();
      if (!ok) return null;
      const siteImageFallbacks = await getSiteImageFallbacks();
      const response = await fetch(`${WP_BASE_URL}/wp/v2/pages?slug=home-settings&per_page=1`);
      if (!response.ok) return null;
      const data = await response.json() as WPPageItem[];
      const page = data[0];
      
      // If the page doesn't exist or doesn't have the expected plugin data, return null
      if (!page) return null;

      // Prefer plugin's featured content hero image if available, else fallback to ACF, else fallback image
      const heroImage = (page.hm_featured_content && page.hm_featured_content.hero_image)
        || await resolveImageValue(page.acf?.hero_image)
        || '';
      const giftImage = page.acf ? await resolveImageValue(page.acf.gift_image) : '';
      const [styleBeachImage, styleIslandImage, styleAdventureImage, styleCityImage] = page.acf ? await Promise.all([
        resolveImageValue(page.acf.browse_style_beach_image),
        resolveImageValue(page.acf.browse_style_island_image),
        resolveImageValue(page.acf.browse_style_adventure_image),
        resolveImageValue(page.acf.browse_style_city_image)
      ]) : ['', '', '', ''];

      const fallbackHomeContent: HomeContent = {
        styleImages: {
          beach: ASSETS.HOME_EXPERIENCES.BEACH,
          island: ASSETS.HOME_EXPERIENCES.ISLAND,
          adventure: ASSETS.HOME_EXPERIENCES.ADVENTURE,
          city: ASSETS.HOME_EXPERIENCES.CITY
        },
        hero: {
          title: 'Plan a Once-in-a-Lifetime Honeymoon - Without the Stress',
          subtitle: 'We design fully personalized luxury honeymoon experiences - from destination selection to every intimate detail.',
          image: siteImageFallbacks.hero,
          cta: {
            label: 'Start Planning Your Honeymoon',
            url: '/booking'
          }
        },
        destinations: {
          title: 'Where Do You Want to Begin?',
          subtitle: "Choose from the world's most romantic destinations - curated for unforgettable experiences.",
          description: "Our handpicked collection of the world's most romantic escapes, designed for couples who seek more than just a trip."
        },
        packages: {
          title: 'Leave Where Your New Life Begins',
          subtitle: 'Signature Packages',
          description: "We don't just plan trips - we design deeply personal honeymoon experiences that reflect your story, your pace, and your idea of romance."
        },
        fallbackImages: siteImageFallbacks,
        giftPackage: {
          eyebrow: 'For Families of Newlyweds',
          title: 'Honeymoon Gift Package',
          description: 'Gift your children a stress-free, unforgettable honeymoon experience.',
          note: 'A meaningful wedding gift with expert planning, curated stays, and full support from start to finish.',
          image: ASSETS.FALLBACK_PACKAGE,
          imageAlt: 'Parents gifting honeymoon package',
          primaryCtaLabel: 'View Packages',
          primaryCtaUrl: '/packages',
          secondaryCtaLabel: 'Start Planning',
          secondaryCtaUrl: '/booking'
        }
      };

      const pick = (value: string | undefined, fallback: string) => {
        const cleaned = cleanText(value || '');
        return cleaned || fallback;
      };

      return {
        hero: {
          title: pick(page.hm_featured_content?.hero_title || page.acf?.hero_title, fallbackHomeContent.hero.title),
          subtitle: pick(page.hm_featured_content?.hero_subtitle || page.acf?.hero_subtitle, fallbackHomeContent.hero.subtitle),
          image: heroImage || fallbackHomeContent.hero.image,
          cta: {
            label: pick(page.hm_featured_content?.cta1_label || page.acf?.hero_cta, fallbackHomeContent.hero.cta.label),
            url: page.hm_featured_content?.cta1_url || '/booking'
          },
          cta2: page.hm_featured_content?.cta2_label ? {
            label: page.hm_featured_content.cta2_label,
            url: page.hm_featured_content.cta2_url || '/packages'
          } : undefined
        },
        destinations: {
          title: pick(page.acf?.destinations_title, fallbackHomeContent.destinations.title),
          subtitle: pick(page.acf?.destinations_subtitle, fallbackHomeContent.destinations.subtitle),
          description: pick(page.acf?.destinations_description, fallbackHomeContent.destinations.description),
          featuredDestinationIds: (page.hm_featured_content?.featured_destination_ids || []).map((id: number) => String(id))
        },
        packages: {
          title: pick(page.acf?.packages_title, fallbackHomeContent.packages.title),
          subtitle: pick(page.acf?.packages_subtitle, fallbackHomeContent.packages.subtitle),
          description: pick(page.acf?.packages_description, fallbackHomeContent.packages.description)
        },
        styleImages: {
          beach: styleBeachImage || fallbackHomeContent.styleImages.beach,
          island: styleIslandImage || fallbackHomeContent.styleImages.island,
          adventure: styleAdventureImage || fallbackHomeContent.styleImages.adventure,
          city: styleCityImage || fallbackHomeContent.styleImages.city
        },
        fallbackImages: siteImageFallbacks,
        giftPackage: {
          eyebrow: pick(page.acf?.gift_eyebrow, fallbackHomeContent.giftPackage.eyebrow),
          title: pick(page.acf?.gift_title, fallbackHomeContent.giftPackage.title),
          description: pick(page.acf?.gift_description, fallbackHomeContent.giftPackage.description),
          note: pick(page.acf?.gift_note, fallbackHomeContent.giftPackage.note),
          image: giftImage || fallbackHomeContent.giftPackage.image,
          imageAlt: pick(page.acf?.gift_image_alt, fallbackHomeContent.giftPackage.imageAlt),
          primaryCtaLabel: pick(page.acf?.gift_primary_cta_label, fallbackHomeContent.giftPackage.primaryCtaLabel),
          primaryCtaUrl: pick(page.acf?.gift_primary_cta_url, fallbackHomeContent.giftPackage.primaryCtaUrl),
          secondaryCtaLabel: pick(page.acf?.gift_secondary_cta_label, fallbackHomeContent.giftPackage.secondaryCtaLabel),
          secondaryCtaUrl: pick(page.acf?.gift_secondary_cta_url, fallbackHomeContent.giftPackage.secondaryCtaUrl)
        }
      };
    } catch (error) {
      console.error('Error fetching home content:', error);
      return null;
    }
  },

  async getBookingContent(): Promise<BookingContent | null> {
    try {
      const ok = await checkWP();
      if (!ok) return null;
      const response = await fetch(`${WP_BASE_URL}/wp/v2/pages?slug=booking-settings&per_page=1`);
      if (!response.ok) return null;
      const data = await response.json() as WPPageItem[];
      const page = data[0];
      if (!page?.acf) return null;

      const fallback: BookingContent = {
        hero: {
          eyebrow: 'The First Step',
          title: 'Plan Your Dream Escape',
          description: 'Fill out the form below and our specialists will create a personalized itinerary for your trip.'
        },
        success: {
          title: 'Enquiry Received!',
          message: 'Thank you for reaching out to The Honeymooner Travel. Our romantic travel specialist will contact you via WhatsApp or Email within the next 24 hours to begin planning your dream escape.',
          cta: 'Return Home'
        },
        bespoke: {
          title: 'Your Vision, Our Craftsmanship.',
          description: 'A bespoke itinerary tailored to your travel goals and preferences.',
          features: [
            'Fully customizable itinerary',
            'Private, hand-picked locations',
            'Dedicated travel designer',
            'Ultra-exclusive experiences'
          ],
          budgetOptions: [
            '$5,000 - $10,000',
            '$10,000 - $25,000',
            '$25,000 - $50,000',
            '$50,000+'
          ]
        },
        packageBenefits: [
          'Complimentary Consultation',
          'Customized Itinerary Planning',
          '24/7 Travel Assistance'
        ],
        fallbackInfo: {
          title: 'Expertly Crafted Honeymoon Experiences',
          description: 'Our specialists have traveled to every destination we recommend. We know the best suites, the most private beaches, and the hidden spots that make a trip truly romantic.',
          satisfactionTitle: '98% Satisfaction',
          satisfactionSubtitle: 'Couples rated 5-stars'
        },
        consultation: {
          title: 'Need help choosing?',
          description: "If you're not sure which package is right for you, book a free consultation call and we'll help you decide.",
          cta: 'Book a call'
        },
        labels: {
          package: 'Select Package',
          tier: 'Experience Level',
          departureDate: 'Departure Date',
          country: 'Country of Residence',
          travellers: 'Travellers',
          adults: 'Adults',
          children: 'Kids',
          specialRequests: 'Special Requests',
          submit: 'Submit Enquiry',
          submitting: 'Processing...',
          loading: 'Preparing your itinerary...',
          occasion: 'The Occasion',
          packagePlaceholder: 'Choose a package...',
          tierPlaceholder: 'Choose experience...'
        }
      };

      const pick = (value: string | undefined, fallbackValue: string) => {
        const cleaned = cleanText(value || '');
        return cleaned || fallbackValue;
      };

      return {
        hero: {
          eyebrow: pick(page.acf.booking_hero_eyebrow, fallback.hero.eyebrow),
          title: pick(page.acf.booking_hero_title, fallback.hero.title),
          description: pick(page.acf.booking_hero_description, fallback.hero.description)
        },
        success: {
          title: pick(page.acf.booking_success_title, fallback.success.title),
          message: pick(page.acf.booking_success_message, fallback.success.message),
          cta: pick(page.acf.booking_success_cta, fallback.success.cta)
        },
        bespoke: {
          title: pick(page.acf.booking_bespoke_title, fallback.bespoke.title),
          description: pick(page.acf.booking_bespoke_description, fallback.bespoke.description),
          features: parseStringList(page.acf.booking_bespoke_features).length > 0
            ? parseStringList(page.acf.booking_bespoke_features)
            : fallback.bespoke.features,
          budgetOptions: parseStringList(page.acf.booking_bespoke_budget_options).length > 0
            ? parseStringList(page.acf.booking_bespoke_budget_options)
            : fallback.bespoke.budgetOptions
        },
        packageBenefits: parseStringList(page.acf.booking_package_benefits).length > 0
          ? parseStringList(page.acf.booking_package_benefits)
          : fallback.packageBenefits,
        fallbackInfo: {
          title: pick(page.acf.booking_fallback_title, fallback.fallbackInfo.title),
          description: pick(page.acf.booking_fallback_description, fallback.fallbackInfo.description),
          satisfactionTitle: pick(page.acf.booking_fallback_satisfaction_title, fallback.fallbackInfo.satisfactionTitle),
          satisfactionSubtitle: pick(page.acf.booking_fallback_satisfaction_subtitle, fallback.fallbackInfo.satisfactionSubtitle)
        },
        consultation: {
          title: pick(page.acf.booking_consultation_title, fallback.consultation.title),
          description: pick(page.acf.booking_consultation_description, fallback.consultation.description),
          cta: pick(page.acf.booking_consultation_cta, fallback.consultation.cta)
        },
        labels: {
          package: pick(page.acf.booking_label_package, fallback.labels.package),
          tier: pick(page.acf.booking_label_tier, fallback.labels.tier),
          departureDate: pick(page.acf.booking_label_departure_date, fallback.labels.departureDate),
          country: pick(page.acf.booking_label_country, fallback.labels.country),
          travellers: pick(page.acf.booking_label_travellers, fallback.labels.travellers),
          adults: pick(page.acf.booking_label_adults, fallback.labels.adults),
          children: pick(page.acf.booking_label_children, fallback.labels.children),
          specialRequests: pick(page.acf.booking_label_special_requests, fallback.labels.specialRequests),
          submit: pick(page.acf.booking_label_submit, fallback.labels.submit),
          submitting: pick(page.acf.booking_label_submitting, fallback.labels.submitting),
          loading: pick(page.acf.booking_label_loading, fallback.labels.loading),
          occasion: pick(page.acf.booking_label_occasion, fallback.labels.occasion),
          packagePlaceholder: pick(page.acf.booking_placeholder_package, fallback.labels.packagePlaceholder),
          tierPlaceholder: pick(page.acf.booking_placeholder_tier, fallback.labels.tierPlaceholder)
        }
      };
    } catch (error) {
      console.error('Error fetching booking content:', error);
      return null;
    }
  },

  // --- Wishlist Sync ---
  async getWishlist(): Promise<string[]> {
    const token = authService.getToken();
    if (!token) return [];

    try {
      const ok = await checkWP();
      if (!ok) return [];
      const response = await fetch(`${WP_BASE_URL}/wp/v2/users/me`, {
        headers: bearerHeaders(token)
      });
      if (!response.ok) return [];
      const data = await response.json() as { acf?: { hm_wishlist?: unknown } };
      return normalizeWishlistItems(data.acf?.hm_wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  },

  async createContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<boolean> {
    try {
      const ok = await checkWP();
      if (!ok) return false;

      const response = await fetch(`${WP_BASE_URL}${WP_CONTACT_MESSAGES_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Contact message endpoint rejected request:', {
          status: response.status,
          body: errorBody
        });
      }

      return response.ok;
    } catch (error) {
      console.error('Error creating contact message:', error);
      return false;
    }
  },

  async updateWishlist(items: string[]): Promise<boolean> {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const ok = await checkWP();
      if (!ok) return false;
      const response = await fetch(`${WP_BASE_URL}/wp/v2/users/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...bearerHeaders(token)
        },
        body: JSON.stringify({
          acf: { hm_wishlist: normalizeWishlistItems(items) }
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating wishlist:', error);
      return false;
    }
  },

  // --- Route Ideas ---
  async getRouteIdeas(): Promise<RouteIdea[]> {
    try {
      const ok = await checkWP();
      if (!ok) return [];
      const response = await fetch(`${WP_BASE_URL}/wp/v2/route_ideas?_embed&per_page=100&_=${Date.now()}`);
      if (!response.ok) return [];
      const data = await response.json() as (WPResponseItem & { hm_route_data?: Record<string, unknown> })[];
      return data.map((item) => {
        const routeData = item.hm_route_data || {};
        return {
          id: String(item.id),
          slug: item.slug,
          title: cleanText(String(routeData.title_override || item.title?.rendered || '')),
          eyebrow: cleanText(String(routeData.eyebrow || '')),
          tagline: cleanText(String(routeData.tagline || '')),
          intro: cleanText(String(routeData.intro || '')),
          audience: cleanText(String(routeData.audience || '')),
          heroImage: String(routeData.hero_image || ''),
          destinations: normalizeStringArray(routeData.destinations),
          highlights: normalizeStringArray(routeData.highlights),
          routeStops: normalizeStringArray(routeData.route_stops),
          match: {
            categories: normalizeStringArray(routeData.match_categories),
            countries: normalizeStringArray(routeData.match_countries),
            destinations: normalizeStringArray(routeData.match_destinations),
            tags: normalizeStringArray(routeData.match_tags)
          }
        };
      });
    } catch (error) {
      console.error('Error fetching route ideas:', error);
      return [];
    }
  }
};
