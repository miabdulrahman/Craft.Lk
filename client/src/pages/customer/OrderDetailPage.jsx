import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  Store,
  MapPin,
  CreditCard,
  Banknote,
  ArrowLeft,
  Clock,
  CheckCircle,
  Truck
} from 'lucide-react';
import api from '../../services/api';
import { getStatusBadgeClass } from './OrdersPage';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error('Error loading order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#A3481D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-stone-600 mb-4">Order record not found.</p>
        <Link to="/my-orders" className="text-xs font-bold text-[#A3481D]">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#A3481D]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Orders</span>
        </Link>

        {/* Order Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-stone-400 font-semibold block mb-0.5">
              Order Details
            </span>
            <h1 className="text-2xl font-extrabold text-stone-900">
              {order.orderNumber}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                dateStyle: 'full'
              })}
            </p>
          </div>

          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadgeClass(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>

        {/* Ordered Items Snapshot Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100">
            Handcrafted Items
          </h2>

          <div className="divide-y divide-stone-100">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || '/images/products/wooden_elephant.jpg'}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-400">
                      LKR {item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                </div>

                <span className="font-extrabold text-sm text-[#A3481D]">
                  LKR {item.subtotal.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-stone-900">
                LKR {order.subtotal?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Standard Delivery</span>
              <span className="font-bold text-stone-900">
                LKR {order.shippingFee?.toLocaleString()}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-100 flex justify-between text-base font-extrabold">
              <span className="text-stone-900">Total Paid / Due</span>
              <span className="text-[#A3481D]">
                LKR {order.total?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery & Artisan Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-3">
            <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#A3481D]" />
              <span>Delivery Address</span>
            </h3>
            <div className="text-xs text-stone-600 space-y-1">
              <p className="font-bold text-stone-900">
                {order.shippingAddress?.fullName}
              </p>
              <p>{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.district}
              </p>
              <p>Phone: {order.shippingAddress?.phone}</p>
              {order.shippingAddress?.notes && (
                <p className="text-stone-400 italic pt-1">
                  Note: "{order.shippingAddress.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Artisan & Payment */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-3">
            <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
              <Store className="h-4 w-4 text-[#A3481D]" />
              <span>Artisan Workshop</span>
            </h3>
            <div className="text-xs text-stone-600 space-y-1">
              <p className="font-bold text-stone-900">
                {order.shop?.shopName}
              </p>
              <p>
                {order.shop?.city}, {order.shop?.district}
              </p>
              <p>Contact: {order.shop?.phone}</p>
              <div className="pt-2 border-t border-stone-100 flex items-center gap-2 font-bold uppercase text-stone-700">
                {order.paymentMethod === 'cod' ? (
                  <>
                    <Banknote className="h-4 w-4 text-[#A3481D]" />
                    <span>Cash on Delivery</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    <span>Simulated Online Payment</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
