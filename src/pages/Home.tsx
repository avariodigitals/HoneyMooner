import Hero from '../components/ui/Hero';
import { useData } from '../hooks/useData';
import { useCurrency } from '../hooks/useCurrency';
import SEO from '../components/layout/SEO';
import { motion } from 'framer-motion';
import { Heart, MapPin, Calendar, Star, ArrowRight, Sun, Anchor, Mountain, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { packages, destinations, testimonials, homeContent } = useData();
  const { formatPrice } = useCurrency();
  
  // Featured packages for the home page (first 2 honeymoons)
  const featuredPackages = packages.filter(p => p.category === 'honeymoon').slice(0, 2);
  const featuredDestinations = destinations.slice(0, 3);

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
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="script-font mb-4 text-brand-accent italic">{homeContent.destinations.subtitle}</p>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-900 mb-6">
            {homeContent.destinations.title}
          </h2>
          <p className="text-brand-600 leading-relaxed text-lg">
            {homeContent.destinations.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDestinations.map((destination) => (
            <Link
              key={destination.id}
              to={`/destinations/${destination.slug}`}
              className="group relative h-[400px] sm:h-[500px] overflow-hidden rounded-3xl"
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-10 w-full text-white">
                <p className="text-sm uppercase tracking-widest font-medium mb-2 opacity-80">
                  {destination.continent}
                </p>
                <h3 className="text-3xl font-serif mb-4 group-hover:text-brand-accent transition-colors">
                  {destination.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-brand-200 group-hover:text-white transition-colors">
                  <span>Explore Destination</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Signature Packages */}
      <section className="bg-brand-100/50 py-24">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <p className="script-font mb-4 text-brand-accent italic">{homeContent.packages.subtitle}</p>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-900 mb-6">
                {homeContent.packages.title}
              </h2>
              <p className="text-brand-600 leading-relaxed text-lg">
                {homeContent.packages.description}
              </p>
            </div>
            <Link to="/packages" className="btn-outline">
              View All Packages
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {featuredPackages.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -10 }}
                className="romantic-card group flex flex-col h-full"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                  src={pkg.featuredImage}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80";
                  }}
                />
                  <div className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-brand-accent">
                    <Heart size={20} fill="currentColor" />
                  </div>
                  <div className="absolute bottom-6 left-6 flex gap-2">
                    {pkg.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-4 py-1.5 bg-brand-900/40 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-10 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4 text-xs uppercase tracking-[0.2em] font-bold text-brand-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{pkg.duration.days} Days / {pkg.duration.nights} Nights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      <span>{destinations.find(d => d.id === pkg.destinationId)?.name}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-serif text-brand-900 mb-4 group-hover:text-brand-accent transition-colors">
                    {pkg.title}
                  </h3>
                  <p className="text-brand-600 text-sm leading-relaxed mb-8 flex-grow">
                    {pkg.summary}
                  </p>

                  <div className="pt-8 border-t border-brand-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-400 mb-1">
                        Starting from
                      </p>
                      <p className="text-2xl font-serif text-brand-900">
                        {formatPrice(pkg.tiers[0].price)}
                        <span className="text-xs font-sans text-brand-400 ml-1 font-normal lowercase italic">/{pkg.tiers[0].basis.split(' ')[1]}</span>
                      </p>
                    </div>
                    <Link to={`/packages/${pkg.slug}`} className="btn-primary py-2.5 px-8 text-sm group-hover:bg-brand-accent transition-all">
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
      <section className="py-24 bg-white overflow-hidden">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="script-font mb-4 text-brand-accent italic">Your Perfect Match</p>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-900 mb-6">Browse by Style</h2>
            <p className="text-brand-600 max-w-2xl mx-auto text-lg">Every love story is unique. Find the experience that speaks to yours.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                label: 'Beach Romance', 
                icon: <Sun size={32} />, 
                color: 'from-orange-500/20 to-brand-accent/20',
                image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80',
                count: packages.filter(p => p.tags.includes('Beach Romance')).length
              },
              { 
                label: 'Island Bliss', 
                icon: <Anchor size={32} />, 
                color: 'from-blue-500/20 to-cyan-500/20',
                image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80',
                count: packages.filter(p => p.tags.includes('Island Bliss')).length
              },
              { 
                label: 'Mountain Escape', 
                icon: <Mountain size={32} />, 
                color: 'from-emerald-500/20 to-teal-500/20',
                image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80',
                count: packages.filter(p => p.tags.includes('Mountain Escape')).length
              },
              { 
                label: 'City Intimacy', 
                icon: <Coffee size={32} />, 
                color: 'from-purple-500/20 to-pink-500/20',
                image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80',
                count: packages.filter(p => p.tags.includes('City Intimacy')).length
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
      <section className="py-24 bg-brand-50/50 overflow-hidden">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"
                  alt="Romantic Moment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 to-transparent" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-accent/10 rounded-full -z-10 blur-3xl" />
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-brand-accent/5 rounded-full -z-10 blur-2xl" />
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="absolute top-1/2 -left-6 lg:-left-12 -translate-y-1/2 p-6 lg:p-10 bg-white/90 backdrop-blur-xl shadow-2xl rounded-[30px] lg:rounded-[40px] hidden sm:block border border-brand-100 max-w-[280px] lg:max-w-sm z-20"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-accent flex items-center justify-center text-white shadow-lg shadow-brand-accent/20">
                      <Heart size={24} fill="currentColor" />
                    </div>
                    <div>
                      <p className="font-serif text-lg text-brand-900">1,200+ Love Stories</p>
                      <p className="text-[10px] text-brand-400 uppercase tracking-widest font-bold">Planned with perfection</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-900 flex items-center justify-center text-white shadow-lg shadow-brand-900/20">
                      <Star size={24} fill="currentColor" className="text-brand-accent" />
                    </div>
                    <div>
                      <p className="font-serif text-lg text-brand-900">98% Excellence</p>
                      <p className="text-[10px] text-brand-400 uppercase tracking-widest font-bold">Couples rated 5-stars</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-10 order-1 lg:order-2">
              <div>
                <p className="script-font text-brand-accent text-2xl italic mb-4">Crafting the Extraordinary</p>
                <h2 className="text-4xl md:text-6xl font-serif text-brand-900 leading-tight mb-8">
                  Where Your New <br /> Life Begins
                </h2>
                <p className="text-brand-600 text-lg leading-relaxed mb-8">
                  We don't just book trips; we curate the opening chapter of your forever. From the first consultation to the final sunset, every detail is handled with the intimacy and care your love story deserves.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: 'Curated Intimacy', desc: 'Handpicked resorts that prioritize privacy and romantic atmosphere.' },
                  { title: 'Personalized Journeys', desc: 'Bespoke itineraries tailored to your unique shared interests.' },
                  { title: 'Seamless Planning', desc: 'Stress-free logistics handled by our expert romantic travel specialists.' },
                  { title: '24/7 Concierge', desc: 'On-the-ground support to ensure every moment is flawless.' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="font-serif text-xl text-brand-900">{item.title}</h4>
                    <p className="text-brand-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <Link to="/about" className="btn-primary px-10 py-4 inline-flex items-center gap-3">
                  Our Philosophy <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-100 to-transparent" />
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="script-font mb-4 text-brand-accent italic text-2xl">Romantic Reality</p>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-900 mb-6">Love Stories from Our Couples</h2>
            <p className="text-brand-600 max-w-2xl mx-auto text-lg">Real moments, shared journeys, and the beginning of forever.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-brand-50/50 rounded-[40px] p-8 md:p-10 relative flex flex-col group hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-brand-100"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-white">
                    <img src={testimonial.image} alt={testimonial.coupleName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-brand-900">{testimonial.coupleName}</h4>
                    <p className="text-[10px] text-brand-400 uppercase tracking-widest font-bold">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-6 text-brand-accent">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <div className="flex-grow">
                  <h5 className="text-xl font-serif text-brand-900 mb-4 italic">"{testimonial.quote}"</h5>
                  <p className="text-brand-600 text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                    {testimonial.story}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-brand-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-brand-400">
                    <MapPin size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{testimonial.destination}</span>
                  </div>
                  <span className="text-[10px] text-brand-300 font-bold uppercase tracking-widest">{testimonial.date}</span>
                </div>

                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-brand-accent rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-xl shadow-brand-accent/20">
                  <Heart size={18} className="sm:w-5 sm:h-5" fill="currentColor" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Journal */}

      {/* CTA Section */}
      <section className="bg-brand-900 py-24 text-center">
        <div className="section-container">
          <p className="script-font text-brand-accent mb-6 italic">Ready to Begin?</p>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 max-w-3xl mx-auto leading-tight">
            Let's Plan Your <br />
            <span className="italic">Perfect Honeymoon</span>
          </h2>
          <p className="text-brand-300 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
            Schedule a complimentary consultation with our romantic travel specialists today and start your journey together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/booking" className="btn-primary px-12 py-5 text-lg">
              Book a Consultation
            </Link>
            <Link to="/packages" className="text-white border-b border-white/30 hover:border-white transition-all py-2 text-lg">
              Explore All Packages
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
