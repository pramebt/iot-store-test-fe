import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ordersService } from '../../services/orders.service';
import { formatDate } from '../../utils/formatDate';
import {
  OrderItemsList,
  DeliveryInfoSection,
  OrderStatusCard
} from '../../components/customer/orders/CustomerOrderSections';
import CustomerPaymentUpload from '../../components/customer/orders/CustomerPaymentUpload';
import { 
  ArrowLeft, 
  Package, 
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2
} from 'lucide-react';

export default function CustomerOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersService.getById(id);
      console.log('Order data:', data);
      console.log('Delivery Address:', data.deliveryAddress);
      console.log('SalesLocation:', data.salesLocation);
      console.log('deliveryAddressId:', data.deliveryAddressId);
      console.log('salesLocationId:', data.salesLocationId);
      console.log('Order Type:', data.salesLocationId ? 'In-Store Order' : 'Online Order');
      console.log('Has Delivery Address:', data.deliveryAddressId ? 'Yes' : 'No');
      console.log('Has SalesLocation:', data.salesLocationId ? 'Yes' : 'No');
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
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
      <div className="min-h-screen bg-linear-to-b from-slate-50/40 via-white to-slate-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
          <div className="text-slate-600 font-light">กำลังโหลดรายละเอียดออเดอร์...</div>
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
            <OrderItemsList order={order} />
            <DeliveryInfoSection order={order} />

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
            <OrderStatusCard 
              order={order} 
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
            />

            <CustomerPaymentUpload 
              order={order} 
              onUploadSuccess={fetchOrderDetail}
            />

            {order.status === 'Pending' && order.paymentImage && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <h3 className="font-semibold">อัปโหลดสลิปแล้ว</h3>
                </div>
                <p className="text-sm text-green-600">
                  สลิปการชำระเงินของคุณได้รับการอัปโหลดแล้ว และสถานะออเดอร์จะถูกอัปเดตเป็น PAID
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
