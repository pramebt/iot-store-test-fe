import { Package, ShoppingCart, Shield, Truck } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';
import AvailableLocationsSelector from './AvailableLocationsSelector';

// Product Image Gallery
export function ProductImageGallery({ product }) {
  return (
    <div>
      <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        <img
          src={product.imageUrl || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

// Product Info Section
export function ProductInfoSection({ product }) {
  return (
    <div>
      <h1 className="text-4xl font-semibold mb-4 text-gray-900">{product.name}</h1>
      
      {product.category && (
        <div className="mb-4">
          <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
            {product.category.name}
          </span>
        </div>
      )}

      {/* Price Display with Discount */}
      {product.basePrice && product.price < product.basePrice ? (
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-semibold text-red-600">
              {formatPrice(product.price)}
            </span>
            <span className="text-2xl line-through text-gray-400">
              {formatPrice(product.basePrice)}
            </span>
            <span className="text-sm font-semibold bg-red-100 text-red-700 px-3 py-1 rounded-full">
              -{Math.round(((product.basePrice - product.price) / product.basePrice) * 100)}%
            </span>
          </div>
        </div>
      ) : (
        <div className="text-4xl font-semibold text-gray-900 mb-8">
          {formatPrice(product.price)}
        </div>
      )}

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
    </div>
  );
}

// Product Actions
export function ProductActions({ 
  product, 
  quantity, 
  setQuantity, 
  selectedLocationId, 
  selectedLocationType,
  onLocationSelect,
  onAddToCart,
  user
}) {
  return (
    <>
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

      {/* Available Locations Selector (Optional) */}
      <div className="mb-6">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            เลือกสาขา (ไม่บังคับ)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            {selectedLocationId 
              ? 'คุณเลือกสาขาแล้ว - จะเป็น In-Store Order (รับสินค้าที่สาขา)'
              : 'ไม่เลือกสาขา - จะเป็น Online Order (ส่งสินค้าไปบ้าน)'}
          </p>
        </div>
        <AvailableLocationsSelector
          productId={product.id}
          selectedLocationId={selectedLocationId}
          onSelect={onLocationSelect}
          customerProvince={user?.province || null}
        />
      </div>

      {/* Add to Cart Button */}
      <button
        disabled={product.stock === 0}
        onClick={onAddToCart}
        className="w-full bg-gray-900 text-white py-4 rounded-full hover:bg-gray-800 transition-all font-medium mb-8 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        {product.stock === 0 
          ? 'Out of Stock' 
          : 'Add to Cart'}
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
    </>
  );
}
