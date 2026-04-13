import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/layout/SEO';
import { PACKAGE_COLLECTIONS, findPackageCollection } from '../config/packageCollections';
import { useData } from '../hooks/useData';

const staticRouteCollections = PACKAGE_COLLECTIONS
  .filter((collection) => collection.kind === 'route')
  .map((collection) => findPackageCollection(collection.slug) || collection);

export default function PopularRouteIdeas() {
  const { routeIdeas } = useData();

  const routeCollections = [
    ...staticRouteCollections.filter((staticRoute) => !routeIdeas.some((dynamicRoute) => dynamicRoute.slug === staticRoute.slug)),
    ...routeIdeas.map((route) => ({
      ...route,
      route: route.routeStops || [],
      destinations: route.destinations || []
    }))
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-24 min-h-screen"
    >
      <SEO
        title="Popular Route Ideas"
        description="Multi-destination route collections customized to each couple's budget, visa profile, and travel goals."
      />

      <Breadcrumbs />

      <div className="section-container pb-20 sm:pb-24">
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-bold text-brand-accent mb-4">Multiple Destination Combos</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-900 mb-4">Popular Route Ideas</h1>
            <p className="text-brand-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
              These route collections can be customized to each couple's budget, visa profile, and travel goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {routeCollections.map((route, idx) => (
              <Link key={route.slug} to={`/packages/type/${route.slug}`} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white border border-brand-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all h-full"
                >
                  <div className="relative h-40 sm:h-44 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-5 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                    <img
                      src={route.heroImage}
                      alt={route.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-900/55 via-brand-900/15 to-transparent" />
                  </div>

                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-400 mb-2">Route {idx + 1}</p>
                  <h2 className="text-lg sm:text-xl font-serif text-brand-900 mb-4">{route.title}</h2>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {(route.route || route.destinations).map((stop, stopIdx, arr) => (
                      <div key={`${route.slug}-${stop}`} className="flex items-center gap-2.5">
                        <span className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-brand-100 bg-brand-50 text-brand-700">
                          {stop}
                        </span>
                        {stopIdx < arr.length - 1 && <span className="text-brand-300 text-xs">{'->'}</span>}
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-[10px] uppercase tracking-[0.25em] font-bold text-brand-accent">Open route</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
