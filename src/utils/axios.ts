// The-Human-Tech-Blog-React/src/utils/axios.ts

import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export default instance;
