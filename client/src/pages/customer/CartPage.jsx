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
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemCount,
    cartSubtotal,
    shippingFee,
    cartTotal,
    sellerGroups,
    isMultiVendor
  } = useCart();
  const navigate = useNavigate();

  // If multi-vendor, user selects which seller to checkout first
  const [selectedSellerId, setSelectedSellerId] = useState(
    sellerGroups[0]?.sellerId || null
  );

  const activeGroup =
    sellerGroups.find((g) => g.sellerId === selectedSellerId) ||
    sellerGroups[0] ||
    null;

  const checkoutSubtotal = isMultiVendor && activeGroup
    ? activeGroup.subtotal
    : cartSubtotal;

  const checkoutShipping = 500;
  const checkoutTotal = checkoutSubtotal + checkoutShipping;

  const handleProceedToCheckout = () => {
    // If multi-vendor, pass selected seller in navigation state
    if (isMultiVendor && activeGroup) {
      navigate('/checkout', { state: { sellerId: activeGroup.sellerId } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F5] p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 text-center shadow-xs">
          <div className="w-16 h-16 bg-[#FAF2EC] text-[#A3481D] rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-extrabold text-stone-900 mb-2">
            Your Shopping Cart is Empty
          </h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            Looks like you haven't added any authentic Sri Lankan artisan crafts yet.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 py-3 px-6 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            <span>Explore Crafts Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-8">
          Shopping Cart ({totalItemCount})
        </h1>

        {/* Multi-Vendor Checkout Notice Banner */}
        {isMultiVendor && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-sm mb-0.5">
                Multi-Vendor Marketplace Order Rule
              </p>
              <p className="text-amber-800">
                You have items from {sellerGroups.length} different artisan workshops in your cart. Each artisan packages and delivers their own handcrafted goods, so checkouts are processed one seller at a time. Please select which workshop's items you would like to proceed with.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List (Panel 4) */}
          <div className="lg:col-span-8 space-y-6">
            {sellerGroups.map((group) => {
              const isSelected =
                !isMultiVendor || selectedSellerId === group.sellerId;

              return (
                <div
                  key={group.sellerId}
                  className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                    isSelected
                      ? 'border-[#A3481D]/40 shadow-sm ring-1 ring-[#A3481D]/20'
                      : 'border-stone-200/80 opacity-80'
                  }`}
                >
                  {/* Seller Header */}
                  <div className="bg-[#FAF5EE] px-6 py-3.5 border-b border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-[#A3481D]" />
                      <span className="text-xs font-bold text-stone-800">
                        {group.sellerName}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        ({group.items.length} items)
                      </span>
                    </div>

                    {isMultiVendor && (
                      <button
                        onClick={() => setSelectedSellerId(group.sellerId)}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                          isSelected
                            ? 'bg-[#A3481D] text-white'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        {isSelected ? 'Selected for Checkout' : 'Select This Artisan'}
                      </button>
                    )}
                  </div>

                  {/* Items in this shop */}
                  <div className="divide-y divide-stone-100 p-4 sm:p-6 space-y-4 sm:space-y-0">
                    {group.items.map((item) => (
                      <div
                        key={item.product._id}
                        className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        {/* Thumbnail & Info */}
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              item.product.images?.[0] ||
                              '/images/products/wooden_elephant.jpg'
                            }
                            alt={item.product.name}
                            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                          />
                          <div>
                            <Link
                              to={`/products/${item.product._id}`}
                              className="font-bold text-stone-900 text-sm sm:text-base hover:text-[#A3481D] transition-colors line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <span className="text-xs font-extrabold text-[#A3481D] block mt-0.5">
                              LKR {item.product.price?.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-stone-400 block mt-0.5">
                              Stock: {item.product.stock} available
                            </span>
                          </div>
                        </div>

                        {/* Quantity Stepper & Remove */}
                        <div className="flex items-center gap-4 self-end sm:self-center">
                          <div className="flex items-center border border-stone-200 rounded-xl bg-[#FAF8F5]">
                            <button
                              onClick={() =>
                                updateQuantity(item.product._id, item.quantity - 1)
                              }
                              className="p-1.5 hover:bg-stone-200 transition-colors"
                            >
                              <Minus className="h-3.5 w-3.5 text-stone-600" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product._id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.product.stock}
                              className="p-1.5 hover:bg-stone-200 disabled:opacity-40 transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5 text-stone-600" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product._id)}
                            className="p-2 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
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

            <div className="flex justify-between items-center pt-2">
              <Link
                to="/shop"
                className="text-xs font-bold text-[#A3481D] hover:underline"
              >
                ← Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-stone-400 hover:text-stone-600"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary (Panel 4) */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
            <h2 className="text-lg font-extrabold text-stone-900 pb-3 border-b border-stone-100">
              Order Summary
            </h2>

            {isMultiVendor && activeGroup && (
              <div className="p-3 rounded-xl bg-[#FAF5EE] border border-amber-200/60 text-xs">
                <span className="text-stone-500 block">Checking out with:</span>
                <span className="font-bold text-stone-800">
                  {activeGroup.sellerName}
                </span>
              </div>
            )}

            <div className="space-y-3 text-sm text-stone-600">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">
                  LKR {checkoutSubtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Standard Delivery (Islandwide)</span>
                <span className="font-bold text-stone-900">
                  LKR {checkoutShipping.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-base">
                <span className="font-bold text-stone-900">Total</span>
                <span className="font-extrabold text-xl text-[#A3481D]">
                  LKR {checkoutTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-[#A3481D] hover:bg-[#8B3B14] active:scale-95 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200 shimmer-button cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="pt-2 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Safe & Secure Checkout • Direct Artisan Fulfillment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
