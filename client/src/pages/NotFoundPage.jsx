import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, ShoppingBag } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FAF8F5] heritage-pattern p-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 text-center shadow-md">
        <div className="w-18 h-18 bg-[#FAF2EC] text-[#A3481D] rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xs">
          <Compass className="h-9 w-9" />
        </div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#A3481D]">
          Error 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 mb-2">
          Craft Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mb-8 leading-relaxed">
          The artisan creation, workshop, or page you are looking for does not exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#FAF8F5] hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors"
          >
            <ShoppingBag className="h-4 w-4 text-[#A3481D]" />
            <span>Explore Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
