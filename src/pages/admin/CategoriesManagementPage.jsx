import { useEffect, useState } from 'react'
import { categoriesService } from '../../services/categories.service'
import CategoriesGrid from '../../components/admin/categories/CategoriesGrid'
import CategoryModal from '../../components/admin/categories/CategoryModal'
import AddCategoryModal from '../../components/admin/categories/AddCategoryModal'
import DeleteCategoryModal from '../../components/admin/categories/DeleteCategoryModal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import PageHeader from '../../components/common/PageHeader'
import toast from '../../utils/toast'

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoriesService.getAll()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load categories:', error)
      toast.error(error.response?.data?.message || error.message || 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await categoriesService.update(editingCategory.id, formData)
        toast.success('อัปเดตหมวดหมู่สำเร็จ')
      } else {
        await categoriesService.create(formData)
        toast.success('สร้างหมวดหมู่สำเร็จ')
      }
      setShowModal(false)
      setEditingCategory(null)
      setFormData({ name: '', description: '' })
      loadCategories()
    } catch (error) {
      console.error('Failed to save category:', error)
      toast.error(error.response?.data?.message || error.message || 'ไม่สามารถบันทึกหมวดหมู่ได้')
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || ''
    })
    setShowModal(true)
  }

  const handleDelete = (category) => {
    setDeletingCategory(category)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deletingCategory) return
    
    try {
      await categoriesService.delete(deletingCategory.id)
      toast.success('ลบหมวดหมู่สำเร็จ')
      setShowDeleteModal(false)
      setDeletingCategory(null)
      loadCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error(error.response?.data?.message || error.message || 'ไม่สามารถลบหมวดหมู่ได้ อาจมีสินค้าที่ใช้หมวดหมู่นี้อยู่')
      setShowDeleteModal(false)
      setDeletingCategory(null)
    }
  }

  const handleToggleStatus = async (category) => {
    try {
      const newStatus = category.status === 'Active' ? 'Inactive' : 'Active'
      await categoriesService.update(category.id, { status: newStatus })
      toast.success(`เปลี่ยนสถานะเป็น ${newStatus === 'Active' ? 'ใช้งาน' : 'ไม่ใช้งาน'} สำเร็จ`)
      loadCategories()
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error(error.response?.data?.message || error.message || 'ไม่สามารถอัปเดตสถานะได้')
    }
  }

  const openNewModal = () => {
    setShowAddModal(true)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader 
        title="Categories"
        subtitle="Organize your products into categories"
        actions={
          <button
            onClick={openNewModal}
            className="bg-gray-900 text-white text-sm px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all font-medium"
          >
            + Add Category
          </button>
        }
      />

      {/* Categories Grid */}
      {loading ? (
        <LoadingSpinner message="Loading categories..." />
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-xl text-slate-800 mb-2 font-medium">ไม่มีหมวดหมู่</div>
          <div className="text-slate-600 mb-8 font-light">เริ่มต้นด้วยการสร้างหมวดหมู่ใหม่</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <CategoriesGrid
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      )}

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadCategories}
      />

      {/* Edit Category Modal */}
      <CategoryModal
        isOpen={showModal}
        category={editingCategory}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        onClose={() => {
          setShowModal(false)
          setEditingCategory(null)
          setFormData({ name: '', description: '' })
        }}
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        isOpen={showDeleteModal}
        category={deletingCategory}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingCategory(null)
        }}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
