import { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { useCurrency } from '../hooks/useCurrency';
import { useUser } from '../hooks/useUser';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';
import type { TravelPackage, PricingTier, Lead, PricingBasis, Destination, BlogPost, Continent, HomeContent } from '../types';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  LayoutDashboard, 
  MapPin, 
  Package, 
  Users, 
  LogOut, 
  Plus, 
  Edit3, 
  MoreVertical,
  Search,
  X,
  Save,
  Image as ImageIcon,
  Loader2,
  Lock,
  User as UserIcon,
  Globe,
  Trash2,
  Sparkles,
  BookOpen,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { 
  IKContext, 
  IKUpload 
} from 'imagekitio-react';
import type { ImageKitError, ImageKitUploadResponse } from '../components/ui/ImageUpload';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Admin = () => {
  const { 
    packages, 
    destinations, 
    leads, 
    updatePackages, 
    updateLeadStatus, 
    updateDestinations,
    homeContent,
    updateHomeContent,
    posts,
    updatePosts,
    isLoading
  } = useData();
  const { formatPrice } = useCurrency();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPackage, setEditingPackage] = useState<TravelPackage | null>(null);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [localHomeContent, setLocalHomeContent] = useState<HomeContent>(homeContent);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadType, setUploadType] = useState<'package' | 'destination' | 'hero' | 'post' | null>(null);

  useEffect(() => {
    setLocalHomeContent(homeContent);
  }, [homeContent]);

  const handleSaveHomeContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomeContent(localHomeContent);
    alert('Homepage content updated successfully!');
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    
    const exists = posts.find(p => p.id === editingPost.id);
    let newPosts;
    if (exists) {
      newPosts = posts.map(p => p.id === editingPost.id ? editingPost : p);
    } else {
      newPosts = [editingPost, ...posts];
    }
    updatePosts(newPosts);
    setEditingPost(null);
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      updatePosts(posts.filter(p => p.id !== id));
    }
  };

  const handleDeletePackage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      updatePackages(packages.filter(p => p.id !== id));
    }
  };

  const handleDeleteDestination = (id: string) => {
    if (window.confirm('Are you sure you want to delete this destination? All associated packages will lose their destination reference.')) {
      updateDestinations(destinations.filter(d => d.id !== id));
    }
  };
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginFormError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const ikPublicKey = 'public_ZvsQ/Q2eZv45QUJYbHzTMM+SrOc=';
  const ikUrlEndpoint = 'https://ik.imagekit.io/360t0n1jd9';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFormError('');
    setIsLoggingIn(true);
    try {
      // Allow hardcoded admin access for the concierge suite
      if (loginForm.username === 'admin' && loginForm.password === 'password123') {
        // Set a dummy token to persist local session
        authService.setToken('local-admin-session');
        setIsAuthenticated(true);
      } else {
        await authService.login(loginForm.username, loginForm.password);
        setIsAuthenticated(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setLoginFormError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-brand-100 w-full max-w-md"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-brand-900 rounded-3xl flex items-center justify-center text-brand-accent mx-auto mb-6 shadow-xl shadow-brand-900/20">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-serif text-brand-900 mb-2">Concierge Login</h1>
            <p className="text-brand-500 text-sm italic">Access the luxury travel management suite.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block ml-4">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300" size={18} />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  className="w-full pl-14 pr-6 py-4 bg-brand-50 border-none rounded-2xl text-brand-900 focus:ring-2 focus:ring-brand-accent/20 transition-all"
                  placeholder="admin"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300" size={18} />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full pl-14 pr-6 py-4 bg-brand-50 border-none rounded-2xl text-brand-900 focus:ring-2 focus:ring-brand-accent/20 transition-all"
                  placeholder="password123"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
            </div>

            {loginError && (
              <p className="text-red-500 text-xs text-center italic font-medium">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-primary w-full py-4 text-lg shadow-xl shadow-brand-accent/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Authenticating...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    
    setIsSaving(true);
    try {
      const success = await dataService.updatePackage(editingPackage);
      if (success) {
        const exists = packages.find(p => p.id === editingPackage.id);
        let newPackages;
        if (exists) {
          newPackages = packages.map(p => p.id === editingPackage.id ? editingPackage : p);
        } else {
          newPackages = [editingPackage, ...packages];
        }
        updatePackages(newPackages);
        setEditingPackage(null);
      } else {
        alert('Failed to save to WordPress. Please check your connection.');
      }
    } catch (error) {
      console.error('Error saving package:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDestination) return;
    
    setIsSaving(true);
    try {
      const success = await dataService.updateDestination(editingDestination);
      if (success) {
        const exists = destinations.find(d => d.id === editingDestination.id);
        let newDestinations;
        if (exists) {
          newDestinations = destinations.map(d => d.id === editingDestination.id ? editingDestination : d);
        } else {
          newDestinations = [editingDestination, ...destinations];
        }
        updateDestinations(newDestinations);
        setEditingDestination(null);
      } else {
        alert('Failed to save to WordPress. Please check your connection.');
      }
    } catch (error) {
      console.error('Error saving destination:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNew = (targetTab?: string) => {
    const tabToUse = targetTab || activeTab;
    
    if (tabToUse === 'packages') {
      if (targetTab) setActiveTab('packages');
      const newPkg: TravelPackage = {
        id: `pkg-${Date.now()}`,
        title: 'New Romantic Package',
        slug: 'new-package',
        category: 'honeymoon',
        summary: '',
        description: '',
        featuredImage: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57',
        gallery: [],
        destinationId: destinations[0]?.id || '',
        duration: { days: 7, nights: 6 },
        tiers: [
          { id: 'tier-1', name: 'Premium', price: 2500, basis: 'per couple' },
          { id: 'tier-2', name: 'Luxuria', price: 4500, basis: 'per couple' },
          { id: 'tier-3', name: 'Ultra Luxuria', price: 7500, basis: 'per couple' }
        ],
        inclusions: [],
        exclusions: [],
        tags: [],
        departures: [],
        seo: { title: '', description: '', keywords: [] }
      };
      setEditingPackage(newPkg);
    } else if (tabToUse === 'destinations') {
      if (targetTab) setActiveTab('destinations');
      const newDest: Destination = {
        id: `dest-${Date.now()}`,
        name: 'New Destination',
        country: '',
        continent: 'Africa',
        description: '',
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57',
        slug: 'new-destination'
      };
      setEditingDestination(newDest);
    } else if (tabToUse === 'journal') {
      if (targetTab) setActiveTab('journal');
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        title: 'New Journal Entry',
        excerpt: '',
        category: 'Destinations',
        author: user?.name || 'Administrator',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57',
        readTime: '5 min read',
        slug: 'new-journal-entry'
      };
      setEditingPost(newPost);
    }
  };

  const onUploadError = (err: ImageKitError) => {
    console.error("Upload Error", err);
    setIsUploading(false);
    alert("Upload failed. For production, you'll need an authentication endpoint.");
  };

  const onUploadSuccess = (res: ImageKitUploadResponse) => {
    if (uploadType === 'package' && editingPackage) {
      setEditingPackage({
        ...editingPackage,
        featuredImage: res.url
      });
    } else if (uploadType === 'destination' && editingDestination) {
      setEditingDestination({
        ...editingDestination,
        image: res.url
      });
    } else if (uploadType === 'post' && editingPost) {
      setEditingPost({
        ...editingPost,
        image: res.url
      });
    } else if (uploadType === 'hero') {
      setLocalHomeContent({
        ...localHomeContent,
        hero: { ...localHomeContent.hero, image: res.url }
      });
    }
    setIsUploading(false);
    setUploadType(null);
  };

  const handleTierChange = (tierId: string, field: keyof PricingTier, value: string | number) => {
    if (!editingPackage) return;
    
    const newTiers = editingPackage.tiers.map(t => 
      t.id === tierId ? { ...t, [field]: value } : t
    );
    setEditingPackage({ ...editingPackage, tiers: newTiers });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-brand-accent mx-auto" size={48} />
          <p className="text-slate-500 font-medium italic">Synchronizing with the Server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar - Hidden on mobile, toggleable or drawer would be better but let's make it stack for now */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 lg:h-screen lg:sticky lg:top-0">
        <div className="p-4 lg:p-8 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 h-full">
          <div className="hidden lg:block mb-10 px-4">
            <img 
              src="https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Full%20Logo%20No%20BG%20(1).png?updatedAt=1773691277034" 
              alt="The Honeymooner" 
              className="h-32 w-auto object-contain"
            />
          </div>
          <div className="flex flex-row lg:flex-col gap-2 flex-grow">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'packages', label: 'Packages', icon: Package },
              { id: 'destinations', label: 'Destinations', icon: MapPin },
              { id: 'journal', label: 'Journal', icon: BookOpen },
              { id: 'leads', label: 'Enquiries', icon: Users },
              { id: 'settings', label: 'Site Content', icon: Globe },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/20'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* User Profile in Admin Sidebar */}
          <div className="hidden lg:flex flex-col gap-4 px-4 py-6 border-t border-slate-100 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent overflow-hidden">
                {user?.avatar_urls ? (
                  <img src={user.avatar_urls['96']} alt="" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} />
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.first_name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Administrator</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all whitespace-nowrap mt-0 lg:mt-auto"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 lg:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-serif text-slate-900 mb-2 capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-slate-500 text-sm">Manage your honeymoon business from one central dashboard.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-accent/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {['packages', 'destinations', 'journal'].includes(activeTab) && (
              <button 
                onClick={() => handleAddNew()}
                className="bg-brand-accent text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-brand-700 transition-colors"
              >
                <Plus size={16} />
                Add New
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className={cn(
          "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
          activeTab === 'dashboard' && "bg-transparent border-none shadow-none"
        )}>
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Packages', value: packages.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Destinations', value: destinations.length, icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Total Enquiries', value: leads.length, icon: Users, color: 'text-brand-accent', bg: 'bg-brand-50' },
                  { label: 'Active Articles', value: posts.length, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                        <stat.icon size={24} />
                      </div>
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                        <TrendingUp size={12} />
                        +12%
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-serif text-slate-900">{stat.value}</h3>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Leads */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xl font-serif text-slate-900">Recent Enquiries</h3>
                    <button 
                      onClick={() => setActiveTab('leads')}
                      className="text-brand-accent text-xs font-bold uppercase tracking-widest hover:text-brand-700 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {leads.slice(0, 5).map((lead) => (
                      <div key={lead.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-accent text-xs font-bold">
                            {lead.travelerName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{lead.travelerName}</p>
                            <p className="text-xs text-slate-500">{lead.packageName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            lead.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                          )}>
                            {lead.status}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions / Recent Activity */}
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-serif text-slate-900 mb-6">Quick Actions</h3>
                    <div className="space-y-4">
                      <button 
                        onClick={() => handleAddNew('packages')}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-brand-accent hover:bg-white transition-all group"
                      >
                        <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                          <Plus size={18} className="text-brand-accent" />
                          Create Package
                        </div>
                        <ArrowUpRight size={16} className="text-slate-300 group-hover:text-brand-accent transition-colors" />
                      </button>
                      <button 
                        onClick={() => handleAddNew('journal')}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-brand-accent hover:bg-white transition-all group"
                      >
                        <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                          <BookOpen size={18} className="text-brand-accent" />
                          Write Article
                        </div>
                        <ArrowUpRight size={16} className="text-slate-300 group-hover:text-brand-accent transition-colors" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-brand-900 p-8 rounded-3xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                    <h3 className="text-xl font-serif mb-4 relative z-10">Premium Support</h3>
                    <p className="text-brand-100/70 text-sm font-light leading-relaxed mb-6 relative z-10">
                      Need help managing your luxury travel catalog or connecting with clients?
                    </p>
                    <button className="w-full py-3 bg-brand-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-700 transition-all relative z-10">
                      Contact Concierge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Package</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Pricing (Premium)</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {packages.map(pkg => (
                    <tr key={pkg.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={pkg.featuredImage} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium text-slate-900">{pkg.title}</p>
                            <p className="text-xs text-slate-500">{destinations.find(d => d.id === pkg.destinationId)?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-brand-50 text-brand-700 text-[10px] font-bold uppercase tracking-widest rounded-md">
                          {pkg.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-slate-900">
                        {formatPrice(pkg.tiers[0].price)}
                        <p className="text-[10px] text-slate-400 font-normal">{pkg.tiers[0].basis}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setEditingPackage(pkg)}
                            className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-50 rounded-lg"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'destinations' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Destination</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Continent</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Packages</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {destinations.map(dest => (
                    <tr key={dest.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={dest.image} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium text-slate-900">{dest.name}</p>
                            <p className="text-xs text-slate-500">{dest.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{dest.continent}</td>
                      <td className="px-6 py-4 text-right text-sm text-slate-600">
                        {packages.filter(p => p.destinationId === dest.id).length}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setEditingDestination(dest)}
                            className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-50 rounded-lg"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteDestination(dest.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl">
              <form onSubmit={handleSaveHomeContent} className="space-y-12">
                {/* Hero Section Settings */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="text-xl font-serif text-slate-900">Hero Section</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Title</label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
                        value={localHomeContent.hero.title}
                        onChange={(e) => setLocalHomeContent({
                          ...localHomeContent,
                          hero: { ...localHomeContent.hero, title: e.target.value }
                        })}
                      />
                      <p className="text-[10px] text-slate-400 italic">Use '&' to create a line break with italic style.</p>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Button Text</label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
                        value={localHomeContent.hero.cta}
                        onChange={(e) => setLocalHomeContent({
                          ...localHomeContent,
                          hero: { ...localHomeContent.hero, cta: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtitle / SEO Description</label>
                    <textarea
                      rows={2}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
                      value={localHomeContent.hero.subtitle}
                      onChange={(e) => setLocalHomeContent({
                        ...localHomeContent,
                        hero: { ...localHomeContent.hero, subtitle: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hero Image</label>
                    <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl">
                      <img src={localHomeContent.hero.image} className="w-32 h-20 object-cover rounded-lg shadow-sm" />
                      <IKContext publicKey={ikPublicKey} urlEndpoint={ikUrlEndpoint}>
                        <div className="relative">
                          <label 
                            htmlFor="ik-hero-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold cursor-pointer hover:border-brand-accent transition-all"
                          >
                            <ImageIcon size={14} />
                            Change Image
                          </label>
                          <IKUpload
                            id="ik-hero-upload"
                            className="hidden"
                            fileName="hero-bg.jpg"
                            folder="/site-assets"
                            onStartUpload={() => {
                              setIsUploading(true);
                              setUploadType('hero');
                            }}
                            onSuccess={onUploadSuccess}
                            onError={onUploadError}
                          />
                        </div>
                      </IKContext>
                    </div>
                  </div>
                </div>

                {/* Destinations Section Settings */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
                      <MapPin size={20} />
                    </div>
                    <h3 className="text-xl font-serif text-slate-900">Destinations Section</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Section Title</label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
                        value={localHomeContent.destinations.title}
                        onChange={(e) => setLocalHomeContent({
                          ...localHomeContent,
                          destinations: { ...localHomeContent.destinations, title: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Script Subtitle</label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
                        value={localHomeContent.destinations.subtitle}
                        onChange={(e) => setLocalHomeContent({
                          ...localHomeContent,
                          destinations: { ...localHomeContent.destinations, subtitle: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                    <textarea
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
                      value={localHomeContent.destinations.description}
                      onChange={(e) => setLocalHomeContent({
                        ...localHomeContent,
                        destinations: { ...localHomeContent.destinations, description: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-brand-accent text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-brand-accent/20 hover:bg-brand-700 transition-all flex items-center gap-3"
                  >
                    <Save size={20} />
                    Publish Site Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Article</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {posts.map(post => (
                    <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={post.image} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium text-slate-900">{post.title}</p>
                            <p className="text-xs text-slate-500">By {post.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{post.category}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{post.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setEditingPost(post)}
                            className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-50 rounded-lg"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Traveler</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Package</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{lead.travelerName}</p>
                          <p className="text-xs text-slate-500">{lead.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{lead.packageName}</td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                          className="text-xs border-none bg-slate-100 rounded-lg py-1 px-2 focus:ring-0 cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="booked">Booked</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-50 rounded-lg">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No leads found yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Package Modal */}
      {editingPackage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-900/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <form onSubmit={handleSavePackage}>
              <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-serif text-slate-900">Edit Package Pricing</h2>
                <button 
                  type="button" 
                  onClick={() => setEditingPackage(null)}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-12">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Featured Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="relative group w-full sm:w-48 h-32 rounded-2xl overflow-hidden shadow-sm bg-slate-200">
                      <img 
                        src={editingPackage.featuredImage} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80";
                        }}
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm flex items-center justify-center">
                          <Loader2 className="text-white animate-spin" size={24} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow space-y-2 text-center sm:text-left">
                      <p className="text-sm font-medium text-slate-900">Upload a romantic photo</p>
                      <p className="text-xs text-slate-500 mb-4">Recommended size: 1200x800px. JPG, PNG supported.</p>
                      
                      <IKContext publicKey={ikPublicKey} urlEndpoint={ikUrlEndpoint}>
                        <div className="relative">
                          <label 
                            htmlFor="ik-upload"
                            className={cn(
                              "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all",
                              isUploading 
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                : "bg-white text-brand-accent border border-brand-100 hover:border-brand-accent shadow-sm"
                            )}
                          >
                            <ImageIcon size={18} />
                            {isUploading ? "Uploading..." : "Select New Image"}
                          </label>
                          <IKUpload
                            id="ik-upload"
                            className="hidden"
                            fileName={`${editingPackage.slug}-hero.jpg`}
                            tags={['package', 'travel']}
                            useUniqueFileName={true}
                            folder="/packages"
                            onStartUpload={() => {
                              setIsUploading(true);
                              setUploadType('package');
                            }}
                            onSuccess={onUploadSuccess}
                            onError={onUploadError}
                          />
                        </div>
                      </IKContext>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Package Title</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-brand-accent/20"
                      value={editingPackage.title}
                      onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pricing Basis</label>
                    <select
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-brand-accent/20"
                      value={editingPackage.tiers[0].basis}
                      onChange={(e) => {
                        const newTiers = editingPackage.tiers.map(t => ({ ...t, basis: e.target.value as PricingBasis }));
                        setEditingPackage({ ...editingPackage, tiers: newTiers });
                      }}
                    >
                      <option value="per couple">Per Couple</option>
                      <option value="per person">Per Person</option>
                      <option value="per family of 4">Per Family of 4</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-lg font-serif text-slate-900">Pricing Tiers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {editingPackage.tiers.map((tier) => (
                      <div key={tier.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                        <p className="font-serif text-lg text-brand-900">{tier.name}</p>
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Price (USD)</label>
                          <input
                            type="number"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-medium"
                            value={tier.price}
                            onChange={(e) => handleTierChange(tier.id, 'price', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SEO Section */}
                <div className="pt-8 border-t border-slate-100 space-y-8">
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-brand-accent" />
                    <h3 className="text-xl font-serif text-slate-900">SEO Settings</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SEO Title</label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-brand-accent/20"
                        value={editingPackage.seo.title}
                        onChange={(e) => setEditingPackage({
                          ...editingPackage,
                          seo: { ...editingPackage.seo, title: e.target.value }
                        })}
                        placeholder="Luxury Honeymoon in Bali | The Honeymooner"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SEO Keywords</label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-brand-accent/20"
                        value={editingPackage.seo.keywords.join(', ')}
                        onChange={(e) => setEditingPackage({
                          ...editingPackage,
                          seo: { ...editingPackage.seo, keywords: e.target.value.split(',').map(k => k.trim()) }
                        })}
                        placeholder="honeymoon, bali, luxury travel"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Meta Description</label>
                    <textarea
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-brand-accent/20"
                      value={editingPackage.seo.description}
                      onChange={(e) => setEditingPackage({
                        ...editingPackage,
                        seo: { ...editingPackage.seo, description: e.target.value }
                      })}
                      placeholder="Discover our curated luxury honeymoon package in Bali..."
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-white sticky bottom-0">
                <button 
                  type="button" 
                  onClick={() => setEditingPackage(null)}
                  className="px-8 py-3 text-slate-500 font-medium hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-brand-accent text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-brand-700 transition-colors shadow-lg shadow-brand-accent/20 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Destination Modal */}
      {editingDestination && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-900/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <form onSubmit={handleSaveDestination}>
              <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-serif text-slate-900">
                  {destinations.find(d => d.id === editingDestination.id) ? 'Edit Destination' : 'Add New Destination'}
                </h2>
                <button 
                  type="button" 
                  onClick={() => setEditingDestination(null)}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-12">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Destination Cover Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="relative group w-full sm:w-48 h-32 rounded-2xl overflow-hidden shadow-sm bg-slate-200">
                      <img 
                        src={editingDestination.image} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80";
                        }}
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm flex items-center justify-center">
                          <Loader2 className="text-white animate-spin" size={24} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow space-y-2 text-center sm:text-left">
                      <p className="text-sm font-medium text-slate-900">Upload a breathtaking photo</p>
                      <p className="text-xs text-slate-500 mb-4">Recommended size: 1920x1080px. JPG, PNG supported.</p>
                      
                      <IKContext publicKey={ikPublicKey} urlEndpoint={ikUrlEndpoint}>
                        <div className="relative">
                          <label 
                            htmlFor="ik-dest-upload"
                            className={cn(
                              "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all",
                              isUploading 
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                : "bg-white text-brand-accent border border-brand-100 hover:border-brand-accent shadow-sm"
                            )}
                          >
                            <ImageIcon size={18} />
                            {isUploading ? "Uploading..." : "Select New Image"}
                          </label>
                          <IKUpload
                            id="ik-dest-upload"
                            className="hidden"
                            fileName={`${editingDestination.slug}-cover.jpg`}
                            tags={['destination', 'travel']}
                            useUniqueFileName={true}
                            folder="/destinations"
                            onStartUpload={() => {
                              setIsUploading(true);
                              setUploadType('destination');
                            }}
                            onSuccess={onUploadSuccess}
                            onError={onUploadError}
                          />
                        </div>
                      </IKContext>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Destination Name</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-brand-accent/20"
                      value={editingDestination.name}
                      onChange={(e) => setEditingDestination({ ...editingDestination, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Country</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-brand-accent/20"
                      value={editingDestination.country}
                      onChange={(e) => setEditingDestination({ ...editingDestination, country: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Continent</label>
                    <select
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-brand-accent/20"
                      value={editingDestination.continent}
                      onChange={(e) => setEditingDestination({ ...editingDestination, continent: e.target.value as Continent })}
                    >
                      <option value="Africa">Africa</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="Caribbean">Caribbean</option>
                      <option value="Americas">Americas</option>
                      <option value="Oceania">Oceania</option>
                      <option value="Middle East">Middle East</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">URL Slug</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-brand-accent/20 font-mono text-sm"
                      value={editingDestination.slug}
                      onChange={(e) => setEditingDestination({ ...editingDestination, slug: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                  <textarea
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-brand-accent/20 leading-relaxed"
                    value={editingDestination.description}
                    onChange={(e) => setEditingDestination({ ...editingDestination, description: e.target.value })}
                  />
                </div>

                {/* SEO Section */}
                <div className="pt-8 border-t border-slate-100 space-y-8">
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-brand-accent" />
                    <h3 className="text-xl font-serif text-slate-900">SEO Settings</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SEO Title</label>
                      <input
                        type="text"
                        placeholder="Romantic Honeymoon in..."
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
                        value={editingDestination.name} // Simple mapping for now or add to type
                        disabled
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Meta Description</label>
                      <textarea
                        rows={2}
                        placeholder="Discover the world's most romantic..."
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
                        value={editingDestination.description.substring(0, 160)}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-white sticky bottom-0">
                <button 
                  type="button" 
                  onClick={() => setEditingDestination(null)}
                  className="px-8 py-3 text-slate-500 font-medium hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-brand-accent text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-brand-700 transition-colors shadow-lg shadow-brand-accent/20 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {isSaving ? 'Saving...' : 'Save Destination'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Journal Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-900/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <form onSubmit={handleSavePost}>
              <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-serif text-slate-900">
                  {posts.find(p => p.id === editingPost.id) ? 'Edit Journal Entry' : 'Add New Entry'}
                </h2>
                <button 
                  type="button" 
                  onClick={() => setEditingPost(null)}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-12">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cover Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="relative group w-full sm:w-48 h-32 rounded-2xl overflow-hidden shadow-sm bg-slate-200">
                      <img 
                        src={editingPost.image} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm flex items-center justify-center">
                          <Loader2 className="text-white animate-spin" size={24} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow space-y-2 text-center sm:text-left">
                      <p className="text-sm font-medium text-slate-900">Upload a featured image</p>
                      <p className="text-xs text-slate-500 mb-4">Recommended size: 1200x800px.</p>
                      
                      <IKContext publicKey={ikPublicKey} urlEndpoint={ikUrlEndpoint}>
                        <div className="relative">
                          <label 
                            htmlFor="ik-post-upload"
                            className={cn(
                              "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all",
                              isUploading 
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                : "bg-white text-brand-accent border border-brand-100 hover:border-brand-accent shadow-sm"
                            )}
                          >
                            <ImageIcon size={18} />
                            {isUploading ? "Uploading..." : "Select New Image"}
                          </label>
                          <IKUpload
                            id="ik-post-upload"
                            className="hidden"
                            fileName={`${editingPost.slug}-cover.jpg`}
                            folder="/journal"
                            onStartUpload={() => {
                              setIsUploading(true);
                              setUploadType('post');
                            }}
                            onSuccess={onUploadSuccess}
                            onError={onUploadError}
                          />
                        </div>
                      </IKContext>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                    <select
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
                      value={editingPost.category}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    >
                      <option value="Destinations">Destinations</option>
                      <option value="Tips & Advice">Tips & Advice</option>
                      <option value="Inspiration">Inspiration</option>
                      <option value="Couples Stories">Couples Stories</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Author</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
                      value={editingPost.author}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Read Time</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
                      value={editingPost.readTime}
                      onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slug</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-mono text-sm"
                      value={editingPost.slug}
                      onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Excerpt</label>
                  <textarea
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 leading-relaxed"
                    value={editingPost.excerpt}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-white sticky bottom-0">
                <button 
                  type="button" 
                  onClick={() => setEditingPost(null)}
                  className="px-8 py-3 text-slate-500 font-medium hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-brand-accent text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-brand-700 transition-colors shadow-lg shadow-brand-accent/20"
                >
                  <Save size={18} />
                  Save Article
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Admin;
