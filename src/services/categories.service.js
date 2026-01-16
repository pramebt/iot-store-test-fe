import api from './api';

export const categoriesService = {
  getAll: async () => {
    const response = await api.get('/api/categories');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  create: async (categoryData) => {
    const response = await api.post('/api/categories', categoryData);
    return response.data;
  },

  update: async (id, categoryData) => {
    const response = await api.put(`/api/categories/${id}`, categoryData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  },
};
