import { authService } from './authService';
import type { 
  Destination, 
  TravelPackage, 
  Lead, 
  BlogPost, 
  Continent, 
  PackageCategory,
  PricingTier,
  PackageInclusion,
  Departure
} from '../types';

const WP_BASE_URL = import.meta.env.VITE_WP_BASE_URL ?? 'https://concise.ng/honeymooner/wp-json';
const WP_SYNC_ENABLED = (import.meta.env.VITE_WP_SYNC_ENABLED ?? 'false') === 'true';

let wpReachable: boolean | null = null;

function bearerHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`
  };
}

async function checkWP(): Promise<boolean> {
  if (!WP_SYNC_ENABLED) {
    wpReachable = false;
    return false;
  }
  if (wpReachable !== null) return wpReachable;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${WP_BASE_URL}`, { signal: controller.signal });
    clearTimeout(timeout);
    wpReachable = res.ok;
    return wpReachable;
  } catch {
    wpReachable = false;
    return false;
  }
}

interface WPResponseItem {
  id: number;
  title: { rendered: string };
  slug: string;
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  acf?: {
    country?: string;
    continent?: Continent;
    image?: string;
    category?: PackageCategory;
    summary?: string;
    featured_image?: string;
    gallery?: string[];
    destination_id?: string;
    duration?: { days: number; nights: number };
    pricing_tiers?: PricingTier[];
    inclusions?: PackageInclusion[];
    exclusions?: string[];
    tags?: string[];
    departures?: Departure[];
    seo?: { title: string; description: string; keywords: string[] };
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<Array<{ name: string }>>;
    'author'?: Array<{ name: string }>;
  };
}

export const dataService = {
  checkWP,
  // --- Destinations ---
  async getDestinations(): Promise<Destination[]> {
    try {
      const ok = await checkWP();
      if (!ok) return [];
      const response = await fetch(`${WP_BASE_URL}/wp/v2/destinations?_embed&per_page=100`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.map((item: WPResponseItem) => ({
        id: item.id.toString(),
        name: item.title.rendered,
        country: item.acf?.country || '',
        continent: item.acf?.continent || 'Africa',
        description: item.content.rendered,
        image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || item.acf?.image || '',
        slug: item.slug
      }));
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
      const response = await fetch(`${WP_BASE_URL}/wp/v2/packages?_embed&per_page=100`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.map((item: WPResponseItem) => ({
        id: item.id.toString(),
        title: item.title.rendered,
        slug: item.slug,
        category: item.acf?.category || 'honeymoon',
        summary: item.acf?.summary || '',
        description: item.content.rendered,
        featuredImage: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || item.acf?.featured_image || '',
        gallery: item.acf?.gallery || [],
        destinationId: item.acf?.destination_id || '',
        duration: item.acf?.duration || { days: 7, nights: 6 },
        tiers: item.acf?.pricing_tiers || [],
        inclusions: item.acf?.inclusions || [],
        exclusions: item.acf?.exclusions || [],
        tags: item.acf?.tags || [],
        departures: item.acf?.departures || [],
        seo: item.acf?.seo || { title: '', description: '', keywords: [] }
      }));
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
    const token = authService.getToken();
    if (!token) return [];

    try {
      const ok = await checkWP();
      if (!ok) return [];
      const response = await fetch(`${WP_BASE_URL}/wp/v2/leads?per_page=100`, {
        headers: bearerHeaders(token)
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  async createLead(lead: Lead): Promise<boolean> {
    try {
      const ok = await checkWP();
      if (!ok) return true;
      const response = await fetch(`${WP_BASE_URL}/wp/v2/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `New Enquiry from ${lead.travelerName}`,
          status: 'publish',
          acf: lead
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Error creating lead:', error);
      return false;
    }
  },

  // --- Journal / Blog ---
  async getPosts(): Promise<BlogPost[]> {
    try {
      const ok = await checkWP();
      if (!ok) return [];
      const response = await fetch(`${WP_BASE_URL}/wp/v2/posts?_embed&per_page=20`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.map((item: WPResponseItem) => ({
        id: item.id.toString(),
        title: item.title.rendered,
        excerpt: item.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...',
        category: item._embedded?.['wp:term']?.[0]?.[0]?.name || 'Travel',
        author: item._embedded?.author?.[0]?.name || 'The Honeymooner',
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57',
        readTime: '8 min read',
        slug: item.slug,
        content: item.content.rendered
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
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
      const data = await response.json();
      return data.acf?.hm_wishlist || [];
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
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
          acf: { hm_wishlist: items }
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating wishlist:', error);
      return false;
    }
  }
};
