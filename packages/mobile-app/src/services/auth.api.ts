import api from './api';

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((res) => res.data),

  register: (data: { name: string; email: string; phone?: string; password: string; role: string }) =>
    api.post('/auth/register', data).then((res) => res.data),

  getMe: () => api.get('/auth/me').then((res) => res.data),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh-token', { refreshToken }).then((res) => res.data),
};
