import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { ordersService } from '../../services/orders.service';
import { shippingService } from '../../services/shipping.service';
import AddressSelector from '../../components/common/AddressSelector';
import { formatPrice } from '../../utils/formatPrice';
import { ShoppingBag, ImageIcon, X, CheckCircle2, MapPin, Truck } from 'lucide-react';
import { thailandAddress } from '../../utils/thailandAddress';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, getTotal } = useCartStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    address: user?.address || '',
    phone: user?.phone || '',
    addressData: {
      provinceId: null,
      districtId: null,
      subDistrictId: null,
      zipCode: user?.postalCode || null,
    },
    note: '',
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingInfo, setShippingInfo] = useState(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (addressData) => {
    setFormData(prev => ({
      ...prev,
      addressData
    }));
  };

  // Calculate shipping when province changes
  useEffect(() => {
    const calculateShipping = async () => {
      if (!formData.addressData.provinceId || items.length === 0) {
        setShippingInfo(null);
        return;
      }

      // Get province data outside try block so it's accessible in catch block
      const provinceData = thailandAddress.getProvinceById(formData.addressData.provinceId);
      
      if (!provinceData) {
        console.warn('Province data not found for ID:', formData.addressData.provinceId);
        setShippingInfo(null);
        return;
      }

      try {
        setCalculatingShipping(true);

        const orderItems = items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }));

        console.log('Calculating shipping with:', {
          items: orderItems,
          province: provinceData.name_th,
          provinceData
        });

        if (!provinceData.name_th) {
          console.error('Province name_th is missing:', provinceData);
          setShippingInfo({
            deliveryAddress: null,
            shippingFee: 50,
            estimatedShipping: '3-5 วัน',
          });
          return;
        }

        console.log('Sending to shipping service:', {
          orderItems,
          province: provinceData.name_th,
          orderItemsString: JSON.stringify(orderItems)
        });

        const info = await shippingService.calculateShipping(orderItems, provinceData.name_th);
        console.log('Shipping info received:', info);
        setShippingInfo(info);
      } catch (error) {
        console.error('Failed to calculate shipping:', error);
        console.error('Error response data:', error.response?.data);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          items: items.map(item => ({ id: item.id, quantity: item.quantity })),
          provinceId: formData.addressData.provinceId,
          provinceName: provinceData?.name_th
        });
        
        // Show error message to user
        const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
        console.error('Error message:', errorMessage);
        console.error('Full error response:', JSON.stringify(error.response?.data, null, 2));
        
        // Clear previous errors first
        setError('');
        
        if (errorMessage && errorMessage.includes('No sales location')) {
          setError('ไม่พบสาขาที่มีสินค้าครบทุกรายการ กรุณาตรวจสอบสต็อกสินค้าหรือติดต่อผู้ดูแลระบบ');
        } else if (errorMessage && errorMessage.includes('No active delivery addresses')) {
          setError('ไม่พบที่อยู่จัดส่งที่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลระบบ');
        } else {
          setError(`ไม่สามารถคำนวณค่าจัดส่งได้: ${errorMessage}`);
        }
        
        // Set default shipping if calculation fails (but still allow checkout)
        // User can proceed with order, but admin needs to handle stock manually
        setShippingInfo({
          deliveryAddress: null,
          shippingFee: 50,
          estimatedShipping: '3-5 วัน',
        });
        
        // Note: Error is already set above, so user will see the message
      } finally {
        setCalculatingShipping(false);
      }
    };

    calculateShipping();
  }, [formData.addressData.provinceId, items]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('กรุณาเลือกไฟล์รูปภาพ');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.address || !formData.phone || !formData.addressData.provinceId) {
        setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
        setLoading(false);
        return;
      }

      // Payment slip is optional - order will be created as PENDING

      // Get province name from ID
      const provinceData = thailandAddress.getProvinceById(formData.addressData.provinceId);
      const districtData = formData.addressData.districtId 
        ? thailandAddress.getDistrictById(formData.addressData.districtId)
        : null;

      // Check if all items have the same location
      const locations = items
        .filter(item => item.selectedLocationId)
        .map(item => ({
          id: item.selectedLocationId,
          type: item.selectedLocationType
        }));
      
      const uniqueLocations = [...new Map(locations.map(l => [l.id, l])).values()];
      
      // If multiple locations, use first one (or could split into multiple orders)
      const selectedLocation = uniqueLocations[0];
      
      // Prepare order data
      // SalesLocation = สถานที่ขายและเก็บสินค้า → ส่งจาก SalesLocation
      // Delivery Address = สถานที่ส่งสินค้า → ส่งจาก Delivery Address (ถ้าไม่เลือก SalesLocation)
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        // Add salesLocationId if it's a STORE or IOT_POINT
        // SalesLocation = สถานที่ขายและเก็บสินค้า → ส่งจาก SalesLocation
        ...(selectedLocation && (selectedLocation.type === 'STORE' || selectedLocation.type === 'IOT_POINT') && {
          salesLocationId: selectedLocation.id
        }),
        // warehouseId (Delivery Address) will be selected automatically by backend if salesLocationId is not provided
        // Delivery Address = สถานที่ส่งสินค้า → ส่งจาก Delivery Address
        address: formData.address,
        phone: formData.phone,
        province: provinceData?.name_th || '',
        district: districtData?.name_th || null,
        postalCode: formData.addressData.zipCode || null,
        note: formData.note || null,
        shippingFee: shippingInfo?.shippingFee || 50,
      };

      // Create order (status will be PENDING by default)
      const order = await ordersService.createOrder(orderData);
      
      // Upload payment slip if provided (optional)
      if (selectedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        await new Promise((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              await ordersService.uploadPayment(order.id, reader.result);
              resolve();
            } catch (uploadErr) {
              // If payment upload fails, order still exists as PENDING
              console.error('Payment upload failed:', uploadErr);
              // Don't reject - order is still created successfully
              resolve();
            }
          };
          reader.onerror = () => {
            // Don't reject - order is still created successfully
            resolve();
          };
        });
      }
      
      // Clear cart
      clearCart();
      
      // Navigate to orders page with success message
      navigate('/orders', { 
        state: { 
          newOrderId: order.id,
          message: selectedFile 
            ? 'สั่งซื้อและอัปโหลดหลักฐานการชำระเงินสำเร็จ!' 
            : 'สั่งซื้อสำเร็จ! กรุณาอัปโหลดหลักฐานการชำระเงินในภายหลัง'
        }
      });
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Your bag is empty</h2>
          <p className="text-gray-500 mb-8">
            Add items to get started
          </p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all text-sm font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = shippingInfo?.shippingFee || 50;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-semibold text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Shipping Information Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">Shipping Information</h2>
                
                <div className="space-y-5">
                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Street Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 resize-none"
                      placeholder="Enter your address"
                    />
                  </div>

                  {/* Address Selector */}
                  <div>
                    <AddressSelector
                      value={formData.addressData}
                      onChange={handleAddressChange}
                      required={true}
                      showLabels={true}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="0812345678"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 resize-none"
                      placeholder="Add delivery instructions..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Proof Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">Payment Proof</h2>
                <p className="text-sm text-gray-500 mb-6">
                  (Optional) คุณสามารถอัปโหลดหลักฐานการชำระเงินได้ในภายหลัง
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Upload Payment Slip
                  </label>
                  
                  <div className="relative">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-gray-400 transition-all bg-gray-50 hover:bg-gray-100">
                      {previewUrl ? (
                        <div className="relative w-full h-full p-4">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedFile(null);
                              setPreviewUrl(null);
                            }}
                            className="absolute top-6 right-6 p-2.5 bg-black/80 backdrop-blur text-white rounded-full hover:bg-black transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                            <ImageIcon className="w-7 h-7 text-gray-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Drop your payment slip here
                          </p>
                          <p className="text-xs text-gray-500">
                            or click to browse
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {selectedFile && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-900 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-green-700 mt-0.5">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - Mobile */}
              <div className="flex flex-col sm:flex-row gap-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="px-6 py-3.5 text-gray-900 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Complete Order'
                  )}
                </button>
              </div>
            </div>

            {/* Right Column - Order Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h2>
                  
                  {/* Items */}
                  <div className="space-y-4 mb-6">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                          <img
                            src={item.imageUrl || '/placeholder.png'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 truncate">{item.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-sm text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  {shippingInfo?.deliveryAddress && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-blue-900">ส่งจาก</p>
                          <p className="text-sm text-blue-800">{shippingInfo.deliveryAddress.name}</p>
                          <p className="text-xs text-blue-600">{shippingInfo.deliveryAddress.province}</p>
                        </div>
                      </div>
                      {shippingInfo.estimatedShipping && (
                        <div className="flex items-center gap-2 mt-2">
                          <Truck className="w-4 h-4 text-blue-600" />
                          <p className="text-xs text-blue-700">
                            ระยะเวลาจัดส่งประมาณ: {shippingInfo.estimatedShipping}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Totals */}
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Shipping
                        {calculatingShipping && (
                          <span className="ml-2 text-xs text-gray-400">(calculating...)</span>
                        )}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {calculatingShipping ? '...' : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-4">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        {calculatingShipping ? '...' : formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons - Desktop */}
                  <div className="hidden lg:flex flex-col gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Complete Order'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/cart')}
                      className="w-full px-6 py-3.5 text-gray-900 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
                    >
                      Back to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
