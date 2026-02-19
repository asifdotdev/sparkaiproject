import api from './api';

export const bookingsApi = {
  create: (data: {
    serviceId: number;
    providerId?: number;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    lat?: number;
    lng?: number;
    notes?: string;
  }) => api.post('/bookings', data).then((res) => res.data),

  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/bookings', { params }).then((res) => res.data),

  getById: (id: number) => api.get(`/bookings/${id}`).then((res) => res.data),

  accept: (id: number) => api.put(`/bookings/${id}/accept`).then((res) => res.data),
  reject: (id: number) => api.put(`/bookings/${id}/reject`).then((res) => res.data),
  start: (id: number) => api.put(`/bookings/${id}/start`).then((res) => res.data),
  complete: (id: number) => api.put(`/bookings/${id}/complete`).then((res) => res.data),
  cancel: (id: number, reason?: string) =>
    api.put(`/bookings/${id}/cancel`, { reason }).then((res) => res.data),
};
