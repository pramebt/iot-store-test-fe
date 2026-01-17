import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ordersService } from '../../services/orders.service';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import PaymentUploadModal from '../../components/customer/orders/PaymentUploadModal';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Upload,
  FileText
} from 'lucide-react';

export default function CustomerOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersService.getById(id);
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPayment = async (paymentSlipUrl) => {
    try {
      await ordersService.uploadPayment(order.id, paymentSlipUrl);
      await fetchOrderDetail(); // Refresh order data
      setShowPaymentModal(false);
    } catch (err) {
      throw err;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Processing':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'Shipped':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Order Not Found</h2>
          <p className="text-gray-500 mb-8">{error || 'The order you are looking for does not exist.'}</p>
          <Link to="/orders">
            <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all">
              Back to Orders
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/orders')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
              <p className="text-sm text-gray-500 mt-1">
                Order #{order.id.slice(0, 8)} • {formatDate(order.createdAt)}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="font-medium">{order.status}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
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

              {/* Order Summary */}
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

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              
              <div className="space-y-2 text-sm text-gray-700">
                {order.shippingAddress ? (
                  <>
                    <p>{order.shippingAddress}</p>
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

            {/* Payment Slip */}
            {order.paymentImage && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Payment Slip</h2>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={order.paymentImage}
                    alt="Payment Slip"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Status & Actions */}
          <div className="space-y-6">
            {/* Order Status Card */}
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

            {/* Actions */}
            {order.status === 'Pending' && !order.paymentImage && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-blue-900 mb-1">Payment Required</h3>
                  <p className="text-sm text-blue-700">Please upload your payment slip to process your order.</p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Payment Slip
                </button>
              </div>
            )}

            {order.status === 'Pending' && order.paymentImage && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <h3 className="font-semibold">Payment Uploaded</h3>
                </div>
                <p className="text-sm text-green-600">
                  Your payment slip has been received and is being verified.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Upload Modal */}
      {showPaymentModal && order && (
        <PaymentUploadModal
          order={order}
          onClose={() => setShowPaymentModal(false)}
          onUploadSuccess={handleUploadPayment}
        />
      )}
    </div>
  );
}
