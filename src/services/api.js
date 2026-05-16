import axios from 'axios';

const api = axios.create({
  baseURL: 'https://6a07b648fa9b27c848fa3b56.mockapi.io',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor — attach any auth token if needed in future
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;