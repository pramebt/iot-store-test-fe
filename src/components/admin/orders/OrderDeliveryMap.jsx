import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Package } from 'lucide-react';
import { getProvincesWithCoordinates } from '../../../utils/thailandAddress';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function OrderDeliveryMap({ order }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // โหลดพิกัดจังหวัดจาก JSON
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

  // Get destination coordinates
  const destinationCoords = provinceCoordinates[order?.province] || [13.7563, 100.5018];
  const hasValidLocation = order?.province && provinceCoordinates[order.province];

  // Origin (warehouse/store) - Bangkok
  const originCoords = [13.7563, 100.5018];

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map
    const map = L.map(mapRef.current, {
      center: originCoords,
      zoom: 6,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // Add tile layer
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

  // Update markers when order changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing layers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Origin marker (Store/Warehouse)
    const originIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background-color: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const originMarker = L.marker(originCoords, { icon: originIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`
        <div style="text-align: center;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">Origin (Store)</h3>
          <p style="margin: 4px 0; color: #6b7280;">กรุงเทพมหานคร</p>
          <p style="margin: 4px 0; color: #6b7280; font-size: 12px;">คลังสินค้าหลัก</p>
        </div>
      `);

    // Destination marker if valid location
    if (hasValidLocation) {
      const destIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background-color: #dc2626;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          ">
            <div style="
              width: 16px;
              height: 16px;
              background-color: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const destMarker = L.marker(destinationCoords, { icon: destIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="text-align: center;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">Destination</h3>
            <p style="margin: 4px 0; color: #6b7280; font-weight: bold;">${order.province}</p>
            ${order.district ? `<p style="margin: 4px 0; color: #6b7280; font-size: 12px;">${order.district}</p>` : ''}
          </div>
        `);

      // Draw line between origin and destination
      const line = L.polyline([originCoords, destinationCoords], {
        color: '#60a5fa',
        weight: 2,
        opacity: 0.6,
        dashArray: '10, 10',
      }).addTo(mapInstanceRef.current);

      // Fit map to show both markers
      const bounds = L.latLngBounds([originCoords, destinationCoords]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [order, hasValidLocation, destinationCoords, originCoords]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Delivery Location</h3>
        {hasValidLocation ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <MapPin className="w-4 h-4" />
            <span>Location Mapped</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>Location Unknown</span>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        {/* Map Container */}
        <div 
          ref={mapRef} 
          className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 mb-4"
          style={{ zIndex: 1 }}
        />

        {/* Delivery Info */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Origin */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs font-semibold text-blue-900">จุดเริ่มต้น</span>
            </div>
            <p className="text-sm text-blue-800 font-medium">กรุงเทพมหานคร</p>
            <p className="text-xs text-blue-600">คลังสินค้าหลัก</p>
          </div>

          {/* Destination */}
          <div className={`rounded-lg p-3 border ${hasValidLocation ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${hasValidLocation ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className={`text-xs font-semibold ${hasValidLocation ? 'text-red-900' : 'text-gray-600'}`}>
                จุดหมายปลายทาง
              </span>
            </div>
            {hasValidLocation ? (
              <>
                <p className="text-sm text-red-800 font-medium">{order.province}</p>
                {order.district && (
                  <p className="text-xs text-red-600">{order.district}</p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 font-medium">{order?.province || 'ไม่ระบุจังหวัด'}</p>
                <p className="text-xs text-gray-500">ไม่สามารถแสดงตำแหน่งบนแผนที่</p>
              </>
            )}
          </div>
        </div>

        {/* Full Address */}
        {order?.address && (
          <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-700 mb-1">ที่อยู่จัดส่งเต็ม:</p>
                <p className="text-sm text-gray-900">{order.address}</p>
                {order.district && order.postalCode && (
                  <p className="text-xs text-gray-600 mt-1">
                    {order.district} {order.province} {order.postalCode}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contact */}
        {order?.phone && (
          <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-1">เบอร์ติดต่อ:</p>
            <p className="text-sm text-gray-900">{order.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
}
