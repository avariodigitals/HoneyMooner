import { motion } from 'framer-motion';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/layout/SEO';

const NotFound = () => {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center bg-brand-50 pt-32 pb-20">
      <SEO 
        title="Page Not Found | The Honeymooner Travel" 
        description="The page you are looking for does not exist. Let's get you back on track to planning your dream honeymoon."
      />
      
      <div className="relative z-10 max-w-4xl w-full text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block mb-10"
        >
          <Compass size={64} strokeWidth={1.5} className="text-brand-accent/60 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-7xl sm:text-9xl font-serif text-brand-900/20 mb-2 tracking-widest leading-none">
            404
          </h1>
          
          <div className="space-y-6 mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-800 leading-tight">
              Lost in Paradise?
            </h2>
            <p className="text-brand-600/90 text-lg sm:text-xl max-w-lg mx-auto leading-relaxed italic px-4">
              "Not all those who wander are lost, but this page definitely is."
            </p>
            <p className="text-brand-600/70 text-base sm:text-lg max-w-md mx-auto leading-relaxed px-4">
              The romantic escape you were looking for has drifted away. Let's find your way back to your dream destination.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 max-w-md mx-auto px-4">
            <Link
              to="/"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 bg-brand-accent text-white px-10 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs shadow-[0_10px_30px_rgba(196,154,108,0.3)] hover:bg-brand-700 hover:shadow-brand-accent/40 transition-all duration-500 group"
            >
              <Home size={18} className="group-hover:scale-110 transition-transform duration-500" />
              Return Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 bg-white border border-brand-200 text-brand-900 px-10 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs hover:border-brand-accent hover:text-brand-accent shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-500" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
