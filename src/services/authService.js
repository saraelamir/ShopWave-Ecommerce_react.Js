import api from './api';

export const loginUser = async (email, password) => {
  const res = await api.get(`/users?email=${email}&password=${password}`);
  if (res.data.length === 0) throw new Error('Invalid email or password');
  return res.data[0];
};

export const registerUser = async ({ name, email, password, role = 'customer' }) => {
  // Check if email already used
  const existing = await api.get(`/users?email=${email}`);
  if (existing.data.length > 0) throw new Error('Email already registered');

  const newUser = {
    id: `u${Date.now()}`,
    name,
    email,
    password,
    role,
    avatar: `https://i.pravatar.cc/150?u=${email}`,
    createdAt: new Date().toISOString().split('T')[0],
  };
  const res = await api.post('/users', newUser);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};
