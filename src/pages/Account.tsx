import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { authService } from '../services/authService';
import SEO from '../components/layout/SEO';
import { 
  Heart, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Loader2, 
  ChevronRight,
  Eye,
  EyeOff
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
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationAvailable, setRegistrationAvailable] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = typeof location.state?.from === 'string'
    ? location.state.from
    : location.state?.from?.pathname || "/";

  useEffect(() => {
    let cancelled = false;
    authService.isRegistrationAvailable()
      .then((available) => {
        if (!cancelled) setRegistrationAvailable(available);
      })
      .catch(() => {
        if (!cancelled) setRegistrationAvailable(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!registrationAvailable && !isLogin) {
      setIsLogin(true);
      setError('Account signup is currently disabled on this site. Please use Login.');
    }
  }, [registrationAvailable, isLogin]);

  const validateForm = () => {
    const nextErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.username.trim()) {
      nextErrors.username = 'Username is required.';
    } else if (formData.username.trim().length < 3) {
      nextErrors.username = 'Username must be at least 3 characters.';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.';
    } else if (!isLogin && formData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (!isLogin) {
      if (!formData.email.trim()) {
        nextErrors.email = 'Email is required.';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        nextErrors.email = 'Enter a valid email address.';
      }

      if (!formData.confirmPassword) {
        nextErrors.confirmPassword = 'Please confirm your password.';
      } else if (formData.password !== formData.confirmPassword) {
        nextErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    toast.dismiss();

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
        toast.success('Signed in successfully!');
        navigate(from, { replace: true });
      } else {
        await authService.register(formData.username, formData.email, formData.password);
        setIsLogin(true);
        setError('Account created. Please login.');
        setFormData({ username: formData.username, email: '', password: '', confirmPassword: '' });
        setFieldErrors({});
        toast.success('Account created! Please login.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password logic
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotSent(false);
    toast.dismiss();
    try {
      await authService.forgotPassword(forgotEmail);
      setForgotSent(true);
      toast.success('Password reset email sent!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email.';
      toast.error(message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col relative overflow-hidden bg-brand-900">
      <SEO
        title="Account"
        description="Sign in to manage your saved honeymoon destinations, bookings, and personalized romantic travel plans."
        keywords="honeymoon account, travel login, manage bookings"
      />
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/homepage-default-hero.jpg" 
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
                    <img
                      src={`https://i.pravatar.cc/150?u=${i + 10}`}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
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
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-serif text-brand-900 mb-1">
                    {isLogin ? "Welcome Back" : "Start Your Journey"}
                  </h2>
                  <p className="text-brand-500 text-xs italic opacity-80">
                    {isLogin ? "Access your saved plans and preferences." : "Create an account to manage your travel plans."}
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
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value });
                              if (fieldErrors.email) {
                                setFieldErrors((prev) => ({ ...prev, email: undefined }));
                              }
                            }}
                          />
                        </div>
                        {fieldErrors.email && (
                          <p className="text-red-500 text-[10px] ml-4">{fieldErrors.email}</p>
                        )}
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
                        onChange={(e) => {
                          setFormData({ ...formData, username: e.target.value });
                          if (fieldErrors.username) {
                            setFieldErrors((prev) => ({ ...prev, username: undefined }));
                          }
                        }}
                      />
                    </div>
                    {fieldErrors.username && (
                      <p className="text-red-500 text-[10px] ml-4">{fieldErrors.username}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block ml-4">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300" size={16} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        className="w-full pl-12 pr-12 py-3.5 bg-brand-50 border-none rounded-xl text-brand-900 focus:ring-2 focus:ring-brand-accent/20 transition-all text-sm"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          if (fieldErrors.password) {
                            setFieldErrors((prev) => ({ ...prev, password: undefined }));
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-700"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="text-red-500 text-[10px] ml-4">{fieldErrors.password}</p>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5"
                      >
                        <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block ml-4">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300" size={16} />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            autoComplete="new-password"
                            className="w-full pl-12 pr-12 py-3.5 bg-brand-50 border-none rounded-xl text-brand-900 focus:ring-2 focus:ring-brand-accent/20 transition-all text-sm"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => {
                              setFormData({ ...formData, confirmPassword: e.target.value });
                              if (fieldErrors.confirmPassword) {
                                setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-700"
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {fieldErrors.confirmPassword && (
                          <p className="text-red-500 text-[10px] ml-4">{fieldErrors.confirmPassword}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 mb-1">
                      <p className="text-red-500 text-[10px] text-center italic font-medium">
                        {error.includes('already exists') || error.includes('user_exists') 
                          ? "Account already exists. Please login instead."
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

                  {isLogin && (
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        className="text-xs text-brand-500 hover:text-brand-accent underline underline-offset-2"
                        onClick={() => setShowForgot(true)}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Forgot Password Modal */}
              {showForgot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs relative">
                    <button
                      className="absolute top-2 right-2 text-brand-400 hover:text-brand-900"
                      onClick={() => { setShowForgot(false); setForgotEmail(''); setForgotSent(false); }}
                      aria-label="Close"
                    >
                      ×
                    </button>
                    <h3 className="text-lg font-bold mb-2 text-brand-900">Forgot Password?</h3>
                    <form onSubmit={handleForgotPassword} className="space-y-3">
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-2 border rounded-xl bg-brand-50 text-brand-900"
                        placeholder="Enter your email"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        disabled={forgotLoading || forgotSent}
                      />
                      <button
                        type="submit"
                        className="btn-primary w-full py-2"
                        disabled={forgotLoading || forgotSent}
                      >
                        {forgotLoading ? <Loader2 className="animate-spin inline" size={16} /> : 'Send Reset Link'}
                      </button>
                    </form>
                    {forgotSent && (
                      <p className="text-green-600 text-xs mt-3">If your email exists, a reset link was sent.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Fixed Footer for a more professional feel */}
              <div className="p-6 bg-brand-50/30 border-t border-brand-50 text-center">
                {registrationAvailable ? (
                  <>
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
                  </>
                ) : (
                  <p className="text-brand-500 text-xs italic">
                    Sign up is not enabled yet. Login is available for existing accounts.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
      </div>
    </div>
  </div>
);
};

export default Account;
