import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/api/auth/profile', userData);
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.put('/api/auth/password', { oldPassword, newPassword });
    return response.data;
  },
};
