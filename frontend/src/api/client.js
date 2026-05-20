import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export async function initCsrf() {
  await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true });
}

export default api;
