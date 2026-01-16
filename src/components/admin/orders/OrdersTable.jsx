import { Link } from 'react-router-dom'

export default function OrdersTable({ orders, onStatusClick, getStatusColor }) {
  if (orders.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-gray-500">
        No orders found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                  {order.orderNumber}
                </Link>
                <div className="text-xs text-gray-500">{order.id.slice(0, 8)}...</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {order.customer?.name || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">{order.customer?.email}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {order.province ? (
                  <div>
                    <div>{order.province}</div>
                    <div className="text-xs text-gray-500">{order.district}</div>
                  </div>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                ฿{order.totalAmount?.toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onStatusClick(order)}
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </button>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <Link
                  to={`/admin/orders/${order.id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
