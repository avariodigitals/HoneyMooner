import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/layout/SEO';
import { PACKAGE_COLLECTIONS, findPackageCollection } from '../config/packageCollections';
import { useData } from '../hooks/useData';

export default function Experiences() {
  const { themes, isLoading } = useData();

  const themeCollections = themes.length > 0 
    ? themes 
    : PACKAGE_COLLECTIONS
        .filter((collection) => collection.kind === 'theme')
        .map((collection) => findPackageCollection(collection.slug) || collection);

  if (isLoading && themes.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-24 min-h-screen"
    >
      <SEO
        title="Experiences"
        description="Curated honeymoon themes thoughtfully designed for different travel styles, budgets, and personalities."
        canonical="https://thehoneymoonertravel.com/experiences"
      />

      <Breadcrumbs />

      <div className="section-container pb-20 sm:pb-24">
        <section className="mb-12 sm:mb-16">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-bold text-brand-accent mb-4">Themes</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-900 mb-4">Curated Honeymoon Themes</h1>
            <p className="text-brand-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
              Thoughtfully designed experiences for different travel styles, budgets, and personalities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {themeCollections.map((theme, idx) => (
              <Link key={theme.slug} to={`/packages/type/${theme.slug}`} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04 }}
                  className="relative bg-white rounded-3xl border border-brand-100 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
                >
                  <div className="relative h-44 sm:h-48 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 overflow-hidden rounded-t-3xl">
                    <img
                      src={theme.heroImage}
                      alt={theme.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-900/55 via-brand-900/15 to-transparent" />
                  </div>

                  <div className="absolute left-6 right-6 top-0 h-1 rounded-b-full bg-gradient-to-r from-brand-accent/20 via-brand-accent to-brand-accent/20" />

                  <h2 className="text-xl sm:text-2xl font-serif text-brand-900 mb-3 leading-snug pt-2">{theme.title}</h2>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-brand-accent mb-4">Perfect for: {theme.audience}</p>

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
      </div>
    </motion.div>
  );
}
