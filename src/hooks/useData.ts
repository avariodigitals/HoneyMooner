import { useState, useEffect } from 'react';
import { initialDestinations, initialPackages, initialTestimonials, DATA_VERSION } from '../data/mock';
import type { Destination, TravelPackage, Lead, Testimonial, BlogPost } from '../types';

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

const initialPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Top 5 Romantic Resorts in the Maldives for 2024',
    excerpt: 'Discover the most exclusive overwater villas and private island experiences that define luxury romance in the Indian Ocean.',
    category: 'Destinations',
    author: 'Aisha Bello',
    date: 'Mar 15, 2024',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=2070',
    readTime: '8 min read',
    slug: 'maldives-resorts-2024'
  },
  {
    id: '2',
    title: 'Planning Your Honeymoon: A Step-by-Step Guide',
    excerpt: 'From setting a budget to choosing the perfect season, our comprehensive guide takes the stress out of planning your first trip as a married couple.',
    category: 'Tips & Advice',
    author: 'Daniel Chen',
    date: 'Mar 10, 2024',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1974',
    readTime: '12 min read',
    slug: 'honeymoon-planning-guide'
  }
];

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
      localStorage.removeItem('honeymooner_posts');
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

  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const stored = localStorage.getItem('honeymooner_posts');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('honeymooner_posts', JSON.stringify(initialPosts));
    return initialPosts;
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

  const updatePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts);
    localStorage.setItem('honeymooner_posts', JSON.stringify(newPosts));
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
    posts,
    loading,
    updateDestinations,
    updatePackages,
    updateTestimonials,
    updateHomeContent,
    updatePosts,
    addLead,
    updateLeadStatus
  };
};
