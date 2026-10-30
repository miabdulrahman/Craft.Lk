import React, { useState } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Store,
  ArrowRight,
  AlertCircle,
  MapPin,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await login(email, password);
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

        const data = await register(payload);
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
      {/* Left Column: Visual Artisan Banner (Matching Panel 6) */}
      <div className="hidden lg:block lg:col-span-6 relative overflow-hidden bg-stone-900">
        <img
          src="/images/artisan_potter.jpg"
          alt="Sri Lankan artisan potter shaping clay on wheel"
          className="w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-stone-950/20" />

        {/* Text Overlay (Panel 6) */}
        <div className="absolute bottom-12 inset-x-12 text-white space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30 backdrop-blur-xs">
            <span>Sri Lankan Artisan Network</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Join CraftLK
          </h2>
          <p className="text-sm text-stone-300 max-w-md font-normal leading-relaxed">
            Explore unique handmade products and support local artisans across Sri Lanka.
          </p>
        </div>
      </div>

      {/* Right Column: Form Container (Matching Panel 6) */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#FAF8F5]">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <img src="/logo.svg" alt="CraftLK Logo" className="h-9 w-auto mx-auto" />
            </Link>
          </div>

          {/* Login / Register Tab Header (Panel 6) */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                isLogin
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                !isLogin
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Register
            </button>
          </div>

          {/* Registration Role Selection Pills (Only when Registering) */}
          {!isLogin && (
            <div className="mb-6">
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    role === 'customer'
                      ? 'border-[#A3481D] bg-[#FAF5EE] text-[#A3481D]'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    role === 'seller'
                      ? 'border-[#A3481D] bg-[#FAF5EE] text-[#A3481D]'
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
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Registration only) */}
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
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
                />
              </div>
            )}

            {/* Email Address */}
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
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
              />
            </div>

            {/* Password */}
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
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 pr-10 text-sm focus:ring-1 focus:ring-[#A3481D]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Additional Seller Application Fields */}
            {!isLogin && role === 'seller' && (
              <div className="pt-2 border-t border-stone-200 space-y-3">
                <p className="text-xs font-bold text-[#A3481D] uppercase tracking-wider">
                  Artisan Shop Application Details
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
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-[#A3481D]"
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
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-[#A3481D]"
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
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-[#A3481D]"
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
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-[#A3481D]"
                  />
                </div>
              </div>
            )}

            {/* Submit Button (Panel 6: Create Account / Sign In) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-sm font-bold rounded-xl shadow-md transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : isLogin ? (
                <span>Sign In to Account</span>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Demo Credentials Quick Switch Hint */}
          <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-400 text-center space-y-1">
            <p className="font-bold text-stone-600">Academic Demo Logins:</p>
            <p>
              Customer: <code className="bg-stone-100 px-1 py-0.5 rounded">customer@craftlk.com</code> / <code className="bg-stone-100 px-1 py-0.5 rounded">Customer@2026</code>
            </p>
            <p>
              Seller: <code className="bg-stone-100 px-1 py-0.5 rounded">sunfire@example.com</code> / <code className="bg-stone-100 px-1 py-0.5 rounded">Sunfire@2026</code>
            </p>
            <p>
              Admin: <code className="bg-stone-100 px-1 py-0.5 rounded">admin@craftlk.com</code> / <code className="bg-stone-100 px-1 py-0.5 rounded">Admin@CraftLK2026</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
