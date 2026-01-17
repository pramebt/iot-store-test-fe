import { useState, useEffect } from 'react';
import {
  getAllProvinces,
  getDistrictsByProvince,
  getSubDistrictsByDistrict,
  getAddressByZipCode,
  validateZipCode
} from '../../utils/thailandAddress';

/**
 * AddressSelector Component
 * คอมโพเนนต์สำหรับเลือกที่อยู่แบบลำดับชั้น: จังหวัด -> อำเภอ -> ตำบล -> รหัสไปรษณีย์
 * 
 * @param {Object} value - ค่าที่อยู่ปัจจุบัน { provinceId, districtId, subDistrictId, zipCode }
 * @param {Function} onChange - Callback เมื่อมีการเปลี่ยนแปลง
 * @param {Boolean} disabled - ปิดการใช้งาน
 * @param {Boolean} required - จำเป็นต้องกรอก
 * @param {String} className - CSS class เพิ่มเติม
 */
export default function AddressSelector({ 
  value = {}, 
  onChange, 
  disabled = false,
  required = false,
  className = '',
  showLabels = true 
}) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState(value.provinceId || '');
  const [selectedDistrict, setSelectedDistrict] = useState(value.districtId || '');
  const [selectedSubDistrict, setSelectedSubDistrict] = useState(value.subDistrictId || '');
  const [zipCode, setZipCode] = useState(value.zipCode || '');
  const [zipCodeError, setZipCodeError] = useState('');

  // โหลดข้อมูลจังหวัดเมื่อ component mount
  useEffect(() => {
    const allProvinces = getAllProvinces();
    setProvinces(allProvinces);
  }, []);

  // โหลดอำเภอเมื่อเลือกจังหวัด
  useEffect(() => {
    if (selectedProvince) {
      const districtList = getDistrictsByProvince(parseInt(selectedProvince));
      setDistricts(districtList);
      
      // ถ้ามีการเลือกอำเภออยู่แล้วและอยู่ในจังหวัดนี้ ให้เก็บไว้
      if (selectedDistrict) {
        const districtExists = districtList.some(d => d.id === parseInt(selectedDistrict));
        if (!districtExists) {
          setSelectedDistrict('');
          setSelectedSubDistrict('');
          setSubDistricts([]);
        }
      }
    } else {
      setDistricts([]);
      setSelectedDistrict('');
      setSelectedSubDistrict('');
      setSubDistricts([]);
    }
  }, [selectedProvince]);

  // โหลดตำบลเมื่อเลือกอำเภอ
  useEffect(() => {
    if (selectedDistrict) {
      const subDistrictList = getSubDistrictsByDistrict(parseInt(selectedDistrict));
      setSubDistricts(subDistrictList);
      
      // ถ้ามีการเลือกตำบลอยู่แล้วและอยู่ในอำเภอนี้ ให้เก็บไว้
      if (selectedSubDistrict) {
        const subDistrictExists = subDistrictList.some(sd => sd.id === parseInt(selectedSubDistrict));
        if (!subDistrictExists) {
          setSelectedSubDistrict('');
          setZipCode('');
        }
      }
    } else {
      setSubDistricts([]);
      setSelectedSubDistrict('');
      setZipCode('');
    }
  }, [selectedDistrict]);

  // อัปเดต zipCode เมื่อเลือกตำบล
  useEffect(() => {
    if (selectedSubDistrict) {
      const subDistrict = subDistricts.find(sd => sd.id === parseInt(selectedSubDistrict));
      if (subDistrict && subDistrict.zipCode) {
        setZipCode(subDistrict.zipCode.toString());
        setZipCodeError('');
      }
    }
  }, [selectedSubDistrict, subDistricts]);

  // ส่งค่ากลับไปยัง parent component
  useEffect(() => {
    if (onChange) {
      onChange({
        provinceId: selectedProvince ? parseInt(selectedProvince) : null,
        districtId: selectedDistrict ? parseInt(selectedDistrict) : null,
        subDistrictId: selectedSubDistrict ? parseInt(selectedSubDistrict) : null,
        zipCode: zipCode || null
      });
    }
  }, [selectedProvince, selectedDistrict, selectedSubDistrict, zipCode]);

  // ตรวจสอบรหัสไปรษณีย์เมื่อผู้ใช้พิมพ์เอง
  const handleZipCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
    
    if (value.length === 5) {
      const isValid = validateZipCode(value, selectedProvince ? parseInt(selectedProvince) : null);
      if (!isValid) {
        setZipCodeError('รหัสไปรษณีย์ไม่ถูกต้อง');
      } else {
        setZipCodeError('');
        
        // แนะนำที่อยู่จากรหัสไปรษณีย์
        const addresses = getAddressByZipCode(value);
        if (addresses.length > 0 && !selectedProvince) {
          // ถ้ายังไม่ได้เลือกจังหวัด ให้เติมอัตโนมัติ
          const firstAddress = addresses[0];
          setSelectedProvince(firstAddress.provinceId.toString());
          setSelectedDistrict(firstAddress.districtId.toString());
          setSelectedSubDistrict(firstAddress.subDistrictId.toString());
        }
      }
    } else {
      setZipCodeError('');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Province Selection */}
      <div>
        {showLabels && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            จังหวัด {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          disabled={disabled}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">เลือกจังหวัด</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.nameTh}
            </option>
          ))}
        </select>
      </div>

      {/* District Selection */}
      <div>
        {showLabels && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            อำเภอ/เขต {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          disabled={disabled || !selectedProvince || districts.length === 0}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">เลือกอำเภอ/เขต</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.nameTh}
            </option>
          ))}
        </select>
      </div>

      {/* Sub-District Selection */}
      <div>
        {showLabels && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ตำบล/แขวง {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          value={selectedSubDistrict}
          onChange={(e) => setSelectedSubDistrict(e.target.value)}
          disabled={disabled || !selectedDistrict || subDistricts.length === 0}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">เลือกตำบล/แขวง</option>
          {subDistricts.map((subDistrict) => (
            <option key={subDistrict.id} value={subDistrict.id}>
              {subDistrict.nameTh} ({subDistrict.zipCode})
            </option>
          ))}
        </select>
      </div>

      {/* Zip Code */}
      <div>
        {showLabels && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            รหัสไปรษณีย์ {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          type="text"
          value={zipCode}
          onChange={handleZipCodeChange}
          disabled={disabled}
          required={required}
          maxLength={5}
          placeholder="12345"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            zipCodeError ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {zipCodeError && (
          <p className="text-sm text-red-500 mt-1">{zipCodeError}</p>
        )}
        {zipCode && !zipCodeError && zipCode.length === 5 && (
          <p className="text-sm text-green-600 mt-1">✓ รหัสไปรษณีย์ถูกต้อง</p>
        )}
      </div>
    </div>
  );
}
