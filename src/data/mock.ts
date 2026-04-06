import type { Destination, TravelPackage, PricingTier, Lead, PricingBasis, PackageInclusion, Testimonial, BlogPost } from '../types';

export const DATA_VERSION = '1.0.2';

export const initialDestinations: Destination[] = [
  // Indian Ocean
  { id: 'd1', name: 'Maldives', country: 'Maldives', continent: 'Asia', description: 'Pristine beaches and overwater villas.', image: '/images/placeholder-travel.svg', slug: 'maldives', startingPrice: 10500, bestTimeToVisit: 'November to April', popularFor: ['Luxury', 'Private Villas'] },
  { id: 'd2', name: 'Mauritius', country: 'Mauritius', continent: 'Africa', description: 'Tropical paradise in the Indian Ocean.', image: '/images/placeholder-travel.svg', slug: 'mauritius', startingPrice: 8500, bestTimeToVisit: 'May to December', popularFor: ['Beach', 'Nature'] },
  { id: 'd3', name: 'Seychelles', country: 'Seychelles', continent: 'Africa', description: 'Stunning islands and unique wildlife.', image: '/images/placeholder-travel.svg', slug: 'seychelles', startingPrice: 9200, bestTimeToVisit: 'April to May', popularFor: ['Adventure', 'Beaches'] },
  { id: 'd4', name: 'Zanzibar', country: 'Tanzania', continent: 'Africa', description: 'Exotic spice island with white sand beaches.', image: '/images/placeholder-travel.svg', slug: 'zanzibar', startingPrice: 7500, bestTimeToVisit: 'June to October', popularFor: ['Culture', 'Beaches'] },
  { id: 'd5', name: 'Sri Lanka', country: 'Sri Lanka', continent: 'Asia', description: 'Lush jungles and ancient temples.', image: '/images/placeholder-travel.svg', slug: 'sri-lanka', startingPrice: 8500, bestTimeToVisit: 'December to March', popularFor: ['Adventure', 'Culture'] },

  // Europe
  { id: 'd6', name: 'Santorini', country: 'Greece', continent: 'Europe', description: 'Iconic white-washed buildings and sunsets.', image: '/images/placeholder-travel.svg', slug: 'santorini' },
  { id: 'd7', name: 'Amalfi Coast', country: 'Italy', continent: 'Europe', description: 'Dramatic coastline and charming villages.', image: '/images/placeholder-travel.svg', slug: 'amalfi-coast' },
  { id: 'd8', name: 'Lake Como', country: 'Italy', continent: 'Europe', description: 'Elegant lake surrounded by mountains.', image: '/images/placeholder-travel.svg', slug: 'lake-como' },
  { id: 'd9', name: 'Malta', country: 'Malta', continent: 'Europe', description: 'Historical island with beautiful lagoons.', image: '/images/placeholder-travel.svg', slug: 'malta' },
  { id: 'd10', name: 'Paris', country: 'France', continent: 'Europe', description: 'The city of light and love.', image: '/images/placeholder-travel.svg', slug: 'paris' },
  { id: 'd11', name: 'Mykonos', country: 'Greece', continent: 'Europe', description: 'Cosmopolitan island with vibrant nightlife.', image: '/images/placeholder-travel.svg', slug: 'mykonos' },
  { id: 'd12', name: 'Portugal', country: 'Portugal', continent: 'Europe', description: 'Stunning coastline and rich history.', image: '/images/placeholder-travel.svg', slug: 'portugal' },
  { id: 'd13', name: 'Geneva', country: 'Switzerland', continent: 'Europe', description: 'Picturesque city on the shores of Lake Geneva.', image: '/images/placeholder-travel.svg', slug: 'geneva' },
  { id: 'd14', name: 'Berlin', country: 'Germany', continent: 'Europe', description: 'Dynamic capital with a rich history.', image: '/images/placeholder-travel.svg', slug: 'berlin' },
  { id: 'd15', name: 'Prague', country: 'Czech Republic', continent: 'Europe', description: 'Gothic architecture and fairy-tale streets.', image: '/images/placeholder-travel.svg', slug: 'prague' },
  { id: 'd16', name: 'Vienna', country: 'Austria', continent: 'Europe', description: 'Imperial palaces and classical music history.', image: '/images/placeholder-travel.svg', slug: 'vienna' },
  { id: 'd17', name: 'Interlaken', country: 'Switzerland', continent: 'Europe', description: 'Adventure capital in the heart of the Alps.', image: '/images/placeholder-travel.svg', slug: 'interlaken' },

  // Asia
  { id: 'd18', name: 'Bali', country: 'Indonesia', continent: 'Asia', description: 'Lush jungles and tropical paradise.', image: '/images/placeholder-travel.svg', slug: 'bali' },
  { id: 'd19', name: 'Thailand', country: 'Thailand', continent: 'Asia', description: 'Land of smiles and beautiful islands.', image: '/images/placeholder-travel.svg', slug: 'thailand' },
  { id: 'd20', name: 'Japan', country: 'Japan', continent: 'Asia', description: 'Blend of ancient traditions and modern technology.', image: '/images/placeholder-travel.svg', slug: 'japan' },
  { id: 'd21', name: 'South Korea', country: 'South Korea', continent: 'Asia', description: 'Vibrant cities and serene temples.', image: '/images/placeholder-travel.svg', slug: 'south-korea' },

  // Africa (Other than Indian Ocean)
  { id: 'd22', name: 'Johannesburg', country: 'South Africa', continent: 'Africa', description: 'Vibrant hub with rich culture.', image: '/images/placeholder-travel.svg', slug: 'johannesburg' },
  { id: 'd23', name: 'Cape Town', country: 'South Africa', continent: 'Africa', description: 'Stunning coastal city under Table Mountain.', image: '/images/placeholder-travel.svg', slug: 'cape-town' },
  { id: 'd24', name: 'Cape Verde', country: 'Cape Verde', continent: 'Africa', description: 'Unique blend of African and European cultures.', image: '/images/placeholder-travel.svg', slug: 'cape-verde' },
  { id: 'd25', name: 'Nairobi', country: 'Kenya', continent: 'Africa', description: 'Green city under the sun.', image: '/images/placeholder-travel.svg', slug: 'nairobi' },
  { id: 'd26', name: 'Mombasa', country: 'Kenya', continent: 'Africa', description: 'Historical coastal city with white beaches.', image: '/images/placeholder-travel.svg', slug: 'mombasa' },
  { id: 'd27', name: 'Marrakesh', country: 'Morocco', continent: 'Africa', description: 'Vibrant markets and stunning palaces.', image: '/images/placeholder-travel.svg', slug: 'marrakesh' },

  // Americas & Caribbean
  { id: 'd28', name: 'Jamaica', country: 'Jamaica', continent: 'Caribbean', description: 'Island of reggae and beautiful beaches.', image: '/images/placeholder-travel.svg', slug: 'jamaica' },
  { id: 'd29', name: 'Hawaii', country: 'USA', continent: 'Americas', description: 'Tropical volcanic islands with aloha spirit.', image: '/images/placeholder-travel.svg', slug: 'hawaii' },
  { id: 'd30', name: 'Cancun', country: 'Mexico', continent: 'Americas', description: 'Vibrant resort city with turquoise waters.', image: '/images/placeholder-travel.svg', slug: 'cancun' },
  { id: 'd31', name: 'Puerto Rico', country: 'USA', continent: 'Caribbean', description: 'Rich history and stunning beaches.', image: '/images/placeholder-travel.svg', slug: 'puerto-rico' },
  { id: 'd32', name: 'Chile', country: 'Chile', continent: 'Americas', description: 'Diverse landscapes from deserts to glaciers.', image: '/images/placeholder-travel.svg', slug: 'chile' },
  { id: 'd33', name: 'Tulum', country: 'Mexico', continent: 'Americas', description: 'Ancient ruins overlooking the Caribbean Sea.', image: '/images/placeholder-travel.svg', slug: 'tulum' },
  { id: 'd34', name: 'Panama', country: 'Panama', continent: 'Americas', description: 'Hub of the Americas with a famous canal.', image: '/images/placeholder-travel.svg', slug: 'panama' },
  { id: 'd35', name: 'Los Cabos', country: 'Mexico', continent: 'Americas', description: 'Where the desert meets the sea.', image: '/images/placeholder-travel.svg', slug: 'los-cabos' },
  { id: 'd36', name: 'Mendoza', country: 'Argentina', continent: 'Americas', description: 'Wine country at the foot of the Andes.', image: '/images/placeholder-travel.svg', slug: 'mendoza' },
  { id: 'd37', name: 'Peru', country: 'Peru', continent: 'Americas', description: 'Ancient history and breathtaking landscapes.', image: '/images/placeholder-travel.svg', slug: 'peru' },
  { id: 'd38', name: 'Barbados', country: 'Barbados', continent: 'Caribbean', description: 'Beautiful beaches and vibrant culture.', image: '/images/placeholder-travel.svg', slug: 'barbados' },
  { id: 'd39', name: 'St Lucia', country: 'St Lucia', continent: 'Caribbean', description: 'Dramatic pitons and lush rainforests.', image: '/images/placeholder-travel.svg', slug: 'st-lucia' },
  { id: 'd40', name: 'Bahamas', country: 'Bahamas', continent: 'Caribbean', description: 'Crystal clear waters and stunning islands.', image: '/images/placeholder-travel.svg', slug: 'bahamas' },
  { id: 'd41', name: 'Antigua', country: 'Antigua and Barbuda', continent: 'Caribbean', description: 'Island of 365 beaches.', image: '/images/placeholder-travel.svg', slug: 'antigua' },
  { id: 'd42', name: 'Turks & Caicos', country: 'Turks and Caicos Islands', continent: 'Caribbean', description: 'Luxury and world-class beaches.', image: '/images/placeholder-travel.svg', slug: 'turks-caicos' },
  { id: 'd43', name: 'Aruba', country: 'Aruba', continent: 'Caribbean', description: 'Sunny island with white sand beaches.', image: '/images/placeholder-travel.svg', slug: 'aruba' },

  // Oceania
  { id: 'd44', name: 'Bora Bora', country: 'French Polynesia', continent: 'Oceania', description: 'Iconic overwater bungalows and lagoons.', image: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/romeo-a-oSIoto5nhqU-unsplash-scaled.jpg', slug: 'bora-bora' },
  { id: 'd45', name: 'Fiji', country: 'Fiji', continent: 'Oceania', description: 'Tropical paradise with warm hospitality.', image: '/images/placeholder-travel.svg', slug: 'fiji' },

  // Middle East
  { id: 'd46', name: 'Dubai', country: 'UAE', continent: 'Middle East', description: 'Modern luxury and architectural wonders.', image: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/cedric-dhaenens-69_7CRJUIOc-unsplash-scaled.jpg', slug: 'dubai' },
  { id: 'd47', name: 'Doha', country: 'Qatar', continent: 'Middle East', description: 'Futuristic city with traditional roots.', image: '/images/placeholder-travel.svg', slug: 'doha' },
  { id: 'd48', name: 'Jordan', country: 'Jordan', continent: 'Middle East', description: 'Ancient history and stunning desert landscapes.', image: '/images/placeholder-travel.svg', slug: 'jordan' },
  { id: 'd49', name: 'Bahrain', country: 'Bahrain', continent: 'Middle East', description: 'Island nation with a blend of tradition and modernity.', image: '/images/placeholder-travel.svg', slug: 'bahrain' },
  { id: 'd50', name: 'Abu Dhabi', country: 'UAE', continent: 'Middle East', description: 'Capital of luxury and cultural icons.', image: '/images/placeholder-travel.svg', slug: 'abu-dhabi' },
];

export const initialPackages: TravelPackage[] = [];

// Helper to create tiers
const createTiers = (p: number, l: number, u: number, basis: PricingBasis): PricingTier[] => [
  { id: Math.random().toString(36).substr(2, 9), name: 'Premium', price: p, basis },
  { id: Math.random().toString(36).substr(2, 9), name: 'Luxuria', price: l, basis },
  { id: Math.random().toString(36).substr(2, 9), name: 'Ultra Luxuria', price: u, basis },
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
  { day: 3, title: 'Spa & Wellness Escape', description: 'Indulge in a couple\'s signature spa treatment followed by a relaxing afternoon by the infinity pool.', activity: 'Signature Spa' },
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

// Honeymoon-only pricing matrix (per couple)
const honeymoonPackageData: PackageDataItem[] = [
  // Indian Ocean
  { destId: 'd1', p: 10500, l: 14800, u: 25200, basis: 'per couple' },
  { destId: 'd2', p: 8500, l: 10800, u: 25600, basis: 'per couple' },
  { destId: 'd3', p: 9200, l: 12800, u: 28500, basis: 'per couple' },
  { destId: 'd4', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
  { destId: 'd5', p: 8500, l: 10200, u: 18000, basis: 'per couple' },

  // Europe
  { destId: 'd6', p: 5500, l: 10800, u: 15200, basis: 'per couple' },
  { destId: 'd7', p: 4800, l: 8700, u: 13500, basis: 'per couple' },
  { destId: 'd8', p: 5800, l: 9200, u: 17600, basis: 'per couple' },
  { destId: 'd9', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
  { destId: 'd10', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
  { destId: 'd11', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
  { destId: 'd12', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
  { destId: 'd13', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
  { destId: 'd14', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
  { destId: 'd15', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
  { destId: 'd16', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
  { destId: 'd17', p: 7500, l: 9800, u: 15200, basis: 'per couple' },

  // Asia
  { destId: 'd18', p: 6500, l: 10800, u: 15200, basis: 'per couple' },
  { destId: 'd19', p: 7500, l: 11800, u: 23600, basis: 'per couple' },
  { destId: 'd20', p: 9200, l: 12800, u: 28500, basis: 'per couple' },
  { destId: 'd21', p: 7500, l: 9800, u: 15200, basis: 'per couple' },

  // Africa
  { destId: 'd22', p: 5100, l: 9400, u: 12200, basis: 'per couple' },
  { destId: 'd23', p: 7200, l: 10700, u: 15300, basis: 'per couple' },
  { destId: 'd24', p: 5300, l: 7900, u: 10300, basis: 'per couple' },
  { destId: 'd25', p: 4800, l: 6800, u: 10200, basis: 'per couple' },
  { destId: 'd26', p: 5600, l: 7500, u: 10900, basis: 'per couple' },
  { destId: 'd27', p: 4800, l: 6500, u: 9400, basis: 'per couple' },

  // Americas & Caribbean
  { destId: 'd28', p: 10500, l: 14800, u: 15200, basis: 'per couple' },
  { destId: 'd29', p: 8500, l: 10800, u: 25600, basis: 'per couple' },
  { destId: 'd30', p: 5500, l: 12800, u: 28500, basis: 'per couple' },
  { destId: 'd31', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
  { destId: 'd32', p: 5800, l: 10600, u: 16900, basis: 'per couple' },
  { destId: 'd33', p: 6800, l: 13200, u: 27900, basis: 'per couple' },
  { destId: 'd34', p: 4500, l: 5800, u: 12500, basis: 'per couple' },
  { destId: 'd35', p: 5500, l: 12800, u: 28500, basis: 'per couple' },
  { destId: 'd36', p: 6800, l: 13200, u: 27900, basis: 'per couple' },
  { destId: 'd37', p: 5500, l: 12800, u: 28500, basis: 'per couple' },
  { destId: 'd38', p: 8500, l: 10800, u: 25600, basis: 'per couple' },
  { destId: 'd39', p: 8500, l: 10800, u: 25600, basis: 'per couple' },
  { destId: 'd40', p: 8500, l: 10800, u: 25600, basis: 'per couple' },
  { destId: 'd41', p: 8500, l: 10800, u: 25600, basis: 'per couple' },
  { destId: 'd42', p: 8500, l: 10800, u: 25600, basis: 'per couple' },
  { destId: 'd43', p: 8500, l: 10800, u: 25600, basis: 'per couple' },

  // Oceania
  { destId: 'd44', p: 25000, l: 32800, u: 45000, basis: 'per couple' },
  { destId: 'd45', p: 15500, l: 25800, u: 33600, basis: 'per couple' },

  // Middle East
  { destId: 'd46', p: 6500, l: 10800, u: 15200, basis: 'per couple' },
  { destId: 'd47', p: 7500, l: 11800, u: 23600, basis: 'per couple' },
  { destId: 'd48', p: 9200, l: 12800, u: 28500, basis: 'per couple' },
  { destId: 'd49', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
  { destId: 'd50', p: 7500, l: 9800, u: 15200, basis: 'per couple' },
];

honeymoonPackageData.forEach((item) => {
  const category = 'honeymoon';
    const dest = initialDestinations.find(d => d.id === item.destId);
    if (dest) {
      const styleTags = [];
      if (['Maldives', 'Mauritius', 'Seychelles', 'Barbados', 'Bora Bora', 'Fiji', 'Bahamas', 'Antigua'].includes(dest.name)) styleTags.push('Beach Romance');
      if (['Santorini', 'Maldives', 'Bora Bora', 'Fiji', 'Zanzibar'].includes(dest.name)) styleTags.push('Island Bliss');
      if (['Jordan', 'Swiss Alps', 'Cappadocia'].includes(dest.name)) styleTags.push('Mountain Escape');
      if (['Paris', 'Venice', 'Rome', 'London', 'Dubai', 'Doha'].includes(dest.name)) styleTags.push('City Intimacy');
      if (styleTags.length === 0) styleTags.push('Bespoke Luxury');

      const getEmotionalSummary = (cat: string, name: string) => {
        if (cat === 'honeymoon') {
          if (name === 'Maldives') return '7 Days of private overwater luxury, sunset dinners, and curated romantic moments.';
          if (name === 'Santorini') return 'Breathtaking caldera views, private infinity pools, and candlelit dinners under the stars.';
          if (name === 'Paris') return 'The ultimate city of love with private river cruises and hidden rooftop experiences.';
          return `A personalized ${name} honeymoon experience designed around your preferences.`;
        }
        return `Luxury ${cat} trip to ${name}.`;
      };

      const getEmotionalDescription = (cat: string, name: string) => {
        if (cat === 'honeymoon') {
          if (name === 'Maldives') return 'Enjoy a world-class honeymoon experience in Maldives. Our tiered packages offer flexibility and unmatched luxury. From private overwater villas to candlelit dinners on the beach, every detail is designed for romance.';
          if (name === 'Santorini') return 'Experience the ultimate romantic escape in Santorini. Stay in luxury boutique hotels with caldera views, enjoy private wine tastings, and watch the legendary sunset from your own infinity pool.';
          return `Enjoy a world-class ${cat} experience in ${name}. Our tiered packages offer flexibility and unmatched luxury.`;
        }
        return `Enjoy a world-class ${cat} experience in ${name}. Our tiered packages offer flexibility and unmatched luxury.`;
      };

      initialPackages.push({
        id: `${category}-${item.destId}`,
        category,
        title: `${dest.name} ${category.charAt(0).toUpperCase() + category.slice(1)} Experience`,
        slug: `${dest.slug}-${category}`,
        summary: getEmotionalSummary(category, dest.name),
        description: getEmotionalDescription(category, dest.name),
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
        seo: { title: `${dest.name} ${category} | The Honeymoonner`, description: `Book your ${category} trip to ${dest.name}.`, keywords: [dest.name, category, 'luxury travel'] }
      });
    }
});

export const initialLeads: Lead[] = [];

export const initialTestimonials: Testimonial[] = [
  {
    id: 't1',
    coupleName: 'The Adewales',
    location: 'Lagos, Nigeria',
    destination: 'Maldives',
    quote: 'A dream beyond our wildest imagination.',
    story: 'From the private seaplane arrival to the candlelit dinner on our own sandbank, The Honeymoonner handled every detail with such intimacy. We didn\'t just visit the Maldives; we felt like the only two people there.',
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
    story: 'The boutique villa recommended by the team was perfectly tucked away from the crowds. Our private wine tasting at sunset was the highlight of our 10-year anniversary. Truly bespoke service.',
    image: '/images/placeholder-travel.svg',
    rating: 5,
    date: 'Sept 2023'
  },
  {
    id: 't3',
    coupleName: 'David & Elena',
    location: 'New York, USA',
    destination: 'Paris',
    quote: 'The level of detail was unlike anything we\'ve experienced.',
    story: 'The Honeymoonner arranged a private after-hours tour of the Louvre followed by a hidden rooftop dinner overlooking the Eiffel Tower. They know the secrets of Paris that you won\'t find in any guidebook.',
    image: '/images/placeholder-travel.svg',
    rating: 5,
    date: 'June 2023'
  }
];

export const initialPosts: BlogPost[] = [
  {
    id: 'p1',
    title: 'Top 10 Romantic Things to Do in Maldives',
    excerpt: 'From private sandbank dinners to swimming with manta rays, discover the most romantic experiences in the Maldives.',
    category: 'Honeymoon',
    author: 'Sarah Jenkins',
    date: '2026-03-15',
    image: '/images/placeholder-travel.svg',
    slug: 'romantic-things-to-do-maldives',
    content: `
      <p>The journey of a lifetime begins with a single step, and for many couples, that step leads to the breathtaking landscapes of the Maldives. Whether you're seeking the quiet intimacy of a private island or the vibrant energy of a luxury resort, our latest guide explores the nuances of romantic travel that often go unnoticed.</p>
      
      <h3>1. Private Sandbank Dining</h3>
      <p>Imagine being the only two people on a tiny island of white sand, surrounded by nothing but the turquoise waters of the Indian Ocean. A private chef prepares a gourmet meal as the sun dips below the horizon.</p>
      
      <h3>2. Underwater Romance</h3>
      <p>Dine five meters below the surface at Ithaa, the world's first all-glass undersea restaurant, or simply snorkel together through vibrant coral gardens.</p>
      
      <p>The secret to a stress-free escape lies in the preparation. Our team of specialists spends hundreds of hours each year vetting every location, ensuring that when you arrive, the only thing you have to focus on is each other.</p>
    `,
    readTime: '5 min read'
  },
  {
    id: 'p2',
    title: 'The Ultimate Guide to Santorini Sunsets',
    excerpt: 'Find the best hidden spots in Oia and Fira to watch the legendary Santorini sunset without the crowds.',
    category: 'Destinations',
    author: 'James Wilson',
    date: '2026-02-28',
    image: '/images/placeholder-travel.svg',
    slug: 'santorini-sunset-guide',
    content: `
      <p>Santorini is world-famous for its sunsets, but the crowds in Oia can sometimes dampen the romantic mood. Here's how to experience the magic in peace.</p>
      
      <h3>The Hidden Path to Imerovigli</h3>
      <p>While Oia gets all the attention, Imerovigli offers equally stunning views with a fraction of the tourists. The "balcony to the Aegean" provides a more intimate setting for that perfect sunset photo.</p>
      
      <h3>Private Yacht Cruises</h3>
      <p>For the ultimate experience, charter a private catamaran. Sail past the Red Beach and White Beach, enjoy a swim in the hot springs, and watch the sunset from the middle of the caldera with a glass of local Assyrtiko wine.</p>
    `,
    readTime: '4 min read'
  },
  {
    id: 'p3',
    title: 'What to Pack for Your Tropical Honeymoon',
    excerpt: 'Our comprehensive packing list ensures you have everything you need for a stress-free romantic escape.',
    category: 'Travel Tips',
    author: 'Elena Rodriguez',
    date: '2026-01-10',
    image: '/images/placeholder-travel.svg',
    slug: 'tropical-honeymoon-packing-list',
    content: `
      <p>Packing for a honeymoon is different from any other trip. You want to look your best, be prepared for adventure, and keep things light enough for those island-hopping transfers.</p>
      
      <h3>The Essentials</h3>
      <ul>
        <li>Versatile linen wear for beach-to-dinner transitions.</li>
        <li>High-quality sunscreen that won't harm coral reefs.</li>
        <li>A portable waterproof speaker for your private villa pool sessions.</li>
        <li>At least two sets of swimwear (one to wear, one to dry).</li>
      </ul>
      
      <p>Don't forget to leave room for souvenirs! The memories you bring back are precious, but a handcrafted local artifact is a beautiful physical reminder of your first journey as a married couple.</p>
    `,
    readTime: '6 min read'
  }
];
