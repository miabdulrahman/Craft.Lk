import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, shop, logout, isAdmin, isSeller } = useAuth();
  const { totalItemCount } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-[#A3481D] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        Authentic Sri Lankan Handmade Crafts Direct From Island Artisans • Islandwide Delivery
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="CraftLK Logo" className="h-9 w-auto" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-700">
            <Link
              to="/"
              className="hover:text-[#A3481D] transition-colors py-1"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="hover:text-[#A3481D] transition-colors py-1"
            >
              Shop
            </Link>
            <Link
              to="/categories"
              className="hover:text-[#A3481D] transition-colors py-1"
            >
              Categories
            </Link>
            <Link
              to="/artisans"
              className="hover:text-[#A3481D] transition-colors py-1"
            >
              Our Artisans
            </Link>
            <Link
              to="/about"
              className="hover:text-[#A3481D] transition-colors py-1"
            >
              About
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, batik, pottery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F2EB] border border-stone-200 rounded-full py-2.5 pl-11 pr-4 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#A3481D]/30 focus:border-[#A3481D] transition-all"
              />
              <Search className="absolute left-4 top-3 h-4 w-4 text-stone-400" />
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist Link (visual in reference) */}
            <Link
              to="/shop"
              className="p-2 text-stone-600 hover:text-[#A3481D] hover:bg-stone-100 rounded-full transition-colors hidden sm:flex items-center justify-center"
              title="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-stone-700 hover:text-[#A3481D] hover:bg-stone-100 rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center group"
              title="Cart"
            >
              <ShoppingCart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A3481D] text-white text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-full border border-stone-200 hover:border-[#A3481D]/50 hover:bg-[#FAF8F5] transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[#A3481D]/15 text-[#A3481D] flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-stone-800 max-w-[100px] truncate hidden sm:inline">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-stone-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-stone-800 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-md bg-amber-100 text-amber-800">
                        {user.role}
                      </span>
                    </div>

                    {/* Role specific links */}
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-[#FAF5EF] hover:text-[#A3481D]"
                      >
                        <ShieldCheck className="h-4 w-4 text-[#A3481D]" />
                        Admin Dashboard
                      </Link>
                    )}

                    {isSeller && (
                      <>
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-[#FAF5EF] hover:text-[#A3481D]"
                        >
                          <LayoutDashboard className="h-4 w-4 text-[#A3481D]" />
                          Seller Dashboard
                        </Link>
                        <Link
                          to="/seller/products"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-[#FAF5EF] hover:text-[#A3481D]"
                        >
                          <Package className="h-4 w-4 text-[#A3481D]" />
                          My Products
                        </Link>
                        <Link
                          to="/seller/shop-profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-[#FAF5EF] hover:text-[#A3481D]"
                        >
                          <Store className="h-4 w-4 text-[#A3481D]" />
                          Shop Profile
                        </Link>
                      </>
                    )}

                    <Link
                      to="/my-orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-[#FAF5EF] hover:text-[#A3481D]"
                    >
                      <Package className="h-4 w-4 text-stone-500" />
                      My Orders
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-[#FAF5EF] hover:text-[#A3481D]"
                    >
                      <User className="h-4 w-4 text-stone-500" />
                      My Profile
                    </Link>

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-sm font-semibold rounded-full shadow-xs transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F2EB] border border-stone-200 rounded-lg py-2.5 pl-10 pr-4 text-sm"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
          </form>

          <nav className="flex flex-col space-y-2 text-base font-medium text-stone-800">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              Shop
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              Categories
            </Link>
            <Link
              to="/artisans"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              Our Artisans
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              About
            </Link>
            {user && (
              <Link
                to="/my-orders"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-stone-100"
              >
                My Orders
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
