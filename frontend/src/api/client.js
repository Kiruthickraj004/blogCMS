import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Set CSRF defaults before creating instances
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Apply CSRF defaults to api instance
api.defaults.xsrfCookieName = 'XSRF-TOKEN';
api.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// Request interceptor to always include CSRF token
api.interceptors.request.use((config) => {
  // Extract XSRF token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export async function initCsrf() {
  try {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`, { 
      withCredentials: true 
    });
  } catch (error) {
    console.error('Error initializing CSRF:', error);
  }
}

export default api;
