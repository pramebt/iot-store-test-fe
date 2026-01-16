import api from './api';

export const customersService = {
  // Get all customers with filters
  getAll: async (params = {}) => {
    const response = await api.get('/api/customers', { params });
    return response.data;
  },

  // Get customer statistics
  getStats: async () => {
    const response = await api.get('/api/customers/stats');
    return response.data;
  },

  // Get customer by ID
  getById: async (id) => {
    const response = await api.get(`/api/customers/${id}`);
    return response.data;
  },
};
