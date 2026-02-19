import api from './api';

export const notificationsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/notifications', { params }).then((res) => res.data),

  getUnreadCount: () =>
    api.get('/notifications/unread-count').then((res) => res.data),

  markAsRead: (id: number) =>
    api.put(`/notifications/${id}/read`).then((res) => res.data),

  markAllAsRead: () =>
    api.put('/notifications/read-all').then((res) => res.data),
};
