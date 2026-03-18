import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Facebook, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-900 text-brand-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://ik.imagekit.io/lrnty9ku6/HoneyMooner/Full%20Logo%20No%20BG%20-%20White%20only.png" 
              alt="The Honeymooner" 
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </Link>
          <p className="text-brand-300 leading-relaxed text-sm">
            Crafting intimate, premium, and unforgettable romantic travel experiences for couples worldwide.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <a href="#" className="hover:text-brand-accent transition-colors">
              <Instagram size={24} />
            </a>
            <a href="#" className="hover:text-brand-accent transition-colors">
              <Facebook size={24} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-serif text-xl font-medium mb-8">Quick Links</h3>
          <ul className="space-y-4 text-sm text-brand-300">
            <li><Link to="/destinations" className="hover:text-white transition-colors">Destinations</Link></li>
            <li><Link to="/packages" className="hover:text-white transition-colors">Honeymoon Packages</Link></li>
            <li><Link to="/journal" className="hover:text-white transition-colors">Travel Journal</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
            <li><Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
          </ul>
        </div>

        {/* Destinations */}
        <div>
          <h3 className="font-serif text-xl font-medium mb-8">Popular Destinations</h3>
          <ul className="space-y-4 text-sm text-brand-300">
            <li><Link to="/destinations/maldives" className="hover:text-white transition-colors">Maldives</Link></li>
            <li><Link to="/destinations/bali" className="hover:text-white transition-colors">Bali, Indonesia</Link></li>
            <li><Link to="/destinations/santorini" className="hover:text-white transition-colors">Santorini, Greece</Link></li>
            <li><Link to="/destinations/bora-bora" className="hover:text-white transition-colors">Bora Bora</Link></li>
            <li><Link to="/destinations/paris" className="hover:text-white transition-colors">Paris, France</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-serif text-xl font-medium mb-8">Get In Touch</h3>
          <ul className="space-y-4 text-sm text-brand-300">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-brand-accent shrink-0" />
              <span>123 Romance Way, Victoria Island, Lagos, Nigeria</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-brand-accent shrink-0" />
              <span>+234 800 HONEYMOON</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-brand-accent shrink-0" />
              <span>hello@thehoneymooner.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-10 border-t border-brand-800 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-brand-400">
        <p>© 2026 The Honeymooner. All rights reserved.</p>
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex items-center gap-8">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p className="text-[10px] text-brand-500 italic">Designed and developed by Avario Digitals</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
