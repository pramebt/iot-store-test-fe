import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import AnalyticsStats from '../../components/admin/analytics/AnalyticsStats';
import LeafletMap from '../../components/admin/analytics/LeafletMap';
import AnalyticsCharts from '../../components/admin/analytics/AnalyticsCharts';
import { RefreshCw, XCircle } from 'lucide-react';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    summary: {},
    salesByProvince: [],
    salesHistory: [],
    topProvinces: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all analytics data in parallel
      const [summary, provinces, history, topProvinces] = await Promise.all([
        analyticsService.getSummary().catch((err) => {
          console.error('getSummary error:', err);
          return {};
        }),
        analyticsService.getSalesByProvince().catch((err) => {
          console.error('getSalesByProvince error:', err);
          return [];
        }),
        analyticsService.getSalesHistory(6).catch((err) => {
          console.error('getSalesHistory error:', err);
          return [];
        }),
        analyticsService.getTopProvinces(10).catch((err) => {
          console.error('getTopProvinces error:', err);
          return [];
        }),
      ]);

      console.log('Analytics data loaded:', { summary, provinces, history, topProvinces });

      setData({
        summary: summary || {},
        salesByProvince: provinces || [],
        salesHistory: history || [],
        topProvinces: topProvinces || [],
      });
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50/40 via-white to-slate-50/30">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
            <div className="text-slate-600 font-light">กำลังโหลดข้อมูลวิเคราะห์...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50/40 via-white to-slate-50/30">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-xl text-slate-800 mb-2 font-medium">เกิดข้อผิดพลาด</div>
            <div className="text-slate-600 mb-8 font-light">{error}</div>
            <button
              onClick={loadAnalytics}
              className="bg-slate-800 text-white px-6 py-2.5 rounded-full hover:bg-slate-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              ลองอีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Sales performance and insights</p>
        </div>
        <button
          onClick={loadAnalytics}
          className="bg-gray-50 text-gray-700 text-xs sm:text-sm px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all inline-flex items-center gap-2 border border-gray-200 self-start"
        >
          <RefreshCw className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <AnalyticsStats summary={data.summary} />

      {/* Leaflet Map - Full Width */}
      <div>
        <LeafletMap salesByProvince={data.salesByProvince} />
      </div>

      {/* Top Provinces and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Provinces List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Top Provinces</h3>
          {data.topProvinces && data.topProvinces.length > 0 ? (
            <div className="space-y-2">
              {data.topProvinces.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-gray-900 text-white rounded-lg flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.province || 'Unknown'}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ฿{(item.totalSales || 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {item.ordersCount || 0} orders
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No sales data available yet</p>
              <p className="text-xs mt-1">Orders with province data will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <AnalyticsCharts 
        salesHistory={data.salesHistory} 
        topProvinces={data.topProvinces} 
      />
    </div>
  );
}
