import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { MapPin } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';

// Thailand GeoJSON (simplified for demo - in production, use proper TopoJSON)
const THAILAND_GEOJSON = {
  type: "FeatureCollection",
  features: [
    // Simplified Thailand provinces - in production, use proper GeoJSON data
    // This is a placeholder structure
  ]
};

export default function AnalyticsMap({ salesByProvince = [] }) {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Create color scale based on sales data
  const maxSales = Math.max(...salesByProvince.map(d => d.totalSales || 0), 1);
  const colorScale = scaleLinear()
    .domain([0, maxSales / 2, maxSales])
    .range(['#f0f0f0', '#93c5fd', '#1e40af']);

  const getSalesForProvince = (provinceName) => {
    const data = salesByProvince.find(d => 
      d.province?.toLowerCase() === provinceName?.toLowerCase()
    );
    return data?.totalSales || 0;
  };

  const handleMouseEnter = (geo, event) => {
    const provinceName = geo.properties.name;
    const sales = getSalesForProvince(provinceName);
    const ordersCount = salesByProvince.find(d => 
      d.province?.toLowerCase() === provinceName?.toLowerCase()
    )?.ordersCount || 0;

    setTooltipContent(
      `${provinceName}\nSales: ${formatPrice(sales)}\nOrders: ${ordersCount}`
    );
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipContent('');
  };

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Sales by Province</h3>
        
        {/* For demo purposes - showing a placeholder */}
        <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h4 className="text-base font-medium text-gray-900 mb-1">Thailand Map</h4>
            <p className="text-gray-500 text-xs mb-4">
              Interactive map showing sales distribution across provinces
            </p>
            
            {/* Province Sales List */}
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg p-3 space-y-1.5">
                {salesByProvince.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium text-gray-900">{item.province || 'Unknown'}</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{formatPrice(item.totalSales)}</div>
                      <div className="text-[10px] text-gray-500">{item.ordersCount} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="text-xs text-gray-600">Low Sales</span>
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-6 h-3 rounded-sm"
                style={{
                  backgroundColor: colorScale((maxSales / 4) * i)
                }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">High Sales</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="fixed bg-gray-900 text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-50 whitespace-pre-line"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}
