import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../../utils/formatPrice';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleAddClick = (e) => {
    e.preventDefault();
    // Navigate to product detail page instead of adding to cart directly
    navigate(`/products/${product.id}`);
  };

  const isOutOfStock = product.stock === 0 || product.stock === null || product.stock === undefined;
  const hasDiscount = product.basePrice && product.price < product.basePrice;
  const discountPercent = hasDiscount 
    ? Math.round(((product.basePrice - product.price) / product.basePrice) * 100)
    : 0;

  return (
    <div className={`bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group relative flex flex-col h-full ${isOutOfStock ? 'opacity-75' : ''}`}>
      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
          Out of Stock
        </div>
      )}

      {/* Discount Badge */}
      {hasDiscount && !isOutOfStock && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
          -{discountPercent}%
        </div>
      )}
      
      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="block shrink-0">
        <div className="aspect-square bg-gray-100 overflow-hidden relative">
          <img
            src={product.imageUrl || '/placeholder.jpg'}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isOutOfStock ? 'grayscale' : ''}`}
            loading="lazy"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/30"></div>
          )}
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Category Badge */}
        {product.category?.name && (
          <div className="mb-2">
            <span className="inline-block text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
              {product.category.name}
            </span>
          </div>
        )}

        {/* Product Name */}
        <Link to={`/products/${product.id}`} className="block mb-2">
          <h3 className={`font-semibold text-base sm:text-lg mb-1 hover:text-gray-600 transition-colors line-clamp-2 ${isOutOfStock ? 'text-gray-500' : 'text-gray-900'}`}>
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-gray-500 text-sm mb-3 flex-1 line-clamp-2 min-h-10">
            {product.description}
          </p>
        )}

        {/* Price and Stock Info */}
        <div className="mt-auto space-y-2">
          {/* Price Section */}
          <div className="flex items-baseline gap-2 flex-wrap">
            {hasDiscount ? (
              <>
                <span className={`text-xl sm:text-2xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-red-600'}`}>
                  {formatPrice(product.price)}
                </span>
                <span className={`text-sm line-through ${isOutOfStock ? 'text-gray-300' : 'text-gray-400'}`}>
                  {formatPrice(product.basePrice)}
                </span>
              </>
            ) : (
              <span className={`text-xl sm:text-2xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock Info */}
          {!isOutOfStock && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Stock:</span> {product.stock} available
            </div>
          )}
        </div>

        {/* Add Button */}
        <button 
          onClick={handleAddClick}
          disabled={isOutOfStock}
          className={`mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-200 ${
            isOutOfStock 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95 shadow-sm hover:shadow-md'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{isOutOfStock ? 'Out of Stock' : 'View Details'}</span>
        </button>
      </div>
    </div>
  );
}
