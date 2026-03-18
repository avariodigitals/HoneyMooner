import { useState } from 'react';
import { useData } from '../hooks/useData';
import { useCurrency } from '../hooks/useCurrency';
import { useUser } from '../hooks/useUser';
import { authService } from '../services/authService';
import type { TravelPackage, PricingTier, Lead, PricingBasis } from '../types';
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
  User as UserIcon
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
  const { packages, destinations, leads, updatePackages, updateLeadStatus } = useData();
  const { formatPrice } = useCurrency();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('packages');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPackage, setEditingPackage] = useState<TravelPackage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
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
      await authService.login(loginForm.username, loginForm.password);
      setIsAuthenticated(true);
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
                  placeholder="••••••••"
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

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    
    const newPackages = packages.map(p => p.id === editingPackage.id ? editingPackage : p);
    updatePackages(newPackages);
    setEditingPackage(null);
  };

  const onUploadError = (err: ImageKitError) => {
    console.error("Upload Error", err);
    setIsUploading(false);
    alert("Upload failed. For production, you'll need an authentication endpoint.");
  };

  const onUploadSuccess = (res: ImageKitUploadResponse) => {
    if (!editingPackage) return;
    setEditingPackage({
      ...editingPackage,
      featuredImage: res.url
    });
    setIsUploading(false);
  };

  const handleTierChange = (tierId: string, field: keyof PricingTier, value: string | number) => {
    if (!editingPackage) return;
    
    const newTiers = editingPackage.tiers.map(t => 
      t.id === tierId ? { ...t, [field]: value } : t
    );
    setEditingPackage({ ...editingPackage, tiers: newTiers });
  };

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
              { id: 'leads', label: 'Enquiries', icon: Users },
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
            <button className="bg-brand-accent text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-brand-700 transition-colors">
              <Plus size={16} />
              Add New
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                            onStartUpload={() => setIsUploading(true)}
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
                  className="bg-brand-accent text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-brand-700 transition-colors shadow-lg shadow-brand-accent/20"
                >
                  <Save size={18} />
                  Save Changes
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
