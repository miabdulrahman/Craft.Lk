import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, MapPin, Phone, Star, ShieldCheck, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/product/ProductCard';

export default function ArtisanDetailPage() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#A3481D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-800 mb-2">Artisan Shop Not Found</h2>
        <Link to="/artisans" className="text-xs font-bold text-[#A3481D]">
          ← Back to Artisan Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Banner */}
      <div className="h-56 sm:h-72 bg-stone-900 relative">
        <img
          src={shop.banner || '/images/shop_banner.jpg'}
          alt={shop.shopName}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
      </div>

      {/* Profile Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-10">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <img
              src={shop.logo || '/images/products/wooden_elephant.jpg'}
              alt={shop.shopName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-sm shrink-0 bg-stone-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {shop.shopName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified Maker</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5 text-[#A3481D]" />
                <span>
                  {shop.city}, {shop.district}, Sri Lanka
                </span>
                <span>•</span>
                <Phone className="h-3.5 w-3.5 text-[#A3481D]" />
                <span>{shop.phone}</span>
              </p>
              <p className="text-xs text-stone-600 mt-2 max-w-xl">
                {shop.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-6">
            <div className="text-center">
              <span className="text-xl font-extrabold text-stone-900 block">
                {products.length}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Products</span>
            </div>
            <div className="text-center">
              <span className="text-xl font-extrabold text-amber-600 flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                {shop.rating || '4.8'}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products from this workshop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-extrabold text-stone-900 mb-6">
          Creations by {shop.shopName}
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {products.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <p className="text-stone-500 text-sm">
              This artisan does not have active listings available at this moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
