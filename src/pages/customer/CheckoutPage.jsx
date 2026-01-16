import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { ordersService } from '../../services/orders.service';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import { formatPrice } from '../../utils/formatPrice';
import { ShoppingBag, MapPin, Phone, Home } from 'lucide-react';

// Thai provinces list
const THAI_PROVINCES = [
  'กรุงเทพมหานคร',
  'กระบี่',
  'กาญจนบุรี',
  'กาฬสินธุ์',
  'กำแพงเพชร',
  'ขอนแก่น',
  'จันทบุรี',
  'ฉะเชิงเทรา',
  'ชลบุรี',
  'ชัยนาท',
  'ชัยภูมิ',
  'ชุมพร',
  'เชียงราย',
  'เชียงใหม่',
  'ตรัง',
  'ตราด',
  'ตาก',
  'นครนายก',
  'นครปฐม',
  'นครพนม',
  'นครราชสีมา',
  'นครศรีธรรมราช',
  'นครสวรรค์',
  'นนทบุรี',
  'นราธิวาส',
  'น่าน',
  'บึงกาฬ',
  'บุรีรัมย์',
  'ปทุมธานี',
  'ประจวบคีรีขันธ์',
  'ปราจีนบุรี',
  'ปัตตานี',
  'พระนครศรีอยุธยา',
  'พังงา',
  'พัทลุง',
  'พิจิตร',
  'พิษณุโลก',
  'เพชรบุรี',
  'เพชรบูรณ์',
  'แพร่',
  'พะเยา',
  'ภูเก็ต',
  'มหาสารคาม',
  'มุกดาหาร',
  'แม่ฮ่องสอน',
  'ยโสธร',
  'ยะลา',
  'ร้อยเอ็ด',
  'ระนอง',
  'ระยอง',
  'ราชบุรี',
  'ลพบุรี',
  'ลำปาง',
  'ลำพูน',
  'เลย',
  'ศรีสะเกษ',
  'สกลนคร',
  'สงขลา',
  'สตูล',
  'สมุทรปราการ',
  'สมุทรสงคราม',
  'สมุทรสาคร',
  'สระแก้ว',
  'สระบุรี',
  'สิงห์บุรี',
  'สุโขทัย',
  'สุพรรณบุรี',
  'สุราษฎร์ธานี',
  'สุรินทร์',
  'หนองคาย',
  'หนองบัวลำภู',
  'อ่างทอง',
  'อำนาจเจริญ',
  'อุดรธานี',
  'อุตรดิตถ์',
  'อุทัยธานี',
  'อุบลราชธานี',
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, getTotal } = useCartStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    address: user?.address || '',
    phone: user?.phone || '',
    province: user?.province || '',
    district: user?.district || '',
    postalCode: user?.postalCode || '',
    note: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.address || !formData.phone || !formData.province) {
        setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
        setLoading(false);
        return;
      }

      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        address: formData.address,
        phone: formData.phone,
        province: formData.province,
        district: formData.district || null,
        postalCode: formData.postalCode || null,
        note: formData.note || null,
      };

      // Create order
      const order = await ordersService.createOrder(orderData);
      
      // Clear cart
      clearCart();
      
      // Navigate to order success page
      navigate(`/orders/${order.id}`, { 
        state: { message: 'สั่งซื้อสำเร็จ! กรุณาชำระเงินภายใน 24 ชั่วโมง' }
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
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-semibold mb-4 text-gray-900">ตะกร้าสินค้าว่างเปล่า</h2>
          <p className="text-gray-500 mb-8 text-lg">
            เพิ่มสินค้าลงตะกร้าก่อนทำการสั่งซื้อ
          </p>
          <Button onClick={() => navigate('/products')}>
            เลือกซื้อสินค้า
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = 50; // Fixed shipping fee
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">ชำระเงิน</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-6">ข้อมูลการจัดส่ง</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Address */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Home className="w-4 h-4" />
                  ที่อยู่จัดส่ง <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="บ้านเลขที่, ซอย, ถนน, หมู่บ้าน"
                />
              </div>

              {/* Province */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  จังหวัด <span className="text-red-500">*</span>
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">เลือกจังหวัด</option>
                  {THAI_PROVINCES.map(province => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  เขต/อำเภอ
                </label>
                <Input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="เขต/อำเภอ"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  รหัสไปรษณีย์
                </label>
                <Input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="10500"
                  maxLength={5}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="0812345678"
                />
              </div>

              {/* Note */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  หมายเหตุ (ถ้ามี)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="ข้อความถึงผู้ขาย..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/cart')}
                  className="flex-1"
                >
                  ย้อนกลับ
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-6">สรุปคำสั่งซื้อ</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.imageUrl || '/placeholder.png'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ยอดรวมสินค้า</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ค่าจัดส่ง</span>
                <span className="font-medium">{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>ยอดรวมทั้งหมด</span>
                <span className="text-gray-900">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>หมายเหตุ:</strong> หลังจากสั่งซื้อสำเร็จ กรุณาชำระเงินภายใน 24 ชั่วโมง
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
