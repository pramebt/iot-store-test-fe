import { Upload, X } from 'lucide-react';

// Product Form Fields
export function ProductFormFields({ formData, errors, categories, onChange }) {
  return (
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
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
          onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Product Image Upload
export function ProductImageUpload({ imagePreview, imageFile, errors, onImageChange, onRemoveImage }) {
  return (
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
            onChange={onImageChange}
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
            onClick={onRemoveImage}
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
  );
}
