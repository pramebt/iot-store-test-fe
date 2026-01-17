import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { getProvincesWithCoordinates } from '../../../utils/thailandAddress';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LeafletMap({ salesByProvince = [] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // โหลดพิกัดจังหวัดทั้งหมดจาก JSON
  const provinceCoordinates = useMemo(() => {
    const provinces = getProvincesWithCoordinates();
    const coordsMap = {};
    
    provinces.forEach(province => {
      if (province.lat && province.long) {
        coordsMap[province.nameTh] = [province.lat, province.long];
      }
    });
    
    return coordsMap;
  }, []);

  // Get color based on sales
  const getColor = (sales, maxSales) => {
    if (!sales || sales === 0) return '#e5e7eb';
    const ratio = sales / maxSales;
    if (ratio < 0.25) return '#10b981'; // Green
    if (ratio < 0.5) return '#fbbf24';  // Yellow
    if (ratio < 0.75) return '#f97316'; // Orange
    return '#dc2626'; // Red
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [13.7563, 100.5018], // Bangkok
      zoom: 6,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const maxSales = Math.max(...salesByProvince.map(d => d.totalSales || 0), 1);

    // Add markers for each province
    salesByProvince.forEach(data => {
      const coords = provinceCoordinates[data.province];
      if (!coords) {
        console.warn(`ไม่พบพิกัดสำหรับจังหวัด: ${data.province}`);
        return;
      }

      const color = getColor(data.totalSales, maxSales);
      const size = Math.max(20, Math.min(40, (data.totalSales / maxSales) * 40));

      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 10px;
          ">
            ${data.ordersCount}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker(coords, { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="text-align: center;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #111827;">${data.province}</h3>
            <p style="margin: 4px 0; color: #374151;">
              <strong>ยอดขาย:</strong> ฿${data.totalSales?.toLocaleString() || 0}
            </p>
            <p style="margin: 4px 0; color: #374151;">
              <strong>ออเดอร์:</strong> ${data.ordersCount || 0} รายการ
            </p>
          </div>
        `);

      markersRef.current.push(marker);
    });
  }, [salesByProvince, provinceCoordinates]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sales by Province</h3>
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <MapPin className="w-4 h-4" />
          <span>Interactive Map</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        {/* Map Container */}
        <div 
          ref={mapRef} 
          className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200"
          style={{ zIndex: 1 }}
        />

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-600 font-medium">ยอดน้อย</span>
          </div>
          <div className="flex gap-1">
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((i) => {
              const maxSales = Math.max(...salesByProvince.map(d => d.totalSales || 0), 1);
              const color = getColor(maxSales * i, maxSales);
              return (
                <div
                  key={i}
                  className="w-8 h-4 rounded-sm border border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span className="text-gray-600 font-medium">ยอดเยอะ</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-3 text-xs text-gray-600 text-center">
          💡 คลิกที่จุดบนแผนที่เพื่อดูรายละเอียด | ซูมด้วยล้อเมาส์หรือปุ่ม +/-
        </div>

        {/* Stats */}
        {salesByProvince.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-2 text-center">
              <div className="text-xs text-gray-600">Total Provinces</div>
              <div className="text-lg font-semibold text-gray-900">{salesByProvince.length}</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <div className="text-xs text-gray-600">Total Orders</div>
              <div className="text-lg font-semibold text-gray-900">
                {salesByProvince.reduce((sum, p) => sum + p.ordersCount, 0)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* No Data Message */}
      {salesByProvince.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 font-medium">No Sales Data</p>
            <p className="text-xs text-gray-500 mt-1">Orders with province data will appear on the map</p>
          </div>
        </div>
      )}
    </div>
  );
}
