import { TrendingUp, ShoppingBag, Users, DollarSign, Package, MapPin } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';

export default function AnalyticsStats({ summary = {} }) {
  const stats = [
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: formatPrice(summary.totalRevenue || 0),
      change: summary.revenueGrowth || 0,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: ShoppingBag,
      label: 'Total Orders',
      value: (summary.totalOrders || 0).toLocaleString(),
      change: summary.ordersGrowth || 0,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Users,
      label: 'Total Customers',
      value: (summary.totalCustomers || 0).toLocaleString(),
      change: summary.customersGrowth || 0,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: Package,
      label: 'Products Sold',
      value: (summary.totalProductsSold || 0).toLocaleString(),
      change: summary.productsSoldGrowth || 0,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      icon: DollarSign,
      label: 'Average Order Value',
      value: formatPrice(summary.averageOrderValue || 0),
      change: summary.aovGrowth || 0,
      color: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
    {
      icon: MapPin,
      label: 'Active Provinces',
      value: (summary.activeProvinces || 0).toLocaleString(),
      change: summary.provincesGrowth || 0,
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;
        
        return (
          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              {stat.change !== 0 && (
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-3.5 h-3.5 ${!isPositive && 'rotate-180'}`} />
                  {Math.abs(stat.change).toFixed(1)}%
                </div>
              )}
            </div>
            
            <div>
              <div className="text-xl font-semibold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
