import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EditProfessionalLawyersProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [provincesData, setProvincesData] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    category: '',
    description: '',
    experience: '',
    city: '',
    province: '',
    contact: '',
    available: true,
    weekdays: [],
    weekends: [],
    times: [],
    facebook: '',
    website: ''
  });

  // Image state
  const [images, setImages] = useState({
    avatar: {
      url: '',
      publicId: '',
      uploading: false
    }
  });

  // Fetch provinces and lawyer data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provinces
        const provincesRes = await fetch('/api/professional-lawyers/provinces');
        const provincesData = await provincesRes.json();
        if (provincesData.success) {
          setProvincesData(provincesData.data);
        }

        // Fetch lawyer data
        const lawyerRes = await fetch(`/api/professional-lawyers/${id}`);
        const lawyerData = await lawyerRes.json();
        
        if (lawyerData.success) {
          const lawyer = lawyerData.data;
          setFormData({
            name: lawyer.name || '',
            specialization: lawyer.specialization || '',
            category: lawyer.category || '',
            description: lawyer.description || '',
            experience: lawyer.experience || '',
            city: lawyer.city || '',
            province: lawyer.province || '',
            contact: lawyer.contact || '',
            available: lawyer.available || true,
            weekdays: lawyer.weekdays || [],
            weekends: lawyer.weekends || [],
            times: lawyer.times || [],
            facebook: lawyer.facebook || '',
            website: lawyer.website || ''
          });
          setImages(prev => ({
            ...prev,
            avatar: {
              url: lawyer.avatar?.url || '',
              publicId: lawyer.avatar?.publicId || '',
              uploading: false
            }
          }));
        } else {
          setError('Failed to load lawyer profile');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');
    formDataUpload.append('cloud_name', 'daa9e83as');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/daa9e83as/image/upload`,
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
      setError('Avatar must be an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Avatar must be less than 5MB');
      return;
    }

    setImages(prev => ({
      ...prev,
      avatar: { ...prev.avatar, uploading: true }
    }));

    try {
      const result = await uploadToCloudinary(file);
      setImages(prev => ({
        ...prev,
        avatar: {
          url: result.url,
          publicId: result.publicId,
          uploading: false
        }
      }));
      setError('');
    } catch (error) {
      setError('Failed to upload avatar image');
      setImages(prev => ({
        ...prev,
        avatar: { ...prev.avatar, uploading: false }
      }));
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle weekday selection
  const handleWeekdayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      weekdays: prev.weekdays.includes(day)
        ? prev.weekdays.filter(d => d !== day)
        : [...prev.weekdays, day]
    }));
  };

  // Handle weekend selection
  const handleWeekendChange = (day) => {
    setFormData(prev => ({
      ...prev,
      weekends: prev.weekends.includes(day)
        ? prev.weekends.filter(d => d !== day)
        : [...prev.weekends, day]
    }));
  };

  // Handle time addition
  const handleAddTime = (time) => {
    if (time && !formData.times.includes(time)) {
      setFormData(prev => ({
        ...prev,
        times: [...prev.times, time]
      }));
    }
  };

  // Handle time removal
  const handleRemoveTime = (index) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/professional-lawyers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          experience: parseInt(formData.experience),
          avatar: {
            url: images.avatar.url,
            publicId: images.avatar.publicId
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Success!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your professional lawyer profile has been updated successfully!
        </p>
        <button
          onClick={() => {
            setShowSuccessModal(false);
            navigate('/profile', { state: { activeSection: 'advertisements' } });
          }}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
        >
          Back to My Advertisements
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to My Advertisements</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Edit Professional Lawyer Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update your legal expertise and services
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {/* Avatar Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Profile Photo
            </label>
            <div className="flex items-center space-x-6">
              {images.avatar.url && (
                <img
                  src={images.avatar.url}
                  alt="Avatar preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
              <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>{images.avatar.uploading ? 'Uploading...' : 'Change Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={images.avatar.uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                placeholder="e.g., Criminal Law, Corporate Law"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Litigation, Consultation"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                max="70"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Describe your expertise, experience, and services..."
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Province
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Province</option>
                {Object.keys(provincesData).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                City
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!formData.province}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
              >
                <option value="">Select City</option>
                {formData.province && provincesData[formData.province]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="+94 or any country code"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Facebook
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Availability */}
          <div className="mb-8">
            <label className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Currently Available
              </span>
            </label>

            {/* Weekdays */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Available Weekdays
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.weekdays.includes(day)}
                      onChange={() => handleWeekdayChange(day)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Weekends */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Available Weekends
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Sat', 'Sun'].map(day => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.weekends.includes(day)}
                      onChange={() => handleWeekendChange(day)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Times */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Available Times
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  id="timeInput"
                  placeholder="e.g., 8:00 AM - 11:00 AM"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('timeInput');
                    handleAddTime(input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.times.map((time, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                    <span className="text-sm text-blue-900 dark:text-blue-100">{time}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(index)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving || images.avatar.uploading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}
    </div>
  );
};

export default EditProfessionalLawyersProfile;

