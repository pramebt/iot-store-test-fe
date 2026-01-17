import api from './api.js'

export const salesLocationsService = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append('search', params.search)
    if (params.status) queryParams.append('status', params.status)
    if (params.province) queryParams.append('province', params.province)
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)

    const response = await api.get(`/api/sales-locations?${queryParams.toString()}`)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/api/sales-locations/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/api/sales-locations', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/api/sales-locations/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/api/sales-locations/${id}`)
    return response.data
  },

  getProducts: async (id) => {
    const response = await api.get(`/api/sales-locations/${id}/products`)
    return response.data
  },

  addProduct: async (salesLocationId, productId, isAvailable = true, stock = 0) => {
    const response = await api.post(`/api/sales-locations/${salesLocationId}/products`, {
      productId,
      isAvailable,
      stock, // SalesLocation = สถานที่ขายและเก็บสินค้า (มี stock)
    })
    return response.data
  },

  getStock: async (id, params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.productId) queryParams.append('productId', params.productId)
    if (params.lowStock !== undefined) queryParams.append('lowStock', params.lowStock)
    if (params.lowStockThreshold) queryParams.append('lowStockThreshold', params.lowStockThreshold)
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)

    const response = await api.get(`/api/sales-locations/${id}/stock?${queryParams.toString()}`)
    return response.data
  },

  updateStock: async (salesLocationId, productId, quantity, action = 'SET') => {
    const response = await api.put(`/api/sales-locations/${salesLocationId}/stock`, {
      productId,
      quantity,
      action,
    })
    return response.data
  },

  transferStock: async (fromSalesLocationId, toSalesLocationId, productId, quantity) => {
    const response = await api.post(`/api/sales-locations/${fromSalesLocationId}/transfer`, {
      toSalesLocationId,
      productId,
      quantity,
    })
    return response.data
  },

  removeProduct: async (salesLocationId, productId) => {
    const response = await api.delete(`/api/sales-locations/${salesLocationId}/products`, {
      data: { productId },
    })
    return response.data
  },
}
