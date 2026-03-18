import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CurrencyProvider } from './context/CurrencyProvider';
import { UserProvider } from './context/UserProvider';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Booking from './pages/Booking';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';
import Journal from './pages/Journal';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:slug" element={<Destinations />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:slug" element={<PackageDetail />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/wishlist" element={<Wishlist />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/admin';

  return (
    <div className="flex flex-col min-h-screen bg-brand-50 selection:bg-brand-accent selection:text-white overflow-x-hidden">
      {!hideHeaderFooter && <Navbar />}
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      {!hideHeaderFooter && <Footer />}
      <ScrollToTopButton />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <UserProvider>
        <CurrencyProvider>
          <Router>
            <ScrollToTop />
            <AppContent />
          </Router>
        </CurrencyProvider>
      </UserProvider>
    </HelmetProvider>
  );
}

export default App;
