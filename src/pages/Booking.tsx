import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { useCurrency } from '../hooks/useCurrency';
import type { Lead, TravelPackage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Mail, 
  Phone, 
  User, 
  MessageSquare, 
  Heart, 
  Send, 
  ArrowLeft, 
  CheckCircle2, 
  Star, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Package as PackageIcon,
  Crown,
  Globe,
  Users as UsersIcon,
  Loader2
} from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const generateId = () => Math.random().toString(36).substring(2, 11);

interface DropdownOption {
  id: string;
  title?: string;
  name?: string;
  summary?: string;
  price?: number;
}

const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  label,
  icon: Icon,
  formatPrice
}: { 
  options: DropdownOption[], 
  value: string, 
  onChange: (val: string) => void, 
  placeholder: string,
  label: string,
  icon: React.ElementType,
  formatPrice?: (price: number) => string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3 sm:space-y-4 relative" ref={dropdownRef}>
      <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">{label}</label>
      <button
        type="button"
        disabled={options.length === 0}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border border-brand-100 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-between transition-all hover:border-brand-accent/50 group ${isOpen ? 'ring-2 ring-brand-accent/20 border-brand-accent' : ''} ${options.length === 0 ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`transition-colors ${selectedOption ? 'text-brand-accent' : 'text-brand-200 group-hover:text-brand-accent/50'}`} size={18} />
          <span className={`text-sm sm:text-base ${selectedOption ? 'text-brand-900 font-medium' : 'text-brand-300'}`}>
            {selectedOption ? (selectedOption.title || selectedOption.name) : placeholder}
          </span>
        </div>
        {options.length > 0 && (
          isOpen ? <ChevronUp size={18} className="text-brand-400" /> : <ChevronDown size={18} className="text-brand-400" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 right-0 top-full mt-2 bg-white border border-brand-100 rounded-2xl shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar"
          >
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-6 py-4 flex items-center justify-between transition-colors hover:bg-brand-50 group ${value === opt.id ? 'bg-brand-50' : ''}`}
              >
                <div className="flex flex-col">
                  <span className={`text-sm sm:text-base transition-colors ${value === opt.id ? 'text-brand-accent font-semibold' : 'text-brand-900 group-hover:text-brand-accent'}`}>
                    {opt.title || opt.name}
                  </span>
                  {opt.summary && (
                    <span className="text-[10px] sm:text-xs text-brand-400 mt-1 line-clamp-1 italic">
                      {opt.summary}
                    </span>
                  )}
                  {opt.price && formatPrice && (
                    <span className="text-xs text-brand-500 mt-1 font-serif">
                      Starting from {formatPrice(opt.price)}
                    </span>
                  )}
                </div>
                {value === opt.id && <CheckCircle2 size={16} className="text-brand-accent" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface BookingFormProps {
  initialData: {
    packageId: string;
    tierId: string;
    departureDate: string;
    adults: number;
    children: number;
    travelerName: string;
    email: string;
    phone: string;
    countryOfResidence: string;
    occasion: Lead['occasion'];
    message: string;
  };
  packages: TravelPackage[];
  addLead: (lead: Lead) => Promise<boolean>;
  formatPrice: (price: number) => string;
}

const BookingForm = ({ initialData, packages, addLead, formatPrice }: BookingFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBespoke = formData.packageId === 'bespoke';

  const selectedPkg = useMemo(() => 
    packages.find(p => p.id === formData.packageId),
    [packages, formData.packageId]
  );

  const selectedTier = useMemo(() => 
    selectedPkg?.tiers.find(t => t.id === formData.tierId) || selectedPkg?.tiers[0],
    [selectedPkg, formData.tierId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.packageId) return;
    setIsSubmitting(true);

    const newLead: Lead = {
      id: generateId(),
      packageId: formData.packageId,
      packageName: isBespoke ? 'Bespoke Custom Journey' : (selectedPkg?.title || ''),
      departureDate: formData.departureDate,
      adults: formData.adults,
      children: formData.children,
      travelerName: formData.travelerName,
      email: formData.email,
      phone: formData.phone,
      countryOfResidence: formData.countryOfResidence,
      occasion: formData.occasion,
      message: formData.message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      await addLead(newLead);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('There was an error submitting your enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-24 pb-24 min-h-screen section-container text-center">
        <Breadcrumbs />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-serif text-brand-900">Enquiry Received!</h1>
          <p className="text-brand-600 text-lg leading-relaxed">
            Thank you for reaching out to The Honeymooner. Our romantic travel specialist will contact you via WhatsApp or Email within the next 24 hours to begin planning your dream escape.
          </p>
          <div className="pt-10">
            <button
              onClick={() => navigate('/')}
              className="btn-primary px-12 py-4"
            >
              Return Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 min-h-screen bg-brand-50/50">
      <Breadcrumbs />
      <section className="section-container">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-400 hover:text-brand-accent transition-colors mb-12 uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-20">
          {/* Form Side */}
          <div className="space-y-10 lg:space-y-12">
            <div>
              <p className="script-font mb-4">The First Step</p>
              <h1 className="text-3xl md:text-5xl font-serif text-brand-900 mb-6">Plan Your Dream Escape</h1>
              <p className="text-brand-600 leading-relaxed text-base sm:text-lg">
                Fill out the form below and our specialists will create a personalized itinerary for your romantic journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Package Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <CustomDropdown
                  label="Select Package"
                  placeholder="Choose a package..."
                  icon={PackageIcon}
                  value={formData.packageId}
                  options={[
                    { id: 'bespoke', title: '✨ Tailor-Made Bespoke Journey', summary: 'Let us craft a completely unique experience for you.' },
                    ...packages.map(p => ({
                      ...p,
                      price: Math.min(...p.tiers.map(t => t.price))
                    }))
                  ]}
                  onChange={(pkgId) => {
                    const pkg = packages.find(p => p.id === pkgId);
                    setFormData({
                      ...formData,
                      packageId: pkgId,
                      tierId: pkgId === 'bespoke' ? 'bespoke' : (pkg?.tiers[0]?.id || '')
                    });
                  }}
                  formatPrice={formatPrice}
                />
                {!isBespoke ? (
                  <CustomDropdown
                    label="Experience Level"
                    placeholder={formData.packageId ? "Choose experience..." : "Select a package first"}
                    icon={Crown}
                    value={formData.tierId}
                    options={selectedPkg?.tiers.map(t => ({
                      ...t,
                      title: `${t.name} - ${formatPrice(t.price)}`
                    })) || []}
                    onChange={(tierId) => setFormData({ ...formData, tierId })}
                    formatPrice={formatPrice}
                  />
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Estimated Budget (USD)</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200" size={18} />
                      <select
                        className="w-full pl-12 pr-4 sm:pr-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base bg-white appearance-none"
                        value={formData.message.includes('Budget:') ? formData.message.split('Budget: ')[1].split('\n')[0] : ''}
                        onChange={(e) => setFormData({ ...formData, message: `Budget: ${e.target.value}\n${formData.message}` })}
                      >
                        <option value="">Select budget range</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                        <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                        <option value="$50,000+">$50,000+</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Occasion Selection */}
              <div className="space-y-3 sm:space-y-4">
                <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">The Occasion</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {(['honeymoon', 'anniversary', 'proposal', 'other'] as const).map(occ => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setFormData({ ...formData, occasion: occ })}
                      className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                        formData.occasion === occ
                          ? 'bg-brand-accent text-white border-brand-accent shadow-md'
                          : 'bg-white text-brand-600 border-brand-100 hover:border-brand-accent'
                      }`}
                    >
                      {occ.charAt(0).toUpperCase() + occ.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="Enter your name"
                      className="w-full pl-12 pr-4 sm:pr-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base"
                      value={formData.travelerName}
                      onChange={(e) => setFormData({ ...formData, travelerName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200" size={18} />
                    <input
                      required
                      type="email"
                      placeholder="Email for correspondence"
                      className="w-full pl-12 pr-4 sm:pr-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">WhatsApp / Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200" size={18} />
                    <input
                      required
                      type="tel"
                      placeholder="+234..."
                      className="w-full pl-12 pr-4 sm:pr-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Departure Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200" size={18} />
                    {selectedPkg?.departures && selectedPkg.departures.length > 0 ? (
                      <select
                        required
                        className="w-full pl-12 pr-4 sm:pr-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base bg-white appearance-none"
                        value={formData.departureDate}
                        onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                      >
                        <option value="">Select a departure date</option>
                        {selectedPkg.departures.map(d => (
                          <option key={d.id} value={d.date} disabled={d.availability === 'sold-out'}>
                            {new Date(d.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} 
                            {d.availability !== 'available' ? ` (${d.availability})` : ''}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        required
                        type="date"
                        className="w-full pl-12 pr-4 sm:pr-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base"
                        value={formData.departureDate}
                        onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Country of Residence</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Nigeria"
                      className="w-full pl-12 pr-4 sm:pr-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base"
                      value={formData.countryOfResidence}
                      onChange={(e) => setFormData({ ...formData, countryOfResidence: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Travellers</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <UsersIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200" size={16} />
                      <input
                        type="number"
                        min="1"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-100 text-sm"
                        value={formData.adults}
                        onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-brand-400 font-bold">Adults</span>
                    </div>
                    <div className="relative">
                      <UsersIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200" size={16} />
                      <input
                        type="number"
                        min="0"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-100 text-sm"
                        value={formData.children}
                        onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-brand-400 font-bold">Kids</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Special Requests</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-6 text-brand-200" size={18} />
                  <textarea
                    rows={4}
                    placeholder="Tell us about your preferences, allergies, or surprises you want to plan..."
                    className="w-full pl-12 pr-4 sm:pr-6 py-4 sm:py-6 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary w-full py-4 sm:py-5 flex items-center justify-center gap-3 text-base sm:text-lg shadow-xl shadow-brand-accent/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Enquiry
                    <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Side */}
          <div className="space-y-8 lg:space-y-10 xl:sticky xl:top-32 h-fit">
            {isBespoke ? (
              <div className="bg-brand-900 text-white rounded-[40px] p-8 sm:p-12 space-y-10 relative overflow-hidden shadow-2xl border border-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-brand-accent/20 rounded-2xl flex items-center justify-center text-brand-accent mb-8">
                    <Star size={32} fill="currentColor" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif leading-tight mb-8 italic">
                    Your Vision, <br /> Our Craftsmanship.
                  </h3>
                  <div className="space-y-6">
                    <p className="text-brand-100 text-lg leading-relaxed opacity-80 font-light">
                      A bespoke journey is more than a trip—it's a masterpiece tailored to your specific romantic narrative. 
                    </p>
                    <ul className="space-y-4 pt-6 border-t border-white/10">
                      {[
                        'Fully customizable itinerary',
                        'Private, hand-picked locations',
                        'Dedicated travel designer',
                        'Ultra-exclusive experiences'
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-4 text-brand-50/90 font-medium">
                          <CheckCircle2 size={18} className="text-brand-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (selectedPkg && selectedTier) ? (
              <div className="bg-white rounded-[32px] overflow-hidden border border-brand-100 shadow-xl">
                <div className="h-48 sm:h-64 relative">
                  <img
                    src={selectedPkg.featuredImage}
                    alt={selectedPkg.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-1">Your Selection</p>
                    <h3 className="text-xl sm:text-2xl font-serif">{selectedPkg.title}</h3>
                  </div>
                </div>
                <div className="p-6 sm:p-10 space-y-4 sm:space-y-6">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-brand-400">Experience</span>
                    <span className="font-bold text-brand-accent uppercase tracking-widest">{selectedTier.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-brand-400">Duration</span>
                    <span className="font-medium text-brand-900">{selectedPkg.duration.days} Days / {selectedPkg.duration.nights} Nights</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-brand-400">Price ({selectedTier.basis})</span>
                    <span className="text-lg sm:text-xl font-serif text-brand-900">{formatPrice(selectedTier.price)}</span>
                  </div>
                  <div className="pt-4 sm:pt-6 border-t border-brand-50 space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3 text-xs sm:text-sm text-brand-600">
                      <CheckCircle2 size={16} className="text-brand-accent mt-0.5 shrink-0" />
                      <span>Complimentary Consultation</span>
                    </div>
                    <div className="flex items-start gap-3 text-xs sm:text-sm text-brand-600">
                      <CheckCircle2 size={16} className="text-brand-accent mt-0.5 shrink-0" />
                      <span>Customized Itinerary Planning</span>
                    </div>
                    <div className="flex items-start gap-3 text-xs sm:text-sm text-brand-600">
                      <CheckCircle2 size={16} className="text-brand-accent mt-0.5 shrink-0" />
                      <span>24/7 Travel Assistance</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-brand-900 text-white rounded-[32px] p-8 sm:p-12 space-y-8 sm:space-y-10">
                <Heart className="text-brand-accent fill-brand-accent sm:w-12 sm:h-12" size="40" />
                <h3 className="text-2xl sm:text-3xl font-serif leading-tight">Expertly Crafted <br /> Romantic Journeys</h3>
                <p className="text-brand-300 leading-relaxed text-sm sm:text-base">
                  Our specialists have traveled to every destination we recommend. We know the best suites, the most private beaches, and the hidden spots that make a trip truly romantic.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center text-brand-accent">
                      <Star size={18} className="sm:w-5 sm:h-5" fill="currentColor" />
                    </div>
                    <div>
                      <p className="font-serif text-base sm:text-lg">98% Satisfaction</p>
                      <p className="text-[10px] text-brand-400 uppercase tracking-widest font-bold">Couples rated 5-stars</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8 bg-brand-accent/5 rounded-[32px] border border-brand-accent/10">
              <h4 className="font-serif text-lg sm:text-xl text-brand-900 mb-3 sm:mb-4">Need help choosing?</h4>
              <p className="text-brand-600 text-xs sm:text-sm mb-6 leading-relaxed">
                If you're not sure which package is right for you, book a free consultation call and we'll help you decide.
              </p>
              <button className="text-brand-accent font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                Book a call <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Booking = () => {
  const location = useLocation();
  const { packages, addLead, isLoading } = useData();
  const { formatPrice } = useCurrency();

  const initialData = useMemo(() => {
    const pkgId = location.state?.packageId || '';
    const pkg = packages.find(p => p.id === pkgId);
    
    return {
      packageId: pkgId,
      tierId: location.state?.tierId || pkg?.tiers[0]?.id || '',
      departureDate: location.state?.departureDate || '',
      adults: 2,
      children: 0,
      travelerName: '',
      email: '',
      phone: '',
      countryOfResidence: '',
      occasion: 'honeymoon' as Lead['occasion'],
      message: ''
    };
  }, [packages, location.state]);

  if (isLoading || packages.length === 0) {
    return (
      <div className="min-h-screen bg-brand-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-brand-accent mx-auto" size={48} />
          <p className="text-brand-500 font-medium italic">Preparing your romantic journey...</p>
        </div>
      </div>
    );
  }

  // Use a key to reset the form when initial data changes significantly (like a new package selected from another page)
  return (
    <BookingForm 
      key={initialData.packageId}
      initialData={initialData} 
      packages={packages} 
      addLead={addLead} 
      formatPrice={formatPrice} 
    />
  );
};

export default Booking;
