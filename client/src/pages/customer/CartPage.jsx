import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Store,
  AlertCircle,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemCount,
    cartSubtotal,
    sellerGroups,
    isMultiVendor
  } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // If multi-vendor, user selects which seller to checkout first
  const [selectedSellerId, setSelectedSellerId] = useState(
    sellerGroups[0]?.sellerId || null
  );

  const activeGroup =
    sellerGroups.find((g) => g.sellerId === selectedSellerId) ||
    sellerGroups[0] ||
    null;

  const checkoutSubtotal =
    isMultiVendor && activeGroup ? activeGroup.subtotal : cartSubtotal;

  const checkoutShipping = 500;
  const checkoutTotal = checkoutSubtotal + checkoutShipping;

  const handleProceedToCheckout = () => {
    if (isMultiVendor && activeGroup) {
      navigate('/checkout', { state: { sellerId: activeGroup.sellerId } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F5] heritage-pattern p-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 text-center shadow-sm">
          <div className="w-18 h-18 bg-[#FAF2EC] text-[#A3481D] rounded-3xl flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="h-9 w-9" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mb-2">
            Your Shopping Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mb-7 leading-relaxed">
            Discover authentic Sri Lankan batiks, woodcarvings, brassware, and terracotta pottery crafted by island artisans.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 py-3.5 px-7 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm shimmer-button"
          >
            <span>Explore Crafts Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#A3481D] block mb-1">
              Artisan Basket
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Shopping Cart ({totalItemCount}{' '}
              {totalItemCount === 1 ? 'item' : 'items'})
            </h1>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-[#A3481D] hover:underline"
          >
            ← Continue Browsing Crafts
          </Link>
        </div>

        {/* Multi-Vendor Checkout Notice Banner */}
        {isMultiVendor && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 flex items-start gap-3.5 shadow-2xs">
            <AlertCircle className="h-5 w-5 text-[#A3481D] shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-extrabold text-sm mb-0.5 text-stone-900">
                Multi-Vendor Artisan Fulfillment
              </p>
              <p className="text-stone-700">
                Your cart includes creations from{' '}
                <strong>{sellerGroups.length} independent artisan workshops</strong>.
                Because each workshop packages and dispatches directly from their village studio, orders are checked out one workshop at a time. Select a workshop below to proceed.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-6">
            {sellerGroups.map((group) => {
              const isSelected =
                !isMultiVendor || activeGroup?.sellerId === group.sellerId;

              return (
                <div
                  key={group.sellerId}
                  className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                    isSelected
                      ? 'border-[#A3481D]/50 shadow-sm ring-2 ring-[#A3481D]/15'
                      : 'border-stone-200/80 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Seller Header */}
                  <div className="bg-[#FAF5EE] px-6 py-4 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-[#A3481D]">
                        <Store className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-extrabold text-stone-900 block">
                          {group.sellerName}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {group.items.length} handcrafted item(s) • Direct Studio Dispatch
                        </span>
                      </div>
                    </div>

                    {isMultiVendor && (
                      <button
                        onClick={() => setSelectedSellerId(group.sellerId)}
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#A3481D] text-white shadow-xs'
                            : 'bg-white border border-stone-300 text-stone-700 hover:border-[#A3481D]'
                        }`}
                      >
                        {isSelected ? '✓ Selected for Checkout' : 'Checkout This Studio'}
                      </button>
                    )}
                  </div>

                  {/* Items in this shop */}
                  <div className="divide-y divide-stone-100 p-4 sm:p-6">
                    {group.items.map((item) => (
                      <div
                        key={item.product._id}
                        className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        {/* Thumbnail & Info */}
                        <div className="flex items-center gap-4">
                          <Link
                            to={`/products/${item.product._id}`}
                            className="shrink-0 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100"
                          >
                            <img
                              src={
                                item.product.images?.[0] ||
                                '/images/products/wooden_elephant.jpg'
                              }
                              alt={item.product.name}
                              className="w-20 h-20 object-cover hover:scale-105 transition-transform"
                            />
                          </Link>
                          <div>
                            <Link
                              to={`/products/${item.product._id}`}
                              className="font-bold text-stone-900 text-sm sm:text-base hover:text-[#A3481D] transition-colors line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <span className="text-xs font-extrabold text-[#A3481D] block mt-0.5">
                              LKR {item.product.price?.toLocaleString()} each
                            </span>
                            <span className="text-[11px] text-stone-400 block mt-0.5">
                              Line Total:{' '}
                              <strong className="text-stone-700">
                                LKR {(item.product.price * item.quantity).toLocaleString()}
                              </strong>
                            </span>
                          </div>
                        </div>

                        {/* Quantity Stepper & Remove */}
                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="flex items-center border border-stone-200 rounded-xl bg-[#FAF8F5] overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(item.product._id, item.quantity - 1)
                              }
                              className="p-2 hover:bg-stone-200 transition-colors cursor-pointer"
                            >
                              <Minus className="h-3.5 w-3.5 text-stone-600" />
                            </button>
                            <span className="w-9 text-center text-xs font-extrabold text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product._id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.product.stock}
                              className="p-2 hover:bg-stone-200 disabled:opacity-40 transition-colors cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5 text-stone-600" />
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              removeFromCart(item.product._id);
                              showToast(`Removed "${item.product.name}" from cart`, 'info');
                            }}
                            className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end items-center pt-1">
              <button
                onClick={() => {
                  clearCart();
                  showToast('Cleared all items from cart', 'info');
                }}
                className="text-xs font-bold text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6 lg:sticky lg:top-28">
            <h2 className="text-lg font-extrabold text-stone-900 pb-3 border-b border-stone-100">
              Order Summary
            </h2>

            {isMultiVendor && activeGroup && (
              <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-amber-200/70 text-xs">
                <span className="text-stone-500 block font-medium">
                  Active Workshop Checkout:
                </span>
                <span className="font-extrabold text-[#A3481D] text-sm">
                  {activeGroup.sellerName}
                </span>
              </div>
            )}

            <div className="space-y-3 text-xs sm:text-sm text-stone-600">
              <div className="flex justify-between items-center">
                <span>Items Subtotal</span>
                <span className="font-bold text-stone-900">
                  LKR {checkoutSubtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Islandwide Courier Delivery</span>
                <span className="font-bold text-stone-900">
                  LKR {checkoutShipping.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-stone-100 pt-3.5 flex justify-between items-center text-base">
                <span className="font-extrabold text-stone-900">Total Amount</span>
                <span className="font-extrabold text-xl text-[#A3481D]">
                  LKR {checkoutTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center gap-2.5 text-xs text-stone-600">
              <Truck className="h-4 w-4 text-[#A3481D] shrink-0" />
              <span>Estimated Delivery: 2–4 business days islandwide</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 bg-[#A3481D] hover:bg-[#8B3B14] active:scale-95 text-white text-sm font-bold rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200 shimmer-button cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="pt-1 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Server-Verified Pricing • Direct Artisan Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
