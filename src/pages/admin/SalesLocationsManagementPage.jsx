import { useEffect, useState } from 'react'
import { salesLocationsService } from '../../services/salesLocations.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SalesLocationsTable from '../../components/admin/salesLocations/SalesLocationsTable'
import SalesLocationFilters from '../../components/admin/salesLocations/SalesLocationFilters'
import SalesLocationStockModal from '../../components/admin/salesLocations/SalesLocationStockModal'
import AddSalesLocationModal from '../../components/admin/salesLocations/AddSalesLocationModal'
import EditSalesLocationModal from '../../components/admin/salesLocations/EditSalesLocationModal'
import toast from '../../utils/toast'

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
      toast.error(error.response?.data?.message || error.message || 'ไม่สามารถโหลดข้อมูลสถานที่ขายได้')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (location) => {
    setSelectedLocation(location)
    setShowEditModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sales location?')) return

    try {
      await salesLocationsService.delete(id)
      toast.success('ลบสถานที่ขายสำเร็จ')
      loadSalesLocations()
    } catch (error) {
      console.error('Failed to delete sales location:', error)
      toast.error(error.response?.data?.message || error.response?.data?.error || error.message || 'ไม่สามารถลบสถานที่ขายได้')
    }
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
          onClick={() => setShowAddModal(true)}
          className="bg-gray-900 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full hover:bg-gray-800 transition-all whitespace-nowrap"
        >
          + Add Location
        </button>
      </div>

      <SalesLocationFilters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={() => setFilters({ search: '', status: '', page: 1, limit: 20 })}
      />

      {/* Sales Locations Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading sales locations..." />
        ) : (
          <SalesLocationsTable
            salesLocations={salesLocations}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onManageStock={() => {}}
            selectedLocationForStock={selectedLocationForStock}
            showStockModal={showStockModal}
            setShowStockModal={setShowStockModal}
            setSelectedLocationForStock={setSelectedLocationForStock}
          />
        )}
      </div>

      {/* Add Modal */}
      <AddSalesLocationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          loadSalesLocations()
          toast.success('สร้างสถานที่ขายสำเร็จ')
        }}
      />

      {/* Edit Modal */}
      <EditSalesLocationModal
        isOpen={showEditModal}
        location={selectedLocation}
        onClose={() => {
          setShowEditModal(false)
          setSelectedLocation(null)
        }}
        onSuccess={() => {
          loadSalesLocations()
          toast.success('อัปเดตสถานที่ขายสำเร็จ')
        }}
      />

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
