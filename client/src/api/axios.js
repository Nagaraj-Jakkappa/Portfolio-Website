import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5180/api',
  timeout: 10000,
});

// Attach token on every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
    }
    return Promise.reject(err);
  }
);

export default api;
