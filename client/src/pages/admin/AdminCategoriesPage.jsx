import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [confirmDeleteCat, setConfirmDeleteCat] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
    setImage('/images/hero_crafts.jpg');
    setDisplayOrder('0');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '/images/hero_crafts.jpg');
    setDisplayOrder(cat.displayOrder?.toString() || '0');
    setFormError('');
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload?folder=categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setImage(res.data.url);
        showToast('Category cover uploaded to Cloudinary!', 'success');
      }
    } catch (err) {
      showToast('Upload failed: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setFormError('');
      const payload = {
        name,
        description,
        image,
        displayOrder: Number(displayOrder)
      };

      if (editingCat) {
        await api.patch(`/categories/${editingCat._id}`, payload);
        showToast(`Category "${name}" updated!`, 'success');
      } else {
        await api.post('/categories', payload);
        showToast(`Category "${name}" created!`, 'success');
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteCat) return;
    try {
      await api.delete(`/categories/${confirmDeleteCat._id}`);
      showToast(`Deleted category "${confirmDeleteCat.name}"`, 'info');
      setConfirmDeleteCat(null);
      fetchCategories();
    } catch (err) {
      showToast(err.message || 'Failed to delete category', 'error');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#A3481D] block mb-0.5">
              Taxonomy Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Product Categories ({categories.length})
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Organize marketplace craft disciplines and catalog hierarchies.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto shimmer-button cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Categories Table */}
        {loading ? (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 animate-pulse h-64" />
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-[#FAF5EE] text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-4 pl-6">Category</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Order</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-stone-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={cat.image || '/images/hero_crafts.jpg'}
                            alt={cat.name}
                            className="w-11 h-11 rounded-xl object-cover border border-stone-200"
                          />
                          <span>{cat.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-stone-500">
                        {cat.slug}
                      </td>
                      <td className="p-4 text-stone-500 max-w-xs truncate">
                        {cat.description || 'No description provided.'}
                      </td>
                      <td className="p-4 font-semibold text-stone-700">
                        {cat.displayOrder || 0}
                      </td>
                      <td className="p-4 pr-6 text-right space-x-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 text-stone-600 hover:text-[#A3481D] hover:bg-stone-100 rounded-xl cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteCat(cat)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl cursor-pointer"
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
        )}

        {/* Delete Confirmation Modal */}
        {confirmDeleteCat && (
          <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-extrabold text-stone-900 text-base">
                  Delete Category "{confirmDeleteCat.name}"?
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Are you sure you want to remove this category from the CraftLK taxonomy?
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setConfirmDeleteCat(null)}
                  className="py-2 px-4 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="py-2 px-5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-extrabold text-stone-900 text-lg">
                  {editingCat ? 'Edit Category' : 'Create Category'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Handmade Masks"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Cover Image
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={image || '/images/hero_crafts.jpg'}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <label className="cursor-pointer py-2 px-3 border border-stone-300 rounded-xl hover:bg-stone-50 font-semibold text-stone-700 inline-flex items-center gap-2">
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-[#A3481D]" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 text-[#A3481D]" />
                          <span>Upload Cover</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="py-2 px-4 border border-stone-300 rounded-xl font-bold text-stone-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-6 bg-[#A3481D] hover:bg-[#8B3B14] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Save Category
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
