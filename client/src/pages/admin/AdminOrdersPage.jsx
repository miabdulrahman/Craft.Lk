import React, { useState, useEffect } from 'react';
import { ShoppingCart, Calendar, User, Store, Banknote, CreditCard } from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import api from '../../services/api';
import { getStatusBadgeClass } from '../customer/OrdersPage';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Error fetching admin orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Platform Orders
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Supervise all transactions, artisan fulfillment, and deliveries across Sri Lanka.
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-500">
            Total transactions: {orders.length}
          </span>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 animate-pulse h-64" />
        ) : orders.length > 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-[#FAF5EE] text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-4 pl-6">Order Ref</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Artisan Workshop</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total (LKR)</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4 pr-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 pl-6 font-extrabold text-stone-900">
                        {ord.orderNumber}
                        <span className="text-[11px] text-stone-400 block font-normal">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-stone-800 block">
                          {ord.customer?.name || 'Customer'}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {ord.shippingAddress?.phone}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-stone-800">
                        {ord.shop?.shopName || 'Workshop'}
                      </td>
                      <td className="p-4 text-stone-500">
                        {ord.items?.length || 1} craft item(s)
                      </td>
                      <td className="p-4 font-extrabold text-[#A3481D]">
                        LKR {ord.total.toLocaleString()}
                      </td>
                      <td className="p-4 uppercase text-[10px] font-bold">
                        <span
                          className={`px-2 py-0.5 rounded-md ${
                            ord.paymentMethod === 'cod'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeClass(
                            ord.orderStatus
                          )}`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <ShoppingCart className="h-12 w-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 text-xs">No orders recorded yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
