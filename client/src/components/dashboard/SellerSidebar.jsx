import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  Store,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function SellerSidebar() {
  const { logout, shop } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    showToast('Signed out of Seller Studio', 'info');
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/seller/dashboard', exactSearch: '' },
    { name: 'Products', path: '/seller/products', exactSearch: '' },
    { name: 'Inventory', path: '/seller/products?tab=inventory', exactSearch: '?tab=inventory', icon: Boxes },
    { name: 'Orders', path: '/seller/orders', exactSearch: '', icon: ShoppingCart },
    { name: 'Shop Profile', path: '/seller/shop-profile', exactSearch: '', icon: Store },
    { name: 'Analytics', path: '/seller/dashboard?view=analytics', exactSearch: '?view=analytics', icon: BarChart3 },
    { name: 'Account Settings', path: '/profile', exactSearch: '', icon: Settings }
  ];

  const getIcon = (name, customIcon) => {
    if (customIcon) return customIcon;
    if (name === 'Dashboard') return LayoutDashboard;
    return Package;
  };

  const isItemActive = (item) => {
    const basePath = item.path.split('?')[0];
    if (location.pathname !== basePath) return false;
    if (item.exactSearch) {
      return location.search === item.exactSearch;
    }
    return location.search === '' || location.search === '?action=new';
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand / Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-stone-800/80">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo-horizontal-dark.png"
              alt="CraftLK Logo"
              className="h-11 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-stone-400 hover:text-white rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Seller Info Badge */}
        <div className="p-4 mx-4 my-4 bg-stone-800/60 rounded-2xl border border-stone-700/50">
          <p className="text-[10px] uppercase tracking-wider text-amber-400 font-extrabold">
            Artisan Studio
          </p>
          <p className="text-sm font-bold text-white truncate mt-0.5">
            {shop?.shopName || 'My Artisan Studio'}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                shop?.approvalStatus === 'approved'
                  ? 'bg-emerald-400'
                  : shop?.approvalStatus === 'rejected'
                  ? 'bg-rose-400'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-[11px] capitalize text-stone-300 font-medium">
              {shop?.approvalStatus || 'Pending Approval'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = getIcon(item.name, item.icon);
            const active = isItemActive(item);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? 'bg-[#A3481D] text-white shadow-md shadow-[#A3481D]/25'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/70'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-stone-800/80 space-y-1.5">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-stone-400 hover:text-white rounded-xl hover:bg-stone-800/60 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Marketplace</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Floating Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-5 left-5 z-40 p-3.5 bg-[#181B20] text-white rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2 text-xs font-bold"
      >
        <Menu className="h-4 w-4 text-amber-400" />
        <span>Studio Menu</span>
      </button>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex bg-stone-950/60 backdrop-blur-xs animate-fade-in">
          <aside className="w-64 bg-[#181B20] text-stone-300 h-full border-r border-stone-800 shadow-2xl">
            {sidebarContent}
          </aside>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#181B20] text-stone-300 flex-col justify-between shrink-0 min-h-screen border-r border-stone-800 sticky top-0 h-screen">
        {sidebarContent}
      </aside>
    </>
  );
}
