import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import api from '../../services/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
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
    fetchCats();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#A3481D] text-xs font-bold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sri Lankan Heritage Crafts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Explore Craft Categories
          </h1>
          <p className="text-sm text-stone-600 mt-2">
            Each craft discipline represents centuries of generational knowledge passed down through Sri Lankan artisan families.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-stone-200/60 rounded-3xl aspect-4/3 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                className="group relative rounded-3xl overflow-hidden aspect-4/3 bg-stone-900 shadow-sm hover:shadow-xl transition-all duration-300 block"
              >
                <img
                  src={cat.image || '/images/hero_crafts.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-65"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-6 flex flex-col justify-end text-white">
                  <h3 className="text-xl font-extrabold text-white mb-1 group-hover:text-amber-300 transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
