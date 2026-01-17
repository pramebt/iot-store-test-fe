import { useEffect, useState } from 'react'
import { deliveryAddressesService } from '../../services/deliveryAddresses.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import AddressSelector from '../../components/common/AddressSelector'
import { thailandAddress } from '../../utils/thailandAddress'

export default function DeliveryAddressesManagementPage() {
  const [deliveryAddresses, setDeliveryAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 20,
  })
  const [totalPages, setTotalPages] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    province: '',
    district: '',
    postalCode: '',
    phone: '',
    email: '',
    status: 'Active',
  })
  const [addressData, setAddressData] = useState({
    provinceId: null,
    districtId: null,
    subDistrictId: null,
    zipCode: null,
  })

  useEffect(() => {
    loadDeliveryAddresses()
  }, [filters])

  const loadDeliveryAddresses = async () => {
    try {
      setLoading(true)
      const data = await deliveryAddressesService.getAll(filters)
      setDeliveryAddresses(data.deliveryAddresses || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to load delivery addresses:', error)
      alert('Failed to load delivery addresses')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
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

      if (selectedDeliveryAddress) {
        await deliveryAddressesService.update(selectedDeliveryAddress.id, submitData)
      } else {
        await deliveryAddressesService.create(submitData)
      }
      setShowAddModal(false)
      setShowEditModal(false)
      setSelectedDeliveryAddress(null)
      resetForm()
      loadDeliveryAddresses()
    } catch (error) {
      console.error('Failed to save delivery address:', error)
      alert(error.response?.data?.error || error.message || 'Failed to save delivery address')
    }
  }

  const handleEdit = (deliveryAddress) => {
    setSelectedDeliveryAddress(deliveryAddress)
    setFormData({
      name: deliveryAddress.name,
      code: deliveryAddress.code,
      address: deliveryAddress.address,
      province: deliveryAddress.province,
      district: deliveryAddress.district,
      postalCode: deliveryAddress.postalCode || '',
      phone: deliveryAddress.phone || '',
      email: deliveryAddress.email || '',
      status: deliveryAddress.status,
    })

    // Convert province, district, postalCode to addressData
    let provinceId = null
    let districtId = null
    let subDistrictId = null
    let zipCode = deliveryAddress.postalCode || null

    if (deliveryAddress.province) {
      const provinces = thailandAddress.searchProvince(deliveryAddress.province)
      if (provinces.length > 0) {
        provinceId = provinces[0].id
      }
    }

    if (deliveryAddress.district && provinceId) {
      const districts = thailandAddress.searchDistrict(deliveryAddress.district, provinceId)
      if (districts.length > 0) {
        districtId = districts[0].id
      }
    }

    if (zipCode && districtId) {
      const addresses = thailandAddress.getAddressByZipCode(zipCode)
      const matchingAddress = addresses.find(
        (addr) => addr.districtId === districtId
      )
      if (matchingAddress) {
        subDistrictId = matchingAddress.subDistrictId
      }
    }

    setAddressData({
      provinceId,
      districtId,
      subDistrictId,
      zipCode,
    })
    setShowEditModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this delivery address?')) return

    try {
      await deliveryAddressesService.delete(id)
      loadDeliveryAddresses()
    } catch (error) {
      console.error('Failed to delete delivery address:', error)
      alert(error.response?.data?.error || error.message || 'Failed to delete delivery address')
    }
  }


  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      address: '',
      province: '',
      district: '',
      postalCode: '',
      phone: '',
      email: '',
      status: 'Active',
    })
    setAddressData({
      provinceId: null,
      districtId: null,
      subDistrictId: null,
      zipCode: null,
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Delivery Addresses</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage delivery address locations for shipping</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setSelectedDeliveryAddress(null)
            setShowAddModal(true)
          }}
          className="bg-gray-900 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full hover:bg-gray-800 transition-all whitespace-nowrap"
        >
          + Add Delivery Address
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search by name or code..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            onClick={() => setFilters({ search: '', status: '', page: 1, limit: 20 })}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Delivery Addresses Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading delivery addresses..." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Province</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deliveryAddresses.map((deliveryAddress) => (
                    <tr key={deliveryAddress.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{deliveryAddress.code}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{deliveryAddress.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{deliveryAddress.province}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{deliveryAddress.district}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            deliveryAddress.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {deliveryAddress.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(deliveryAddress)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(deliveryAddress.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {deliveryAddresses.length === 0 && (
              <div className="text-center py-12 text-gray-500">No delivery addresses found</div>
            )}
          </>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add Delivery Address</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <AddressSelector
                      value={addressData}
                      onChange={setAddressData}
                      required={true}
                      showLabels={true}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Delivery Address</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <AddressSelector
                      value={addressData}
                      onChange={setAddressData}
                      required={true}
                      showLabels={true}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setSelectedDeliveryAddress(null)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
