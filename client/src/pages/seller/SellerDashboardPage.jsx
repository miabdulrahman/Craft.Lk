import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Banknote,
  TrendingUp,
  ArrowUpRight,
  Store,
  Clock,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import SellerSidebar from '../../components/dashboard/SellerSidebar';
import { getStatusBadgeClass } from '../customer/OrdersPage';

export default function SellerDashboardPage() {
  const { user, shop } = useAuth();

  const [metrics, setMetrics] = useState({
    productCount: 0,
    orderCount: 0,
    totalSales: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        // Fetch shop metrics
        const shopRes = await api.get('/shops/me');
        if (shopRes.data.success) {
          setMetrics(shopRes.data.metrics);
        }

        // Fetch recent orders
        const ordersRes = await api.get('/orders/seller/orders');
        if (ordersRes.data.success) {
          setRecentOrders(ordersRes.data.orders.slice(0, 5));
        }
      } catch (err) {
        console.error('Error loading seller dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      {/* 1. Dark Charcoal Sidebar (Matching Panel 7) */}
      <SellerSidebar />

      {/* 2. Main Dashboard Content (Matching Panel 7) */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200/80 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Welcome back to your artisan workshop control center.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/seller/products?action=new"
              className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </Link>

            <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
              <img
                src={shop?.logo || '/images/products/wooden_elephant.jpg'}
                alt={shop?.shopName}
                className="w-10 h-10 rounded-full object-cover border border-amber-300"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-stone-800 leading-tight">
                  {shop?.shopName || 'Sunfire Crafts'}
                </p>
                <p className="text-[11px] text-stone-400 capitalize">
                  {shop?.approvalStatus || 'Active'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approval Notice if applicable */}
        {shop?.approvalStatus === 'pending' && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold">Application Under Review</span>
              <p className="text-amber-800 mt-0.5">
                Your shop application is pending review by the platform administrator. Once approved, your products will be published live to customers.
              </p>
            </div>
          </div>
        )}

        {/* 3. KPI Summary Cards Row (Matching Panel 7) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Total Products */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
            <div>
              <span className="text-xs text-stone-400 font-semibold block mb-1">
                Total Products
              </span>
              <span className="text-3xl font-extrabold text-stone-900 group-hover:text-[#A3481D] transition-colors">
                {metrics.productCount}
              </span>
              <span className="text-[11px] text-stone-400 block mt-1">
                Active in shop
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#A3481D] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="h-6 w-6" />
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
            <div>
              <span className="text-xs text-stone-400 font-semibold block mb-1">
                Total Orders
              </span>
              <span className="text-3xl font-extrabold text-stone-900 group-hover:text-purple-600 transition-colors">
                {metrics.orderCount}
              </span>
              <span className="text-[11px] text-stone-400 block mt-1">
                Received from customers
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingCart className="h-6 w-6" />
            </div>
          </div>

          {/* Total Sales */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
            <div>
              <span className="text-xs text-stone-400 font-semibold block mb-1">
                Total Sales
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#A3481D]">
                LKR {metrics.totalSales?.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>Gross Revenue</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* 4. Sales Overview Chart & Recent Orders Grid (Panel 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Sales Overview Chart */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">
                  Sales Overview
                </h3>
                <p className="text-xs text-stone-400">Weekly revenue trend (LKR)</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600">
                Last 7 days
              </span>
            </div>

            {/* Stylized SVG Trend Chart matching Panel 7 */}
            <div className="pt-4 h-56 flex flex-col justify-between">
              <svg viewBox="0 0 500 180" className="w-full h-44 overflow-visible">
                {/* Horizontal reference lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f0ece6" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="#f0ece6" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#f0ece6" strokeWidth="1" strokeDasharray="4 4" />

                {/* Gradient area */}
                <defs>
                  <linearGradient id="terracottaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A3481D" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#A3481D" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <path
                  d="M 10 140 Q 90 120, 160 145 T 280 80 T 380 110 T 490 60 L 490 170 L 10 170 Z"
                  fill="url(#terracottaGrad)"
                />

                {/* Spline Line */}
                <path
                  d="M 10 140 Q 90 120, 160 145 T 280 80 T 380 110 T 490 60"
                  fill="none"
                  stroke="#A3481D"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data points */}
                <circle cx="10" cy="140" r="4.5" fill="#A3481D" stroke="#fff" strokeWidth="2" />
                <circle cx="160" cy="145" r="4.5" fill="#A3481D" stroke="#fff" strokeWidth="2" />
                <circle cx="280" cy="80" r="4.5" fill="#A3481D" stroke="#fff" strokeWidth="2" />
                <circle cx="380" cy="110" r="4.5" fill="#A3481D" stroke="#fff" strokeWidth="2" />
                <circle cx="490" cy="60" r="5" fill="#A3481D" stroke="#fff" strokeWidth="2.5" />
              </svg>

              <div className="flex justify-between text-[11px] text-stone-400 pt-2 px-2 border-t border-stone-100">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Right: Recent Orders List (Panel 7) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-stone-900 text-base">
                Recent Orders
              </h3>
              <Link
                to="/seller/orders"
                className="text-xs font-bold text-[#A3481D] hover:underline"
              >
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="divide-y divide-stone-100">
                {recentOrders.map((ord) => (
                  <div
                    key={ord._id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          ord.items?.[0]?.image ||
                          '/images/products/wooden_elephant.jpg'
                        }
                        alt="Order item"
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-stone-800">
                          {ord.orderNumber}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {ord.items?.length || 1} item(s)
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-stone-900 block">
                        LKR {ord.subtotal?.toLocaleString()}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadgeClass(
                          ord.orderStatus
                        )}`}
                      >
                        {ord.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-8 text-center">
                No orders received yet for this shop.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
