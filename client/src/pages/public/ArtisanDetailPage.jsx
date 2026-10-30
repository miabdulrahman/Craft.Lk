import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Store,
  MapPin,
  Phone,
  Star,
  ShieldCheck,
  ArrowLeft,
  Search,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/product/ProductCard';

export default function ArtisanDetailPage() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/shops/public/${id}`);
        if (res.data.success) {
          setShop(res.data.shop);
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Error fetching artisan shop:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisan();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#A3481D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-extrabold text-stone-800 mb-2">
          Artisan Shop Not Found
        </h2>
        <Link
          to="/artisans"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A3481D] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Artisan Directory</span>
        </Link>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (p) =>
      !searchQuery.trim() ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Banner */}
      <div className="h-60 sm:h-76 bg-stone-900 relative overflow-hidden">
        <img
          src={shop.banner || '/images/shop_banner.jpg'}
          alt={shop.shopName}
          className="w-full h-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
        <div className="absolute top-6 left-4 sm:left-8">
          <Link
            to="/artisans"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900/75 hover:bg-stone-900 text-white text-xs font-bold backdrop-blur-md border border-white/15 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Artisans</span>
          </Link>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 mb-10">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={shop.logo || '/images/products/wooden_elephant.jpg'}
              alt={shop.shopName}
              className="w-22 h-22 sm:w-26 sm:h-26 rounded-3xl object-cover border-4 border-white shadow-md shrink-0 bg-stone-100"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {shop.shopName}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified Sri Lankan Maker</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#A3481D]" />
                  {shop.city}, {shop.district}, Sri Lanka
                </span>
                {shop.phone && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-[#A3481D]" />
                      {shop.phone}
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
                {shop.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t lg:border-t-0 lg:border-l border-stone-200 pt-4 lg:pt-0 lg:pl-8 shrink-0">
            <div className="text-center px-2">
              <span className="text-2xl font-extrabold text-stone-900 block">
                {products.length}
              </span>
              <span className="text-xs text-stone-500 font-semibold">
                Creations
              </span>
            </div>
            <div className="text-center px-2">
              <span className="text-2xl font-extrabold text-amber-600 flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                {shop.rating || '4.8'}
              </span>
              <span className="text-xs text-stone-500 font-semibold">
                Studio Rating
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products from this workshop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#A3481D] block">
              Direct From Studio
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              Handcrafted by {shop.shopName}
            </h2>
          </div>

          {products.length > 0 && (
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search in this workshop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl py-2 pl-9 pr-4 text-xs"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
            </div>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <p className="text-stone-500 text-sm">
              No matching creations found in this workshop.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
