import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle,
  Truck,
  CreditCard,
  Banknote,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Package,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const SRI_LANKAN_DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle'
];

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, sellerGroups, isMultiVendor, clearSellerItems, clearCart } = useCart();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Selected seller if multi-vendor
  const targetSellerId = location.state?.sellerId || sellerGroups[0]?.sellerId;
  const activeGroup =
    sellerGroups.find((g) => g.sellerId === targetSellerId) ||
    sellerGroups[0] ||
    null;

  const checkoutItems = isMultiVendor && activeGroup
    ? activeGroup.items
    : items;

  const [step, setStep] = useState(1); // 1 = Shipping, 2 = Payment, 3 = Confirmation

  const [shippingData, setShippingData] = useState({
    fullName: user?.name || 'Abdul Rahman',
    phone: user?.phone || '071 234 5678',
    address: user?.address?.street || 'No 123, Main Street',
    city: user?.address?.city || 'Colombo',
    district: user?.address?.district || 'Colombo',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'simulated'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (checkoutItems.length === 0 && step !== 3) {
      navigate('/cart');
    }
  }, [checkoutItems, step, navigate]);

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = 500;
  const total = subtotal + shippingFee;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingData.fullName || !shippingData.phone || !shippingData.address || !shippingData.city) {
      setError('Please fill in all required delivery fields.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const orderPayload = {
        items: checkoutItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress: shippingData,
        paymentMethod
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        setCreatedOrder(res.data.order);
        // Clear items that were just checked out
        if (isMultiVendor && activeGroup) {
          clearSellerItems(activeGroup.sellerId);
        } else {
          clearCart();
        }
        showToast(`🎉 Order ${res.data.order.orderNumber} placed successfully!`, 'success');
        setStep(3);
      }
    } catch (err) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stepper Navigation (Matching Panel 5) */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold">
            {/* Step 1 */}
            <div
              className={`flex items-center gap-2 ${
                step >= 1 ? 'text-[#A3481D]' : 'text-stone-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step > 1
                    ? 'bg-emerald-600 text-white'
                    : step === 1
                    ? 'bg-[#A3481D] text-white'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {step > 1 ? '✓' : '1'}
              </div>
              <span>Shipping</span>
            </div>

            <div className="w-8 sm:w-16 h-0.5 bg-stone-300" />

            {/* Step 2 */}
            <div
              className={`flex items-center gap-2 ${
                step >= 2 ? 'text-[#A3481D]' : 'text-stone-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step > 2
                    ? 'bg-emerald-600 text-white'
                    : step === 2
                    ? 'bg-[#A3481D] text-white'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {step > 2 ? '✓' : '2'}
              </div>
              <span>Payment</span>
            </div>

            <div className="w-8 sm:w-16 h-0.5 bg-stone-300" />

            {/* Step 3 */}
            <div
              className={`flex items-center gap-2 ${
                step === 3 ? 'text-[#A3481D]' : 'text-stone-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 3
                    ? 'bg-[#A3481D] text-white'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                3
              </div>
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1 & 2: Form + Order Summary Layout */}
        {step < 3 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Form Area */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs">
              {step === 1 ? (
                /* Step 1: Shipping Form (Panel 5) */
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <h2 className="text-xl font-extrabold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                    Shipping Information
                  </h2>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingData.fullName}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, fullName: e.target.value })
                      }
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={shippingData.phone}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, phone: e.target.value })
                      }
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingData.address}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, address: e.target.value })
                      }
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingData.city}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, city: e.target.value })
                        }
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        District *
                      </label>
                      <select
                        value={shippingData.district}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, district: e.target.value })
                        }
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
                      >
                        {SRI_LANKAN_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Delivery Notes / Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Please leave package at front gate"
                      value={shippingData.notes}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, notes: e.target.value })
                      }
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#A3481D]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-sm font-bold rounded-xl shadow-md transition-colors mt-4"
                  >
                    Continue to Payment
                  </button>
                </form>
              ) : (
                /* Step 2: Payment Method */
                <div className="space-y-6">
                  <h2 className="text-xl font-extrabold text-stone-900 pb-2 border-b border-stone-100">
                    Select Payment Method
                  </h2>

                  {/* COD Option */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#A3481D] bg-[#FAF5EE]'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-[#A3481D] focus:ring-[#A3481D]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Banknote className="h-5 w-5 text-[#A3481D]" />
                        <span className="font-bold text-sm text-stone-900">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Pay with cash directly to the courier when your handicraft parcel arrives at your doorstep.
                      </p>
                    </div>
                  </label>

                  {/* Simulated Payment Option */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'simulated'
                        ? 'border-[#A3481D] bg-[#FAF5EE]'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="simulated"
                      checked={paymentMethod === 'simulated'}
                      onChange={() => setPaymentMethod('simulated')}
                      className="mt-1 text-[#A3481D] focus:ring-[#A3481D]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-5 w-5 text-[#A3481D]" />
                        <span className="font-bold text-sm text-stone-900">
                          Simulated Online Payment (Academic Demo)
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Demonstrate instant digital order confirmation. No real financial credentials or card details are charged.
                      </p>
                    </div>
                  </label>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-3 px-5 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50"
                    >
                      ← Back to Shipping
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handlePlaceOrder}
                      className="flex-1 py-3.5 bg-[#A3481D] hover:bg-[#8B3B14] active:scale-95 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shimmer-button cursor-pointer"
                    >
                      {loading ? (
                        <span>Processing Order...</span>
                      ) : (
                        <span>Confirm & Place Order (LKR {total.toLocaleString()})</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary (Panel 5) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
              <h3 className="font-extrabold text-stone-900 text-base pb-3 border-b border-stone-100">
                Order Summary
              </h3>

              {/* Items List Mini */}
              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1 space-y-3">
                {checkoutItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item.product.images?.[0] ||
                          '/images/products/wooden_elephant.jpg'
                        }
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-stone-800 line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-stone-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900 shrink-0">
                      LKR {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtotals */}
              <div className="space-y-2.5 pt-3 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">
                    LKR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-bold text-stone-900">
                    LKR {shippingFee.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-sm">
                  <span className="font-bold text-stone-900">Total</span>
                  <span className="font-extrabold text-lg text-[#A3481D]">
                    LKR {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Step 3: Order Confirmation Screen */
          <div className="max-w-xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Order Accepted
              </span>
              <h2 className="text-2xl font-extrabold text-stone-900 mt-3 mb-1">
                Thank You for Your Order!
              </h2>
              <p className="text-xs text-stone-500">
                Your authentic craft order has been safely sent to the artisan.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 text-left text-xs space-y-2">
              <div className="flex justify-between pb-2 border-b border-stone-200/80 font-semibold">
                <span className="text-stone-500">Order Reference</span>
                <span className="font-extrabold text-[#A3481D] text-sm">
                  {createdOrder?.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Recipient</span>
                <span className="font-bold text-stone-800">
                  {createdOrder?.shippingAddress?.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery Address</span>
                <span className="font-medium text-stone-800 text-right">
                  {createdOrder?.shippingAddress?.address},{' '}
                  {createdOrder?.shippingAddress?.city},{' '}
                  {createdOrder?.shippingAddress?.district}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Method</span>
                <span className="font-bold uppercase text-stone-800">
                  {createdOrder?.paymentMethod === 'cod'
                    ? 'Cash on Delivery'
                    : 'Simulated Card Payment'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-sm">
                <span>Total Amount</span>
                <span className="text-[#A3481D]">
                  LKR {createdOrder?.total?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/my-orders"
                className="flex-1 py-3 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Track in My Orders
              </Link>
              <Link
                to="/shop"
                className="flex-1 py-3 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
