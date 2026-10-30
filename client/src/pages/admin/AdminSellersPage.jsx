import React, { useState, useEffect } from 'react';
import { Store, CheckCircle, XCircle, Clock, MapPin, Phone } from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import api from '../../services/api';

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

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
        setMsg(`Approved "${shopName}"!`);
        setTimeout(() => setMsg(''), 3000);
        fetchSellers();
      }
    } catch (err) {
      alert(err.message || 'Failed to approve seller.');
    }
  };

  const handleReject = async (shopId, shopName) => {
    const reason = prompt(`Enter rejection reason for "${shopName}":`, 'Incomplete craft documentation');
    if (!reason) return;

    try {
      const res = await api.patch(`/admin/sellers/${shopId}/reject`, { reason });
      if (res.data.success) {
        setMsg(`Rejected "${shopName}".`);
        setTimeout(() => setMsg(''), 3000);
        fetchSellers();
      }
    } catch (err) {
      alert(err.message || 'Failed to reject seller.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200 gap-4">
          <div>
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
                className={`py-1.5 px-3 rounded-xl text-xs font-bold capitalize transition-colors ${
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

        {msg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{msg}</span>
          </div>
        )}

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
                    <div className="flex items-center gap-3">
                      <img
                        src={s.logo || '/images/products/wooden_elephant.jpg'}
                        alt={s.shopName}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-stone-900 text-base">
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

                  <div className="flex items-center gap-4 text-xs text-stone-500">
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
                    <div className="mt-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800">
                      Reason: {s.rejectionReason}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  {s.approvalStatus !== 'approved' && (
                    <button
                      onClick={() => handleApprove(s._id, s.shopName)}
                      className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
                    >
                      Approve Shop
                    </button>
                  )}
                  {s.approvalStatus !== 'rejected' && (
                    <button
                      onClick={() => handleReject(s._id, s.shopName)}
                      className="py-1.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
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
      </main>
    </div>
  );
}
