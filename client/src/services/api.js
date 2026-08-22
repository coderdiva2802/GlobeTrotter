import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gt_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors & mock fallback if backend server isn't reached
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If backend is not running (Network Error or ECONNREFUSED)
    if (!error.response && error.code === 'ERR_NETWORK') {
      console.warn('Backend server is offline. Simulating local success for frontend demo.');
    }
    return Promise.reject(error);
  }
);
