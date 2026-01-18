import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Image as ImageIcon, Loader2, CreditCard, Calendar, AlertTriangle } from 'lucide-react';
import { ordersService } from '../../../services/orders.service';

// Payment Upload Section
export function PaymentUploadSection({ order, onUploadSuccess }) {
  const [uploadMethod, setUploadMethod] = useState('file');
  const [paymentSlipUrl, setPaymentSlipUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('ไฟล์ขนาดเกิน 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setUploadError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      setSelectedFile(file);
      setUploadError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPayment = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadError('');

    try {
      let imageUrl;

      if (uploadMethod === 'file') {
        if (!selectedFile) {
          setUploadError('กรุณาเลือกไฟล์');
          setUploading(false);
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
          try {
            await ordersService.uploadPayment(order.id, reader.result);
            if (onUploadSuccess) onUploadSuccess();
            setSelectedFile(null);
            setPreviewUrl(null);
            setPaymentSlipUrl('');
            setUploadError('');
          } catch (err) {
            setUploadError(err.response?.data?.message || err.message || 'อัปโหลดสลิปไม่สำเร็จ');
          } finally {
            setUploading(false);
          }
        };
        reader.onerror = () => {
          setUploadError('อ่านไฟล์ไม่สำเร็จ');
          setUploading(false);
        };
        return;
      } else {
        if (!paymentSlipUrl.trim()) {
          setUploadError('กรุณากรอก URL ของสลิป');
          setUploading(false);
          return;
        }
        try {
          new URL(paymentSlipUrl);
        } catch {
          setUploadError('กรุณากรอก URL ที่ถูกต้อง');
          setUploading(false);
          return;
        }
        imageUrl = paymentSlipUrl;
      }

      await ordersService.uploadPayment(order.id, imageUrl);
      if (onUploadSuccess) onUploadSuccess();
      setSelectedFile(null);
      setPreviewUrl(null);
      setPaymentSlipUrl('');
      setUploadError('');
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'อัปโหลดสลิปไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  };

  if (order.status !== 'PENDING' || order.paymentImage) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-yellow-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-yellow-700" />
        <h2 className="text-lg font-semibold text-gray-900">อัปโหลดสลิปการชำระเงิน</h2>
      </div>
      
      <form onSubmit={handleUploadPayment} className="space-y-4">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setUploadMethod('file');
              setUploadError('');
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              uploadMethod === 'file'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            อัปโหลดไฟล์
          </button>
          <button
            type="button"
            onClick={() => {
              setUploadMethod('url');
              setUploadError('');
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              uploadMethod === 'url'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ใส่ URL
          </button>
        </div>

        {uploadMethod === 'file' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เลือกไฟล์สลิป <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (สูงสุด 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        )}

        {uploadMethod === 'url' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL ของสลิป <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={paymentSlipUrl}
              onChange={(e) => setPaymentSlipUrl(e.target.value)}
              placeholder="https://example.com/payment-slip.jpg"
              required={uploadMethod === 'url'}
              disabled={uploading}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-2">
              อัปโหลดสลิปไปยัง Imgur, ImgBB หรือ Google Drive แล้ววาง URL ที่นี่
            </p>
          </div>
        )}

        {uploadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">คำแนะนำ:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>ถ่ายรูปสลิปให้ชัดเจน</li>
                <li>ให้เห็นรายละเอียดทั้งหมด</li>
                <li>รองรับไฟล์: JPG, PNG, JPEG</li>
                <li>ขนาดไฟล์สูงสุด: 5MB</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading || (uploadMethod === 'file' && !selectedFile) || (uploadMethod === 'url' && !paymentSlipUrl)}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              กำลังอัปโหลด...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              อัปโหลดสลิป
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// Payment Verification Section
export function PaymentVerificationSection({ order, onApprove, onReject, updatingStatus }) {
  if (order.status !== 'PAID' || !order.paymentImage) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-blue-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-blue-700" />
        <h2 className="text-lg font-semibold text-gray-900">Payment Verification</h2>
        <span className="ml-auto px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          Awaiting Review
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Payment Slip Submitted</p>
          <div className="relative group">
            <img 
              src={order.paymentImage} 
              alt="Payment slip"
              className="w-full rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => window.open(order.paymentImage, '_blank')}
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/5 rounded-lg transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">Click to view full size</span>
            </div>
          </div>
        </div>

        {order.paymentAt && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Payment Date: {new Date(order.paymentAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onApprove}
            disabled={updatingStatus}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-5 h-5" />
            Approve Payment
          </button>
          <button
            onClick={onReject}
            disabled={updatingStatus}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle className="w-5 h-5" />
            Reject Payment
          </button>
        </div>
      </div>
    </div>
  );
}

// Approve Payment Modal
export function ApprovePaymentModal({ isOpen, onClose, onConfirm, order, updatingStatus }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !updatingStatus && onClose()}
      />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Approve Payment</h2>
                <p className="text-xs text-gray-600 mt-0.5">Confirm payment verification</p>
              </div>
            </div>
            {!updatingStatus && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="px-6 py-4">
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to approve this payment? The order status will be changed to <span className="font-semibold text-green-600">CONFIRMED</span>.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-600 mb-1">Order Number</p>
              <p className="text-sm font-semibold text-gray-900">{order?.orderNumber}</p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={updatingStatus}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={updatingStatus}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {updatingStatus ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Approve Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reject Payment Modal
export function RejectPaymentModal({ isOpen, onClose, onConfirm, order, updatingStatus }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !updatingStatus && onClose()}
      />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Reject Payment</h2>
                <p className="text-xs text-gray-600 mt-0.5">This will reset the order status</p>
              </div>
            </div>
            {!updatingStatus && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="px-6 py-4">
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to reject this payment? The order status will be changed back to <span className="font-semibold text-yellow-600">PENDING</span> and the customer will need to resubmit payment.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-600 mb-1">Order Number</p>
              <p className="text-sm font-semibold text-gray-900">{order?.orderNumber}</p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={updatingStatus}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={updatingStatus}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {updatingStatus ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Reject Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
