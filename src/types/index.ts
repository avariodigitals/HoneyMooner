export type Continent = 'Africa' | 'Europe' | 'Asia' | 'Caribbean' | 'Americas' | 'Oceania' | 'Middle East';

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: Continent;
  description: string;
  image: string;
  slug: string;
  startingPrice?: number;
  bestTimeToVisit?: string;
  popularFor?: string[];
}

export type PricingBasis = 'per couple' | 'per person' | 'per family of 4';
export type PackageCategory = 'honeymoon' | 'family' | 'group';

export interface PricingTier {
  id: string;
  name: 'Premium' | 'Luxuria' | 'Ultra Luxuria';
  price: number;
  basis: PricingBasis;
}

export interface Departure {
  id: string;
  date: string;
  availability: 'available' | 'limited' | 'sold-out';
  priceAdjustment?: number;
}

export interface PackageInclusion {
  category: 'accommodation' | 'transport' | 'meals' | 'activities' | 'extras';
  items: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  image?: string;
  activity?: string;
}

export interface TravelPackage {
  id: string;
  category: PackageCategory;
  title: string;
  slug: string;
  summary: string;
  description: string;
  experienceContent?: string;
  featuredImage: string;
  gallery: string[];
  destinationId: string;
  duration: {
    days: number;
    nights: number;
  };
  tiers: PricingTier[];
  inclusions: PackageInclusion[];
  exclusions: string[];
  itinerary?: ItineraryDay[];
  tags: string[];
  departures: Departure[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface Lead {
  id: string;
  packageId: string;
  packageName: string;
  tierId?: string;
  tierName?: string;
  departureDate: string;
  adults: number;
  children: number;
  travelerName: string;
  email: string;
  phone: string;
  countryOfResidence: string;
  occasion: 'honeymoon' | 'anniversary' | 'proposal' | 'other';
  message?: string;
  status: 'pending' | 'contacted' | 'booked' | 'cancelled';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt: string;
}

export type Currency = {
  code: string;
  symbol: string;
  rate: number;
};

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
  slug: string;
  content?: string;
}

export interface HomeContent {
  fallbackImages: {
    hero: string;
    package: string;
    destination: string;
    testimonial: string;
    general: string;
  };
  styleImages: {
    beach: string;
    island: string;
    adventure: string;
    city: string;
  };
  hero: {
    title: string;
    subtitle: string;
    image: string;
    cta: string;
  };
  destinations: {
    title: string;
    subtitle: string;
    description: string;
  };
  packages: {
    title: string;
    subtitle: string;
    description: string;
  };
  giftPackage: {
    eyebrow: string;
    title: string;
    description: string;
    note: string;
    image: string;
    imageAlt: string;
    primaryCtaLabel: string;
    primaryCtaUrl: string;
    secondaryCtaLabel: string;
    secondaryCtaUrl: string;
  };
}

export interface BookingContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  success: {
    title: string;
    message: string;
    cta: string;
  };
  bespoke: {
    title: string;
    description: string;
    features: string[];
    budgetOptions: string[];
  };
  packageBenefits: string[];
  fallbackInfo: {
    title: string;
    description: string;
    satisfactionTitle: string;
    satisfactionSubtitle: string;
  };
  consultation: {
    title: string;
    description: string;
    cta: string;
  };
  labels: {
    package: string;
    tier: string;
    departureDate: string;
    country: string;
    travellers: string;
    adults: string;
    children: string;
    specialRequests: string;
    submit: string;
    submitting: string;
    loading: string;
    occasion: string;
    packagePlaceholder: string;
    tierPlaceholder: string;
  };
}

export interface Testimonial {
  id: string;
  coupleName: string;
  location: string;
  destination: string;
  quote: string;
  story: string;
  image: string;
  rating: number;
  date: string;
}

export interface PackageReview {
  id: string;
  packageId: string;
  packageSlug: string;
  packageTitle: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  message: string;
  createdAt: string;
}
