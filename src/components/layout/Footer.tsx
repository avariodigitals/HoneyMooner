import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Facebook, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-900 text-brand-50 pt-20 pb-10">
      {/* Ready to Begin Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 text-center">
        <div className="relative rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-20 overflow-hidden group">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/abshky-5D5Pyj33S5o-unsplash-scaled.jpg" 
              alt="Romantic Background" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-brand-900/80 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif mb-6 sm:mb-8 leading-tight text-white px-2">
              Start Planning Your Honeymoon Today — Speak to a Specialist in Minutes
            </h2>
            <p className="text-brand-100 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 font-light px-4">
              Get a custom itinerary, pricing, and availability tailored to your budget and timeline.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link to="/booking" className="btn-primary w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg text-center">
                Start Planning
              </Link>
              <Link to="/contact" className="btn-outline w-full sm:w-auto border-white text-white hover:bg-white hover:text-brand-900 px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg text-center">
                Talk to Concierge
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
        {/* Brand Info */}
        <div className="space-y-6 text-center sm:text-left">
          <Link to="/" className="flex items-center justify-center sm:justify-start gap-2">
            <img 
              src="https://ik.imagekit.io/lrnty9ku6/HoneyMooner/Full%20Logo%20No%20BG%20-%20White%20only.png" 
              alt="The Honeymooner Travel" 
              className="h-12 sm:h-16 lg:h-20 w-auto object-contain"
            />
          </Link>
          <p className="text-brand-300 leading-relaxed text-sm max-w-xs mx-auto sm:mx-0">
            Crafting intimate, premium, and unforgettable romantic travel experiences for couples worldwide.
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-4 pt-2">
            <a href="https://www.instagram.com/thehoneymooner/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a href="https://web.facebook.com/thehoneymooner?" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
              <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center sm:text-left pt-4 sm:pt-0">
          <h3 className="font-serif text-lg sm:text-xl font-medium mb-6 sm:mb-8">Quick Links</h3>
          <ul className="space-y-3 sm:space-y-4 text-sm text-brand-300">
            <li><Link to="/destinations" className="hover:text-white transition-colors">Destinations</Link></li>
            <li><Link to="/packages" className="hover:text-white transition-colors">Honeymoon Packages</Link></li>
            <li><Link to="/journal" className="hover:text-white transition-colors">Travel Journal</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
            <li><Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
          </ul>
        </div>

        {/* Destinations */}
        <div className="text-center sm:text-left pt-4 sm:pt-0">
          <h3 className="font-serif text-lg sm:text-xl font-medium mb-6 sm:mb-8">Popular Destinations</h3>
          <ul className="space-y-3 sm:space-y-4 text-sm text-brand-300">
            <li><Link to="/destinations/maldives" className="hover:text-white transition-colors">Maldives</Link></li>
            <li><Link to="/destinations/bali" className="hover:text-white transition-colors">Bali, Indonesia</Link></li>
            <li><Link to="/destinations/santorini" className="hover:text-white transition-colors">Santorini, Greece</Link></li>
            <li><Link to="/destinations/bora-bora" className="hover:text-white transition-colors">Bora Bora</Link></li>
            <li><Link to="/destinations/paris" className="hover:text-white transition-colors">Paris, France</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-center sm:text-left pt-4 sm:pt-0">
          <h3 className="font-serif text-lg sm:text-xl font-medium mb-6 sm:mb-8">Get In Touch</h3>
          <ul className="space-y-3 sm:space-y-4 text-sm text-brand-300">
            <li className="flex items-start justify-center sm:justify-start gap-3">
              <MapPin size={18} className="text-brand-accent shrink-0 mt-0.5" />
              <span>UNIT 1, 137 Cheetham Hill Rd, Cheetham Hill, Manchester M8 8LY</span>
            </li>
            <li className="flex items-center justify-center sm:justify-start gap-3">
              <Phone size={18} className="text-brand-accent shrink-0" />
              <div className="flex flex-col gap-1">
                <span>+447341899849</span>
                <span>+2358131760694</span>
              </div>
            </li>
            <li className="flex items-center justify-center sm:justify-start gap-3">
              <Mail size={18} className="text-brand-accent shrink-0" />
              <span>info@thehoneymoonner.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 pt-8 sm:pt-10 border-t border-brand-800 text-sm text-brand-400">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p>© 2026. All rights reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
        <p className="mt-6 text-center text-[9px] sm:text-[10px] text-brand-500 italic">
          Designed and developed by{' '}
          <a
            href="https://avariodigitals.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Avario Digitals
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
