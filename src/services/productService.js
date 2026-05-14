import api from './api';

export const getAllProducts = (params = {}) => api.get('/products', { params });

export const getProductById = (id) => api.get(`/products/${id}`);

export const getProductsByCategory = (category) =>
  api.get(`/products?category=${category}`);

export const getProductsBySeller = (sellerId) =>
  api.get(`/products?sellerId=${sellerId}`);

export const searchProducts = (query) =>
  api.get(`/products?title_like=${query}`);

export const addProduct = (data) => api.post('/products', data);

export const updateProduct = (id, data) => api.put(`/products/${id}`, data);

export const deleteProduct = (id) => api.delete(`/products/${id}`);
