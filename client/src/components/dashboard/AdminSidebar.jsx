import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  Layers,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Sellers', path: '/admin/sellers', icon: Store },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Analytics', path: '/admin/dashboard?view=analytics', icon: BarChart3 },
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

        {/* Admin Badge */}
        <div className="p-4 mx-4 my-3 bg-stone-800/50 rounded-xl border border-stone-700/40 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-stone-400 font-medium">Administrator</p>
            <p className="text-sm font-bold text-white truncate">{user?.name || 'Super Admin'}</p>
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
