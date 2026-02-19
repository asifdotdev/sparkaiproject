import api from './api';

export const categoriesApi = {
  getAll: () => api.get('/categories').then((res) => res.data),

  getById: (id: number) => api.get(`/categories/${id}`).then((res) => res.data),
};
