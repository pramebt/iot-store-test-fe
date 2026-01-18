import { useState, useEffect } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { productsService } from '../../../services/products.service'
import { categoriesService } from '../../../services/categories.service'

export default function AddProductModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    basePrice: '',
    price: '',
    stock: '',
    categoryId: '',
    status: 'Active'
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      loadCategories()
      // Reset form when modal opens
      setFormData({
        name: '',
        description: '',
        cost: '',
        basePrice: '',
        price: '',
        stock: '',
        categoryId: '',
        status: 'Active'
      })
      setImagePreview(null)
      setImageFile(null)
      setErrors({})
    }
  }, [isOpen])

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll()
      // Backend returns array directly, not { categories: [] }
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load categories:', error)
      setCategories([])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select an image file' }))
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }))
        return
      }

      setImageFile(file)
      setErrors(prev => ({ ...prev, image: '' }))

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.cost && parseFloat(formData.cost) < 0) {
      newErrors.cost = 'Cost must be 0 or greater'
    }

    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = 'Base price must be greater than 0'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Selling price must be greater than 0'
    }

    // Sale price (price) can be lower than basePrice for discounts/promotions

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be 0 or greater'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      setLoading(true)

      const productData = {
        name: formData.name,
        description: formData.description,
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        basePrice: parseFloat(formData.basePrice),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId,
        status: formData.status
      }

      const result = await productsService.create(productData)

      // Upload image if selected
      if (imageFile && result.id) {
        // Convert image to base64
        const reader = new FileReader()
        reader.readAsDataURL(imageFile)
        await new Promise((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              await productsService.uploadImage(result.id, { image: reader.result })
              resolve()
            } catch (uploadErr) {
              reject(uploadErr)
            }
          }
          reader.onerror = reject
        })
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to create product:', error)
      setErrors({ submit: error.response?.data?.message || 'Failed to create product' })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-200/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-linear-to-b from-white to-slate-50/30 border-b border-slate-200/60 px-8 py-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Add New Product</h2>
              <p className="text-sm text-slate-600 mt-1 font-light">Create a new product in your store</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-2 rounded-full hover:bg-slate-100/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1.5">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter product description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Cost */}
                <div>
                  <label htmlFor="cost" className="block text-sm font-medium text-gray-900 mb-1.5">
                    Cost (฿) <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                      errors.cost ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.cost && (
                    <p className="mt-1 text-xs text-red-600">{errors.cost}</p>
                  )}
                </div>

                {/* Base Price and Selling Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="basePrice" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Base Price (฿) *
                    </label>
                    <input
                      type="number"
                      id="basePrice"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                        errors.basePrice ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="0.00"
                    />
                    {errors.basePrice && (
                      <p className="mt-1 text-xs text-red-600">{errors.basePrice}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Selling Price (฿) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                        errors.price ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                    )}
                  </div>
                </div>

                {/* Stock, Category and Status */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Stock *
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                        errors.stock ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="0"
                    />
                    {errors.stock && (
                      <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Category *
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                        errors.categoryId ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    Product Image
                  </label>
                  
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label htmlFor="image" className="cursor-pointer">
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {errors.image && (
                    <p className="mt-1 text-xs text-red-600">{errors.image}</p>
                  )}
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-linear-to-b from-slate-50/30 to-white border-t border-slate-200/60 px-8 py-6 flex gap-3 justify-end z-10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm border border-slate-300/60 rounded-full hover:bg-slate-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-sm bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
