import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle,
  XCircle,
  Store,
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Shipped':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Processing':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Confirmed':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Cancelled':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-amber-100 text-amber-800 border-amber-200';
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be restored.')) {
      return;
    }

    try {
      setCancellingId(orderId);
      const res = await api.patch(`/orders/${orderId}/cancel`, {
        reason: 'Cancelled by customer'
      });
      if (res.data.success) {
        setMessage('Order cancelled successfully.');
        fetchOrders();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              My Purchase History
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Track your handcrafted orders from Sri Lankan artisan workshops.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-[#A3481D] hover:underline"
          >
            Browse More Crafts →
          </Link>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-stone-200 h-36 animate-pulse"
              />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-5">
            {orders.map((order) => {
              const canCancel =
                order.orderStatus === 'Pending' ||
                order.orderStatus === 'Confirmed';

              return (
                <div
                  key={order._id}
                  className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF2EC] text-[#A3481D] flex items-center justify-center font-bold text-xs">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-base font-extrabold text-stone-900 block">
                          {order.orderNumber}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-stone-400">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadgeClass(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Shop Info & Thumbnails */}
                  <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                        <Store className="h-4 w-4 text-[#A3481D]" />
                        <span>Artisan: {order.shop?.shopName || 'Artisan Workshop'}</span>
                        <span className="text-stone-400 font-normal">
                          ({order.shop?.city}, {order.shop?.district})
                        </span>
                      </div>

                      {/* Item snapshots */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {order.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                          >
                            <img
                              src={it.image || '/images/products/wooden_elephant.jpg'}
                              alt={it.name}
                              className="w-6 h-6 rounded-md object-cover"
                            />
                            <span className="font-semibold text-stone-800">
                              {it.name}
                            </span>
                            <span className="text-stone-400">× {it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="sm:text-right">
                      <span className="text-xs text-stone-400 block font-medium">
                        Order Total
                      </span>
                      <span className="text-lg font-extrabold text-[#A3481D]">
                        LKR {order.total?.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-stone-400 block uppercase">
                        {order.paymentMethod === 'cod'
                          ? 'Cash on Delivery'
                          : 'Simulated Card'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A3481D] hover:underline"
                    >
                      <span>View Full Breakdown</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                        className="py-1.5 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-xs p-8">
            <Package className="h-12 w-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 mb-1">
              No orders placed yet
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              When you purchase authentic crafts, you can follow their order status here.
            </p>
            <Link
              to="/shop"
              className="py-2.5 px-6 bg-[#A3481D] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
