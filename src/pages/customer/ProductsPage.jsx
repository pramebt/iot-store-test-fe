import { useEffect, useState } from 'react';
import { productsService } from '../../services/products.service';
import { categoriesService } from '../../services/categories.service';
import ProductCard from '../../components/customer/products/ProductCard';
import ProductFilters from '../../components/customer/products/ProductFilters';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { Loader2, XCircle, Package } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: '',
    order: '',
    status: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters, pagination.page]);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories([]);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        status: filters.status || undefined,
        category: filters.category || undefined,
        minPrice: filters.minPrice !== undefined ? filters.minPrice : undefined,
        maxPrice: filters.maxPrice !== undefined ? filters.maxPrice : undefined,
        sortBy: filters.sortBy || undefined,
        order: filters.order || undefined,
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const data = await productsService.getAll(params);
      
      setProducts(data.products || []);
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
    <PageContainer>
      <PageHeader 
        title="Products"
        subtitle="Browse our collection of products"
      />

      <ProductFilters filters={filters} categories={categories} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="text-center py-32">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
          <div className="text-slate-600 font-light">กำลังโหลดสินค้า...</div>
        </div>
      ) : error ? (
        <div className="text-center py-32">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-xl text-slate-800 mb-2 font-medium">เกิดข้อผิดพลาด</div>
          <div className="text-slate-600 mb-8 font-light">{error}</div>
          <button 
            onClick={loadProducts}
            className="bg-slate-800 text-white px-6 py-2.5 rounded-full hover:bg-slate-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
          >
            ลองอีกครั้ง
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-32">
          <div className="w-24 h-24 bg-linear-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Package className="w-12 h-12 text-slate-500" />
          </div>
          <div className="text-2xl font-semibold text-slate-800 mb-2 tracking-tight">ไม่พบสินค้า</div>
          <div className="text-slate-600 font-light">ลองค้นหาด้วยคำอื่น</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-12">
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
    </PageContainer>
  );
}
