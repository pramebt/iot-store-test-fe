import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsService } from '../../services/products.service';
import { useCartStore } from '../../store/cartStore';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { formatPrice } from '../../utils/formatPrice';
import { ArrowLeft, ShoppingCart, Package, Shield, Truck } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getById(id);
      setProduct(data.product);
    } catch (err) {
      setError(err.message);
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    }, quantity);
    // Show success message or redirect to cart
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className="text-xl text-gray-900 mb-6">
            {error || 'Product not found'}
          </div>
          <button 
            onClick={() => navigate('/products')}
            className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={product.imageUrl || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-semibold mb-4 text-gray-900">{product.name}</h1>
          
          {product.category && (
            <div className="mb-4">
              <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                {product.category.name}
              </span>
            </div>
          )}

          <div className="text-4xl font-semibold text-gray-900 mb-8">
            {formatPrice(product.price)}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium mb-3 text-gray-900">Description</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Stock Status */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Stock:</span>
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Status: <span className={`font-medium ${product.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}>
                {product.status}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block font-medium mb-3 text-gray-900">Quantity:</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <span className="text-lg">-</span>
                </button>
                <span className="text-xl font-medium w-12 text-center text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className="w-full bg-gray-900 text-white py-4 rounded-full hover:bg-gray-800 transition-all font-medium mb-8 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Features */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-sm text-gray-700">Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-sm text-gray-700">1 year warranty included</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-sm text-gray-700">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
