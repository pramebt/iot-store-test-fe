import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth.service';
import ProfileForm from '../../components/customer/profile/ProfileForm';
import { thailandAddress } from '../../utils/thailandAddress';
import { Save, Loader2 } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import toast from '../../utils/toast';

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
      toast.error(err.response?.data?.message || err.message || 'Failed to load profile');
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
  };

  const handleAddressChange = (addressData) => {
    setFormData(prev => ({
      ...prev,
      addressData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50/40 via-white to-slate-50/30">
        <PageContainer maxWidth="2xl">
          <div className="text-center py-32">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
            <div className="text-slate-600 font-light">กำลังโหลดข้อมูลโปรไฟล์...</div>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <PageContainer maxWidth="2xl">
      <PageHeader 
        title="Profile Settings"
        subtitle="Manage your account information"
        showBackButton={true}
      />

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
          <ProfileForm
            formData={formData}
            onChange={handleChange}
            onAddressChange={handleAddressChange}
          />

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
    </PageContainer>
  );
}
