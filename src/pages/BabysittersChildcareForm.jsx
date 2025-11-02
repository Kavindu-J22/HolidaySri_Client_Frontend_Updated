import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Upload, X, CheckCircle } from 'lucide-react';

const BabysittersChildcareForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { advertisementId } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    experience: '',
    city: '',
    province: '',
    contact: '',
    available: true,
    includes: [],
    facebook: '',
    website: '',
    gender: 'Female',
    availability: {
      weekdays: '',
      weekends: ''
    }
  });

  const [images, setImages] = useState({
    gallery: []
  });

  const [provincesData, setProvincesData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const servicesOptions = [
    'Meal Preparation',
    'Homework Help',
    'Bedtime Routine',
    'Playtime Activities',
    'Diaper Changing',
    'Bottle Feeding',
    'Potty Training',
    'Story Time',
    'Arts & Crafts',
    'Outdoor Activities'
  ];

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('/api/babysitters-childcare/provinces');
        const data = await response.json();
        if (data.success) {
          setProvincesData(data.data);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvinces();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle availability change
  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [name]: value
      }
    }));
  };

  // Handle includes toggle
  const handleIncludesToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.includes(service)
        ? prev.includes.filter(s => s !== service)
        : [...prev.includes, service]
    }));
  };

  // Upload to Cloudinary
  const uploadToCloudinary = async (file, resourceType = 'image') => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');
    formDataUpload.append('cloud_name', 'daa9e83as');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/daa9e83as/${resourceType}/upload`,
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

  // Handle gallery upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.gallery.length + files.length > 4) {
      setError('Maximum 4 images allowed');
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('All files must be image files');
        return;
      }
    }

    try {
      const uploadedImages = [];
      for (const file of files) {
        const result = await uploadToCloudinary(file, 'image');
        uploadedImages.push({
          url: result.url,
          publicId: result.publicId,
          alt: formData.name || 'Babysitter image'
        });
      }
      setImages(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...uploadedImages]
      }));
      setError('');
    } catch (error) {
      setError('Failed to upload images');
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Success!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Your babysitter/childcare profile has been published successfully.</p>
        <button
          onClick={() => {
            setShowSuccessModal(false);
            navigate('/profile', { state: { activeSection: 'advertisements' } });
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Go to My Advertisements
        </button>
      </div>
    </div>
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/babysitters-childcare/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          advertisementId,
          ...formData,
          experience: parseInt(formData.experience),
          images: images.gallery
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Failed to publish profile');
      }
    } catch (error) {
      console.error('Error publishing profile:', error);
      setError('Failed to publish profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Publish Babysitter/Childcare Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in your details to publish your babysitter or childcare service
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your full name"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Full-time Babysitter, Part-time Nanny"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe your experience and services"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Years of Experience *
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
              min="0"
              max="70"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="0"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Province *
            </label>
            <select
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Province</option>
              {Object.keys(provincesData).map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              City *
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              disabled={!formData.province}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            >
              <option value="">Select City</option>
              {formData.province && provincesData[formData.province]?.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Contact Number *
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your contact number"
            />
          </div>

          {/* Availability */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Weekdays Availability
              </label>
              <input
                type="text"
                name="weekdays"
                value={formData.availability.weekdays}
                onChange={handleAvailabilityChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 3:00 PM - 8:00 PM"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Weekends Availability
              </label>
              <input
                type="text"
                name="weekends"
                value={formData.availability.weekends}
                onChange={handleAvailabilityChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 8:00 AM - 8:00 PM"
              />
            </div>
          </div>

          {/* Services Included */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Services Included
            </label>
            <div className="grid grid-cols-2 gap-3">
              {servicesOptions.map(service => (
                <label key={service} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includes.includes(service)}
                    onChange={() => handleIncludesToggle(service)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Available Status */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Currently Available</span>
            </label>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Facebook (Optional)
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Website (Optional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Upload Images (Max 4) *
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
                id="gallery-upload"
              />
              <label htmlFor="gallery-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload images</p>
              </label>
            </div>

            {/* Image Preview */}
            {images.gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {images.gallery.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img.url} alt={`Preview ${idx}`} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading || images.gallery.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Publishing...' : 'Publish Now'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
              className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}
    </div>
  );
};

export default BabysittersChildcareForm;

