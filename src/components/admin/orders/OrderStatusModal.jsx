export default function OrderStatusModal({ 
  isOpen, 
  order, 
  newStatus, 
  onStatusChange, 
  onSubmit, 
  onClose 
}) {
  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Order Status</h2>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Order: {order.orderNumber}</p>
          <p className="text-sm text-gray-600">Current Status: {order.status}</p>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Status
          </label>
          <select
            value={newStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  )
}
