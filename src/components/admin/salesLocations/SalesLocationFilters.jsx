export default function SalesLocationFilters({ filters, onFilterChange, onClearFilters }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Search by name or code..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value, page: 1 })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
