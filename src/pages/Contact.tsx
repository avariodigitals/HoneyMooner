import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, AlertCircle } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { dataService } from '../services/dataService';
import SEO from '../components/layout/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Email validation regex
  const validateEmail = (email: string): boolean => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      errors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await dataService.createContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      if (success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setValidationErrors({});
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Contact form error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'info@thehoneymoonner.com', href: 'mailto:info@thehoneymoonner.com' },
    { icon: <Phone className="w-5 h-5" />, label: 'Phone (UK)', value: '+447341899849', href: 'tel:+447341899849' },
    { icon: <Phone className="w-5 h-5" />, label: 'Phone (Nigeria)', value: '+2358131760694', href: 'tel:+2358131760694' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Office', value: 'UNIT 1, 137 Cheetham Hill Rd, Cheetham Hill, Manchester M8 8LY' },
  ];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "The Honeymooner Travel",
    "url": "https://thehoneymoonertravel.com",
    "logo": "https://ik.imagekit.io/lrnty9ku6/HoneyMooner/Full%20Logo%20No%20BG%20-%20Sec%20Color.png",
    "description": "Curated luxury honeymoon packages and romantic escapes. Discover the world's most intimate destinations with The Honeymooner Travel.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "UNIT 1, 137 Cheetham Hill Rd",
      "addressLocality": "Cheetham Hill, Manchester",
      "postalCode": "M8 8LY",
      "addressCountry": "GB"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+447341899849",
        "contactType": "customer service",
        "availableLanguage": "English",
        "description": "UK Office"
      },
      {
        "@type": "ContactPoint",
        "telephone": "+2358131760694",
        "contactType": "customer service",
        "availableLanguage": "English",
        "description": "Nigeria Office"
      }
    ],
    "sameAs": [
      "https://thehoneymoonertravel.com"
    ]
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-50">
      <SEO
        title="Contact Us"
        description="Speak with The Honeymooner Travel travel experts and start planning a personalized honeymoon, anniversary, or romantic getaway."
        canonical="https://thehoneymoonertravel.com/contact"
        keywords="honeymoon travel consultation, contact honeymoon planner, romantic getaway experts"
        schema={organizationSchema}
      />
      <Breadcrumbs />

      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden mb-14 sm:mb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/natalya-zaritskaya-SIOdjcYotms-unsplash-scaled.jpg" 
            alt="Contact The Honeymooner Travel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-[1px]" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="script-font mb-4 block"
          >
            Get in Touch
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-2xl"
          >
            Plan Your Escape
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-50 max-w-2xl mx-auto text-lg leading-relaxed font-medium"
          >
            Whether you have a specific destination in mind or need inspiration, our travel experts are here to help you every step of the way.
          </motion.p>
        </div>
      </section>

      <section className="section-container pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100">
              <h3 className="text-xl font-serif mb-6 text-brand-900">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-3 bg-brand-50 rounded-lg text-brand-accent">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-sm text-brand-600 font-medium uppercase tracking-wider">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-brand-900 hover:text-brand-accent transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-brand-900">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-900 text-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-serif mb-4">Follow Our Journey</h3>
              <p className="text-brand-100 mb-6">Join our community of romantic travelers for daily inspiration.</p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                  <a key={idx} href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-brand-100">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-serif text-brand-900 mb-4">Message Sent!</h3>
                  <p className="text-brand-700">Thank you for reaching out. One of our travel experts will contact you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-brand-900 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        className={`w-full px-4 py-3 rounded-xl border focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all ${
                          validationErrors.name ? 'border-red-500 bg-red-50' : 'border-brand-200'
                        }`}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (validationErrors.name) {
                            setValidationErrors({ ...validationErrors, name: '' });
                          }
                        }}
                        disabled={isLoading}
                      />
                      {validationErrors.name && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-900 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        className={`w-full px-4 py-3 rounded-xl border focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all ${
                          validationErrors.email ? 'border-red-500 bg-red-50' : 'border-brand-200'
                        }`}
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (validationErrors.email) {
                            setValidationErrors({ ...validationErrors, email: '' });
                          }
                        }}
                        disabled={isLoading}
                      />
                      {validationErrors.email && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">Subject</label>
                    <input 
                      type="text" 
                      required
                      className={`w-full px-4 py-3 rounded-xl border focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all ${
                        validationErrors.subject ? 'border-red-500 bg-red-50' : 'border-brand-200'
                      }`}
                      placeholder="Planning my honeymoon"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (validationErrors.subject) {
                          setValidationErrors({ ...validationErrors, subject: '' });
                        }
                      }}
                      disabled={isLoading}
                    />
                    {validationErrors.subject && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.subject}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">Message</label>
                    <textarea 
                      required
                      rows={6}
                      className={`w-full px-4 py-3 rounded-xl border focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all resize-none ${
                        validationErrors.message ? 'border-red-500 bg-red-50' : 'border-brand-200'
                      }`}
                      placeholder="Tell us about your dream trip..."
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (validationErrors.message) {
                          setValidationErrors({ ...validationErrors, message: '' });
                        }
                      }}
                      disabled={isLoading}
                    ></textarea>
                    {validationErrors.message && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.message}</p>
                    )}
                  </div>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full btn-primary py-4 text-lg disabled:opacity-75 disabled:cursor-not-allowed transition-opacity"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
