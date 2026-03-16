import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80"
          alt="Luxury Honeymoon"
          className="w-full h-full object-cover brightness-[0.7] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-brand-900/40" />
        
        {/* Subtle Watermark */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none p-4"
        >
          <img 
            src="https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Wordmark%20Logo%20No%20BG%20-%20White%20Only.png?updatedAt=1773691277015" 
            alt="The Honeymooner Watermark"
            className="w-full max-w-[140rem] h-auto object-contain opacity-50"
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="script-font mb-6 drop-shadow-lg text-white/90 italic"
        >
          Your forever begins here
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-serif text-white mb-8 leading-[1.1] drop-shadow-2xl"
        >
          Curated Romantic <br />
          <span className="italic">Experiences</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
        >
          Handpicked luxury honeymoons and intimate escapes designed for couples who value beauty, storytelling, and effortless planning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link to="/destinations" className="btn-primary px-10 py-4 text-lg">
            Explore Destinations
          </Link>
          <Link to="/booking" className="px-10 py-4 text-lg text-white border border-white/50 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm">
            Book a Consultation
          </Link>
        </motion.div>
      </div>

      {/* Decorative Scroll Down (Mobile only) */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 md:hidden"
      >
        <span className="text-white/60 text-xs uppercase tracking-[0.2em] font-medium">Scroll to Explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
