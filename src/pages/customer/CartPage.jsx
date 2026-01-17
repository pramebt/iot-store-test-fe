import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { formatPrice } from '../../utils/formatPrice';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(item.id, item.selectedLocationId);
    } else {
      updateQuantity(item.id, newQuantity, item.selectedLocationId);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-semibold mb-4 text-gray-900">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 text-lg">
            Start shopping to add items to your cart
          </p>
          <Link to="/products">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const total = getTotal();
  const shipping = total > 100 ? 0 : 10;
  const finalTotal = total + shipping;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Continue Shopping
      </button>

      <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 flex gap-6"
            >
              {/* Product Image */}
              <Link to={`/products/${item.id}`}>
                <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={item.imageUrl || '/placeholder.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="flex-1 flex flex-col">
                <Link to={`/products/${item.id}`}>
                  <h3 className="font-medium text-lg text-gray-900 hover:text-gray-600 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <div className="text-gray-900 font-semibold mt-1">
                  {formatPrice(item.price)}
                </div>
                {item.selectedLocationId ? (
                  <div className="text-xs text-gray-500 mt-1">
                    สถานที่ขาย: {item.selectedLocationType === 'WAREHOUSE' ? 'ที่อยู่จัดส่ง' : 
                                item.selectedLocationType === 'IOT_POINT' ? 'จุดติดตั้ง IoT' : 
                                'ร้านค้า'}
                    <span className="ml-2 text-green-600">(In-Store Order)</span>
                  </div>
                ) : (
                  <div className="text-xs text-blue-500 mt-1">
                    ส่งสินค้าไปบ้าน (Online Order)
                  </div>
                )}

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-auto">
                  <button
                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <span className="font-medium w-8 text-center text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Item Total & Remove */}
              <div className="text-right flex flex-col items-end">
                <div className="font-semibold text-lg text-gray-900 mb-2">
                  {formatPrice(item.price * item.quantity)}
                </div>
                <button
                  onClick={() => removeItem(item.id, item.selectedLocationId)}
                  className="mt-auto w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors group"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                </button>
              </div>
            </div>
          ))}

          {/* Clear Cart */}
          <button
            onClick={clearCart}
            className="flex items-center text-gray-500 hover:text-red-600 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {total < 100 && (
                <div className="text-sm text-gray-500 bg-white rounded-lg p-3">
                  Add {formatPrice(100 - total)} more for free shipping
                </div>
              )}
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-semibold text-xl text-gray-900">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gray-900 text-white py-3 rounded-full hover:bg-gray-800 transition-all mb-3 font-medium"
            >
              Proceed to Checkout
            </button>

            <Link to="/products">
              <button className="w-full text-gray-900 py-3 rounded-full hover:bg-gray-100 transition-all font-medium">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
