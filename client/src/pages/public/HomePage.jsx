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
  ChevronRight,
  Award,
  Leaf,
  MapPin
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
        const [prodRes, shopRes] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/shops/public')
        ]);

        if (prodRes.data.success) {
          setFeaturedProducts(prodRes.data.products);
        }
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
      {/* 1. Hero Section */}
      <section className="relative bg-[#F5EFE6] heritage-pattern overflow-hidden pt-10 pb-16 md:py-22 border-b border-stone-200/70">
        {/* Ambient Decorative Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#A3481D]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Editorial Hero Text */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-amber-300/70 text-[#A3481D] text-xs font-extrabold tracking-wide shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 fill-[#A3481D]" />
                <span>Sri Lanka's Premier Artisan Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-[1.08] tracking-tight">
                Handcrafted <br />
                <span className="text-gradient-terracotta">with Heritage & Love</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover museum-grade Sri Lankan handicrafts, hand-dyed batiks, Ambalangoda masks, brassware, and terracotta pottery crafted directly by master island makers.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#A3481D] hover:bg-[#8B3B14] active:scale-95 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm tracking-wide shimmer-button"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/artisans"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/95 hover:bg-white text-stone-800 font-bold rounded-2xl border border-stone-300/90 shadow-xs hover:shadow-md transition-all text-sm active:scale-95"
                >
                  <Store className="h-4 w-4 text-[#A3481D]" />
                  <span>Meet Our Artisans</span>
                </Link>
              </div>

              {/* Trust metrics row */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-stone-300/60 text-left">
                <div className="p-3 rounded-2xl bg-white/60 backdrop-blur-xs border border-stone-200/60">
                  <p className="text-lg sm:text-xl font-extrabold text-stone-900">100%</p>
                  <p className="text-xs text-stone-500 font-medium">Authentic Handmade</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/60 backdrop-blur-xs border border-stone-200/60">
                  <p className="text-lg sm:text-xl font-extrabold text-[#A3481D]">Direct</p>
                  <p className="text-xs text-stone-500 font-medium">Artisan Earnings</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/60 backdrop-blur-xs border border-stone-200/60">
                  <p className="text-lg sm:text-xl font-extrabold text-stone-900">25 Districts</p>
                  <p className="text-xs text-stone-500 font-medium">Islandwide Delivery</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Imagery */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Decorative glow orb behind image */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-amber-400/35 to-[#A3481D]/30 rounded-3xl blur-2xl -z-10 animate-pulse-glow" />

                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-stone-100 aspect-16/11 group">
                  <img
                    src="/images/hero_crafts.jpg"
                    alt="Authentic Sri Lankan handicrafts: Carved wooden elephant, brass oil lamp, and terracotta pottery"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Floating Glassmorphism Badge Top Left */}
                  <div className="absolute top-4 left-4 glass-panel px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-float">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-extrabold text-stone-800">
                      Verified Sri Lankan Guilds
                    </span>
                  </div>

                  {/* Subtle caption overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-transparent p-6 text-white">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-extrabold tracking-widest text-amber-300 uppercase">
                          Living Cultural Heritage
                        </p>
                        <p className="text-sm font-medium text-stone-100 mt-0.5">
                          Master woodcarving, brassware & handloom from traditional craft villages
                        </p>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-amber-200 shrink-0">
                        ★ 4.9 Rated
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Quick Pills Row */}
      <section className="py-8 bg-white border-b border-stone-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
              Browse by Craft Tradition
            </span>
            <Link
              to="/categories"
              className="text-xs font-bold text-[#A3481D] hover:underline"
            >
              All Categories →
            </Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-between">
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

      {/* 3. Featured Products Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#A3481D] block mb-1">
              Curated Masterpieces
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Featured Handcrafted Creations
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Handpicked heritage crafts from verified Sri Lankan cottage creators.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF2EC] text-xs font-bold text-[#A3481D] hover:bg-[#A3481D] hover:text-white transition-all self-start sm:self-auto"
          >
            <span>View Full Catalog</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden p-3 space-y-3"
              >
                <div className="bg-stone-200/70 rounded-xl aspect-square animate-pulse" />
                <div className="h-3 bg-stone-200/70 rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-stone-200/70 rounded w-4/5 animate-pulse" />
                <div className="h-5 bg-stone-200/70 rounded w-1/3 animate-pulse" />
              </div>
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
      <section className="py-16 sm:py-20 bg-[#FAF5EE] border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 text-[#A3481D] text-xs font-extrabold mb-3">
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Independent Craft Guilds</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Meet the Artisans Behind the Crafts
            </h2>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              Every purchase directly sustains local artisans, their families, and ancient Sri Lankan craft traditions across Kandy, Ambalangoda, and Kelaniya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredShops.map((shop) => (
              <div
                key={shop._id}
                className="craft-card bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Mini Banner */}
                  <div className="h-24 bg-stone-900 relative overflow-hidden">
                    <img
                      src={shop.banner || '/images/shop_banner.jpg'}
                      alt={shop.shopName}
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Verified Guild
                    </span>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="flex items-end gap-3.5 -mt-8 mb-4 relative z-10">
                      <img
                        src={shop.logo || '/images/products/wooden_elephant.jpg'}
                        alt={shop.shopName}
                        className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white shrink-0"
                      />
                      <div className="pb-0.5">
                        <h3 className="font-extrabold text-stone-900 text-base leading-tight">
                          {shop.shopName}
                        </h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-[#A3481D]" />
                          <span>
                            {shop.city}, {shop.district}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3 text-xs text-amber-600 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{shop.rating || '4.8'}</span>
                      <span className="text-stone-400 font-normal">
                        ({shop.reviewCount || '18'} verified reviews)
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                      {shop.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {shop.craftCategories?.map((c, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5EFE6] text-[#A3481D]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <Link
                    to={`/artisans/${shop._id}`}
                    className="w-full text-center py-2.5 px-4 bg-[#FAF2EC] hover:bg-[#A3481D] text-[#A3481D] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Visit Artisan Workshop</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Cultural Craft CTA Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1917] rounded-3xl overflow-hidden shadow-2xl text-white relative border border-stone-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Empowering Rural Sri Lankan Makers</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Are You a Sri Lankan Artisan or Cottage Workshop?
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal max-w-xl">
                Take your handmade creations online. Reach customers across all 25 districts with your own dedicated digital storefront, simple inventory control, and direct order fulfillment.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/auth?tab=register&role=seller"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#A3481D] hover:bg-[#8B3B14] text-white font-bold text-sm rounded-xl transition-all shadow-lg shimmer-button"
                >
                  <span>Apply to Sell With Us</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-3.5 bg-stone-800/80 hover:bg-stone-800 text-stone-200 font-semibold text-sm rounded-xl border border-stone-700 transition-colors"
                >
                  <span>Learn How It Works</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 h-72 lg:h-full relative overflow-hidden">
              <img
                src="/images/artisan_potter.jpg"
                alt="Sri Lankan artisan at work"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1C1917] via-[#1C1917]/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
