import { User, Mail, Phone, MapPin } from 'lucide-react';
import AddressSelector from '../../common/AddressSelector';

export default function ProfileForm({ formData, onChange, onAddressChange }) {
  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <User className="w-4 h-4" />
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          placeholder="John Doe"
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
        />
      </div>

      {/* Email (Readonly) */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Mail className="w-4 h-4" />
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
      </div>

      {/* Phone */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4" />
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="0812345678"
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
        />
      </div>

      {/* Address */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4" />
          Street Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={onChange}
          rows={3}
          placeholder="Enter your street address"
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 resize-none"
        />
      </div>

      {/* Address Selector */}
      <div>
        <AddressSelector
          value={formData.addressData}
          onChange={onAddressChange}
          required={false}
          showLabels={true}
        />
      </div>
    </div>
  );
}
