import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  ArrowLeft,
  AlertCircle,
  Loader,
  MapPin,
  Phone,
  Mail,
  FileText,
  Image as ImageIcon,
  Globe,
  Facebook,
  Plus,
  X
} from 'lucide-react';
import { decoratorsFloristsAPI } from '../config/api';
import SuccessModal from '../components/common/SuccessModal';

const EditDecoratorsFloristsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});
  const [profileData, setProfileData] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    category: '',
    description: '',
    experience: '',
    includes: [],
    province: '',
    city: '',
    contact: '',
    email: '',
    available: true,
    website: '',
    facebook: ''
  });

  // Include input state
  const [includeInput, setIncludeInput] = useState('');

  // Image state
  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch provinces and profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [provincesRes, profileRes] = await Promise.all([
          decoratorsFloristsAPI.getProvinces(),
          decoratorsFloristsAPI.getFloristProfile(id)
        ]);

        if (provincesRes.data) {
          setProvincesData(provincesRes.data);
        }

        if (profileRes.data && profileRes.data.data) {
          const profile = profileRes.data.data;
          setProfileData(profile);
          setFormData({
            name: profile.name || '',
            specialization: profile.specialization || '',
            category: profile.category || '',
            description: profile.description || '',
            experience: profile.experience || '',
            includes: profile.includes || [],
            province: profile.province || '',
            city: profile.city || '',
            contact: profile.contact || '',
            email: profile.email || '',
            available: profile.available !== undefined ? profile.available : true,
            website: profile.website || '',
            facebook: profile.facebook || ''
          });
          if (profile.images && profile.images.length > 0) {
            setImages(profile.images);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add include
  const addInclude = () => {
    if (includeInput.trim() && formData.includes.length < 10) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, includeInput.trim()]
      }));
      setIncludeInput('');
    }
  };

  // Remove include
  const removeInclude = (index) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  // Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formDataCloud = new FormData();
    formDataCloud.append('file', file);
    formDataCloud.append('upload_preset', 'ml_default');
    formDataCloud.append('cloud_name', 'daa9e83as');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/daa9e83as/image/upload', {
        method: 'POST',
        body: formDataCloud
      });
      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id
      };
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw err;
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 4 - images.length;

    if (files.length > remainingSlots) {
      setError(`You can only upload ${remainingSlots} more image(s)`);
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      const uploadedImages = await Promise.all(
        files.map(file => uploadToCloudinary(file))
      );

      setImages(prev => [...prev, ...uploadedImages]);
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name || !formData.specialization || !formData.category || 
        !formData.description || formData.experience === '' || formData.includes.length === 0 ||
        !formData.province || !formData.city || !formData.contact || !formData.email) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.experience < 0 || formData.experience > 70) {
      setError('Experience must be between 0 and 70 years');
      return false;
    }

    if (images.length === 0) {
      setError('Please upload at least one image');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const response = await decoratorsFloristsAPI.updateProfile(id, {
        ...formData,
        images
      });

      if (response.data && response.data.success) {
        setShowSuccessModal(true);
      } else {
        setError(response.data?.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/profile', { state: { activeSection: 'advertisements' } });
  };

  // Get available cities based on selected province
  const availableCities = formData.province ? provincesData[formData.province] || [] : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Update your decorator/florist profile information</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <SuccessModal
            title="Profile Updated!"
            message="Your profile has been updated successfully."
            onClose={handleSuccessClose}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <ImageIcon className="w-5 h-5" />
              <span>Portfolio Images (Max 4)</span>
            </h2>

            <div className="space-y-4">
              {/* Upload Area */}
              {images.length < 4 && (
                <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    {uploadingImage ? (
                      <>
                        <Loader className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                        <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-600 dark:text-gray-400">Click to upload images</span>
                        <span className="text-sm text-gray-500 dark:text-gray-500 mt-1">Max 5MB per image</span>
                      </>
                    )}
                  </div>
                </label>
              )}

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">{images.length}/4 images uploaded</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Personal Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialization *
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Floral Arrangements, Wedding Decorations"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Florist, Decorator, Event Decorator"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  max="70"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currently Available *
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Yes, I'm available</span>
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Description</span>
            </h2>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe your services, experience, and what makes you unique..."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{formData.description.length}/3000 characters</p>
          </div>

          {/* Services/Items Included */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Services/Items Included *
            </h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={includeInput}
                  onChange={(e) => setIncludeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Wedding bouquets, Event centerpieces"
                />
                <button
                  type="button"
                  onClick={addInclude}
                  disabled={formData.includes.length >= 10}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {formData.includes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.includes.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeInclude(index)}
                        className="hover:text-blue-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">{formData.includes.length}/10 items added</p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Location</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Province *
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Province</option>
                  {Object.keys(provincesData).map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!formData.province}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  <option value="">Select City</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="+94 71 234 5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://yourwebsite.com"
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Profile</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDecoratorsFloristsForm;

