import axios from 'axios';

/**
 * Since we moved vercel.json to the root, Vercel now acts as a proxy.
 * Requests sent to '/api' will be automatically forwarded to your
 * Render backend (https://techartistry-api.onrender.com/api).
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true,
});

// Attach token on every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Check for 401 (Unauthorized) and clear local storage
    if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('adminToken');
    }
    return Promise.reject(err);
  }
);

export default api;
