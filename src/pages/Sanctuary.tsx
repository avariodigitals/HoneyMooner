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

const Sanctuary = () => {
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
    <div className="min-h-screen pt-44 pb-20 px-4 flex items-center justify-center relative overflow-hidden bg-brand-900">
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

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Branding/Messaging */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block space-y-8"
        >
          <div className="space-y-4">
            <p className="script-font text-brand-accent text-4xl">Enter Your Sanctuary</p>
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight">
              Where Your Love <br />
              <span className="italic">Finds its Home.</span>
            </h1>
          </div>
          
          <p className="text-brand-200 text-lg leading-relaxed max-w-md">
            Join our exclusive community of romantic travelers. Save your dream destinations, 
            receive bespoke itineraries, and unlock a world of intimate experiences.
          </p>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-brand-900 bg-brand-100 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="" />
                </div>
              ))}
            </div>
            <p className="text-brand-300 text-sm font-medium">Joined by 1,200+ couples this month</p>
          </div>
        </motion.div>

        {/* Right Side: Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-2xl rounded-[48px] shadow-2xl overflow-hidden border border-white/20"
        >
          <div className="p-8 md:p-12">
            <div className="flex justify-center mb-10">
              <div className="relative">
                <div className="w-20 h-20 bg-brand-900 rounded-3xl flex items-center justify-center text-brand-accent shadow-xl shadow-brand-900/20 rotate-12">
                  <Heart size={32} fill="currentColor" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                  <Sparkles size={16} />
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif text-brand-900 mb-2">
                {isLogin ? "Welcome Back" : "Start Your Journey"}
              </h2>
              <p className="text-brand-500 text-sm italic">
                {isLogin ? "Your sanctuary awaits..." : "Begin the opening chapter of your forever."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block ml-4">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300" size={18} />
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        className="w-full pl-14 pr-6 py-4 bg-brand-50 border-none rounded-2xl text-brand-900 focus:ring-2 focus:ring-brand-accent/20 transition-all"
                        placeholder="love@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block ml-4">Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300" size={18} />
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    className="w-full pl-14 pr-6 py-4 bg-brand-50 border-none rounded-2xl text-brand-900 focus:ring-2 focus:ring-brand-accent/20 transition-all"
                    placeholder="Your unique name"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block ml-4">Secret Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300" size={18} />
                  <input
                    type="password"
                    required
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    className="w-full pl-14 pr-6 py-4 bg-brand-50 border-none rounded-2xl text-brand-900 focus:ring-2 focus:ring-brand-accent/20 transition-all"
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
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block ml-4">Confirm Secret</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300" size={18} />
                      <input
                        type="password"
                        required
                        autoComplete="new-password"
                        className="w-full pl-14 pr-6 py-4 bg-brand-50 border-none rounded-2xl text-brand-900 focus:ring-2 focus:ring-brand-accent/20 transition-all"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 mb-2">
                  <p className="text-red-500 text-xs text-center italic font-medium">
                    {error.includes('already exists') || error.includes('user_exists') 
                      ? "This love story has already begun! Please login to your account instead."
                      : error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-5 text-lg shadow-xl shadow-brand-accent/20 flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    {isLogin ? "Enter Sanctuary" : "Start Your Journey"}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-brand-50 text-center">
              <p className="text-brand-400 text-sm mb-4">
                {isLogin ? "Don't have an account yet?" : "Already part of the community?"}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand-900 font-bold text-sm uppercase tracking-widest hover:text-brand-accent transition-colors inline-flex items-center gap-2 group"
              >
                {isLogin ? "Create Your Love Story" : "Login to Your Account"}
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sanctuary;
