import React, { useState, useEffect } from 'react';
import { Store, Phone, MapPin, Upload, Check, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import SellerSidebar from '../../components/dashboard/SellerSidebar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const SRI_LANKAN_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

export default function SellerShopProfilePage() {
  const { shop, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [shopName, setShopName] = useState(shop?.shopName || '');
  const [description, setDescription] = useState(shop?.description || '');
  const [phone, setPhone] = useState(shop?.phone || '');
  const [district, setDistrict] = useState(shop?.district || 'Colombo');
  const [city, setCity] = useState(shop?.city || 'Colombo');
  const [logo, setLogo] = useState(shop?.logo || '/images/products/wooden_elephant.jpg');
  const [banner, setBanner] = useState(shop?.banner || '/images/shop_banner.jpg');

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (shop) {
      setShopName(shop.shopName || '');
      setDescription(shop.description || '');
      setPhone(shop.phone || '');
      setDistrict(shop.district || 'Colombo');
      setCity(shop.city || 'Colombo');
      setLogo(shop.logo || '/images/products/wooden_elephant.jpg');
      setBanner(shop.banner || '/images/shop_banner.jpg');
    }
  }, [shop]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setMsg('');

      const res = await api.patch('/shops/me', {
        shopName,
        description,
        phone,
        district,
        city,
        logo,
        banner
      });

      if (res.data.success) {
        setMsg('Artisan shop details updated successfully in database!');
        showToast('Shop profile and Cloudinary images updated!', 'success');
        await refreshUser();
      }
    } catch (err) {
      setError(err.message || 'Failed to update shop.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload?folder=shops', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setLogo(res.data.url);
        showToast('Logo uploaded to Cloudinary as WebP successfully!', 'success');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload image to Cloudinary');
      showToast('Cloudinary upload failed: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingBanner(true);
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload?folder=shops', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setBanner(res.data.url);
        showToast('Banner uploaded to Cloudinary as WebP successfully!', 'success');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload banner to Cloudinary');
      showToast('Cloudinary upload failed: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setUploadingBanner(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <SellerSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-4xl overflow-y-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-6">
          Shop Profile & Branding
        </h1>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
          {msg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{msg}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            {/* Logo & Banner preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-100">
              {/* Studio Logo */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80">
                <img
                  src={logo}
                  alt="Shop Logo"
                  className="w-16 h-16 rounded-2xl object-cover border border-stone-200 bg-stone-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-stone-800">
                      Studio Logo
                    </span>
                    {logo.includes('cloudinary') && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Cloudinary WebP
                      </span>
                    )}
                  </div>
                  <label className="cursor-pointer py-1.5 px-3 border border-stone-300 rounded-lg hover:bg-stone-50 font-semibold text-stone-700 inline-flex items-center gap-1.5 active:scale-95 transition-all">
                    {uploadingLogo ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#A3481D]" />
                        <span>Uploading WebP...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5 text-[#A3481D]" />
                        <span>Change Logo</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingLogo}
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Studio Banner */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80">
                <img
                  src={banner}
                  alt="Shop Banner"
                  className="w-20 h-16 rounded-2xl object-cover border border-stone-200 bg-stone-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-stone-800">
                      Studio Banner
                    </span>
                    {banner.includes('cloudinary') && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Cloudinary WebP
                      </span>
                    )}
                  </div>
                  <label className="cursor-pointer py-1.5 px-3 border border-stone-300 rounded-lg hover:bg-stone-50 font-semibold text-stone-700 inline-flex items-center gap-1.5 active:scale-95 transition-all">
                    {uploadingBanner ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#A3481D]" />
                        <span>Uploading WebP...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5 text-[#A3481D]" />
                        <span>Change Banner</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingBanner}
                      onChange={handleBannerUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Shop Name *
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  District *
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

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                City / Village *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Shop Bio / Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="py-3 px-6 bg-[#A3481D] hover:bg-[#8B3B14] text-white font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile Details'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
