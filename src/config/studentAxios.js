// src/config/studentAxios.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const studentAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add student token
studentAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studentToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
studentAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('studentToken');
      localStorage.removeItem('studentData');
      localStorage.removeItem('userRole');
      window.location.href = '/user/login';
    }
    return Promise.reject(error);
  }
);

export default studentAxios;