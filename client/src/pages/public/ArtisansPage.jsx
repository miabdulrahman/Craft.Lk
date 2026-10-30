import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, MapPin, Star, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

export default function ArtisansPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const res = await api.get('/shops/public');
        if (res.data.success) {
          setShops(res.data.shops);
        }
      } catch (err) {
        console.error('Error fetching shops:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#A3481D] text-xs font-bold mb-3">
            <Store className="h-3.5 w-3.5" />
            <span>Master Guilds & Studios</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Our Artisan Partners
          </h1>
          <p className="text-sm text-stone-600 mt-2">
            Meet the authentic Sri Lankan makers, families, and workshops keeping cultural craft traditions alive.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-stone-200 h-64 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shops.map((shop) => (
              <div
                key={shop._id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Banner */}
                <div className="h-28 bg-stone-100 relative">
                  <img
                    src={shop.banner || '/images/shop_banner.jpg'}
                    alt={shop.shopName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute -bottom-6 left-6">
                    <img
                      src={shop.logo || '/images/products/wooden_elephant.jpg'}
                      alt={shop.shopName}
                      className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-sm bg-white"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="pt-8 p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-extrabold text-lg text-stone-900">
                        {shop.shopName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{shop.rating || '4.8'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-3">
                      <MapPin className="h-3.5 w-3.5 text-[#A3481D]" />
                      <span>
                        {shop.city}, {shop.district}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                      {shop.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {shop.craftCategories?.map((c, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF5EE] text-[#A3481D]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/artisans/${shop._id}`}
                    className="w-full py-2.5 px-4 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-center rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Visit Workshop</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
