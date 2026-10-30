import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Upload,
  AlertCircle,
  Check,
  X,
  Loader2
} from 'lucide-react';
import SellerSidebar from '../../components/dashboard/SellerSidebar';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function SellerProductsPage() {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(
    searchParams.get('action') === 'new'
  );
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('10');
  const [images, setImages] = useState(['/images/products/wooden_elephant.jpg']);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products/seller/my-products'),
        api.get('/categories')
      ]);

      if (prodRes.data.success) {
        setProducts(prodRes.data.products);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.categories);
        if (!category && catRes.data.categories.length > 0) {
          setCategory(catRes.data.categories[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching seller products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setStock('10');
    setImages(['/images/products/wooden_elephant.jpg']);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setCategory(prod.category?._id || prod.category);
    setStock(prod.stock.toString());
    setImages(prod.images || ['/images/products/wooden_elephant.jpg']);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload?folder=products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setImages([res.data.url, ...images]);
        showToast('Image uploaded to Cloudinary as WebP successfully!', 'success');
      }
    } catch (err) {
      alert(err.message || 'Image upload to Cloudinary failed.');
      showToast('Upload failed: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !category || !description) {
      setFormError('Please fill in all required product fields.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');

      const payload = {
        name,
        description,
        price: Number(price),
        category,
        stock: Number(stock),
        images: images.length > 0 ? images : ['/images/products/wooden_elephant.jpg']
      };

      if (editingProduct) {
        await api.patch(`/products/${editingProduct._id}`, payload);
        showToast('Product updated in database successfully!', 'success');
      } else {
        await api.post('/products', payload);
        showToast('Product created with Cloudinary WebP images!', 'success');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setFormError(err.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${prodId}`);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <SellerSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              My Product Listings
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Manage your handcrafted goods, prices, and inventory levels.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Craft</span>
          </button>
        </div>

        {/* Product Table */}
        {loading ? (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 animate-pulse h-64" />
        ) : products.length > 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-[#FAF5EE] text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-4 pl-6">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (LKR)</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              prod.images?.[0] ||
                              '/images/products/wooden_elephant.jpg'
                            }
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block line-clamp-1">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-stone-400">
                              Rating: ★ {prod.rating || '4.8'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-stone-700">
                        {prod.category?.name || 'Handicrafts'}
                      </td>
                      <td className="p-4 font-extrabold text-[#A3481D]">
                        LKR {prod.price.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                            prod.stock > 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {prod.stock} in stock
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                            prod.isActive ? 'bg-emerald-500' : 'bg-stone-400'
                          }`}
                        />
                        <span className="capitalize">
                          {prod.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-stone-600 hover:text-[#A3481D] hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-xs p-8">
            <Package className="h-12 w-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-bold text-stone-900 text-base mb-1">
              No products created yet
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Start publishing your artisan creations to showcase them on the CraftLK marketplace.
            </p>
            <button
              onClick={openAddModal}
              className="py-2.5 px-5 bg-[#A3481D] text-white text-xs font-bold rounded-xl"
            >
              Add First Product
            </button>
          </div>
        )}

        {/* Add / Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-stone-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-lg font-extrabold text-stone-900">
                  {editingProduct ? 'Edit Handicraft' : 'Create New Handicraft Listing'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hand-Carved Teak Mask"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-[#A3481D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Price in LKR *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 2800"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-[#A3481D]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Available Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-[#A3481D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-[#A3481D]"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe traditional materials, dimensions, and craft technique..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-[#A3481D]"
                  />
                </div>

                {/* Upload Image */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Product Image
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={images[0] || '/images/products/wooden_elephant.jpg'}
                      alt="Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="flex flex-col gap-1">
                      <label className="cursor-pointer py-2 px-3 border border-stone-300 rounded-xl hover:bg-stone-50 font-semibold text-stone-700 inline-flex items-center gap-2 active:scale-95 transition-all">
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-[#A3481D]" />
                            <span>Uploading WebP to Cloudinary...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 text-[#A3481D]" />
                            <span>Upload Image</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploading}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {images[0] && images[0].includes('cloudinary') && (
                        <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Stored in Cloudinary (WebP)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-2.5 px-4 border border-stone-300 rounded-xl font-bold text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="py-2.5 px-6 bg-[#A3481D] hover:bg-[#8B3B14] text-white font-bold rounded-xl shadow-xs disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
