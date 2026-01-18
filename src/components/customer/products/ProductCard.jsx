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

  // ตรวจสอบสต็อกจากทุกสถานที่ขาย (ใช้ availableStock ถ้ามี)
  // เพิ่มการตรวจสอบความปลอดภัยสำหรับกรณีที่ข้อมูลไม่ครบ
  const availableStock = product?.availableStock !== undefined 
    ? product.availableStock 
    : (product?.stock || 0);
  const availableLocations = Array.isArray(product?.availableLocations) 
    ? product.availableLocations 
    : [];
  // ถ้ามีสต็อกในสถานที่ขายใดๆ แสดงว่ายังไม่หมด (ตรวจสอบทั้ง availableStock และ availableLocations)
  const hasStockInAnyLocation = availableStock > 0 || availableLocations.length > 0;
  const isOutOfStock = !hasStockInAnyLocation;
  // แสดงข้อมูลสถานที่เมื่อมีสต็อกและมีหลายสถานที่
  const showAvailableLocations = hasStockInAnyLocation && availableLocations.length > 0;
  
  const hasDiscount = product.basePrice && product.price < product.basePrice;
  const discountPercent = hasDiscount 
    ? Math.round(((product.basePrice - product.price) / product.basePrice) * 100)
    : 0;

  return (
    <div className={`bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group relative flex flex-col h-full ${isOutOfStock ? 'opacity-75' : ''}`}>
      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
          สินค้าหมด
        </div>
      )}
      
      {/* Available Locations Badge - แสดงเมื่อมีสต็อกในบางสถานที่ */}
      {showAvailableLocations && (
        <div className="absolute top-3 right-3 z-10 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
          มีสต็อก {availableLocations.length} สาขา
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
            <div className="text-xs text-gray-500 space-y-1">
              <div>
                <span className="font-medium">สต็อก:</span> {availableStock} ชิ้น
              </div>
              {/* แสดงสถานที่ที่มีสต็อก - แสดงเมื่อมีหลายสถานที่ */}
              {showAvailableLocations && availableLocations.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  <span className="font-medium">มีที่:</span>{' '}
                  {availableLocations.slice(0, 2).map((loc, idx) => (
                    <span key={loc?.id || idx}>
                      {idx > 0 && ', '}
                      {loc?.name || 'ไม่ระบุ'}
                      {loc?.province && ` (${loc.province})`}
                    </span>
                  ))}
                  {availableLocations.length > 2 && (
                    <span className="text-gray-500"> และอีก {availableLocations.length - 2} สาขา</span>
                  )}
                </div>
              )}
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
          <span>{isOutOfStock ? 'สินค้าหมด' : 'ดูรายละเอียด'}</span>
        </button>
      </div>
    </div>
  );
}
