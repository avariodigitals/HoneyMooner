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
import SEO from '../components/layout/SEO';

const STYLE_ALIASES: Record<string, string[]> = {
  'beach bliss': ['Beach Bliss', 'Beach Romance'],
  'island escape': ['Island Escape', 'Island Bliss'],
  'romantic adventure': ['Romantic Adventure', 'Bespoke Luxury'],
  'city romance': ['City Romance', 'City Intimacy']
};


function matchesStyleFilter(pkgTags: string[], selectedStyle: string): boolean {
  if (selectedStyle === 'all') return true;
  const normalized = selectedStyle.trim().toLowerCase();
  const candidates = STYLE_ALIASES[normalized] || [selectedStyle];
  return candidates.some((candidate) => pkgTags.includes(candidate));
}

const Packages = () => {
  const HANDPICKED_ROTATION_KEY = 'honeymoonner:handpicked-rotation-index';
  const location = useLocation();
  const { packages, destinations, isLoading } = useData();
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedStyle, setSelectedCategoryStyle] = useState(() => location.state?.style || 'all');
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [handpickedStartIndex, setHandpickedStartIndex] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const stored = window.localStorage.getItem(HANDPICKED_ROTATION_KEY);
    const parsed = stored ? Number.parseInt(stored, 10) : Number.NaN;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  });

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
          <SEO
            title="Honeymoon Packages"
            description="Browse curated honeymoon and romantic travel packages with flexible tiers, handpicked experiences, and expert planning support."
            keywords="honeymoon packages, luxury romantic trips, curated travel experiences"
          />
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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const listLength = filteredPackages.length;
    if (listLength === 0) {
      setHandpickedStartIndex(0);
      return;
    }

    const rawStored = window.localStorage.getItem(HANDPICKED_ROTATION_KEY);
    const storedIndex = rawStored ? Number.parseInt(rawStored, 10) : 0;
    const safeStoredIndex = Number.isFinite(storedIndex) && storedIndex >= 0 ? storedIndex : 0;

    let nextIndex = listLength <= 3 ? 0 : safeStoredIndex % listLength;

    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const isReload = navEntry?.type === 'reload';

    // Advance only on browser reload, not while user stays on the page.
    if (isReload && listLength > 3) {
      nextIndex = (nextIndex + 1) % listLength;
    }

    setHandpickedStartIndex(nextIndex);
    window.localStorage.setItem(HANDPICKED_ROTATION_KEY, String(nextIndex));
  }, [filteredPackages.length]);

  const handpickedPackages = filteredPackages.length <= 3
    ? filteredPackages
    : Array.from({ length: 3 }, (_, idx) => filteredPackages[(handpickedStartIndex + idx) % filteredPackages.length]);

  const renderPackageCard = (pkg: typeof filteredPackages[number]) => (
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
            <span>Based on package</span>
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
  );

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
      <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden mb-14 sm:mb-20">
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

        {/* Handpicked */}
        {searchTerm.trim() === '' && selectedDestination === 'all' && selectedStyle === 'all' && (
          <section className="mb-12 sm:mb-14 rounded-3xl border border-brand-accent/20 bg-gradient-to-b from-brand-accent/10 to-white px-4 sm:px-6 py-8 sm:py-10 shadow-sm">
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-bold text-brand-accent mb-4">Packages</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-900 mb-4">Handpicked for You</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {handpickedPackages.map((pkg) => renderPackageCard(pkg))}
            </div>
          </section>
        )}

        {/* All Packages */}
        <section className="mb-8 sm:mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => renderPackageCard(pkg))}
          </div>
        </section>

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
