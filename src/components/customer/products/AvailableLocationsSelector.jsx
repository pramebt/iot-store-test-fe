import { useState, useEffect } from 'react';
import { MapPin, Store, Warehouse, Radio } from 'lucide-react';
import { productsService } from '../../../services/products.service';

export default function AvailableLocationsSelector({ 
  productId, 
  selectedLocationId, 
  onSelect,
  customerProvince = null 
}) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      loadAvailability();
    }
  }, [productId, customerProvince]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getAvailability(productId, customerProvince);
      console.log('Product availability data:', data);
      
      // Filter: Only show SalesLocations (STORE, IOT_POINT), NOT Delivery Addresses
      // 
      // Why filter out Delivery Addresses?
      // - SalesLocations (STORE/IOT_POINT) = สถานที่ขายที่ลูกค้าเลือกได้
      // - Delivery Addresses = สถานที่ส่งสินค้าที่ระบบเลือกให้อัตโนมัติตอน checkout
      //   ตาม shipping address และ stock availability
      //
      const salesLocations = (data.availableLocations || []).filter(
        loc => loc.type !== 'WAREHOUSE'
      );
      
      setLocations(salesLocations);
      
      if (salesLocations.length === 0) {
        console.warn('No available sales locations found for product:', productId);
      }
    } catch (err) {
      console.error('Failed to load availability:', err);
      setError(`ไม่สามารถโหลดข้อมูลสถานที่ขายได้: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const getLocationIcon = (type) => {
    switch (type) {
      case 'STORE':
        return <Store className="w-4 h-4" />;
      case 'IOT_POINT':
        return <Radio className="w-4 h-4" />;
      case 'WAREHOUSE':
        return <Warehouse className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getLocationTypeLabel = (type) => {
    switch (type) {
      case 'STORE':
        return 'ร้านค้า';
      case 'IOT_POINT':
        return 'จุดติดตั้ง IoT';
      case 'WAREHOUSE':
        return 'ที่อยู่จัดส่ง';
      default:
        return 'สถานที่';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="text-sm text-gray-500">กำลังโหลดสถานที่ขาย...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="text-sm text-yellow-800 mb-2">
          <strong>⚠️ สินค้านี้ยังไม่มีสถานที่ขายที่พร้อมจำหน่าย</strong>
        </div>
        <div className="text-xs text-yellow-700">
          กรุณาไปที่ Admin → Sales Locations เพื่อเพิ่มสินค้าเข้าไปในสถานที่ขาย
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">สถานที่ขายที่มีสินค้านี้ (ไม่บังคับ)</h3>
      </div>
      
      {/* Option: Skip location selection (Online Order) */}
      <button
        onClick={() => onSelect(null, null)}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
          !selectedLocationId
            ? 'border-gray-900 bg-gray-50'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Radio Button */}
          <div className="mt-1">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                !selectedLocationId
                  ? 'border-gray-900 bg-gray-900'
                  : 'border-gray-300'
              }`}
            >
              {!selectedLocationId && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-semibold ${!selectedLocationId ? 'text-gray-900' : 'text-gray-700'}`}>
                ส่งสินค้าไปบ้าน (Online Order)
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                ไม่เลือกสาขา
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p>ระบบจะเลือกคลังสินค้าและสาขาที่เหมาะสมอัตโนมัติ</p>
              <p className="text-xs text-gray-500 mt-1">ต้องใส่ที่อยู่จัดส่งตอน Checkout</p>
            </div>
          </div>
        </div>
      </button>

      <div className="space-y-2">
        {locations.map((location) => {
          const isSelected = selectedLocationId === location.id;
          
          return (
            <button
              key={location.id}
              onClick={() => onSelect(location.id, location.type)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Radio Button */}
                <div className="mt-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-gray-900 bg-gray-900'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                {/* Location Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                      {getLocationIcon(location.type)}
                    </div>
                    <span className={`font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                      {location.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {getLocationTypeLabel(location.type)}
                    </span>
                    {location.isSameProvince && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        ใกล้คุณ
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{location.province}</span>
                      {location.district && <span>• {location.district}</span>}
                    </div>
                    
                    {/* แสดง stock สำหรับ SalesLocation */}
                    {(location.stock !== undefined && location.stock > 0) && (
                      <div className="text-xs text-gray-500">
                        สต็อก: {location.stock} ชิ้น
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        จัดส่ง: {location.estimatedDelivery}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedLocationId ? (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>สถานที่ขายที่เลือก:</strong>{' '}
            {locations.find(l => l.id === selectedLocationId)?.name}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            คุณจะรับสินค้าที่สาขานี้ (In-Store Order)
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800">
            <strong>Online Order:</strong> ส่งสินค้าไปบ้าน
          </div>
          <div className="text-xs text-green-600 mt-1">
            ระบบจะเลือกที่อยู่จัดส่งและสาขาที่เหมาะสมอัตโนมัติตอน Checkout
          </div>
        </div>
      )}
    </div>
  );
}
