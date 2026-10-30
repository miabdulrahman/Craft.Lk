import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  requireApproved = false
}) {
  const { user, shop, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#A3481D] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-stone-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Role not permitted
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-stone-200 text-center">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Access Restricted</h2>
          <p className="text-sm text-stone-600 mb-6">
            Your account ({user.role}) does not have permission to access this protected area.
          </p>
          <a
            href="/"
            className="inline-block py-2.5 px-6 bg-[#A3481D] text-white text-sm font-bold rounded-xl shadow-xs"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  // If seller needs to be approved to access this specific action
  if (requireApproved && user.role === 'seller' && shop?.approvalStatus !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-stone-200 text-center">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Shop Application Under Review</h2>
          <p className="text-sm text-stone-600 mb-4 leading-relaxed">
            Your seller shop application for <strong>"{shop?.shopName}"</strong> is currently{' '}
            <span className="font-semibold text-amber-700 uppercase">{shop?.approvalStatus || 'pending'}</span>.
          </p>
          <p className="text-xs text-stone-500 mb-6">
            An administrator will inspect your application details and approve your artisan shop shortly.
          </p>
          <a
            href="/seller/dashboard"
            className="inline-block py-2.5 px-6 bg-[#A3481D] text-white text-sm font-bold rounded-xl shadow-xs"
          >
            Go to Seller Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}
