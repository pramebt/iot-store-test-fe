import { Package, User, MapPin, Store, CreditCard, FileText, TrendingUp } from 'lucide-react';

// Order Items Section
export function OrderItemsSection({ order }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">รายการสินค้า</h2>
      </div>
      
      <div className="space-y-3">
        {order.items?.map((item) => (
          <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-20 h-20 shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
              {item.product?.imageUrl ? (
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {item.product?.name || 'Product'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                ฿{item.price?.toLocaleString()} × {item.quantity}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold text-gray-900">
                ฿{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">
            ฿{((order.totalAmount || 0) - (order.shippingFee || 0)).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping Fee</span>
          <span className="text-gray-900">฿{(order.shippingFee || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">฿{order.totalAmount?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// Customer Info Section
export function OrderCustomerInfo({ order }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">ข้อมูลลูกค้า</h2>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">ชื่อ</p>
          <p className="text-sm font-medium text-gray-900">{order.customer?.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">อีเมล</p>
          <p className="text-sm text-gray-900">{order.customer?.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">เบอร์โทร</p>
          <p className="text-sm text-gray-900">{order.phone || order.customer?.phone || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

// Delivery Address Section
export function OrderDeliveryAddressSection({ order }) {
  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">ที่อยู่จัดส่ง</h2>
        </div>
        <div className="space-y-2 text-sm text-gray-900">
          <p>{order.address || 'ไม่ระบุที่อยู่'}</p>
          {order.district && <p>{order.district}</p>}
          {order.province && <p>{order.province} {order.postalCode}</p>}
        </div>
      </div>

      {order.deliveryAddress ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-semibold text-blue-900">ที่อยู่จัดส่ง</h2>
          </div>
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-red-700" />
            <h2 className="text-lg font-semibold text-red-900">ไม่พบข้อมูลที่อยู่จัดส่ง</h2>
          </div>
          <p className="text-sm text-red-700">ที่อยู่จัดส่งอาจถูกลบหรือไม่พร้อมใช้งาน</p>
          <p className="text-xs text-red-600 mt-2">Delivery Address ID: {order.deliveryAddressId}</p>
          <p className="text-xs text-red-600">กรุณาตรวจสอบข้อมูลที่อยู่จัดส่ง</p>
        </div>
      ) : !order.salesLocation ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-yellow-700" />
            <h2 className="text-lg font-semibold text-yellow-900">สถานที่จัดส่ง</h2>
          </div>
          <p className="text-sm text-yellow-700">ยังไม่ได้เลือกที่อยู่จัดส่ง</p>
          <p className="text-xs text-yellow-600 mt-2">
            {order.province ? `จังหวัด: ${order.province}` : 'ไม่มีข้อมูลที่อยู่จัดส่ง'}
          </p>
          <p className="text-xs text-yellow-600">
            {order.salesLocationId ? 'มี SalesLocation แต่ไม่มี Delivery Address' : 'Order นี้เป็น Online Order แต่ยังไม่ได้เลือก Delivery Address'}
          </p>
          <p className="text-xs text-yellow-500 mt-2 italic">
            * Order นี้อาจถูกสร้างก่อนระบบ Delivery Address ทำงาน หรือมีปัญหาในการเลือก Delivery Address
          </p>
          {order.status === 'PENDING' || order.status === 'PAID' ? (
            <button
              onClick={() => alert('Feature: Assign Delivery Address - Coming soon')}
              className="mt-3 px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
            >
              เลือกที่อยู่จัดส่ง
            </button>
          ) : null}
        </div>
      ) : null}

      {order.salesLocation && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-5 h-5 text-green-700" />
            <h2 className="text-lg font-semibold text-green-900">
              {order.deliveryAddress ? 'สาขาที่มี Stock' : 'สาขาที่ขาย'}
            </h2>
          </div>
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

// Payment Section
export function OrderPaymentSection({ order }) {
  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">การชำระเงิน</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">สถานะ</span>
            <span className={`font-medium ${
              order.paymentAt ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {order.paymentAt ? 'ชำระแล้ว' : 'รอชำระเงิน'}
            </span>
          </div>
          {order.paymentAt && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">วันที่ชำระ</span>
              <span className="text-gray-900">
                {new Date(order.paymentAt).toLocaleDateString('th-TH')}
              </span>
            </div>
          )}
          {order.paymentImage && (
            <div>
              <p className="text-xs text-gray-600 mb-2">หลักฐานการโอนเงิน</p>
              <img 
                src={order.paymentImage} 
                alt="Payment slip"
                className="w-full rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      </div>

      {order.note && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">หมายเหตุ</h2>
          </div>
          <p className="text-sm text-gray-700">{order.note}</p>
        </div>
      )}

      {order.trackingNumber && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-700" />
            <h3 className="font-semibold text-blue-900">Tracking Number</h3>
          </div>
          <p className="text-lg font-mono font-semibold text-blue-700">
            {order.trackingNumber}
          </p>
        </div>
      )}
    </>
  );
}

// Timeline Section
export function OrderTimeline({ order, getStatusText }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">ประวัติออเดอร์</h2>
      </div>
      <div className="space-y-4">
        <div className="relative pl-6 space-y-4">
          <div className="relative">
            <div className="absolute left-[-24px] w-3 h-3 rounded-full bg-gray-900 border-2 border-white"></div>
            <div className="absolute left-[-18px] top-3 bottom-[-16px] w-0.5 bg-gray-200"></div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Order Created</p>
              <p className="text-xs text-gray-600 mt-1">
                {new Date(order.createdAt).toLocaleString('th-TH')}
              </p>
            </div>
          </div>
          {order.paymentAt && (
            <div className="relative">
              <div className="absolute left-[-24px] w-3 h-3 rounded-full bg-blue-600 border-2 border-white"></div>
              <div className="absolute left-[-18px] top-3 bottom-[-16px] w-0.5 bg-gray-200"></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Payment Received</p>
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(order.paymentAt).toLocaleString('th-TH')}
                </p>
              </div>
            </div>
          )}
          {order.status !== 'PENDING' && (
            <div className="relative">
              <div className={`absolute left-[-24px] w-3 h-3 rounded-full border-2 border-white ${
                order.status === 'DELIVERED' ? 'bg-green-600' :
                order.status === 'CANCELLED' ? 'bg-red-600' :
                order.status === 'CONFIRMED' ? 'bg-green-500' :
                'bg-yellow-500'
              }`}></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{getStatusText(order.status)}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(order.updatedAt).toLocaleString('th-TH')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
