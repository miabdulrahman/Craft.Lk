import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function ProductCard({ product }) {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);

  const wishlisted = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    showToast(`Added "${product.name}" to cart!`, 'success');
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggleWishlist(product);
    showToast(
      nowSaved
        ? `Saved "${product.name}" to your wishlist!`
        : `Removed "${product.name}" from wishlist`,
      nowSaved ? 'success' : 'info'
    );
  };

  const sellerName =
    typeof product.seller === 'object' && product.seller?.shopName
      ? product.seller.shopName
      : 'Verified Artisan';

  const categoryName =
    typeof product.category === 'object' && product.category?.name
      ? product.category.name
      : null;

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : '/images/products/wooden_elephant.jpg';

  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group craft-card bg-white rounded-2xl overflow-hidden border border-stone-200/90 flex flex-col justify-between">
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <Link to={`/products/${product._id}`} className="block w-full h-full">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Subtle warm dark gradient on hover for button legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </Link>

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/95 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                <Sparkles className="h-2.5 w-2.5 fill-white" />
                <span>Featured</span>
              </span>
            )}
            {isLowStock && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold shadow-sm">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 cursor-pointer ${
              wishlisted
                ? 'bg-rose-50 text-rose-500 shadow-sm ring-1 ring-rose-200'
                : 'bg-white/85 text-stone-600 hover:bg-white hover:text-rose-500 shadow-xs'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-4 w-4 transition-transform duration-200 ${
                wishlisted ? 'fill-rose-500 scale-110' : ''
              }`}
            />
          </button>

          {/* Out of Stock Overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center animate-fade-in">
              <span className="bg-white/95 text-stone-900 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                Sold Out
              </span>
            </div>
          )}

          {/* Quick Add To Cart on Hover (Desktop) */}
          {product.stock > 0 && (
            <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hidden sm:block">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className="w-full py-2.5 px-4 bg-[#A3481D] hover:bg-[#8B3B14] active:scale-98 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all shimmer-button cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" /> Quick Add to Cart
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="truncate max-w-[140px] font-semibold text-stone-500">
              {sellerName}
            </span>
            {/* Rating */}
            <div className="flex items-center gap-1 text-amber-600 font-bold shrink-0">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{product.rating || '4.8'}</span>
              <span className="text-stone-400 font-normal text-[11px]">
                ({product.reviewCount || '12'})
              </span>
            </div>
          </div>

          <Link to={`/products/${product._id}`}>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug group-hover:text-[#A3481D] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {categoryName && (
            <span className="inline-block text-[11px] font-medium text-stone-400 mt-0.5">
              {categoryName}
            </span>
          )}
        </div>
      </div>

      {/* Footer Price & Mobile Button */}
      <div className="px-4 pb-4 pt-1 flex items-center justify-between mt-auto border-t border-stone-100/80">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
            Price
          </span>
          <span className="text-base sm:text-lg font-extrabold text-[#A3481D]">
            LKR {product.price?.toLocaleString()}
          </span>
        </div>

        {/* Mobile-only visible quick add */}
        <div className="sm:hidden">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || added}
            className="p-2.5 bg-[#A3481D] active:scale-90 text-white rounded-xl shadow-sm transition-all disabled:opacity-40"
            aria-label="Add to cart"
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
