import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  ShoppingCart,
  Banknote,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    pendingSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [recentSellers, setRecentSellers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentSellers(res.data.recentSellers);
        setRecentOrders(res.data.recentOrders);
      }
    } catch (err) {
      console.error('Error loading admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleApprove = async (shopId, shopName) => {
    try {
      const res = await api.patch(`/admin/sellers/${shopId}/approve`);
      if (res.data.success) {
        setActionMsg(`Approved shop: ${shopName}`);
        setTimeout(() => setActionMsg(''), 3000);
        fetchStats();
      }
    } catch (err) {
      alert(err.message || 'Approval failed');
    }
  };

  const handleReject = async (shopId, shopName) => {
    const reason = prompt(`Enter rejection reason for "${shopName}":`, 'Incomplete documentation');
    if (!reason) return;

    try {
      const res = await api.patch(`/admin/sellers/${shopId}/reject`, { reason });
      if (res.data.success) {
        setActionMsg(`Rejected shop: ${shopName}`);
        setTimeout(() => setActionMsg(''), 3000);
        fetchStats();
      }
    } catch (err) {
      alert(err.message || 'Rejection failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      {/* 1. Dark Charcoal Sidebar (Matching Panel 8) */}
      <AdminSidebar />

      {/* 2. Main Dashboard Content (Matching Panel 8) */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200/80 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Marketplace supervision, artisan registrations, and performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">{user?.name}</p>
              <span className="text-[10px] text-amber-700 bg-amber-100 font-bold px-2 py-0.5 rounded-md uppercase">
                Platform Admin
              </span>
            </div>
          </div>
        </div>

        {actionMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* 3. KPI Cards Row (Matching Panel 8: Total Users, Total Sellers, Total Orders, Total Revenue) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
            <div>
              <span className="text-xs text-stone-400 font-semibold block mb-1">
                Total Users
              </span>
              <span className="text-3xl font-extrabold text-stone-900 group-hover:text-blue-600 transition-colors">
                {stats.totalUsers}
              </span>
              <span className="text-[11px] text-stone-400 block mt-1">
                Registered platform accounts
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
          </div>

          {/* Total Sellers */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
            <div>
              <span className="text-xs text-stone-400 font-semibold block mb-1">
                Total Sellers
              </span>
              <span className="text-3xl font-extrabold text-stone-900 group-hover:text-[#A3481D] transition-colors">
                {stats.totalSellers}
              </span>
              <span className="text-[11px] text-amber-700 font-semibold block mt-1">
                {stats.pendingSellers} pending approvals
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#A3481D] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Store className="h-6 w-6" />
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
            <div>
              <span className="text-xs text-stone-400 font-semibold block mb-1">
                Total Orders
              </span>
              <span className="text-3xl font-extrabold text-stone-900 group-hover:text-purple-600 transition-colors">
                {stats.totalOrders}
              </span>
              <span className="text-[11px] text-stone-400 block mt-1">
                Across all workshops
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingCart className="h-6 w-6" />
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
            <div>
              <span className="text-xs text-stone-400 font-semibold block mb-1">
                Total Revenue
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#A3481D]">
                LKR {stats.totalRevenue?.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                Gross transaction value
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Banknote className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* 4. Recent Seller Registrations Table (Matching Panel 8) */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden mb-8">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-stone-900 text-base">
                Recent Seller Registrations
              </h3>
              <p className="text-xs text-stone-400">
                Inspect artisan applications and grant marketplace selling permissions.
              </p>
            </div>
            <Link
              to="/admin/sellers"
              className="text-xs font-bold text-[#A3481D] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-[#FAF5EE] text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="p-4 pl-6">Artisan / Shop Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentSellers.map((s) => (
                  <tr key={s._id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-stone-900">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={s.logo || '/images/products/wooden_elephant.jpg'}
                          alt={s.shopName}
                          className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <span>{s.shopName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-stone-500">
                      {s.owner?.email || 'seller@example.com'}
                    </td>
                    <td className="p-4 text-stone-500">
                      {new Date(s.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          s.approvalStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.approvalStatus === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}
                      >
                        {s.approvalStatus}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      {s.approvalStatus === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApprove(s._id, s.shopName)}
                            className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-2xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(s._id, s.shopName)}
                            className="py-1 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] shadow-2xs"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-stone-400 text-[11px] italic">
                          Reviewed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
