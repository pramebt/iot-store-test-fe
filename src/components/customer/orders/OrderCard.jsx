import { Link } from 'react-router-dom'

export default function OrderCard({ order }) {
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
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items:</span>
          <span className="font-medium">{order.items?.length || 0} items</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total:</span>
          <span className="font-semibold text-blue-600">฿{order.totalAmount?.toLocaleString()}</span>
        </div>
        {order.trackingNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tracking:</span>
            <span className="font-medium">{order.trackingNumber}</span>
          </div>
        )}
      </div>

      <Link
        to={`/orders/${order.id}`}
        className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
      >
        View Details
      </Link>
    </div>
  )
}
