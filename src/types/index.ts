export type Continent = 'Africa' | 'Europe' | 'Asia' | 'Caribbean' | 'Americas' | 'Oceania' | 'Middle East';

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: Continent;
  description: string;
  image: string;
  slug: string;
}

export type PricingBasis = 'per couple' | 'per person' | 'per family of 4';
export type PackageCategory = 'honeymoon' | 'family' | 'group';

export interface PricingTier {
  id: string;
  name: 'Premium' | 'Luxuria' | 'Ultra Luxuria';
  price: number;
  currency: string;
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
  departureDate: string;
  adults: number;
  children: number;
  travelerName: string;
  email: string;
  phone: string;
  occasion: 'honeymoon' | 'anniversary' | 'proposal' | 'other';
  message?: string;
  status: 'pending' | 'contacted' | 'booked' | 'cancelled';
  createdAt: string;
}

export type Currency = {
  code: string;
  symbol: string;
  rate: number;
};

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
