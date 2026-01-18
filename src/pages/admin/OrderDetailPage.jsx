import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersService } from '../../services/orders.service';
import OrderDeliveryMap from '../../components/admin/orders/OrderDeliveryMap';
import {
  OrderItemsSection,
  OrderCustomerInfo,
  OrderDeliveryAddressSection,
  OrderPaymentSection,
  OrderTimeline
} from '../../components/admin/orders/OrderDetailSections';
import {
  PaymentUploadSection,
  PaymentVerificationSection,
  ApprovePaymentModal,
  RejectPaymentModal
} from '../../components/admin/orders/PaymentActions';
import { 
  ArrowLeft, 
  Package, 
  Loader2
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
          <OrderItemsSection order={order} />
          
          <PaymentUploadSection 
            order={order} 
            onUploadSuccess={fetchOrderDetail}
          />

          <PaymentVerificationSection 
            order={order}
            onApprove={() => setShowApproveModal(true)}
            onReject={() => setShowRejectModal(true)}
            updatingStatus={updatingStatus}
          />

          <OrderTimeline order={order} getStatusText={getStatusText} />

          {/* Delivery Map */}
          <OrderDeliveryMap order={order} />
        </div>

        {/* Right Column - Customer & Payment Info */}
        <div className="space-y-6">
          <OrderCustomerInfo order={order} />
          
          <OrderDeliveryAddressSection order={order} />

          <OrderPaymentSection order={order} />
        </div>
      </div>

      {/* Modals */}
      <ApprovePaymentModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprovePayment}
        order={order}
        updatingStatus={updatingStatus}
      />

      <RejectPaymentModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectPayment}
        order={order}
        updatingStatus={updatingStatus}
      />
    </div>
  );
}
