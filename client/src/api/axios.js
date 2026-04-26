import axios from 'axios';

// Safely format the URL by removing any trailing slashes from the environment variable
const VITE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5180';
const API_BASE_URL = `${VITE_URL.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
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
    // Only clear token if the error isn't coming from the login page itself
    if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('adminToken');
    }
    return Promise.reject(err);
  }
);

export default api;