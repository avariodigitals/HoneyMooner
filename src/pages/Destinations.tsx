import { useState } from 'react';
import { useData } from '../hooks/useData';
import { useCurrency } from '../hooks/useCurrency';
import type { Destination } from '../types';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Compass, Calendar, Heart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const Destinations = () => {
  const { slug } = useParams();
  const { destinations, packages } = useData();
  const { formatPrice } = useCurrency();
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedDestination = destinations.find(d => d.slug === slug);
  const filteredPackages = packages.filter(p => 
    !slug || destinations.find(d => d.id === p.destinationId)?.slug === slug
  );
  
  if (selectedDestination) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <div className="absolute top-24 left-0 right-0 z-20">
          <Breadcrumbs />
        </div>
        {/* Destination Hero */}
        <section className="relative h-[60vh] overflow-hidden">
          <img 
            src={selectedDestination.image} 
            alt={selectedDestination.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
            <div className="max-w-4xl">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="script-font mb-4 block"
              >
                Discover {selectedDestination.continent}
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-8xl font-serif mb-8 drop-shadow-2xl"
              >
                {selectedDestination.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-brand-50/90 max-w-2xl mx-auto leading-relaxed"
              >
                {selectedDestination.description}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Destination Content */}
        <section className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Sidebar info */}
            <div className="lg:col-span-1 space-y-10">
              <div className="bg-white p-8 rounded-3xl border border-brand-100 shadow-sm sticky top-32">
                <h3 className="text-xl font-serif text-brand-900 mb-6">At a Glance</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-50 rounded-xl text-brand-accent"><Globe size={20} /></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-1">Country</p>
                      <p className="text-brand-900 font-medium">{selectedDestination.country}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-50 rounded-xl text-brand-accent"><Calendar size={20} /></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-1">Best Time to Visit</p>
                      <p className="text-brand-900 font-medium">Year Round</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-50 rounded-xl text-brand-accent"><Heart size={20} fill="currentColor" /></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-1">Romance Level</p>
                      <p className="text-brand-900 font-medium">World Class</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 pt-10 border-t border-brand-50">
                  <Link to="/contact" className="btn-primary w-full text-center block text-sm">
                    Plan Your Trip
                  </Link>
                </div>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="lg:col-span-2 space-y-12">
              <div className="flex items-end justify-between border-b border-brand-100 pb-8">
                <div>
                  <h2 className="text-3xl font-serif text-brand-900 mb-2">Signature Experiences</h2>
                  <p className="text-brand-600">Handpicked honeymoons and escapes in {selectedDestination.name}</p>
                </div>
                <span className="text-sm font-medium text-brand-400">{filteredPackages.length} Packages Found</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    whileHover={{ y: -10 }}
                    className="romantic-card group flex flex-col h-full"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img src={pkg.featuredImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-brand-accent"><Heart size={16} fill="currentColor" /></div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-xl font-serif text-brand-900 mb-4 group-hover:text-brand-accent transition-colors">{pkg.title}</h3>
                      <p className="text-brand-600 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">{pkg.summary}</p>
                      <div className="pt-6 border-t border-brand-50 flex items-center justify-between">
                        <p className="text-lg font-serif text-brand-900">{formatPrice(pkg.tiers[0].price)}</p>
                        <Link to={`/packages/${pkg.slug}`} className="btn-primary py-2 px-6 text-xs">View Trip</Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    );
  }

  const continents = ['all', 'Africa', 'Europe', 'Asia', 'Caribbean', 'Americas', 'Oceania'];

  const filteredDestinations = destinations.filter((d: Destination) => {
    const matchesContinent = selectedContinent === 'all' || d.continent === selectedContinent;
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         d.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 min-h-screen"
    >
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070" 
            alt="Dream Destinations" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-[1px]" />
          
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <img 
              src="https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Wordmark%20Logo%20No%20BG%20-%20White%20Only.png?updatedAt=1773691277015" 
              alt=""
              className="w-full max-w-4xl h-auto object-contain"
            />
          </div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="script-font mb-4 block"
          >
            The World Awaits
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-2xl"
          >
            Dream Destinations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-50 max-w-2xl mx-auto text-lg leading-relaxed font-medium"
          >
            From tropical islands to historic cities, find the perfect backdrop for your love story.
          </motion.p>
        </div>
      </section>

      <div className="section-container pb-24">
        {/* Continent Filter & Search */}
        <div className="space-y-8 mb-16">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {continents.map((continent) => (
              <button
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-sm font-medium transition-all border uppercase tracking-widest ${
                  selectedContinent === continent
                    ? 'bg-brand-900 text-white border-brand-900 shadow-lg'
                    : 'bg-white text-brand-600 border-brand-100 hover:border-brand-accent'
                }`}
              >
                {continent}
              </button>
            ))}
          </div>

          <div className="max-w-md mx-auto relative px-4 sm:px-0">
            <div className="absolute left-10 sm:left-6 top-1/2 -translate-y-1/2 text-brand-accent">
              <Compass size={20} className="animate-pulse" />
            </div>
            <input
              type="text"
              placeholder="Search your dream destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-3 sm:py-4 rounded-full bg-white border-2 border-brand-100 focus:border-brand-accent/30 focus:ring-4 focus:ring-brand-accent/5 transition-all text-brand-900 placeholder:text-brand-300 font-serif italic text-sm sm:text-base shadow-sm"
            />
          </div>
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredDestinations.map((destination: Destination) => (
            <motion.div
              key={destination.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <Link to={`/destinations/${destination.slug}`} className="block">
                <div className="relative h-[450px] overflow-hidden rounded-[40px] shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
                    <div className="flex items-center gap-3 mb-4 opacity-80 text-xs font-bold uppercase tracking-[0.3em]">
                      <Globe size={14} className="text-brand-accent" />
                      <span>{destination.continent}</span>
                    </div>
                    <h3 className="text-4xl font-serif mb-6 group-hover:text-brand-accent transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-brand-50/70 text-sm leading-relaxed mb-8 line-clamp-2 max-w-xs group-hover:text-white transition-colors">
                      {destination.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                      <span className="pb-1 border-b border-white/30 group-hover:border-brand-accent group-hover:text-brand-accent transition-all">Explore Destination</span>
                      <ArrowRight size={16} className="group-hover:translate-x-3 transition-transform text-brand-accent" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[40px] border border-brand-100">
            <Compass className="text-brand-100 mx-auto mb-6" size={64} />
            <p className="text-brand-400 text-lg font-serif italic">More destinations coming soon...</p>
            <button
              onClick={() => setSelectedContinent('all')}
              className="text-brand-accent font-medium mt-4 hover:underline"
            >
              View all current destinations
            </button>
          </div>
        )}
      </div>

      {/* Trust / SEO Block */}
      <section className="bg-brand-100/30 mt-24 py-24">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-serif text-brand-900 leading-tight">Expert Guides for <br /> Every Continent</h2>
              <p className="text-brand-600 leading-relaxed text-lg">
                Our team of romantic travel specialists has personally visited every destination we recommend. We don't just provide packages; we provide insider knowledge on the most private beaches, the best candlelit dinners, and the most iconic sunsets.
              </p>
              <div className="flex flex-wrap gap-12">
                <div>
                  <p className="text-4xl font-serif text-brand-900 mb-2">50+</p>
                  <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">Luxury Resorts</p>
                </div>
                <div>
                  <p className="text-4xl font-serif text-brand-900 mb-2">12</p>
                  <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">Countries</p>
                </div>
                <div>
                  <p className="text-4xl font-serif text-brand-900 mb-2">24/7</p>
                  <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">Support</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80"
                alt="Santorini"
                className="w-full h-[500px] object-cover rounded-[40px] shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl border border-brand-50 max-w-xs">
                <p className="font-serif text-lg text-brand-900 italic mb-2">"The best decision we made for our honeymoon. Everything was flawless."</p>
                <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">— Sarah & James, Maldives 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Destinations;
