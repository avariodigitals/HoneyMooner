import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import CurrencyProvider from './context/CurrencyProvider';
import { UserProvider } from './context/UserProvider';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Packages from './pages/Packages';
import Experiences from './pages/Experiences';
import PackageTypeLanding from './pages/PackageTypeLanding';
import PackageDetail from './pages/PackageDetail';
import Booking from './pages/Booking';
import PopularRouteIdeas from './pages/PopularRouteIdeas';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';
import Journal from './pages/Journal';
import JournalDetail from './pages/JournalDetail';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import GiftCards from './pages/GiftCards';
import GiftCardCheckout from './pages/GiftCardCheckout';
import ResetPassword from './pages/ResetPassword';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:slug" element={<Destinations />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/popular-route-ideas" element={<PopularRouteIdeas />} />
        <Route path="/packages/type/:slug" element={<PackageTypeLanding />} />
        <Route path="/packages/:slug" element={<PackageDetail />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:slug" element={<JournalDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/gift-cards" element={<GiftCards />} />
        <Route path="/gift-cards/checkout" element={<GiftCardCheckout />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/wishlist" element={<Wishlist />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-50 selection:bg-brand-accent selection:text-white overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      <Footer />
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
