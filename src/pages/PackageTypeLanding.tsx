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

function matchesCollection(pkg: TravelPackage, destination: Destination | undefined, collectionSlug: string) {
  const collection = findPackageCollection(collectionSlug);
  if (!collection) return false;

  const { categories, destinationNames, destinationCountries, tags } = collection.match;

  if (categories && !categories.includes(pkg.category)) return false;

  const nameMatch = destinationNames && destination
    ? destinationNames.some((value) => destination.name.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(destination.name.toLowerCase()))
    : false;

  const countryMatch = destinationCountries && destination
    ? destinationCountries.some((value) => destination.country.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(destination.country.toLowerCase()))
    : false;

  const tagMatch = tags ? tags.some((tag) => pkg.tags.some((pkgTag) => pkgTag.toLowerCase() === tag.toLowerCase())) : false;

  return Boolean(nameMatch || countryMatch || tagMatch || categories?.includes(pkg.category));
}

const PackageTypeLanding = () => {
  const { slug } = useParams();
  const { packages, destinations, isLoading } = useData();
  const { formatPrice } = useCurrency();

  const collection = slug ? findPackageCollection(slug) : undefined;

  const matchingPackages = useMemo(() => {
    if (!collection) return [];

    const filtered = packages.filter((pkg) => {
      const destination = destinations.find((item) => item.id === pkg.destinationId);
      return matchesCollection(pkg, destination, collection.slug);
    });

    if (filtered.length > 0) return filtered;

    const fallbackCategory = collection.match.fallbackCategory || 'honeymoon';
    return packages.filter((pkg) => pkg.category === fallbackCategory).slice(0, 6);
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

      <section className="relative min-h-[72vh] flex items-center overflow-hidden mb-16 sm:mb-20">
        <div className="absolute inset-0">
          <img src={collection.heroImage} alt={collection.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-900/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/30 to-brand-900/20" />
        </div>

        <div className="section-container relative z-10 text-white">
          <div className="max-w-4xl">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-brand-accent-light mb-5">
              {collection.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-tight mb-6">
              {collection.title}
            </h1>
            <p className="text-brand-100 text-lg sm:text-xl leading-relaxed max-w-2xl">
              {collection.intro}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              {collection.highlights.map((item) => (
                <span key={item} className="bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 text-xs sm:text-sm uppercase tracking-widest font-bold">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/booking" className="btn-primary w-full sm:w-auto px-8 py-4 text-xs sm:text-sm uppercase tracking-widest font-bold text-center">
                Start Planning
              </Link>
              <Link to="/packages" className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/25 text-white text-xs sm:text-sm uppercase tracking-widest font-bold text-center hover:bg-white/10 transition-all">
                Explore All Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start mb-16">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-brand-accent mb-4">
                Perfect for
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-900 leading-tight mb-4">
                {collection.audience}
              </h2>
              <p className="text-brand-600 text-base sm:text-lg leading-relaxed max-w-3xl">
                {collection.tagline}
              </p>
            </div>

            {collection.route && (
              <div className="bg-white border border-brand-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-400 mb-4">Route Overview</p>
                <div className="flex flex-wrap items-center gap-2.5">
                  {collection.route.map((step, index) => (
                    <div key={`${collection.slug}-${step}`} className="flex items-center gap-2.5">
                      <span className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-brand-100 bg-brand-50 text-brand-700">
                        {step}
                      </span>
                      {index < collection.route!.length - 1 && <span className="text-brand-300">{'->'}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-brand-50/70 border border-brand-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-400 mb-3">Destinations</p>
            <div className="flex flex-wrap gap-2">
              {collection.destinations.map((destination) => (
                <span key={destination} className="text-xs bg-white border border-brand-100 rounded-full px-3 py-1 text-brand-700">
                  {destination}
                </span>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-brand-100">
              <p className="text-brand-700 text-sm leading-relaxed">
                This collection is designed to help clients move from inspiration to a curated itinerary quickly.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="script-font text-brand-accent italic mb-2 text-xl sm:text-2xl">Matching Tours</p>
            <h2 className="text-2xl sm:text-3xl font-serif text-brand-900">Tours in this collection</h2>
          </div>
          <p className="hidden sm:block text-sm text-brand-500 max-w-md text-right">
            Only honeymoons and relevant tours are shown here for this collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {matchingPackages.map((pkg, idx) => {
            const destination = destinations.find((item) => item.id === pkg.destinationId);
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="romantic-card group flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={pkg.featuredImage} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-brand-900/60 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold rounded-full">
                      {pkg.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      <span>{pkg.duration.days} Days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} />
                      <span>{destination?.name || 'Curated route'}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-serif text-brand-900 mb-4 group-hover:text-brand-accent transition-colors leading-tight">
                    {pkg.title}
                  </h3>
                  <p className="text-brand-600 text-sm leading-relaxed mb-6 flex-grow">
                    {pkg.summary}
                  </p>

                  <div className="flex items-center gap-3 mb-6 text-brand-accent">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <div className="pt-6 border-t border-brand-100 flex items-center justify-between gap-4">
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
          })}
        </div>

        {matchingPackages.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[40px] border border-brand-100 shadow-sm">
            <p className="text-brand-400 text-lg">No tours were found for this collection yet.</p>
            <Link to="/packages" className="inline-flex items-center gap-2 mt-4 text-brand-accent font-bold uppercase tracking-widest text-xs">
              Back to packages <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default PackageTypeLanding;
