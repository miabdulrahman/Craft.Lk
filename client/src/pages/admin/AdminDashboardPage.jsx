import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  ShoppingCart,
  Banknote,
  ShieldCheck,
  X
} from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    pendingSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [recentSellers, setRecentSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject Modal State
  const [rejectingShop, setRejectingShop] = useState(null);
  const [rejectReason, setRejectReason] = useState('Incomplete craft documentation');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentSellers(res.data.recentSellers);
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
        showToast(`Approved artisan studio "${shopName}"!`, 'success');
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Approval failed', 'error');
    }
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectingShop) return;
    try {
      const res = await api.patch(`/admin/sellers/${rejectingShop._id}/reject`, {
        reason: rejectReason
      });
      if (res.data.success) {
        showToast(`Rejected "${rejectingShop.shopName}"`, 'info');
        setRejectingShop(null);
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Rejection failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200/80 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#A3481D] block mb-0.5">
              Governance & Operations
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Platform Overview
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Marketplace supervision, artisan registrations, and transaction metrics.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-stone-200 shadow-2xs self-start sm:self-auto">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-[#A3481D] flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">{user?.name}</p>
              <span className="text-[10px] text-[#A3481D] font-extrabold uppercase tracking-wider">
                Platform Admin
              </span>
            </div>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="craft-card bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex items-center justify-between group">
            <div>
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block mb-1">
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

          <div className="craft-card bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex items-center justify-between group">
            <div>
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block mb-1">
                Total Sellers
              </span>
              <span className="text-3xl font-extrabold text-stone-900 group-hover:text-[#A3481D] transition-colors">
                {stats.totalSellers}
              </span>
              <span className="text-[11px] text-amber-700 font-bold block mt-1">
                {stats.pendingSellers} pending approvals
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#A3481D] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Store className="h-6 w-6" />
            </div>
          </div>

          <div className="craft-card bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex items-center justify-between group">
            <div>
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block mb-1">
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

          <div className="craft-card bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex items-center justify-between group">
            <div>
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block mb-1">
                Total Revenue
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#A3481D]">
                LKR {stats.totalRevenue?.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                Gross transaction value
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Banknote className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Recent Seller Registrations Table */}
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
              View All Applications →
            </Link>
          </div>

          {loading ? (
            <div className="p-8 h-48 animate-pulse bg-stone-50" />
          ) : (
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
                            className="w-9 h-9 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <span className="block">{s.shopName}</span>
                            <span className="text-[11px] text-stone-400 font-normal">
                              {s.city}, {s.district}
                            </span>
                          </div>
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
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${s.approvalStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.approvalStatus === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
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
                              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] shadow-2xs cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setRejectingShop(s);
                                setRejectReason('Incomplete craft documentation');
                              }}
                              className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-[11px] shadow-2xs cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-stone-400 text-[11px] font-medium">
                            Reviewed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reject Reason Modal */}
        {rejectingShop && (
          <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-stone-900 text-base">
                  Reject "{rejectingShop.shopName}"
                </h3>
                <button
                  onClick={() => setRejectingShop(null)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Reason for Rejection *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectingShop(null)}
                    className="py-2 px-4 border border-stone-300 rounded-xl font-bold text-stone-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
