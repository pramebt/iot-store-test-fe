import { Search } from 'lucide-react';
import Input from '../../common/Input';

export default function ProductFilters({ filters, onFilterChange }) {
  return (
    <div className="bg-gray-50 p-6 rounded-2xl mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
          <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
        </div>

        {/* Sort */}
        <select
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm text-gray-900"
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
        >
          <option value="">Sort by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>

        {/* Status */}
        <select
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm text-gray-900"
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
        >
          <option value="">All Products</option>
          <option value="Active">In Stock</option>
          <option value="Inactive">Out of Stock</option>
        </select>
      </div>
    </div>
  );
}
