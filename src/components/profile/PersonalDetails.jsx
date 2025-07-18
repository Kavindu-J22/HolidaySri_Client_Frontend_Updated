import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../config/api';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Save, 
  X, 
  Edit3,
  Upload,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const PersonalDetails = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    contactNumber: user?.contactNumber || '',
    countryCode: user?.countryCode || '+94'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'daa9e83as');

      // Upload to Cloudinary
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      // Update user profile with new image URL
      const updateResponse = await userAPI.updateProfile({
        profileImage: data.secure_url
      });

      if (updateResponse.data.user) {
        updateUser(updateResponse.data.user);
        setSuccess('Profile image updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await userAPI.updateProfile(formData);
      
      if (response.data.user) {
        updateUser(response.data.user);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      contactNumber: user?.contactNumber || '',
      countryCode: user?.countryCode || '+94'
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Personal Details
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal information and profile settings
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-green-700 dark:text-green-300">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Profile Image Section */}
        <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {uploadingImage ? (
                  <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">
                {user?.name}
              </h2>
              <p className="text-primary-100 mb-2 text-sm sm:text-base truncate">
                {user?.email}
              </p>
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-primary-100 text-sm sm:text-base">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{user?.countryCode} {user?.contactNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Account Information
            </h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors w-full sm:w-auto"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{user?.name}</span>
                </div>
              )}
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address (Read-only)
              </label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg min-w-0">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white truncate" title={user?.email}>{user?.email}</span>
              </div>
            </div>

            {/* Country Code Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country Code
              </label>
              {isEditing ? (
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="+94">+94 (Sri Lanka)</option>
                  <option value="+1">+1 (USA/Canada)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+91">+91 (India)</option>
                  <option value="+61">+61 (Australia)</option>
                </select>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{user?.countryCode}</span>
                </div>
              )}
            </div>

            {/* Contact Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your contact number"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{user?.contactNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
              Profile Image Guidelines
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Supported formats: JPG, PNG, GIF</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Recommended dimensions: 400x400 pixels</li>
              <li>• Images are automatically optimized and resized</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
