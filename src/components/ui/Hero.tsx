import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../hooks/useData';

import { ASSETS } from '../../config/images';

const Hero = () => {
  const { homeContent } = useData();

  if (!homeContent?.hero) return null;

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
            target.src = homeContent.fallbackImages.hero || ASSETS.FALLBACK_HERO;
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif leading-[1.2] sm:leading-tight tracking-tight drop-shadow-2xl max-w-5xl mx-auto px-2">
            {homeContent.hero.title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-medium italic text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg opacity-100 px-4">
            {homeContent.hero.subtitle}
          </p>

          <div className="mt-8 w-full max-w-5xl px-6 flex flex-col items-center gap-4 sm:gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="relative group w-full"
            >
              <div className="absolute -inset-1 bg-brand-accent/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
              {homeContent.hero.cta.url?.startsWith('http') ? (
                <a 
                  href={homeContent.hero.cta.url} 
                  className="relative w-full min-h-[56px] bg-brand-accent text-white py-3 sm:py-4 px-8 rounded-full text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(196,154,108,0.2)] flex items-center justify-center gap-3 overflow-hidden border border-brand-accent hover:bg-brand-700 transition-all duration-500 group"
                >
                  <span className="relative z-10">{homeContent.hero.cta.label}</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </a>
              ) : (
                <Link 
                  to={homeContent.hero.cta.url || "/booking"} 
                  className="relative w-full min-h-[56px] bg-brand-accent text-white py-3 sm:py-4 px-8 rounded-full text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(196,154,108,0.2)] flex items-center justify-center gap-3 overflow-hidden border border-brand-accent hover:bg-brand-700 transition-all duration-500 group"
                >
                  <span className="relative z-10">{homeContent.hero.cta.label}</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </Link>
              )}
            </motion.div>

            {homeContent.hero.cta2 && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="w-full"
              >
                {homeContent.hero.cta2.url?.startsWith('http') ? (
                  <a 
                    href={homeContent.hero.cta2.url} 
                    className="relative w-full min-h-[56px] px-8 py-3 sm:py-4 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full text-white font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] hover:bg-white/10 hover:border-brand-accent/50 transition-all duration-500 flex items-center justify-center gap-2 group"
                  >
                    <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-brand-accent/30 transition-all duration-700 scale-110 group-hover:scale-100 opacity-0 group-hover:opacity-100" />
                    <span className="relative z-10">{homeContent.hero.cta2.label}</span>
                  </a>
                ) : (
                  <Link 
                    to={homeContent.hero.cta2.url || "/packages"} 
                    className="relative w-full min-h-[56px] px-8 py-3 sm:py-4 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full text-white font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] hover:bg-white/10 hover:border-brand-accent/50 transition-all duration-500 flex items-center justify-center gap-2 group"
                  >
                    <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-brand-accent/30 transition-all duration-700 scale-110 group-hover:scale-100 opacity-0 group-hover:opacity-100" />
                    <span className="relative z-10">{homeContent.hero.cta2.label}</span>
                  </Link>
                )}
              </motion.div>
            )}
            {!homeContent.hero.cta2 && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="w-full"
              >
                <Link 
                  to="/packages" 
                  className="relative w-full min-h-[56px] px-8 py-3 sm:py-4 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full text-white font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] hover:bg-white/10 hover:border-brand-accent/50 transition-all duration-500 flex items-center justify-center gap-2 group"
                >
                  <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-brand-accent/30 transition-all duration-700 scale-110 group-hover:scale-100 opacity-0 group-hover:opacity-100" />
                  <span className="relative z-10">View Packages</span>
                </Link>
              </motion.div>
            )}
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
