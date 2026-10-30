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
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import ProductCard from '../../components/product/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#A3481D] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500">Loading authentic handicraft details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Product Not Found</h2>
        <p className="text-stone-500 text-sm mb-6">
          The requested craft item is no longer available or has been removed.
        </p>
        <Link
          to="/shop"
          className="inline-block py-2.5 px-6 bg-[#A3481D] text-white rounded-xl text-sm font-bold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

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
    const nextState = !wishlist;
    setWishlist(nextState);
    if (nextState) {
      showToast(`Saved "${product.name}" to your wishlist!`, 'success');
    } else {
      showToast(`Removed from your wishlist`, 'info');
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
      {/* 1. Breadcrumbs (Matching UI Reference Panel 3) */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center text-xs font-medium text-stone-500 space-x-2">
            <Link to="/" className="hover:text-[#A3481D] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-stone-400" />
            <Link
              to={`/shop?category=${categorySlug}`}
              className="hover:text-[#A3481D] transition-colors"
            >
              {categoryName}
            </Link>
            <ChevronRight className="h-3 w-3 text-stone-400" />
            <span className="text-stone-900 font-semibold truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Main Product Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Image Gallery (Panel 3) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-sm flex items-center justify-center group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              {/* Sold out watermark */}
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center">
                  <span className="bg-white text-stone-900 text-sm font-extrabold px-4 py-2 rounded-full uppercase tracking-wider">
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
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 hover:scale-105 ${
                      selectedImage === img
                        ? 'border-[#A3481D] shadow-md ring-2 ring-[#A3481D]/30 scale-102'
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

          {/* Right Column: Details & Purchase Actions (Panel 3) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
            {/* Title & Wishlist */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#A3481D] uppercase tracking-wider block mb-1">
                  {categoryName}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              <button
                onClick={handleToggleWishlist}
                className={`p-2.5 rounded-full border transition-all active:scale-90 hover:scale-110 ${
                  wishlist
                    ? 'bg-red-50 text-red-500 border-red-200 shadow-sm'
                    : 'border-stone-200 text-stone-600 hover:text-red-500 hover:bg-stone-50'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`h-5 w-5 ${wishlist ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Price & Rating */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <span className="text-xs text-stone-400 block font-medium">Price</span>
                <span className="text-3xl font-extrabold text-[#A3481D]">
                  LKR {product.price?.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200/60 text-amber-800 text-sm font-bold">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span>{product.rating || '4.7'}</span>
                <span className="text-stone-400 font-normal">
                  ({product.reviewCount || '8'} reviews)
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-2">
                About this piece
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed font-normal">
                {product.description}
              </p>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
              {product.stock > 0 ? (
                <span className="text-stone-700">
                  In Stock ({product.stock} items available)
                </span>
              ) : (
                <span className="text-red-600">Currently Out of Stock</span>
              )}
            </div>

            {/* Quantity Stepper & Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-stone-600">Quantity</span>
                  <div className="flex items-center border border-stone-200 rounded-xl bg-[#FAF8F5] overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2.5 hover:bg-stone-200 disabled:opacity-40 transition-colors"
                    >
                      <Minus className="h-4 w-4 text-stone-700" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={quantity >= product.stock}
                      className="p-2.5 hover:bg-stone-200 disabled:opacity-40 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-stone-700" />
                    </button>
                  </div>
                </div>

                {/* Primary & Buy Now Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={added}
                    className="py-3.5 px-6 bg-[#A3481D] hover:bg-[#8B3B14] active:scale-95 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200 shimmer-button cursor-pointer disabled:opacity-80"
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4 animate-bounce" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4 transition-transform group-hover:scale-110" /> Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3.5 px-6 border-2 border-[#A3481D] text-[#A3481D] hover:bg-[#A3481D] hover:text-white active:scale-95 text-sm font-bold rounded-xl transition-all duration-200 text-center shadow-xs hover:shadow-md cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Value Badges (Panel 3: Handmade, Eco Friendly, Local Seller) */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-stone-100 text-center">
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-stone-50">
                <Sparkles className="h-4 w-4 text-[#A3481D]" />
                <span className="text-[11px] font-bold text-stone-800">Handmade</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-stone-50">
                <Leaf className="h-4 w-4 text-emerald-600" />
                <span className="text-[11px] font-bold text-stone-800">Eco Friendly</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-stone-50">
                <Store className="h-4 w-4 text-amber-600" />
                <span className="text-[11px] font-bold text-stone-800">Local Seller</span>
              </div>
            </div>

            {/* Seller Info Card (Panel 3) */}
            {product.seller && (
              <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-amber-200/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.seller.logo || '/images/products/wooden_elephant.jpg'}
                    alt={product.seller.shopName}
                    className="w-12 h-12 rounded-full object-cover border border-amber-300"
                  />
                  <div>
                    <span className="text-[11px] text-stone-500 block font-medium">
                      Sold by
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {product.seller.shopName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      {product.seller.city}, {product.seller.district}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/artisans/${product.seller._id}`}
                  className="py-1.5 px-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 transition-colors shrink-0"
                >
                  View Shop
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 3. Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-extrabold text-stone-900 mb-6">
              You Might Also Like
            </h2>
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
