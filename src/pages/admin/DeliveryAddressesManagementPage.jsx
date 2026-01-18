import { useEffect, useState } from 'react'
import { deliveryAddressesService } from '../../services/deliveryAddresses.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DeliveryAddressesTable from '../../components/admin/deliveryAddresses/DeliveryAddressesTable'
import DeliveryAddressFilters from '../../components/admin/deliveryAddresses/DeliveryAddressFilters'
import AddDeliveryAddressModal from '../../components/admin/deliveryAddresses/AddDeliveryAddressModal'
import EditDeliveryAddressModal from '../../components/admin/deliveryAddresses/EditDeliveryAddressModal'
import toast from '../../utils/toast'

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
      toast.error(error.response?.data?.message || error.message || 'ไม่สามารถโหลดข้อมูลที่อยู่จัดส่งได้')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (deliveryAddress) => {
    setSelectedDeliveryAddress(deliveryAddress)
    setShowEditModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery address?')) return

    try {
      await deliveryAddressesService.delete(id)
      toast.success('ลบที่อยู่จัดส่งสำเร็จ')
      loadDeliveryAddresses()
    } catch (error) {
      console.error('Failed to delete delivery address:', error)
      toast.error(error.response?.data?.message || error.response?.data?.error || error.message || 'ไม่สามารถลบที่อยู่จัดส่งได้')
    }
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
          onClick={() => setShowAddModal(true)}
          className="bg-gray-900 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full hover:bg-gray-800 transition-all whitespace-nowrap"
        >
          + Add Delivery Address
        </button>
      </div>

      <DeliveryAddressFilters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={() => setFilters({ search: '', status: '', page: 1, limit: 20 })}
      />

      {/* Delivery Addresses Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading delivery addresses..." />
        ) : (
          <DeliveryAddressesTable
            deliveryAddresses={deliveryAddresses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Add Modal */}
      <AddDeliveryAddressModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          loadDeliveryAddresses()
          toast.success('สร้างที่อยู่จัดส่งสำเร็จ')
        }}
      />

      {/* Edit Modal */}
      <EditDeliveryAddressModal
        isOpen={showEditModal}
        deliveryAddress={selectedDeliveryAddress}
        onClose={() => {
          setShowEditModal(false)
          setSelectedDeliveryAddress(null)
        }}
        onSuccess={() => {
          loadDeliveryAddresses()
          toast.success('อัปเดตที่อยู่จัดส่งสำเร็จ')
        }}
      />

    </div>
  )
}
