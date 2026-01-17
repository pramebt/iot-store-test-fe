import { Search, X } from 'lucide-react';

export default function ProductFilters({ filters, onFilterChange }) {
  const handlePriceChange = (field, value) => {
    const numValue = value === '' ? undefined : Number(value);
    onFilterChange({ 
      [field]: numValue,
      ...(field === 'minPrice' && filters.maxPrice && numValue && numValue > filters.maxPrice 
        ? { maxPrice: undefined } 
        : {}),
      ...(field === 'maxPrice' && filters.minPrice && numValue && numValue < filters.minPrice 
        ? { minPrice: undefined } 
        : {})
    });
  };

  const clearPriceFilter = () => {
    onFilterChange({ minPrice: undefined, maxPrice: undefined });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-2xl mb-8">
      <div className="space-y-4">
        {/* First Row: Search and Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full px-4 py-2.5 pl-10 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>

          {/* Sort */}
          <select
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm text-gray-900"
            value={filters.sortBy ? `${filters.sortBy}_${filters.order || 'asc'}` : ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                const [sortBy, order] = value.split('_');
                onFilterChange({ sortBy, order });
              } else {
                onFilterChange({ sortBy: undefined, order: undefined });
              }
            }}
          >
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
            <option value="createdAt_desc">Newest First</option>
            <option value="createdAt_asc">Oldest First</option>
          </select>

          {/* Status */}
          <select
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm text-gray-900"
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value || undefined })}
          >
            <option value="">All Products</option>
            <option value="Active">In Stock</option>
            <option value="Inactive">Out of Stock</option>
          </select>
        </div>

        {/* Second Row: Price Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (฿)
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  min="0"
                  step="100"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  min="0"
                  step="100"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
              </div>
              {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                <button
                  onClick={clearPriceFilter}
                  className="px-3 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors"
                  title="Clear price filter"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
