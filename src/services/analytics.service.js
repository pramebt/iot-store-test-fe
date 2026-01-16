import api from './api';

export const analyticsService = {
  // Get summary statistics
  getSummary: async () => {
    const response = await api.get('/api/analytics/summary');
    return response.data;
  },

  // Get sales by province
  getSalesByProvince: async () => {
    const response = await api.get('/api/analytics/provinces');
    return response.data;
  },

  // Get sales history
  getSalesHistory: async (months = 6) => {
    const response = await api.get(`/api/analytics/history?months=${months}`);
    return response.data;
  },

  // Get top provinces
  getTopProvinces: async (limit = 10) => {
    const response = await api.get(`/api/analytics/top-provinces?limit=${limit}`);
    return response.data;
  },
};
