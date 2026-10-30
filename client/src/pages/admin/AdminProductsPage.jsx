import React, { useState, useEffect } from 'react';
import { Package, Star, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import api from '../../services/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products?limit=50');
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleFeatured = async (product) => {
    try {
      const res = await api.patch(`/admin/products/${product._id}/moderate`, {
        isFeatured: !product.isFeatured
      });
      if (res.data.success) {
        setMsg(`Updated "${product.name}" featured state.`);
        setTimeout(() => setMsg(''), 2500);
        fetchProducts();
      }
    } catch (err) {
      alert(err.message || 'Moderation failed');
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const res = await api.patch(`/admin/products/${product._id}/moderate`, {
        isActive: !product.isActive
      });
      if (res.data.success) {
        setMsg(`Listing "${product.name}" status updated.`);
        setTimeout(() => setMsg(''), 2500);
        fetchProducts();
      }
    } catch (err) {
      alert(err.message || 'Moderation failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Product Moderation
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Supervise artisan listings, curate featured crafts, and moderate content.
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-500">
            Total listings: {products.length}
          </span>
        </div>

        {msg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{msg}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 animate-pulse h-64" />
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-[#FAF5EE] text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-4 pl-6">Product Item</th>
                    <th className="p-4">Artisan Seller</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4 pr-6 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || '/images/products/wooden_elephant.jpg'}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <span className="font-bold text-stone-900 max-w-xs truncate block">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-stone-800">
                        {p.seller?.shopName || 'Workshop'}
                      </td>
                      <td className="p-4 text-stone-500">
                        {p.category?.name || 'Handicrafts'}
                      </td>
                      <td className="p-4 font-extrabold text-[#A3481D]">
                        LKR {p.price.toLocaleString()}
                      </td>
                      <td className="p-4 font-semibold text-stone-700">
                        {p.stock}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            p.isFeatured
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : 'bg-stone-50 border-stone-200 text-stone-400'
                          }`}
                          title="Toggle Featured"
                        >
                          <Star className={`h-4 w-4 ${p.isFeatured ? 'fill-amber-500' : ''}`} />
                        </button>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`py-1 px-3 rounded-lg text-[11px] font-bold transition-colors ${
                            p.isActive
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                        >
                          {p.isActive ? 'Active' : 'Hidden'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
