import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  Store,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SellerSidebar() {
  const { logout, shop } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/seller/products', icon: Package },
    { name: 'Orders', path: '/seller/orders', icon: ShoppingCart },
    { name: 'Inventory', path: '/seller/products?tab=inventory', icon: Boxes },
    { name: 'Shop Profile', path: '/seller/shop-profile', icon: Store },
    { name: 'Analytics', path: '/seller/dashboard?view=analytics', icon: BarChart3 },
    { name: 'Settings', path: '/profile', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#181B20] text-stone-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-stone-800">
      <div>
        {/* Brand / Logo */}
        <div className="h-20 flex items-center px-6 border-b border-stone-800/80">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="CraftLK Logo" className="h-8 brightness-0 invert" />
          </Link>
        </div>

        {/* Seller Info Badge */}
        <div className="p-4 mx-4 my-3 bg-stone-800/50 rounded-xl border border-stone-700/40">
          <p className="text-xs text-stone-400 font-medium">Artisan Shop</p>
          <p className="text-sm font-bold text-white truncate">
            {shop?.shopName || 'My Artisan Studio'}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                shop?.approvalStatus === 'approved'
                  ? 'bg-emerald-400'
                  : shop?.approvalStatus === 'rejected'
                  ? 'bg-rose-400'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-[11px] capitalize text-stone-300">
              {shop?.approvalStatus || 'Pending Approval'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#A3481D] text-white shadow-sm'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/70'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-stone-800/80 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 text-xs text-stone-400 hover:text-white rounded-lg hover:bg-stone-800/50 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Marketplace</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
