import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useData } from '../hooks/useData';
import { useCurrency } from '../hooks/useCurrency';
import { dataService } from '../services/dataService';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { 
  Heart, 
  MapPin, 
  ArrowRight, 
  Trash2, 
  Clock,
  ChevronRight
} from 'lucide-react';

const Wishlist = () => {
  const { user } = useUser();
  const { packages, destinations } = useData();
  const { formatPrice } = useCurrency();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      const items = await dataService.getWishlist();
      setWishlistItems(items);
      setIsLoading(false);
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (id: string) => {
    const newWishlist = wishlistItems.filter(item => item !== id);
    setWishlistItems(newWishlist);
    await dataService.updateWishlist(newWishlist);
  };

  const wishlistedPackages = packages.filter(pkg => wishlistItems.includes(pkg.id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs Overlay - Fixed positioning */}
      <div className="pt-24 lg:pt-28 pb-4">
        <Breadcrumbs />
      </div>

      {/* Romantic Hero Section - Responsive height */}
      <section className="relative min-h-[40vh] lg:h-[50vh] flex items-center justify-center overflow-hidden py-12 lg:py-0">
        <div className="absolute inset-0">
          <img 
            src="/images/placeholder-travel.svg" 
            className="w-full h-full object-cover brightness-[0.6]"
            alt="Romantic Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/40 via-transparent to-white" />
        </div>
        
        <div className="relative z-10 text-center space-y-4 lg:space-y-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 lg:px-6 py-1.5 lg:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] lg:text-sm font-bold uppercase tracking-[0.2em] lg:tracking-[0.3em]"
          >
            <Heart size={14} className="lg:w-4 lg:h-4" fill="currentColor" />
            My Account
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-serif text-white leading-tight drop-shadow-2xl"
          >
            {user?.first_name || 'My Dear'}, <br />
            <span className="italic font-light">Your Collection of Dreams</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white/80 text-base lg:text-xl font-light italic max-w-2xl mx-auto drop-shadow-lg"
          >
            "Great trips start with a shared plan."
          </motion.p>
        </div>
      </section>

      <div className="section-container relative z-20 pb-24 lg:pb-32 -mt-12 lg:-mt-16">
        {/* Wishlist Grid - Responsive gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {wishlistedPackages.length > 0 ? (
              wishlistedPackages.map((pkg, idx) => {
                const destination = destinations.find(d => d.id === pkg.destinationId);
                return (
                  <motion.div
                    key={pkg.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group bg-white rounded-[40px] overflow-hidden border border-brand-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col h-full"
                  >
                    {/* Image Container */}
                    <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                      <img 
                        src={pkg.featuredImage} 
                        alt={pkg.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                        <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-brand-accent/90 backdrop-blur-md rounded-full text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-widest">
                          {pkg.category}
                        </span>
                      </div>

                      <button 
                        onClick={() => removeFromWishlist(pkg.id)}
                        className="absolute top-4 sm:top-6 right-4 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-red-500 hover:border-red-500 transition-all duration-300 transform group-hover:rotate-12"
                      >
                        <Trash2 size={18} className="sm:w-5 sm:h-5" />
                      </button>

                      <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 text-white">
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1 sm:mb-2 opacity-80">
                          <MapPin size={12} className="text-brand-accent" />
                          {destination?.name}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-serif leading-tight">
                          {pkg.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 flex flex-col flex-grow bg-white">
                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex items-center gap-3 sm:gap-4 text-brand-400">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Clock size={14} className="sm:w-4 sm:h-4" />
                            <span className="text-[10px] sm:text-xs font-medium">{pkg.duration.days} Days</span>
                          </div>
                          <div className="w-1 h-1 rounded-full bg-brand-200" />
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Heart size={14} className="sm:w-4 sm:h-4 text-brand-accent" fill="currentColor" />
                            <span className="text-[10px] sm:text-xs font-medium italic">Saved</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-brand-300">From</p>
                          <p className="text-lg sm:text-2xl font-serif text-brand-900">{formatPrice(pkg.tiers[0].price)}</p>
                        </div>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-3 sm:gap-4">
                        <Link 
                          to={`/packages/${pkg.slug}`}
                          className="flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 bg-brand-900 text-brand-accent rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all duration-300 group/btn"
                        >
                          View Trip
                          <ArrowRight size={14} className="sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                          to="/booking"
                          className="flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 bg-brand-50 text-brand-900 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-brand-100 transition-all duration-300"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center space-y-10"
              >
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-brand-accent/10 rounded-full animate-ping" />
                  <div className="relative w-32 h-32 bg-brand-50 rounded-full flex items-center justify-center text-brand-accent">
                    <Heart size={48} className="opacity-40" />
                  </div>
                </div>
                <div className="space-y-6">
                  <h2 className="text-4xl font-serif text-brand-900 italic">Your wishlist is empty.</h2>
                  <p className="text-brand-500 max-w-lg mx-auto text-lg font-light leading-relaxed">
                    Explore our destinations and save the experiences you want to plan next.
                  </p>
                </div>
                <Link to="/destinations" className="btn-primary inline-flex items-center gap-4 py-5 px-12 text-lg shadow-xl shadow-brand-accent/20 group">
                  Discover Destinations
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Support Section */}
        {wishlistedPackages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 lg:mt-32 p-8 sm:p-12 lg:p-24 bg-brand-900 rounded-[40px] sm:rounded-[60px] lg:rounded-[80px] text-center relative overflow-hidden group"
          >
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-accent/20 rounded-full blur-[120px] transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-brand-accent/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 space-y-8 lg:space-y-10">
              <div className="space-y-3 lg:space-y-4">
                <p className="script-font text-brand-accent text-2xl lg:text-3xl italic">The Next Chapter</p>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-serif text-white max-w-3xl mx-auto leading-tight">
                  Ready to Turn These Picks <br />
                  <span className="italic font-light opacity-80">Into a Booked Trip?</span>
                </h2>
              </div>
              
              <p className="text-brand-200/70 text-base lg:text-lg max-w-xl mx-auto font-light leading-relaxed">
                Our concierge team can build an itinerary based on your saved collection.
                Start with a quick consultation.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 lg:gap-8 pt-4 lg:pt-6">
                <Link to="/booking" className="btn-primary py-4 lg:py-5 px-8 lg:px-12 text-base lg:text-lg shadow-2xl shadow-brand-accent/30 group">
                  Book a Consultation
                  <ChevronRight size={18} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="px-8 lg:px-10 py-4 lg:py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white font-bold text-xs lg:text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                  Share Collection
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
