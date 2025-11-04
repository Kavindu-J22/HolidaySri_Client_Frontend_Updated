import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, CheckCircle, Loader, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EditEmergencyServicesInsuranceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  // Provinces and districts mapping
  const provincesAndDistricts = {
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Northern Province": ["Jaffna", "Mannar", "Vavuniya", "Kilinochchi", "Mullaitivu"],
    "Eastern Province": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Sabaragamuwa Province": ["Kegalle", "Ratnapura"]
  };

  // Insurance categories
  const insuranceCategories = [
    'Comprehensive Travel Insurance',
    'Medical Insurance',
    'Trip Cancellation Insurance',
    'Baggage Insurance',
    'Emergency Medical Evacuation',
    'Adventure Sports Coverage',
    'Personal Accident Insurance',
    'Emergency Response Services',
    'Travel Assistance Services',
    'Other'
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    contact: '',
    province: '',
    city: '',
    website: '',
    facebook: '',
    description: '',
    includes: '',
    specialOffers: ''
  });

  // Logo state
  const [logo, setLogo] = useState({
    url: '',
    publicId: '',
    uploading: false
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/emergency-services-insurance/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          const profile = data.data;
          setFormData({
            name: profile.name || '',
            category: profile.category || '',
            contact: profile.contact || '',
            province: profile.province || '',
            city: profile.city || '',
            website: profile.website || '',
            facebook: profile.facebook || '',
            description: profile.description || '',
            includes: profile.includes || '',
            specialOffers: profile.specialOffers || ''
          });

          if (profile.logo) {
            setLogo({
              url: profile.logo.url || '',
              publicId: profile.logo.publicId || '',
              uploading: false
            });
          }
        } else {
          setError('Failed to load profile data');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setFetchingData(false);
      }
    };

    fetchProfile();
  }, [id]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset city when province changes
    if (name === 'province') {
      setFormData(prev => ({
        ...prev,
        city: ''
      }));
    }
  };

  // Upload logo to Cloudinary
  const uploadLogo = async (file) => {
    try {
      setLogo(prev => ({ ...prev, uploading: true }));

      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', 'ml_default');
      formDataUpload.append('cloud_name', 'daa9e83as');

      const response = await fetch('https://api.cloudinary.com/v1_1/daa9e83as/image/upload', {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();

      if (data.secure_url) {
        setLogo({
          url: data.secure_url,
          publicId: data.public_id,
          uploading: false
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo. Please try again.');
      setLogo(prev => ({ ...prev, uploading: false }));
    }
  };

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo size should not exceed 5MB');
        return;
      }

      uploadLogo(file);
    }
  };

  // Remove logo
  const removeLogo = () => {
    setLogo({
      url: '',
      publicId: '',
      uploading: false
    });
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Company/Service name is required');
      return false;
    }

    if (!formData.category) {
      setError('Please select an insurance category');
      return false;
    }

    if (!formData.contact.trim()) {
      setError('Contact number is required');
      return false;
    }

    if (!formData.province) {
      setError('Please select a province');
      return false;
    }

    if (!formData.city) {
      setError('Please select a city');
      return false;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }

    if (formData.description.length > 3000) {
      setError('Description should not exceed 3000 characters');
      return false;
    }

    if (!formData.includes.trim()) {
      setError('Coverage details are required');
      return false;
    }

    if (!logo.url) {
      setError('Please upload a company logo');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/emergency-services-insurance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          logo: {
            url: logo.url,
            publicId: logo.publicId
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/profile', { state: { activeSection: 'advertisements' } });
        }, 2000);
      } else {
        setError(data.message || 'Failed to update. Please try again.');
      }
    } catch (err) {
      console.error('Error updating:', err);
      setError('Failed to update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to My Advertisements
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Edit Emergency Services & Insurance
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Update your emergency services and insurance information
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Company/Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company/Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., SafeTravel Insurance Ltd."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              maxLength={200}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Insurance Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            >
              <option value="">Select Category</option>
              {insuranceCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="Any format, any country"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Province and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Province <span className="text-red-500">*</span>
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                <option value="">Select Province</option>
                {Object.keys(provincesAndDistricts).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!formData.province}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select City</option>
                {formData.province && provincesAndDistricts[formData.province]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Website and Facebook */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website (Optional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Facebook (Optional)
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              placeholder="Describe your services, coverage areas, and what makes your insurance/emergency services unique..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
              maxLength={3000}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formData.description.length}/3000 characters
            </p>
          </div>

          {/* Coverage Includes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Coverage Includes <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="includes"
              value={formData.includes}
              onChange={handleInputChange}
              placeholder="e.g., Medical, Trip Cancellation, Baggage, Emergency Evacuation"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Separate items with commas
            </p>
          </div>

          {/* Special Offers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Special Offers (Optional)
            </label>
            <textarea
              name="specialOffers"
              value={formData.specialOffers}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any special discounts, promotions, or offers..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
              maxLength={500}
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Logo <span className="text-red-500">*</span>
            </label>
            
            {!logo.url ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-red-500 dark:hover:border-red-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                  disabled={logo.uploading}
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {logo.uploading ? (
                    <>
                      <Loader className="w-12 h-12 text-red-500 animate-spin mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        Click to upload logo
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        PNG, JPG up to 5MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={logo.url}
                  alt="Logo"
                  className="w-48 h-48 object-contain rounded-lg border-2 border-gray-200 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || logo.uploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Profile</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-in">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Successfully Updated!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your profile has been updated successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEmergencyServicesInsuranceForm;

