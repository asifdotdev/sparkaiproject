import api from './api';

export const userApi = {
  getProfile: () => api.get('/users/profile').then((res) => res.data),

  updateProfile: (data: { name?: string; phone?: string; address?: string }) =>
    api.put('/users/profile', data).then((res) => res.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/users/password', { currentPassword, newPassword }).then((res) => res.data),
};
