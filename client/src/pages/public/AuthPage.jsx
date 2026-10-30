import React, { useState } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import {
  User,
  Eye,
  EyeOff,
  Store,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'login';
  const initialRole = searchParams.get('role') || 'customer';

  const [isLogin, setIsLogin] = useState(initialTab === 'login');
  const [role, setRole] = useState(initialRole); // 'customer' or 'seller'
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [city, setCity] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleQuickDemoLogin = async (demoEmail, demoPass, label) => {
    setIsLogin(true);
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setLoading(true);
    try {
      const data = await login(demoEmail, demoPass);
      showToast(`Signed in as ${label}`, 'success');
      if (data?.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data?.user?.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await login(email, password);
        showToast(`Welcome back, ${data?.user?.name || 'User'}!`, 'success');
        if (data?.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (data?.user?.role === 'seller') {
          navigate('/seller/dashboard');
        } else {
          navigate(redirectPath);
        }
      } else {
        const payload = {
          name,
          email,
          password,
          role,
          phone,
          ...(role === 'seller' && {
            shopName,
            shopDescription,
            district,
            city: city || district
          })
        };

        await register(payload);
        showToast('Account created successfully!', 'success');
        if (role === 'seller') {
          navigate('/seller/dashboard');
        } else {
          navigate(redirectPath);
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Column: Visual Artisan Banner */}
      <div className="hidden lg:block lg:col-span-6 relative overflow-hidden bg-stone-900">
        <img
          src="/images/artisan_potter.jpg"
          alt="Sri Lankan artisan potter shaping clay on wheel"
          className="w-full h-full object-cover object-center opacity-85 scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-stone-950/20" />

        {/* Top Back Link */}
        <div className="absolute top-8 left-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Marketplace</span>
          </Link>
        </div>

        {/* Text Overlay */}
        <div className="absolute bottom-12 inset-x-12 text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sri Lankan Artisan Network</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Empowering Island Craftsmanship
          </h2>
          <p className="text-sm sm:text-base text-stone-300 max-w-md font-normal leading-relaxed">
            Explore authentic handmade creations and directly support rural artisans and family workshops across all 25 districts of Sri Lanka.
          </p>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="lg:col-span-6 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 bg-[#FAF8F5] heritage-pattern overflow-y-auto">
        <div className="w-full max-w-md mb-4 lg:hidden">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#A3481D]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Marketplace</span>
          </Link>
        </div>

        <div className="w-full max-w-md bg-white p-7 sm:p-9 rounded-3xl border border-stone-200/90 shadow-lg">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-block group">
              <img
                src="/logo.png"
                alt="CraftLK — Sri Lankan Handmade Treasures"
                className="h-24 sm:h-28 w-auto mx-auto object-contain transition-transform duration-300 group-hover:scale-103"
              />
            </Link>
            <p className="text-xs text-stone-500 mt-2">
              {isLogin
                ? 'Sign in to access your orders, wishlist, or studio'
                : 'Create your CraftLK account in seconds'}
            </p>
          </div>

          {/* Login / Register Tab Header */}
          <div className="grid grid-cols-2 p-1.5 bg-stone-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                isLogin
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Registration Role Selection Pills */}
          {!isLogin && (
            <div className="mb-5">
              <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block mb-2">
                Select Account Type
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'customer'
                      ? 'border-[#A3481D] bg-[#FAF5EE] text-[#A3481D] shadow-2xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'seller'
                      ? 'border-[#A3481D] bg-[#FAF5EE] text-[#A3481D] shadow-2xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Store className="h-3.5 w-3.5" />
                  <span>Artisan Seller</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abdul Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Additional Seller Application Fields */}
            {!isLogin && role === 'seller' && (
              <div className="pt-3 border-t border-stone-200 space-y-3">
                <p className="text-[11px] font-extrabold text-[#A3481D] uppercase tracking-wider">
                  Artisan Workshop Details
                </p>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Shop / Studio Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lanka Clay Heritage"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      District *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kandy"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      City / Village *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pilimathalawa"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Shop Description / Craft Specialty *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Briefly describe your craft tradition, materials used, and years of experience."
                    value={shopDescription}
                    onChange={(e) => setShopDescription(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-sm font-bold rounded-xl shadow-md transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-60 shimmer-button cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : isLogin ? (
                <span>Sign In to Account</span>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* One-Click Demo Logins */}
          <div className="mt-6 pt-5 border-t border-stone-100">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-stone-400 mb-3">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Instant 1-Click Demo Access</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  handleQuickDemoLogin('customer@craftlk.com', 'Customer@2026', 'Customer')
                }
                className="py-2 px-2 rounded-xl border border-stone-200 hover:border-[#A3481D] bg-[#FAF8F5] hover:bg-[#FAF2EC] text-stone-700 hover:text-[#A3481D] text-[11px] font-bold transition-all flex flex-col items-center gap-1 cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  handleQuickDemoLogin('sunfire@example.com', 'Sunfire@2026', 'Artisan Seller')
                }
                className="py-2 px-2 rounded-xl border border-stone-200 hover:border-[#A3481D] bg-[#FAF8F5] hover:bg-[#FAF2EC] text-stone-700 hover:text-[#A3481D] text-[11px] font-bold transition-all flex flex-col items-center gap-1 cursor-pointer"
              >
                <Store className="h-3.5 w-3.5" />
                <span>Seller</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  handleQuickDemoLogin('admin@craftlk.com', 'Admin@CraftLK2026', 'Platform Admin')
                }
                className="py-2 px-2 rounded-xl border border-stone-200 hover:border-[#A3481D] bg-[#FAF8F5] hover:bg-[#FAF2EC] text-stone-700 hover:text-[#A3481D] text-[11px] font-bold transition-all flex flex-col items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
