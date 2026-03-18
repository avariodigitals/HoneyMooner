import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { authService } from '../services/authService';
import { 
  Heart, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

const Account = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
        navigate(from, { replace: true });
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await authService.register(formData.username, formData.email, formData.password);
        // After registration, log them in automatically
        await login(formData.username, formData.password);
        navigate('/');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col relative overflow-hidden bg-brand-900">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=2070" 
          className="w-full h-full object-cover opacity-30"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900 via-brand-900/80 to-brand-900" />
        
        {/* Animated Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content Container - Account for Header height */}
      <div className="relative z-10 flex-grow flex items-center justify-center px-6 lg:px-12 pt-32 pb-12">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Side: Branding/Messaging */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block space-y-8"
          >
            <div className="space-y-4">
              <p className="script-font text-brand-accent text-3xl xl:text-4xl">Enter Your Account</p>
              <h1 className="text-5xl xl:text-7xl font-serif text-white leading-[1.15]">
                Where Your Love <br />
                <span className="italic text-brand-accent/90">Finds its Home.</span>
              </h1>
            </div>
            
            <p className="text-brand-200 text-base xl:text-lg font-light leading-relaxed max-w-lg opacity-80">
              Join our exclusive community of romantic travelers. Save your dream destinations, 
              receive bespoke itineraries, and unlock a world of intimate experiences.
            </p>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-brand-900 bg-brand-100 overflow-hidden shadow-xl">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="space-y-0.5">
                <p className="text-white font-serif text-lg italic">1,200+ couples</p>
                <p className="text-brand-400 text-[10px] font-bold uppercase tracking-widest">Joined this month</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Auth Card */}
          <div className="flex justify-center lg:justify-end items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/95 backdrop-blur-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20 w-full max-w-md xl:max-w-lg relative flex flex-col"
              style={{ maxHeight: 'min(700px, 85vh)' }}
            >
              <div className="flex-grow p-6 md:p-8 xl:p-10 overflow-y-auto custom-scrollbar relative">
                {/* Header elements inside the scroll area */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-brand-900 rounded-2xl flex items-center justify-center text-brand-accent shadow-xl shadow-brand-900/20 rotate-12">
                      <Heart size={28} fill="currentColor" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-accent rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                      <Sparkles size={12} />
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-serif text-brand-900 mb-1">
                    {isLogin ? "Welcome Back" : "Start Your Journey"}
                  </h2>
                  <p className="text-brand-50 text-xs italic opacity-80">
                    {isLogin ? "Your personal sanctuary awaits..." : "Begin the opening chapter of your forever."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5"
                      >
                        <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block ml-4">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300" size={16} />
                          <input
                            type="email"
                            required
                            autoComplete="email"
                            className="w-full pl-12 pr-5 py-3.5 bg-brand-50 border-none rounded-xl text-brand-900 focus:ring-2 focus:ring-brand-accent/20 transition-all text-sm"
                            placeholder="love@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block ml-4">Username</label>
                    <div className="relative">
                      <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300" size={16} />
                      <input
                        type="text"
                        required
                        autoComplete="username"
                        className="w-full pl-12 pr-5 py-3.5 bg-brand-50 border-none rounded-xl text-brand-900 focus:ring-2 focus:ring-brand-accent/20 transition-all text-sm"
                        placeholder="Your unique name"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block ml-4">Secret Password</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300" size={16} />
                      <input
                        type="password"
                        required
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        className="w-full pl-12 pr-5 py-3.5 bg-brand-50 border-none rounded-xl text-brand-900 focus:ring-2 focus:ring-brand-accent/20 transition-all text-sm"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5"
                      >
                        <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block ml-4">Confirm Secret</label>
                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300" size={16} />
                          <input
                            type="password"
                            required
                            autoComplete="new-password"
                            className="w-full pl-12 pr-5 py-3.5 bg-brand-50 border-none rounded-xl text-brand-900 focus:ring-2 focus:ring-brand-accent/20 transition-all text-sm"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 mb-1">
                      <p className="text-red-500 text-[10px] text-center italic font-medium">
                        {error.includes('already exists') || error.includes('user_exists') 
                          ? "This love story has already begun! Please login instead."
                          : error}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-4 text-base shadow-xl shadow-brand-accent/20 flex items-center justify-center gap-3 disabled:opacity-50 group mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Processing...
                      </>
                    ) : (
                      <>
                        {isLogin ? "Sign In" : "Register"}
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Fixed Footer for a more professional feel */}
              <div className="p-6 bg-brand-50/30 border-t border-brand-50 text-center">
                <p className="text-brand-400 text-xs mb-3">
                  {isLogin ? "Don't have an account yet?" : "Already part of the community?"}
                </p>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full py-3.5 px-6 bg-white hover:bg-brand-50 text-brand-900 font-bold text-xs uppercase tracking-widest transition-all rounded-xl inline-flex items-center justify-center gap-3 group border border-brand-100/50 shadow-sm"
                >
                  {isLogin ? "Create Your Account" : "Login to Your Account"}
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform opacity-60" />
                </button>
              </div>
            </motion.div>
          </div>
      </div>
    </div>
  </div>
);
};

export default Account;
