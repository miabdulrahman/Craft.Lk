import React, { useState, useEffect } from 'react';
import { Store, MapPin, Phone, X } from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function AdminSellersPage() {
  const { showToast } = useToast();
  const [sellers, setSellers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const [rejectingShop, setRejectingShop] = useState(null);
  const [rejectReason, setRejectReason] = useState('Incomplete craft documentation');

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const url =
        filterStatus === 'all'
          ? '/admin/sellers'
          : `/admin/sellers?status=${filterStatus}`;
      const res = await api.get(url);
      if (res.data.success) {
        setSellers(res.data.applications);
      }
    } catch (err) {
      console.error('Error fetching sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [filterStatus]);

  const handleApprove = async (shopId, shopName) => {
    try {
      const res = await api.patch(`/admin/sellers/${shopId}/approve`);
      if (res.data.success) {
        showToast(`Approved "${shopName}"!`, 'success');
        fetchSellers();
      }
    } catch (err) {
      showToast(err.message || 'Failed to approve seller.', 'error');
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
        showToast(`Rejected "${rejectingShop.shopName}".`, 'info');
        setRejectingShop(null);
        fetchSellers();
      }
    } catch (err) {
      showToast(err.message || 'Failed to reject seller.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#A3481D] block mb-0.5">
              Vendor Verification
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Artisan Shop Approvals
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Review seller applications and authenticate heritage makers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#A3481D] text-white shadow-2xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 animate-pulse h-64" />
        ) : sellers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sellers.map((s) => (
              <div
                key={s._id}
                className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={s.logo || '/images/products/wooden_elephant.jpg'}
                        alt={s.shopName}
                        className="w-13 h-13 rounded-2xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <h3 className="font-extrabold text-stone-900 text-base">
                          {s.shopName}
                        </h3>
                        <p className="text-xs text-stone-500">
                          Applicant: {s.owner?.name} ({s.owner?.email})
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        s.approvalStatus === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.approvalStatus === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {s.approvalStatus}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 mb-3 leading-relaxed">
                    {s.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-stone-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#A3481D]" />
                      {s.city}, {s.district}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-[#A3481D]" />
                      {s.phone}
                    </span>
                  </div>

                  {s.rejectionReason && (
                    <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800">
                      Rejection Reason: {s.rejectionReason}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  {s.approvalStatus !== 'approved' && (
                    <button
                      onClick={() => handleApprove(s._id, s.shopName)}
                      className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs cursor-pointer"
                    >
                      Approve Studio
                    </button>
                  )}
                  {s.approvalStatus !== 'rejected' && (
                    <button
                      onClick={() => {
                        setRejectingShop(s);
                        setRejectReason('Incomplete craft documentation');
                      }}
                      className="py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs cursor-pointer"
                    >
                      Reject Application
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <Store className="h-12 w-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-bold text-stone-900 text-base mb-1">
              No seller applications found
            </h3>
            <p className="text-xs text-stone-500">
              New artisan shop registration submissions will be displayed here.
            </p>
          </div>
        )}

        {/* Reject Modal */}
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
