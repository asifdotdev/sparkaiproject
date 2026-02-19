import api from './api';

export const providersApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/providers', { params }).then((res) => res.data),

  getById: (id: number) => api.get(`/providers/${id}`).then((res) => res.data),

  updateProfile: (data: { bio?: string; experienceYears?: number }) =>
    api.put('/providers/profile', data).then((res) => res.data),

  toggleAvailability: () => api.put('/providers/availability').then((res) => res.data),

  getMyServices: () => api.get('/providers/me/services').then((res) => res.data),

  addService: (serviceId: number) =>
    api.post('/providers/me/services', { serviceId }).then((res) => res.data),

  removeService: (serviceId: number) =>
    api.delete(`/providers/me/services/${serviceId}`).then((res) => res.data),

  getDashboard: () => api.get('/providers/me/dashboard').then((res) => res.data),
};
