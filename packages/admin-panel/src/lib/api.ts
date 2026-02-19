'use client';

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Auth
export const adminAuth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  getMe: () => api.get('/auth/me').then((r) => r.data),
};

// Admin APIs
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard').then((r) => r.data),

  // Users
  getUsers: (params?: any) => api.get('/admin/users', { params }).then((r) => r.data),
  getUser: (id: number) => api.get(`/admin/users/${id}`).then((r) => r.data),
  updateUser: (id: number, data: any) => api.put(`/admin/users/${id}`, data).then((r) => r.data),

  // Providers
  getProviders: (params?: any) => api.get('/admin/providers', { params }).then((r) => r.data),
  verifyProvider: (id: number, verified: boolean) =>
    api.put(`/admin/providers/${id}/verify`, { verified }).then((r) => r.data),

  // Categories
  getCategories: () => api.get('/categories').then((r) => r.data),
  getCategory: (id: number) => api.get(`/categories/${id}`).then((r) => r.data),
  createCategory: (data: any) => api.post('/categories', data).then((r) => r.data),
  updateCategory: (id: number, data: any) => api.put(`/categories/${id}`, data).then((r) => r.data),
  deleteCategory: (id: number) => api.delete(`/categories/${id}`).then((r) => r.data),

  // Services
  getServices: (params?: any) => api.get('/services', { params }).then((r) => r.data),
  getService: (id: number) => api.get(`/services/${id}`).then((r) => r.data),
  createService: (data: any) => api.post('/services', data).then((r) => r.data),
  updateService: (id: number, data: any) => api.put(`/services/${id}`, data).then((r) => r.data),
  deleteService: (id: number) => api.delete(`/services/${id}`).then((r) => r.data),

  // Bookings
  getBookings: (params?: any) => api.get('/admin/bookings', { params }).then((r) => r.data),
  assignProvider: (bookingId: number, providerId: number) =>
    api.put(`/admin/bookings/${bookingId}/assign`, { providerId }).then((r) => r.data),

  // Reviews & Payments
  getReviews: (params?: any) => api.get('/admin/reviews', { params }).then((r) => r.data),
  deleteReview: (id: number) => api.delete(`/admin/reviews/${id}`).then((r) => r.data),
  getPayments: (params?: any) => api.get('/admin/payments', { params }).then((r) => r.data),
};

export default api;
