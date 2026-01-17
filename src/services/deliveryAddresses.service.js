import api from './api.js'

export const deliveryAddressesService = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append('search', params.search)
    if (params.status) queryParams.append('status', params.status)
    if (params.province) queryParams.append('province', params.province)
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)

    const response = await api.get(`/api/delivery-addresses?${queryParams.toString()}`)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/api/delivery-addresses/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/api/delivery-addresses', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/api/delivery-addresses/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/api/delivery-addresses/${id}`)
    return response.data
  },

  // DeliveryAddress = สถานที่ส่งสินค้า (ไม่มี stock) → ไม่มี stock management methods
}
