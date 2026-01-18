import { X, FolderTree } from 'lucide-react'

export default function CategoryModal({ 
  isOpen, 
  category, 
  formData, 
  onFormChange, 
  onSubmit, 
  onClose 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-slate-200/60 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-200/60 flex items-center justify-between bg-linear-to-b from-white to-slate-50/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-sm">
                <FolderTree className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                  {category ? 'Edit Category' : 'New Category'}
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-light">
                  {category ? 'Update category information' : 'Create a new category'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-2 rounded-full hover:bg-slate-100/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={onSubmit} className="px-8 py-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3 bg-white border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-800 font-light transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-5 py-3 bg-white border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-800 font-light transition-all duration-200 resize-none"
              />
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-4 border-t border-slate-200/60">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2.5 text-sm border border-slate-300/60 rounded-full hover:bg-slate-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2.5 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {category ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
