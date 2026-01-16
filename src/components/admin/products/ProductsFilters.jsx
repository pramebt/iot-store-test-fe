export default function ProductsFilters({ 
  filters, 
  categories, 
  onFilterChange, 
  onClearFilters 
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
        />
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value, page: 1 })}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value, page: 1 })}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
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
