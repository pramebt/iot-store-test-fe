import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ordersService } from '../../services/orders.service';
import { useAuthStore } from '../../store/authStore';
import PaymentUploadModal from '../../components/customer/orders/PaymentUploadModal';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { Package, Clock, CheckCircle, XCircle, Truck, AlertTriangle, Loader2, Upload } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import toast from '../../utils/toast';

export default function OrdersPage() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [orderToUpload, setOrderToUpload] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Show success message for new order
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      // Clear the state to prevent re-showing on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersService.getAll();
      setOrders(data.orders || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'ไม่สามารถโหลดข้อมูลออเดอร์ได้';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    
    try {
      setCancelling(true);
      await ordersService.cancel(orderToCancel.id);
      // Reload orders to get updated status
      await loadOrders();
      setOrderToCancel(null);
      toast.success('Order cancelled successfully');
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to cancel order');
      setOrderToCancel(null);
    } finally {
      setCancelling(false);
    }
  };

  const handleUploadPayment = async (paymentSlipUrl) => {
    if (!orderToUpload) return;
    
    try {
      await ordersService.uploadPayment(orderToUpload.id, paymentSlipUrl);
      // Reload orders to get updated status
      await loadOrders();
      setOrderToUpload(null);
      toast.success('Payment slip uploaded successfully. Your order status will be updated to PAID after verification.');
    } catch (err) {
      console.error('Error uploading payment:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to upload payment slip');
      throw err; // Re-throw to let modal handle it
    }
  };

  // Helper function to normalize status (handle both uppercase and capitalized)
  const normalizeStatus = (status) => {
    if (!status) return '';
    return status.toUpperCase();
  };

  const getStatusIcon = (status) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'PAID':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'CONFIRMED':
        return <Package className="w-4 h-4 text-indigo-600" />;
      case 'SHIPPED':
        return <Truck className="w-4 h-4 text-purple-600" />;
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Package className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'PENDING':
        return 'bg-amber-50/90 text-amber-600 border border-amber-200/60';
      case 'PAID':
        return 'bg-blue-50/90 text-blue-700 border border-blue-200/60';
      case 'CONFIRMED':
        return 'bg-indigo-50/90 text-indigo-700 border border-indigo-200/60';
      case 'SHIPPED':
        return 'bg-purple-50/90 text-purple-700 border border-purple-200/60';
      case 'DELIVERED':
        return 'bg-green-50/90 text-green-700 border border-green-200/60';
      case 'CANCELLED':
        return 'bg-red-50/90 text-red-600 border border-red-200/60';
      default:
        return 'bg-slate-100/90 text-slate-600 border border-slate-200/60';
    }
  };

  const getStatusText = (status) => {
    const normalized = normalizeStatus(status);
    const statusMap = {
      'PENDING': 'Pending',
      'PAID': 'Paid',
      'CONFIRMED': 'Confirmed',
      'SHIPPED': 'Shipped',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled',
    };
    return statusMap[normalized] || status;
  };

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto text-center py-32">
          <div className="w-24 h-24 bg-linear-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Package className="w-12 h-12 text-slate-500" />
          </div>
          <h2 className="text-4xl font-semibold mb-3 text-slate-800 tracking-tight">ต้องเข้าสู่ระบบ</h2>
          <p className="text-slate-600 mb-10 text-lg font-light">
            กรุณาเข้าสู่ระบบเพื่อดูออเดอร์ของคุณ
          </p>
          <Link to="/login">
            <button className="bg-slate-800 text-white px-8 py-3.5 rounded-full hover:bg-slate-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md">
              เข้าสู่ระบบ
            </button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-32">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
          <div className="text-slate-600 font-light">กำลังโหลดออเดอร์...</div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-32">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-xl text-slate-800 mb-2 font-medium">เกิดข้อผิดพลาด</div>
          <div className="text-slate-600 mb-8 font-light">{error}</div>
          <button 
            onClick={loadOrders}
            className="bg-slate-800 text-white px-6 py-2.5 rounded-full hover:bg-slate-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
          >
            ลองอีกครั้ง
          </button>
        </div>
      </PageContainer>
    );
  }

  if (orders.length === 0) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto text-center py-32">
          <div className="w-24 h-24 bg-linear-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Package className="w-12 h-12 text-slate-500" />
          </div>
          <h2 className="text-4xl font-semibold mb-3 text-slate-800 tracking-tight">ยังไม่มีออเดอร์</h2>
          <p className="text-slate-600 mb-10 text-lg font-light">
            คุณยังไม่ได้สั่งซื้อสินค้า
          </p>
          <Link to="/products">
            <button className="bg-slate-800 text-white px-8 py-3.5 rounded-full hover:bg-slate-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md">
              เริ่มช้อปปิ้ง
            </button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50/40 via-white to-slate-50/30">
      <PageContainer>
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-semibold mb-3 text-slate-800 tracking-tight">ออเดอร์ของฉัน</h1>
          <p className="text-slate-600 text-lg font-light">ดูและจัดการออเดอร์ของคุณ</p>
        </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
                    Order #{order.id.slice(0, 8)}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="text-sm text-slate-600 font-light">
                  สั่งซื้อเมื่อ {formatDate(order.createdAt)}
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-3xl font-semibold text-slate-800 tracking-tight mb-1">
                  {formatPrice(order.totalAmount)}
                </div>
                <div className="text-sm text-slate-600 font-light">
                  {order.items?.length || 0} รายการ
                </div>
              </div>
            </div>

            {/* Order Items */}
            {order.items && order.items.length > 0 && (
              <div className="border-t border-slate-200/60 pt-6 mt-6">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-200/60">
                        <img
                          src={item.product?.imageUrl || '/placeholder.jpg'}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 mb-1 text-base">{item.product?.name || 'Product'}</div>
                        <div className="text-sm text-slate-600 font-light">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </div>
                      </div>
                      <div className="font-semibold text-slate-800 text-lg">
                        {formatPrice(item.quantity * item.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Address */}
            {order.address && (
              <div className="border-t border-slate-200/60 pt-6 mt-6">
                <div className="text-sm">
                  <div className="font-semibold mb-2 text-slate-800 text-xs uppercase tracking-wider">Shipping Address</div>
                  <div className="text-slate-600 font-light leading-relaxed">
                    {order.address}
                    {order.province && `, ${order.province}`}
                    {order.district && `, ${order.district}`}
                    {order.postalCode && ` ${order.postalCode}`}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-slate-200/60 pt-6 mt-6 flex gap-2.5 flex-wrap">
              <Link to={`/orders/${order.id}`}>
                <button className="px-5 py-2.5 text-sm rounded-full bg-slate-100/90 text-slate-800 hover:bg-slate-200/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                  View Details
                </button>
              </Link>
              
              {/* Upload Payment Slip for PENDING orders without payment */}
              {(normalizeStatus(order.status) === 'PENDING' && !order.paymentImage) && (
                <button 
                  onClick={() => setOrderToUpload(order)}
                  className="px-5 py-2.5 text-sm rounded-full bg-slate-100/90 text-blue-700 hover:bg-slate-200/90 transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  Upload Payment
                </button>
              )}
              
              {/* Show payment uploaded status */}
              {(normalizeStatus(order.status) === 'PENDING') && order.paymentImage && (
                <div className="px-5 py-2.5 text-sm rounded-full bg-slate-100/90 text-green-700 flex items-center gap-2 font-medium shadow-sm">
                  <CheckCircle className="w-4 h-4" />
                  Payment Uploaded
                </div>
              )}
              
              {normalizeStatus(order.status) === 'DELIVERED' && (
                <button className="px-5 py-2.5 text-sm rounded-full bg-slate-100/90 text-slate-800 hover:bg-slate-200/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                  Reorder
                </button>
              )}
              {(normalizeStatus(order.status) === 'PENDING') && (
                <button 
                  onClick={() => setOrderToCancel(order)}
                  className="px-5 py-2.5 text-sm rounded-full bg-slate-100/90 text-red-600 hover:bg-slate-200/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Order Confirmation Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => !cancelling && setOrderToCancel(null)}
          />

          {/* Modal */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-slate-200/60 overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-200/60 flex items-center justify-between bg-linear-to-b from-white to-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shadow-sm">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Cancel Order</h2>
                    <p className="text-xs text-slate-600 mt-1 font-light">This action cannot be undone</p>
                  </div>
                </div>
                {!cancelling && (
                  <button
                    onClick={() => setOrderToCancel(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-2 rounded-full hover:bg-slate-100/50"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="px-8 py-6">
                <p className="text-sm text-slate-700 mb-6 font-light leading-relaxed">
                  Are you sure you want to cancel order <span className="font-semibold text-slate-800">#{orderToCancel.id.slice(0, 8)}</span>?
                </p>
                
                <div className="bg-slate-50/90 rounded-2xl p-5 mb-5 border border-slate-200/60">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-light">Order Total</span>
                      <span className="font-semibold text-slate-800">{formatPrice(orderToCancel.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-light">Items</span>
                      <span className="text-slate-800 font-medium">{orderToCancel.items?.length || 0} item{orderToCancel.items?.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-light">Order Date</span>
                      <span className="text-slate-800 font-medium">{formatDate(orderToCancel.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50/90 border border-orange-200/60 rounded-2xl p-4">
                  <p className="text-xs text-orange-800 font-light leading-relaxed">
                    <span className="font-semibold">Note:</span> You can only cancel orders with status "Pending". Once cancelled, this order cannot be restored.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-slate-200/60 flex gap-3 justify-end bg-linear-to-b from-slate-50/30 to-white">
                <button
                  type="button"
                  onClick={() => setOrderToCancel(null)}
                  className="px-6 py-2.5 text-sm border border-slate-300/60 rounded-full hover:bg-slate-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  disabled={cancelling}
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-6 py-2.5 text-sm bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Cancel Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Upload Modal */}
      {orderToUpload && (
        <PaymentUploadModal
          order={orderToUpload}
          onClose={() => setOrderToUpload(null)}
          onUploadSuccess={handleUploadPayment}
        />
      )}
      </PageContainer>
    </div>
  );
}
