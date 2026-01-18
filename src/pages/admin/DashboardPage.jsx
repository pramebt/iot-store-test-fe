import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, Package, Users, Smartphone, Plus, FolderPlus, ClipboardList, BarChart3, TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import { analyticsService } from '../../services/analytics.service'
import { ordersService } from '../../services/orders.service'
import StatCard from '../../components/common/StatCard'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [summaryData, ordersData] = await Promise.all([
        analyticsService.getSummary().catch(() => ({
          totalRevenue: 0,
          totalOrders: 0,
          totalCustomers: 0,
          totalProducts: 0,
          revenueGrowth: 0,
          orderGrowth: 0,
          customerGrowth: 0
        })),
        ordersService.getAll({ limit: 5, page: 1 }).catch(() => ({ orders: [] }))
      ])
      setSummary(summaryData)
      setRecentOrders(ordersData.orders || [])
    } catch (error) {
      console.error('Failed to load dashboard:', error)
      // Set default values on error
      setSummary({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        revenueGrowth: 0,
        orderGrowth: 0,
        customerGrowth: 0
      })
      setRecentOrders([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50/40 via-white to-slate-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
          <div className="text-slate-600 font-light">กำลังโหลดข้อมูลแดชบอร์ด...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-base text-gray-600">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Total Revenue"
            value={`฿${(summary.totalRevenue || 0).toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5 text-white" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Orders"
            value={summary.totalOrders || 0}
            icon={<Package className="w-5 h-5 text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="Total Customers"
            value={summary.totalCustomers || 0}
            icon={<Users className="w-5 h-5 text-white" />}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Products"
            value={summary.totalProducts || 0}
            icon={<Smartphone className="w-5 h-5 text-white" />}
            color="bg-orange-500"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 sm:p-5">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <QuickActionButton to="/admin/products/new" icon={<Plus className="w-5 h-5" />} label="Add Product" />
          <QuickActionButton to="/admin/categories/new" icon={<FolderPlus className="w-5 h-5" />} label="Add Category" />
          <QuickActionButton to="/admin/orders" icon={<ClipboardList className="w-5 h-5" />} label="View Orders" />
          <QuickActionButton to="/admin/analytics" icon={<BarChart3 className="w-5 h-5" />} label="Analytics" />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-gray-900 hover:text-gray-600 text-[10px] sm:text-xs font-medium">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Customer</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 sm:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                      {order.customer?.name || 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      ฿{order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Growth Indicators */}
      {summary?.revenueGrowth !== undefined && summary?.orderGrowth !== undefined && summary?.customerGrowth !== undefined && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <GrowthCard
            title="Revenue Growth"
            value={`${summary.revenueGrowth > 0 ? '+' : ''}${(summary.revenueGrowth || 0).toFixed(1)}%`}
            isPositive={summary.revenueGrowth >= 0}
          />
          <GrowthCard
            title="Order Growth"
            value={`${summary.orderGrowth > 0 ? '+' : ''}${(summary.orderGrowth || 0).toFixed(1)}%`}
            isPositive={summary.orderGrowth >= 0}
          />
          <GrowthCard
            title="Customer Growth"
            value={`${summary.customerGrowth > 0 ? '+' : ''}${(summary.customerGrowth || 0).toFixed(1)}%`}
            isPositive={summary.customerGrowth >= 0}
          />
        </div>
      )}
    </div>
  )
}

function QuickActionButton({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all border border-gray-200"
    >
      <div className="text-gray-700 mb-1.5 sm:mb-2">{icon}</div>
      <span className="text-[10px] sm:text-xs text-gray-700 text-center">{label}</span>
    </Link>
  )
}

function StatusBadge({ status }) {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-blue-100 text-blue-800',
    CONFIRMED: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  return (
    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}

function GrowthCard({ title, value, isPositive }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all">
      <p className="text-xs text-gray-600 mb-2">{title}</p>
      <div className="flex items-center">
        <span className={`text-2xl font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {value}
        </span>
        <div className="ml-2">
          {isPositive ? (
            <TrendingUp className="w-5 h-5 text-green-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-600" />
          )}
        </div>
      </div>
      <p className="text-[10px] text-gray-500 mt-1">vs last month</p>
    </div>
  )
}
