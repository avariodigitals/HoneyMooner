import { useState, useEffect } from 'react';
import type { Destination, TravelPackage, Lead, Testimonial, BlogPost, HomeContent, BookingContent } from '../types';
import { dataService } from '../services/dataService';

const defaultHomeContent: HomeContent = {
  hero: {
    title: "Plan a Once-in-a-Lifetime Honeymoon — Without the Stress",
    subtitle: "We design fully personalized luxury honeymoon experiences — from destination selection to every intimate detail.",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=2070",
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
    message: 'Thank you for reaching out to The Honeymooner. Our romantic travel specialist will contact you via WhatsApp or Email within the next 24 hours to begin planning your dream escape.',
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

const emptySnapshot: DataSnapshot = {
  packages: [],
  destinations: [],
  leads: [],
  testimonials: [],
  homeContent: defaultHomeContent,
  bookingContent: defaultBookingContent,
  posts: []
};

let cachedSnapshot: DataSnapshot | null = null;
let coreResolved = false;
let secondaryResolved = false;
let inflightCorePromise: Promise<DataSnapshot> | null = null;
let inflightSecondaryPromise: Promise<DataSnapshot> | null = null;

function getCurrentSnapshot(): DataSnapshot {
  return cachedSnapshot || emptySnapshot;
}

function hasCoreContent(snapshot: DataSnapshot): boolean {
  return snapshot.destinations.length > 0 || snapshot.packages.length > 0;
}

async function ensureCoreSnapshot(): Promise<DataSnapshot> {
  if (coreResolved && cachedSnapshot) return cachedSnapshot;
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
      const nextDestinations = wpDestinations.length > 0 ? wpDestinations : current.destinations;
      const nextPackages = wpPackages.length > 0 ? wpPackages : current.packages;
      const nextHomeContent = wpHomeContent || current.homeContent || defaultHomeContent;
      const nextBookingContent = wpBookingContent || current.bookingContent || defaultBookingContent;

      const snapshot: DataSnapshot = {
        ...current,
        destinations: nextDestinations,
        packages: nextPackages,
        homeContent: nextHomeContent,
        bookingContent: nextBookingContent
      };

      // If this fetch yielded no core data and we had no previous core data, allow future retry.
      if (!hasCoreContent(snapshot)) {
        shouldResolveCore = false;
      }

      cachedSnapshot = snapshot;
      return snapshot;
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
      if (!hasCoreContent(snapshot)) {
        shouldResolveCore = false;
      }
      cachedSnapshot = snapshot;
      return snapshot;
    } finally {
      coreResolved = shouldResolveCore;
      inflightCorePromise = null;
    }
  })();

  return inflightCorePromise;
}

async function ensureSecondarySnapshot(): Promise<DataSnapshot> {
  if (secondaryResolved && cachedSnapshot) return cachedSnapshot;
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
      cachedSnapshot = snapshot;
      return snapshot;
    } catch (error) {
      console.error('Failed to sync secondary WordPress data:', error);
      const snapshot: DataSnapshot = getCurrentSnapshot();
      if (snapshot.posts.length === 0 && snapshot.leads.length === 0 && snapshot.testimonials.length === 0) {
        shouldResolveSecondary = false;
      }
      cachedSnapshot = snapshot;
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
  const [isLoading, setIsLoading] = useState(!coreResolved);
  const [isSecondaryLoading, setIsSecondaryLoading] = useState(!secondaryResolved);

  useEffect(() => {
    let cancelled = false;
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

    const fetchSecondary = async () => {
      setIsSecondaryLoading(true);
      const snapshot = await ensureSecondarySnapshot();
      if (cancelled) return;
      setPosts(snapshot.posts);
      setLeads(snapshot.leads);
      setTestimonials(snapshot.testimonials);
      setIsSecondaryLoading(false);
    };

    fetchCore();
    fetchSecondary();

    return () => {
      cancelled = true;
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
