import { Package, MapPin, Phone, FileText, Store } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';

// Order Items List
export function OrderItemsList({ order }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
        <Package className="w-5 h-5" />
        Order Items
      </h2>
      
      <div className="space-y-4">
        {order.items && order.items.length > 0 ? (
          order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                <img
                  src={item.product?.imageUrl || '/placeholder.jpg'}
                  alt={item.product?.name || 'Product'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item.product?.name || 'Product'}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-gray-900">
                  {formatPrice(item.quantity * item.price)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No items found</p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900 font-medium">{formatPrice(order.totalAmount)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}

// Delivery Info Section
export function DeliveryInfoSection({ order }) {
  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Shipping Address
        </h2>
        
        <div className="space-y-2 text-sm text-gray-700">
          {order.address ? (
            <>
              <p>{order.address}</p>
              {order.province && (
                <p>
                  {order.district && `${order.district}, `}
                  {order.province}
                  {order.postalCode && ` ${order.postalCode}`}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500">No shipping address provided</p>
          )}
        </div>

        {order.phone && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{order.phone}</span>
          </div>
        )}

        {order.note && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Notes</span>
            </div>
            <p className="text-sm text-gray-600">{order.note}</p>
          </div>
        )}
      </div>

      {order.deliveryAddress ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-blue-900 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            ที่อยู่จัดส่ง
          </h2>
          <div className="space-y-2 text-sm text-blue-900">
            <p className="font-medium">{order.deliveryAddress.name}</p>
            <p className="text-blue-700">Code: {order.deliveryAddress.code}</p>
            {order.deliveryAddress.address && (
              <p className="text-blue-700">{order.deliveryAddress.address}</p>
            )}
            {order.deliveryAddress.province && (
              <p className="text-blue-700">
                {order.deliveryAddress.district && `${order.deliveryAddress.district}, `}
                {order.deliveryAddress.province}
                {order.deliveryAddress.postalCode && ` ${order.deliveryAddress.postalCode}`}
              </p>
            )}
            {order.deliveryAddress.phone && (
              <p className="text-blue-700">Tel: {order.deliveryAddress.phone}</p>
            )}
          </div>
        </div>
      ) : order.deliveryAddressId ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-red-900 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            ไม่พบข้อมูลที่อยู่จัดส่ง
          </h2>
          <p className="text-sm text-red-700">ที่อยู่จัดส่งอาจถูกลบหรือไม่พร้อมใช้งาน</p>
          <p className="text-xs text-red-600 mt-2">Delivery Address ID: {order.deliveryAddressId}</p>
          <p className="text-xs text-red-600">กรุณาติดต่อผู้ดูแลระบบ</p>
        </div>
      ) : !order.salesLocation ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-yellow-900 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            สถานที่จัดส่ง
          </h2>
          <p className="text-sm text-yellow-700">ยังไม่ได้เลือกที่อยู่จัดส่ง</p>
          <p className="text-xs text-yellow-600 mt-2">
            {order.province ? `จังหวัด: ${order.province}` : 'ไม่มีข้อมูลที่อยู่จัดส่ง'}
          </p>
          <p className="text-xs text-yellow-600">
            {order.salesLocationId ? 'มี SalesLocation แต่ไม่มี Delivery Address' : 'Order นี้เป็น Online Order แต่ยังไม่ได้เลือก Delivery Address'}
          </p>
          <p className="text-xs text-yellow-500 mt-2 italic">
            * Order นี้อาจถูกสร้างก่อนระบบ Delivery Address ทำงาน กรุณาติดต่อผู้ดูแลระบบ
          </p>
        </div>
      ) : null}

      {order.salesLocation && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-green-900 flex items-center gap-2">
            <Store className="w-5 h-5" />
            {order.deliveryAddress ? 'สาขาที่มี Stock' : 'ซื้อที่สาขา'}
          </h2>
          <div className="space-y-2 text-sm text-green-900">
            <p className="font-medium">{order.salesLocation.name}</p>
            <p className="text-green-700">Code: {order.salesLocation.code}</p>
            {order.salesLocation.address && (
              <p className="text-green-700">{order.salesLocation.address}</p>
            )}
            {order.salesLocation.province && (
              <p className="text-green-700">
                {order.salesLocation.district && `${order.salesLocation.district}, `}
                {order.salesLocation.province}
                {order.salesLocation.postalCode && ` ${order.salesLocation.postalCode}`}
              </p>
            )}
            {order.salesLocation.phone && (
              <p className="text-green-700">Tel: {order.salesLocation.phone}</p>
            )}
            {order.deliveryAddress && (
              <p className="text-xs text-green-600 mt-2 italic">
                * Stock ลดจากสาขานี้ แต่ส่งจากที่อยู่จัดส่ง
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Order Status Card
export function OrderStatusCard({ order, getStatusIcon, getStatusColor, formatDate }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Order Status</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Status</p>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="font-medium text-sm">{order.status}</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Order Date</p>
          <p className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</p>
        </div>

        {order.paymentAt && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Payment Date</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(order.paymentAt)}</p>
          </div>
        )}

        {order.trackingNumber && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
            <p className="text-sm font-mono font-medium text-gray-900">{order.trackingNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
}
