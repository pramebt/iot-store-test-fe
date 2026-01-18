import { X, Package } from 'lucide-react'

export default function OrderStatusModal({ 
  isOpen, 
  order, 
  newStatus, 
  onStatusChange, 
  onSubmit, 
  onClose 
}) {
  if (!isOpen || !order) return null

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
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shadow-sm">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Update Order Status</h2>
                <p className="text-xs text-slate-600 mt-1 font-light">Order: {order.orderNumber}</p>
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
            <div className="mb-6">
              <div className="bg-slate-50/90 rounded-2xl p-4 mb-5 border border-slate-200/60">
                <div className="text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600 font-light">Current Status</span>
                    <span className="text-slate-800 font-semibold">{order.status}</span>
                  </div>
                </div>
              </div>
              
              <label className="block text-sm font-semibold text-slate-800 mb-3">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full px-5 py-3 bg-white border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-800 font-light transition-all duration-200"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-slate-200/60 flex gap-3 justify-end bg-linear-to-b from-slate-50/30 to-white">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2.5 text-sm border border-slate-300/60 rounded-full hover:bg-slate-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 px-6 py-2.5 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
