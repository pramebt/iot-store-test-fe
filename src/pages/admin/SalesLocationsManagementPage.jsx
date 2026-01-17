import { useEffect, useState } from 'react'
import { salesLocationsService } from '../../services/salesLocations.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import AddressSelector from '../../components/common/AddressSelector'
import SalesLocationStockModal from '../../components/admin/salesLocations/SalesLocationStockModal'
import { thailandAddress } from '../../utils/thailandAddress'

export default function SalesLocationsManagementPage() {
  const [salesLocations, setSalesLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedLocationForStock, setSelectedLocationForStock] = useState(null)
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
    latitude: '',
    longitude: '',
    locationType: 'STORE',
    status: 'Active',
  })
  const [addressData, setAddressData] = useState({
    provinceId: null,
    districtId: null,
    subDistrictId: null,
    zipCode: null,
  })

  useEffect(() => {
    loadSalesLocations()
  }, [filters])

  const loadSalesLocations = async () => {
    try {
      setLoading(true)
      const data = await salesLocationsService.getAll(filters)
      setSalesLocations(data.salesLocations || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to load sales locations:', error)
      alert('Failed to load sales locations')
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

      if (selectedLocation) {
        await salesLocationsService.update(selectedLocation.id, submitData)
      } else {
        await salesLocationsService.create(submitData)
      }
      setShowAddModal(false)
      setShowEditModal(false)
      setSelectedLocation(null)
      resetForm()
      loadSalesLocations()
    } catch (error) {
      console.error('Failed to save sales location:', error)
      alert(error.response?.data?.error || error.message || 'Failed to save sales location')
    }
  }

  const handleEdit = (location) => {
    setSelectedLocation(location)
    setFormData({
      name: location.name,
      latitude: location.latitude || '',
      longitude: location.longitude || '',
      locationType: location.locationType || 'STORE',
      code: location.code,
      address: location.address,
      province: location.province,
      district: location.district,
      postalCode: location.postalCode || '',
      phone: location.phone || '',
      email: location.email || '',
      status: location.status,
    })

    // Convert province, district, postalCode to addressData
    let provinceId = null
    let districtId = null
    let subDistrictId = null
    let zipCode = location.postalCode || null

    if (location.province) {
      const provinces = thailandAddress.searchProvince(location.province)
      if (provinces.length > 0) {
        provinceId = provinces[0].id
      }
    }

    if (location.district && provinceId) {
      const districts = thailandAddress.searchDistrict(location.district, provinceId)
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
    if (!confirm('Are you sure you want to delete this sales location?')) return

    try {
      await salesLocationsService.delete(id)
      loadSalesLocations()
    } catch (error) {
      console.error('Failed to delete sales location:', error)
      alert(error.response?.data?.error || error.message || 'Failed to delete sales location')
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
      latitude: '',
      longitude: '',
      locationType: 'STORE',
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
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Sales Locations</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your store locations</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setSelectedLocation(null)
            setShowAddModal(true)
          }}
          className="bg-gray-900 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full hover:bg-gray-800 transition-all whitespace-nowrap"
        >
          + Add Location
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

      {/* Sales Locations Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading sales locations..." />
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
                  {salesLocations.map((location) => (
                    <tr key={location.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{location.code}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{location.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{location.province}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{location.district}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            location.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {location.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(location)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLocationForStock(location)
                              setShowStockModal(true)
                            }}
                            className="text-green-600 hover:text-green-800"
                          >
                            Manage Stock
                          </button>
                          <button
                            onClick={() => handleDelete(location.id)}
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
            {salesLocations.length === 0 && (
              <div className="text-center py-12 text-gray-500">No sales locations found</div>
            )}
          </>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add Sales Location</h2>
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
              <h2 className="text-xl font-semibold mb-4">Edit Sales Location</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                    <select
                      value={formData.locationType}
                      onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="STORE">ร้านค้า</option>
                      <option value="WAREHOUSE">โกดัง</option>
                      <option value="IOT_POINT">จุดติดตั้ง IoT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="13.7563"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="100.5018"
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
                      setSelectedLocation(null)
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

      {/* Stock Management Modal */}
      {showStockModal && selectedLocationForStock && (
        <SalesLocationStockModal
          isOpen={showStockModal}
          salesLocation={selectedLocationForStock}
          onClose={() => {
            setShowStockModal(false)
            setSelectedLocationForStock(null)
          }}
        />
      )}
    </div>
  )
}
