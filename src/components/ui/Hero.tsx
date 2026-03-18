import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MessageCircleHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../hooks/useData';

import { ASSETS } from '../../config/images';

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
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = ASSETS.FALLBACK_HERO;
          }}
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
            The Account
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] tracking-tight drop-shadow-2xl">
            {homeContent.hero.title.split('&').map((part, i) => (
              <span key={i} className="block">
                {i === 1 && <span className="italic font-light opacity-80">& </span>}
                {part.trim()}
              </span>
            ))}
          </h1>

          <p className="text-lg md:text-xl font-light italic text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg opacity-90">
            {homeContent.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-10 mt-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-brand-accent/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <Link 
                to="/destinations" 
                className="relative bg-brand-accent text-white py-4 px-10 rounded-full text-sm font-bold uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(196,154,108,0.2)] flex items-center gap-3 overflow-hidden border border-brand-accent hover:bg-brand-700 transition-all duration-500 group"
              >
                <span className="relative z-10">{homeContent.hero.cta}</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                
                {/* Romantic Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <Link 
                to="/account" 
                className="relative px-8 py-4 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full text-white font-bold text-xs uppercase tracking-[0.3em] hover:bg-white/10 hover:border-brand-accent/50 transition-all duration-500 flex items-center gap-2 group"
              >
                <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-brand-accent/30 transition-all duration-700 scale-110 group-hover:scale-100 opacity-0 group-hover:opacity-100" />
                <MessageCircleHeart size={20} className="text-brand-accent group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                <span className="relative z-10">Private Concierge</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
