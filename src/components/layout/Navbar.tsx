import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ArrowRight, Instagram, Facebook, Mail, MessageCircle } from 'lucide-react';
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
            className="fixed inset-0 z-[105] bg-brand-900 flex flex-col overflow-y-auto custom-scrollbar h-[100dvh]"
          >
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none overflow-hidden h-[100dvh]">
              <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-brand-accent/20 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-brand-accent/10 rounded-full blur-[120px]" />
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <img 
                  src="https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Wordmark%20Logo%20No%20BG%20-%20White%20Only.png?updatedAt=1773691277015" 
                  alt=""
                  className="w-[200%] max-w-none rotate-[-15deg] scale-150"
                />
              </div>
            </div>

            <div className="relative z-10 flex flex-col min-h-[100dvh] p-6 sm:p-10 pt-32 pb-12">
              <div className="flex flex-col gap-6 sm:gap-8 mb-12">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.1, ease: "easeOut" }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-4xl sm:text-6xl font-serif flex items-center justify-between group transition-all duration-500",
                        location.pathname === link.path ? "text-brand-accent" : "text-white hover:text-brand-accent"
                      )}
                    >
                      <span className="relative">
                        {link.name}
                        {location.pathname === link.path && (
                          <motion.div 
                            layoutId="mobile-nav-indicator"
                            className="absolute -bottom-1 left-0 w-8 h-0.5 bg-brand-accent"
                          />
                        )}
                      </span>
                      <ArrowRight className={cn(
                        "transition-all duration-500",
                        location.pathname === link.path ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                      )} size={28} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-12 space-y-12">
                {/* Concierge Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <a 
                    href="https://wa.me/234800HONEYMOON" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col gap-3 p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-brand-300 font-bold mb-1">WhatsApp</p>
                      <p className="text-sm font-medium text-white">Concierge</p>
                    </div>
                  </a>
                  <Link 
                    to="/contact" 
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col gap-3 p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-brand-300 font-bold mb-1">Email Us</p>
                      <p className="text-sm font-medium text-white">Inquiries</p>
                    </div>
                  </Link>
                </motion.div>

                {/* Footer of Menu */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col gap-8 border-t border-white/10 pt-12"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-6">
                      <a href="#" className="text-white/40 hover:text-brand-accent transition-colors"><Instagram size={20} /></a>
                      <a href="#" className="text-white/40 hover:text-brand-accent transition-colors"><Facebook size={20} /></a>
                    </div>
                    
                    {/* Minimalist Currency Switcher */}
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                      <Globe size={14} className="text-brand-300" />
                      <div className="flex gap-3">
                        {availableCurrencies.map(curr => (
                          <button
                            key={curr.code}
                            onClick={() => setCurrency(curr.code)}
                            className={cn(
                              "text-[10px] font-bold transition-all",
                              currency.code === curr.code ? "text-brand-accent" : "text-white/30 hover:text-white"
                            )}
                          >
                            {curr.code}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <p className="script-font text-brand-accent text-3xl opacity-80">The Honeymooner</p>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-medium italic">Bespoke Romantic Journeys &copy; 2026</p>
                  </div>
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
