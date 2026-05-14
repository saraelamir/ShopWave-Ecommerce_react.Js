import api from './api';

export const getAllUsers = () => api.get('/users');

export const getUserById = (id) => api.get(`/users/${id}`);

export const updateUser = (id, data) => api.patch(`/users/${id}`, data);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export const changeUserRole = (id, role) => api.patch(`/users/${id}`, { role });
