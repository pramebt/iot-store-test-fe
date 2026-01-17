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

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    // Using ImgBB API (you can replace with your own image hosting service)
    const response = await fetch('https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.data.url;
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Upload Payment Slip</h2>
              <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-2xl font-semibold text-gray-900">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Items</span>
            <span className="text-gray-900">{order.items?.length || 0} item(s)</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Upload Method Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setUploadMethod('file')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                uploadMethod === 'file'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
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
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                uploadMethod === 'url'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Payment Slip Image <span className="text-red-500">*</span>
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
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-600">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Slip URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={paymentSlipUrl}
                onChange={(e) => setPaymentSlipUrl(e.target.value)}
                placeholder="https://example.com/payment-slip.jpg"
                required={uploadMethod === 'url'}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-2">
                Upload your payment slip to a service like Imgur, ImgBB, or Google Drive and paste the URL here
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Take a clear photo of your payment slip</li>
                  <li>Make sure all details are visible</li>
                  <li>Supported formats: JPG, PNG, JPEG</li>
                  <li>Maximum file size: 5MB</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (uploadMethod === 'file' && !selectedFile) || (uploadMethod === 'url' && !paymentSlipUrl)}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
