import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth.service';
import AddressSelector from '../../components/common/AddressSelector';
import { thailandAddress } from '../../utils/thailandAddress';
import { User, Mail, Phone, MapPin, Save, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    addressData: {
      provinceId: null,
      districtId: null,
      subDistrictId: null,
      zipCode: null,
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await authService.getCurrentUser();
      
      // Convert province/district names to IDs for AddressSelector
      let provinceId = null;
      let districtId = null;
      let subDistrictId = null;
      
      if (profileData.province) {
        // Find province by name
        const provinces = thailandAddress.getAllProvinces();
        const province = provinces.find(p => p.nameTh === profileData.province);
        if (province) {
          provinceId = province.id;
          
          // Find district by name
          if (profileData.district && provinceId) {
            const districts = thailandAddress.getDistrictsByProvince(provinceId);
            const district = districts.find(d => d.nameTh === profileData.district);
            if (district) {
              districtId = district.id;
              
              // Find sub-district by postal code
              if (profileData.postalCode && districtId) {
                const subDistricts = thailandAddress.getSubDistrictsByDistrict(districtId);
                const subDistrict = subDistricts.find(sd => sd.zipCode === profileData.postalCode);
                if (subDistrict) {
                  subDistrictId = subDistrict.id;
                }
              }
            }
          }
        }
      }
      
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        addressData: {
          provinceId,
          districtId,
          subDistrictId,
          zipCode: profileData.postalCode || null,
        },
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleAddressChange = (addressData) => {
    setFormData(prev => ({
      ...prev,
      addressData
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Convert address IDs to names for API
      let province = null;
      let district = null;
      let postalCode = formData.addressData.zipCode || null;

      if (formData.addressData.provinceId) {
        const provinceData = thailandAddress.getProvinceById(formData.addressData.provinceId);
        if (provinceData) {
          province = provinceData.name_th || provinceData.nameTh;
          
          if (formData.addressData.districtId) {
            const districtData = thailandAddress.getDistrictById(formData.addressData.districtId);
            if (districtData) {
              district = districtData.name_th || districtData.nameTh;
            }
          }
        }
      }

      const updateData = {
        name: formData.name,
        phone: formData.phone || null,
        address: formData.address || null,
        province: province,
        district: district,
        postalCode: postalCode,
      };

      const updatedUser = await authService.updateProfile(updateData);
      
      // Update auth store
      updateUser(updatedUser);
      
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your account information</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <span className="text-green-600">✓</span>
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 space-y-6">
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              rows={3}
              placeholder="Enter your street address"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 resize-none"
            />
          </div>

          {/* Address Selector */}
          <div>
            <AddressSelector
              value={formData.addressData}
              onChange={handleAddressChange}
              required={false}
              showLabels={true}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
