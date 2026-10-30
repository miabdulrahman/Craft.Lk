import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Search,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight
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
    // Reset to page 1 on filter change
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
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

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* 1. Header Banner (Matching UI Reference Panel 2) */}
      <div className="relative bg-stone-900 text-white overflow-hidden py-14 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/images/shop_banner.jpg"
            alt="Craft workshop banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-2">
            Catalog & Discovery
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
            Our Products
          </h1>
          <p className="text-base text-stone-300 max-w-xl font-normal">
            Discover authentic Sri Lankan handicrafts, pottery, woven goods, and jewellery direct from master makers.
          </p>
        </div>
      </div>

      {/* 2. Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Filter (Desktop) */}
          <aside className="w-full lg:w-64 shrink-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-xl text-sm font-semibold text-stone-700 shadow-xs"
              >
                <Filter className="h-4 w-4" />
                <span>Filters & Categories</span>
              </button>
              <span className="text-xs text-stone-500 font-medium">
                {totalCount} products found
              </span>
            </div>

            <div
              className={`space-y-6 ${
                mobileFilterOpen ? 'block' : 'hidden lg:block'
              }`}
            >
              {/* Category Filter Box */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#A3481D]" />
                    <span>Categories</span>
                  </h3>
                </div>

                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => updateParam('category', cat.slug)}
                      className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                        activeCategory === cat.slug
                          ? 'bg-[#FAF2EC] text-[#A3481D] font-bold'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {activeCategory === cat.slug && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A3481D]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter Box */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
                <h3 className="font-bold text-stone-900 text-sm mb-3">
                  Price Range (LKR)
                </h3>
                <form onSubmit={handleApplyPriceFilter} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-stone-500 block mb-1">
                        Min (LKR)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#A3481D] focus:border-[#A3481D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-500 block mb-1">
                        Max (LKR)
                      </label>
                      <input
                        type="number"
                        placeholder="10000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#A3481D] focus:border-[#A3481D]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-[#A3481D] hover:bg-[#8B3B14] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                      Apply
                    </button>
                    {(minPrice || maxPrice || activeCategory !== 'all' || searchQuery) && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="p-2 border border-stone-300 hover:bg-stone-50 text-stone-600 rounded-lg text-xs"
                        title="Reset all filters"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Artisan Promise Card */}
              <div className="bg-gradient-to-br from-amber-50 to-[#FAF5EE] p-5 rounded-2xl border border-amber-200/60">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                  <Sparkles className="h-4 w-4 text-[#A3481D]" />
                  <span>Fair Trade Guarantee</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Every product listed on CraftLK is priced fairly by the artisans themselves.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="flex-1">
            {/* Top Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="text-xs text-stone-600 font-medium">
                {searchQuery ? (
                  <span>
                    Results for "<strong>{searchQuery}</strong>" (
                    {totalCount} items)
                  </span>
                ) : (
                  <span>
                    Showing <strong>{products.length}</strong> of{' '}
                    <strong>{totalCount}</strong> products
                  </span>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="bg-[#FAF8F5] border border-stone-200 rounded-lg py-1.5 px-3 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#A3481D]"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Additions</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-stone-200/60 rounded-2xl aspect-square animate-pulse"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 shadow-xs p-8">
                <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-1">
                  No products matched your search
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                  Try adjusting your category, price range, or search keywords to explore more crafts.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#A3481D] text-white text-xs font-bold rounded-xl"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => updateParam('page', currentPage - 1)}
                  className="p-2 border border-stone-300 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-stone-600"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => updateParam('page', pg)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      currentPage === pg
                        ? 'bg-[#A3481D] text-white'
                        : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => updateParam('page', currentPage + 1)}
                  className="p-2 border border-stone-300 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-stone-600"
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
