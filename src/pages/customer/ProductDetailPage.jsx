import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsService } from '../../services/products.service';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import {
  ProductImageGallery,
  ProductInfoSection,
  ProductActions
} from '../../components/customer/products/ProductDetailSections';
import { ArrowLeft, Loader2, XCircle } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedLocationType, setSelectedLocationType] = useState(null);
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getById(id);
      if (!data.product) {
        throw new Error('ไม่พบสินค้า');
      }
      setProduct(data.product);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'ไม่สามารถโหลดข้อมูลสินค้าได้';
      setError(errorMessage);
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (locationId, locationType) => {
    setSelectedLocationId(locationId);
    setSelectedLocationType(locationType);
  };

  const handleAddToCart = () => {
    // Allow adding to cart without selecting location (for Online Order)
    // If selectedLocationId is null, it will be an Online Order
    // System will automatically select Delivery Address and SalesLocation at checkout
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      selectedLocationId: selectedLocationId || null, // null = Online Order
      selectedLocationType: selectedLocationType || null,
    }, quantity);
    // Show success message or redirect to cart
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50/40 via-white to-slate-50/30">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
            <div className="text-slate-600 font-light">กำลังโหลดข้อมูลสินค้า...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50/40 via-white to-slate-50/30">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-xl text-slate-800 mb-2 font-medium">เกิดข้อผิดพลาด</div>
            <div className="text-slate-600 mb-8 font-light">
              {error || 'ไม่พบสินค้า'}
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="bg-slate-800 text-white px-6 py-2.5 rounded-full hover:bg-slate-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
            >
              กลับไปหน้ารายการสินค้า
            </button>
          </div>
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
        <ProductImageGallery product={product} />
        <div>
          <ProductInfoSection product={product} />
          <ProductActions
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            selectedLocationId={selectedLocationId}
            selectedLocationType={selectedLocationType}
            onLocationSelect={handleLocationSelect}
            onAddToCart={handleAddToCart}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}
