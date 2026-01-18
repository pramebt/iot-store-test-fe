import { Search, X, FolderTree } from 'lucide-react';

export default function ProductFilters({ filters, onFilterChange, categories = [] }) {
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
    <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/60 mb-8 shadow-sm">
      <div className="space-y-4">
        {/* First Row: Search, Category, Sort, Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full px-5 py-3 pl-10 bg-white border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm text-slate-800 font-light transition-all duration-200"
            />
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
          </div>

          {/* Category */}
          <div className="relative">
            <select
              className="w-full px-5 py-3 pl-10 bg-white border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm text-slate-800 font-light transition-all duration-200 appearance-none cursor-pointer"
              value={filters.category || ''}
              onChange={(e) => onFilterChange({ category: e.target.value || undefined })}
            >
              <option value="">หมวดหมู่ทั้งหมด</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <FolderTree className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <select
            className="px-5 py-3 bg-white border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm text-slate-800 font-light transition-all duration-200 cursor-pointer"
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
            <option value="">เรียงตาม</option>
            <option value="price_asc">ราคา: ต่ำ → สูง</option>
            <option value="price_desc">ราคา: สูง → ต่ำ</option>
            <option value="name_asc">ชื่อ: ก → ฮ</option>
            <option value="name_desc">ชื่อ: ฮ → ก</option>
            <option value="createdAt_desc">ใหม่ล่าสุด</option>
            <option value="createdAt_asc">เก่าที่สุด</option>
          </select>

          {/* Status */}
          <select
            className="px-5 py-3 bg-white border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm text-slate-800 font-light transition-all duration-200 cursor-pointer"
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value || undefined })}
          >
            <option value="">สินค้าทั้งหมด</option>
            <option value="Active">มีสินค้า</option>
            <option value="Inactive">หมด</option>
          </select>
        </div>

        {/* Second Row: Price Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              ช่วงราคา (฿)
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="ต่ำสุด"
                  value={filters.minPrice || ''}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  min="0"
                  step="100"
                  className="w-full px-5 py-3 bg-white border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm text-slate-800 font-light transition-all duration-200"
                />
              </div>
              <span className="text-slate-500 font-light">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="สูงสุด"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  min="0"
                  step="100"
                  className="w-full px-5 py-3 bg-white border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm text-slate-800 font-light transition-all duration-200"
                />
              </div>
              {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                <button
                  onClick={clearPriceFilter}
                  className="px-4 py-3 bg-slate-100/90 hover:bg-slate-200/90 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
                  title="ล้างตัวกรองราคา"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
