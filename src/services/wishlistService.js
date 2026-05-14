import api from './api';

export const getWishlist = (userId) => api.get(`/wishlist?userId=${userId}`);

export const addWishlistItem = (item) => api.post('/wishlist', item);

export const removeWishlistItem = (id) => api.delete(`/wishlist/${id}`);

export const clearWishlist = async (userId) => {
  const res = await api.get(`/wishlist?userId=${userId}`);
  const deletes = res.data.map((item) => api.delete(`/wishlist/${item.id}`));
  return Promise.all(deletes);
};
