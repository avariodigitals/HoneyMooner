import { useEffect, useMemo, useState, type ElementType } from 'react';
import { useConsultation } from '../hooks/useConsultation';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  Globe,
  Heart,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Star,
  User,
  Wallet,
} from 'lucide-react';

import SEO from '../components/layout/SEO';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { useCurrency } from '../hooks/useCurrency';
import { useData } from '../hooks/useData';
import type { Lead } from '../types';

const consultationCopy = {
  eyebrow: 'Private Consultation',
  title: 'Plan Your Honeymoon Consultation',
  description:
    'Share your travel vision, ideal dates, and preferred experience level. We will use these details to shape a focused consultation around the kind of honeymoon you want.',
  loading: 'Preparing your consultation experience...',
  readyTitle: 'Consultation Details Reviewed',
  readyMessage:
    'Your consultation details look good. The next step will be confirmation and secure checkout once final payment routing is enabled.',
};

export default function Consultation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { packages: allPackages, isLoading } = useData();
  const { formatPrice } = useCurrency();
  const [allowFallbackRender, setAllowFallbackRender] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState('');
  const [formData, setFormData] = useState({
    packageId: '',
    tierId: '',
    intendedTravelDate: '',
    preferredDate: '',
    timeSlot: '',
    commPreference: 'WhatsApp Call',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    alternateDate: '',
    adults: 2,
    children: 0,
    travelerName: '',
    email: '',
    phone: '',
    countryOfResidence: '',
    occasion: 'honeymoon' as Lead['occasion'],
    message: '',
    accessToken: '',
    paymentProvider: '',
    paymentReference: '',
    paymentAmount: 0,
    paymentCurrency: '',
  });

  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);

  // Consultation API integration
  const {
    loading: consultationLoading,
    error: consultationError,
    success: consultationSuccess,
    settings: consultationSettings,
    quote: consultationQuote,
    fetchSettings,
    fetchQuote,
    fetchSlots,
    generatePaymentAccess,
    submitConsultation,
    setError: setConsultationError,
    setSuccess: setConsultationSuccess
  } = useConsultation();

  // Fetch slots when date changes
  useEffect(() => {
    if (formData.preferredDate) {
      fetchSlots(formData.preferredDate).then(result => {
        if (result?.success) {
          setAvailableSlots(result.slots);
          setFormData(prev => ({ ...prev, timeSlot: '' })); // Reset slot when date changes
        }
      });
    }
  }, [formData.preferredDate, fetchSlots]);

  // Update description from settings
  const dynamicDescription = consultationSettings?.page_description || consultationCopy.description;
  const dynamicTitle = consultationSettings?.page_title || consultationCopy.title;

  // Example: fetch consultation settings/fee on mount (optional, can be used to show info)
  useEffect(() => {
    fetchSettings();
    fetchQuote();
  }, [fetchSettings, fetchQuote]);

  const packages = useMemo(() => allPackages.filter((pkg) => pkg.category === 'honeymoon'), [allPackages]);
  const selectedPkg = useMemo(() => packages.find((pkg) => pkg.id === formData.packageId), [packages, formData.packageId]);
  const selectedTier = useMemo(
    () => selectedPkg?.tiers.find((tier) => tier.id === formData.tierId) || selectedPkg?.tiers[0],
    [selectedPkg, formData.tierId]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setAllowFallbackRender(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (packages.length === 0) return;

    const packageId = typeof location.state?.packageId === 'string' ? location.state.packageId : '';
    const tierId = typeof location.state?.tierId === 'string' ? location.state.tierId : '';
    const departureDate = typeof location.state?.departureDate === 'string' ? location.state.departureDate : '';
    const fallbackPackage = packages[0];
    const nextPackage = packages.find((pkg) => pkg.id === packageId) || fallbackPackage;

    setFormData((current) => ({
      ...current,
      packageId: packageId || nextPackage?.id || '',
      tierId: tierId || nextPackage?.tiers[0]?.id || '',
      preferredDate: departureDate || current.preferredDate,
    }));
  }, [packages, location.state]);

  if (isLoading && packages.length === 0 && !allowFallbackRender) {
    return (
      <div className="min-h-screen bg-brand-50/50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-brand-accent mx-auto" size={48} />
          <p className="text-brand-500 font-medium italic">{consultationCopy.loading}</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="pt-24 pb-24 min-h-screen section-container text-center">
        <Breadcrumbs />
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto space-y-8">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-serif text-brand-900">{consultationSuccess || consultationCopy.readyTitle}</h1>
          <p className="text-brand-600 text-lg leading-relaxed">{consultationCopy.readyMessage}</p>
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setIsSubmitted(false)} className="btn-outline px-10 py-4 w-full sm:w-auto">Back to Consultation</button>
            <button onClick={() => navigate('/booking')} className="btn-primary px-10 py-4 w-full sm:w-auto">View Booking Page</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Consultation"
        description="Book a private honeymoon consultation with your preferred dates, travel priorities, and a polished request flow designed for couples planning their next chapter."
        keywords="honeymoon consultation, travel consultation, luxury honeymoon planning, consultation payment"
      />
      <div className="pt-24 pb-24 min-h-screen bg-brand-50/50">
        <Breadcrumbs />
        <section className="section-container">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-brand-400 hover:text-brand-accent transition-colors mb-8 sm:mb-12 uppercase tracking-widest text-xs font-bold">
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] gap-8 lg:gap-12 xl:gap-20">
            <div className="space-y-8 sm:space-y-10 lg:space-y-12">
              <div>
                <p className="script-font mb-4">{consultationCopy.eyebrow}</p>
                <h1 className="text-3xl md:text-5xl font-serif text-brand-900 mb-5 sm:mb-6">{dynamicTitle}</h1>
                <p className="text-brand-600 leading-relaxed text-base sm:text-lg max-w-2xl">{dynamicDescription}</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <ExpectCard title="Tailored Guidance" text="We shape the consultation around your destination style, timing, and comfort level." />
                  <ExpectCard title="Clear Next Step" text={consultationQuote?.payment_enabled ? "Continue with secure payment at confirmation to finalize your consultation request." : "Confirm your details to submit your consultation request for review."} />
                </div>
              </div>

              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  setConsultationError(null);
                  setConsultationSuccess(null);
                  
                  let accessToken = formData.accessToken;

                  // Payment access (if no coupon and payment info provided)
                  if (!accessToken && formData.paymentProvider && formData.paymentReference) {
                    const paymentResult = await generatePaymentAccess({
                      payment_provider: formData.paymentProvider,
                      payment_reference: formData.paymentReference,
                      payment_amount: formData.paymentAmount,
                      payment_currency: formData.paymentCurrency,
                    });
                    if (paymentResult?.success && paymentResult?.access_token) {
                      accessToken = paymentResult.access_token;
                      setFormData((current) => ({ ...current, accessToken }));
                    } else {
                      setConsultationError(paymentResult?.message || 'Payment verification failed.');
                      return;
                    }
                  }
                  // Submit consultation request
                  if (accessToken || !consultationQuote?.payment_enabled) {
                    const submitResult = await submitConsultation({
                      access_token: accessToken,
                      traveler_name: formData.travelerName,
                      email: formData.email,
                      phone: formData.phone,
                      intended_travel_date: formData.intendedTravelDate,
                      preferred_date: formData.preferredDate,
                      time_slot: formData.timeSlot,
                      comm_preference: formData.commPreference,
                      timezone: formData.timezone,
                      alternate_date: formData.alternateDate,
                      package_name: selectedPkg?.title,
                      package_id: selectedPkg?.id,
                      package_tier: selectedTier?.name,
                      adults: formData.adults,
                      children: formData.children,
                      country_of_residence: formData.countryOfResidence,
                      occasion: formData.occasion,
                      message: formData.message,
                      source_url: window.location.href,
                    });
                    if (submitResult?.success) {
                      setIsSubmitted(true);
                      setConsultationSuccess(submitResult.message || 'Consultation request submitted successfully.');
                    } else {
                      setConsultationError(submitResult?.message || 'Failed to submit consultation request.');
                    }
                  } else {
                    setConsultationError('A valid consultation code or payment is required.');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="space-y-6 sm:space-y-8 bg-white rounded-[28px] sm:rounded-[36px] border border-brand-100 shadow-sm p-5 sm:p-8 lg:p-10"
              >
                                {consultationError && (
                                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-2">
                                    {consultationError}
                                  </div>
                                )}
                                {consultationLoading && (
                                  <div className="bg-brand-50 border border-brand-100 text-brand-700 rounded-xl px-4 py-3 text-sm mb-2">
                                    Processing your request...
                                  </div>
                                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-3 sm:space-y-4">
                    <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Desired Package</label>
                    <select
                      required
                      value={formData.packageId}
                      onChange={(event) => {
                        const nextPackage = packages.find((pkg) => pkg.id === event.target.value);
                        setFormData((current) => ({ ...current, packageId: event.target.value, tierId: nextPackage?.tiers[0]?.id || '' }));
                      }}
                      className="w-full bg-white border border-brand-100 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-4 sm:px-6 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base"
                    >
                      <option value="">Choose a package direction...</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>{pkg.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Package Tier</label>
                    <select
                      required
                      value={formData.tierId}
                      onChange={(event) => setFormData((current) => ({ ...current, tierId: event.target.value }))}
                      className="w-full bg-white border border-brand-100 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-4 sm:px-6 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base"
                    >
                      <option value="">Choose an experience level...</option>
                      {(selectedPkg?.tiers || []).map((tier) => (
                        <option key={tier.id} value={tier.id}>{tier.name} - {formatPrice(tier.price)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Occasion</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {(['honeymoon', 'anniversary', 'proposal', 'other'] as const).map((occasion) => (
                      <button
                        key={occasion}
                        type="button"
                        onClick={() => setFormData((current) => ({ ...current, occasion }))}
                        className={`min-h-[48px] py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium border transition-all ${formData.occasion === occasion ? 'bg-brand-accent text-white border-brand-accent shadow-md' : 'bg-white text-brand-600 border-brand-100 hover:border-brand-accent'}`}
                      >
                        {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <Field icon={User} label="Full Name" type="text" value={formData.travelerName} placeholder="Enter your name" onChange={(value) => setFormData((current) => ({ ...current, travelerName: value }))} required />
                  <Field icon={Mail} label="Email Address" type="email" value={formData.email} placeholder="Email for your consultation notes" onChange={(value) => setFormData((current) => ({ ...current, email: value }))} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <Field icon={Phone} label="WhatsApp / Phone" type="tel" value={formData.phone} placeholder="+234..." onChange={(value) => setFormData((current) => ({ ...current, phone: value }))} required />
                  <div className="space-y-3 sm:space-y-4">
                    <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Intended Travel Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200" size={18} />
                      <input 
                        required 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.intendedTravelDate} 
                        onChange={(event) => setFormData((current) => ({ ...current, intendedTravelDate: event.target.value }))} 
                        className="w-full pl-12 pr-4 sm:pr-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-3 sm:space-y-4">
                    <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Preferred Consultation Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200" size={18} />
                      <input 
                        required 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.preferredDate} 
                        onChange={(event) => setFormData((current) => ({ ...current, preferredDate: event.target.value }))} 
                        className="w-full pl-12 pr-4 sm:pr-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Available Time Slots</label>
                    <div className="relative">
                      <Loader2 className={`absolute left-4 top-1/2 -translate-y-1/2 text-brand-200 ${consultationLoading ? 'animate-spin' : 'hidden'}`} size={18} />
                      <select
                        required
                        disabled={!formData.preferredDate || consultationLoading}
                        value={formData.timeSlot}
                        onChange={(event) => setFormData((current) => ({ ...current, timeSlot: event.target.value }))}
                        className="w-full pl-12 pr-4 sm:pr-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base bg-white appearance-none"
                      >
                        <option value="">{formData.preferredDate ? 'Select a time slot' : 'Choose a date first'}</option>
                        {availableSlots.map((slot) => (
                          <option key={slot.time} value={slot.time} disabled={!slot.available}>
                            {slot.time} {!slot.available ? '(Busy)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-3 sm:space-y-4">
                    <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Communication Preference</label>
                    <select
                      value={formData.commPreference}
                      onChange={(event) => setFormData((current) => ({ ...current, commPreference: event.target.value }))}
                      className="w-full px-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base bg-white"
                    >
                      <option value="WhatsApp Call">WhatsApp Call</option>
                      <option value="Zoom Call">Zoom Call</option>
                      <option value="Phone Call">Phone Call</option>
                    </select>
                  </div>
                  <Field icon={Globe} label="Timezone" type="text" value={formData.timezone} placeholder="Your timezone" onChange={(value) => setFormData((current) => ({ ...current, timezone: value }))} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <Field icon={Globe} label="Country of Residence" type="text" value={formData.countryOfResidence} placeholder="e.g. Nigeria" onChange={(value) => setFormData((current) => ({ ...current, countryOfResidence: value }))} required />
                </div>

                {/* Travellers section removed as requested */}

                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">Trip Vision & Notes</label>
                  <p className="text-brand-500 text-sm leading-relaxed">Share the mood, destination ideas, budget range, and any must-have moments you want us to keep in mind.</p>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-6 text-brand-200" size={18} />
                    <textarea rows={5} value={formData.message} onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))} placeholder="Tell us the kind of trip you want, your must-haves, and anything we should know before the consultation." className="w-full pl-12 pr-4 sm:pr-6 py-4 sm:py-6 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base resize-none" />
                  </div>
                </div>

                {consultationQuote?.payment_enabled && (
                  <div className="bg-brand-accent/5 rounded-[24px] border border-brand-accent/10 p-5 sm:p-7 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0"><Wallet size={22} /></div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-serif text-brand-900 mb-2">Consultation Access</h3>
                        <p className="text-brand-600 text-sm sm:text-base leading-relaxed">At confirmation, you will continue with your preferred secure payment option to complete the request.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ActionCard icon={CreditCard} title="Pay with Paystack" description="Fast card checkout for clients who want to complete payment in one step." onClick={() => setCheckoutNotice('Paystack will be available at confirmation.')} />
                      <ActionCard icon={Wallet} title="Pay with PayPal" description="A convenient wallet option for clients who prefer PayPal." onClick={() => setCheckoutNotice('PayPal will be available at confirmation.')} />
                    </div>

                    <div className="rounded-2xl border border-brand-accent/15 bg-white px-4 py-4 text-sm text-brand-700">
                      <p className="font-semibold text-brand-900 mb-1">Before you confirm</p>
                      <p>Please review your dates, traveller details, and preferred payment path carefully so your consultation can be processed smoothly.</p>
                    </div>

                    {checkoutNotice ? <p className="text-brand-600 text-xs sm:text-sm italic">{checkoutNotice}</p> : null}
                  </div>
                )}

                <button type="submit" className="btn-primary w-full py-4 sm:py-5 flex items-center justify-center gap-3 text-base sm:text-lg shadow-xl shadow-brand-accent/20 min-h-[56px]">
                  Continue to Confirmation
                  <ArrowRight size={20} />
                </button>
              </form>
            </div>

            <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:sticky xl:top-32 h-fit">
              {selectedPkg && selectedTier ? (
                <div className="bg-white rounded-[32px] overflow-hidden border border-brand-100 shadow-xl">
                  <div className="h-52 sm:h-64 relative">
                    <img src={selectedPkg.featuredImage} alt={selectedPkg.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-900/65 to-transparent" />
                    <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 text-white">
                      <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-1">Consultation Direction</p>
                      <h3 className="text-xl sm:text-2xl font-serif leading-tight">{selectedPkg.title}</h3>
                    </div>
                  </div>
                  <div className="p-5 sm:p-8 space-y-4 sm:space-y-6">
                    <SummaryRow label="Experience" value={selectedTier.name} accent />
                    <SummaryRow label="Base package from" value={formatPrice(selectedTier.price)} />
                    <SummaryRow label="Date rule" value="Open unless marked closed" />
                    <div className="pt-4 sm:pt-6 border-t border-brand-50 space-y-3 sm:space-y-4">
                      {[
                        'Preferred and alternate dates selected',
                        consultationQuote?.payment_enabled ? 'Choose the payment method that feels most convenient for you' : 'No payment required for this consultation'
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3 text-xs sm:text-sm text-brand-600">
                          <CheckCircle2 size={16} className="text-brand-accent mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-brand-900 text-white rounded-[32px] p-8 sm:p-10 space-y-8">
                  <Heart className="text-brand-accent fill-brand-accent sm:w-12 sm:h-12" size={40} />
                  <h3 className="text-2xl sm:text-3xl font-serif leading-tight">Start with a thoughtful consultation</h3>
                  <p className="text-brand-300 leading-relaxed text-sm sm:text-base">Tell us where you are leaning, what kind of experience you want, and the dates that work best for you. We will use that to prepare a more focused planning conversation.</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center text-brand-accent"><Star size={18} className="sm:w-5 sm:h-5" fill="currentColor" /></div>
                    <div>
                      <p className="font-serif text-base sm:text-lg">Confident planning starts here</p>
                      <p className="text-[10px] text-brand-400 uppercase tracking-widest font-bold">Clear details lead to better recommendations</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-6 sm:p-8 bg-brand-accent/5 rounded-[32px] border border-brand-accent/10">
                <h4 className="font-serif text-lg sm:text-xl text-brand-900 mb-3 sm:mb-4">What to expect</h4>
                <div className="space-y-3 text-brand-600 text-xs sm:text-sm leading-relaxed">
                  <p>1. Choose the package direction and dates that feel closest to your plans.</p>
                  <p>2. Share enough detail for us to understand the mood, pacing, and experience level you want.</p>
                  <p>3. {consultationQuote?.payment_enabled ? "At confirmation, you will be able to complete the consultation with a secure payment." : "Review and confirm your request to send it to our planning team."}</p>
                </div>
                <div className="mt-6 rounded-2xl bg-white border border-brand-100 px-4 py-4 sm:px-5 sm:py-5">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">Helpful Note</p>
                  <p className="text-sm text-brand-600 leading-relaxed">
                    If you already know the exact package you want, you can complete this form with that selection so our team can make the consultation more focused from the start.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function Field({ icon: Icon, label, type, value, placeholder, onChange, required = false, compact = false }: { icon: ElementType; label: string; type: string; value: string; placeholder: string; onChange: (value: string) => void; required?: boolean; compact?: boolean; }) {
  return (
    <div className={`space-y-3 sm:space-y-4 ${compact ? 'mb-0' : ''}`}>
      <label className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200" size={18} />
        <input required={required} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full pl-12 pr-4 sm:pr-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-brand-100 focus:ring-2 focus:ring-brand-accent/20 text-sm sm:text-base min-h-[52px]" />
      </div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, description, onClick }: { icon: ElementType; title: string; description: string; onClick: () => void; }) {
  return (
    <button type="button" onClick={onClick} className="w-full rounded-2xl border border-brand-100 bg-white px-5 py-4 sm:px-6 sm:py-5 text-left hover:border-brand-accent/40 transition-colors min-h-[116px]">
      <span className="flex items-center gap-3 text-brand-900 font-semibold text-sm sm:text-base"><Icon size={18} className="text-brand-accent" />{title}</span>
      <span className="block mt-2 text-brand-500 text-xs sm:text-sm leading-relaxed">{description}</span>
    </button>
  );
}

function SummaryRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean; }) {
  return (
    <div className="flex justify-between items-center text-xs sm:text-sm gap-4">
      <span className="text-brand-400">{label}</span>
      <span className={accent ? 'font-bold text-brand-accent uppercase tracking-widest text-right' : 'font-medium text-brand-900 text-right'}>{value}</span>
    </div>
  );
}

function ExpectCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white/80 px-4 py-4 sm:px-5 sm:py-5">
      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">What You Get</p>
      <h3 className="font-serif text-lg text-brand-900 mb-2 leading-tight">{title}</h3>
      <p className="text-sm text-brand-600 leading-relaxed">{text}</p>
    </div>
  );
}

