import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
});

// Add JWT token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('foodFusionToken');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
