import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { MapPin } from 'lucide-react';
import thailandProvinces from '../../../data/thailand-provinces-simple.json';

export default function ThailandMap({ salesByProvince = [] }) {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Create color scale based on sales data - ใช้สีเขียว (น้อย) -> เหลือง (กลาง) -> แดง (เยอะ)
  const maxSales = Math.max(...salesByProvince.map(d => d.totalSales || 0), 1);
  const colorScale = scaleLinear()
    .domain([0, maxSales / 3, (maxSales * 2) / 3, maxSales])
    .range(['#10b981', '#fbbf24', '#f97316', '#dc2626']); // Green -> Yellow -> Orange -> Red

  const getSalesForProvince = (provinceName) => {
    const data = salesByProvince.find(d => 
      d.province?.toLowerCase() === provinceName?.toLowerCase() ||
      d.province === provinceName
    );
    return data || { totalSales: 0, ordersCount: 0 };
  };

  const handleMarkerEnter = (province, event) => {
    const sales = getSalesForProvince(province.properties.name);
    setTooltipContent({
      name: province.properties.name,
      sales: sales.totalSales,
      orders: sales.ordersCount
    });
    setTooltipPosition({ 
      x: event.clientX, 
      y: event.clientY 
    });
  };

  const handleMarkerLeave = () => {
    setTooltipContent('');
  };

  // Thailand bounds approximately
  const geoUrl = "https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json";

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Sales by Province</h3>
      
      <div className="bg-gray-50 rounded-lg p-4">
        {/* Map Container */}
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [100.5, 13.5],
            scale: 2000
          }}
          width={800}
          height={600}
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

            {/* Province Markers */}
            {thailandProvinces.features.map((province) => {
              const sales = getSalesForProvince(province.properties.name);
              const hasSales = sales.totalSales > 0;
              const markerSize = hasSales 
                ? Math.max(4, Math.min(12, (sales.totalSales / maxSales) * 12))
                : 3;
              const markerColor = hasSales 
                ? colorScale(sales.totalSales)
                : '#e5e7eb'; // สีเทาอ่อนสำหรับไม่มียอดขาย

              return (
                <Marker
                  key={province.properties.name}
                  coordinates={province.geometry.coordinates}
                  onMouseEnter={(e) => handleMarkerEnter(province, e)}
                  onMouseLeave={handleMarkerLeave}
                >
                  <circle
                    r={markerSize}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    className="cursor-pointer hover:opacity-80 transition-opacity drop-shadow-md"
                  />
                  {hasSales && (
                    <text
                      textAnchor="middle"
                      y={markerSize + 12}
                      className="text-[8px] fill-gray-700 font-medium"
                    >
                      {province.properties.name}
                    </text>
                  )}
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-600 font-medium">ยอดน้อย</span>
          </div>
          <div className="flex gap-1">
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((i) => (
              <div
                key={i}
                className="w-8 h-4 rounded-sm border border-white shadow-sm"
                style={{
                  backgroundColor: colorScale(maxSales * i)
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span className="text-gray-600 font-medium">ยอดเยอะ</span>
          </div>
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

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="fixed bg-gray-900 text-white px-3 py-2 rounded-lg text-xs pointer-events-none z-50 shadow-lg"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
          }}
        >
          <div className="font-semibold mb-1">{tooltipContent.name}</div>
          <div className="text-gray-300">
            Sales: ฿{tooltipContent.sales?.toLocaleString() || 0}
          </div>
          <div className="text-gray-300">
            Orders: {tooltipContent.orders || 0}
          </div>
        </div>
      )}
    </div>
  );
}
