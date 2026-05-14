import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getWishlist, addWishlistItem, removeWishlistItem
} from '../services/wishlistService';
import { toast } from 'react-toastify';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlistItems([]); return; }
    setLoading(true);
    try {
      const res = await getWishlist(user.id);
      setWishlistItems(res.data);
    } catch { setWishlistItems([]); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    if (!user) { toast.error('Please login to save items'); return; }
    const existing = wishlistItems.find((i) => i.productId === product.id);
    if (existing) { toast.info('Already in wishlist'); return; }
    const newItem = {
      id: `w${Date.now()}`,
      userId: user.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
    };
    await addWishlistItem(newItem);
    setWishlistItems((prev) => [...prev, newItem]);
    toast.success('Added to wishlist!');
  };

  const removeFromWishlist = async (productId) => {
    const item = wishlistItems.find((i) => i.productId === productId);
    if (!item) return;
    await removeWishlistItem(item.id);
    setWishlistItems((prev) => prev.filter((i) => i.productId !== productId));
    toast.info('Removed from wishlist');
  };

  const isWishlisted = (productId) =>
    wishlistItems.some((i) => i.productId === productId);

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ wishlistItems, wishlistCount, loading, addToWishlist, removeFromWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
