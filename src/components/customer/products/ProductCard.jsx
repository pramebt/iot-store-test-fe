import { Link } from 'react-router-dom';
import { useCartStore } from '../../../store/cartStore';
import Card from '../../common/Card';
import Button from '../../common/Button';
import { formatPrice } from '../../../utils/formatPrice';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    }, 1);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.imageUrl || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-3 flex-1 line-clamp-2">
          {product.description}
        </p>
        {product.category?.name && (
          <div className="mb-3">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.category.name}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-semibold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <div className="text-xs text-gray-400">
              Stock: {product.stock}
            </div>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
