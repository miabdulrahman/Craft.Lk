import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('craftlk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('craftlk_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('craftlk_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('craftlk_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Error saving wishlist to localStorage:', e);
    }
  }, [wishlistItems]);

  const addToCart = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product._id === product._id
      );

      const sellerId =
        typeof product.seller === 'object'
          ? product.seller._id
          : product.seller;
      const sellerName =
        typeof product.seller === 'object'
          ? product.seller.shopName
          : 'Artisan Shop';

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantity, product.stock);
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        const initialQty = Math.min(quantity, product.stock);
        return [
          ...prevItems,
          {
            product,
            quantity: initialQty,
            sellerId,
            sellerName
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product._id === productId) {
          const validQty = Math.min(newQuantity, item.product.stock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const clearSellerItems = (sellerId) => {
    setItems((prev) => prev.filter((item) => item.sellerId !== sellerId));
  };

  // Wishlist helpers
  const isInWishlist = (productId) => {
    return wishlistItems.some((p) => p._id === productId);
  };

  const toggleWishlist = (product) => {
    const exists = isInWishlist(product._id);
    if (exists) {
      setWishlistItems((prev) => prev.filter((p) => p._id !== product._id));
      return false;
    } else {
      setWishlistItems((prev) => [product, ...prev]);
      return true;
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((p) => p._id !== productId));
  };

  // Group items by seller shop
  const groupedBySeller = items.reduce((groups, item) => {
    const key = item.sellerId || 'unknown';
    if (!groups[key]) {
      groups[key] = {
        sellerId: key,
        sellerName: item.sellerName || 'Artisan Shop',
        items: [],
        subtotal: 0
      };
    }
    groups[key].items.push(item);
    groups[key].subtotal += item.product.price * item.quantity;
    return groups;
  }, {});

  const sellerGroups = Object.values(groupedBySeller);
  const isMultiVendor = sellerGroups.length > 1;

  // Cart totals
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = items.length > 0 ? 500 : 0;
  const cartTotal = cartSubtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        clearSellerItems,
        totalItemCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
        sellerGroups,
        isMultiVendor,
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
