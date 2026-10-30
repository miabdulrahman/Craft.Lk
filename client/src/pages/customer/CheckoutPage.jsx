import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle,
  Truck,
  CreditCard,
  Banknote,
  ShieldCheck,
  AlertCircle,
  Package,
  Printer,
  Lock
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        if (isMultiVendor && activeGroup) {
          clearSellerItems(activeGroup.sellerId);
        } else {
          clearCart();
        }
        showToast(`Order ${res.data.order.orderNumber} placed successfully!`, 'success');
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {/* Stepper Navigation */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            {[
              { num: 1, label: 'Delivery Info' },
              { num: 2, label: 'Payment Method' },
              { num: 3, label: 'Order Confirmed' }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col sm:flex-row items-center gap-2 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs transition-all shadow-xs ${
                      step > s.num
                        ? 'bg-emerald-600 text-white'
                        : step === s.num
                        ? 'bg-[#A3481D] text-white ring-4 ring-[#A3481D]/20'
                        : 'bg-white border border-stone-300 text-stone-400'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span
                    className={`text-xs font-extrabold ${
                      step >= s.num ? 'text-stone-900' : 'text-stone-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 transition-colors ${
                      step > s.num ? 'bg-emerald-500' : 'bg-stone-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
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
                /* Step 1: Shipping Form */
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="pb-3 border-b border-stone-100">
                    <h2 className="text-xl font-extrabold text-stone-900">
                      Delivery Information
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Where should the artisan workshop dispatch your parcel?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Recipient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingData.fullName}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, fullName: e.target.value })
                        }
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Contact Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingData.phone}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, phone: e.target.value })
                        }
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Street / House Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingData.address}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, address: e.target.value })
                      }
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
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
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Sri Lankan District *
                      </label>
                      <select
                        value={shippingData.district}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, district: e.target.value })
                        }
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
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
                      Courier Instructions / Gift Note (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Please call upon arrival or include a gift note"
                      value={shippingData.notes}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, notes: e.target.value })
                      }
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-sm font-bold rounded-2xl shadow-md transition-all mt-4 shimmer-button cursor-pointer"
                  >
                    Continue to Payment Options
                  </button>
                </form>
              ) : (
                /* Step 2: Payment Method */
                <div className="space-y-6">
                  <div className="pb-3 border-b border-stone-100">
                    <h2 className="text-xl font-extrabold text-stone-900">
                      Select Payment Method
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Choose how you would like to complete your handicraft order.
                    </p>
                  </div>

                  {/* COD Option */}
                  <label
                    className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
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
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-5 w-5 text-[#A3481D]" />
                          <span className="font-extrabold text-sm text-stone-900">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-[#A3481D] text-[10px] font-bold uppercase">
                          Popular in LK
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Pay with cash in LKR directly to the courier when your handicraft parcel arrives at your doorstep.
                      </p>
                    </div>
                  </label>

                  {/* Simulated Payment Option */}
                  <label
                    className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
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
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-[#A3481D]" />
                          <span className="font-extrabold text-sm text-stone-900">
                            Instant Online Payment (Academic Sandbox)
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                          Instant
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Demonstrate instant digital order confirmation. No real card details are charged.
                      </p>

                      {paymentMethod === 'simulated' && (
                        <div className="mt-3 p-3.5 rounded-xl bg-white border border-stone-200 space-y-2 text-xs animate-fade-in">
                          <div className="flex items-center justify-between text-stone-500">
                            <span className="flex items-center gap-1.5 font-semibold text-stone-700">
                              <Lock className="h-3.5 w-3.5 text-emerald-600" />
                              CraftLK Sandbox Gateway
                            </span>
                            <span className="font-mono text-[11px] bg-stone-100 px-2 py-0.5 rounded">
                              •••• 4242
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400">
                            Pre-authorized test token active. Click "Confirm & Place Order" below to simulate immediate payment capture.
                          </p>
                        </div>
                      )}
                    </div>
                  </label>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-3.5 px-5 border border-stone-300 rounded-2xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handlePlaceOrder}
                      className="flex-1 py-4 bg-[#A3481D] hover:bg-[#8B3B14] active:scale-95 text-white text-sm font-bold rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shimmer-button cursor-pointer"
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

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6 lg:sticky lg:top-28">
              <h3 className="font-extrabold text-stone-900 text-base pb-3 border-b border-stone-100">
                Order Summary ({checkoutItems.length} items)
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
                  <span>Items Subtotal</span>
                  <span className="font-bold text-stone-900">
                    LKR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Islandwide Courier</span>
                  <span className="font-bold text-stone-900">
                    LKR {shippingFee.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-sm">
                  <span className="font-extrabold text-stone-900">Total Payable</span>
                  <span className="font-extrabold text-lg text-[#A3481D]">
                    LKR {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Step 3: Order Confirmation Screen */
          <div className="max-w-xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-lg text-center space-y-6 animate-scale-in">
            <div className="w-18 h-18 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="h-10 w-10" />
            </div>

            <div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                Order Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3 mb-1">
                Thank You for Supporting Local Artisans!
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Your authentic craft order has been transmitted directly to the artisan studio.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between pb-2.5 border-b border-stone-200/80 font-semibold">
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
                <span className="font-medium text-stone-800 text-right max-w-[240px]">
                  {createdOrder?.shippingAddress?.address},{' '}
                  {createdOrder?.shippingAddress?.city},{' '}
                  {createdOrder?.shippingAddress?.district}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Method</span>
                <span className="font-bold uppercase text-stone-800">
                  {createdOrder?.paymentMethod === 'cod'
                    ? 'Cash on Delivery (COD)'
                    : 'Online Sandbox Payment'}
                </span>
              </div>
              <div className="flex justify-between pt-2.5 border-t border-stone-200 font-extrabold text-sm">
                <span className="text-stone-900">Total Amount</span>
                <span className="text-[#A3481D]">
                  LKR {createdOrder?.total?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to={`/orders/${createdOrder?._id}`}
                className="flex-1 py-3.5 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Track Order Timeline
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="py-3.5 px-4 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Print Receipt</span>
              </button>
              <Link
                to="/shop"
                className="flex-1 py-3.5 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl transition-colors"
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
