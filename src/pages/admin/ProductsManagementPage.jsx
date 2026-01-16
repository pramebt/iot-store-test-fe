import { useEffect, useState } from 'react'
import { productsService } from '../../services/products.service'
import { categoriesService } from '../../services/categories.service'
import ProductsTable from '../../components/admin/products/ProductsTable'
import ProductsFilters from '../../components/admin/products/ProductsFilters'
import AddProductModal from '../../components/admin/products/AddProductModal'
import Pagination from '../../components/admin/products/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function ProductsManagementPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    page: 1,
    limit: 10
  })
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [filters])

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { categoryId: filters.category }),
        ...(filters.status && { status: filters.status })
      }
      const data = await productsService.getAll(params)
      setProducts(data.products || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      await productsService.delete(id)
      loadProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product')
    }
  }

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === 'Active' ? 'Inactive' : 'Active'
      await productsService.update(product.id, { status: newStatus })
      loadProducts()
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Products</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gray-900 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full hover:bg-gray-800 transition-all whitespace-nowrap"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <ProductsFilters
        filters={filters}
        categories={categories}
        onFilterChange={setFilters}
        onClearFilters={() => setFilters({ search: '', category: '', status: '', page: 1, limit: 10 })}
      />

      {/* Products Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading products..." />
        ) : (
          <>
            <ProductsTable
              products={products}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          </>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadProducts}
      />
    </div>
  )
}
