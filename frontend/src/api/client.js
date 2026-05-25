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

export async function initCsrf() {
  try {
    const response = await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true });
    // Manually extract and set XSRF token from cookie if needed
    const token = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];
    if (token) {
      api.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token);
      axios.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
  } catch (error) {
    console.error('Error initializing CSRF:', error);
  }
}

export default api;
