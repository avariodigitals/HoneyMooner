import { motion } from 'framer-motion';
import { Heart, Globe, Users, Award } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/layout/SEO';

const About = () => {
  const stats = [
    { icon: <Globe className="w-6 h-6" />, label: 'Destinations', value: '50+' },
    { icon: <Heart className="w-6 h-6" />, label: 'Happy Couples', value: '1,200+' },
    { icon: <Users className="w-6 h-6" />, label: 'Travel Experts', value: '24/7' },
    { icon: <Award className="w-6 h-6" />, label: 'Experience', value: '15 Years' },
  ];

  return (
    <div className="pt-24 min-h-screen">
      <SEO
        title="About Us"
        description="Discover The Honeymooner Travel story and how our team curates intentional, luxury honeymoon experiences for couples worldwide."
        canonical="https://thehoneymoonertravel.com/about"
        keywords="about honeymoon planner, luxury honeymoon experts, romantic travel agency"
      />
      <Breadcrumbs />
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/pablo-heimplatz-OSboZGvoEz4-unsplash.jpg" 
            alt="Romantic Sunset" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-[1px]" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="script-font text-white mb-4 block"
          >
            Our Story
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif mb-6"
          >
            Planning Exceptional Honeymoons
          </motion.h1>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-brand-900">The Honeymooner Travel Philosophy</h2>
            <p className="text-lg text-brand-700 mb-6 leading-relaxed">
              We believe your honeymoon should be as intentional and memorable as your wedding day.
              The Honeymooner Travel was built to offer a premium planning experience for couples who want
              more than a standard package.
            </p>
            <p className="text-lg text-brand-700 mb-8 leading-relaxed">
              From the crystal-clear waters of the Maldives to the rustic charm of Tuscany, we curate every detail 
              with intimacy, luxury, and emotional storytelling at its core.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-start">
                  <div className="p-3 bg-brand-100 rounded-lg text-brand-accent mb-3">
                    {stat.icon}
                  </div>
                  <span className="text-2xl font-serif text-brand-900">{stat.value}</span>
                  <span className="text-sm text-brand-600 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/fernando-gago-MY7yQ1ISEIk-unsplash-scaled.jpg" 
              alt="Romantic Dinner" 
              loading="lazy"
              decoding="async"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Team/Values Section */}
      <section className="bg-brand-100 py-24">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-12 text-brand-900">Why We Are Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Curated Excellence',
                desc: 'We don\'t just list hotels; we handpick experiences that meet our rigorous standards of romance and luxury.'
              },
              {
                title: 'Personalized Planning',
                desc: 'Every couple is different. Our experts spend time understanding your vision to craft a bespoke itinerary.'
              },
              {
                title: 'Peace of Mind',
                desc: 'With 24/7 support and local connections, we handle the logistics so you can focus on each other.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-serif mb-4 text-brand-900">{value.title}</h3>
                <p className="text-brand-700">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
