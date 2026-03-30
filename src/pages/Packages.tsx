import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { useCurrency } from '../hooks/useCurrency';
import { motion } from 'framer-motion';
import { Filter, Calendar, MapPin, Heart, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { useUser } from '../hooks/useUser';
import { dataService } from '../services/dataService';

const Packages = () => {
  const location = useLocation();
  const { packages, destinations } = useData();
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedCategoryStyle] = useState(() => location.state?.style || 'all');
  const [prevStyle, setPrevStyle] = useState(location.state?.style);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  // Adjust state when location state changes (e.g. user clicks a style on Home page)
  if (location.state?.style !== prevStyle) {
    setPrevStyle(location.state?.style);
    setSelectedCategoryStyle(location.state?.style || 'all');
  }

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
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pkg.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const destination = destinations.find(d => d.id === pkg.destinationId);
    const matchesDestination = selectedDestination === 'all' || destination?.slug === selectedDestination;
    const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    const matchesStyle = selectedStyle === 'all' || pkg.tags.includes(selectedStyle);
    
    return matchesSearch && matchesDestination && matchesCategory && matchesStyle;
  });

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
            src="https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=2070" 
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
            Discover our handpicked selection of the world's most romantic escapes, family vacations, and group adventures.
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
                <Filter className="text-brand-accent" size={18} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none py-0 px-2 text-brand-900 focus:ring-0 appearance-none cursor-pointer font-medium text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
                >
                  <option value="all">All Love Stories</option>
                  <option value="honeymoon">Honeymoons</option>
                  <option value="family">Family Love</option>
                  <option value="group">Shared Journeys</option>
                </select>
              </div>

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
              onClick={() => { setSearchTerm(''); setSelectedDestination('all'); setSelectedCategory('all'); }}
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
