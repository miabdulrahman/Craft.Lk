import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Leaf,
  Store,
  ChevronRight,
  Check,
  Truck,
  Sparkles,
  Share2,
  MapPin,
  Award
} from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import ProductCard from '../../components/product/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('story');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/detail/${id}`);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          setSelectedImage(prod.images?.[0] || '/images/products/wooden_elephant.jpg');
          setRelatedProducts(res.data.relatedProducts || []);
          setQuantity(1);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[65vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-11 h-11 border-4 border-[#A3481D] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-stone-500">
            Loading authentic handicraft details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-extrabold text-stone-800 mb-2">
          Handicraft Not Found
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          The requested craft item is no longer available or has been removed.
        </p>
        <Link
          to="/shop"
          className="inline-block py-3 px-6 bg-[#A3481D] text-white rounded-xl text-sm font-bold shadow-sm"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    showToast(`Added ${quantity}x "${product.name}" to your cart!`, 'success');
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    showToast(`Proceeding to checkout with "${product.name}"`, 'info');
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
    const saved = toggleWishlist(product);
    showToast(
      saved
        ? `Saved "${product.name}" to your wishlist!`
        : `Removed from your wishlist`,
      saved ? 'success' : 'info'
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : ['/images/products/wooden_elephant.jpg'];

  const categoryName = product.category?.name || 'Handicrafts';
  const categorySlug = product.category?.slug || 'wooden-handicrafts';

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center text-xs font-semibold text-stone-500 space-x-2 overflow-x-auto scrollbar-none">
            <Link to="/" className="hover:text-[#A3481D] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-stone-400 shrink-0" />
            <Link to="/shop" className="hover:text-[#A3481D] transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-stone-400 shrink-0" />
            <Link
              to={`/shop?category=${categorySlug}`}
              className="hover:text-[#A3481D] transition-colors whitespace-nowrap"
            >
              {categoryName}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-stone-400 shrink-0" />
            <span className="text-stone-900 font-bold truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>

          <button
            onClick={handleShare}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#A3481D] transition-colors cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* 2. Main Product Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-28">
            {/* Primary Large Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-sm flex items-center justify-center group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {product.isFeatured && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500/95 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="h-3 w-3 fill-white" />
                  <span>Artisan Featured</span>
                </div>
              )}
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center">
                  <span className="bg-white text-stone-900 text-sm font-extrabold px-5 py-2 rounded-full uppercase tracking-wider shadow-lg">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery Underneath */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === img
                        ? 'border-[#A3481D] shadow-md ring-2 ring-[#A3481D]/25 scale-102'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Purchase Actions */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
            {/* Title & Wishlist */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link
                  to={`/shop?category=${categorySlug}`}
                  className="inline-block text-xs font-extrabold text-[#A3481D] uppercase tracking-wider mb-1.5 hover:underline"
                >
                  {categoryName}
                </Link>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 rounded-full border transition-all active:scale-90 cursor-pointer ${
                    wishlisted
                      ? 'bg-rose-50 text-rose-500 border-rose-200 shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:text-rose-500 hover:bg-stone-50'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`h-5 w-5 ${wishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Price & Rating */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-stone-100">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-bold">
                  Direct Artisan Price
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#A3481D]">
                  LKR {product.price?.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50/90 rounded-2xl border border-amber-200/70 text-amber-900 text-sm font-bold">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span>{product.rating || '4.8'}</span>
                <span className="text-stone-500 font-medium text-xs">
                  ({product.reviewCount || '14'} verified reviews)
                </span>
              </div>
            </div>

            {/* Tabbed Details (Story / Materials / Shipping) */}
            <div className="space-y-3">
              <div className="flex border-b border-stone-200 gap-6 text-xs font-bold">
                {[
                  { id: 'story', label: 'About This Piece' },
                  { id: 'care', label: 'Materials & Care' },
                  { id: 'shipping', label: 'Delivery & Guarantee' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-[#A3481D] text-[#A3481D]'
                        : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="pt-1 text-sm text-stone-600 leading-relaxed min-h-[72px]">
                {activeTab === 'story' && <p>{product.description}</p>}
                {activeTab === 'care' && (
                  <ul className="text-xs space-y-1.5 list-disc pl-4 text-stone-600">
                    <li>100% authentic natural Sri Lankan raw materials crafted by hand.</li>
                    <li>Keep away from prolonged direct moisture or harsh chemical cleaners.</li>
                    <li>Slight variations in grain, weave, or brushstroke are a hallmark of genuine artisan work.</li>
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <ul className="text-xs space-y-1.5 list-disc pl-4 text-stone-600">
                    <li>Islandwide courier delivery across all 25 Sri Lankan districts (Flat LKR 500 per workshop order).</li>
                    <li>Secure eco-friendly cushioning for fragile pottery, woodwork, and brassware.</li>
                    <li>Cash on Delivery (COD) and instant digital confirmation supported.</li>
                  </ul>
                )}
              </div>
            </div>

            {/* Stock status */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                {product.stock > 0 ? (
                  <span className="text-stone-800 font-bold">
                    In Stock & Ready to Ship ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold">Currently Out of Stock</span>
                )}
              </div>
              <span className="text-stone-400">Dispatched from Artisan Studio</span>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">
                    Quantity
                  </span>
                  <div className="flex items-center border border-stone-200 rounded-xl bg-[#FAF8F5] overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2.5 hover:bg-stone-200 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <Minus className="h-4 w-4 text-stone-700" />
                    </button>
                    <span className="w-12 text-center text-sm font-extrabold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={quantity >= product.stock}
                      className="p-2.5 hover:bg-stone-200 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4 text-stone-700" />
                    </button>
                  </div>
                  <span className="text-xs text-stone-400 font-medium">
                    Subtotal: <strong className="text-stone-700">LKR {(product.price * quantity).toLocaleString()}</strong>
                  </span>
                </div>

                {/* Primary & Buy Now Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={added}
                    className="py-4 px-6 bg-[#A3481D] hover:bg-[#8B3B14] active:scale-95 text-white text-sm font-bold rounded-2xl shadow-md hover:shadow-xl flex items-center justify-center gap-2 transition-all duration-200 shimmer-button cursor-pointer disabled:opacity-80"
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" /> Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-4 px-6 border-2 border-[#A3481D] text-[#A3481D] hover:bg-[#A3481D] hover:text-white active:scale-95 text-sm font-bold rounded-2xl transition-all duration-200 text-center shadow-2xs hover:shadow-md cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Value Badges */}
            <div className="grid grid-cols-3 gap-3 py-4 border-y border-stone-100 text-center">
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
                <Sparkles className="h-4 w-4 text-[#A3481D]" />
                <span className="text-[11px] font-bold text-stone-800">100% Handmade</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
                <Leaf className="h-4 w-4 text-emerald-600" />
                <span className="text-[11px] font-bold text-stone-800">Eco Sustainable</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
                <Award className="h-4 w-4 text-amber-600" />
                <span className="text-[11px] font-bold text-stone-800">Verified Guild</span>
              </div>
            </div>

            {/* Seller Info Card */}
            {product.seller && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EE] border border-amber-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={product.seller.logo || '/images/products/wooden_elephant.jpg'}
                    alt={product.seller.shopName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                  />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A3481D] block font-extrabold">
                      Crafted & Sold By
                    </span>
                    <h4 className="font-extrabold text-stone-900 text-sm sm:text-base">
                      {product.seller.shopName}
                    </h4>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-[#A3481D]" />
                      <span>
                        {product.seller.city}, {product.seller.district}
                      </span>
                    </p>
                  </div>
                </div>

                <Link
                  to={`/artisans/${product.seller._id}`}
                  className="py-2 px-4 bg-white hover:bg-[#A3481D] hover:text-white border border-stone-300 hover:border-[#A3481D] rounded-xl text-xs font-bold text-stone-800 transition-all shrink-0 shadow-2xs"
                >
                  Visit Workshop
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 3. Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-stone-200/80">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#A3481D] block mb-1">
                  More From This Tradition
                </span>
                <h2 className="text-2xl font-extrabold text-stone-900">
                  You Might Also Like
                </h2>
              </div>
              <Link
                to={`/shop?category=${categorySlug}`}
                className="text-xs font-bold text-[#A3481D] hover:underline"
              >
                Explore All {categoryName} →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
