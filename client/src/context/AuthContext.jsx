import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('craftlk_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('craftlk_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          setShop(res.data.shop);
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        localStorage.removeItem('craftlk_token');
        setUser(null);
        setShop(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: newUser, shop: newShop } = res.data;
      localStorage.setItem('craftlk_token', newToken);
      setToken(newToken);
      setUser(newUser);
      setShop(newShop);
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { token: newToken, user: newUser, shop: newShop } = res.data;
      localStorage.setItem('craftlk_token', newToken);
      setToken(newToken);
      setUser(newUser);
      setShop(newShop);
      return res.data;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('craftlk_token');
      setToken(null);
      setUser(null);
      setShop(null);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setShop(res.data.shop);
      }
    } catch (e) {
      // Ignore
    }
  };

  const updateProfile = async (profileData) => {
    const res = await api.patch('/auth/me', profileData);
    if (res.data.success) {
      setUser(res.data.user);
    }
    return res.data;
  };

  const isCustomer = user?.role === 'customer';
  const isSeller = user?.role === 'seller';
  const isAdmin = user?.role === 'admin';
  const isApprovedSeller = isSeller && shop?.approvalStatus === 'approved';

  return (
    <AuthContext.Provider
      value={{
        user,
        shop,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
        isCustomer,
        isSeller,
        isAdmin,
        isApprovedSeller
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
