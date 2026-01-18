import { Package } from 'lucide-react'

export default function CategoriesGrid({ 
  categories, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) {
  if (categories.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-gray-500">
        No categories yet. Create your first category!
      </div>
    )
  }

  return (
    <>
      {categories.map((category) => (
        <div key={category.id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:shadow-md transition-all">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.description || 'No description'}</p>
              </div>
              <button
                onClick={() => onToggleStatus(category)}
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  category.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {category.status}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {category._count?.products || 0} products
              </span>
              <span className="text-xs">{new Date(category.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex space-x-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => onEdit(category)}
                className="flex-1 px-3 py-1.5 text-xs text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(category)}
                className="flex-1 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
