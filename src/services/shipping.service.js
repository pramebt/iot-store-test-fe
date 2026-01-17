import api from './api.js'

export const shippingService = {
  calculateShipping: async (items, province) => {
    const response = await api.post('/api/shipping/calculate', {
      items,
      province,
    })
    return response.data
  },

  checkProductAvailability: async (productId, province) => {
    const response = await api.get(`/api/shipping/products/${productId}/availability`, {
      params: { province },
    })
    return response.data
  },
}
