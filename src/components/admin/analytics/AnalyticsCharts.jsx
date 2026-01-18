import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { formatPrice } from '../../../utils/formatPrice';
import { TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';

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

  // Calculate summary stats
  const totalSales = formattedHistory.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = formattedHistory.reduce((sum, item) => sum + item.orders, 0);
  const avgSales = formattedHistory.length > 0 ? totalSales / formattedHistory.length : 0;
  const salesGrowth = formattedHistory.length >= 2 
    ? ((formattedHistory[formattedHistory.length - 1].sales - formattedHistory[0].sales) / formattedHistory[0].sales * 100)
    : 0;

  // Color palette for provinces
  const provinceColors = [
    '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 shadow-xl">
          <p className="text-sm font-semibold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-slate-600 font-medium">{entry.name}:</span>
                <span className="text-xs font-semibold text-slate-800">
                  {entry.name.includes('Sales') ? formatPrice(entry.value) : `${entry.value} รายการ`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Sales History Chart */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-800 tracking-tight mb-1">ยอดขายรายเดือน</h3>
            <p className="text-sm text-slate-600 font-light">แนวโน้มยอดขายในช่วง 6 เดือนล่าสุด</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-slate-800">{formatPrice(totalSales)}</div>
            <div className={`text-sm flex items-center gap-1 ${salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {salesGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">{salesGrowth >= 0 ? '+' : ''}{salesGrowth.toFixed(1)}%</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={formattedHistory} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              style={{ fontSize: '13px', fontFamily: 'Kanit' }}
              tick={{ fill: '#64748b' }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '13px', fontFamily: 'Kanit' }}
              tick={{ fill: '#64748b' }}
              tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="ยอดขาย"
              dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-600 font-light">ยอดขายเฉลี่ย:</span>
              <span className="text-slate-800 font-semibold">{formatPrice(avgSales)}</span>
            </div>
          </div>
          <div className="text-slate-500 font-light">
            {formattedHistory.length} เดือน
          </div>
        </div>
      </div>

      {/* Top Provinces Chart */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-800 tracking-tight mb-1">ยอดขายตามจังหวัด</h3>
            <p className="text-sm text-slate-600 font-light">10 จังหวัดที่มียอดขายสูงสุด</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-slate-800">
              {formatPrice(formattedTopProvinces.reduce((sum, item) => sum + item.sales, 0))}
            </div>
            <div className="text-sm text-slate-600 font-light">
              {formattedTopProvinces.reduce((sum, item) => sum + item.orders, 0)} รายการ
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={formattedTopProvinces} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis 
              type="number" 
              stroke="#64748b"
              style={{ fontSize: '13px', fontFamily: 'Kanit' }}
              tick={{ fill: '#64748b' }}
              tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}k`}
            />
            <YAxis 
              type="category" 
              dataKey="province" 
              stroke="#64748b"
              style={{ fontSize: '13px', fontFamily: 'Kanit' }}
              tick={{ fill: '#64748b' }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="sales" 
              name="ยอดขาย"
              radius={[0, 12, 12, 0]}
            >
              {formattedTopProvinces.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={provinceColors[index % provinceColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 pt-4 border-t border-slate-200/60">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {formattedTopProvinces.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: provinceColors[index] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate">{item.province}</div>
                  <div className="text-xs text-slate-600 font-light">{formatPrice(item.sales)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Count Chart */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-800 tracking-tight mb-1">จำนวนออเดอร์รายเดือน</h3>
            <p className="text-sm text-slate-600 font-light">จำนวนออเดอร์ที่ได้รับในแต่ละเดือน</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-slate-800">{totalOrders.toLocaleString()}</div>
            <div className="text-sm text-slate-600 font-light">
              เฉลี่ย {formattedHistory.length > 0 ? Math.round(totalOrders / formattedHistory.length) : 0} รายการ/เดือน
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedHistory} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              style={{ fontSize: '13px', fontFamily: 'Kanit' }}
              tick={{ fill: '#64748b' }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '13px', fontFamily: 'Kanit' }}
              tick={{ fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="orders" 
              name="จำนวนออเดอร์"
              fill="#10b981"
              radius={[12, 12, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-green-600" />
            <span className="text-slate-600 font-light">รวมทั้งหมด:</span>
            <span className="text-slate-800 font-semibold">{totalOrders.toLocaleString()} ออเดอร์</span>
          </div>
          <div className="text-slate-500 font-light">
            {formattedHistory.length} เดือน
          </div>
        </div>
      </div>
    </div>
  );
}
