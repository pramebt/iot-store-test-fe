import { useEffect, useState } from 'react';
import { productsService } from '../../services/products.service';
import ProductCard from '../../components/customer/products/ProductCard';
import ProductFilters from '../../components/customer/products/ProductFilters';
import Button from '../../components/common/Button';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sort: '',
    status: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadProducts();
  }, [filters, pagination.page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        status: filters.status || undefined,
      };

      const data = await productsService.getAll(params);
      
      let productsData = data.products || [];
      
      // Client-side sorting
      if (filters.sort) {
        productsData = [...productsData].sort((a, b) => {
          switch (filters.sort) {
            case 'price_asc':
              return a.price - b.price;
            case 'price_desc':
              return b.price - a.price;
            case 'name_asc':
              return a.name.localeCompare(b.name);
            case 'name_desc':
              return b.name.localeCompare(a.name);
            default:
              return 0;
          }
        });
      }
      
      setProducts(productsData);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
        totalPages: data.totalPages || 1,
      }));
    } catch (err) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900">Products</h1>

      <ProductFilters filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="text-center py-20">
          <div className="text-xl text-gray-600">Loading products...</div>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="text-xl text-gray-900 mb-6">Error: {error}</div>
          <button 
            onClick={loadProducts}
            className="bg-gray-900 text-white text-sm px-6 py-2 rounded-full hover:bg-gray-800 transition-all"
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-xl text-gray-500">No products found</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 text-sm rounded-full transition-all ${
                      page === pagination.page
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
