import { useState, useEffect } from 'react';
import Hero from '../components/ui/Hero';
import { useData } from '../hooks/useData';
import { useCurrency } from '../hooks/useCurrency';
import SEO from '../components/layout/SEO';
import { motion } from 'framer-motion';
import { Heart, MapPin, Calendar, Star, ArrowRight, Sun, Anchor, Mountain, Coffee } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { ASSETS } from '../config/images';
import { useUser } from '../hooks/useUser';
import { dataService } from '../services/dataService';

const Home = () => {
  const FEATURED_DESTINATION_INDEX_KEY = 'honeymoonner:home-featured-destination-index';
  const { packages, destinations, testimonials, homeContent } = useData();
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [loadedDestinationImages, setLoadedDestinationImages] = useState<Record<string, boolean>>({});
  const [featuredStartIndex, setFeaturedStartIndex] = useState(0);
  
  // Featured packages for the home page (first 2 honeymoons)
  const featuredPackages = packages.filter(p => p.category === 'honeymoon').slice(0, 2);
  const featuredDestinations = destinations.length <= 3
    ? destinations
    : Array.from({ length: 3 }, (_, idx) => destinations[(featuredStartIndex + idx) % destinations.length]);
  const giftEyebrow = 'For Families of Newlyweds';
  const giftTitle = 'Honeymoon Gift Package';
  const giftPrimaryUrl = homeContent.giftPackage.primaryCtaUrl?.startsWith('/')
    ? homeContent.giftPackage.primaryCtaUrl
    : '/packages';
  const giftSecondaryUrl = homeContent.giftPackage.secondaryCtaUrl?.startsWith('/')
    ? homeContent.giftPackage.secondaryCtaUrl
    : '/booking';
  const styleImages = homeContent.styleImages || {
    beach: ASSETS.HOME_EXPERIENCES.BEACH,
    island: ASSETS.HOME_EXPERIENCES.ISLAND,
    adventure: ASSETS.HOME_EXPERIENCES.ADVENTURE,
    city: ASSETS.HOME_EXPERIENCES.CITY
  };

  useEffect(() => {
    let ignore = false;
    dataService.getWishlist().then(items => {
      if (!ignore) setWishlistItems(items);
    }).catch(() => {
      if (!ignore) setWishlistItems([]);
    });
    return () => { ignore = true; };
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const total = destinations.length;
    if (total <= 3) {
      setFeaturedStartIndex(0);
      return;
    }

    const rawStored = window.localStorage.getItem(FEATURED_DESTINATION_INDEX_KEY);
    const storedIndex = rawStored ? Number.parseInt(rawStored, 10) : 0;
    const safeStoredIndex = Number.isFinite(storedIndex) && storedIndex >= 0 ? storedIndex : 0;
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const isReload = navEntry?.type === 'reload';
    const baseIndex = safeStoredIndex % total;
    const nextIndex = isReload ? (baseIndex + 1) % total : baseIndex;

    setFeaturedStartIndex(nextIndex);
    window.localStorage.setItem(FEATURED_DESTINATION_INDEX_KEY, String(nextIndex));
  }, [destinations.length]);

  const toggleWishlist = async (pkgId: string) => {
    if (!isAuthenticated) {
      navigate('/account', { state: { from: '/' } });
      return;
    }
    const current = wishlistItems;
    const next = current.includes(pkgId) ? current.filter((id: string) => id !== pkgId) : [...current, pkgId];
    const ok = await dataService.updateWishlist(next);
    if (ok) setWishlistItems(next);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen"
    >
      <SEO 
        title="Home" 
        description={homeContent.hero.subtitle}
      />
      <Hero />

      {/* Featured Destinations */}
      <section className="section-container">
        <div className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
          <p className="script-font mb-4 text-2xl sm:text-3xl lg:text-4xl">{homeContent.destinations.subtitle}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-900 mb-6 px-2 leading-tight">
            {homeContent.destinations.title}
          </h2>
          <p className="text-brand-600/90 leading-relaxed text-base sm:text-lg px-4">
            {homeContent.destinations.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {featuredDestinations.map((destination, idx) => (
            <Link
              key={destination.id}
              to={`/destinations/${destination.slug}`}
              className="group relative h-[350px] sm:h-[450px] lg:h-[500px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-brand-200/30 animate-pulse" aria-hidden="true" />
              <img
                src={destination.image}
                alt={destination.name}
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'low'}
                decoding="async"
                className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${loadedDestinationImages[destination.id] ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => {
                  setLoadedDestinationImages((prev) => ({ ...prev, [destination.id]: true }));
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = homeContent.fallbackImages.destination || "/images/placeholder-travel.svg";
                  setLoadedDestinationImages((prev) => ({ ...prev, [destination.id]: true }));
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full text-white">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold mb-2 opacity-80">
                  {destination.continent}
                </p>
                <h3 className="text-2xl sm:text-3xl font-serif mb-4 group-hover:text-brand-accent transition-colors leading-tight">
                  {destination.name}
                </h3>
                
                <div className="space-y-2 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  {destination.startingPrice && (
                    <p className="text-brand-accent-light font-bold text-sm sm:text-base">
                      Starting from {formatPrice(destination.startingPrice)} per couple
                    </p>
                  )}
                  {destination.bestTimeToVisit && (
                    <p className="text-[10px] sm:text-xs text-brand-100 font-medium">
                      Best time: {destination.bestTimeToVisit}
                    </p>
                  )}
                  {destination.popularFor && (
                    <p className="text-[10px] sm:text-xs text-brand-100 font-medium">
                      Popular for: {destination.popularFor.join(' / ')}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-brand-200 group-hover:text-white transition-colors font-bold uppercase tracking-widest">
                  <span>Explore Destination</span>
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Signature Packages */}
      <section className="bg-brand-100/50 py-12 sm:py-16">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 sm:mb-12 gap-8 text-center md:text-left">
            <div className="max-w-2xl">
              <p className="script-font mb-4 text-2xl sm:text-3xl lg:text-4xl">{homeContent.packages.subtitle}</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-900 mb-6 leading-tight">
                {homeContent.packages.title}
              </h2>
              <p className="text-brand-600/90 leading-relaxed text-base sm:text-lg">
                {homeContent.packages.description}
              </p>
            </div>
            <Link to="/packages" className="btn-outline w-full sm:w-auto px-10 py-4 text-center">
              View All Packages
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {featuredPackages.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -10 }}
                className="romantic-card group flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl sm:rounded-[3rem] overflow-hidden"
              >
                <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                  <img
                  src={pkg.featuredImage}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = homeContent.fallbackImages.package || ASSETS.FALLBACK_PACKAGE;
                  }}
                />
                  <button
                    aria-label={wishlistItems.includes(pkg.id) ? 'Saved to wishlist' : 'Save to wishlist'}
                    onClick={() => toggleWishlist(pkg.id)}
                    className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 sm:p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-brand-accent hover:scale-105 transition"
                  >
                    <Heart
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill={wishlistItems.includes(pkg.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex flex-wrap gap-2 pr-4">
                    {pkg.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-3 sm:px-4 py-1 sm:py-1.5 bg-brand-900/60 backdrop-blur-md text-white text-[9px] sm:text-[10px] uppercase tracking-widest font-bold rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 sm:p-10 flex flex-col flex-grow">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-brand-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-brand-accent" />
                      <span>Based on selected package</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-brand-accent" />
                      <span>{destinations.find(d => d.id === pkg.destinationId)?.name}</span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif text-brand-900 mb-4 group-hover:text-brand-accent transition-colors leading-tight">
                    {pkg.title}
                  </h3>
                  <p className="text-brand-600/90 text-sm leading-relaxed mb-8 flex-grow">
                    {pkg.summary}
                  </p>

                  <div className="pt-6 sm:pt-8 border-t border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-center sm:text-left">
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-brand-400 mb-1">
                        Starting from
                      </p>
                      <p className="text-xl sm:text-2xl font-serif text-brand-900">
                        {formatPrice(pkg.tiers[0].price)}
                        <span className="text-[10px] sm:text-xs font-sans text-brand-400 ml-1 font-normal lowercase italic">/{pkg.tiers[0].basis.split(' ')[1]}</span>
                      </p>
                    </div>
                    <Link to={`/packages/${pkg.slug}`} className="btn-primary w-full sm:w-auto py-3 px-8 text-xs sm:text-sm group-hover:bg-brand-accent transition-all text-center">
                      View Itinerary
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Style */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="section-container">
          <div className="text-center mb-10 sm:mb-12">
            <p className="script-font mb-4 text-brand-accent italic">Your Perfect Match</p>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-900 mb-6">Browse by Style</h2>
            <p className="text-brand-600/90 max-w-2xl mx-auto text-lg">Every couple is unique. Find the experience that fits yours.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                label: 'Beach Bliss', 
                icon: <Sun size={32} />, 
                color: 'from-orange-500/20 to-brand-accent/20',
                image: styleImages.beach,
                count: 12
              },
              { 
                label: 'Island Escape', 
                icon: <Anchor size={32} />, 
                color: 'from-blue-500/20 to-cyan-500/20',
                image: styleImages.island,
                count: 8
              },
              { 
                label: 'Romantic Adventure', 
                icon: <Mountain size={32} />, 
                color: 'from-emerald-500/20 to-teal-500/20',
                image: styleImages.adventure,
                count: 5
              },
              { 
                label: 'City Romance', 
                icon: <Coffee size={32} />, 
                color: 'from-purple-500/20 to-pink-500/20',
                image: styleImages.city,
                count: 15
              },
            ].map((style, idx) => (
              <Link
                key={idx}
                to="/packages"
                state={{ style: style.label }}
                className="group relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <img 
                  src={style.image} 
                  alt={style.label} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = homeContent.fallbackImages.general || ASSETS.FALLBACK_DESTINATION;
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${style.color} mix-blend-multiply opacity-60 group-hover:opacity-40 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/20 to-transparent" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="mb-4 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4 shadow-inner">
                      {style.icon}
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-1">{style.label}</h3>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{style.count} Experiences</p>
                  </div>
                  
                  <div className="overflow-hidden h-0 group-hover:h-10 transition-all duration-500 flex items-center gap-2 text-brand-accent font-bold text-xs uppercase tracking-widest">
                    <span>Explore Collection</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us / Reassurance */}
      <section className="py-12 sm:py-16 bg-brand-50/50 overflow-hidden">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-[40px] sm:rounded-[60px] overflow-hidden shadow-2xl relative z-10">
                <img
                  src={ASSETS.ROMANTIC_MOMENT_HOME}
                  alt="Romantic Moment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 to-transparent" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 sm:w-64 h-48 sm:h-64 bg-brand-accent/10 rounded-full -z-10 blur-3xl" />
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="absolute top-1/2 -left-4 sm:-left-6 lg:-left-12 -translate-y-1/2 p-5 sm:p-6 lg:p-10 bg-white/90 backdrop-blur-xl shadow-2xl rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] hidden xs:block border border-brand-100 max-w-[220px] sm:max-w-[280px] lg:max-w-sm z-20"
              >
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-accent flex items-center justify-center text-white shadow-lg shadow-brand-accent/20">
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
                    </div>
                    <div>
                      <p className="font-serif text-base sm:text-lg text-brand-900 leading-tight">1,200+ Trips Planned</p>
                      <p className="text-[8px] sm:text-[10px] text-brand-400 uppercase tracking-widest font-bold">Planned with perfection</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-900 flex items-center justify-center text-white shadow-lg shadow-brand-900/20">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-brand-accent" fill="currentColor" />
                    </div>
                    <div>
                      <p className="font-serif text-base sm:text-lg text-brand-900 leading-tight">98% Excellence</p>
                      <p className="text-[8px] sm:text-[10px] text-brand-400 uppercase tracking-widest font-bold">Couples rated 5-stars</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-8 sm:space-y-10 order-1 lg:order-2 text-center lg:text-left">
              <div>
                <p className="script-font text-brand-accent text-xl sm:text-2xl italic mb-4">Crafting the Extraordinary</p>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-brand-900 leading-tight mb-6 sm:mb-8">
                  Where Your New <br className="hidden sm:block" /> Life Begins
                </h2>
                <p className="text-brand-600/90 text-base sm:text-lg leading-relaxed mb-8">
                  We plan every detail from your first consultation to your final day abroad, so your honeymoon feels seamless, personal, and stress-free.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-left">
                {[
                  { title: 'Curated Intimacy', desc: 'Handpicked resorts that prioritize privacy and romantic atmosphere.' },
                  { title: 'Personalized Journeys', desc: 'Bespoke itineraries tailored to your unique shared interests.' },
                  { title: 'Seamless Planning', desc: 'Stress-free logistics handled by our expert romantic travel specialists.' },
                  { title: '24/7 Concierge', desc: 'On-the-ground support to ensure every moment is flawless.' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2 sm:space-y-3">
                    <h4 className="font-serif text-lg sm:text-xl text-brand-900">{item.title}</h4>
                    <p className="text-brand-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 sm:pt-8">
                <Link to="/about" className="btn-primary w-full sm:w-auto px-10 py-4 inline-flex items-center justify-center gap-3 text-sm sm:text-base uppercase tracking-widest font-bold">
                  Our Philosophy <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Honeymoon Gift Package */}
      <section className="bg-brand-50/60 py-12 sm:py-16 px-4">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center bg-white rounded-3xl sm:rounded-[42px] border border-brand-100 p-6 sm:p-10 lg:p-12 shadow-sm">
            <div className="space-y-5 sm:space-y-6 text-center lg:text-left">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] font-bold text-brand-accent">
                {giftEyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-900 leading-tight">
                {giftTitle}
              </h2>
              <p className="text-brand-700 text-base sm:text-lg leading-relaxed">
                {homeContent.giftPackage.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 sm:gap-5 pt-2">
                <Link to={giftPrimaryUrl} className="btn-primary w-full sm:w-auto px-8 py-3 text-xs sm:text-sm uppercase tracking-widest font-bold text-center">
                  {homeContent.giftPackage.primaryCtaLabel}
                </Link>
                <Link to={giftSecondaryUrl} className="btn-outline w-full sm:w-auto px-8 py-3 text-xs sm:text-sm uppercase tracking-widest font-bold text-center">
                  {homeContent.giftPackage.secondaryCtaLabel}
                </Link>
              </div>
            </div>

            <div className="relative h-64 sm:h-80 lg:h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden">
              <img
                src={homeContent.giftPackage.image || ASSETS.ROMANTIC_MOMENT_HOME}
                alt={homeContent.giftPackage.imageAlt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = homeContent.fallbackImages.general || ASSETS.ROMANTIC_MOMENT_HOME;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-brand-900/10 to-transparent" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                <p className="inline-block max-w-[95%] text-brand-50 font-serif italic text-base sm:text-lg leading-relaxed tracking-[0.01em] bg-brand-900/30 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 shadow-lg">
                  {homeContent.giftPackage.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-100 to-transparent" />
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <p className="script-font mb-4 text-brand-accent italic text-xl sm:text-2xl">Romantic Reality</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-900 mb-6 leading-tight">Stories from Our Couples</h2>
            <p className="text-brand-600/90 max-w-2xl mx-auto text-base sm:text-lg">Real moments and memorable trips from couples we have planned for.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-brand-50/50 rounded-2xl sm:rounded-[40px] p-6 sm:p-8 lg:p-10 relative flex flex-col group hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-brand-100"
              >
                <div className="flex items-center gap-4 mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-lg border-2 border-white">
                    <img src={testimonial.image} alt={testimonial.coupleName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg sm:text-xl text-brand-900">{testimonial.coupleName}</h4>
                    <p className="text-[8px] sm:text-[10px] text-brand-400 uppercase tracking-widest font-bold">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4 sm:mb-6 text-brand-accent">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" />
                  ))}
                </div>

                <div className="flex-grow">
                  <h5 className="text-lg sm:text-xl font-serif text-brand-900 mb-4 italic leading-snug">"{testimonial.quote}"</h5>
                  <p className="text-brand-600/90 text-xs sm:text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                    {testimonial.story}
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-brand-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-brand-400">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">{testimonial.destination}</span>
                  </div>
                  <span className="text-[8px] sm:text-[10px] text-brand-300 font-bold uppercase tracking-widest">{testimonial.date}</span>
                </div>

                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 lg:-top-4 lg:-right-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-brand-accent rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-xl shadow-brand-accent/20">
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" fill="currentColor" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-900 py-12 sm:py-16 text-center px-4">
        <div className="section-container">
          <p className="script-font text-brand-accent mb-6 italic text-xl sm:text-2xl">Ready to Begin?</p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-white mb-6 sm:mb-8 max-w-3xl mx-auto leading-tight">
            Let's Plan Your <br className="sm:hidden" />
            <span className="italic">Perfect Honeymoon</span>
          </h2>
          <p className="text-brand-300/90 mb-8 sm:mb-12 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed px-4">
            Schedule a complimentary consultation with our romantic travel specialists today and start your journey together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="/booking" className="btn-primary w-full sm:w-auto px-10 py-4 text-xs sm:text-sm uppercase tracking-widest font-bold text-center">
              Book a Consultation
            </Link>
            <Link to="/packages" className="text-white border-b border-white/30 hover:border-white transition-all py-2 text-xs sm:text-sm uppercase tracking-widest font-bold w-full sm:w-auto text-center">
              Explore All Packages
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
