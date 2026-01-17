import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ordersService } from '../../services/orders.service';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { Package, Clock, CheckCircle, XCircle, Truck, AlertTriangle, Loader2 } from 'lucide-react';

export default function OrdersPage() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  // Show success message for new order
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
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
      setError(err.message);
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
      setSuccessMessage('Order cancelled successfully');
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError(err.response?.data?.message || err.message || 'Failed to cancel order');
      setOrderToCancel(null);
    } finally {
      setCancelling(false);
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
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'PAID':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'CONFIRMED':
        return <Package className="w-5 h-5 text-purple-600" />;
      case 'SHIPPED':
        return <Truck className="w-5 h-5 text-indigo-600" />;
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700';
      case 'PAID':
        return 'bg-blue-50 text-blue-700';
      case 'CONFIRMED':
        return 'bg-purple-50 text-purple-700';
      case 'SHIPPED':
        return 'bg-indigo-50 text-indigo-700';
      case 'DELIVERED':
        return 'bg-green-50 text-green-700';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-semibold mb-4 text-gray-900">Login Required</h2>
          <p className="text-gray-500 mb-8 text-lg">
            Please login to view your orders
          </p>
          <Link to="/login">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all">
              Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center text-gray-600">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className="text-xl text-gray-900 mb-6">Error: {error}</div>
          <button 
            onClick={loadOrders}
            className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-semibold mb-4 text-gray-900">No Orders Yet</h2>
          <p className="text-gray-500 mb-8 text-lg">
            You haven't placed any orders yet
          </p>
          <Link to="/products">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all">
              Start Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900">My Orders</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
          <span>{successMessage}</span>
          <button 
            onClick={() => setSuccessMessage('')}
            className="text-green-600 hover:text-green-800"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Order #{order.id.slice(0, 8)}
                  </h3>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Placed on {formatDate(order.createdAt)}
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-2xl font-semibold text-gray-900">
                  {formatPrice(order.totalAmount)}
                </div>
                <div className="text-sm text-gray-500">
                  {order.items?.length || 0} item(s)
                </div>
              </div>
            </div>

            {/* Order Items */}
            {order.items && order.items.length > 0 && (
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={item.product?.imageUrl || '/placeholder.jpg'}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.product?.name || 'Product'}</div>
                        <div className="text-sm text-gray-500">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {formatPrice(item.quantity * item.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="text-sm">
                  <div className="font-medium mb-1 text-gray-900">Shipping Address:</div>
                  <div className="text-gray-500">
                    {order.shippingAddress}
                    {order.province && `, ${order.province}`}
                    {order.district && `, ${order.district}`}
                    {order.postalCode && ` ${order.postalCode}`}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-gray-100 pt-4 mt-4 flex gap-3">
              <Link to={`/orders/${order.id}`}>
                <button className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all">
                  View Details
                </button>
              </Link>
              
              {/* Show payment uploaded status */}
              {(normalizeStatus(order.status) === 'PENDING') && order.paymentImage && (
                <div className="px-4 py-2 text-sm rounded-full bg-green-50 text-green-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Payment Uploaded
                </div>
              )}
              
              {normalizeStatus(order.status) === 'DELIVERED' && (
                <button className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all">
                  Reorder
                </button>
              )}
              {(normalizeStatus(order.status) === 'PENDING') && (
                <button 
                  onClick={() => setOrderToCancel(order)}
                  className="px-4 py-2 text-sm rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all"
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => !cancelling && setOrderToCancel(null)}
          />

          {/* Modal */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Cancel Order</h2>
                    <p className="text-xs text-gray-600 mt-0.5">This action cannot be undone</p>
                  </div>
                </div>
                {!cancelling && (
                  <button
                    onClick={() => setOrderToCancel(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <p className="text-sm text-gray-700 mb-4">
                  Are you sure you want to cancel order <span className="font-semibold text-gray-900">#{orderToCancel.id.slice(0, 8)}</span>?
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Order Total:</span>
                      <span className="font-semibold text-gray-900">{formatPrice(orderToCancel.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Items:</span>
                      <span className="text-gray-900">{orderToCancel.items?.length || 0} item(s)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="text-gray-900">{formatDate(orderToCancel.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> You can only cancel orders with status "Pending". Once cancelled, this order cannot be restored.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setOrderToCancel(null)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={cancelling}
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
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
    </div>
  );
}
