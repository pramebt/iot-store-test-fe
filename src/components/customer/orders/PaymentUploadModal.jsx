import { useState } from 'react';
import { X, Upload, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';

export default function PaymentUploadModal({ order, onClose, onUploadSuccess }) {
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'url'
  const [paymentSlipUrl, setPaymentSlipUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl;

      if (uploadMethod === 'file') {
        if (!selectedFile) {
          setError('Please select a file');
          setLoading(false);
          return;
        }

        // Convert file to base64 and send directly to backend
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
          try {
            // Send base64 image directly to backend
            await onUploadSuccess(reader.result);
            onClose();
          } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to upload payment slip');
          } finally {
            setLoading(false);
          }
        };
        reader.onerror = () => {
          setError('Failed to read file');
          setLoading(false);
        };
        return; // Exit early since FileReader is async
      } else {
        // URL method
        if (!paymentSlipUrl.trim()) {
          setError('Please enter payment slip URL');
          setLoading(false);
          return;
        }

        // Validate URL format
        try {
          new URL(paymentSlipUrl);
        } catch {
          setError('Please enter a valid URL');
          setLoading(false);
          return;
        }

        imageUrl = paymentSlipUrl;
      }

      await onUploadSuccess(imageUrl);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload payment slip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-200/60 flex items-center justify-between bg-linear-to-b from-white to-slate-50/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shadow-sm">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Upload Payment Slip</h2>
                <p className="text-sm text-slate-600 mt-1 font-light">Order #{order.id.slice(0, 8)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-2 rounded-full hover:bg-slate-100/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Summary */}
          <div className="px-8 py-6 bg-slate-50/80 border-b border-slate-200/60">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-slate-600 font-light">Total Amount</span>
              <span className="text-2xl font-semibold text-slate-800 tracking-tight">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-light">Items</span>
              <span className="text-slate-800 font-medium">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/60 text-red-700 px-5 py-3.5 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Upload Method Toggle */}
          <div className="flex gap-2 p-1 bg-slate-100/80 rounded-2xl">
            <button
              type="button"
              onClick={() => setUploadMethod('file')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                uploadMethod === 'file'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Upload File
              </div>
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('url')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                uploadMethod === 'url'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Enter URL
              </div>
            </button>
          </div>

          {/* File Upload */}
          {uploadMethod === 'file' && (
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Select Payment Slip Image <span className="text-red-500">*</span>
              </label>
              
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300/60 rounded-2xl cursor-pointer hover:bg-slate-50/50 transition-all duration-200">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-2xl"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-12 h-12 text-slate-400 mb-3" />
                      <p className="mb-2 text-sm text-slate-600 font-medium">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 font-light">PNG, JPG, JPEG (MAX. 5MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* URL Input */}
          {uploadMethod === 'url' && (
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Payment Slip URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={paymentSlipUrl}
                onChange={(e) => setPaymentSlipUrl(e.target.value)}
                placeholder="https://example.com/payment-slip.jpg"
                required={uploadMethod === 'url'}
                className="w-full px-5 py-3 bg-white border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-800 font-light transition-all duration-200"
              />
              <p className="text-xs text-slate-500 mt-2 font-light">
                Upload your payment slip to a service like Imgur, ImgBB, or Google Drive and paste the URL here
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-2xl p-5">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-2">Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800 font-light">
                  <li>Take a clear photo of your payment slip</li>
                  <li>Make sure all details are visible</li>
                  <li>Supported formats: JPG, PNG, JPEG</li>
                  <li>Maximum file size: 5MB</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200/60">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-slate-700 bg-slate-100/90 rounded-full hover:bg-slate-200/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (uploadMethod === 'file' && !selectedFile) || (uploadMethod === 'url' && !paymentSlipUrl)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
