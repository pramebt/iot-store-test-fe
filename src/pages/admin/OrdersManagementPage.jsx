import { useEffect, useState } from 'react'
import { ordersService } from '../../services/orders.service'
import OrdersTable from '../../components/admin/orders/OrdersTable'
import OrdersFilters from '../../components/admin/orders/OrdersFilters'
import OrderStatusModal from '../../components/admin/orders/OrderStatusModal'
import OrderStatsCards from '../../components/admin/orders/OrderStatsCards'
import Pagination from '../../components/admin/products/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10
  })
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    loadOrders()
  }, [filters])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      }
      const data = await ordersService.getAll(params)
      setOrders(data.orders || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async () => {
    if (!selectedOrder || !newStatus) return

    try {
      await ordersService.updateStatus(selectedOrder.id, newStatus)
      setShowStatusModal(false)
      setSelectedOrder(null)
      setNewStatus('')
      loadOrders()
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update order status')
    }
  }

  const openStatusModal = (order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setShowStatusModal(true)
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-blue-100 text-blue-800',
      CONFIRMED: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Orders</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage and track all customer orders</p>
      </div>

      {/* Stats */}
      <OrderStatsCards orders={orders} />

      {/* Filters */}
      <OrdersFilters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={() => setFilters({ status: '', search: '', page: 1, limit: 10 })}
      />

      {/* Orders Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading orders..." />
        ) : (
          <>
            <OrdersTable
              orders={orders}
              onStatusClick={openStatusModal}
              getStatusColor={getStatusColor}
            />
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          </>
        )}
      </div>

      {/* Status Update Modal */}
      <OrderStatusModal
        isOpen={showStatusModal}
        order={selectedOrder}
        newStatus={newStatus}
        onStatusChange={setNewStatus}
        onSubmit={handleStatusChange}
        onClose={() => {
          setShowStatusModal(false)
          setSelectedOrder(null)
          setNewStatus('')
        }}
      />
    </div>
  )
}
