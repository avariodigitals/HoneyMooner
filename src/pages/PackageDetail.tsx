import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { useCurrency } from '../hooks/useCurrency';
import { useUser } from '../hooks/useUser';
import { dataService } from '../services/dataService';
import { motion } from 'framer-motion';
import PayPalButton from '../components/ui/PayPalButton';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/layout/SEO';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Check, 
  X, 
  ArrowRight, 
  Heart, 
  Share2, 
  Star, 
  ChevronRight, 
  ChevronLeft,
  Home,
  Plane,
  Coffee,
  Camera,
  ShieldCheck,
  CreditCard,
  Briefcase,
  type LucideIcon
} from 'lucide-react';

const categoryIcons: { [key: string]: LucideIcon } = {
  accommodation: Home,
  transport: Plane,
  meals: Coffee,
  activities: Camera,
  extras: Star,
  visa: ShieldCheck,
  concierge: Briefcase,
  payment: CreditCard
};

const PackageDetail = () => {
  const { slug } = useParams();
  const { packages, destinations, posts, isLoading } = useData();
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const pkg = packages.find(p => p.slug === slug);
  const destination = destinations.find(d => d.id === pkg?.destinationId);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [selectedTierId, setSelectedTierId] = useState(pkg?.tiers?.[0]?.id);
  const [selectedDate, setSelectedDate] = useState('');
  const [wishlistItems, setWishlistItems] = useState<string[] | null>(null);

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wishlistError, setWishlistError] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (pkg) {
      dataService.getWishlist()
        .then(items => {
          if (cancelled) return;
          setWishlistItems(items);
          setIsInWishlist(items.includes(pkg.id));
        })
        .catch(() => {
          if (cancelled) return;
          setWishlistItems([]);
          setIsInWishlist(false);
        });
    }
    return () => { cancelled = true; };
  }, [isAuthenticated, pkg]);

  const reviewsCount = useMemo(() => {
    if (!pkg) return 0;
    // Generate a consistent pseudo-random number based on the package ID
    const hash = pkg.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 15 + (hash % 40); // Between 15 and 55 reviews
  }, [pkg]);

  if (isLoading) {
    return (
      <div className="pt-32 min-h-screen section-container flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-brand-600 font-serif text-xl italic">Preparing your romantic escape...</p>
      </div>
    );
  }

  if (!pkg) return <div className="pt-32 min-h-screen section-container">Package not found</div>;

  const selectedTier = pkg.tiers.find(t => t.id === selectedTierId) || pkg.tiers[0];

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/account', { state: { from: `/packages/${slug}` } });
      return;
    }
    if (!pkg) return;
    setWishlistError('');
    setIsSaving(true);
    const current = wishlistItems ?? [];
    const next = isInWishlist ? current.filter(id => id !== pkg.id) : [...current, pkg.id];
    const ok = await dataService.updateWishlist(next);
    if (ok) {
      setWishlistItems(next);
      setIsInWishlist(!isInWishlist);
    } else {
      setWishlistError('Unable to save wishlist. Please try again later.');
    }
    setIsSaving(false);
  };

  // Find related articles (same category or general)
  const relatedPosts = posts
    .filter(post => post.category === pkg.category || post.category === 'Destinations')
    .slice(0, 3);

  const packageSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": pkg.title,
    "image": pkg.featuredImage,
    "description": pkg.summary,
    "brand": {
      "@type": "Brand",
      "name": "The Honeymooner"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": Math.min(...pkg.tiers.map(t => t.price)),
      "highPrice": Math.max(...pkg.tiers.map(t => t.price)),
      "priceCurrency": "USD"
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <SEO 
        title={pkg.seo?.title || pkg.title}
        description={pkg.seo?.description || pkg.summary}
        keywords={pkg.seo?.keywords?.join(', ')}
        image={pkg.featuredImage}
        type="product"
        schema={packageSchema}
      />
      <div className="absolute top-24 left-0 right-0 z-20">
        <Breadcrumbs />
      </div>
      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] min-h-[450px] sm:min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={pkg.gallery[currentImgIndex]}
            alt={pkg.title}
            className="w-full h-full object-cover brightness-[0.8]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=2070";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/20 to-transparent" />
        </div>

        <div className="absolute bottom-8 sm:bottom-16 left-0 w-full z-10">
          <div className="section-container px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl text-white">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-brand-accent/90 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                  {pkg.category}
                </span>
                <div className="flex items-center gap-2 text-[10px] sm:text-sm text-brand-50/80 font-medium">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{destination?.name}, {destination?.country}</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif mb-6 sm:mb-8 leading-tight drop-shadow-2xl">
                {pkg.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-brand-50/90 font-medium">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-brand-accent" />
                  <span className="capitalize text-xs sm:text-base">{selectedTier.basis}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-brand-accent text-brand-accent" />)}
                  <span className="ml-2 text-xs sm:text-sm">({reviewsCount} Reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Navigation */}
        <div className="absolute bottom-8 sm:bottom-16 right-4 sm:right-8 lg:right-16 flex gap-2 sm:gap-4 z-20">
          <button
            onClick={() => setCurrentImgIndex((prev) => (prev === 0 ? pkg.gallery.length - 1 : prev - 1))}
            className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => setCurrentImgIndex((prev) => (prev === pkg.gallery.length - 1 ? 0 : prev + 1))}
            className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section-container px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16">
        <div className="lg:col-span-2 space-y-12 sm:space-y-16">
          {/* Summary & Description */}
          <div className="space-y-6 sm:space-y-8">
            <p className="script-font text-brand-accent italic text-xl sm:text-2xl">The Experience</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-900 leading-tight">Experience {destination?.name}</h2>
            <p className="text-brand-700 text-base sm:text-lg leading-relaxed first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-brand-accent">
              {pkg.description}
            </p>
          </div>

          {/* Interactive Journey Map (Stylized) */}
          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="script-font text-brand-accent italic text-xl sm:text-2xl">Journey Visualization</p>
                <h3 className="text-2xl sm:text-3xl font-serif text-brand-900 leading-tight">Journey at a Glance</h3>
              </div>
              <p className="text-xs sm:text-sm text-brand-600 max-w-md sm:text-right leading-relaxed">
                Track your route from arrival to departure.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-brand-accent/20 via-amber-300/20 to-brand-900/15 rounded-[28px] sm:rounded-[44px] blur-md sm:blur-lg" />
              <div className="relative bg-white rounded-[24px] sm:rounded-[40px] overflow-hidden border border-brand-100 shadow-2xl aspect-[16/10] sm:aspect-[21/9]">
                <img
                  src={pkg.featuredImage}
                  className="w-full h-full object-cover opacity-45 saturate-[0.9] contrast-[1.08] scale-[1.02] group-hover:scale-105 transition-transform duration-1000"
                  alt="Journey Map"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-brand-50/10 to-brand-900/35" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_42%),radial-gradient(circle_at_82%_78%,rgba(212,168,106,0.2),transparent_38%)]" />

                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-full px-3 sm:px-4 py-2 shadow-lg">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-brand-accent/15 flex items-center justify-center text-brand-accent border border-brand-accent/25">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-900">Journey Visualization</p>
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 400" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="journeyPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#D4A86A" />
                      <stop offset="50%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#8C6C4A" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 140 235 Q 330 80 520 230 T 860 135"
                    fill="none"
                    stroke="url(#journeyPathGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="10 11"
                    className="opacity-90"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.2, ease: 'easeInOut' }}
                  />

                  {[{ x: 140, y: 235 }, { x: 520, y: 230 }, { x: 860, y: 135 }].map((point, idx) => (
                    <motion.g
                      key={idx}
                      initial={{ opacity: 0, scale: 0.7 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.45 + idx * 0.45, duration: 0.45 }}
                    >
                      <circle cx={point.x} cy={point.y} r="8" fill="#D4A86A" />
                      <circle cx={point.x} cy={point.y} r="17" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2" fill="none" />
                    </motion.g>
                  ))}
                </svg>

                <div className="absolute left-[11%] top-[58%] sm:left-[14%] sm:top-[56%]">
                  <span className="inline-flex items-center rounded-full border border-white/70 bg-white/85 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-brand-900 shadow-md backdrop-blur-sm">
                    Arrival
                  </span>
                </div>
                <div className="absolute left-[45%] top-[57%] sm:left-[52%] sm:top-[54%]">
                  <span className="inline-flex items-center rounded-full border border-white/70 bg-white/85 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-brand-900 shadow-md backdrop-blur-sm">
                    The Heart
                  </span>
                </div>
                <div className="absolute left-[74%] top-[33%] sm:left-[87%] sm:top-[31%] sm:-translate-x-full">
                  <span className="inline-flex items-center rounded-full border border-white/70 bg-white/85 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-brand-900 shadow-md backdrop-blur-sm whitespace-nowrap">
                    Sunset Departure
                  </span>
                </div>

                <div className="absolute left-0 right-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-brand-900/70 via-brand-900/20 to-transparent" />
              </div>
            </div>
          </div>

          {/* Day-by-Day Itinerary */}
          {pkg.itinerary && (
            <div className="space-y-8 sm:space-y-10">
              <div className="flex items-end justify-between px-2">
                <div>
                  <p className="script-font text-brand-accent italic mb-2 text-xl sm:text-2xl">The Journey</p>
                  <h3 className="text-2xl sm:text-3xl font-serif text-brand-900">Your Day-by-Day Story</h3>
                </div>
              </div>

              <div className="space-y-8 sm:space-y-12 relative before:absolute before:left-6 sm:before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-brand-100">
                {pkg.itinerary.map((day, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative pl-14 sm:pl-20"
                  >
                    <div className="absolute left-0 top-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white border-2 border-brand-accent flex flex-col items-center justify-center shadow-lg z-10">
                      <span className="text-xl sm:text-2xl font-serif text-brand-accent leading-none">{day.day}</span>
                    </div>
                    
                    <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-100 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="text-lg sm:text-xl font-serif text-brand-900 mb-3 sm:mb-4">{day.title}</h4>
                      <p className="text-brand-700 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">{day.description}</p>
                      {day.activity && (
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-50 rounded-full text-brand-accent text-xs sm:text-sm font-medium">
                          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" />
                          {day.activity}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Tier Selection */}
          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-xl sm:text-2xl font-serif text-brand-900">Select Your Experience Level</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {pkg.tiers.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`p-5 sm:p-8 rounded-2xl sm:rounded-[32px] border-2 transition-all cursor-pointer relative overflow-hidden group ${
                    selectedTierId === tier.id
                      ? 'border-brand-accent bg-brand-accent/5 shadow-xl shadow-brand-accent/10'
                      : 'border-brand-100 bg-white hover:border-brand-200'
                  }`}
                >
                  {selectedTierId === tier.id && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-brand-accent">
                      <Check className="w-[18px] h-[18px] sm:w-6 sm:h-6" />
                    </div>
                  )}
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-1 sm:mb-2">{tier.name}</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-serif text-brand-900 mb-2 sm:mb-4">{formatPrice(tier.price)}</p>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-brand-400 italic leading-tight">{tier.basis}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions / Exclusions - Structured Content Block */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-brand-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h3 className="text-xl sm:text-2xl font-serif text-brand-900 mb-8 sm:mb-10 flex items-center gap-3 sm:gap-4 relative z-10">
              <span className="w-10 h-10 shrink-0 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <ShieldCheck size={20} />
              </span>
              What This Fee Covers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 relative z-10">
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-8 sm:gap-y-10">
                {pkg.inclusions.map((inc, idx) => {
                  const Icon = categoryIcons[inc.category] || Star;
                  return (
                    <div key={idx} className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-accent">
                          <Icon size={16} />
                        </div>
                        <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-brand-400">{inc.category}</h4>
                      </div>
                      <ul className="space-y-2 sm:space-y-2.5">
                        {inc.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-brand-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent/30 mt-1.5 shrink-0" />
                            <span className="text-xs sm:text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div className="pt-8 md:pt-0 md:pl-10 lg:pl-12 border-t md:border-t-0 md:border-l border-brand-100">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400">
                    <X size={16} />
                  </div>
                  <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-red-400">
                    Not Included
                  </h4>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  {pkg.exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-brand-500/70">
                      <div className="w-1 h-1 rounded-full bg-brand-200 mt-2 shrink-0" />
                      <span className="text-xs sm:text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Departure Selection */}
          <div className="space-y-6 sm:space-y-8 pb-12">
            <h3 className="text-xl sm:text-2xl font-serif text-brand-900 px-2">Select Your Intended Travel Date</h3>
            <div className="max-w-md mx-auto sm:mx-0 px-2">
              <div className="relative">
                <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-brand-accent pointer-events-none">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-14 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-5 bg-white border border-brand-100 rounded-xl sm:rounded-2xl text-sm sm:text-base text-brand-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all shadow-sm"
                />
              </div>
              <p className="mt-4 text-[10px] sm:text-sm text-brand-500 italic leading-relaxed">
                Choose any date that works for you. Our experts will verify availability and tailor the itinerary to your timeline.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-32 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-brand-100 shadow-xl space-y-6 sm:space-y-8 mb-12 lg:mb-0">
            <div className="space-y-2">
              <p className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-brand-400">Total Price from</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-serif text-brand-900">{formatPrice(selectedTier.price)}</span>
                <span className="text-xs sm:text-sm text-brand-500 italic">/{selectedTier.basis.split(' ')[1]}</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-brand-400 font-bold uppercase tracking-widest">Experience: {selectedTier.name}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-brand-50">
              <Link 
                to="/booking" 
                state={{ packageId: pkg.id, tierId: selectedTier.id }}
                className="btn-primary w-full py-3 sm:py-4 flex items-center justify-center gap-3 shadow-xl shadow-brand-accent/20 text-sm sm:text-base"
              >
                Book Now
                <ArrowRight className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
              </Link>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-brand-100"></span>
                </div>
                <div className="relative flex justify-center text-[9px] sm:text-[10px] uppercase tracking-widest font-bold">
                  <span className="bg-white px-4 text-brand-300">or secure your date</span>
                </div>
              </div>

              <PayPalButton 
                packageId={pkg.id}
                tierId={selectedTier.id}
                description={`${pkg.title} deposit (${selectedTier.name})`}
                customId={`${pkg.id}:${selectedTier.id}:${selectedDate || 'open-date'}`}
                onSuccess={(details) => console.log('Deposit paid', details)} 
              />
              <p className="text-[9px] sm:text-[10px] text-center text-brand-400 italic">
                Secure your romantic escape with a deposit.
              </p>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-brand-50 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-brand-600">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-accent">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" />
                </div>
                <span>Curated Luxury Accommodation</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-brand-600">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-accent">
                  <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" />
                </div>
                <span>24/7 Concierge Support</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <button 
                onClick={toggleWishlist}
                className={`flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  isInWishlist ? 'text-brand-accent scale-105' : 'text-brand-400 hover:text-brand-accent'
                }`}
              >
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill={isInWishlist ? "currentColor" : "none"} /> 
                {isSaving ? 'Saving...' : isInWishlist ? 'Saved to wishlist' : 'Save to wishlist'}
              </button>
              {wishlistError && (
                <p className="text-[10px] sm:text-xs text-red-500 italic">{wishlistError}</p>
              )}
              <button className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest hover:text-brand-accent transition-colors">
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Share trip
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Inspiration Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-brand-50/50 py-16 sm:py-24 border-t border-brand-100">
          <div className="section-container px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 sm:mb-16 gap-8 text-center md:text-left">
              <div className="max-w-2xl">
                <p className="script-font mb-4 text-xl sm:text-2xl">Expand Your Journey</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-900 mb-6 leading-tight">
                  Related Inspiration
                </h2>
                <p className="text-brand-600/90 leading-relaxed text-base sm:text-lg">
                  Discover curated guides and expert advice to complement your romantic escape.
                </p>
              </div>
              <Link 
                to="/journal" 
                className="btn-outline w-full sm:w-auto flex items-center justify-center gap-3 group px-8 py-4"
              >
                Explore The Journal
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl sm:rounded-[30px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-100 group flex flex-col"
                >
                  <Link to={`/journal/${post.slug}`} className="block relative h-56 sm:h-64 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                      <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-brand-accent shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </Link>
                  <div className="p-6 sm:p-8 flex flex-col flex-grow">
                    <h3 className="text-lg sm:text-xl font-serif text-brand-900 mb-3 sm:mb-4 group-hover:text-brand-accent transition-colors line-clamp-2 leading-tight">
                      <Link to={`/journal/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-brand-500 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                    <Link 
                      to={`/journal/${post.slug}`} 
                      className="text-brand-accent text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all mt-auto"
                    >
                      View Story <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default PackageDetail;
