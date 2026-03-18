import { useState, useEffect } from 'react';
import { initialDestinations, initialPackages, initialTestimonials, DATA_VERSION } from '../data/mock';
import type { Destination, TravelPackage, Lead, Testimonial } from '../types';

export interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    image: string;
    cta: string;
  };
  destinations: {
    title: string;
    subtitle: string;
    description: string;
  };
  packages: {
    title: string;
    subtitle: string;
    description: string;
  };
}

const defaultHomeContent: HomeContent = {
  hero: {
    title: "Luxury Honeymoons & Romantic Escapes",
    subtitle: "Your journey to forever starts here.",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=2070",
    cta: "Explore Our Sanctuary"
  },
  destinations: {
    title: "Iconic Honeymoon Destinations",
    subtitle: "Explore the World",
    description: "From the overwater bungalows of the Maldives to the sunset terraces of Santorini, find your perfect backdrop for romance."
  },
  packages: {
    title: "Signature Packages",
    subtitle: "Curated Collections",
    description: "Handpicked experiences designed for effortless romance and luxury."
  }
};

export const useData = () => {
  // Check for data version and clear stale storage if needed
  useEffect(() => {
    const storedVersion = localStorage.getItem('honeymooner_data_version');
    if (storedVersion !== DATA_VERSION) {
      // Version mismatch - clear specific items to force reload from mock
      localStorage.removeItem('honeymooner_destinations');
      localStorage.removeItem('honeymooner_packages');
      localStorage.removeItem('honeymooner_testimonials');
      localStorage.removeItem('honeymooner_home_content');
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

  const [homeContent, setHomeContent] = useState<HomeContent>(() => {
    const stored = localStorage.getItem('honeymooner_home_content');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('honeymooner_home_content', JSON.stringify(defaultHomeContent));
    return defaultHomeContent;
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

  const updateHomeContent = (newContent: HomeContent) => {
    setHomeContent(newContent);
    localStorage.setItem('honeymooner_home_content', JSON.stringify(newContent));
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
    homeContent,
    loading,
    updateDestinations,
    updatePackages,
    updateTestimonials,
    updateHomeContent,
    addLead,
    updateLeadStatus
  };
};
