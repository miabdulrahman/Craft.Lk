import React, { useState } from 'react';
import { User, Phone, MapPin, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SRI_LANKAN_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

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

      setSuccessMsg('Profile updated successfully!');
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
        <h1 className="text-2xl font-extrabold text-stone-900 mb-6">
          Account Profile
        </h1>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
          {/* User Badge */}
          <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
            <div className="w-16 h-16 rounded-full bg-[#FAF2EC] text-[#A3481D] flex items-center justify-center font-bold text-xl uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">{user?.name}</h2>
              <p className="text-xs text-stone-500">{user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-800">
                {user?.role} Account
              </span>
            </div>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
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
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
              />
            </div>

            <div className="pt-2 border-t border-stone-100 space-y-4">
              <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Default Delivery Address
              </p>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street / House No"
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
                  >
                    {SRI_LANKAN_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
