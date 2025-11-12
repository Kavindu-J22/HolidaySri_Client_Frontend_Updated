import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { User, MapPin, Heart, Upload, Globe, Facebook, Languages, Save, ArrowLeft } from 'lucide-react';

// Sri Lankan provinces and districts mapping
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

// Available languages
const availableLanguages = ["Sinhala", "English", "Tamil", "Hindi", "Arabic", "Chinese", "Japanese", "Korean"];

// Care Giver services
const careGiverServices = [
  "Elderly Care",
  "Dementia Care",
  "Mobility Assistance",
  "Medication Management",
  "Personal Care",
  "Companionship",
  "Meal Preparation",
  "Light Housekeeping",
  "Transportation",
  "Respite Care"
];

// Care Needer special needs
const specialNeedsOptions = [
  "Mobility Support",
  "Memory Care",
  "Medical Monitoring",
  "24/7 Care",
  "Specialized Diet",
  "Physical Therapy",
  "Emotional Support",
  "Language Assistance"
];

const EditCaregiversTimeCurrency = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    contact: '',
    description: '',
    province: '',
    city: '',
    type: '',
    // Care Giver fields
    experience: '',
    services: [],
    // Care Needer fields
    reason: '',
    specialNeeds: [],
    // Common fields
    available: true,
    occupied: false,
    facebook: '',
    website: '',
    speakingLanguages: [],
    HSTC: 0
  });

  const [avatar, setAvatar] = useState({
    url: '',
    publicId: ''
  });

  const [cities, setCities] = useState([]);

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to continue');
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/caregivers-time-currency/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          const profile = response.data.data;
          
          setFormData({
            name: profile.name || '',
            gender: profile.gender || '',
            age: profile.age || '',
            contact: profile.contact || '',
            description: profile.description || '',
            province: profile.province || '',
            city: profile.city || '',
            type: profile.type || '',
            experience: profile.careGiverDetails?.experience || '',
            services: profile.careGiverDetails?.services || [],
            reason: profile.careNeederDetails?.reason || '',
            specialNeeds: profile.careNeederDetails?.specialNeeds || [],
            available: profile.available !== undefined ? profile.available : true,
            occupied: profile.occupied !== undefined ? profile.occupied : false,
            facebook: profile.facebook || '',
            website: profile.website || '',
            speakingLanguages: profile.speakingLanguages || [],
            HSTC: profile.HSTC || 0
          });

          setAvatar({
            url: profile.avatar?.url || '',
            publicId: profile.avatar?.publicId || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        setFetchingData(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  useEffect(() => {
    if (formData.province) {
      setCities(provincesAndDistricts[formData.province] || []);
    }
  }, [formData.province]);

  // Upload avatar to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');
    formDataUpload.append('cloud_name', 'daa9e83as');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
        {
          method: 'POST',
          body: formDataUpload
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        return {
          url: data.secure_url,
          publicId: data.public_id
        };
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const uploadedAvatar = await uploadToCloudinary(file);
      setAvatar(uploadedAvatar);
      setError('');
    } catch (err) {
      setError('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle language toggle
  const toggleLanguage = (language) => {
    setFormData(prev => ({
      ...prev,
      speakingLanguages: prev.speakingLanguages.includes(language)
        ? prev.speakingLanguages.filter(l => l !== language)
        : [...prev.speakingLanguages, language]
    }));
  };

  // Handle service toggle (Care Giver)
  const toggleService = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  // Handle special needs toggle (Care Needer)
  const toggleSpecialNeed = (need) => {
    setFormData(prev => ({
      ...prev,
      specialNeeds: prev.specialNeeds.includes(need)
        ? prev.specialNeeds.filter(n => n !== need)
        : [...prev.specialNeeds, need]
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to continue');
        navigate('/login');
        return;
      }

      // Validation
      if (!formData.name || !formData.gender || !formData.age || !formData.contact || 
          !formData.description || !formData.city || !formData.province || 
          !avatar.url || formData.speakingLanguages.length === 0 || !formData.type) {
        setError('Please fill in all required fields');
        return;
      }

      if (formData.age < 18 || formData.age > 100) {
        setError('Age must be between 18 and 100');
        return;
      }

      if (formData.type === 'Care Giver') {
        if (formData.experience === '' || formData.services.length === 0) {
          setError('Please provide experience and select at least one service');
          return;
        }
        if (formData.experience < 0 || formData.experience > 70) {
          setError('Experience must be between 0 and 70 years');
          return;
        }
      } else if (formData.type === 'Care Needer') {
        if (!formData.reason || formData.reason.trim() === '') {
          setError('Please provide a reason for needing care');
          return;
        }
      }

      const payload = {
        name: formData.name,
        gender: formData.gender,
        age: parseInt(formData.age),
        description: formData.description,
        city: formData.city,
        province: formData.province,
        contact: formData.contact,
        available: formData.available,
        occupied: formData.occupied,
        facebook: formData.facebook,
        website: formData.website,
        avatar,
        speakingLanguages: formData.speakingLanguages,
        type: formData.type
      };

      // Add type-specific fields
      if (formData.type === 'Care Giver') {
        payload.experience = parseInt(formData.experience);
        payload.services = formData.services;
      } else if (formData.type === 'Care Needer') {
        payload.reason = formData.reason;
        payload.specialNeeds = formData.specialNeeds;
      }

      const response = await axios.put(
        `http://localhost:5000/api/caregivers-time-currency/${id}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        navigate('/profile', { state: { activeSection: 'advertisements' } });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to My Advertisements
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Edit Caregivers Time Currency Profile
          </h1>
          <p className="text-gray-600">
            Update your {formData.type} profile information
          </p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Your HSTC value ({formData.HSTC}h) cannot be changed.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b pb-3">
              <User className="mr-2" /> Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b pb-3">
              <MapPin className="mr-2" /> Location Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Province *
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Province</option>
                  {Object.keys(provincesAndDistricts).map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!formData.province}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Type Selection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b pb-3">
              <Heart className="mr-2" /> Type Selection
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => setFormData(prev => ({ ...prev, type: 'Care Giver' }))}
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.type === 'Care Giver'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">👨‍⚕️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Care Giver</h3>
                  <p className="text-gray-600 text-sm">
                    I provide care services to those in need
                  </p>
                </div>
              </div>

              <div
                onClick={() => setFormData(prev => ({ ...prev, type: 'Care Needer' }))}
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.type === 'Care Needer'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Care Needer</h3>
                  <p className="text-gray-600 text-sm">
                    I need care services and support
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Type-Specific Details */}
          {formData.type && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                {formData.type === 'Care Giver' ? 'Care Giver Details' : 'Care Needer Details'}
              </h2>

              {formData.type === 'Care Giver' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      min="0"
                      max="70"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Services Provided * (Select at least one)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {careGiverServices.map((service) => (
                        <div
                          key={service}
                          onClick={() => toggleService(service)}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.services.includes(service)
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.services.includes(service)}
                              onChange={() => {}}
                              className="mr-2"
                            />
                            <span className="text-sm font-medium">{service}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {formData.type === 'Care Needer' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reason for Needing Care *
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Special Needs (Optional)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {specialNeedsOptions.map((need) => (
                        <div
                          key={need}
                          onClick={() => toggleSpecialNeed(need)}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.specialNeeds.includes(need)
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-300 hover:border-purple-400'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.specialNeeds.includes(need)}
                              onChange={() => {}}
                              className="mr-2"
                            />
                            <span className="text-sm font-medium">{need}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Additional Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
              Additional Information
            </h2>

            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Avatar Image *
              </label>
              <div className="flex items-center space-x-4">
                {avatar.url && (
                  <img
                    src={avatar.url}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                  />
                )}
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                      <Upload className="mr-2" size={20} />
                      <span className="text-sm font-medium">
                        {uploadingAvatar ? 'Uploading...' : avatar.url ? 'Change Avatar' : 'Upload Avatar'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploadingAvatar}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Speaking Languages */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Speaking Languages * (Select at least one)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableLanguages.map((language) => (
                  <div
                    key={language}
                    onClick={() => toggleLanguage(language)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.speakingLanguages.includes(language)
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <Languages className="mr-2" size={16} />
                      <span className="text-sm font-medium">{language}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">
                  Currently Available
                </label>
              </div>

              <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg">
                <input
                  type="checkbox"
                  name="occupied"
                  checked={formData.occupied}
                  onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">
                  Currently Occupied
                </label>
              </div>
            </div>

            {/* Optional Social Links */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Facebook Profile (Optional)
              </label>
              <div className="flex items-center">
                <Facebook className="mr-2 text-blue-600" size={20} />
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://facebook.com/yourprofile"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website (Optional)
              </label>
              <div className="flex items-center">
                <Globe className="mr-2 text-gray-600" size={20} />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2" size={20} />
                  Update Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCaregiversTimeCurrency;


