import { Store, User } from 'lucide-react';
import AddressSelector from '../../common/AddressSelector';

export default function ShippingInformationForm({
  formData,
  hasSelectedLocation,
  selectedSalesLocation,
  onFormChange,
  onAddressChange,
  onUseProfileAddress
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
        {onUseProfileAddress && (
          <button
            type="button"
            onClick={onUseProfileAddress}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-all shadow-sm hover:shadow"
          >
            <User className="w-4 h-4" />
            <span>Use Profile Address</span>
          </button>
        )}
      </div>
      
      <div className="space-y-5">
        {/* Show selected location for In-Store Order */}
        {hasSelectedLocation && selectedSalesLocation && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
            <div className="flex items-start gap-3">
              <Store className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900 mb-1">ส่งจากสาขา</p>
                <p className="text-base font-semibold text-green-800">{selectedSalesLocation.name}</p>
                <p className="text-xs text-green-600 mt-1">
                  {selectedSalesLocation.locationType === 'STORE' ? 'ร้านค้า' : 
                   selectedSalesLocation.locationType === 'IOT_POINT' ? 'จุดติดตั้ง IoT' : 
                   'สาขา'}
                  {selectedSalesLocation.address && ` • ${selectedSalesLocation.address}`}
                  {selectedSalesLocation.province && ` • ${selectedSalesLocation.province}`}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Address - Required for both In-Store and Online Order */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Street Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={onFormChange}
            required
            rows={3}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 resize-none"
            placeholder="Enter your address"
          />
        </div>

        {/* Address Selector */}
        <div>
          <AddressSelector
            value={formData.addressData}
            onChange={onAddressChange}
            required={true}
            showLabels={true}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onFormChange}
            required
            placeholder="0812345678"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={onFormChange}
            rows={2}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 resize-none"
            placeholder="Add delivery instructions..."
          />
        </div>
      </div>
    </div>
  );
}
