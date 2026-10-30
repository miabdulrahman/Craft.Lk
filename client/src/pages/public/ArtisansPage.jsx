import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  MapPin,
  Star,
  ArrowRight,
  ShieldCheck,
  Search,
  X
} from 'lucide-react';
import api from '../../services/api';

export default function ArtisansPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

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

  const districts = [
    'All',
    ...Array.from(new Set(shops.map((s) => s.district).filter(Boolean)))
  ];

  const filteredShops = shops.filter((shop) => {
    const matchesDistrict =
      selectedDistrict === 'All' || shop.district === selectedDistrict;
    const matchesSearch =
      !searchTerm.trim() ||
      shop.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Header Banner */}
      <div className="bg-[#F5EFE6] heritage-pattern border-b border-stone-200/80 py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-amber-300/70 text-[#A3481D] text-xs font-extrabold mb-3 shadow-2xs">
            <Store className="h-3.5 w-3.5" />
            <span>Master Guilds & Studios</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
            Our Verified Artisan Partners
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
            Meet the authentic Sri Lankan makers, families, and village workshops keeping cultural craft traditions alive.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Search & District Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search artisan studio, village, or craft..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2.5 pl-10 pr-8 text-xs sm:text-sm"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-1 shrink-0">
              Region:
            </span>
            {districts.map((dist) => (
              <button
                key={dist}
                onClick={() => setSelectedDistrict(dist)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                  selectedDistrict === dist
                    ? 'bg-[#A3481D] text-white shadow-2xs'
                    : 'bg-[#FAF8F5] border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {dist}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-stone-200 h-72 animate-pulse"
              />
            ))}
          </div>
        ) : filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredShops.map((shop) => (
              <div
                key={shop._id}
                className="craft-card bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs flex flex-col justify-between"
              >
                {/* Banner */}
                <div className="h-32 bg-stone-900 relative">
                  <img
                    src={shop.banner || '/images/shop_banner.jpg'}
                    alt={shop.shopName}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-xs text-white text-[10px] font-bold">
                    <ShieldCheck className="h-3 w-3" /> Verified Studio
                  </span>
                  <div className="absolute -bottom-7 left-6">
                    <img
                      src={shop.logo || '/images/products/wooden_elephant.jpg'}
                      alt={shop.shopName}
                      className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="pt-10 p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-extrabold text-lg text-stone-900">
                        {shop.shopName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{shop.rating || '4.8'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-3 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-[#A3481D]" />
                      <span>
                        {shop.city}, {shop.district} District
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                      {shop.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {shop.craftCategories?.map((c, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF5EE] text-[#A3481D] border border-amber-200/50"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/artisans/${shop._id}`}
                    className="w-full py-3 px-4 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-center rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs shimmer-button"
                  >
                    <span>Explore Workshop</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <Store className="h-12 w-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-bold text-stone-800 text-base mb-1">
              No workshops matched your search
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Try selecting "All" regions or clearing your search filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDistrict('All');
              }}
              className="px-4 py-2 bg-[#A3481D] text-white text-xs font-bold rounded-xl"
            >
              Show All Artisans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
