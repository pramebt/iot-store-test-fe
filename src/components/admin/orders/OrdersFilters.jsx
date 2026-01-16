export default function OrdersFilters({ filters, onFilterChange, onClearFilters }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Search by order number or customer..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
        />
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value, page: 1 })}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button
          onClick={onClearFilters}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition-all"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
