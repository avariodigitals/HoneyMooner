import type { Destination, TravelPackage, PricingTier, Lead, PricingBasis, PackageInclusion, PackageCategory, Testimonial } from '../types';

export const DATA_VERSION = '1.0.2';

export const initialDestinations: Destination[] = [
  // Indian Ocean
  { id: 'd1', name: 'Maldives', country: 'Maldives', continent: 'Asia', description: 'Pristine beaches and overwater villas.', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80', slug: 'maldives' },
  { id: 'd2', name: 'Mauritius', country: 'Mauritius', continent: 'Africa', description: 'Tropical paradise in the Indian Ocean.', image: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?auto=format&fit=crop&q=80', slug: 'mauritius' },
  { id: 'd3', name: 'Seychelles', country: 'Seychelles', continent: 'Africa', description: 'Stunning islands and unique wildlife.', image: 'https://images.unsplash.com/photo-1506405211174-1c41d7bc9ed6?auto=format&fit=crop&q=80', slug: 'seychelles' },
  { id: 'd4', name: 'Zanzibar', country: 'Tanzania', continent: 'Africa', description: 'Exotic spice island with white sand beaches.', image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&q=80', slug: 'zanzibar' },
  { id: 'd5', name: 'Sri Lanka', country: 'Sri Lanka', continent: 'Asia', description: 'Lush jungles and ancient temples.', image: 'https://images.unsplash.com/photo-1524230507669-e29a75c60243?auto=format&fit=crop&q=80', slug: 'sri-lanka' },

  // Europe
  { id: 'd6', name: 'Santorini', country: 'Greece', continent: 'Europe', description: 'Iconic white-washed buildings and sunsets.', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80', slug: 'santorini' },
  { id: 'd7', name: 'Amalfi Coast', country: 'Italy', continent: 'Europe', description: 'Dramatic coastline and charming villages.', image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80', slug: 'amalfi-coast' },
  { id: 'd8', name: 'Lake Como', country: 'Italy', continent: 'Europe', description: 'Elegant lake surrounded by mountains.', image: 'https://images.unsplash.com/photo-1513530176992-0cf39c4cbed4?auto=format&fit=crop&q=80', slug: 'lake-como' },
  { id: 'd9', name: 'Malta', country: 'Malta', continent: 'Europe', description: 'Historical island with beautiful lagoons.', image: 'https://images.unsplash.com/photo-1527068596651-150240dcaec3?auto=format&fit=crop&q=80', slug: 'malta' },
  { id: 'd10', name: 'Paris', country: 'France', continent: 'Europe', description: 'The city of light and love.', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80', slug: 'paris' },
  { id: 'd11', name: 'Mykonos', country: 'Greece', continent: 'Europe', description: 'Cosmopolitan island with vibrant nightlife.', image: 'https://images.unsplash.com/photo-1552636647-5d0752109e25?auto=format&fit=crop&q=80', slug: 'mykonos' },
  { id: 'd12', name: 'Portugal', country: 'Portugal', continent: 'Europe', description: 'Stunning coastline and rich history.', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80', slug: 'portugal' },
  { id: 'd13', name: 'Geneva', country: 'Switzerland', continent: 'Europe', description: 'Picturesque city on the shores of Lake Geneva.', image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80', slug: 'geneva' },
  { id: 'd14', name: 'Berlin', country: 'Germany', continent: 'Europe', description: 'Dynamic capital with a rich history.', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&q=80', slug: 'berlin' },
  { id: 'd15', name: 'Prague', country: 'Czech Republic', continent: 'Europe', description: 'Gothic architecture and fairy-tale streets.', image: 'https://images.unsplash.com/photo-1513807016779-d51c0c026263?auto=format&fit=crop&q=80', slug: 'prague' },
  { id: 'd16', name: 'Vienna', country: 'Austria', continent: 'Europe', description: 'Imperial palaces and classical music history.', image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80', slug: 'vienna' },
  { id: 'd17', name: 'Interlaken', country: 'Switzerland', continent: 'Europe', description: 'Adventure capital in the heart of the Alps.', image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&q=80', slug: 'interlaken' },

  // Asia
  { id: 'd18', name: 'Bali', country: 'Indonesia', continent: 'Asia', description: 'Lush jungles and tropical paradise.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80', slug: 'bali' },
  { id: 'd19', name: 'Thailand', country: 'Thailand', continent: 'Asia', description: 'Land of smiles and beautiful islands.', image: 'https://images.unsplash.com/photo-1528181304800-2f140819ad9c?auto=format&fit=crop&q=80', slug: 'thailand' },
  { id: 'd20', name: 'Japan', country: 'Japan', continent: 'Asia', description: 'Blend of ancient traditions and modern technology.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80', slug: 'japan' },
  { id: 'd21', name: 'South Korea', country: 'South Korea', continent: 'Asia', description: 'Vibrant cities and serene temples.', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80', slug: 'south-korea' },

  // Africa (Other than Indian Ocean)
  { id: 'd22', name: 'Johannesburg', country: 'South Africa', continent: 'Africa', description: 'Vibrant hub with rich culture.', image: 'https://images.unsplash.com/photo-1577948000111-9c97cdeb20b8?auto=format&fit=crop&q=80', slug: 'johannesburg' },
  { id: 'd23', name: 'Cape Town', country: 'South Africa', continent: 'Africa', description: 'Stunning coastal city under Table Mountain.', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80', slug: 'cape-town' },
  { id: 'd24', name: 'Cape Verde', country: 'Cape Verde', continent: 'Africa', description: 'Unique blend of African and European cultures.', image: 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&q=80', slug: 'cape-verde' },
  { id: 'd25', name: 'Nairobi', country: 'Kenya', continent: 'Africa', description: 'Green city under the sun.', image: 'https://images.unsplash.com/photo-1581007871115-f9442ee0a82c?auto=format&fit=crop&q=80', slug: 'nairobi' },
  { id: 'd26', name: 'Mombasa', country: 'Kenya', continent: 'Africa', description: 'Historical coastal city with white beaches.', image: 'https://images.unsplash.com/photo-1513256038378-c896931215f7?auto=format&fit=crop&q=80', slug: 'mombasa' },
  { id: 'd27', name: 'Marrakesh', country: 'Morocco', continent: 'Africa', description: 'Vibrant markets and stunning palaces.', image: 'https://images.unsplash.com/photo-1597212618440-806262de496b?auto=format&fit=crop&q=80', slug: 'marrakesh' },

  // Americas & Caribbean
  { id: 'd28', name: 'Jamaica', country: 'Jamaica', continent: 'Caribbean', description: 'Island of reggae and beautiful beaches.', image: 'https://images.unsplash.com/photo-1523544545175-92e04b96d26b?auto=format&fit=crop&q=80', slug: 'jamaica' },
  { id: 'd29', name: 'Hawaii', country: 'USA', continent: 'Americas', description: 'Tropical volcanic islands with aloha spirit.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80', slug: 'hawaii' },
  { id: 'd30', name: 'Cancun', country: 'Mexico', continent: 'Americas', description: 'Vibrant resort city with turquoise waters.', image: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&q=80', slug: 'cancun' },
  { id: 'd31', name: 'Puerto Rico', country: 'USA', continent: 'Caribbean', description: 'Rich history and stunning beaches.', image: 'https://images.unsplash.com/photo-1580997122723-275151020478?auto=format&fit=crop&q=80', slug: 'puerto-rico' },
  { id: 'd32', name: 'Chile', country: 'Chile', continent: 'Americas', description: 'Diverse landscapes from deserts to glaciers.', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80', slug: 'chile' },
  { id: 'd33', name: 'Tulum', country: 'Mexico', continent: 'Americas', description: 'Ancient ruins overlooking the Caribbean Sea.', image: 'https://images.unsplash.com/photo-1504730655501-24c39ac53f0e?auto=format&fit=crop&q=80', slug: 'tulum' },
  { id: 'd34', name: 'Panama', country: 'Panama', continent: 'Americas', description: 'Hub of the Americas with a famous canal.', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80', slug: 'panama' },
  { id: 'd35', name: 'Los Cabos', country: 'Mexico', continent: 'Americas', description: 'Where the desert meets the sea.', image: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&q=80', slug: 'los-cabos' },
  { id: 'd36', name: 'Mendoza', country: 'Argentina', continent: 'Americas', description: 'Wine country at the foot of the Andes.', image: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&q=80', slug: 'mendoza' },
  { id: 'd37', name: 'Peru', country: 'Peru', continent: 'Americas', description: 'Ancient history and breathtaking landscapes.', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80', slug: 'peru' },
  { id: 'd38', name: 'Barbados', country: 'Barbados', continent: 'Caribbean', description: 'Beautiful beaches and vibrant culture.', image: 'https://images.unsplash.com/photo-1581403561608-f463282f6e5c?auto=format&fit=crop&q=80', slug: 'barbados' },
  { id: 'd39', name: 'St Lucia', country: 'St Lucia', continent: 'Caribbean', description: 'Dramatic pitons and lush rainforests.', image: 'https://images.unsplash.com/photo-1528113401503-4e891079d854?auto=format&fit=crop&q=80', slug: 'st-lucia' },
  { id: 'd40', name: 'Bahamas', country: 'Bahamas', continent: 'Caribbean', description: 'Crystal clear waters and stunning islands.', image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80', slug: 'bahamas' },
  { id: 'd41', name: 'Antigua', country: 'Antigua and Barbuda', continent: 'Caribbean', description: 'Island of 365 beaches.', image: 'https://images.unsplash.com/photo-1548574505-1a196429263f?auto=format&fit=crop&q=80', slug: 'antigua' },
  { id: 'd42', name: 'Turks & Caicos', country: 'Turks and Caicos Islands', continent: 'Caribbean', description: 'Luxury and world-class beaches.', image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&q=80', slug: 'turks-caicos' },
  { id: 'd43', name: 'Aruba', country: 'Aruba', continent: 'Caribbean', description: 'Sunny island with white sand beaches.', image: 'https://images.unsplash.com/photo-1524850041227-63d88c4d2301?auto=format&fit=crop&q=80', slug: 'aruba' },

  // Oceania
  { id: 'd44', name: 'Bora Bora', country: 'French Polynesia', continent: 'Oceania', description: 'Iconic overwater bungalows and lagoons.', image: 'https://images.unsplash.com/photo-1506929662033-75393ca9940b?auto=format&fit=crop&q=80', slug: 'bora-bora' },
  { id: 'd45', name: 'Fiji', country: 'Fiji', continent: 'Oceania', description: 'Tropical paradise with warm hospitality.', image: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&q=80', slug: 'fiji' },

  // Middle East
  { id: 'd46', name: 'Dubai', country: 'UAE', continent: 'Middle East', description: 'Modern luxury and architectural wonders.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80', slug: 'dubai' },
  { id: 'd47', name: 'Doha', country: 'Qatar', continent: 'Middle East', description: 'Futuristic city with traditional roots.', image: 'https://images.unsplash.com/photo-1510674485131-dc88d9809fa0?auto=format&fit=crop&q=80', slug: 'doha' },
  { id: 'd48', name: 'Jordan', country: 'Jordan', continent: 'Middle East', description: 'Ancient history and stunning desert landscapes.', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80', slug: 'jordan' },
  { id: 'd49', name: 'Bahrain', country: 'Bahrain', continent: 'Middle East', description: 'Island nation with a blend of tradition and modernity.', image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80', slug: 'bahrain' },
  { id: 'd50', name: 'Abu Dhabi', country: 'UAE', continent: 'Middle East', description: 'Capital of luxury and cultural icons.', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&q=80', slug: 'abu-dhabi' },
];

export const initialPackages: TravelPackage[] = [];

// Helper to create tiers
const createTiers = (p: number, l: number, u: number, basis: PricingBasis): PricingTier[] => [
  { id: Math.random().toString(36).substr(2, 9), name: 'Premium', price: p, currency: 'USD', basis },
  { id: Math.random().toString(36).substr(2, 9), name: 'Luxuria', price: l, currency: 'USD', basis },
  { id: Math.random().toString(36).substr(2, 9), name: 'Ultra Luxuria', price: u, currency: 'USD', basis },
];

const inclusions: PackageInclusion[] = [
  { category: 'accommodation', items: ['Luxury Suite / Villa with Sea View', 'Romantic Turndown Service', 'Daily Fresh Fruit & Flowers'] },
  { category: 'transport', items: ['Private VIP Airport Transfers', 'Chauffeur Service for Local Tours', 'Luxury Speedboat Transfers (where applicable)'] },
  { category: 'meals', items: ['Daily Gourmet Breakfast', 'Candlelit 3-Course Dinner on the Beach', 'Sunset Cocktails & Canapés'] },
  { category: 'activities', items: ['Private Guided Island Tour', 'Couples Signature Spa Treatment', 'Professional Honeymoon Photoshoot'] },
  { category: 'extras', items: ['Personal Concierge Planning', 'All Local Taxes & Service Charges', 'Travel Insurance Coverage'] }
];

const exclusions = ['International Flights (unless requested)', 'Visa Fees', 'Personal Spending Money', 'Optional Adventure Activities', 'Tips & Gratuities'];

const sampleItinerary = [
  { day: 1, title: 'Arrival & Romantic Welcome', description: 'Arrive at your destination and enjoy a private transfer to your luxury resort. Settle into your room with a romantic welcome setup and a sunset cocktail.', activity: 'Sunset Cocktails' },
  { day: 2, title: 'Private Island Escape', description: 'Spend a full day on a secluded private island with a gourmet picnic lunch and snorkeling in crystal-clear waters.', activity: 'Island Picnic' },
  { day: 3, title: 'Spa & Wellness Sanctuary', description: 'Indulge in a couple\'s signature spa treatment followed by a relaxing afternoon by the infinity pool.', activity: 'Signature Spa' },
  { day: 4, title: 'Cultural Exploration', description: 'Take a private guided tour of local landmarks and hidden gems, ending with a traditional cooking class.', activity: 'Private Tour' },
  { day: 5, title: 'Sunset Sailing', description: 'Embark on a private luxury yacht for a sunset cruise with champagne and canapés.', activity: 'Luxury Yacht' },
];

interface PackageDataItem {
  destId: string;
  p: number;
  l: number;
  u: number;
  basis: PricingBasis;
}

// Data mapping for mass generation
const packageData: Record<string, PackageDataItem[]> = {
  honeymoon: [
    { destId: 'd1', p: 10500, l: 14800, u: 25200, basis: 'per couple' },
    { destId: 'd2', p: 8500, l: 10800, u: 25600, basis: 'per couple' },
    { destId: 'd3', p: 9200, l: 12800, u: 28500, basis: 'per couple' },
    { destId: 'd4', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
    { destId: 'd5', p: 8500, l: 10200, u: 18000, basis: 'per couple' },
    { destId: 'd6', p: 5500, l: 10800, u: 15200, basis: 'per couple' },
    { destId: 'd7', p: 4800, l: 8700, u: 13500, basis: 'per couple' },
    { destId: 'd8', p: 5800, l: 9200, u: 17600, basis: 'per couple' },
    { destId: 'd10', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
    { destId: 'd18', p: 6500, l: 10800, u: 15200, basis: 'per couple' },
    { destId: 'd19', p: 7500, l: 11800, u: 23600, basis: 'per couple' },
    { destId: 'd20', p: 9200, l: 12800, u: 28500, basis: 'per couple' },
    { destId: 'd44', p: 25000, l: 32800, u: 45000, basis: 'per couple' },
    { destId: 'd46', p: 6500, l: 10800, u: 15200, basis: 'per couple' },
  ],
  family: [
    { destId: 'd1', p: 25000, l: 34000, u: 43000, basis: 'per family of 4' },
    { destId: 'd2', p: 18000, l: 25000, u: 32000, basis: 'per family of 4' },
    { destId: 'd6', p: 12000, l: 14000, u: 33000, basis: 'per family of 4' },
    { destId: 'd18', p: 18000, l: 26000, u: 34000, basis: 'per family of 4' },
    { destId: 'd46', p: 10500, l: 15800, u: 25200, basis: 'per family of 4' },
  ],
  group: [
    { destId: 'd1', p: 4500, l: 8700, u: 12200, basis: 'per person' },
    { destId: 'd6', p: 4200, l: 7300, u: 14500, basis: 'per person' },
    { destId: 'd18', p: 9000, l: 13000, u: 26000, basis: 'per person' },
    { destId: 'd22', p: 4000, l: 8000, u: 12000, basis: 'per person' },
    { destId: 'd46', p: 5000, l: 9000, u: 15000, basis: 'per person' },
  ]
};

Object.keys(packageData).forEach(category => {
  packageData[category].forEach((item) => {
    const dest = initialDestinations.find(d => d.id === item.destId);
    if (dest) {
      const styleTags = [];
      if (['Maldives', 'Mauritius', 'Seychelles', 'Barbados', 'Bora Bora', 'Fiji', 'Bahamas', 'Antigua'].includes(dest.name)) styleTags.push('Beach Romance');
      if (['Santorini', 'Maldives', 'Bora Bora', 'Fiji', 'Zanzibar'].includes(dest.name)) styleTags.push('Island Bliss');
      if (['Jordan', 'Swiss Alps', 'Cappadocia'].includes(dest.name)) styleTags.push('Mountain Escape');
      if (['Paris', 'Venice', 'Rome', 'London', 'Dubai', 'Doha'].includes(dest.name)) styleTags.push('City Intimacy');
      if (styleTags.length === 0) styleTags.push('Bespoke Luxury');

      initialPackages.push({
        id: `${category}-${item.destId}`,
        category: category as PackageCategory,
        title: `${dest.name} ${category.charAt(0).toUpperCase() + category.slice(1)} Experience`,
        slug: `${dest.slug}-${category}`,
        summary: `Luxury ${category} trip to ${dest.name}.`,
        description: `Enjoy a world-class ${category} experience in ${dest.name}. Our tiered packages offer flexibility and unmatched luxury.`,
        featuredImage: dest.image,
        gallery: [dest.image],
        destinationId: dest.id,
        duration: { days: 7, nights: 6 },
        tiers: createTiers(item.p, item.l, item.u, item.basis),
        inclusions,
        exclusions,
        itinerary: category === 'honeymoon' ? sampleItinerary : undefined,
        tags: [category.charAt(0).toUpperCase() + category.slice(1), 'Luxury', dest.name, ...styleTags],
        departures: [
          { id: `dep-${category}-${item.destId}-1`, date: '2026-06-15', availability: 'available' },
          { id: `dep-${category}-${item.destId}-2`, date: '2026-09-20', availability: 'limited' }
        ],
        seo: { title: `${dest.name} ${category} | The Honeymooner`, description: `Book your ${category} trip to ${dest.name}.`, keywords: [dest.name, category, 'luxury travel'] }
      });
    }
  });
});

export const initialLeads: Lead[] = [];

export const initialTestimonials: Testimonial[] = [
  {
    id: 't1',
    coupleName: 'The Adewales',
    location: 'Lagos, Nigeria',
    destination: 'Maldives',
    quote: 'A dream beyond our wildest imagination.',
    story: 'From the private seaplane arrival to the candlelit dinner on our own sandbank, The Honeymooner handled every detail with such intimacy. We didn\'t just visit the Maldives; we felt like the only two people there.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    rating: 5,
    date: 'Dec 2023'
  },
  {
    id: 't2',
    coupleName: 'Sarah & James',
    location: 'London, UK',
    destination: 'Santorini',
    quote: 'Every sunset felt like a painting made just for us.',
    story: 'The boutique villa recommended by the team was perfectly tucked away from the crowds. Our private wine tasting at sunset was the highlight of our 10-year anniversary. Truly bespoke service.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800',
    rating: 5,
    date: 'Sept 2023'
  },
  {
    id: 't3',
    coupleName: 'David & Elena',
    location: 'New York, USA',
    destination: 'Paris',
    quote: 'The level of detail was unlike anything we\'ve experienced.',
    story: 'The Honeymooner arranged a private after-hours tour of the Louvre followed by a hidden rooftop dinner overlooking the Eiffel Tower. They know the secrets of Paris that you won\'t find in any guidebook.',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=800',
    rating: 5,
    date: 'June 2023'
  }
];
