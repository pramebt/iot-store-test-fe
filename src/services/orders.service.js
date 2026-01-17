import api from './api';

export const ordersService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/orders', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  create: async (orderData) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/api/orders/${id}/status`, { status });
    return response.data;
  },

  uploadPayment: async (id, paymentSlipUrl) => {
    const response = await api.post(`/api/orders/${id}/payment`, { paymentSlipUrl });
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.delete(`/api/orders/${id}`);
    return response.data;
  },
};
