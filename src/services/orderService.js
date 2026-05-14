import api from './api';

export const getOrdersByUser = (userId) => api.get(`/orders?userId=${userId}`);

export const getAllOrders = () => api.get('/orders');

export const getOrderById = (id) => api.get(`/orders/${id}`);

export const createOrder = (order) => api.post('/orders', order);

export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}`, { status });
