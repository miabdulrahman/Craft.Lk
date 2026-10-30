import React, { useState, useEffect } from 'react';
import { Star, Search } from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

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
        showToast(
          !product.isFeatured
            ? `Marked "${product.name}" as Featured!`
            : `Removed "${product.name}" from Featured`,
          'success'
        );
        fetchProducts();
      }
    } catch (err) {
      showToast(err.message || 'Moderation failed', 'error');
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const res = await api.patch(`/admin/products/${product._id}/moderate`, {
        isActive: !product.isActive
      });
      if (res.data.success) {
        showToast(`Listing "${product.name}" visibility updated.`, 'info');
        fetchProducts();
      }
    } catch (err) {
      showToast(err.message || 'Moderation failed', 'error');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      !searchFilter.trim() ||
      p.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.seller?.shopName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#A3481D] block mb-0.5">
              Catalog Governance
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Product Moderation ({products.length})
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Supervise artisan listings, curate featured homepage crafts, and moderate visibility.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search product or workshop..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl py-2.5 pl-9 pr-4 text-xs"
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-stone-400" />
          </div>
        </div>

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
                    <th className="p-4 pr-6 text-right">Visibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || '/images/products/wooden_elephant.jpg'}
                            alt={p.name}
                            className="w-11 h-11 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <span className="font-bold text-stone-900 max-w-xs truncate block">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-stone-800">
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
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            p.isFeatured
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-amber-600'
                          }`}
                          title="Toggle Featured on Homepage"
                        >
                          <Star className={`h-4 w-4 ${p.isFeatured ? 'fill-amber-500' : ''}`} />
                        </button>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`py-1.5 px-3.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
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
