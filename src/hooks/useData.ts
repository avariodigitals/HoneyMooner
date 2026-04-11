import { useState, useEffect } from 'react';
import type { Destination, TravelPackage, Lead, Testimonial, BlogPost, HomeContent, BookingContent } from '../types';
import { dataService } from '../services/dataService';
import { initialPosts, initialTestimonials } from '../data/mock';
import { ASSETS } from '../config/images';

const PLACEHOLDER_IMAGE_PATH = '/images/placeholder-travel.svg';

const defaultHomeContent: HomeContent = {
  fallbackImages: {
    hero: ASSETS.FALLBACK_HERO,
    package: ASSETS.FALLBACK_PACKAGE,
    destination: ASSETS.FALLBACK_DESTINATION,
    testimonial: ASSETS.TESTIMONIALS.SARAH,
    general: ASSETS.PLACEHOLDER_GENERAL
  },
  styleImages: {
    beach: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1507525428034-b723cf961d3e-scaled.jpg',
    island: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1439066615861-d1af74d74000-scaled.jpg',
    adventure: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1464822759023-fed622ff2c3b-scaled.jpg',
    city: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1502602898657-3e91760cbb34-2-scaled.jpg'
  },
  hero: {
    title: "Plan a Once-in-a-Lifetime Honeymoon — Without the Stress",
    subtitle: "We design fully personalized luxury honeymoon experiences — from destination selection to every intimate detail.",
    image: "https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/homepage-default-hero-2.jpg",
    cta: "Start Planning Your Honeymoon"
  },
  destinations: {
    title: "Where Do You Want to Begin?",
    subtitle: "Choose from the world’s most romantic destinations — curated for unforgettable experiences.",
    description: "Our handpicked collection of the world's most romantic escapes, designed for couples who seek more than just a trip."
  },
  packages: {
    title: "Leave Where Your New Life Begins",
    subtitle: "Signature Packages",
    description: "We don’t just plan trips — we design deeply personal honeymoon experiences that reflect your story, your pace, and your idea of romance."
  },
  giftPackage: {
    eyebrow: 'For Families of Newlyweds',
    title: 'Honeymoon Gift Package',
    description: 'Gift your children a stress-free, unforgettable honeymoon experience.',
    note: 'A meaningful wedding gift with expert planning, curated stays, and full support from start to finish.',
    image: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/khamkeo-OcxlTBbb6SY-unsplash.jpg',
    imageAlt: 'Parents gifting honeymoon package',
    primaryCtaLabel: 'View Packages',
    primaryCtaUrl: '/packages',
    secondaryCtaLabel: 'Start Planning',
    secondaryCtaUrl: '/booking'
  }
};

const defaultBookingContent: BookingContent = {
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

type DataSnapshot = {
  packages: TravelPackage[];
  destinations: Destination[];
  leads: Lead[];
  testimonials: Testimonial[];
  homeContent: HomeContent;
  bookingContent: BookingContent;
  posts: BlogPost[];
};

const SNAPSHOT_STORAGE_KEY = 'honeymoonner:data-snapshot:v1';
const CORE_REFRESH_INTERVAL_MS = 60 * 1000;
const SECONDARY_REFRESH_INTERVAL_MS = 2 * 60 * 1000;

function isPlaceholderImage(url?: string): boolean {
  return !url || url.trim().length === 0 || url.includes(PLACEHOLDER_IMAGE_PATH);
}

function normalizeImage(url: string | undefined, fallback: string): string {
  return isPlaceholderImage(url) ? fallback : (url as string);
}

function sanitizeHomeContent(content: HomeContent): HomeContent {
  return {
    ...content,
    fallbackImages: {
      hero: normalizeImage(content.fallbackImages?.hero, defaultHomeContent.fallbackImages.hero),
      package: normalizeImage(content.fallbackImages?.package, defaultHomeContent.fallbackImages.package),
      destination: normalizeImage(content.fallbackImages?.destination, defaultHomeContent.fallbackImages.destination),
      testimonial: normalizeImage(content.fallbackImages?.testimonial, defaultHomeContent.fallbackImages.testimonial),
      general: normalizeImage(content.fallbackImages?.general, defaultHomeContent.fallbackImages.general)
    },
    hero: {
      ...content.hero,
      image: normalizeImage(content.hero?.image, defaultHomeContent.hero.image)
    },
    giftPackage: {
      ...content.giftPackage,
      image: normalizeImage(content.giftPackage?.image, defaultHomeContent.giftPackage.image)
    },
    styleImages: {
      beach: normalizeImage(content.styleImages?.beach, defaultHomeContent.styleImages.beach),
      island: normalizeImage(content.styleImages?.island, defaultHomeContent.styleImages.island),
      adventure: normalizeImage(content.styleImages?.adventure, defaultHomeContent.styleImages.adventure),
      city: normalizeImage(content.styleImages?.city, defaultHomeContent.styleImages.city)
    }
  };
}

function sanitizeSnapshot(snapshot: DataSnapshot): DataSnapshot {
  const homeContent = sanitizeHomeContent(snapshot.homeContent || defaultHomeContent);
  const destinationFallback = homeContent.fallbackImages.destination;
  const packageFallback = homeContent.fallbackImages.package;
  const testimonialFallback = homeContent.fallbackImages.testimonial;
  const generalFallback = homeContent.fallbackImages.general;

  return {
    ...snapshot,
    homeContent,
    destinations: snapshot.destinations.map((destination) => ({
      ...destination,
      image: normalizeImage(destination.image, destinationFallback)
    })),
    packages: snapshot.packages.map((pkg) => ({
      ...pkg,
      featuredImage: normalizeImage(pkg.featuredImage, packageFallback),
      gallery: Array.isArray(pkg.gallery)
        ? pkg.gallery.map((image) => normalizeImage(image, packageFallback))
        : [packageFallback]
    })),
    testimonials: snapshot.testimonials.map((testimonial) => ({
      ...testimonial,
      image: normalizeImage(testimonial.image, testimonialFallback)
    })),
    posts: snapshot.posts.map((post) => ({
      ...post,
      image: normalizeImage(post.image, generalFallback)
    }))
  };
}

function persistSnapshot(snapshot: DataSnapshot): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore localStorage write failures (e.g., private mode / quota).
  }
}

function loadPersistedSnapshot(): DataSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DataSnapshot>;
    if (!parsed || typeof parsed !== 'object') return null;

    return sanitizeSnapshot({
      ...initialSnapshot,
      ...parsed,
      packages: Array.isArray(parsed.packages) ? parsed.packages : initialSnapshot.packages,
      destinations: Array.isArray(parsed.destinations) ? parsed.destinations : initialSnapshot.destinations,
      leads: Array.isArray(parsed.leads) ? parsed.leads : initialSnapshot.leads,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : initialSnapshot.testimonials,
      posts: Array.isArray(parsed.posts) ? parsed.posts : initialSnapshot.posts,
      homeContent: parsed.homeContent || initialSnapshot.homeContent,
      bookingContent: parsed.bookingContent || initialSnapshot.bookingContent
    });
  } catch {
    return null;
  }
}

const initialSnapshot: DataSnapshot = {
  packages: [],
  destinations: [],
  leads: [],
  testimonials: initialTestimonials,
  homeContent: defaultHomeContent,
  bookingContent: defaultBookingContent,
  posts: initialPosts
};

const emptySnapshot: DataSnapshot = initialSnapshot;
const persistedSnapshot = loadPersistedSnapshot();

let cachedSnapshot: DataSnapshot | null = persistedSnapshot || sanitizeSnapshot(initialSnapshot);
let coreResolved = false;
let secondaryResolved = false;
let inflightCorePromise: Promise<DataSnapshot> | null = null;
let inflightSecondaryPromise: Promise<DataSnapshot> | null = null;
let lastCoreSyncAt = 0;
let lastSecondarySyncAt = 0;

function getCurrentSnapshot(): DataSnapshot {
  return cachedSnapshot || sanitizeSnapshot(emptySnapshot);
}

function hasCoreContent(snapshot: DataSnapshot): boolean {
  return snapshot.destinations.length > 0 || snapshot.packages.length > 0;
}

async function ensureCoreSnapshot(options?: { force?: boolean }): Promise<DataSnapshot> {
  const force = options?.force === true;
  const isFresh = Date.now() - lastCoreSyncAt < CORE_REFRESH_INTERVAL_MS;
  if (!force && coreResolved && cachedSnapshot && isFresh) return cachedSnapshot;
  if (inflightCorePromise) return inflightCorePromise;

  inflightCorePromise = (async () => {
    let shouldResolveCore = true;
    try {
      const [wpDestinations, wpPackages, wpHomeContent, wpBookingContent] = await Promise.all([
        dataService.getDestinations(),
        dataService.getPackages(),
        dataService.getHomeContent(),
        dataService.getBookingContent()
      ]);

      const current = getCurrentSnapshot();
      const nextDestinations = wpDestinations;
      const nextPackages = wpPackages;
      const nextHomeContent = wpHomeContent || current.homeContent || defaultHomeContent;
      const nextBookingContent = wpBookingContent || current.bookingContent || defaultBookingContent;

      const snapshot: DataSnapshot = {
        ...current,
        destinations: nextDestinations,
        packages: nextPackages,
        homeContent: nextHomeContent,
        bookingContent: nextBookingContent
      };
      const sanitizedSnapshot = sanitizeSnapshot(snapshot);

      // If this fetch yielded no core data and we had no previous core data, allow future retry.
      if (!hasCoreContent(sanitizedSnapshot)) {
        shouldResolveCore = false;
      }

      cachedSnapshot = sanitizedSnapshot;
      lastCoreSyncAt = Date.now();
      persistSnapshot(sanitizedSnapshot);
      return sanitizedSnapshot;
    } catch (error) {
      console.error('Failed to sync with WordPress:', error);
      const current = getCurrentSnapshot();
      const snapshot: DataSnapshot = hasCoreContent(current)
        ? current
        : {
            ...current,
            destinations: [],
            packages: [],
            homeContent: current.homeContent || defaultHomeContent,
            bookingContent: current.bookingContent || defaultBookingContent
          };
      const sanitizedSnapshot = sanitizeSnapshot(snapshot);
      if (!hasCoreContent(sanitizedSnapshot)) {
        shouldResolveCore = false;
      }
      cachedSnapshot = sanitizedSnapshot;
      lastCoreSyncAt = Date.now();
      persistSnapshot(sanitizedSnapshot);
      return sanitizedSnapshot;
    } finally {
      coreResolved = shouldResolveCore;
      inflightCorePromise = null;
    }
  })();

  return inflightCorePromise;
}

async function ensureSecondarySnapshot(options?: { force?: boolean }): Promise<DataSnapshot> {
  const force = options?.force === true;
  const isFresh = Date.now() - lastSecondarySyncAt < SECONDARY_REFRESH_INTERVAL_MS;
  if (!force && secondaryResolved && cachedSnapshot && isFresh) return cachedSnapshot;
  if (inflightSecondaryPromise) return inflightSecondaryPromise;

  inflightSecondaryPromise = (async () => {
    let shouldResolveSecondary = true;
    try {
      const [wpPosts, wpLeads, wpTestimonials] = await Promise.all([
        dataService.getPosts(),
        dataService.getLeads(),
        dataService.getTestimonials()
      ]);

      const current = getCurrentSnapshot();

      const snapshot: DataSnapshot = {
        ...current,
        posts: wpPosts.length > 0 ? wpPosts : current.posts,
        leads: wpLeads.length > 0 ? wpLeads : current.leads,
        testimonials: wpTestimonials.length > 0 ? wpTestimonials : current.testimonials
      };
      const sanitizedSnapshot = sanitizeSnapshot(snapshot);
      cachedSnapshot = sanitizedSnapshot;
      lastSecondarySyncAt = Date.now();
      persistSnapshot(sanitizedSnapshot);
      return sanitizedSnapshot;
    } catch (error) {
      console.error('Failed to sync secondary WordPress data:', error);
      const snapshot: DataSnapshot = sanitizeSnapshot(getCurrentSnapshot());
      if (snapshot.posts.length === 0 && snapshot.leads.length === 0 && snapshot.testimonials.length === 0) {
        shouldResolveSecondary = false;
      }
      cachedSnapshot = snapshot;
      lastSecondarySyncAt = Date.now();
      persistSnapshot(snapshot);
      return snapshot;
    } finally {
      secondaryResolved = shouldResolveSecondary;
      inflightSecondaryPromise = null;
    }
  })();

  return inflightSecondaryPromise;
}

export const useData = () => {
  const [packages, setPackages] = useState<TravelPackage[]>(getCurrentSnapshot().packages);
  const [destinations, setDestinations] = useState<Destination[]>(getCurrentSnapshot().destinations);
  const [leads, setLeads] = useState<Lead[]>(getCurrentSnapshot().leads);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(getCurrentSnapshot().testimonials);
  const [homeContent, setHomeContent] = useState<HomeContent>(getCurrentSnapshot().homeContent);
  const [bookingContent, setBookingContent] = useState<BookingContent>(getCurrentSnapshot().bookingContent);
  const [posts, setPosts] = useState<BlogPost[]>(getCurrentSnapshot().posts);
  const [isLoading, setIsLoading] = useState(!hasCoreContent(getCurrentSnapshot()));
  const [isSecondaryLoading, setIsSecondaryLoading] = useState(!secondaryResolved);

  useEffect(() => {
    let cancelled = false;
    let coreTimer: ReturnType<typeof setInterval> | null = null;
    let secondaryTimer: ReturnType<typeof setInterval> | null = null;

    const fetchCore = async () => {
      if (!hasCoreContent(getCurrentSnapshot())) {
        setIsLoading(true);
      }
      const snapshot = await ensureCoreSnapshot();
      if (cancelled) return;
      setDestinations(snapshot.destinations);
      setPackages(snapshot.packages);
      setHomeContent(snapshot.homeContent);
      setBookingContent(snapshot.bookingContent);
      setIsLoading(false);
    };

    const refreshCore = async () => {
      const snapshot = await ensureCoreSnapshot({ force: true });
      if (cancelled) return;
      setDestinations(snapshot.destinations);
      setPackages(snapshot.packages);
      setHomeContent(snapshot.homeContent);
      setBookingContent(snapshot.bookingContent);
    };

    const fetchSecondary = async () => {
      setIsSecondaryLoading(true);
      const snapshot = await ensureSecondarySnapshot();
      if (cancelled) return;
      setPosts(snapshot.posts);
      setLeads(snapshot.leads);
      setTestimonials(snapshot.testimonials);
      setIsSecondaryLoading(false);
    };

    const refreshSecondary = async () => {
      const snapshot = await ensureSecondarySnapshot({ force: true });
      if (cancelled) return;
      setPosts(snapshot.posts);
      setLeads(snapshot.leads);
      setTestimonials(snapshot.testimonials);
    };

    fetchCore();
    fetchSecondary();

    coreTimer = setInterval(refreshCore, CORE_REFRESH_INTERVAL_MS);
    secondaryTimer = setInterval(refreshSecondary, SECONDARY_REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (coreTimer) clearInterval(coreTimer);
      if (secondaryTimer) clearInterval(secondaryTimer);
    };
  }, []);

  const addLead = async (lead: Lead) => {
    const created = await dataService.createLead(lead);
    if (!created) return false;

    setLeads(prev => [lead, ...prev]);
    if (cachedSnapshot) {
      cachedSnapshot = {
        ...cachedSnapshot,
        leads: [lead, ...cachedSnapshot.leads]
      };
      persistSnapshot(cachedSnapshot);
    }
    return true;
  };

  return {
    packages,
    destinations,
    leads,
    testimonials,
    homeContent,
    bookingContent,
    posts,
    isLoading,
    isSecondaryLoading,
    addLead
  };
};
