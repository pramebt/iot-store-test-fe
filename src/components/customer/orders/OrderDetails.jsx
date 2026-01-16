export default function OrderDetails({ order }) {
  if (!order) return null

  return (
    <div className="space-y-6">
      {/* Order Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Order Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="font-medium">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="font-medium">
              {new Date(order.createdAt).toLocaleDateString('th-TH')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-medium">{order.status}</p>
          </div>
          {order.trackingNumber && (
            <div>
              <p className="text-sm text-gray-600">Tracking Number</p>
              <p className="font-medium">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
        <p className="text-gray-700">{order.address}</p>
        {order.province && (
          <p className="text-gray-700 mt-1">
            {order.district}, {order.province} {order.postalCode}
          </p>
        )}
        <p className="text-gray-700 mt-1">Phone: {order.phone}</p>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0">
              <img
                src={item.product?.imageUrl || 'https://via.placeholder.com/80'}
                alt={item.product?.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product?.name}</h3>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">฿{item.price?.toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  ฿{((item.price || 0) * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-blue-600">฿{order.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Slip */}
      {order.paymentImage && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Payment Slip</h2>
          <img
            src={order.paymentImage}
            alt="Payment Slip"
            className="max-w-md rounded-lg border border-gray-200"
          />
        </div>
      )}
    </div>
  )
}
