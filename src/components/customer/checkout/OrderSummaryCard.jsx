import { Store, MapPin, Truck, Loader2 } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';

export default function OrderSummaryCard({
  items,
  subtotal,
  shipping,
  total,
  shippingInfo,
  hasSelectedLocation,
  calculatingShipping,
  loading,
  onBackToCart
}) {
  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h2>
        
        {/* Items */}
        <div className="space-y-4 mb-6">
          {items.map(item => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                <img
                  src={item.imageUrl || '/placeholder.png'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-gray-900 truncate">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatPrice(item.price)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-sm text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Info */}
        {(() => {
          if (hasSelectedLocation && shippingInfo?.salesLocation) {
            // In-Store Order: Show SalesLocation (ส่งจากสาขา)
            return (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <Store className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-green-900">ส่งจาก</p>
                    <p className="text-sm text-green-800">{shippingInfo.salesLocation.name}</p>
                    <p className="text-xs text-green-600">{shippingInfo.salesLocation.province}</p>
                  </div>
                </div>
                {shippingInfo.estimatedShipping && (
                  <div className="flex items-center gap-2 mt-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    <p className="text-xs text-green-700">
                      ระยะเวลาจัดส่งประมาณ: {shippingInfo.estimatedShipping}
                    </p>
                  </div>
                )}
              </div>
            );
          } else if (shippingInfo?.deliveryAddress) {
            // Online Order: Show DeliveryAddress (ส่งจากสถานที่ส่ง)
            return (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-blue-900">ส่งจาก</p>
                    <p className="text-sm text-blue-800">{shippingInfo.deliveryAddress.name}</p>
                    <p className="text-xs text-blue-600">{shippingInfo.deliveryAddress.province}</p>
                  </div>
                </div>
                {shippingInfo.estimatedShipping && (
                  <div className="flex items-center gap-2 mt-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-blue-700">
                      ระยะเวลาจัดส่งประมาณ: {shippingInfo.estimatedShipping}
                    </p>
                  </div>
                )}
              </div>
            );
          }
          return null;
        })()}

        {/* Totals */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-2">
              Shipping
              {calculatingShipping && (
                <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />
              )}
            </span>
            <span className="text-gray-900 font-medium">
              {calculatingShipping ? (
                <span className="text-slate-400 font-light text-xs">กำลังคำนวณ...</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>
          <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-4">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">
              {calculatingShipping ? (
                <span className="text-slate-400 font-light text-xs">กำลังคำนวณ...</span>
              ) : (
                formatPrice(total)
              )}
            </span>
          </div>
        </div>

        {/* Action Buttons - Desktop */}
        <div className="hidden lg:flex flex-col gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                กำลังดำเนินการ...
              </span>
            ) : (
              'ยืนยันการสั่งซื้อ'
            )}
          </button>
          <button
            type="button"
            onClick={onBackToCart}
            className="w-full px-6 py-3.5 text-gray-900 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
