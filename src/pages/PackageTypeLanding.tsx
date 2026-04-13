import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Star } from 'lucide-react';
import { useData } from '../hooks/useData';
import { useCurrency } from '../hooks/useCurrency';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/layout/SEO';
import { findPackageCollection } from '../config/packageCollections';
import type { Destination, TravelPackage } from '../types';

function matchesCollection(pkg: TravelPackage, destination: Destination | undefined, collection: { match: { categories?: string[]; tags?: string[]; destinations?: string[]; destinationNames?: string[]; countries?: string[]; destinationCountries?: string[]; fallbackCategory?: string } } & { destinations?: string[]; route?: string[] } | undefined) {
  if (!collection) return false;

  // Public collection pages should only surface honeymoon packages.
  if (pkg.category !== 'honeymoon') return false;

  const { categories, tags, fallbackCategory } = collection.match;
  const destinationNames = collection.match.destinationNames || collection.match.destinations;
  const destinationCountries = collection.match.destinationCountries || collection.match.countries;
  const collectionDestinations = collection.destinations || [];
  const collectionRouteStops = collection.route || [];
  const hasCategoryFilter = Array.isArray(categories) && categories.length > 0;

  if (hasCategoryFilter && !categories!.includes(pkg.category)) return false;

  const nameMatch = destinationNames && destination
    ? destinationNames.some((value: string) => destination.name.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(destination.name.toLowerCase()))
    : false;

  const countryMatch = destinationCountries && destination
    ? destinationCountries.some((value: string) => destination.country.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(destination.country.toLowerCase()))
    : false;

  const tagMatch = tags && Array.isArray(pkg.tags) ? tags.some((tag: string) => pkg.tags.some((pkgTag: string) => pkgTag.toLowerCase() === tag.toLowerCase())) : false;

  const destinationFieldMatch = collectionDestinations.length > 0 && destination
    ? collectionDestinations.some((value: string) => destination.name.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(destination.name.toLowerCase()))
    : false;

  const routeFieldMatch = collectionRouteStops.length > 0 && destination
    ? collectionRouteStops.some((value: string) => destination.name.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(destination.name.toLowerCase()))
    : false;

  const hasCoverageCriteria = Boolean(destinationNames?.length || destinationCountries?.length || tags?.length || collectionDestinations.length || collectionRouteStops.length);

  if (hasCoverageCriteria) {
    return Boolean(nameMatch || countryMatch || tagMatch || destinationFieldMatch || routeFieldMatch);
  }

  if (hasCategoryFilter) {
    return categories!.includes(pkg.category);
  }

  if (fallbackCategory) {
    return pkg.category === fallbackCategory;
  }

  return pkg.category === 'honeymoon';
}

const PackageTypeLanding = () => {
  const { slug } = useParams();
  const { packages, destinations, routeIdeas, isLoading } = useData();
  const { formatPrice } = useCurrency();

  const collection = useMemo(() => {
    if (!slug) return undefined;
    
    // Try to find a dynamic route idea from WordPress first
    const dynamicRoute = routeIdeas?.find(r => r.slug === slug);
    if (dynamicRoute) {
      return {
        ...dynamicRoute,
        route: dynamicRoute.routeStops || [],
        destinations: dynamicRoute.destinations || []
      };
    }
    
    return findPackageCollection(slug);
  }, [slug, routeIdeas]);

  const matchingPackages = useMemo(() => {
    if (!collection) return [];

    return packages.filter((pkg) => {
      const destination = destinations.find((item) => item.id === pkg.destinationId);
      return matchesCollection(pkg, destination, collection);
    });
  }, [collection, destinations, packages]);

  if (isLoading) {
    return (
      <div className="pt-32 min-h-screen section-container flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-brand-600 font-serif text-xl italic">Loading collection...</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="pt-32 min-h-screen section-container flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-900 mb-4">Collection not found</h1>
        <p className="text-brand-600 mb-8 max-w-xl">
          The package type you opened does not exist yet.
        </p>
        <Link to="/packages" className="btn-primary px-8 py-3">
          Back to Packages
        </Link>
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
      <SEO
        title={collection.title}
        description={collection.intro}
        image={collection.heroImage}
      />

      <Breadcrumbs />

      <section className="relative min-h-[80vh] flex items-center overflow-hidden mb-20 sm:mb-28">
        <div className="absolute inset-0">
          <img src={collection.heroImage} alt={collection.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/60 via-brand-900/40 to-brand-900/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent to-transparent" />
          {/* Decorative romantic overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-brand-700/10" />
        </div>

        {/* Decorative heart accent */}
        <div className="absolute top-12 right-12 sm:top-20 sm:right-20 opacity-5 z-0 hidden md:block">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="currentColor" className="text-white">
            <path d="M100,170 C30,130 10,100 10,70 C10,45 25,30 45,30 C60,30 75,40 100,60 C125,40 140,30 155,30 C175,30 190,45 190,70 C190,100 170,130 100,170 Z" />
          </svg>
        </div>

        <div className="section-container relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-white/40" />
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-brand-accent-light">
                {collection.eyebrow}
              </p>
              <div className="w-12 h-px bg-white/40" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif leading-tight mb-8 drop-shadow-lg">
              {collection.title}
            </h1>
            
            <p className="text-white/90 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mb-8 font-light">
              {collection.intro}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 mb-14">
              {collection.highlights.map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.12 }}
                  className="group relative overflow-hidden"
                >
                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex items-start gap-4 px-6 py-5 rounded-2xl bg-white/8 backdrop-blur-xl border border-white/25 group-hover:border-white/40 transition-all duration-300">
                    {/* Icon indicator - subtle dot */}
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white/60 group-hover:bg-white transition-colors mt-2" />
                    </div>
                    
                    {/* Text */}
                    <p className="text-sm sm:text-base font-semibold text-white/95 group-hover:text-white transition-colors tracking-wide leading-relaxed">
                      {item}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-14 flex flex-col sm:flex-row gap-5 pt-6">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-initial"
              >
                <Link 
                  to="/booking" 
                  className="group relative w-full sm:w-auto px-12 py-4 text-sm sm:text-base font-semibold tracking-wide text-white uppercase inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-brand-accent to-brand-accent/80 shadow-2xl shadow-brand-accent/50 hover:shadow-2xl hover:shadow-brand-accent/70 transition-all duration-300 overflow-hidden"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  
                  <span className="relative">Start Planning Your Love Story</span>
                  <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-initial"
              >
                <Link 
                  to="/packages" 
                  className="group relative w-full sm:w-auto px-12 py-4 text-sm sm:text-base font-semibold tracking-wide text-white uppercase inline-flex items-center justify-center gap-3 rounded-full border-2 border-white/60 bg-white/5 backdrop-blur-sm hover:bg-white/15 hover:border-white transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle background animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  
                  <span className="relative">Explore All Packages</span>
                  <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-container pb-28 bg-gradient-to-b from-brand-50/50 to-white rounded-3xl px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-0.5 bg-gradient-to-r from-brand-accent to-transparent" />
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-brand-accent">
                  Perfect for
                </p>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-900 leading-tight mb-6">
                {collection.audience}
              </h2>
              <p className="text-brand-600 text-base sm:text-lg leading-relaxed max-w-3xl font-light">
                {collection.tagline}
              </p>
            </div>

            {collection.route && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-white to-brand-50/50 border-2 border-brand-100 rounded-3xl p-8 sm:p-10 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-brand-accent rounded-full" />
                  <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-accent">Your Journey</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {collection.route.map((step, index) => (
                    <div key={`${collection.slug}-${step}`} className="flex items-center gap-3">
                      <span className="text-xs sm:text-sm px-4 py-2 rounded-full border-2 border-brand-accent text-brand-accent bg-brand-accent/5 font-semibold">
                        {step}
                      </span>
                      {index < collection.route!.length - 1 && (
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="text-brand-accent text-lg font-bold"
                        >
                          →
                        </motion.span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 border-2 border-brand-accent/30 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-2 mb-6">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-brand-accent">
                <path d="M10,3 C7.2,3 5,5.2 5,8 C5,12 10,17 10,17 C10,17 15,12 15,8 C15,5.2 12.8,3 10,3 Z M10,10 C8.9,10 8,9.1 8,8 C8,6.9 8.9,6 10,6 C11.1,6 12,6.9 12,8 C12,9.1 11.1,10 10,10 Z" />
              </svg>
              <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-accent">Destinations</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {(collection.route || []).map((destinationName) => {
                const destination = destinations.find(d => d.name.toLowerCase() === destinationName.toLowerCase());
                const destinationSlug = destination?.slug;
                return destinationSlug ? (
                  <Link
                    key={destinationName}
                    to={`/destinations/${destinationSlug}`}
                    className="text-xs bg-white border-2 border-brand-accent/30 rounded-full px-4 py-2 text-brand-700 font-semibold hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-colors"
                  >
                    {destinationName}
                  </Link>
                ) : (
                  <span key={destinationName} className="text-xs bg-white border-2 border-brand-accent/30 rounded-full px-4 py-2 text-brand-700 font-semibold">
                    {destinationName}
                  </span>
                );
              })}
            </div>
            <div className="pt-8 border-t-2 border-brand-accent/20">
              <p className="text-brand-700 text-sm leading-relaxed font-light">
                This collection is thoughtfully curated to help you move from inspiration to your perfect honeymoon itinerary.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 pt-16 border-t-2 border-brand-accent/20"
        >
          <div className="flex items-end justify-between gap-4 mb-14">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="script-font text-brand-accent italic mb-3 text-2xl sm:text-3xl"
              >
                Curated Experiences
              </motion.p>
              <h2 className="text-3xl sm:text-4xl font-serif text-brand-900">Honeymoons In This Collection</h2>
            </div>
            <p className="hidden sm:block text-sm text-brand-600 max-w-md text-right font-light leading-relaxed">
              Each package is handpicked to deliver romance, luxury, and unforgettable moments for newlyweds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {matchingPackages.map((pkg, idx) => {
              const destination = destinations.find((item) => item.id === pkg.destinationId);
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="romantic-card group flex flex-col h-full hover:border-brand-accent/50 overflow-hidden"
                >
                  <div className="relative h-72 overflow-hidden bg-brand-100">
                    <img src={pkg.featuredImage} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-brand-900/20 to-transparent" />
                    {/* Romantic overlay on hover */}
                    <div className="absolute inset-0 bg-brand-accent/0 group-hover:bg-brand-accent/10 transition-colors duration-500" />
                    <div className="absolute top-4 left-4">
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="px-4 py-2 bg-brand-accent text-white text-[10px] uppercase tracking-widest font-bold rounded-full shadow-lg"
                      >
                        {pkg.category}
                      </motion.span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow bg-white">
                    <div className="flex items-center justify-between mb-5 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-accent">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Timeless Romance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{destination?.name || 'Paradise'}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-serif text-brand-900 mb-4 group-hover:text-brand-accent transition-colors leading-tight">
                      {pkg.title}
                    </h3>
                    <p className="text-brand-600 text-sm leading-relaxed mb-8 flex-grow font-light">
                      {pkg.summary}
                    </p>

                    <div className="flex items-center gap-2 mb-8">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.div key={star} whileHover={{ scale: 1.2 }}>
                          <Star className="w-4 h-4 fill-brand-accent text-brand-accent" />
                        </motion.div>
                      ))}
                      <span className="ml-2 text-xs text-brand-600 font-semibold">(5.0) Loved by couples</span>
                    </div>

                    <div className="pt-6 border-t-2 border-brand-100 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-accent mb-2">
                          From
                        </p>
                        <p className="text-2xl font-serif text-brand-900">
                          {formatPrice(pkg.tiers[0].price)}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link to={`/packages/${pkg.slug}`} className="btn-primary py-3 px-6 text-xs shadow-lg shadow-brand-accent/30 hover:shadow-xl">
                          View Details
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {matchingPackages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-3xl border-2 border-brand-accent/20 shadow-lg"
          >
            <div className="mb-6">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto text-brand-accent opacity-30">
                <path d="M40,70 C15,55 5,40 5,28 C5,15 14,8 24,8 C32,8 40,14 40,24 C40,14 48,8 56,8 C66,8 75,15 75,28 C75,40 65,55 40,70 Z" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <p className="text-brand-600 text-lg font-light mb-2">Coming soon...</p>
            <p className="text-brand-500 text-base mb-8 max-w-md mx-auto">
              New romantic experiences are being curated for this collection.
            </p>
            <Link to="/packages" className="inline-flex items-center gap-2 text-brand-accent font-bold uppercase tracking-widest text-sm hover:gap-3 transition-all">
              Explore other packages <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </section>
    </motion.div>
  );
};

export default PackageTypeLanding;
