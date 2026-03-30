import { useState, useEffect } from 'react';
import { initialDestinations, initialPackages, initialTestimonials, initialPosts } from '../data/mock';
import type { Destination, TravelPackage, Lead, Testimonial, BlogPost, HomeContent } from '../types';
import { dataService } from '../services/dataService';

const defaultHomeContent: HomeContent = {
  hero: {
    title: "Plan a Once-in-a-Lifetime Honeymoon — Without the Stress",
    subtitle: "We design fully personalized luxury honeymoon experiences — from destination selection to every intimate detail.",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=2070",
    cta: "Start Planning Your Honeymoon"
  },
  destinations: {
    title: "Where Do You Want Your Love Story to Begin?",
    subtitle: "Choose from the world’s most romantic destinations — curated for unforgettable experiences.",
    description: "Our handpicked collection of the world's most romantic escapes, designed for couples who seek more than just a trip."
  },
  packages: {
    title: "Leave Where Your New Life Begins",
    subtitle: "Signature Packages",
    description: "We don’t just plan trips — we design deeply personal honeymoon experiences that reflect your story, your pace, and your idea of romance."
  }
};

export const useData = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [homeContent, setHomeContent] = useState<HomeContent>(defaultHomeContent);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const canSync = await dataService.checkWP();
        if (!canSync) {
          setDestinations(initialDestinations);
          setPackages(initialPackages);
          setPosts(initialPosts);
          const savedHomeContent = localStorage.getItem('hm_home_content');
          if (savedHomeContent) setHomeContent(JSON.parse(savedHomeContent));
          setTestimonials(initialTestimonials);
          return;
        }
        const [wpDestinations, wpPackages, wpPosts, wpLeads] = await Promise.all([
          dataService.getDestinations(),
          dataService.getPackages(),
          dataService.getPosts(),
          dataService.getLeads()
        ]);

        if (wpDestinations.length > 0) setDestinations(wpDestinations);
        else setDestinations(initialDestinations);

        if (wpPackages.length > 0) setPackages(wpPackages);
        else setPackages(initialPackages);

        if (wpPosts.length > 0) setPosts(wpPosts);
        else setPosts(initialPosts);

        if (wpLeads.length > 0) setLeads(wpLeads);

        // Home content and testimonials still from local for now or initial
        const savedHomeContent = localStorage.getItem('hm_home_content');
        if (savedHomeContent) setHomeContent(JSON.parse(savedHomeContent));

        setTestimonials(initialTestimonials);
      } catch (error) {
        console.error('Failed to sync with WordPress:', error);
        // Fallback to local storage if API fails
        const storedDest = localStorage.getItem('hm_destinations');
        const storedPkg = localStorage.getItem('hm_packages');
        const storedLeads = localStorage.getItem('hm_leads');
        if (storedDest) setDestinations(JSON.parse(storedDest));
        if (storedPkg) setPackages(JSON.parse(storedPkg));
        if (storedLeads) setLeads(JSON.parse(storedLeads));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const updatePackages = async (newPackages: TravelPackage[]) => {
    setPackages(newPackages);
    // Cache locally
    localStorage.setItem('hm_packages', JSON.stringify(newPackages));
    
    // Attempt to update the specific package on WordPress if it was an edit
    // Note: In a full implementation, we'd handle individual CRUD operations
  };

  const updateDestinations = async (newDestinations: Destination[]) => {
    setDestinations(newDestinations);
    localStorage.setItem('hm_destinations', JSON.stringify(newDestinations));
  };

  const updatePosts = async (newPosts: BlogPost[]) => {
    setPosts(newPosts);
    localStorage.setItem('hm_posts', JSON.stringify(newPosts));
  };

  const updateHomeContent = (newContent: HomeContent) => {
    setHomeContent(newContent);
    localStorage.setItem('hm_home_content', JSON.stringify(newContent));
  };

  const updateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status } : lead));
  };

  const addLead = async (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
    return await dataService.createLead(lead);
  };

  return {
    packages,
    destinations,
    leads,
    testimonials,
    homeContent,
    posts,
    isLoading,
    updatePackages,
    updateDestinations,
    updateLeadStatus,
    updateHomeContent,
    updatePosts,
    addLead
  };
};
