import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { salesLocationsService } from '../../../services/salesLocations.service'
import AddressSelector from '../../common/AddressSelector'
import { thailandAddress } from '../../../utils/thailandAddress'

export default function AddSalesLocationModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    locationType: 'STORE',
    status: 'Active',
    latitude: '',
    longitude: '',
  })
  const [addressData, setAddressData] = useState({
    provinceId: null,
    districtId: null,
    subDistrictId: null,
    zipCode: null,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        code: '',
        address: '',
        phone: '',
        email: '',
        locationType: 'STORE',
        status: 'Active',
        latitude: '',
        longitude: '',
      })
      setAddressData({
        provinceId: null,
        districtId: null,
        subDistrictId: null,
        zipCode: null,
      })
      setErrors({})
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!addressData.provinceId) {
      newErrors.province = 'Province is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      setLoading(true)
      
      // Convert addressData to province, district, postalCode
      let province = ''
      let district = ''
      let postalCode = addressData.zipCode || ''

      if (addressData.provinceId) {
        const provinceData = thailandAddress.getProvinceById(addressData.provinceId)
        if (provinceData) province = provinceData.name_th
      }

      if (addressData.districtId) {
        const districtData = thailandAddress.getDistrictById(addressData.districtId)
        if (districtData) district = districtData.name_th
      }

      const submitData = {
        ...formData,
        province,
        district,
        postalCode,
      }

      await salesLocationsService.create(submitData)
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to create sales location:', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to create sales location'
      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add Sales Location</h2>
              <p className="text-sm text-gray-600 mt-0.5">Create a new sales location</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter location name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Code */}
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Code *
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                        errors.code ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter location code"
                    />
                    {errors.code && (
                      <p className="mt-1 text-xs text-red-600">{errors.code}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-1.5">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                      errors.address ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter street address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                  )}
                </div>

                {/* Address Selector */}
                <div>
                  <AddressSelector
                    value={addressData}
                    onChange={setAddressData}
                    required={true}
                    showLabels={true}
                  />
                  {errors.province && (
                    <p className="mt-1 text-xs text-red-600">{errors.province}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Phone <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Email <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Location Type */}
                  <div>
                    <label htmlFor="locationType" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Location Type
                    </label>
                    <select
                      id="locationType"
                      name="locationType"
                      value={formData.locationType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    >
                      <option value="STORE">ร้านค้า</option>
                      <option value="WAREHOUSE">โกดัง</option>
                      <option value="IOT_POINT">จุดติดตั้ง IoT</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Latitude */}
                  <div>
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Latitude <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="latitude"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                      placeholder="13.7563"
                    />
                  </div>

                  {/* Longitude */}
                  <div>
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Longitude <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="longitude"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                      placeholder="100.5018"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Location'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
