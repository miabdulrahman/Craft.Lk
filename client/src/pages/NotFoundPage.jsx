import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F5] p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 text-center shadow-xs">
        <div className="w-16 h-16 bg-[#FAF2EC] text-[#A3481D] rounded-full flex items-center justify-center mx-auto mb-4">
          <Compass className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 mb-2">404</h1>
        <h2 className="text-lg font-bold text-stone-800 mb-2">Page Not Found</h2>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          The artisan craft page or resource you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 py-3 px-6 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
