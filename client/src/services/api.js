import axios from 'axios';

// Base URL falls back to relative '/api' which works with Vite proxy and Nginx reverse proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// Transaction API methods
export const getTransactions = (params) => api.get('/transactions', { params });
export const createTransaction = (data) => api.post('/transactions', data);
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

// Analytics API methods
export const getSummary = () => api.get('/analytics/summary');
export const getCategoryBreakdown = (type = 'expense') =>
  api.get('/analytics/category-breakdown', { params: { type } });
export const getMonthlyTrend = () => api.get('/analytics/monthly-trend');

export default api;
