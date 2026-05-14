import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getCart, addCartItem, updateCartItem, removeCartItem, clearCart as clearCartApi
} from '../services/cartService';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); return; }
    setLoading(true);
    try {
      const res = await getCart(user.id);
      setCartItems(res.data);
    } catch { setCartItems([]); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) { toast.error('Please login to add items to cart'); return; }
    const existing = cartItems.find((i) => i.productId === product.id);
    if (existing) {
      const updated = { ...existing, quantity: existing.quantity + quantity };
      await updateCartItem(existing.id, updated);
      setCartItems((prev) => prev.map((i) => i.id === existing.id ? updated : i));
    } else {
      const newItem = {
        id: `c${Date.now()}`,
        userId: user.id,
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
      };
      await addCartItem(newItem);
      setCartItems((prev) => [...prev, newItem]);
    }
    toast.success('Added to cart!');
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    const item = cartItems.find((i) => i.id === cartItemId);
    if (!item) return;
    const updated = { ...item, quantity };
    await updateCartItem(cartItemId, updated);
    setCartItems((prev) => prev.map((i) => i.id === cartItemId ? updated : i));
  };

  const removeFromCart = async (cartItemId) => {
    await removeCartItem(cartItemId);
    setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
    toast.info('Item removed from cart');
  };

  const clearCart = async () => {
    if (!user) return;
    await clearCartApi(user.id);
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
