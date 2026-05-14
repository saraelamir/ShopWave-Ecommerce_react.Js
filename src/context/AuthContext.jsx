import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('shopUser');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = useCallback(async (email, password) => {
    const userData = await loginUser(email, password);
    setUser(userData);
    localStorage.setItem('shopUser', JSON.stringify(userData));
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    const userData = await registerUser(data);
    setUser(userData);
    localStorage.setItem('shopUser', JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('shopUser');
  }, []);

  const updateUser = useCallback((updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem('shopUser', JSON.stringify(merged));
  }, [user]);

  const isAdmin = () => user?.role === 'admin';
  const isSeller = () => user?.role === 'seller';
  const isCustomer = () => user?.role === 'customer';
  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, isAdmin, isSeller, isCustomer, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
