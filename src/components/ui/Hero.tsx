import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../hooks/useData';

const Hero = () => {
  const { homeContent } = useData();

  return (
    <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-brand-900 w-full">
      {/* Dynamic Hero Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={homeContent.hero.image} 
          className="w-full h-full object-cover opacity-60 scale-105 origin-center"
          alt="Luxury Honeymoon"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/40 via-transparent to-brand-900/80" />
      </div>

      <div className="section-container relative z-10 text-center text-white px-4 pt-20 max-w-full overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-brand-accent text-sm font-bold uppercase tracking-[0.3em] shadow-2xl">
            <Sparkles size={16} fill="currentColor" />
            The Sanctuary
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-serif leading-none tracking-tight drop-shadow-2xl">
            {homeContent.hero.title.split('&').map((part, i) => (
              <span key={i} className="block">
                {i === 1 && <span className="italic font-light opacity-80">& </span>}
                {part.trim()}
              </span>
            ))}
          </h1>

          <p className="text-xl md:text-2xl font-light italic text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            {homeContent.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
            <Link to="/destinations" className="btn-primary py-5 px-12 text-lg shadow-2xl shadow-brand-accent/20 group">
              {homeContent.hero.cta}
              <ArrowRight className="inline-block ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/sanctuary" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold text-sm uppercase tracking-[0.2em] hover:bg-white/20 transition-all">
              Private Concierge
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
