import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Since we moved vercel.json to the root, Vercel now acts as a proxy.
 * Requests sent to '/api' will be automatically forwarded to your
 * Render backend (https://techartistry-api.onrender.com/api).
 */
const apiURL = import.meta.env.VITE_API_URL;
// If VITE_API_URL is hardcoded to the www domain which is failing, force same-origin '/api'
// Otherwise, use VITE_API_URL if valid, and fallback to '/api'.
const safeBaseURL = (apiURL && apiURL.includes('www.techartistry.in')) ? '/api' : (apiURL || '/api');

const api = axios.create({
  baseURL: safeBaseURL,
  timeout: 60000, // Increased to 60s to accommodate Render cold starts
  withCredentials: true,
});

let activeRequests = 0;
let wakeUpTimeout = null;
let wakeUpToastId = null;

// Attach token on every request if present and handle wake-up UX
api.interceptors.request.use((config) => {
  activeRequests++;
  
  // Only trigger the timeout once for a batch of concurrent requests
  if (activeRequests === 1) {
    wakeUpTimeout = setTimeout(() => {
      wakeUpToastId = toast.loading('Starting the server. This may take a few seconds...', {
        id: 'wakeup-toast',
      });
    }, 2000);
  }

  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleResponse = () => {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0; // Prevent going below 0
    if (wakeUpTimeout) clearTimeout(wakeUpTimeout);
    if (wakeUpToastId) {
      toast.dismiss(wakeUpToastId);
      wakeUpToastId = null;
    }
  }
};

// Global error handling
api.interceptors.response.use(
  (res) => {
    handleResponse();
    return res;
  },
  (err) => {
    handleResponse();
    // Check for 401 (Unauthorized) and clear local storage
    if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('adminToken');
    }
    return Promise.reject(err);
  }
);

export default api;
