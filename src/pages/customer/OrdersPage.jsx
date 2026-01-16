import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersService } from '../../services/orders.service';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

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
        return 'bg-yellow-50 text-yellow-700';
      case 'Processing':
        return 'bg-blue-50 text-blue-700';
      case 'Shipped':
        return 'bg-purple-50 text-purple-700';
      case 'Delivered':
        return 'bg-green-50 text-green-700';
      case 'Cancelled':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
                    {order.status}
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
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
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
              {order.status === 'Delivered' && (
                <button className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all">
                  Reorder
                </button>
              )}
              {order.status === 'Pending' && (
                <button className="px-4 py-2 text-sm rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
