import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import ShopPage from './pages/public/ShopPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import CategoriesPage from './pages/public/CategoriesPage';
import ArtisansPage from './pages/public/ArtisansPage';
import ArtisanDetailPage from './pages/public/ArtisanDetailPage';
import AboutPage from './pages/public/AboutPage';
import AuthPage from './pages/public/AuthPage';
import NotFoundPage from './pages/NotFoundPage';

// Customer Pages
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import ProfilePage from './pages/customer/ProfilePage';

// Seller Pages
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerShopProfilePage from './pages/seller/SellerShopProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSellersPage from './pages/admin/AdminSellersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

import { ToastProvider } from './context/ToastContext';

// Standard Public Layout with Header and Footer
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
          <Routes>
            {/* Main Storefront Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/artisans" element={<ArtisansPage />} />
              <Route path="/artisans/:id" element={<ArtisanDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/cart" element={<CartPage />} />

              {/* Customer Protected Routes with Main Header/Footer */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'seller', 'admin']}>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'seller', 'admin']}>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'seller', 'admin']}>
                    <OrderDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'seller', 'admin']}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Auth Page without default header/footer for split screen design */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Seller Dashboard Routes (Dedicated Dark Sidebar Layout) */}
            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <SellerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/products"
              element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <SellerProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/orders"
              element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <SellerOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/shop-profile"
              element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <SellerShopProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard Routes (Dedicated Dark Sidebar Layout) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sellers"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSellersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminCategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
