import React, { useState, useEffect } from 'react';
import {
  Package,
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import SellerSidebar from '../../components/dashboard/SellerSidebar';
import api from '../../services/api';
import { getStatusBadgeClass } from '../customer/OrdersPage';

const ORDER_STATUS_OPTIONS = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/seller/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await api.patch(`/orders/seller/orders/${orderId}/status`, {
        orderStatus: newStatus
      });
      if (res.data.success) {
        setStatusMessage(`Order updated to ${newStatus}`);
        setTimeout(() => setStatusMessage(''), 3000);
        fetchOrders();
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <SellerSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Customer Orders
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Process incoming customer orders for your artisan creations.
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 animate-pulse h-64" />
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-base text-stone-900">
                      {ord.orderNumber}
                    </span>
                    <span className="text-xs text-stone-400">
                      {new Date(ord.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-500 font-medium">Status:</span>
                    <select
                      value={ord.orderStatus}
                      disabled={updatingId === ord._id}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className={`text-xs font-bold py-1.5 px-3 rounded-xl border focus:outline-none ${getStatusBadgeClass(
                        ord.orderStatus
                      )}`}
                    >
                      {ORDER_STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Items & Shipping Details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                  {/* Items */}
                  <div className="md:col-span-7 space-y-2">
                    <span className="font-bold text-stone-700 block">Ordered Items</span>
                    <div className="space-y-2">
                      {ord.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={it.image || '/images/products/wooden_elephant.jpg'}
                              alt={it.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-bold text-stone-900 line-clamp-1">
                                {it.name}
                              </p>
                              <p className="text-[11px] text-stone-400">
                                LKR {it.price.toLocaleString()} × {it.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-[#A3481D]">
                            LKR {it.subtotal.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Delivery info */}
                  <div className="md:col-span-5 space-y-1.5 bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80">
                    <span className="font-bold text-stone-800 block mb-1">
                      Customer & Shipping
                    </span>
                    <p className="font-semibold text-stone-900">
                      {ord.shippingAddress?.fullName}
                    </p>
                    <p className="text-stone-600">{ord.shippingAddress?.address}</p>
                    <p className="text-stone-600">
                      {ord.shippingAddress?.city}, {ord.shippingAddress?.district}
                    </p>
                    <p className="text-stone-600">Phone: {ord.shippingAddress?.phone}</p>
                    <div className="pt-2 border-t border-stone-200/80 flex justify-between font-extrabold text-stone-900 text-sm">
                      <span>Order Subtotal</span>
                      <span className="text-[#A3481D]">
                        LKR {ord.subtotal?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <Package className="h-12 w-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-bold text-stone-900 text-base mb-1">
              No orders received yet
            </h3>
            <p className="text-xs text-stone-500">
              Orders placed for your artisan listings will appear here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
