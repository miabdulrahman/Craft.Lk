import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Search,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal
} from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/product/ProductCard';

const CATEGORIES = [
  { id: 'all', name: 'All Products', slug: 'all' },
  { id: 'batik', name: 'Batik', slug: 'batik' },
  { id: 'jewellery', name: 'Jewellery', slug: 'jewellery' },
  { id: 'pottery', name: 'Pottery', slug: 'pottery' },
  { id: 'wooden-handicrafts', name: 'Wooden Handicrafts', slug: 'wooden-handicrafts' },
  { id: 'woven-products', name: 'Woven Products', slug: 'woven-products' },
  { id: 'decorative-items', name: 'Decorative Items', slug: 'decorative-items' },
  { id: 'gifts', name: 'Gifts', slug: 'gifts' }
];

const PRICE_PRESETS = [
  { label: 'Under LKR 2,500', min: '', max: '2500' },
  { label: 'LKR 2,500 – 5,000', min: '2500', max: '5000' },
  { label: 'Above LKR 5,000', min: '5000', max: '' }
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter state synced with URL search params
  const activeCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'popularity';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';

  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setLocalSearch(searchQuery);
  }, [minPriceParam, maxPriceParam, searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (activeCategory && activeCategory !== 'all')
          params.append('category', activeCategory);
        if (minPriceParam) params.append('minPrice', minPriceParam);
        if (maxPriceParam) params.append('maxPrice', maxPriceParam);
        if (sortBy) params.append('sort', sortBy);
        params.append('page', currentPage);
        params.append('limit', '12');

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalCount(res.data.total);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, searchQuery, sortBy, currentPage, minPriceParam, maxPriceParam]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const handleLocalSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', localSearch.trim());
  };

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (minPrice) next.set('minPrice', minPrice);
    else next.delete('minPrice');

    if (maxPrice) next.set('maxPrice', maxPrice);
    else next.delete('maxPrice');

    next.delete('page');
    setSearchParams(next);
  };

  const applyPresetPrice = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    const next = new URLSearchParams(searchParams);
    if (min) next.set('minPrice', min);
    else next.delete('minPrice');
    if (max) next.set('maxPrice', max);
    else next.delete('maxPrice');
    next.delete('page');
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setLocalSearch('');
    setSearchParams({});
  };

  const hasActiveFilters =
    activeCategory !== 'all' ||
    Boolean(searchQuery) ||
    Boolean(minPriceParam) ||
    Boolean(maxPriceParam);

  const activeCategoryObj = CATEGORIES.find((c) => c.slug === activeCategory);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* 1. Header Banner */}
      <div className="relative bg-stone-900 text-white overflow-hidden py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/images/shop_banner.jpg"
            alt="Craft workshop banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/75 to-stone-950/30" />

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Authentic Island Catalog</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
              {activeCategory !== 'all' && activeCategoryObj
                ? activeCategoryObj.name
                : 'Handcrafted Marketplace'}
            </h1>
            <p className="text-sm sm:text-base text-stone-300 max-w-xl font-normal">
              Discover authentic Sri Lankan handicrafts, pottery, woven goods, and jewellery direct from master makers.
            </p>
          </div>

          {/* Inline Banner Search */}
          <form
            onSubmit={handleLocalSearchSubmit}
            className="w-full md:w-80 relative"
          >
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter catalog by keyword..."
              className="w-full bg-white/95 text-stone-900 placeholder-stone-400 rounded-2xl py-3 pl-10 pr-9 text-xs font-medium shadow-lg border border-white/20"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  updateParam('search', '');
                }}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* 2. Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Filter */}
          <aside className="w-full lg:w-64 shrink-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-800 shadow-2xs"
              >
                <SlidersHorizontal className="h-4 w-4 text-[#A3481D]" />
                <span>{mobileFilterOpen ? 'Hide Filters' : 'Filters & Categories'}</span>
              </button>
              <span className="text-xs text-stone-500 font-semibold">
                {totalCount} crafts found
              </span>
            </div>

            <div
              className={`space-y-6 ${
                mobileFilterOpen ? 'block' : 'hidden lg:block'
              }`}
            >
              {/* Category Filter Box */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
                  <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#A3481D]" />
                    <span>Craft Categories</span>
                  </h3>
                </div>

                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => updateParam('category', cat.slug)}
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                        activeCategory === cat.slug
                          ? 'bg-[#FAF2EC] text-[#A3481D] font-extrabold shadow-2xs'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {activeCategory === cat.slug && (
                        <span className="w-2 h-2 rounded-full bg-[#A3481D]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter Box */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
                <h3 className="font-extrabold text-stone-900 text-sm">
                  Price Range (LKR)
                </h3>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5">
                  {PRICE_PRESETS.map((preset, idx) => {
                    const isPresetActive =
                      minPriceParam === preset.min && maxPriceParam === preset.max;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyPresetPrice(preset.min, preset.max)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          isPresetActive
                            ? 'bg-[#FAF2EC] border-[#A3481D] text-[#A3481D] font-bold'
                            : 'bg-[#FAF8F5] border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleApplyPriceFilter} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                        Min (LKR)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                        Max (LKR)
                      </label>
                      <input
                        type="number"
                        placeholder="15000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#A3481D] hover:bg-[#8B3B14] text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                    >
                      Apply Price
                    </button>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="p-2.5 border border-stone-300 hover:bg-stone-50 text-stone-600 rounded-xl text-xs cursor-pointer"
                        title="Reset all filters"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Artisan Promise Card */}
              <div className="bg-gradient-to-br from-amber-50 to-[#FAF5EE] p-5 rounded-3xl border border-amber-200/70">
                <div className="flex items-center gap-2 text-[#A3481D] font-extrabold text-xs mb-1.5">
                  <Sparkles className="h-4 w-4 text-[#A3481D]" />
                  <span>Direct Fair Trade Guarantee</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Every creation on CraftLK is priced directly by the artisan studio that crafted it.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="flex-1">
            {/* Top Toolbar */}
            <div className="bg-white p-4 sm:px-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-medium">
                <span>
                  Showing <strong className="text-stone-900">{products.length}</strong> of{' '}
                  <strong className="text-stone-900">{totalCount}</strong> authentic crafts
                </span>

                {/* Active Filter Pills */}
                {activeCategory !== 'all' && (
                  <button
                    onClick={() => updateParam('category', 'all')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF2EC] text-[#A3481D] font-bold text-[11px] hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <span>{activeCategoryObj?.name || activeCategory}</span>
                    <X className="h-3 w-3" />
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => {
                      setLocalSearch('');
                      updateParam('search', '');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF2EC] text-[#A3481D] font-bold text-[11px] hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <span>"{searchQuery}"</span>
                    <X className="h-3 w-3" />
                  </button>
                )}
                {(minPriceParam || maxPriceParam) && (
                  <button
                    onClick={() => applyPresetPrice('', '')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF2EC] text-[#A3481D] font-bold text-[11px] hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <span>
                      LKR {minPriceParam || '0'} – {maxPriceParam || 'Any'}
                    </span>
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-xs text-stone-500 font-semibold whitespace-nowrap">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 px-3 text-xs font-bold text-stone-800 cursor-pointer"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-stone-200/80 p-3 space-y-3"
                  >
                    <div className="bg-stone-200/60 rounded-xl aspect-square animate-pulse" />
                    <div className="h-3 bg-stone-200/60 rounded w-1/2 animate-pulse" />
                    <div className="h-4 bg-stone-200/60 rounded w-3/4 animate-pulse" />
                    <div className="h-5 bg-stone-200/60 rounded w-1/3 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-xs p-8">
                <div className="w-16 h-16 bg-[#FAF2EC] text-[#A3481D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-extrabold text-stone-900 mb-1">
                  No handicrafts matched your filters
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6 leading-relaxed">
                  Try clearing your active category, price range, or search query to explore all Sri Lankan creations.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => updateParam('page', currentPage - 1)}
                  className="p-2.5 border border-stone-300 bg-white rounded-xl hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => updateParam('page', pg)}
                    className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      currentPage === pg
                        ? 'bg-[#A3481D] text-white shadow-sm'
                        : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => updateParam('page', currentPage + 1)}
                  className="p-2.5 border border-stone-300 bg-white rounded-xl hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
