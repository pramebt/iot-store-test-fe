import { useEffect, useState } from 'react'
import { categoriesService } from '../../services/categories.service'
import CategoriesGrid from '../../components/admin/categories/CategoriesGrid'
import CategoryModal from '../../components/admin/categories/CategoryModal'
import AddCategoryModal from '../../components/admin/categories/AddCategoryModal'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
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
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await categoriesService.update(editingCategory.id, formData)
      } else {
        await categoriesService.create(formData)
      }
      setShowModal(false)
      setEditingCategory(null)
      setFormData({ name: '', description: '' })
      loadCategories()
    } catch (error) {
      console.error('Failed to save category:', error)
      alert('Failed to save category')
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

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    
    try {
      await categoriesService.delete(id)
      loadCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Failed to delete category. It may have associated products.')
    }
  }

  const handleToggleStatus = async (category) => {
    try {
      const newStatus = category.status === 'Active' ? 'Inactive' : 'Active'
      await categoriesService.update(category.id, { status: newStatus })
      loadCategories()
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    }
  }

  const openNewModal = () => {
    setShowAddModal(true)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Categories</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Organize your products into categories</p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-gray-900 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full hover:bg-gray-800 transition-all whitespace-nowrap"
        >
          + Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <LoadingSpinner message="Loading categories..." />
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
    </div>
  )
}
