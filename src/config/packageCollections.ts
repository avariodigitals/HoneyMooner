import type { PackageCategory } from '../types';

export type PackageCollectionKind = 'theme' | 'route';

export interface PackageCollectionMatch {
  categories?: PackageCategory[];
  destinationNames?: string[];
  destinationCountries?: string[];
  tags?: string[];
  fallbackCategory?: PackageCategory;
}

export interface PackageCollectionDefinition {
  slug: string;
  kind: PackageCollectionKind;
  title: string;
  eyebrow: string;
  audience: string;
  tagline: string;
  intro: string;
  highlights: string[];
  destinations: string[];
  route?: string[];
  heroImage: string;
  match: PackageCollectionMatch;
}

const romanticHeroImage = 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/yuriy-bogdanov-XuN44TajBGo-unsplash-scaled.jpg';

export const PACKAGE_COLLECTIONS: PackageCollectionDefinition[] = [
  {
    slug: 'signature-experience',
    kind: 'theme',
    title: 'The Honeymoonner Signature Experience',
    eyebrow: 'For Families of Newlyweds',
    audience: 'Couples who want a premium surprise-led honeymoon',
    tagline: 'Not just a honeymoon... a love story designed by The Honeymoonner.',
    intro: 'A deeply curated honeymoon format with thoughtful surprises, visual storytelling, and meaningful touches that feel personal from the first day.',
    highlights: [
      'Surprise itinerary elements',
      'Cinematic love story photoshoot',
      'Personalized gifts and storytelling',
      'Scripture-based blessings'
    ],
    destinations: ['Curated globally based on couple preferences'],
    heroImage: romanticHeroImage,
    match: {
      categories: ['honeymoon'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'cultural-spiritual-romance',
    kind: 'theme',
    title: 'Cultural & Spiritual Romance',
    eyebrow: 'Meaningful Romance',
    audience: 'Deep, meaningful couples',
    tagline: 'Love with meaning, not just moments.',
    intro: 'Ideal for couples who want a honeymoon with depth, history, and a stronger sense of place and reflection.',
    highlights: [
      'History, culture, spiritual depth',
      'Slower pace with meaningful experiences',
      'Rich storytelling throughout the trip'
    ],
    destinations: ['Morocco', 'Turkey', 'Israel', 'Egypt'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationCountries: ['Morocco', 'Turkey', 'Israel', 'Egypt'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'city-lights-romance',
    kind: 'theme',
    title: 'City Lights Romance',
    eyebrow: 'Urban Love',
    audience: 'Urban, stylish couples',
    tagline: 'Love shines brighter in the city.',
    intro: 'For couples who want energy, elegance, nightlife, and a polished city-break honeymoon experience.',
    highlights: [
      'Fine dining',
      'Nightlife',
      'Shopping'
    ],
    destinations: ['Paris', 'London', 'New York City', 'Tokyo'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationNames: ['Paris', 'London', 'New York City', 'Tokyo'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'winter-wonderland-romance',
    kind: 'theme',
    title: 'Winter Wonderland Romance',
    eyebrow: 'Cold-Season Escape',
    audience: 'Couples who want something different',
    tagline: 'Love in the cold, hearts on fire.',
    intro: 'A snow-rich honeymoon for couples who want fireplaces, warm drinks, and a romantic change of scenery.',
    highlights: [
      'Snow escapes',
      'Fireplaces',
      'Hot chocolate vibes'
    ],
    destinations: ['Switzerland', 'Iceland', 'Lapland'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationCountries: ['Switzerland', 'Iceland', 'Lapland'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'safari-beach-combo',
    kind: 'theme',
    title: 'Safari & Beach Combo',
    eyebrow: 'Adventure and Ease',
    audience: 'Couples who want adventure and relaxation',
    tagline: 'Wild love meets ocean calm.',
    intro: 'The balance of wildlife, soft sand, and relaxed luxury creates a honeymoon with variety and emotion.',
    highlights: [
      'Wildlife and beach in one trip',
      'Very popular for Africans and internationals'
    ],
    destinations: ['Kenya + Zanzibar', 'South Africa + Mauritius'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationNames: ['Nairobi', 'Zanzibar', 'Cape Town', 'Johannesburg', 'Mauritius'],
      destinationCountries: ['Kenya', 'Tanzania', 'South Africa', 'Mauritius'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'island-hopping-romance',
    kind: 'theme',
    title: 'Island Hopping Romance',
    eyebrow: 'Water Lovers',
    audience: 'Couples who love water and aesthetics',
    tagline: 'Every island, a new love story.',
    intro: 'A beautiful rhythm of ferries, boats, sunsets, and beach clubs across multiple islands.',
    highlights: [
      'Move between islands',
      'Boat rides, beach clubs, sunsets'
    ],
    destinations: ['Greece', 'Maldives', 'Caribbean', 'Philippines'],
    heroImage: romanticHeroImage,
    match: {
      destinationCountries: ['Greece', 'Maldives', 'Jamaica', 'Barbados', 'St Lucia', 'Philippines'],
      destinationNames: ['Santorini', 'Mykonos', 'Maldives', 'Bora Bora', 'Seychelles', 'Fiji'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'multi-destination-adventure-love',
    kind: 'theme',
    title: 'Multi-Destination Adventure Love',
    eyebrow: 'More Than One Destination',
    audience: 'Couples who want variety and memories',
    tagline: 'One love, multiple destinations.',
    intro: 'A route-based honeymoon format that blends city, nature, and beach across 2 to 4 stops.',
    highlights: [
      '2-4 countries in one honeymoon',
      'Mix of city, nature, and beach'
    ],
    destinations: ['Dubai/Doha -> Bali -> Singapore', 'Paris -> Rome -> Santorini'],
    route: ['Port of Departure', 'First Stop', 'Second Stop', 'Third Stop', 'Return'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      categories: ['honeymoon'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'ultra-luxury',
    kind: 'theme',
    title: 'Ultra Luxury',
    eyebrow: 'Top-Tier Travel',
    audience: 'High-net-worth couples and aspirational clients',
    tagline: 'If money was not a problem... this is it.',
    intro: 'A high-touch honeymoon style with VIP transfers, premium stays, and elevated service throughout.',
    highlights: [
      'Overwater villas',
      'Private jets',
      'Yacht dinners',
      'VIP experiences'
    ],
    destinations: ['Maldives', 'Dubai', 'Santorini', 'Amalfi Coast'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationNames: ['Maldives', 'Dubai', 'Santorini', 'Amalfi Coast'],
      destinationCountries: ['UAE', 'Greece', 'Italy'],
      tags: ['Luxury'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'soft-luxury-escape',
    kind: 'theme',
    title: 'Soft Luxury Escape (Starter Honeymoon)',
    eyebrow: 'Luxury Within Reach',
    audience: 'Budget-conscious couples who still want elegance',
    tagline: 'Luxury, but make it attainable.',
    intro: 'Elegant, slow, and romantic without the pressure of an overcomplicated itinerary.',
    highlights: [
      'Africa + island combo',
      '4-star resorts, spa treatments, beach dinners',
      'Slow, romantic, not stressful'
    ],
    destinations: ['Zanzibar', 'Cape Verde', 'Mauritius'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationNames: ['Zanzibar', 'Cape Verde', 'Mauritius'],
      destinationCountries: ['Tanzania', 'Cape Verde', 'Mauritius'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'west-africa-island-south-africa',
    kind: 'route',
    title: 'West Africa -> Island -> South Africa',
    eyebrow: 'Route Idea',
    audience: 'Couples who want multi-stop variety',
    tagline: 'A smooth cross-region journey.',
    intro: 'A route that blends city energy, island ease, and Southern African style into one honeymoon flow.',
    highlights: ['Regional variety', 'Strong honeymoon potential', 'Easy to personalize'],
    destinations: ['Port of Departure', 'Cotonou', 'Cape Verde', 'Cape Town', 'Johannesburg', 'Lagos'],
    route: ['Port of Departure', 'Cotonou', 'Cape Verde', 'Cape Town', 'Johannesburg', 'Lagos'],
    heroImage: romanticHeroImage,
    match: {
      destinationCountries: ['Benin', 'Cape Verde', 'South Africa', 'Nigeria'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'asian-love-tour',
    kind: 'route',
    title: 'The Asian Love Tour',
    eyebrow: 'Route Idea',
    audience: 'Couples who want city and island energy',
    tagline: 'A warm, colorful, and exciting route.',
    intro: 'A big-scope itinerary through Asia that combines vibrant cities, beach life, and luxury stays.',
    highlights: ['Big-city stops', 'Beach downtime', 'Ideal for adventurous couples'],
    destinations: ['Accra', 'Bali', 'Bangkok', 'Singapore', 'Malaysia'],
    route: ['Port of Departure', 'Accra', 'Bali', 'Bangkok', 'Singapore', 'Malaysia', 'Lagos'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationNames: ['Bali', 'Bangkok', 'Singapore'],
      destinationCountries: ['Indonesia', 'Thailand', 'Singapore', 'Malaysia'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'east-africa-southern-africa',
    kind: 'route',
    title: 'East Africa -> Southern Africa',
    eyebrow: 'Safari + Beach',
    audience: 'Couples who want adventure and calm',
    tagline: 'Wildlife first, ocean calm after.',
    intro: 'A balanced route across East and Southern Africa with strong romance, wildlife, and beach appeal.',
    highlights: ['Safari and beach blend', 'Popular for African couples', 'Flexible stopover options'],
    destinations: ['Nairobi', 'Zanzibar', 'Cape Town', 'Namibia', 'Addis Ababa', 'Lagos'],
    route: ['Port of Departure', 'Nairobi', 'Zanzibar', 'Cape Town', 'Namibia', 'Addis Ababa', 'Lagos'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationCountries: ['Kenya', 'Tanzania', 'South Africa', 'Namibia', 'Ethiopia'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'classic-south-africa-loop',
    kind: 'route',
    title: 'Classic South Africa Loop',
    eyebrow: 'Best Seller Potential',
    audience: 'Couples who want a proven route',
    tagline: 'A smooth loop built for romance.',
    intro: 'A practical and attractive route that can be adapted for long-haul or regional travelers.',
    highlights: ['Balanced city and island pacing', 'Strong visual appeal', 'Simple to customize'],
    destinations: ['Nairobi', 'Zanzibar', 'Cape Town', 'Johannesburg'],
    route: ['Port of Departure', 'Nairobi', 'Zanzibar', 'Cape Town', 'Johannesburg', 'Port of Arrival'],
    heroImage: romanticHeroImage,
    match: {
      destinationCountries: ['Kenya', 'Tanzania', 'South Africa'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'ultra-romance-route',
    kind: 'route',
    title: 'Ultra Romance Route',
    eyebrow: 'Premium Route',
    audience: 'Couples who want elegance and variety',
    tagline: 'For couples who want a premium itinerary.',
    intro: 'A luxury-first route that keeps the pace relaxed while moving through highly desirable destinations.',
    highlights: ['Luxury feel', 'Premium destination mix', 'Great for aspirational clients'],
    destinations: ['Nairobi', 'Mauritius', 'Cape Town', 'Johannesburg'],
    route: ['Port of Departure', 'Nairobi', 'Mauritius', 'Cape Town', 'Johannesburg', 'Port of Arrival'],
    heroImage: romanticHeroImage,
    match: {
      destinationCountries: ['Kenya', 'Mauritius', 'South Africa'],
      tags: ['Luxury'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'europe-love-trail',
    kind: 'route',
    title: 'Europe Love Trail',
    eyebrow: 'Classic Europe',
    audience: 'Couples who want a romantic city loop',
    tagline: 'A timeless route through Europe.',
    intro: 'This route is built for couples who love classic European romance, architecture, dining, and slow travel.',
    highlights: ['Cultural richness', 'Iconic photo opportunities', 'Elegant multi-city feel'],
    destinations: ['Paris', 'Santorini', 'Rome', 'Venice'],
    route: ['Port of Departure', 'Paris', 'Santorini', 'Rome', 'Venice'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationNames: ['Paris', 'Santorini', 'Rome', 'Venice'],
      destinationCountries: ['France', 'Greece', 'Italy'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'turkey-greece-romance',
    kind: 'route',
    title: 'Turkey + Greece Romance',
    eyebrow: 'Culture and Island Luxury',
    audience: 'Couples who want a mixed-pace honeymoon',
    tagline: 'A route with culture, height, and sea views.',
    intro: 'Great for couples who want a mix of history, scenery, and island relaxation.',
    highlights: ['Deep cultural value', 'Great visual variety', 'Flexible luxury levels'],
    destinations: ['Istanbul', 'Cappadocia', 'Santorini', 'Mykonos'],
    route: ['Port of Departure', 'Istanbul', 'Cappadocia', 'Santorini', 'Mykonos'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationCountries: ['Turkey', 'Greece'],
      destinationNames: ['Istanbul', 'Cappadocia', 'Santorini', 'Mykonos'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'morocco-zanzibar-culture-beach',
    kind: 'route',
    title: 'Morocco + Zanzibar',
    eyebrow: 'Culture + Beach',
    audience: 'Couples who want contrast in one itinerary',
    tagline: 'History first, beach calm after.',
    intro: 'A route built for couples who want culture, desert, and a beach finale.',
    highlights: ['Strong contrast', 'High emotional appeal', 'Easy to market visually'],
    destinations: ['Marrakech', 'Sahara', 'Zanzibar'],
    route: ['Port of Departure', 'Marrakech', 'Sahara', 'Zanzibar'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationCountries: ['Morocco', 'Tanzania'],
      destinationNames: ['Marrakesh', 'Zanzibar'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'island-obsession',
    kind: 'route',
    title: 'The Island Obsession',
    eyebrow: 'Island Icons',
    audience: 'Couples who love water and sunsets',
    tagline: 'A collection of iconic islands.',
    intro: 'This route idea is for island-focused couples and can be adapted into a single or multi-stop journey.',
    highlights: ['Aesthetic appeal', 'Easy to package', 'Strong honeymoon demand'],
    destinations: ['Maldives + UAE', 'Bora Bora', 'Seychelles + Mauritius'],
    route: ['Maldives + UAE', 'Bora Bora', 'Seychelles + Mauritius'],
    heroImage: romanticHeroImage,
    match: {
      destinationNames: ['Maldives', 'Bora Bora', 'Seychelles', 'Mauritius', 'Dubai'],
      destinationCountries: ['Maldives', 'UAE', 'French Polynesia', 'Seychelles', 'Mauritius'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'european-love-trail',
    kind: 'route',
    title: 'European Love Trail',
    eyebrow: 'Extended Europe',
    audience: 'Couples who want a longer multi-stop route',
    tagline: 'Longer route, more memories.',
    intro: 'A bigger European route that offers depth, movement, and a lot of memorable moments.',
    highlights: ['Ideal for longer honeymoons', 'Excellent upsell opportunity', 'Strong content value'],
    destinations: ['Paris', 'Venice', 'Amalfi Coast', 'Switzerland', 'Rome', 'Florence'],
    route: ['Paris', 'Venice', 'Amalfi Coast', 'Switzerland', 'Rome', 'Florence'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationCountries: ['France', 'Italy', 'Switzerland'],
      destinationNames: ['Paris', 'Venice', 'Amalfi Coast', 'Rome', 'Florence'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'caribbean-slow-love',
    kind: 'route',
    title: 'Caribbean Slow Love',
    eyebrow: 'Slow Pace',
    audience: 'Couples who want easy warmth and rest',
    tagline: 'Relaxed, warm, and romantic.',
    intro: 'Perfect for couples who want to slow down, rest, and enjoy a sun-soaked itinerary.',
    highlights: ['Relaxed pacing', 'Warm water and beaches', 'Great for long stays'],
    destinations: ['Saint Lucia', 'Jamaica + Bahamas', 'Antigua and Barbuda'],
    route: ['Saint Lucia', 'Jamaica + Bahamas', 'Antigua and Barbuda'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationCountries: ['Jamaica', 'Bahamas', 'Antigua and Barbuda', 'Saint Lucia'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'safari-luxe-beach',
    kind: 'route',
    title: 'Safari + Luxe Beach',
    eyebrow: 'Adventure + Luxury',
    audience: 'Couples who want wildlife and soft landing',
    tagline: 'Safari first, luxury beach next.',
    intro: 'A route idea with strong upsell potential that combines wildlife with premium beach recovery time.',
    highlights: ['Strong Africa appeal', 'Great for couples seeking balance', 'Easy to adapt'],
    destinations: ['Kenya -> Zanzibar', 'Tanzania (Serengeti) -> Seychelles', 'South Africa -> Mauritius'],
    route: ['Kenya -> Zanzibar', 'Tanzania (Serengeti) -> Seychelles', 'South Africa -> Mauritius'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationCountries: ['Kenya', 'Tanzania', 'South Africa', 'Mauritius', 'Seychelles'],
      fallbackCategory: 'honeymoon'
    }
  },
  {
    slug: 'usa-dream-honeymoon',
    kind: 'route',
    title: 'USA Dream Honeymoon',
    eyebrow: 'Domestic Luxury',
    audience: 'US couples who want a home-country escape',
    tagline: 'A honeymoon with American variety.',
    intro: 'A domestic route idea for couples who want to keep the trip within the United States while still feeling special.',
    highlights: ['Easy for domestic clients', 'Varied landscapes', 'Good for short or extended itineraries'],
    destinations: ['Hawaii (Maui/Oahu)', 'Napa Valley -> Los Angeles', 'New York City -> Las Vegas'],
    route: ['Hawaii (Maui/Oahu)', 'Napa Valley -> Los Angeles', 'New York City -> Las Vegas'],
    heroImage: '/images/placeholder-travel.svg',
    match: {
      destinationCountries: ['USA'],
      destinationNames: ['Hawaii', 'Cancun', 'Los Cabos', 'Mendoza', 'Puerto Rico'],
      fallbackCategory: 'honeymoon'
    }
  }
];

export function findPackageCollection(slug: string): PackageCollectionDefinition | undefined {
  return PACKAGE_COLLECTIONS.find((collection) => collection.slug === slug);
}
