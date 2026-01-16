import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { MapPin, Package } from 'lucide-react';

export default function OrderDeliveryMap({ order }) {
  // Thailand GeoJSON URL
  const geoUrl = "https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json";

  // Province coordinates mapping (major provinces)
  const provinceCoordinates = {
    'กรุงเทพมหานคร': [100.5018, 13.7563],
    'เชียงใหม่': [98.9853, 18.7883],
    'ภูเก็ต': [98.3923, 7.8804],
    'ขอนแก่น': [102.8236, 16.4322],
    'สงขลา': [100.5952, 7.1891],
    'นครราชสีมา': [102.1024, 14.9799],
    'ชลบุรี': [100.9866, 13.3611],
    'อุดรธานี': [102.8160, 17.4138],
    'สุราษฎร์ธานี': [99.3331, 9.1382],
    'เชียงราย': [99.8325, 19.9105],
    'นครสวรรค์': [100.1377, 15.7047],
    'อุบลราชธานี': [104.8561, 15.2286],
    'ระยอง': [101.2816, 12.6814],
    'นครปฐม': [100.0376, 13.8196],
    'ปทุมธานี': [100.5265, 14.0209],
    'นนทบุรี': [100.5167, 13.8621],
  };

  // Get destination coordinates
  const destinationCoords = provinceCoordinates[order?.province] || [100.5, 13.5];
  const hasValidLocation = order?.province && provinceCoordinates[order.province];

  // Origin (warehouse/store) - Bangkok
  const originCoords = [100.5018, 13.7563];

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
        {/* Map */}
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [100.5, 13.5],
            scale: 2000
          }}
          width={800}
          height={500}
          className="w-full h-auto"
        >
          <ZoomableGroup center={[100.5, 13.5]} zoom={1}>
            {/* Thailand Base Map */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#f3f4f6"
                    stroke="#d1d5db"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: '#e5e7eb' },
                      pressed: { outline: 'none' }
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Origin Marker (Warehouse/Store) */}
            <Marker coordinates={originCoords}>
              <g>
                <circle
                  r={6}
                  fill="#3b82f6"
                  stroke="#ffffff"
                  strokeWidth={2}
                  className="drop-shadow-lg"
                />
                <Package className="w-3 h-3" style={{ x: -6, y: -6 }} fill="#ffffff" />
              </g>
              <text
                textAnchor="middle"
                y={20}
                className="text-[9px] fill-blue-700 font-semibold"
              >
                Origin (Store)
              </text>
            </Marker>

            {/* Destination Marker */}
            {hasValidLocation && (
              <Marker coordinates={destinationCoords}>
                <g>
                  <circle
                    r={8}
                    fill="#dc2626"
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="drop-shadow-lg"
                  />
                  <circle
                    r={4}
                    fill="#ffffff"
                    className="animate-pulse"
                  />
                </g>
                <text
                  textAnchor="middle"
                  y={22}
                  className="text-[9px] fill-red-700 font-semibold"
                >
                  {order.province}
                </text>
              </Marker>
            )}

            {/* Connection Line */}
            {hasValidLocation && (
              <line
                x1={originCoords[0] * 10}
                y1={originCoords[1] * 10}
                x2={destinationCoords[0] * 10}
                y2={destinationCoords[1] * 10}
                stroke="#60a5fa"
                strokeWidth={1}
                strokeDasharray="5,5"
                opacity={0.5}
              />
            )}
          </ZoomableGroup>
        </ComposableMap>

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
