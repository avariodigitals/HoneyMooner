import { motion } from 'framer-motion';
import { Heart, Globe, Users, Award, Camera } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const About = () => {
  const stats = [
    { icon: <Globe className="w-6 h-6" />, label: 'Destinations', value: '50+' },
    { icon: <Heart className="w-6 h-6" />, label: 'Happy Couples', value: '1,200+' },
    { icon: <Users className="w-6 h-6" />, label: 'Travel Experts', value: '24/7' },
    { icon: <Award className="w-6 h-6" />, label: 'Experience', value: '15 Years' },
  ];

  return (
    <div className="pt-24 min-h-screen">
      <Breadcrumbs />
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=2070" 
            alt="Romantic Sunset" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-[1px]" />
          
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <img 
              src="https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Wordmark%20Logo%20No%20BG%20-%20White%20Only.png?updatedAt=1773691277015" 
              alt=""
              className="w-full max-w-[140rem] h-auto object-contain"
            />
          </div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="script-font text-white mb-4 block"
          >
            Our Love Story
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif mb-6"
          >
            Crafting Moments That Last Forever
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
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-brand-900">The Honeymooner Philosophy</h2>
            <p className="text-lg text-brand-700 mb-6 leading-relaxed">
              We believe that the start of your journey as a married couple should be as magical as the wedding itself. 
              The Honeymooner was born out of a desire to create a standalone, premium sanctuary for couples seeking 
              more than just a trip—they seek an experience that reflects their unique love story.
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
              src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1974" 
              alt="Romantic Dinner" 
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 p-6 bg-white rounded-xl shadow-xl hidden md:block">
              <Camera className="w-8 h-8 text-brand-accent mb-2" />
              <p className="font-serif italic text-brand-900">Capturing love in its purest form.</p>
            </div>
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
