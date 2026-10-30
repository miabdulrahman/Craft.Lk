import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  ArrowRight,
  Store,
  AlertTriangle,
  X
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

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
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancelOrder, setConfirmCancelOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

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

  const handleConfirmCancel = async () => {
    if (!confirmCancelOrder) return;
    const orderId = confirmCancelOrder._id;

    try {
      setCancellingId(orderId);
      const res = await api.patch(`/orders/${orderId}/cancel`, {
        reason: 'Cancelled by customer'
      });
      if (res.data.success) {
        showToast(
          `Order ${confirmCancelOrder.orderNumber} cancelled and stock restored.`,
          'info'
        );
        setConfirmCancelOrder(null);
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel order.', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active')
      return ['Pending', 'Confirmed', 'Processing', 'Shipped'].includes(
        o.orderStatus
      );
    return o.orderStatus === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#A3481D] block mb-1">
              Customer Portal
            </span>
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

        {/* Status Filter Pills */}
        {orders.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
            {['All', 'Active', 'Delivered', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === tab
                    ? 'bg-[#A3481D] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {tab}
              </button>
            ))}
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
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const canCancel =
                order.orderStatus === 'Pending' ||
                order.orderStatus === 'Confirmed';

              return (
                <div
                  key={order._id}
                  className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#FAF2EC] text-[#A3481D] flex items-center justify-center font-bold text-xs">
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
                      <span
                        className={`px-3.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadgeClass(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Shop Info & Thumbnails */}
                  <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                        <Store className="h-4 w-4 text-[#A3481D]" />
                        <span>
                          Artisan: {order.shop?.shopName || 'Artisan Workshop'}
                        </span>
                        <span className="text-stone-400 font-normal">
                          ({order.shop?.city}, {order.shop?.district})
                        </span>
                      </div>

                      {/* Item snapshots */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {order.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 text-xs"
                          >
                            <img
                              src={it.image || '/images/products/wooden_elephant.jpg'}
                              alt={it.name}
                              className="w-6 h-6 rounded-md object-cover"
                            />
                            <span className="font-semibold text-stone-800">
                              {it.name}
                            </span>
                            <span className="text-stone-400 font-bold">
                              × {it.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="sm:text-right">
                      <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-bold">
                        Order Total
                      </span>
                      <span className="text-lg font-extrabold text-[#A3481D]">
                        LKR {order.total?.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-stone-400 block uppercase font-medium">
                        {order.paymentMethod === 'cod'
                          ? 'Cash on Delivery'
                          : 'Online Sandbox'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#A3481D] hover:underline"
                    >
                      <span>Track Status & View Receipt</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    {canCancel && (
                      <button
                        onClick={() => setConfirmCancelOrder(order)}
                        disabled={cancellingId === order._id}
                        className="py-1.5 px-3.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Cancel Order
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
              No orders found
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              When you purchase authentic crafts, you can track their live fulfillment status here.
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

      {/* Cancel Order Confirmation Modal */}
      {confirmCancelOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-extrabold text-stone-900 text-base">
                  Cancel Order {confirmCancelOrder.orderNumber}?
                </h3>
              </div>
              <button
                onClick={() => setConfirmCancelOrder(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to cancel this order? Reserved inventory will be automatically restored to the artisan's workshop.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmCancelOrder(null)}
                className="py-2 px-4 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={cancellingId === confirmCancelOrder._id}
                onClick={handleConfirmCancel}
                className="py-2 px-5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {cancellingId === confirmCancelOrder._id
                  ? 'Cancelling...'
                  : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
