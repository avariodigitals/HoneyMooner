import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Gift, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/layout/SEO';
import PayPalButton from '../components/ui/PayPalButton';
import PaystackButton from '../components/ui/PaystackButton';
import { useState } from 'react';
import { useCurrency } from '../hooks/useCurrency';
import { useData } from '../hooks/useData';
import { ASSETS } from '../config/images';
import { useGiftCardProducts } from '../hooks/useGiftCardProducts';

const GiftCardCheckout = () => {

    // Gift card recipient/sender fields
    const [recipientName, setRecipientName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [senderName, setSenderName] = useState('');
    const [giftMessage, setGiftMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { homeContent } = useData();
  const { formatPrice } = useCurrency();
  const { giftPackages, isLoadingGiftPackages } = useGiftCardProducts();

  const honeymoonPackages = useMemo(
    () => giftPackages.filter((pkg) => pkg.tiers.length > 0),
    [giftPackages]
  );

  const selectedPackage = useMemo(() => {
    const packageId = typeof location.state?.packageId === 'string' ? location.state.packageId : '';
    return honeymoonPackages.find((pkg) => pkg.id === packageId) || honeymoonPackages[0];
  }, [honeymoonPackages, location.state]);

  const selectedTier = useMemo(() => {
    const tierId = typeof location.state?.tierId === 'string' ? location.state.tierId : '';
    return selectedPackage?.tiers.find((tier) => tier.id === tierId) || selectedPackage?.tiers[0];
  }, [selectedPackage, location.state]);

  const prefilledPackage = useMemo(() => {
    const packageId = typeof location.state?.packageId === 'string' ? location.state.packageId : 'gift-card-prefill';
    const title = typeof location.state?.packageTitle === 'string' && location.state.packageTitle.trim().length > 0
      ? location.state.packageTitle
      : 'Honeymoon Gift Card';
    const featuredImage = typeof location.state?.packageImage === 'string' ? location.state.packageImage : '';

    return {
      id: packageId,
      title,
      featuredImage,
      tiers: []
    };
  }, [location.state]);

  const prefilledTier = useMemo(() => {
    const tierId = typeof location.state?.tierId === 'string' ? location.state.tierId : 'gift-card-tier-prefill';
    const tierName = typeof location.state?.tierName === 'string' && location.state.tierName.trim().length > 0
      ? location.state.tierName
      : (typeof location.state?.giftTierLabel === 'string' ? location.state.giftTierLabel : 'Gift Tier');
    const tierPrice = typeof location.state?.tierPrice === 'number'
      ? location.state.tierPrice
      : (typeof location.state?.giftAmount === 'number' ? location.state.giftAmount : 0);

    return {
      id: tierId,
      name: tierName,
      price: tierPrice,
      productId: typeof location.state?.productId === 'number' ? location.state.productId : 0,
      paymentPackageId: typeof location.state?.paymentPackageId === 'string' ? location.state.paymentPackageId : undefined,
      paymentTierId: typeof location.state?.paymentTierId === 'string' ? location.state.paymentTierId : undefined,
    };
  }, [location.state]);

  const effectivePackage = selectedPackage || prefilledPackage;
  const effectiveTier = selectedTier || prefilledTier;

  const customId = effectivePackage && effectiveTier
    ? `gift-card:${effectiveTier.productId || effectivePackage.id}:${effectiveTier.id}`
    : 'gift-card:template';

  const paymentPackageId = typeof location.state?.paymentPackageId === 'string'
    ? location.state.paymentPackageId
    : effectiveTier?.paymentPackageId;
  const paymentTierId = typeof location.state?.paymentTierId === 'string'
    ? location.state.paymentTierId
    : effectiveTier?.paymentTierId;
  const payerEmail = recipientEmail.trim();
  const canStartPayment = Boolean(paymentPackageId && paymentTierId);

  if (isLoadingGiftPackages && !selectedPackage && !selectedTier) {
    return (
      <div className="pt-24 min-h-screen bg-brand-50/40 section-container">
        <Breadcrumbs />
        <div className="bg-white rounded-3xl border border-brand-100 p-8 sm:p-12 text-center shadow-sm">
          <div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-600 text-sm sm:text-base">Preparing your gift checkout details...</p>
        </div>
      </div>
    );
  }

  if (!effectivePackage || !effectiveTier) {
    return (
      <div className="pt-24 min-h-screen bg-brand-50/40 section-container">
        <Breadcrumbs />
        <div className="bg-white rounded-3xl border border-brand-100 p-8 sm:p-12 text-center shadow-sm">
          <h1 className="text-3xl sm:text-4xl font-serif text-brand-900 mb-4">Gift Selection Required</h1>
          <p className="text-brand-600 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Please select a honeymoon package and tier before proceeding to payment.
          </p>
          <Link to="/gift-cards" className="btn-primary px-10 py-4 inline-flex items-center gap-3">
            Return to Gift Cards <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="pt-24 min-h-screen bg-brand-50/40"
    >
      <SEO
        title="Gift Card Checkout"
        description="Complete your honeymoon gift card purchase with secure payment options."
        image={effectivePackage.featuredImage || homeContent.giftPackage.image || ASSETS.ROMANTIC_MOMENT_HOME}
      />

      <Breadcrumbs />

      <section className="section-container">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-brand-500 hover:text-brand-accent transition-colors text-xs uppercase tracking-widest font-bold"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="bg-white rounded-3xl sm:rounded-[40px] border border-brand-100 shadow-sm overflow-hidden">
            <div className="relative h-56 sm:h-72">
              <img
                src={effectivePackage.featuredImage || homeContent.giftPackage.image || ASSETS.ROMANTIC_MOMENT_HOME}
                alt={effectivePackage.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-brand-900/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-accent-light mb-2">Gift Card Purchase</p>
                <h1 className="text-2xl sm:text-3xl font-serif leading-tight">{effectivePackage.title}</h1>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10 space-y-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-500">Experience Tier</span>
                <span className="font-bold text-brand-accent uppercase tracking-widest text-xs">{effectiveTier.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-500">Gift Value</span>
                <span className="text-xl sm:text-2xl font-serif text-brand-900">{formatPrice(effectiveTier.price)}</span>
              </div>
              <div className="rounded-2xl bg-brand-50/70 border border-brand-100 px-5 py-4 space-y-3">
                <div className="flex items-start gap-3 text-sm text-brand-700">
                  <Gift size={16} className="mt-0.5 text-brand-accent shrink-0" />
                  <span>Your gift card selection is synced and ready for immediate checkout.</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-brand-700">
                  <ShieldCheck size={16} className="mt-0.5 text-brand-accent shrink-0" />
                  <span>Secure checkout stays on this site and uses the published payment mapping for this exact gift product.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl sm:rounded-[40px] border border-brand-100 shadow-sm p-6 sm:p-8 lg:p-10 space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-accent mb-3">Pay Securely</p>
              <h2 className="text-2xl sm:text-3xl font-serif text-brand-900 mb-3">Complete Gift Card Payment</h2>
              <p className="text-brand-600 text-sm sm:text-base leading-relaxed">
                Pay now to lock in this gift card. After successful payment, our team will guide redemption and gifting delivery.
              </p>
            </div>


            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-brand-700">Recipient Name</label>
                  <input
                    type="text"
                    className="input"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    placeholder="Who is receiving the gift?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-brand-700">Recipient Email</label>
                  <input
                    type="email"
                    className="input"
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                    placeholder="Recipient's email address"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-brand-700">Your Name</label>
                  <input
                    type="text"
                    className="input"
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    placeholder="Your name (sender)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-brand-700">Gift Message (optional)</label>
                  <input
                    type="text"
                    className="input"
                    value={giftMessage}
                    onChange={e => setGiftMessage(e.target.value)}
                    placeholder="Add a personal note (optional)"
                  />
                </div>
              </div>


              <PayPalButton
                packageId={paymentPackageId || 'gift-template-package'}
                tierId={paymentTierId || 'gift-template-tier'}
                description={`Gift Card - ${effectivePackage.title} (${effectiveTier.name})`}
                customId={`${customId}:paypal`}
                disabled={!canStartPayment}
                onSuccess={(details) => console.log('Gift card PayPal payment success', details)}
              />

              <PaystackButton
                packageId={paymentPackageId || 'gift-template-package'}
                tierId={paymentTierId || 'gift-template-tier'}
                email={payerEmail}
                description={`Gift Card - ${effectivePackage.title} (${effectiveTier.name})`}
                customId={`${customId}:paystack`}
                disabled={!canStartPayment}
                onSuccess={(details) => console.log('Gift card Paystack payment success', details)}
              />

              {!canStartPayment && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  Payment mapping is not published yet for this gift product. Publish `payment_package_id` and `payment_tier_id` from the WordPress gift endpoint to enable instant checkout.
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-brand-100 text-center">
              <p className="text-xs text-brand-500">
                Need help before payment?{' '}
                <Link to="/contact" className="text-brand-accent font-semibold hover:underline">
                  Contact Concierge
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default GiftCardCheckout;
