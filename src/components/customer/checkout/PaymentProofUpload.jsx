import { useState } from 'react';
import { X, ImageIcon, CheckCircle2 } from 'lucide-react';

export default function PaymentProofUpload({ selectedFile, previewUrl, onFileSelect, onFileRemove }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-2 text-gray-900">Payment Proof</h2>
      <p className="text-sm text-gray-500 mb-6">
        (Optional) คุณสามารถอัปโหลดหลักฐานการชำระเงินได้ในภายหลัง
      </p>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Upload Payment Slip
        </label>
        
        <div className="relative">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-gray-400 transition-all bg-gray-50 hover:bg-gray-100">
            {previewUrl ? (
              <div className="relative w-full h-full p-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-xl"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onFileRemove();
                  }}
                  className="absolute top-6 right-6 p-2.5 bg-black/80 backdrop-blur text-white rounded-full hover:bg-black transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                  <ImageIcon className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Drop your payment slip here
                </p>
                <p className="text-xs text-gray-500">
                  or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={onFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {selectedFile && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-900 truncate">{selectedFile.name}</p>
              <p className="text-xs text-green-700 mt-0.5">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
