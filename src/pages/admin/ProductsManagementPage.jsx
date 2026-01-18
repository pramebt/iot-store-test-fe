import { useEffect, useState } from 'react'
import { productsService } from '../../services/products.service'
import { categoriesService } from '../../services/categories.service'
import ProductsTable from '../../components/admin/products/ProductsTable'
import ProductsFilters from '../../components/admin/products/ProductsFilters'
import AddProductModal from '../../components/admin/products/AddProductModal'
import EditProductModal from '../../components/admin/products/EditProductModal'
import DeleteProductModal from '../../components/admin/products/DeleteProductModal'
import Pagination from '../../components/admin/products/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import PageHeader from '../../components/common/PageHeader'
import toast from '../../utils/toast'

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
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
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
      toast.error(error.response?.data?.message || error.message || 'ไม่สามารถโหลดข้อมูลสินค้าได้')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setShowEditModal(true)
  }

  const handleDelete = (product) => {
    setSelectedProduct(product)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedProduct) return
    
    try {
      await productsService.delete(selectedProduct.id)
      toast.success('ลบสินค้าสำเร็จ')
      setShowDeleteModal(false)
      setSelectedProduct(null)
      loadProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error(error.response?.data?.message || error.message || 'ไม่สามารถลบสินค้าได้')
      setShowDeleteModal(false)
      setSelectedProduct(null)
    }
  }

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === 'Active' ? 'Inactive' : 'Active'
      await productsService.update(product.id, { status: newStatus })
      toast.success(`เปลี่ยนสถานะเป็น ${newStatus === 'Active' ? 'ใช้งาน' : 'ไม่ใช้งาน'} สำเร็จ`)
      loadProducts()
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error(error.response?.data?.message || error.message || 'ไม่สามารถอัปเดตสถานะได้')
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader 
        title="Products"
        subtitle="Manage your product inventory"
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-900 text-white text-sm px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all font-medium"
          >
            + Add Product
          </button>
        }
      />

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
              onEdit={handleEdit}
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

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedProduct(null)
        }}
        onSuccess={() => {
          setShowEditModal(false)
          setSelectedProduct(null)
          loadProducts()
        }}
        productId={selectedProduct?.id}
      />

      {/* Delete Product Modal */}
      <DeleteProductModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedProduct(null)
        }}
        onConfirm={confirmDelete}
        product={selectedProduct}
      />
    </div>
  )
}
