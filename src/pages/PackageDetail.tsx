import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { useCurrency } from '../hooks/useCurrency';
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
  const { packages, destinations } = useData();
  const { formatPrice } = useCurrency();
  const pkg = packages.find(p => p.slug === slug);
  const destination = destinations.find(d => d.id === pkg?.destinationId);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [selectedTierId, setSelectedTierId] = useState(pkg?.tiers?.[0]?.id);
  const [isInWishlist, setIsInWishlist] = useState(() => {
    if (!pkg) return false;
    const savedWishlist = localStorage.getItem('hm_wishlist');
    if (savedWishlist) {
      const items = JSON.parse(savedWishlist);
      return items.includes(pkg.id);
    }
    return false;
  });

  if (!pkg) return <div className="pt-32 min-h-screen section-container">Package not found</div>;

  const selectedTier = pkg.tiers.find(t => t.id === selectedTierId) || pkg.tiers[0];

  const toggleWishlist = async () => {
    const savedWishlist = localStorage.getItem('hm_wishlist');
    let items = savedWishlist ? JSON.parse(savedWishlist) : [];
    
    if (isInWishlist) {
      items = items.filter((id: string) => id !== pkg.id);
    } else {
      items.push(pkg.id);
    }
    
    setIsInWishlist(!isInWishlist);
    await dataService.updateWishlist(items);
  };

  // Find related articles (same category or general)
  const relatedPosts = useData().posts
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
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-transparent to-brand-900/30" />
          
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <img 
              src="https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Wordmark%20Logo%20No%20BG%20-%20White%20Only.png?updatedAt=1773691277015" 
              alt=""
              className="w-[150%] max-w-none rotate-[-15deg] scale-150"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>

        <div className="absolute bottom-16 left-0 w-full z-10">
          <div className="section-container">
            <div className="max-w-4xl text-white">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-brand-accent/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest">
                  {pkg.category}
                </span>
                <div className="flex items-center gap-2 text-sm text-brand-50/80">
                  <MapPin size={16} />
                  <span>{destination?.name}, {destination?.country}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-7xl font-serif mb-8 leading-tight drop-shadow-2xl">
                {pkg.title}
              </h1>
              <div className="flex flex-wrap items-center gap-10 text-brand-50/90 font-medium">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-brand-accent" />
                  <span>{pkg.duration.days} Days / {pkg.duration.nights} Nights</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-brand-accent" />
                  <span className="capitalize">{selectedTier.basis}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="fill-brand-accent text-brand-accent" />)}
                  <span className="ml-2 text-sm">(24 Reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Navigation */}
        <div className="absolute bottom-16 right-16 hidden lg:flex gap-4 z-20">
          <button
            onClick={() => setCurrentImgIndex((prev) => (prev === 0 ? pkg.gallery.length - 1 : prev - 1))}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentImgIndex((prev) => (prev === pkg.gallery.length - 1 ? 0 : prev + 1))}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section-container grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          {/* Summary & Description */}
          <div className="space-y-8">
            <p className="script-font text-brand-accent italic">The Experience</p>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-900">Experience the magic of {destination?.name}</h2>
            <p className="text-brand-700 text-lg leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-brand-accent">
              {pkg.description}
            </p>
          </div>

          {/* Day-by-Day Itinerary */}
          {pkg.itinerary && (
            <div className="space-y-10">
              <div className="flex items-end justify-between">
                <div>
                  <p className="script-font text-brand-accent italic mb-2">The Journey</p>
                  <h3 className="text-3xl font-serif text-brand-900">Your Day-by-Day Story</h3>
                </div>
                <div className="hidden md:flex items-center gap-2 text-brand-400 text-sm font-medium">
                  <Calendar size={18} />
                  <span>{pkg.duration.days} Days of Magic</span>
                </div>
              </div>

              <div className="space-y-12 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-brand-100">
                {pkg.itinerary.map((day, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative pl-20"
                  >
                    <div className="absolute left-0 top-0 w-16 h-16 rounded-2xl bg-white border-2 border-brand-accent flex flex-col items-center justify-center shadow-lg z-10">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-brand-400">Day</span>
                      <span className="text-2xl font-serif text-brand-accent leading-none">{day.day}</span>
                    </div>
                    
                    <div className="bg-white p-8 rounded-3xl border border-brand-100 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="text-xl font-serif text-brand-900 mb-4">{day.title}</h4>
                      <p className="text-brand-700 leading-relaxed mb-6">{day.description}</p>
                      {day.activity && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-full text-brand-accent text-sm font-medium">
                          <Star size={14} fill="currentColor" />
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
          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-brand-900">Select Your Experience Level</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pkg.tiers.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] border-2 transition-all cursor-pointer relative overflow-hidden group ${
                    selectedTierId === tier.id
                      ? 'border-brand-accent bg-brand-accent/5 shadow-xl shadow-brand-accent/10'
                      : 'border-brand-100 bg-white hover:border-brand-200'
                  }`}
                >
                  {selectedTierId === tier.id && (
                    <div className="absolute top-4 right-4 text-brand-accent">
                      <Check size={20} className="sm:w-6 sm:h-6" />
                    </div>
                  )}
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">{tier.name}</p>
                  <p className="text-2xl sm:text-3xl font-serif text-brand-900 mb-3 sm:mb-4">{formatPrice(tier.price)}</p>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-brand-400 italic">{tier.basis}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions / Exclusions - Structured Content Block */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h3 className="text-xl sm:text-2xl font-serif text-brand-900 mb-8 sm:mb-10 flex items-center gap-4 relative z-10">
              <span className="w-10 h-10 shrink-0 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <ShieldCheck size={20} />
              </span>
              What This Fee Covers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 relative z-10">
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                {pkg.inclusions.map((inc, idx) => {
                  const Icon = categoryIcons[inc.category] || Star;
                  return (
                    <div key={idx} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-accent">
                          <Icon size={16} />
                        </div>
                        <h4 className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-brand-400">{inc.category}</h4>
                      </div>
                      <ul className="space-y-2.5">
                        {inc.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-brand-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent/30 mt-1.5 shrink-0" />
                            <span className="text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div className="pt-8 md:pt-0 md:pl-12 border-t md:border-t-0 md:border-l border-brand-100">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400">
                    <X size={16} />
                  </div>
                  <h4 className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-red-400">
                    Not Included
                  </h4>
                </div>
                <ul className="space-y-4">
                  {pkg.exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-brand-500/70">
                      <div className="w-1 h-1 rounded-full bg-brand-200 mt-2 shrink-0" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Departure Selection */}
          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-brand-900">Select Departure Date</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pkg.departures.map((departure) => (
                <div
                  key={departure.id}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                    departure.availability === 'sold-out'
                      ? 'bg-brand-50/50 border-brand-100 opacity-50 cursor-not-allowed'
                      : 'bg-white border-brand-100 hover:border-brand-accent hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-brand-900">{new Date(departure.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      <p className={`text-xs uppercase tracking-widest font-bold mt-1 ${
                        departure.availability === 'available' ? 'text-green-600' : 'text-orange-500'
                      }`}>
                        {departure.availability}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-brand-200" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 bg-white rounded-3xl p-10 border border-brand-100 shadow-xl space-y-8">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest font-bold text-brand-400">Total Price from</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif text-brand-900">${selectedTier.price.toLocaleString()}</span>
                <span className="text-sm text-brand-500 italic">/{selectedTier.basis.split(' ')[1]}</span>
              </div>
              <p className="text-[10px] text-brand-400 font-bold uppercase tracking-widest">Experience: {selectedTier.name}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-brand-50">
              <Link 
                to="/booking" 
                state={{ packageId: pkg.id, tierId: selectedTier.id }}
                className="btn-primary w-full py-4 flex items-center justify-center gap-3 shadow-xl shadow-brand-accent/20"
              >
                Book Now
                <ArrowRight size={20} />
              </Link>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-brand-100"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                  <span className="bg-white px-4 text-brand-300">or secure your date</span>
                </div>
              </div>

              <PayPalButton 
                amount={500} 
                onSuccess={(details) => console.log('Deposit paid', details)} 
              />
              <p className="text-[10px] text-center text-brand-400 italic">
                Secure your romantic escape with a $500 non-refundable deposit.
              </p>
            </div>

            <div className="pt-6 border-t border-brand-50 space-y-6">
              <div className="flex items-center gap-4 text-sm text-brand-600">
                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-accent">
                  <Star size={14} fill="currentColor" />
                </div>
                <span>Curated Luxury Accommodation</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-brand-600">
                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-accent">
                  <Heart size={14} fill="currentColor" />
                </div>
                <span>24/7 Concierge Support</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button 
                onClick={toggleWishlist}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  isInWishlist ? 'text-brand-accent scale-105' : 'text-brand-400 hover:text-brand-accent'
                }`}
              >
                <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} /> 
                {isInWishlist ? 'Saved to wishlist' : 'Save to wishlist'}
              </button>
              <button className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-widest hover:text-brand-accent transition-colors">
                <Share2 size={16} /> Share trip
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Inspiration Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-brand-50/50 py-24 border-t border-brand-100">
          <div className="section-container">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <p className="script-font mb-4 text-brand-accent italic text-3xl">Expand Your Journey</p>
                <h2 className="text-4xl md:text-5xl font-serif text-brand-900 mb-6">
                  Related Inspiration
                </h2>
                <p className="text-brand-600 leading-relaxed text-lg">
                  Discover curated guides and expert advice to complement your romantic escape.
                </p>
              </div>
              <Link 
                to="/journal" 
                className="btn-outline flex items-center gap-3 group"
              >
                Explore The Journal
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[30px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-100 group"
                >
                  <Link to={`/journal/${post.slug}`} className="block relative h-64 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-accent shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </Link>
                  <div className="p-8">
                    <h3 className="text-xl font-serif text-brand-900 mb-4 group-hover:text-brand-accent transition-colors line-clamp-2">
                      <Link to={`/journal/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-brand-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link 
                      to={`/journal/${post.slug}`} 
                      className="text-brand-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      Read Guide <ArrowRight size={14} />
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
