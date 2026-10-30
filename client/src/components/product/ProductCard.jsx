import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    showToast(`Added "${product.name}" to cart!`, 'success');
    setTimeout(() => setAdded(false), 1500);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !wishlist;
    setWishlist(next);
    showToast(
      next
        ? `Saved "${product.name}" to your wishlist!`
        : `Removed from wishlist`,
      'info'
    );
  };

  const sellerName =
    typeof product.seller === 'object'
      ? product.seller.shopName
      : 'Artisan Studio';

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : '/images/products/wooden_elephant.jpg';

  return (
    <div className="group craft-card bg-white rounded-2xl overflow-hidden border border-stone-200/90 flex flex-col justify-between">
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <Link to={`/products/${product._id}`}>
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </Link>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 ${
              wishlist
                ? 'bg-rose-50 text-rose-500 shadow-sm'
                : 'bg-white/80 text-stone-600 hover:bg-white hover:text-rose-500 shadow-xs'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-4 w-4 transition-transform duration-200 ${
                wishlist ? 'fill-rose-500 scale-110' : ''
              }`}
            />
          </button>

          {/* Out of Stock Pill if stock <= 0 */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center animate-fade-in">
              <span className="bg-white/95 text-stone-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
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
                className="w-full py-2.5 px-4 bg-[#A3481D] hover:bg-[#8B3B14] active:scale-98 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all shimmer-button"
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4 animate-scale" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" /> Add to Cart
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="truncate max-w-[130px] font-medium text-stone-600">
              {sellerName}
            </span>
            {/* Rating */}
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{product.rating || '4.8'}</span>
              <span className="text-stone-400 font-normal">({product.reviewCount || '10'})</span>
            </div>
          </div>

          <Link to={`/products/${product._id}`}>
            <h3 className="font-semibold text-stone-900 text-base leading-snug hover:text-[#A3481D] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Footer Price & Mobile Button */}
      <div className="p-4 pt-0 flex items-center justify-between mt-auto">
        <div>
          <span className="text-[11px] text-stone-400 font-medium block">Price</span>
          <span className="text-base font-extrabold text-[#A3481D]">
            LKR {product.price?.toLocaleString()}
          </span>
        </div>

        {/* Mobile-only visible quick add */}
        <div className="sm:hidden">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || added}
            className="p-2.5 bg-[#A3481D] active:scale-90 text-white rounded-full shadow-md transition-all"
            aria-label="Add to cart"
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
