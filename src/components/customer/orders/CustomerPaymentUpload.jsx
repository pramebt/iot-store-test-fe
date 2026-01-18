import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ordersService } from '../../../services/orders.service';

export default function CustomerPaymentUpload({ order, onUploadSuccess }) {
  const [uploadMethod, setUploadMethod] = useState('file');
  const [paymentSlipUrl, setPaymentSlipUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('กรุณาเลือกไฟล์รูปภาพ');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('ขนาดไฟล์ต้องไม่เกิน 5MB');
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

  if (order.status !== 'Pending' || order.paymentImage) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
        <Upload className="w-5 h-5" />
        อัปโหลดสลิปการชำระเงิน
      </h2>
      
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
