import { X, AlertTriangle, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function DeleteProductModal({ isOpen, onClose, onConfirm, product }) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
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
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-slate-200/60 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-200/60 flex items-center justify-between bg-linear-to-b from-white to-slate-50/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shadow-sm">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Delete Product</h2>
                <p className="text-xs text-slate-600 mt-1 font-light">This action cannot be undone</p>
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
          <div className="px-8 py-6">
            <p className="text-sm text-slate-700 mb-6 font-light leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-800">{product?.name}</span>? 
              This will set the product status to <span className="font-medium text-red-600">Inactive</span>.
            </p>
            
            {product && (
              <div className="bg-slate-50/90 rounded-2xl p-5 mb-5 border border-slate-200/60">
                <div className="flex items-center gap-4">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-20 h-20 rounded-2xl object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 text-xs font-light">No Image</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
                    <p className="text-xs text-slate-600 mt-1 font-light">
                      {product.category?.name || 'No Category'} • ฿{product.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-amber-50/90 border border-amber-200/60 rounded-2xl p-4">
              <p className="text-xs text-amber-800 font-light leading-relaxed">
                <span className="font-semibold">Note:</span> The product will be marked as inactive and hidden from customers, but the data will be preserved.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-slate-200/60 flex gap-3 justify-end bg-linear-to-b from-slate-50/30 to-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm border border-slate-300/60 rounded-full hover:bg-slate-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="px-6 py-2.5 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  Delete Product
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
