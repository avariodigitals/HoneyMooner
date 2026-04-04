import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const FAQs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqCategories = [
    {
      title: 'Booking & Planning',
      questions: [
        {
          q: 'How far in advance should I book my honeymoon?',
          a: 'We recommend booking at least 6 to 9 months in advance, especially for popular destinations like the Maldives or during peak travel seasons. This ensures the best availability and pricing for luxury resorts.'
        },
        {
          q: 'Do you offer custom honeymoon planning?',
          a: 'Absolutely! While we have curated packages, our travel experts specialize in tailormade experiences. Contact us to build a bespoke itinerary from scratch.'
        },
        {
          q: 'What is the difference between your pricing tiers?',
          a: 'Our "Premium" tier offers luxury 5-star experiences, "Luxuria" elevates this with superior rooms and private transfers, and "Ultra Luxuria" provides the ultimate pinnacle of exclusivity, including private villas, dedicated concierges, and elite experiences.'
        }
      ]
    },
    {
      title: 'Payments & Policies',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept major credit cards, bank transfers, and PayPal. For larger bookings, we offer flexible payment plans with an initial deposit to secure your dates.'
        },
        {
          q: 'What is your cancellation policy?',
          a: 'Cancellation policies vary by destination and resort. Generally, deposits are non-refundable, but we offer flexibility for rescheduling. We highly recommend purchasing travel insurance at the time of booking.'
        }
      ]
    },
    {
      title: 'On the Trip',
      questions: [
        {
          q: 'Do you provide 24/7 support during our trip?',
          a: 'Yes, all our couples have access to a dedicated 24/7 concierge service and local on-ground contacts to ensure every moment of your honeymoon is stress-free.'
        },
        {
          q: 'Can you help with visa applications?',
          a: 'We provide comprehensive visa guidance and documentation support for all destinations. However, the final approval rests with the respective embassies.'
        }
      ]
    }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="pt-24 min-h-screen bg-brand-50">
      <Breadcrumbs />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/placeholder-travel.svg" 
            alt="FAQs The Honeymoonner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-[1px]" />
          
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <img 
              src="https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Wordmark%20Logo%20No%20BG%20-%20White%20Only.png?updatedAt=1773691277015" 
              alt=""
              className="w-full max-w-[140rem] h-auto object-contain"
            />
          </div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="script-font mb-4 block"
          >
            Common Curiosities
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-2xl"
          >
            Your Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-50 max-w-2xl mx-auto text-lg leading-relaxed font-medium"
          >
            Everything you need to know about planning your dream romantic escape with us.
          </motion.p>
        </div>
      </section>

      <section className="section-container pb-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-brand-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all shadow-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-12">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category, catIdx) => (
              <div key={catIdx}>
                <h2 className="text-2xl font-serif text-brand-900 mb-6 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-brand-accent" />
                  {category.title}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIdx) => {
                    const globalIdx = catIdx * 100 + faqIdx;
                    const isOpen = activeIndex === globalIdx;
                    
                    return (
                      <div key={faqIdx} className="bg-white rounded-xl border border-brand-100 overflow-hidden shadow-sm">
                        <button 
                          onClick={() => setActiveIndex(isOpen ? null : globalIdx)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-brand-50/50 transition-colors"
                        >
                          <span className="font-medium text-brand-900 pr-4">{faq.q}</span>
                          <ChevronDown className={`w-5 h-5 text-brand-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="px-6 pb-6 text-brand-700 leading-relaxed border-t border-brand-50 pt-4">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-brand-600 italic">No results found for "{searchTerm}". Please try a different search term or contact us.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FAQs;
