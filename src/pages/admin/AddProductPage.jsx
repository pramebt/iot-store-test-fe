import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react'
import { productsService } from '../../services/products.service'
import { categoriesService } from '../../services/categories.service'

export default function AddProductPage() {
  const navigate = useNavigate()
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
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select an image file' }))
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }))
        return
      }

      setImageFile(file)
      setErrors(prev => ({ ...prev, image: '' }))

      // Create preview
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

    if (formData.basePrice && formData.price && parseFloat(formData.price) < parseFloat(formData.basePrice)) {
      newErrors.price = 'Selling price must be greater than or equal to base price'
    }

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

      // Create product
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

      // Upload image if provided
      if (imageFile && result.product?.id) {
        const formDataImage = new FormData()
        formDataImage.append('image', imageFile)
        await productsService.uploadImage(result.product.id, formDataImage)
      }

      // Navigate back to products page
      navigate('/admin/products')
    } catch (error) {
      console.error('Failed to create product:', error)
      setErrors({ submit: error.response?.data?.message || 'Failed to create product' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Add New Product</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Create a new product in your store</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Cost (optional) */}
            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-900 mb-2">
                Cost (฿) <span className="text-gray-500 text-xs">(Optional - for profit calculation)</span>
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                  errors.cost ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="0.00"
              />
              {errors.cost && (
                <p className="mt-1 text-xs text-red-600">{errors.cost}</p>
              )}
            </div>

            {/* Base Price and Selling Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="basePrice" className="block text-sm font-medium text-gray-900 mb-2">
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
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                    errors.basePrice ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="0.00"
                />
                {errors.basePrice && (
                  <p className="mt-1 text-xs text-red-600">{errors.basePrice}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Minimum selling price</p>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-2">
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
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                    errors.price ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Actual selling price</p>
              </div>
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-900 mb-2">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                  errors.stock ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="0"
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
              )}
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-900 mb-2">
                  Category *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all ${
                    errors.categoryId ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select a category</option>
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
                <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Product Image
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer">
                    <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 sm:h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
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
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-gray-900 text-white text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
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
  )
}
