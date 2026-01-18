import { X, AlertTriangle, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function DeleteCategoryModal({ isOpen, onClose, onConfirm, category }) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      // Error handling is done in parent component
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
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">ลบหมวดหมู่</h2>
                <p className="text-xs text-slate-600 mt-1 font-light">การกระทำนี้ไม่สามารถยกเลิกได้</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-2 rounded-full hover:bg-slate-100/50 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            <p className="text-sm text-slate-700 mb-6 font-light leading-relaxed">
              คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้? การลบหมวดหมู่จะไม่สามารถกู้คืนได้
            </p>
            
            {category && (
              <div className="bg-slate-50/90 rounded-2xl p-5 mb-5 border border-slate-200/60">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center shadow-sm">
                    <span className="text-2xl font-semibold text-blue-600">
                      {category.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{category.name}</p>
                    {category.description && (
                      <p className="text-xs text-slate-600 mt-1 font-light line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xs text-slate-500">
                        สถานะ: <span className={`font-medium ${category.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}>
                          {category.status === 'Active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                        </span>
                      </p>
                      {category._count?.products !== undefined && (
                        <p className="text-xs text-slate-500">
                          • สินค้า: <span className={`font-medium ${category._count.products > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {category._count.products} รายการ
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {category?._count?.products > 0 ? (
              <div className="bg-red-50/90 border border-red-200/60 rounded-2xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800 mb-1">ไม่สามารถลบหมวดหมู่นี้ได้</p>
                    <p className="text-xs text-red-700 font-light leading-relaxed">
                      มีสินค้า <span className="font-semibold">{category._count.products} รายการ</span> ที่ใช้หมวดหมู่นี้อยู่ 
                      กรุณาย้ายหรือลบสินค้าทั้งหมดก่อนลบหมวดหมู่
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/90 border border-amber-200/60 rounded-2xl p-4">
                <p className="text-xs text-amber-800 font-light leading-relaxed">
                  <span className="font-semibold">หมายเหตุ:</span> การลบหมวดหมู่จะเปลี่ยนสถานะเป็น "ไม่ใช้งาน" 
                  และจะไม่แสดงในรายการหมวดหมู่ที่ใช้งานอยู่
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-slate-200/60 flex gap-3 justify-end bg-linear-to-b from-slate-50/30 to-white">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 text-sm border border-slate-300/60 rounded-full hover:bg-slate-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading || (category?._count?.products > 0)}
              className="px-6 py-2.5 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังลบ...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  ลบหมวดหมู่
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
