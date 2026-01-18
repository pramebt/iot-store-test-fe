import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { ordersService } from '../../services/orders.service';
import { shippingService } from '../../services/shipping.service';
import { salesLocationsService } from '../../services/salesLocations.service';
import { authService } from '../../services/auth.service';
import ShippingInformationForm from '../../components/customer/checkout/ShippingInformationForm';
import OrderSummaryCard from '../../components/customer/checkout/OrderSummaryCard';
import PaymentProofUpload from '../../components/customer/checkout/PaymentProofUpload';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { thailandAddress } from '../../utils/thailandAddress';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import toast from '../../utils/toast';

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
  const [shippingInfo, setShippingInfo] = useState(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [selectedSalesLocation, setSelectedSalesLocation] = useState(null);

  // Check if In-Store Order (has selectedLocation)
  const hasSelectedLocation = items.some(item => item.selectedLocationId && 
    (item.selectedLocationType === 'STORE' || item.selectedLocationType === 'IOT_POINT'));

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

  const handleUseProfileAddress = async () => {
    if (!user) {
      toast.error('กรุณาเข้าสู่ระบบเพื่อใช้ที่อยู่จากโปรไฟล์');
      return;
    }

    try {
      // Fetch latest profile data from API
      const profileData = await authService.getCurrentUser();
      console.log('Profile data from API:', profileData);
      
      // Check if profile has address data
      if (!profileData.address && !profileData.phone && !profileData.province) {
        toast.error('โปรไฟล์ของคุณยังไม่มีข้อมูลที่อยู่ กรุณาไปที่หน้า Profile เพื่อเพิ่มข้อมูลที่อยู่');
        return;
      }
      
      // Convert province/district names to IDs for AddressSelector
      let provinceId = null;
      let districtId = null;
      let subDistrictId = null;
      
      if (profileData.province) {
        // Search province by name (supports both Thai and English)
        const provinces = thailandAddress.searchProvince(profileData.province);
        console.log('Searching for province:', profileData.province, 'Found:', provinces);
        if (provinces.length > 0) {
          provinceId = provinces[0].id;
          
          // Find district by name
          if (profileData.district && provinceId) {
            const districts = thailandAddress.searchDistrict(profileData.district, provinceId);
            console.log('Searching for district:', profileData.district, 'Found:', districts);
            if (districts.length > 0) {
              districtId = districts[0].id;
              
              // Find sub-district by postal code
              if (profileData.postalCode && districtId) {
                const subDistricts = thailandAddress.getSubDistrictsByDistrict(districtId);
                const subDistrict = subDistricts.find(sd => 
                  sd.zipCode === profileData.postalCode || 
                  sd.zipCode === parseInt(profileData.postalCode)
                );
                console.log('Searching for postal code:', profileData.postalCode, 'Found sub-districts:', subDistricts.length);
                if (subDistrict) {
                  subDistrictId = subDistrict.id;
                }
              }
            }
          }
        } else {
          console.warn('Province not found:', profileData.province);
        }
      }

      const newFormData = {
        ...formData,
        address: profileData.address || formData.address,
        phone: profileData.phone || formData.phone,
        addressData: {
          provinceId: provinceId || formData.addressData.provinceId,
          districtId: districtId || formData.addressData.districtId,
          subDistrictId: subDistrictId || formData.addressData.subDistrictId,
          zipCode: profileData.postalCode || formData.addressData.zipCode,
        },
      };

      console.log('Updating form data:', {
        old: formData,
        new: newFormData,
        profile: profileData
      });
      
      // Update form data with profile information
      setFormData(newFormData);

      // Show success toast
      toast.success('โหลดที่อยู่จากโปรไฟล์สำเร็จ');
    } catch (err) {
      console.error('Error loading profile address:', err);
      toast.error(err.response?.data?.message || 'ไม่สามารถโหลดที่อยู่จากโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  // Load selected SalesLocation info when items change
  useEffect(() => {
    const loadSelectedSalesLocation = async () => {
      // Check if all items have selectedLocationId (In-Store Order)
      const hasLocation = items.some(item => item.selectedLocationId && 
        (item.selectedLocationType === 'STORE' || item.selectedLocationType === 'IOT_POINT'));
      
      if (hasLocation) {
        // Get the selected location ID from items
        const selectedLocationId = items
          .filter(item => item.selectedLocationId && 
            (item.selectedLocationType === 'STORE' || item.selectedLocationType === 'IOT_POINT'))
          .map(item => item.selectedLocationId)[0];
        
        if (selectedLocationId) {
          try {
            const salesLocation = await salesLocationsService.getById(selectedLocationId);
            setSelectedSalesLocation(salesLocation);
          } catch (error) {
            console.error('Failed to load sales location:', error);
            setSelectedSalesLocation(null);
          }
        }
      } else {
        setSelectedSalesLocation(null);
      }
    };

    loadSelectedSalesLocation();
  }, [items]);

  // Calculate shipping when province changes
  useEffect(() => {
    const calculateShipping = async () => {
      // Both In-Store Order and Online Order need province for shipping calculation
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
          provinceData,
          isInStoreOrder: hasSelectedLocation
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

        // For In-Store Order: shipping from selected SalesLocation
        // For Online Order: shipping from selected DeliveryAddress
        if (hasSelectedLocation && selectedSalesLocation) {
          // In-Store Order: Calculate shipping from SalesLocation to customer address
          // Use the same shipping calculation logic (from SalesLocation province to customer province)
          const salesLocationProvince = selectedSalesLocation.province;
          const customerProvince = provinceData.name_th;
          
          // Simple shipping fee calculation (same province = 50, different = 100)
          const shippingFee = salesLocationProvince === customerProvince ? 50 : 100;
          const estimatedShipping = salesLocationProvince === customerProvince ? '1-2 วัน' : '3-5 วัน';
          
          setShippingInfo({
            salesLocation: {
              id: selectedSalesLocation.id,
              name: selectedSalesLocation.name,
              code: selectedSalesLocation.code,
              province: selectedSalesLocation.province,
            },
            deliveryAddress: null, // In-Store Order doesn't use DeliveryAddress
            shippingFee,
            estimatedShipping,
          });
          return;
        }

        // Online Order: Calculate shipping from DeliveryAddress
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
          toast.error('ไม่พบสาขาที่มีสินค้าครบทุกรายการ กรุณาตรวจสอบสต็อกสินค้าหรือติดต่อผู้ดูแลระบบ');
        } else if (errorMessage && errorMessage.includes('No active delivery addresses')) {
          toast.error('ไม่พบที่อยู่จัดส่งที่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลระบบ');
        } else {
          toast.error(`ไม่สามารถคำนวณค่าจัดส่งได้: ${errorMessage}`);
        }
        
        // Set default shipping if calculation fails (but still allow checkout)
        // User can proceed with order, but admin needs to handle stock manually
        setShippingInfo({
          deliveryAddress: null,
          shippingFee: 50,
          estimatedShipping: '3-5 วัน',
        });
      } finally {
        setCalculatingShipping(false);
      }
    };

    calculateShipping();
  }, [formData.addressData.provinceId, items, selectedSalesLocation]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('กรุณาเลือกไฟล์รูปภาพ');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }

      setSelectedFile(file);

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
    setLoading(true);

    try {
      // Validate required fields
      // Both In-Store Order and Online Order need address, phone, and province (for shipping)
      if (!formData.address || !formData.phone || !formData.addressData.provinceId) {
        toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ที่อยู่, เบอร์โทร, จังหวัด)');
        setLoading(false);
        return;
      }

      // Payment slip is optional - order will be created as PENDING

      // Get province name from ID (both In-Store and Online Order need this for shipping)
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
        // Delivery Address will be selected automatically by backend if salesLocationId is not provided
        // Delivery Address = สถานที่ส่งสินค้า → ส่งจาก Delivery Address (Online Order เท่านั้น)
        address: formData.address, // Both In-Store and Online Order need address
        phone: formData.phone,
        province: provinceData?.name_th || '', // Both need province for shipping
        district: districtData?.name_th || null,
        postalCode: formData.addressData.zipCode || null,
        note: formData.note || null,
        shippingFee: shippingInfo?.shippingFee || 50, // Both have shipping fee
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
      
      // Show success toast
      toast.success(selectedFile 
        ? 'สั่งซื้อและอัปโหลดหลักฐานการชำระเงินสำเร็จ!' 
        : 'สั่งซื้อสำเร็จ! กรุณาอัปโหลดหลักฐานการชำระเงินในภายหลัง'
      );
      
      // Navigate to orders page
      navigate('/orders', { 
        state: { 
          newOrderId: order.id,
        }
      });
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto text-center py-20">
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
      </PageContainer>
    );
  }

  const subtotal = getTotal();
  // Both In-Store and Online Order have shipping fee
  const shipping = shippingInfo?.shippingFee || 50;
  const total = subtotal + shipping;

  return (
    <PageContainer>
      <PageHeader 
        title="Checkout"
        subtitle="Complete your order"
      />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              <ShippingInformationForm
                formData={formData}
                hasSelectedLocation={hasSelectedLocation}
                selectedSalesLocation={selectedSalesLocation}
                onFormChange={handleChange}
                onAddressChange={handleAddressChange}
                onUseProfileAddress={handleUseProfileAddress}
              />

              <PaymentProofUpload
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                onFileSelect={handleFileSelect}
                onFileRemove={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
              />

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
                      <Loader2 className="w-5 h-5 animate-spin" />
                      กำลังดำเนินการ...
                    </span>
                  ) : (
                    'ยืนยันการสั่งซื้อ'
                  )}
                </button>
              </div>
            </div>

            {/* Right Column - Order Summary (Sticky) */}
            <div className="lg:col-span-1">
              <OrderSummaryCard
                items={items}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                shippingInfo={shippingInfo}
                hasSelectedLocation={hasSelectedLocation}
                calculatingShipping={calculatingShipping}
                loading={loading}
                onBackToCart={() => navigate('/cart')}
              />
            </div>
          </div>
        </form>
    </PageContainer>
  );
}
