import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Gift, HeartHandshake } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/layout/SEO';
import { useData } from '../hooks/useData';
import { useCurrency } from '../hooks/useCurrency';
import { ASSETS } from '../config/images';
import { useGiftCardProducts } from '../hooks/useGiftCardProducts';

const GiftCards = () => {
  const { homeContent } = useData();
  const { formatPrice } = useCurrency();
  const { giftPackages, isLoadingGiftPackages, giftPackagesError } = useGiftCardProducts();

  const honeymoonPackages = useMemo(() => giftPackages.filter((pkg) => pkg.tiers.length > 0), [giftPackages]);

  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedTierId, setSelectedTierId] = useState<string>('');

  useEffect(() => {
    if (honeymoonPackages.length === 0) return;
    if (!selectedPackageId) {
      const firstPackage = honeymoonPackages[0];
      setSelectedPackageId(firstPackage.id);
      setSelectedTierId(firstPackage.tiers[0]?.id || '');
    }
  }, [honeymoonPackages, selectedPackageId]);

  const selectedPackage = useMemo(
    () => honeymoonPackages.find((pkg) => pkg.id === selectedPackageId) || honeymoonPackages[0],
    [honeymoonPackages, selectedPackageId]
  );

  const selectedTier = useMemo(
    () => selectedPackage?.tiers.find((tier) => tier.id === selectedTierId) || selectedPackage?.tiers[0],
    [selectedPackage, selectedTierId]
  );

  const selectedAmount = selectedTier?.price || 0;

  const handlePackageSelect = (packageId: string) => {
    const pkg = honeymoonPackages.find((item) => item.id === packageId);
    setSelectedPackageId(packageId);
    setSelectedTierId(pkg?.tiers[0]?.id || '');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pt-24 min-h-screen bg-brand-50/40"
    >
      <SEO
        title="Honeymoon Gift Cards"
        description="Gift newlyweds an unforgettable honeymoon with a premium gift card experience curated by The Honeymoonner."
        image={homeContent.giftPackage.image || ASSETS.ROMANTIC_MOMENT_HOME}
      />

      <Breadcrumbs />

      <section className="section-container">
        {isLoadingGiftPackages && (
          <div className="bg-white rounded-3xl border border-brand-100 p-8 sm:p-12 text-center shadow-sm mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-white to-brand-900/5" />
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{
                  y: [0, -8, 0, 6, 0],
                  x: [0, 4, 0, -4, 0],
                  rotate: [0, 4, 0, -4, 0],
                  scale: [1, 1.08, 1, 1.05, 1],
                  opacity: [0.82, 1, 0.9, 1, 0.82]
                }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-full bg-brand-accent/15 text-brand-accent flex items-center justify-center mb-4"
              >
                <Gift size={24} />
              </motion.div>
              <p className="text-brand-700 text-sm sm:text-base font-medium">
                Curating your Gift Card Packages...
              </p>
              <p className="text-brand-500 text-xs sm:text-sm italic mt-2">
                Creating something beautiful for your special moment.
              </p>
            </div>
          </div>
        )}

        {!isLoadingGiftPackages && honeymoonPackages.length === 0 ? (
          <div className="bg-white rounded-3xl border border-brand-100 p-8 sm:p-12 text-center shadow-sm">
            <h1 className="text-3xl sm:text-4xl font-serif text-brand-900 mb-4">Gift Cards Coming Shortly</h1>
            <p className="text-brand-600 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              {giftPackagesError || 'No gift-card products were returned from WordPress yet. Browse our packages and our concierge team can help immediately.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/packages" className="btn-primary px-10 py-4">Explore Packages</Link>
              <Link to="/contact" className="btn-outline px-10 py-4">Contact Concierge</Link>
            </div>
          </div>
        ) : !isLoadingGiftPackages ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-stretch">
            <div className="bg-white rounded-3xl sm:rounded-[42px] border border-brand-100 shadow-sm p-7 sm:p-10 lg:p-12 space-y-8">
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-brand-accent mb-4">
                  {homeContent.giftPackage.eyebrow}
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-900 leading-tight mb-5">
                  Gift a Honeymoon Card
                </h1>
                <p className="text-brand-700 text-base sm:text-lg leading-relaxed">
                  Choose from our existing honeymoon collection, select an experience tier, and send a meaningful gift without stress.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-brand-accent/20 bg-gradient-to-br from-[#fff7ef] via-[#fffdf9] to-[#fdeee1] p-5 sm:p-6 shadow-[0_18px_40px_rgba(130,79,43,0.08)]">
                  <label htmlFor="gift-package-select" className="block text-[10px] sm:text-xs uppercase tracking-[0.24em] font-bold text-brand-500 mb-3">
                    Honeymoon Package
                  </label>
                  <select
                    id="gift-package-select"
                    value={selectedPackage?.id || ''}
                    onChange={(e) => handlePackageSelect(e.target.value)}
                    className="w-full rounded-2xl border border-brand-accent/30 bg-white/90 px-4 py-3.5 text-sm sm:text-base font-medium text-brand-900 focus:border-brand-accent focus:outline-none focus:ring-4 focus:ring-brand-accent/10"
                  >
                    {honeymoonPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.title}
                      </option>
                    ))}
                  </select>

                  {selectedPackage && (
                    <div className="mt-4 rounded-2xl bg-white/90 border border-brand-100 p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-brand-400 mb-2">Selected Package</p>
                      <p className="text-base sm:text-lg font-serif text-brand-900 leading-tight mb-2">{selectedPackage.title}</p>
                      <p className="text-xs text-brand-500">From {formatPrice(Math.min(...selectedPackage.tiers.map((tier) => tier.price)))}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-brand-400">Select Experience Tier</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {(selectedPackage?.tiers || []).map((tier) => {
                    const active = selectedTier?.id === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                          active
                            ? 'border-brand-accent bg-brand-accent/10 shadow-md shadow-brand-accent/10'
                            : 'border-brand-100 bg-brand-50/50 hover:border-brand-accent/40'
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-400 mb-2">{tier.name}</p>
                        <p className="text-lg sm:text-xl font-serif text-brand-900">{formatPrice(tier.price)}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-brand-900 text-white px-5 sm:px-6 py-5 sm:py-6">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-accent-light mb-2">Selected Gift Card</p>
                <p className="text-xl sm:text-2xl font-serif mb-2 line-clamp-2">{selectedPackage?.title}</p>
                <p className="text-2xl sm:text-3xl font-serif mb-2">{formatPrice(selectedAmount)}</p>
                <p className="text-brand-200 text-sm leading-relaxed">
                  {selectedTier?.name} tier credit. Redeemable with our planning team for this honeymoon experience.
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  to="/gift-cards/checkout"
                  state={{
                    giftFlow: true,
                    giftAmount: selectedAmount,
                    giftTierLabel: selectedTier?.name,
                    packageId: selectedPackage?.id,
                    tierId: selectedTier?.id,
                    packageTitle: selectedPackage?.title,
                    packageImage: selectedPackage?.featuredImage,
                    tierName: selectedTier?.name,
                    tierPrice: selectedTier?.price,
                    productId: selectedTier?.productId,
                    paymentPackageId: selectedTier?.paymentPackageId,
                    paymentTierId: selectedTier?.paymentTierId
                  }}
                  className="btn-primary w-full py-4 text-xs sm:text-sm uppercase tracking-widest font-bold inline-flex items-center justify-center gap-3 shadow-xl shadow-brand-accent/20"
                >
                  Purchase Gift Card
                  <ArrowRight size={16} />
                </Link>
                <p className="text-center text-xs text-brand-500">Fast checkout. Personalized delivery support included.</p>
              </div>
            </div>

            <div className="relative rounded-3xl sm:rounded-[42px] overflow-hidden min-h-[420px] sm:min-h-[500px] lg:min-h-[520px] shadow-2xl">
              <img
                src={selectedPackage?.featuredImage || homeContent.giftPackage.image || ASSETS.ROMANTIC_MOMENT_HOME}
                alt={selectedPackage?.title || homeContent.giftPackage.imageAlt}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = homeContent.fallbackImages.general || ASSETS.ROMANTIC_MOMENT_HOME;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/35 to-brand-900/20" />

              <div className="absolute inset-0 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-4 py-2 text-white text-[10px] uppercase tracking-[0.2em] font-bold">
                  <Gift size={14} />
                  Gift Cards
                </div>

                <div className="space-y-5">
                  <p className="text-brand-50 font-serif italic text-lg sm:text-2xl leading-relaxed max-w-[90%]">
                    {homeContent.giftPackage.note}
                  </p>

                  <div className="space-y-3">
                    {[
                      { icon: HeartHandshake, text: 'Choose from real honeymoon packages already available' },
                      { icon: CheckCircle2, text: 'Pick any experience tier and checkout in minutes' },
                      { icon: Gift, text: 'Dedicated specialist support from purchase to booking' }
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-start gap-3 text-white/95 text-sm sm:text-base">
                        <Icon size={16} className="mt-1 shrink-0 text-brand-accent-light" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-brand-accent-light hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em] font-bold"
                  >
                    Need custom gift amount? Contact Concierge <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </motion.div>
  );
};

export default GiftCards;