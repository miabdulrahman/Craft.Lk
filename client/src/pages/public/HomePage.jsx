import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  HeartHandshake,
  Star,
  Store,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import CategoryPill from '../../components/product/CategoryPill';

const CATEGORY_ITEMS = [
  { name: 'All Products', shortName: 'All', slug: 'all' },
  { name: 'Batik', shortName: 'Batik', slug: 'batik' },
  { name: 'Jewellery', shortName: 'Jewellery', slug: 'jewellery' },
  { name: 'Pottery', shortName: 'Pottery', slug: 'pottery' },
  { name: 'Wooden Handicrafts', shortName: 'Wooden', slug: 'wooden-handicrafts' },
  { name: 'Woven Products', shortName: 'Woven', slug: 'woven-products' },
  { name: 'Decorative Items', shortName: 'Decor', slug: 'decorative-items' },
  { name: 'Gifts', shortName: 'Gifts', slug: 'gifts' }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredShops, setFeaturedShops] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch featured products from backend
        const prodRes = await api.get('/products?featured=true&limit=8');
        if (prodRes.data.success) {
          setFeaturedProducts(prodRes.data.products);
        }

        // Fetch approved shops
        const shopRes = await api.get('/shops/public');
        if (shopRes.data.success) {
          setFeaturedShops(shopRes.data.shops.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${slug}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section (Matching UI Reference Panel 1) */}
      <section className="relative bg-[#F5EFE6] overflow-hidden pt-8 pb-16 md:py-20 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-amber-300/60 text-[#A3481D] text-xs font-bold tracking-wide">
                <Sparkles className="h-3.5 w-3.5 fill-[#A3481D]" />
                <span>Sri Lanka's Premier Artisan Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-[1.1] tracking-tight">
                Handcrafted <br />
                <span className="text-[#A3481D]">with Love</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover unique Sri Lankan handicrafts, art and traditional products from local artisans. From intricate wood carvings and hand-dyed batiks to terracotta pottery.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#A3481D] hover:bg-[#8B3B14] active:scale-95 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm tracking-wide shimmer-button"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/artisans"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/90 hover:bg-white text-stone-800 font-semibold rounded-xl border border-stone-300 shadow-xs hover:shadow-md transition-all text-sm active:scale-95"
                >
                  <Store className="h-4 w-4 text-[#A3481D]" />
                  <span>Meet Artisans</span>
                </Link>
              </div>

              {/* Trust badges row */}
              <div className="pt-4 grid grid-cols-3 gap-2 border-t border-stone-300/60 text-left">
                <div className="p-2 rounded-xl hover:bg-white/40 transition-colors">
                  <p className="text-lg font-bold text-stone-900">100%</p>
                  <p className="text-xs text-stone-500">Handcrafted</p>
                </div>
                <div className="p-2 rounded-xl hover:bg-white/40 transition-colors">
                  <p className="text-lg font-bold text-stone-900">Direct</p>
                  <p className="text-xs text-stone-500">Artisan Support</p>
                </div>
                <div className="p-2 rounded-xl hover:bg-white/40 transition-colors">
                  <p className="text-lg font-bold text-stone-900">LKR</p>
                  <p className="text-xs text-stone-500">Transparent Pricing</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Imagery (matching reference panel 1) */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative glow orb behind image */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-amber-400/30 to-orange-500/30 rounded-3xl blur-2xl -z-10 animate-pulse-glow" />

                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-stone-100 aspect-16/10 group">
                  <img
                    src="/images/hero_crafts.jpg"
                    alt="Authentic Sri Lankan handicrafts: Carved wooden elephant, brass oil lamp, and terracotta pottery"
                    className="w-full h-full object-cover object-center transform group-hover:scale-104 transition-transform duration-700 ease-out"
                  />

                  {/* Floating Glassmorphism Badge */}
                  <div className="absolute top-4 left-4 glass-panel px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-float">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-stone-800">
                      Verified Sri Lankan Artisans
                    </span>
                  </div>

                    {/* Subtle caption overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent p-6 text-white">
                      <p className="text-xs font-semibold tracking-wider text-amber-300 uppercase">
                        Living Cultural Heritage
                      </p>
                      <p className="text-sm font-medium text-stone-200 mt-0.5">
                        Master woodcarving & brassware from traditional Sri Lankan craft guilds
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* 2. Category Quick Pills Row (Matching UI Reference Panel 1) */}
      <section className="py-8 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
            {CATEGORY_ITEMS.map((cat) => (
              <CategoryPill
                key={cat.slug}
                name={cat.name}
                shortName={cat.shortName}
                active={selectedCategory === cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Section (Matching UI Reference Panel 1) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Handpicked heritage crafts from verified Sri Lankan cottage creators.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#A3481D] hover:text-[#8B3B14] transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-stone-200/60 rounded-2xl aspect-square animate-pulse"
              />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300">
            <p className="text-stone-500 text-sm">No featured products available at this time.</p>
          </div>
        )}
      </section>

      {/* 4. Meet Our Artisans Showcase */}
      <section className="py-16 bg-[#FAF5EE] border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#A3481D] text-xs font-bold mb-3">
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Independent Craft Guilds</span>
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900">
              Meet the Artisans Behind the Crafts
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Every purchase directly sustains local artisans, their families, and ancient Sri Lankan craft traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredShops.map((shop) => (
              <div
                key={shop._id}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={shop.logo || '/images/products/wooden_elephant.jpg'}
                      alt={shop.shopName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-stone-100"
                    />
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">
                        {shop.shopName}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {shop.city}, {shop.district}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 font-semibold">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{shop.rating || '4.8'}</span>
                        <span className="text-stone-400">({shop.reviewCount || '15'} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                    {shop.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {shop.craftCategories?.map((c, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F5EFE6] text-[#A3481D]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/artisans/${shop._id}`}
                  className="w-full text-center py-2 px-4 border border-[#A3481D] text-[#A3481D] hover:bg-[#A3481D] hover:text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Visit Artisan Shop
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Cultural Craft CTA Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1917] rounded-3xl overflow-hidden shadow-xl text-white relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-12 lg:p-16 space-y-4">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                Join the Craft Community
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Are You a Sri Lankan Artisan or Small Business?
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed font-normal">
                Take your handmade creations online. Reach customers across the island with your own dedicated digital shopfront, simple product management, and zero technical hassle.
              </p>
              <div className="pt-2">
                <Link
                  to="/auth?tab=register&role=seller"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#A3481D] hover:bg-[#8B3B14] text-white font-bold text-sm rounded-xl transition-colors shadow-md"
                >
                  <span>Apply to Sell With Us</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="h-64 lg:h-full relative overflow-hidden">
              <img
                src="/images/artisan_potter.jpg"
                alt="Sri Lankan artisan at work"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
