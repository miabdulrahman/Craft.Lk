import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Package,
  Store,
  ShieldCheck,
  ChevronDown,
  Trash2,
  ShoppingBag,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Categories', path: '/categories' },
  { name: 'Our Artisans', path: '/artisans' },
  { name: 'About', path: '/about' }
];

export default function Navbar() {
  const { user, logout, isAdmin, isSeller } = useAuth();
  const {
    totalItemCount,
    wishlistItems,
    removeFromWishlist,
    addToCart
  } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    showToast('Signed out successfully', 'info');
    navigate('/');
  };

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
    showToast(`Moved "${product.name}" to your cart!`, 'success');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-stone-200/80'
            : 'bg-white/90 backdrop-blur-md border-b border-stone-200/60'
        }`}
      >
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-[#26211E] via-[#A3481D] to-[#26211E] text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="h-3 w-3 text-amber-300 shrink-0 hidden sm:inline" />
          <span>
            Authentic Sri Lankan Handmade Crafts Direct From Island Artisans • Islandwide Delivery
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 group focus:outline-none"
            >
              <img
                src="/logo-horizontal.png"
                alt="CraftLK — Sri Lankan Handmade Treasures"
                className="h-11 sm:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-103"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-semibold">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `relative px-3.5 py-2 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'text-[#A3481D] bg-[#FAF2EC]'
                        : 'text-stone-700 hover:text-[#A3481D] hover:bg-stone-100/70'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-sm xl:max-w-md mx-2">
              <form onSubmit={handleSearchSubmit} className="relative w-full group">
                <input
                  type="text"
                  placeholder="Search batik, masks, pottery, brass..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F5F2EB] hover:bg-[#EFECE4] focus:bg-white border border-stone-200/90 rounded-full py-2.5 pl-11 pr-4 text-xs sm:text-sm text-stone-800 placeholder-stone-400 transition-all"
                />
                <Search className="absolute left-4 top-2.5 h-4 w-4 text-stone-400 group-focus-within:text-[#A3481D] transition-colors" />
              </form>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Wishlist Drawer Trigger */}
              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                className="relative p-2.5 text-stone-700 hover:text-[#A3481D] hover:bg-[#FAF2EC] rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center group cursor-pointer"
                title="Saved Crafts Wishlist"
                aria-label="Wishlist"
              >
                <Heart
                  className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                    wishlistItems.length > 0 ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center shadow-sm">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 text-stone-700 hover:text-[#A3481D] hover:bg-[#FAF2EC] rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center group"
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#A3481D] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
                    {totalItemCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full border border-stone-200/90 hover:border-[#A3481D]/50 bg-white hover:bg-[#FAF8F5] shadow-2xs transition-all cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A3481D] to-amber-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-stone-800 max-w-[95px] truncate hidden sm:inline">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-stone-500 transition-transform duration-200 ${
                        userDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 animate-scale-in">
                      <div className="px-4 py-3 border-b border-stone-100 bg-[#FAF8F5]/60">
                        <p className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-stone-900 truncate mt-0.5">
                          {user.name}
                        </p>
                        <p className="text-xs text-stone-500 truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1.5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-extrabold rounded-full bg-amber-100 text-[#A3481D]">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1">
                        {/* Role specific links */}
                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-[#FAF2EC] hover:text-[#A3481D] transition-colors"
                          >
                            <ShieldCheck className="h-4 w-4 text-[#A3481D]" />
                            <span>Admin Control Center</span>
                          </Link>
                        )}

                        {isSeller && (
                          <>
                            <Link
                              to="/seller/dashboard"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-[#FAF2EC] hover:text-[#A3481D] transition-colors"
                            >
                              <LayoutDashboard className="h-4 w-4 text-[#A3481D]" />
                              <span>Seller Studio Dashboard</span>
                            </Link>
                            <Link
                              to="/seller/products"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-[#FAF2EC] hover:text-[#A3481D] transition-colors"
                            >
                              <Package className="h-4 w-4 text-[#A3481D]" />
                              <span>Manage Products</span>
                            </Link>
                            <Link
                              to="/seller/shop-profile"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-[#FAF2EC] hover:text-[#A3481D] transition-colors"
                            >
                              <Store className="h-4 w-4 text-[#A3481D]" />
                              <span>Shop Branding</span>
                            </Link>
                          </>
                        )}

                        <Link
                          to="/my-orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-[#FAF2EC] hover:text-[#A3481D] transition-colors"
                        >
                          <Package className="h-4 w-4 text-stone-400" />
                          <span>My Purchase Orders</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-[#FAF2EC] hover:text-[#A3481D] transition-colors"
                        >
                          <User className="h-4 w-4 text-stone-400" />
                          <span>Account Settings</span>
                        </Link>
                      </div>

                      <div className="border-t border-stone-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 text-left transition-colors cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs sm:text-sm font-bold rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 shimmer-button"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-stone-700 hover:text-[#A3481D] hover:bg-stone-100 rounded-xl transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-4 pb-6 space-y-4 shadow-xl animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search authentic Sri Lankan crafts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F2EB] border border-stone-200 rounded-xl py-2.5 pl-10 pr-4 text-sm"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
            </form>

            <nav className="flex flex-col space-y-1 text-sm font-bold text-stone-800">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-2.5 px-3.5 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-[#FAF2EC] text-[#A3481D]'
                        : 'hover:bg-stone-100 text-stone-700'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              {user && (
                <>
                  <NavLink
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `py-2.5 px-3.5 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-[#FAF2EC] text-[#A3481D]'
                          : 'hover:bg-stone-100 text-stone-700'
                      }`
                    }
                  >
                    My Orders
                  </NavLink>
                  {isSeller && (
                    <Link
                      to="/seller/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 px-3.5 rounded-xl text-[#A3481D] bg-amber-50/70 font-bold"
                    >
                      Seller Studio Dashboard →
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 px-3.5 rounded-xl text-[#A3481D] bg-amber-50/70 font-bold"
                    >
                      Admin Control Center →
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Slide-Over Wishlist Drawer */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Drawer Header */}
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                  <Heart className="h-4.5 w-4.5 fill-rose-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base">
                    Saved Crafts
                  </h3>
                  <p className="text-xs text-stone-500">
                    {wishlistItems.length} item(s) in your personal collection
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWishlistOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-100">
              {wishlistItems.length > 0 ? (
                wishlistItems.map((prod) => (
                  <div
                    key={prod._id}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <Link
                      to={`/products/${prod._id}`}
                      onClick={() => setWishlistOpen(false)}
                      className="flex items-center gap-3.5 flex-1 min-w-0 group"
                    >
                      <img
                        src={
                          prod.images?.[0] ||
                          '/images/products/wooden_elephant.jpg'
                        }
                        alt={prod.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-stone-900 text-sm truncate group-hover:text-[#A3481D] transition-colors">
                          {prod.name}
                        </h4>
                        <p className="text-xs font-extrabold text-[#A3481D] mt-0.5">
                          LKR {prod.price?.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {prod.stock > 0 ? 'In Stock' : 'Sold Out'}
                        </p>
                      </div>
                    </Link>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {prod.stock > 0 && (
                        <button
                          onClick={() => handleMoveToCart(prod)}
                          className="p-2 bg-[#FAF2EC] hover:bg-[#A3481D] text-[#A3481D] hover:text-white rounded-xl transition-colors cursor-pointer"
                          title="Move to Cart"
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeFromWishlist(prod._id)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-300 flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-stone-800 text-base mb-1">
                    No saved crafts yet
                  </h4>
                  <p className="text-xs text-stone-500 max-w-xs mb-6 leading-relaxed">
                    Tap the heart icon on any handcrafted piece to bookmark it here for later.
                  </p>
                  <Link
                    to="/shop"
                    onClick={() => setWishlistOpen(false)}
                    className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#A3481D] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    <span>Explore Marketplace</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {wishlistItems.length > 0 && (
              <div className="p-5 border-t border-stone-200 bg-[#FAF8F5]">
                <Link
                  to="/cart"
                  onClick={() => setWishlistOpen(false)}
                  className="w-full py-3 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Go to Shopping Cart</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
