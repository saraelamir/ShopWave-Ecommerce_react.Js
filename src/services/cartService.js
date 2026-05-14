import api from './api';

export const getCart = (userId) => api.get(`/cart?userId=${userId}`);

export const addCartItem = (item) => api.post('/cart', item);

export const updateCartItem = (id, data) => api.put(`/cart/${id}`, data);

export const removeCartItem = (id) => api.delete(`/cart/${id}`);

export const clearCart = async (userId) => {
  const res = await api.get(`/cart?userId=${userId}`);
  const deletes = res.data.map((item) => api.delete(`/cart/${item.id}`));
  return Promise.all(deletes);
};
