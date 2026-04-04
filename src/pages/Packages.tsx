import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { useCurrency } from '../hooks/useCurrency';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Heart, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { useUser } from '../hooks/useUser';
import { dataService } from '../services/dataService';
import { PACKAGE_COLLECTIONS } from '../config/packageCollections';

function normalizeCollectionTitle(value: string): string {
  return value.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
}

const STYLE_ALIASES: Record<string, string[]> = {
  'beach bliss': ['Beach Bliss', 'Beach Romance'],
  'island escape': ['Island Escape', 'Island Bliss'],
  'romantic adventure': ['Romantic Adventure', 'Bespoke Luxury'],
  'city romance': ['City Romance', 'City Intimacy']
};

const WP_MEDIA = {
  romantic: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1519741497674-611481863552-scaled.jpg',
  city: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1502602898657-3e91760cbb34-2-scaled.jpg',
  winter: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/fernando-gago-MY7yQ1ISEIk-unsplash-scaled.jpg',
  safari: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/pablo-heimplatz-OSboZGvoEz4-unsplash.jpg',
  island: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1439066615861-d1af74d74000-scaled.jpg',
  beach: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1507525428034-b723cf961d3e-scaled.jpg',
  adventure: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1464822759023-fed622ff2c3b-scaled.jpg',
  coupleSnow: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/yuriy-bogdanov-XuN44TajBGo-unsplash-scaled.jpg',
  dubai: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/cedric-dhaenens-69_7CRJUIOc-unsplash-scaled.jpg',
  boraBora: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/romeo-a-oSIoto5nhqU-unsplash-scaled.jpg',
  coastal: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/hugh-whyte-SBOHLtENzEY-unsplash-scaled.jpg',
  contact: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/natalya-zaritskaya-SIOdjcYotms-unsplash-scaled.jpg',
  route: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/ibrahim-mushan-B5fzqOl7BdE-unsplash-scaled.jpg',
  routeAlt: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/hoi-an-and-da-nang-photographer-f1Yk1rGf3tE-unsplash-scaled.jpg',
  story: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/khamkeo-OcxlTBbb6SY-unsplash.jpg',
  fallback: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/homepage-default-hero.jpg'
};

const MENU_THEMES = [
  {
    name: 'The Honeymoonner Signature Experience',
    image: WP_MEDIA.coupleSnow,
    perfectFor: 'Couples who want a premium surprise-led honeymoon',
    highlights: [
      'Surprise itinerary elements',
      'Cinematic love story photoshoot',
      'Personalized gifts and storytelling',
      'Scripture-based blessings'
    ],
    destinations: ['Curated globally based on couple preferences'],
    tagline: 'Not just a honeymoon... a love story designed by The Honeymoonner.'
  },
  {
    name: 'Cultural and Spiritual Romance',
    image: WP_MEDIA.story,
    perfectFor: 'Deep, meaningful couples',
    highlights: ['History, culture, spiritual depth'],
    destinations: ['Morocco', 'Turkey', 'Israel', 'Egypt'],
    tagline: 'Love with meaning, not just moments.'
  },
  {
    name: 'City Lights Romance',
    image: WP_MEDIA.city,
    perfectFor: 'Urban, stylish couples',
    highlights: ['Fine dining', 'Nightlife', 'Shopping'],
    destinations: ['Paris', 'London', 'New York City', 'Tokyo'],
    tagline: 'Love shines brighter in the city.'
  },
  {
    name: 'Winter Wonderland Romance',
    image: WP_MEDIA.winter,
    perfectFor: 'Couples who want something different',
    highlights: ['Snow escapes', 'Fireplaces', 'Hot chocolate vibes'],
    destinations: ['Switzerland', 'Iceland', 'Lapland'],
    tagline: 'Love in the cold, hearts on fire.'
  },
  {
    name: 'Safari and Beach Combo',
    image: WP_MEDIA.safari,
    perfectFor: 'Couples who want adventure and relaxation',
    highlights: ['Wildlife and beach in one trip', 'Popular for Africans and internationals'],
    destinations: ['Kenya and Zanzibar', 'South Africa and Mauritius'],
    tagline: 'Wild love meets ocean calm.'
  },
  {
    name: 'Island Hopping Romance',
    image: WP_MEDIA.island,
    perfectFor: 'Couples who love water and aesthetics',
    highlights: ['Move between islands', 'Boat rides, beach clubs, sunsets'],
    destinations: ['Greece', 'Maldives', 'Caribbean', 'Philippines'],
    tagline: 'Every island, a new love story.'
  },
  {
    name: 'Multi-Destination Adventure Love',
    image: WP_MEDIA.adventure,
    perfectFor: 'Couples who want variety and memories',
    highlights: ['2-4 countries in one honeymoon', 'Mix of city, nature, and beach'],
    destinations: ['Dubai/Doha -> Bali -> Singapore', 'Paris -> Rome -> Santorini'],
    tagline: 'One love, multiple destinations.'
  },
  {
    name: 'Ultra Luxury',
    image: WP_MEDIA.dubai,
    perfectFor: 'High-net-worth couples and aspirational clients',
    highlights: ['Overwater villas', 'Private jets', 'Yacht dinners', 'VIP experiences'],
    destinations: ['Maldives', 'Dubai', 'Santorini', 'Amalfi Coast'],
    tagline: 'If money was not a problem... this is it.'
  },
  {
    name: 'Soft Luxury Escape (Starter Honeymoon)',
    image: WP_MEDIA.beach,
    perfectFor: 'Budget-conscious couples who still want elegance',
    highlights: ['Africa plus island combo', '4-star resorts, spa treatments, beach dinners', 'Slow and romantic pace'],
    destinations: ['Zanzibar', 'Cape Verde', 'Mauritius'],
    tagline: 'Luxury, but make it attainable.'
  }
];

const DESTINATION_COMBOS = [
  {
    name: 'West Africa -> Island -> South Africa',
    image: WP_MEDIA.route,
    route: ['Port of Departure', 'Cotonou', 'Cape Verde', 'Cape Town', 'Johannesburg', 'Lagos']
  },
  {
    name: 'The Asian Love Tour',
    image: WP_MEDIA.routeAlt,
    route: ['Port of Departure', 'Accra', 'Bali', 'Bangkok', 'Singapore', 'Malaysia', 'Lagos']
  },
  {
    name: 'East Africa -> Southern Africa (Safari + Beach Combo)',
    image: WP_MEDIA.safari,
    route: ['Port of Departure', 'Nairobi', 'Zanzibar', 'Cape Town', 'Namibia', 'Addis Ababa', 'Lagos']
  },
  {
    name: 'Classic South Africa Loop',
    image: WP_MEDIA.coastal,
    route: ['Port of Departure', 'Nairobi', 'Zanzibar', 'Cape Town', 'Johannesburg', 'Port of Arrival']
  },
  {
    name: 'Ultra Romance Route',
    image: WP_MEDIA.romantic,
    route: ['Port of Departure', 'Nairobi', 'Mauritius', 'Cape Town', 'Johannesburg', 'Port of Arrival']
  },
  {
    name: 'Europe Love Trail',
    image: WP_MEDIA.city,
    route: ['Port of Departure', 'Paris', 'Santorini', 'Rome', 'Venice']
  },
  {
    name: 'Turkey + Greece Romance',
    image: WP_MEDIA.island,
    route: ['Port of Departure', 'Istanbul', 'Cappadocia', 'Santorini', 'Mykonos']
  },
  {
    name: 'Morocco + Zanzibar (Culture + Beach)',
    image: WP_MEDIA.contact,
    route: ['Port of Departure', 'Marrakech', 'Sahara', 'Zanzibar']
  },
  {
    name: 'The Island Obsession',
    image: WP_MEDIA.boraBora,
    route: ['Maldives + UAE', 'Bora Bora', 'Seychelles + Mauritius']
  },
  {
    name: 'European Love Trail (Extended)',
    image: WP_MEDIA.winter,
    route: ['Paris', 'Venice', 'Amalfi Coast', 'Switzerland', 'Rome', 'Florence']
  },
  {
    name: 'Caribbean Slow Love',
    image: WP_MEDIA.beach,
    route: ['Saint Lucia', 'Jamaica + Bahamas', 'Antigua and Barbuda']
  },
  {
    name: 'Safari + Luxe Beach',
    image: WP_MEDIA.safari,
    route: ['Kenya -> Zanzibar', 'Tanzania (Serengeti) -> Seychelles', 'South Africa -> Mauritius']
  },
  {
    name: 'USA Dream Honeymoon',
    image: WP_MEDIA.fallback,
    route: ['Hawaii (Maui/Oahu)', 'Napa Valley -> Los Angeles', 'New York City -> Las Vegas']
  }
];

function matchesStyleFilter(pkgTags: string[], selectedStyle: string): boolean {
  if (selectedStyle === 'all') return true;
  const normalized = selectedStyle.trim().toLowerCase();
  const candidates = STYLE_ALIASES[normalized] || [selectedStyle];
  return candidates.some((candidate) => pkgTags.includes(candidate));
}

const Packages = () => {
  const location = useLocation();
  const { packages, destinations, isLoading } = useData();
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedStyle, setSelectedCategoryStyle] = useState(() => location.state?.style || 'all');
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  const getCollectionPath = (name: string) => {
    const collection = PACKAGE_COLLECTIONS.find((item) => normalizeCollectionTitle(item.title) === normalizeCollectionTitle(name));
    return collection ? `/packages/type/${collection.slug}` : '/packages';
  };

  // Adjust style filter when navigation state changes (e.g. user clicks a style on Home page)
  useEffect(() => {
    setSelectedCategoryStyle(location.state?.style || 'all');
  }, [location.state?.style]);

  useEffect(() => {
    if (location.state?.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.state?.style]);

  useEffect(() => {
    let ignore = false;
    dataService.getWishlist().then(items => {
      if (!ignore) setWishlistItems(items);
    }).catch(() => {
      if (!ignore) setWishlistItems([]);
    });
    return () => { ignore = true; };
  }, [isAuthenticated]);

  const toggleWishlist = async (pkgId: string) => {
    if (!isAuthenticated) {
      navigate('/account', { state: { from: '/packages' } });
      return;
    }
    const current = wishlistItems;
    const next = current.includes(pkgId) ? current.filter(id => id !== pkgId) : [...current, pkgId];
    const ok = await dataService.updateWishlist(next);
    if (ok) setWishlistItems(next);
  };

  const filteredPackages = packages.filter(pkg => {
    if (pkg.category !== 'honeymoon') return false;
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pkg.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const destination = destinations.find(d => d.id === pkg.destinationId);
    const matchesDestination = selectedDestination === 'all' || destination?.slug === selectedDestination;
    const matchesStyle = matchesStyleFilter(pkg.tags, selectedStyle);
    
    return matchesSearch && matchesDestination && matchesStyle;
  });

  if (isLoading) {
    return (
      <div className="pt-32 min-h-screen section-container flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-brand-600 font-serif text-xl italic">Loading travel packages...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="pt-24 min-h-screen"
    >
      <Breadcrumbs />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/ibrahim-mushan-B5fzqOl7BdE-unsplash-scaled.jpg" 
            alt="Travel Packages" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-[1px]" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="script-font mb-4 block"
          >
            Our Collections
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-2xl"
          >
            Travel Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-50 max-w-2xl mx-auto text-lg leading-relaxed font-medium"
          >
            Discover our handpicked selection of the world's most romantic honeymoon escapes.
          </motion.p>
        </div>
      </section>

      <div className="section-container pb-24">
        {/* Filters */}
        <div className="space-y-6 mb-16">
          <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-brand-100 flex flex-col lg:flex-row gap-6 sm:gap-8 items-center justify-between">
            <div className="relative w-full lg:w-[450px]">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-accent">
                <Heart size={20} className="fill-brand-accent/20" />
              </div>
              <input
                type="text"
                placeholder="Where does your heart lead you?..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-3 sm:py-4 rounded-full bg-brand-50 border-2 border-transparent focus:border-brand-accent/30 focus:bg-white focus:ring-4 focus:ring-brand-accent/5 transition-all text-brand-900 placeholder:text-brand-300 font-serif italic text-base sm:text-lg shadow-inner"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
              <div className="flex items-center gap-4 w-full sm:w-auto bg-brand-50 px-6 py-3 sm:py-4 rounded-full border-2 border-transparent focus-within:border-brand-accent/30 focus-within:bg-white transition-all">
                <MapPin className="text-brand-accent" size={18} />
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="bg-transparent border-none py-0 px-2 text-brand-900 focus:ring-0 appearance-none cursor-pointer font-medium text-sm sm:text-base min-w-[160px] sm:min-w-[180px]"
                >
                  <option value="all">Everywhere</option>
                  {destinations.map(d => (
                    <option key={d.id} value={d.slug}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Style Tag */}
          {selectedStyle !== 'all' && (
            <div className="flex items-center justify-center gap-4">
              <div className="bg-brand-accent/10 text-brand-accent px-6 py-2 rounded-full border border-brand-accent/20 flex items-center gap-3">
                <span className="text-sm font-medium uppercase tracking-widest">Style: {selectedStyle}</span>
                <button 
                  onClick={() => setSelectedCategoryStyle('all')}
                  className="p-1 hover:bg-brand-accent hover:text-white rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <button 
                onClick={() => setSelectedCategoryStyle('all')}
                className="text-brand-400 text-xs font-bold uppercase tracking-widest hover:text-brand-accent transition-colors"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Themes */}
        <section id="themes" className="mb-16 sm:mb-20">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-bold text-brand-accent mb-4">Themes</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-900 mb-4">Curated Honeymoon Themes</h2>
            <p className="text-brand-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
              Thoughtfully designed experiences for different travel styles, budgets, and personalities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {MENU_THEMES.map((theme, idx) => (
              <Link key={theme.name} to={getCollectionPath(theme.name)} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative bg-white rounded-3xl border border-brand-100 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
                >
                    <div className="relative h-44 sm:h-48 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 overflow-hidden rounded-t-3xl">
                      <img
                        src={theme.image}
                        alt={theme.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/55 via-brand-900/15 to-transparent" />
                    </div>

                  <div className="absolute left-6 right-6 top-0 h-1 rounded-b-full bg-gradient-to-r from-brand-accent/20 via-brand-accent to-brand-accent/20" />

                  <h3 className="text-xl sm:text-2xl font-serif text-brand-900 mb-3 leading-snug pt-2">{theme.name}</h3>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-brand-accent mb-4">Perfect for: {theme.perfectFor}</p>

                  <ul className="space-y-2.5 mb-5">
                    {theme.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-brand-700 leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-accent/70 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-400 mb-2">Destinations</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {theme.destinations.map((destination) => (
                      <span key={destination} className="text-xs bg-brand-50 border border-brand-100 rounded-full px-3 py-1 text-brand-700">
                        {destination}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm italic text-brand-600 border-l-2 border-brand-accent/30 pl-3">"{theme.tagline}"</p>
                  <p className="mt-6 text-[10px] uppercase tracking-[0.25em] font-bold text-brand-accent">Open collection</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Multi-Destination Combos */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-bold text-brand-accent mb-4">Multiple Destination Combos</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-900 mb-4">Popular Route Ideas</h2>
            <p className="text-brand-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
              These route collections can be customized to each couple's budget, visa profile, and travel goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {DESTINATION_COMBOS.map((combo, idx) => (
              <Link key={combo.name} to={getCollectionPath(combo.name)} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white border border-brand-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all h-full"
                >
                    <div className="relative h-40 sm:h-44 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-5 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                      <img
                        src={combo.image}
                        alt={combo.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/55 via-brand-900/15 to-transparent" />
                    </div>

                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-400 mb-2">Route {idx + 1}</p>
                  <h3 className="text-lg sm:text-xl font-serif text-brand-900 mb-4">{combo.name}</h3>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {combo.route.map((stop, stopIdx) => (
                      <div key={`${combo.name}-${stop}`} className="flex items-center gap-2.5">
                        <span className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-brand-100 bg-brand-50 text-brand-700">
                          {stop}
                        </span>
                        {stopIdx < combo.route.length - 1 && <span className="text-brand-300 text-xs">{'->'}</span>}
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-[10px] uppercase tracking-[0.25em] font-bold text-brand-accent">Open route</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="romantic-card group flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={pkg.featuredImage}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button
                  aria-label={wishlistItems.includes(pkg.id) ? 'Saved to wishlist' : 'Save to wishlist'}
                  onClick={() => toggleWishlist(pkg.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-brand-accent hover:scale-105 transition"
                >
                  <Heart
                    size={18}
                    className={wishlistItems.includes(pkg.id) ? 'text-brand-accent' : 'text-brand-400'}
                    fill={wishlistItems.includes(pkg.id) ? 'currentColor' : 'none'}
                  />
                </button>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-brand-900/60 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold rounded-full">
                    {pkg.category}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    <span>{pkg.duration.days} Days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={12} />
                    <span>{destinations.find(d => d.id === pkg.destinationId)?.name}</span>
                  </div>
                </div>

                <h3 className="text-xl font-serif text-brand-900 mb-4 group-hover:text-brand-accent transition-colors">
                  {pkg.title}
                </h3>
                <p className="text-brand-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-2">
                  {pkg.summary}
                </p>

                <div className="pt-6 border-t border-brand-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-brand-400 mb-1">
                      Starting from
                    </p>
                    <p className="text-xl font-serif text-brand-900">
                      {formatPrice(pkg.tiers[0].price)}
                    </p>
                  </div>
                  <Link to={`/packages/${pkg.slug}`} className="btn-primary py-2 px-6 text-xs">
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-24">
            <p className="text-brand-400 text-lg">No packages found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDestination('all');
                setSelectedCategoryStyle('all');
              }}
              className="text-brand-accent font-medium mt-4 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Packages;
