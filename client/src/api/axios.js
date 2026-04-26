// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5180/api',
//   timeout: 10000,
// });

// // Attach token on every request if present
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('adminToken');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Global error handling
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem('adminToken');
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;



import axios from 'axios';

// This checks if the live Vercel environment variable exists. 
// If it doesn't (like when you are coding locally), it falls back to localhost.
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5180/api';

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
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
    }
    return Promise.reject(err);
  }
);

export default api;