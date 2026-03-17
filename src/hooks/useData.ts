import { useState, useEffect } from 'react';
import { initialDestinations, initialPackages, initialTestimonials, DATA_VERSION } from '../data/mock';
import type { Destination, TravelPackage, Lead, Testimonial } from '../types';

export const useData = () => {
  // Check for data version and clear stale storage if needed
  useEffect(() => {
    const storedVersion = localStorage.getItem('honeymooner_data_version');
    if (storedVersion !== DATA_VERSION) {
      // Version mismatch - clear specific items to force reload from mock
      localStorage.removeItem('honeymooner_destinations');
      localStorage.removeItem('honeymooner_packages');
      localStorage.removeItem('honeymooner_testimonials');
      localStorage.setItem('honeymooner_data_version', DATA_VERSION);
      
      // Reload the page to ensure state is fresh
      window.location.reload();
    }
  }, []);

  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const stored = localStorage.getItem('honeymooner_destinations');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('honeymooner_destinations', JSON.stringify(initialDestinations));
    return initialDestinations;
  });

  const [packages, setPackages] = useState<TravelPackage[]>(() => {
    const stored = localStorage.getItem('honeymooner_packages');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('honeymooner_packages', JSON.stringify(initialPackages));
    return initialPackages;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const stored = localStorage.getItem('honeymooner_leads');
    return stored ? JSON.parse(stored) : [];
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const stored = localStorage.getItem('honeymooner_testimonials');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('honeymooner_testimonials', JSON.stringify(initialTestimonials));
    return initialTestimonials;
  });

  const [loading] = useState(false);

  const updateDestinations = (newDestinations: Destination[]) => {
    setDestinations(newDestinations);
    localStorage.setItem('honeymooner_destinations', JSON.stringify(newDestinations));
  };

  const updatePackages = (newPackages: TravelPackage[]) => {
    setPackages(newPackages);
    localStorage.setItem('honeymooner_packages', JSON.stringify(newPackages));
  };

  const updateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    localStorage.setItem('honeymooner_testimonials', JSON.stringify(newTestimonials));
  };

  const addLead = (lead: Lead) => {
    const newLeads = [lead, ...leads];
    setLeads(newLeads);
    localStorage.setItem('honeymooner_leads', JSON.stringify(newLeads));
  };

  const updateLeadStatus = (leadId: string, status: Lead['status']) => {
    const newLeads = leads.map(l => l.id === leadId ? { ...l, status } : l);
    setLeads(newLeads);
    localStorage.setItem('honeymooner_leads', JSON.stringify(newLeads));
  };

  return {
    destinations,
    packages,
    leads,
    testimonials,
    loading,
    updateDestinations,
    updatePackages,
    updateTestimonials,
    addLead,
    updateLeadStatus
  };
};
