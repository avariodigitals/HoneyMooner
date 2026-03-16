import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ArrowRight } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Packages', path: '/packages' },
    { name: 'Journal', path: '/journal' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isTransparent = !isScrolled && location.pathname === '/' && !isOpen;

  const logoUrl = isTransparent 
    ? "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Wordmark%20Logo%20No%20BG%20-%20White%20Only.png?updatedAt=1773691277015" 
    : "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Full%20Logo%20No%20BG%20(1).png?updatedAt=1773691277034";

  return (
    <nav
      className={cn(
        'fixed w-full z-[100] transition-all duration-500 px-4 py-4',
        isTransparent ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 group relative z-[110]">
          <img 
            src={logoUrl} 
            alt="The Honeymooner" 
            className={cn(
              "w-auto transition-all duration-500 block",
              isTransparent ? "h-28 sm:h-36" : "h-20 sm:h-28"
            )}
            style={{ minHeight: isTransparent ? '112px' : '80px' }}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-all duration-300 uppercase tracking-widest',
                location.pathname === link.path 
                  ? 'text-brand-accent' 
                  : (isTransparent ? 'text-white/90 hover:text-white drop-shadow-sm' : 'text-brand-700 hover:text-brand-accent')
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Currency Switcher */}
          <div className="relative">
            <button 
              onClick={() => setShowCurrency(!showCurrency)}
              className={cn(
                'flex items-center gap-1 text-sm font-medium transition-all duration-300 uppercase tracking-widest',
                isTransparent ? 'text-white/90 hover:text-white drop-shadow-sm' : 'text-brand-700 hover:text-brand-accent'
              )}
            >
              <Globe size={16} />
              {currency.code}
            </button>
            {showCurrency && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-brand-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {availableCurrencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr.code);
                      setShowCurrency(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-brand-50",
                      currency.code === curr.code ? "text-brand-accent font-semibold" : "text-brand-700"
                    )}
                  >
                    {curr.code} ({curr.symbol})
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/booking" className={cn(
            "btn-primary py-2 px-6 text-sm transition-all duration-300",
            isTransparent && "bg-white text-brand-900 hover:bg-brand-50 border-white"
          )}>
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            'md:hidden relative z-[110] p-2 transition-all duration-300 rounded-full',
            isOpen 
              ? 'text-white bg-white/10' 
              : (isTransparent ? 'text-white bg-black/10' : 'text-brand-900 bg-brand-50')
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[105] bg-brand-900 flex flex-col overflow-hidden"
          >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-accent/20 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-accent/10 rounded-full blur-[120px]" />
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <img 
                  src="https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Wordmark%20Logo%20No%20BG%20-%20White%20Only.png?updatedAt=1773691277015" 
                  alt=""
                  className="w-[150%] max-w-none rotate-[-15deg]"
                />
              </div>
            </div>

            <div className="relative z-10 flex flex-col h-full p-8 pt-40 pb-12">
              <div className="flex flex-col gap-8">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-5xl font-serif flex items-center justify-between group transition-all duration-500",
                        location.pathname === link.path ? "text-brand-accent" : "text-white hover:text-brand-accent"
                      )}
                    >
                      <span className="relative">
                        {link.name}
                        {location.pathname === link.path && (
                          <motion.div 
                            layoutId="mobile-nav-indicator"
                            className="absolute -bottom-2 left-0 w-12 h-0.5 bg-brand-accent"
                          />
                        )}
                      </span>
                      <ArrowRight className={cn(
                        "opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0",
                        location.pathname === link.path && "opacity-50 translate-x-0"
                      )} size={32} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto space-y-10">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-between p-8 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center">
                      <Globe className="text-brand-accent" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-brand-300 font-bold mb-1">Currency</p>
                      <p className="font-medium text-white">{currency.code} ({currency.symbol})</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {availableCurrencies.map(curr => (
                      <button
                        key={curr.code}
                        onClick={() => setCurrency(curr.code)}
                        className={cn(
                          "w-12 h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center",
                          currency.code === curr.code 
                            ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20" 
                            : "bg-white/5 text-white/40 hover:bg-white/10"
                        )}
                      >
                        {curr.code}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Link
                    to="/booking"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full py-6 text-xl text-center shadow-2xl shadow-brand-accent/30 flex items-center justify-center gap-4 group"
                  >
                    Start Your Journey
                    <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" />
                  </Link>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-center space-y-2"
                >
                  <p className="script-font text-brand-accent text-3xl">Love is in the air</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-medium">The Honeymooner &copy; 2026</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
