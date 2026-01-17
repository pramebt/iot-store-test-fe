import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../../utils/formatPrice';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleAddClick = (e) => {
    e.preventDefault();
    // Navigate to product detail page instead of adding to cart directly
    navigate(`/products/${product.id}`);
  };

  const isOutOfStock = product.stock === 0 || product.stock === null || product.stock === undefined;

  return (
    <div className={`bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all group relative ${isOutOfStock ? 'opacity-75' : ''}`}>
      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
          Out of Stock
        </div>
      )}
      
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square bg-gray-100 overflow-hidden relative">
          <img
            src={product.imageUrl || '/placeholder.jpg'}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'grayscale' : ''}`}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/20"></div>
          )}
        </div>
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <Link to={`/products/${product.id}`}>
          <h3 className={`font-medium mb-2 hover:text-gray-600 transition-colors ${isOutOfStock ? 'text-gray-500' : 'text-gray-900'}`}>
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
            <span className={`text-xl font-semibold ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
              {formatPrice(product.price)}
            </span>
            <div className={`text-xs ${isOutOfStock ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
              {isOutOfStock ? 'Out of Stock' : `Stock: ${product.stock}`}
            </div>
          </div>
          <button 
            onClick={handleAddClick}
            disabled={isOutOfStock}
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? 'Out of Stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
