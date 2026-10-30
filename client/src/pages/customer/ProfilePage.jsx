import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Check,
  AlertCircle,
  Package,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const SRI_LANKAN_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

export default function ProfilePage() {
  const { user, updateProfile, isSeller, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [district, setDistrict] = useState(user?.address?.district || 'Colombo');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      setSuccessMsg('');

      await updateProfile({
        name,
        phone,
        address: { street, city, district, postalCode }
      });

      setSuccessMsg('Profile and delivery address updated successfully!');
      showToast('Account settings saved!', 'success');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#A3481D] block">
              Account Preferences
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              My Profile & Address
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/my-orders"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:border-[#A3481D]"
            >
              <Package className="h-3.5 w-3.5 text-[#A3481D]" />
              <span>My Orders</span>
            </Link>
            {isSeller && (
              <Link
                to="/seller/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF2EC] text-xs font-bold text-[#A3481D]"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Seller Studio</span>
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF2EC] text-xs font-bold text-[#A3481D]"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
          {/* User Badge */}
          <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A3481D] to-amber-700 text-white flex items-center justify-center font-extrabold text-2xl uppercase shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900">{user?.name}</h2>
              <p className="text-xs text-stone-500">{user?.email}</p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold tracking-wider bg-amber-100 text-[#A3481D]">
                {user?.role} Account
              </span>
            </div>
          </div>

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07X XXX XXXX"
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-4">
              <p className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                Default Sri Lankan Delivery Address
              </p>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Street / House Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="No. 45, Temple Road"
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
                  >
                    {SRI_LANKAN_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10100"
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 shimmer-button cursor-pointer"
            >
              {saving ? 'Saving changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
