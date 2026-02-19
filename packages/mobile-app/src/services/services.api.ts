import api from './api';

export const servicesApi = {
  getAll: (params?: { categoryId?: number; page?: number; limit?: number; search?: string }) =>
    api.get('/services', { params }).then((res) => res.data),

  getById: (id: number) => api.get(`/services/${id}`).then((res) => res.data),

  search: (query: string) => api.get('/services/search', { params: { q: query } }).then((res) => res.data),
};
