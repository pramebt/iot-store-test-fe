/**
 * Thailand Address Data Utility
 * โหลดและจัดการข้อมูลที่อยู่ประเทศไทย
 */

import addressData from '../data/province_with_district_and_sub_district.json';

class ThailandAddressManager {
  constructor() {
    this.data = addressData;
    this.provinceMap = new Map();
    this.districtMap = new Map();
    this.subDistrictMap = new Map();
    this.zipCodeMap = new Map();
    
    this.initialize();
  }

  initialize() {
    // สร้าง Map สำหรับค้นหาข้อมูลได้เร็วขึ้น
    this.data.forEach(province => {
      this.provinceMap.set(province.id, province);
      
      province.districts.forEach(district => {
        this.districtMap.set(district.id, {
          ...district,
          provinceName: province.name_th
        });
        
        district.sub_districts.forEach(subDistrict => {
          this.subDistrictMap.set(subDistrict.id, {
            ...subDistrict,
            districtName: district.name_th,
            provinceName: province.name_th
          });
          
          // จัดเก็บข้อมูลตามรหัสไปรษณีย์
          if (!this.zipCodeMap.has(subDistrict.zip_code)) {
            this.zipCodeMap.set(subDistrict.zip_code, []);
          }
          this.zipCodeMap.get(subDistrict.zip_code).push({
            subDistrict: subDistrict.name_th,
            district: district.name_th,
            province: province.name_th,
            subDistrictId: subDistrict.id,
            districtId: district.id,
            provinceId: province.id
          });
        });
      });
    });
  }

  // ดึงข้อมูลจังหวัดทั้งหมด
  getAllProvinces() {
    return this.data.map(p => ({
      id: p.id,
      nameTh: p.name_th,
      nameEn: p.name_en,
      geographyId: p.geography_id
    })).sort((a, b) => a.nameTh.localeCompare(b.nameTh, 'th'));
  }

  // ดึงข้อมูลอำเภอตามจังหวัด
  getDistrictsByProvince(provinceId) {
    const province = this.provinceMap.get(provinceId);
    if (!province) return [];
    
    return province.districts.map(d => ({
      id: d.id,
      nameTh: d.name_th,
      nameEn: d.name_en,
      provinceId: d.province_id
    })).sort((a, b) => a.nameTh.localeCompare(b.nameTh, 'th'));
  }

  // ดึงข้อมูลตำบลตามอำเภอ
  getSubDistrictsByDistrict(districtId) {
    const district = this.districtMap.get(districtId);
    if (!district) return [];
    
    const province = this.provinceMap.get(district.province_id);
    const districtData = province.districts.find(d => d.id === districtId);
    
    return districtData.sub_districts.map(sd => ({
      id: sd.id,
      nameTh: sd.name_th,
      nameEn: sd.name_en,
      zipCode: sd.zip_code,
      districtId: sd.district_id,
      lat: sd.lat,
      long: sd.long
    })).sort((a, b) => a.nameTh.localeCompare(b.nameTh, 'th'));
  }

  // ค้นหาที่อยู่จากรหัสไปรษณีย์
  getAddressByZipCode(zipCode) {
    return this.zipCodeMap.get(parseInt(zipCode)) || [];
  }

  // ค้นหาจังหวัดตามชื่อ (รองรับทั้งไทยและอังกฤษ)
  searchProvince(query) {
    const lowerQuery = query.toLowerCase();
    return this.data.filter(p => 
      p.name_th.toLowerCase().includes(lowerQuery) ||
      p.name_en.toLowerCase().includes(lowerQuery)
    ).map(p => ({
      id: p.id,
      nameTh: p.name_th,
      nameEn: p.name_en
    }));
  }

  // ค้นหาอำเภอตามชื่อ
  searchDistrict(query, provinceId = null) {
    const lowerQuery = query.toLowerCase();
    const results = [];
    
    this.districtMap.forEach(district => {
      if (provinceId && district.province_id !== provinceId) return;
      
      if (district.name_th.toLowerCase().includes(lowerQuery) ||
          district.name_en.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: district.id,
          nameTh: district.name_th,
          nameEn: district.name_en,
          provinceName: district.provinceName
        });
      }
    });
    
    return results;
  }

  // ดึงข้อมูลจังหวัดพร้อมพิกัด (สำหรับแผนที่)
  getProvincesWithCoordinates() {
    return this.data.map(province => {
      // หาพิกัดจากตำบลแรกที่มีพิกัด
      let lat = null;
      let long = null;
      
      for (const district of province.districts) {
        for (const subDistrict of district.sub_districts) {
          if (subDistrict.lat && subDistrict.long) {
            lat = parseFloat(subDistrict.lat);
            long = parseFloat(subDistrict.long);
            break;
          }
        }
        if (lat && long) break;
      }
      
      // ใช้พิกัดเริ่มต้นสำหรับจังหวัดที่ไม่มีข้อมูล
      if (!lat || !long) {
        const defaultCoords = this.getDefaultProvinceCoordinates(province.name_th);
        lat = defaultCoords[0];
        long = defaultCoords[1];
      }
      
      return {
        id: province.id,
        nameTh: province.name_th,
        nameEn: province.name_en,
        lat,
        long
      };
    });
  }

  // พิกัดเริ่มต้นสำหรับจังหวัดหลัก (ใช้เมื่อไม่มีข้อมูลใน JSON)
  getDefaultProvinceCoordinates(provinceName) {
    const coords = {
      'กรุงเทพมหานคร': [13.7563, 100.5018],
      'เชียงใหม่': [18.7883, 98.9853],
      'ภูเก็ต': [7.8804, 98.3923],
      'ขอนแก่น': [16.4322, 102.8236],
      'สงขลา': [7.1891, 100.5952],
      'นครราชสีมา': [14.9799, 102.1024],
      'ชลบุรี': [13.3611, 100.9866],
      'อุดรธานี': [17.4138, 102.8160],
      'สุราษฎร์ธานี': [9.1382, 99.3331],
      'เชียงราย': [19.9105, 99.8325],
      'นครปฐม': [13.8199, 100.0440],
      'อุบลราชธานี': [15.2286, 104.8567],
      'ระยอง': [12.6814, 101.2816],
      'พิษณุโลก': [16.8214, 100.2659],
      'นครสวรรค์': [15.7047, 100.1372]
    };
    
    return coords[provinceName] || [13.7563, 100.5018]; // Default to Bangkok
  }

  // ดึงข้อมูลจังหวัดโดยละเอียด
  getProvinceById(provinceId) {
    return this.provinceMap.get(provinceId);
  }

  // ดึงข้อมูลอำเภอโดยละเอียด
  getDistrictById(districtId) {
    return this.districtMap.get(districtId);
  }

  // ดึงข้อมูลตำบลโดยละเอียด
  getSubDistrictById(subDistrictId) {
    return this.subDistrictMap.get(subDistrictId);
  }

  // ตรวจสอบรหัสไปรษณีย์ว่าถูกต้องหรือไม่
  validateZipCode(zipCode, provinceId = null) {
    const addresses = this.getAddressByZipCode(zipCode);
    if (addresses.length === 0) return false;
    
    if (provinceId) {
      return addresses.some(addr => addr.provinceId === provinceId);
    }
    
    return true;
  }

  // ดึงข้อมูลรหัสไปรษณีย์ทั้งหมดของจังหวัด
  getZipCodesByProvince(provinceId) {
    const province = this.provinceMap.get(provinceId);
    if (!province) return [];
    
    const zipCodes = new Set();
    province.districts.forEach(district => {
      district.sub_districts.forEach(subDistrict => {
        zipCodes.add(subDistrict.zip_code);
      });
    });
    
    return Array.from(zipCodes).sort((a, b) => a - b);
  }
}

// Export singleton instance
export const thailandAddress = new ThailandAddressManager();

// Export named functions for convenience
export const getAllProvinces = () => thailandAddress.getAllProvinces();
export const getDistrictsByProvince = (provinceId) => thailandAddress.getDistrictsByProvince(provinceId);
export const getSubDistrictsByDistrict = (districtId) => thailandAddress.getSubDistrictsByDistrict(districtId);
export const getAddressByZipCode = (zipCode) => thailandAddress.getAddressByZipCode(zipCode);
export const searchProvince = (query) => thailandAddress.searchProvince(query);
export const searchDistrict = (query, provinceId) => thailandAddress.searchDistrict(query, provinceId);
export const getProvincesWithCoordinates = () => thailandAddress.getProvincesWithCoordinates();
export const validateZipCode = (zipCode, provinceId) => thailandAddress.validateZipCode(zipCode, provinceId);

export default thailandAddress;
