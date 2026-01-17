import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersService } from '../../services/orders.service';
import OrderDeliveryMap from '../../components/admin/orders/OrderDeliveryMap';
import { 
  ArrowLeft, 
  Package, 
  User, 
  Phone, 
  Calendar, 
  Clock,
  CreditCard,
  FileText,
  TrendingUp,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const data = await ordersService.getById(id);
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      PAID: 'bg-blue-100 text-blue-800 border-blue-200',
      CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
      PROCESSING: 'bg-purple-100 text-purple-800 border-purple-200',
      SHIPPED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      DELIVERED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: 'รอชำระเงิน',
      PAID: 'ชำระเงินแล้ว',
      CONFIRMED: 'ยืนยันการชำระเงินแล้ว',
      PROCESSING: 'กำลังจัดเตรียม',
      SHIPPED: 'จัดส่งแล้ว',
      DELIVERED: 'ส่งถึงแล้ว',
      CANCELLED: 'ยกเลิก',
    };
    return texts[status] || status;
  };

  const handleApprovePayment = async () => {
    try {
      setUpdatingStatus(true);
      const updatedOrder = await ordersService.updateStatus(id, 'CONFIRMED');
      setOrder(updatedOrder);
      setShowApproveModal(false);
    } catch (err) {
      console.error('Error approving payment:', err);
      setError(err.response?.data?.message || err.message || 'Failed to approve payment');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRejectPayment = async () => {
    try {
      setUpdatingStatus(true);
      const updatedOrder = await ordersService.updateStatus(id, 'PENDING');
      setOrder(updatedOrder);
      setShowRejectModal(false);
    } catch (err) {
      console.error('Error rejecting payment:', err);
      setError(err.response?.data?.message || err.message || 'Failed to reject payment');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-sm text-gray-600 mt-1">
              Order #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString('th-TH', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-4 py-2 rounded-lg border font-semibold ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">รายการสินค้า</h2>
            </div>
            
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                  {/* Product Image */}
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

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.product?.name || 'Product'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      ฿{item.price?.toLocaleString()} × {item.quantity}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-gray-900">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
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

          {/* Payment Verification Section */}
          {order.status === 'PAID' && order.paymentImage && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-blue-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-700" />
                <h2 className="text-lg font-semibold text-gray-900">Payment Verification</h2>
                <span className="ml-auto px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  Awaiting Review
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Payment Slip Submitted</p>
                  <div className="relative group">
                    <img 
                      src={order.paymentImage} 
                      alt="Payment slip"
                      className="w-full rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => window.open(order.paymentImage, '_blank')}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/5 rounded-lg transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">Click to view full size</span>
                    </div>
                  </div>
                </div>

                {order.paymentAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Payment Date: {new Date(order.paymentAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowApproveModal(true)}
                    disabled={updatingStatus}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Payment
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={updatingStatus}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Order History / Timeline */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">ประวัติออเดอร์</h2>
            </div>

            <div className="space-y-4">
              {/* Timeline */}
              <div className="relative pl-6 space-y-4">
                {/* Created */}
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

                {/* Paid */}
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

                {/* Current Status */}
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

          {/* Delivery Map */}
          <OrderDeliveryMap order={order} />
        </div>

        {/* Right Column - Customer & Payment Info */}
        <div className="space-y-6">
          {/* Customer Info */}
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

          {/* Shipping Address */}
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

          {/* Payment Info */}
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

          {/* Additional Info */}
          {order.note && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">หมายเหตุ</h2>
              </div>
              <p className="text-sm text-gray-700">{order.note}</p>
            </div>
          )}

          {/* Tracking Number */}
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
        </div>
      </div>

      {/* Approve Payment Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !updatingStatus && setShowApproveModal(false)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Approve Payment</h2>
                    <p className="text-xs text-gray-600 mt-0.5">Confirm payment verification</p>
                  </div>
                </div>
                {!updatingStatus && (
                  <button
                    onClick={() => setShowApproveModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="px-6 py-4">
                <p className="text-sm text-gray-700 mb-4">
                  Are you sure you want to approve this payment? The order status will be changed to <span className="font-semibold text-green-600">CONFIRMED</span>.
                </p>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 mb-1">Order Number</p>
                  <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowApproveModal(false)}
                  disabled={updatingStatus}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApprovePayment}
                  disabled={updatingStatus}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {updatingStatus ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Approve Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Payment Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !updatingStatus && setShowRejectModal(false)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Reject Payment</h2>
                    <p className="text-xs text-gray-600 mt-0.5">This will reset the order status</p>
                  </div>
                </div>
                {!updatingStatus && (
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="px-6 py-4">
                <p className="text-sm text-gray-700 mb-4">
                  Are you sure you want to reject this payment? The order status will be changed back to <span className="font-semibold text-yellow-600">PENDING</span> and the customer will need to resubmit payment.
                </p>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 mb-1">Order Number</p>
                  <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  disabled={updatingStatus}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRejectPayment}
                  disabled={updatingStatus}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {updatingStatus ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Reject Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
