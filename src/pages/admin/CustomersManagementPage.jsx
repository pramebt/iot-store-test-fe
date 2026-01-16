import { useEffect, useState } from 'react'
import { Users, CheckCircle, PlusCircle, ShoppingCart, Info } from 'lucide-react'
import { customersService } from '../../services/customers.service'
import StatCard from '../../components/common/StatCard'

export default function CustomersManagementPage() {
  const [customers, setCustomers] = useState([])
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    newThisMonth: 0,
    withOrders: 0
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    province: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    loadCustomers()
    loadStats()
  }, [filters])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const data = await customersService.getAll(filters)
      setCustomers(data.customers || [])
      setPagination({
        total: data.total,
        totalPages: data.totalPages
      })
    } catch (error) {
      console.error('Failed to load customers:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const data = await customersService.getStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Customers</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">View and manage customer information</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard title="Total Customers" value={stats.totalCustomers.toString()} icon={<Users className="w-5 h-5 text-white" />} color="bg-blue-500" />
        <StatCard title="Active" value={stats.activeCustomers.toString()} icon={<CheckCircle className="w-5 h-5 text-white" />} color="bg-green-500" />
        <StatCard title="New This Month" value={stats.newThisMonth.toString()} icon={<PlusCircle className="w-5 h-5 text-white" />} color="bg-purple-500" />
        <StatCard title="With Orders" value={stats.withOrders.toString()} icon={<ShoppingCart className="w-5 h-5 text-white" />} color="bg-orange-500" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filters.province}
            onChange={(e) => setFilters({ ...filters, province: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Provinces</option>
            <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
            <option value="เชียงใหม่">เชียงใหม่</option>
            <option value="ภูเก็ต">ภูเก็ต</option>
          </select>
          <button
            onClick={() => setFilters({ search: '', province: '', page: 1, limit: 10 })}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading customers...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex justify-center mb-3">
                        <Users className="w-12 h-12 text-gray-400" />
                      </div>
                      <div className="text-gray-500 font-medium">No customers yet</div>
                      <div className="text-sm text-gray-400 mt-1">
                        Customer data will appear here once users register
                      </div>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {customer.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-xs text-gray-500">{customer.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-xs text-gray-500">{customer.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {customer.province ? (
                          <div>
                            <div>{customer.province}</div>
                            <div className="text-xs text-gray-500">{customer.district}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {customer._count?.orders || 0}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ฿{customer.totalSpent?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          View Orders
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-700">
            Showing page {filters.page} of {pagination.totalPages} ({pagination.total} total customers)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page === pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
