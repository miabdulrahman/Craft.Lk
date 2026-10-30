import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Header Banner */}
      <div className="bg-[#F5EFE6] heritage-pattern border-b border-stone-200/80 py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-amber-300/70 text-[#A3481D] text-xs font-extrabold mb-3 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sri Lankan Heritage Crafts</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
            Explore Craft Traditions
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
            Each craft discipline represents centuries of generational mastery passed down through Sri Lankan artisan families and royal guild lineages.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-stone-200/70 rounded-3xl aspect-4/3 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {categories.map((cat, idx) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                className="group craft-card relative rounded-3xl overflow-hidden aspect-4/3 bg-stone-900 shadow-sm block border border-stone-200/80"
              >
                <img
                  src={cat.image || '/images/hero_crafts.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent p-6 sm:p-7 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-amber-200 border border-white/15">
                      Tradition 0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1.5 group-hover:text-amber-300 transition-colors flex items-center justify-between">
                      <span>{cat.name}</span>
                      <span className="w-8 h-8 rounded-full bg-white/15 group-hover:bg-[#A3481D] flex items-center justify-center transition-all">
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
