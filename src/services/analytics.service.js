import api from './api';

export const getAnalyticsSummary = async () => {
  const response = await api.get('/api/analytics/summary');
  return response.data;
};

export const getSalesByProvince = async (params = {}) => {
  const response = await api.get('/api/analytics/sales/province', { params });
  return response.data;
};

export const getSalesTrends = async (params = {}) => {
  const response = await api.get('/api/analytics/sales/trends', { params });
  return response.data;
};

export const getTopProducts = async (limit = 10) => {
  const response = await api.get('/api/analytics/products/top', { params: { limit } });
  return response.data;
};

export const getTopCategories = async (limit = 10) => {
  const response = await api.get('/api/analytics/categories/top', { params: { limit } });
  return response.data;
};

export const getRevenueStats = async (params = {}) => {
  const response = await api.get('/api/analytics/revenue', { params });
  return response.data;
};

export const getCustomerStats = async () => {
  const response = await api.get('/api/analytics/customers');
  return response.data;
};

export default {
  getAnalyticsSummary,
  getSalesByProvince,
  getSalesTrends,
  getTopProducts,
  getTopCategories,
  getRevenueStats,
  getCustomerStats,
};
