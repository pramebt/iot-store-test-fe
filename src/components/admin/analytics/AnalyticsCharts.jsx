import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatPrice } from '../../../utils/formatPrice';

export default function AnalyticsCharts({ salesHistory = [], topProvinces = [] }) {
  // Format data for charts
  const formattedHistory = salesHistory.map(item => ({
    month: item.month || 'N/A',
    sales: item.totalSales || 0,
    orders: item.ordersCount || 0,
  }));

  const formattedTopProvinces = topProvinces.slice(0, 10).map(item => ({
    province: item.province || 'Unknown',
    sales: item.totalSales || 0,
    orders: item.ordersCount || 0,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-2.5 shadow-lg">
          <p className="text-xs font-medium text-gray-900 mb-1.5">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Sales') ? formatPrice(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Sales History Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Sales Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#1f2937" 
              strokeWidth={2}
              name="Total Sales"
              dot={{ fill: '#1f2937', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Provinces Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Top 10 Provinces by Sales</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={formattedTopProvinces} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}k`}
            />
            <YAxis 
              type="category" 
              dataKey="province" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="sales" 
              fill="#1f2937" 
              name="Total Sales"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Count Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Orders by Month</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={formattedHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="orders" 
              fill="#6b7280" 
              name="Total Orders"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
