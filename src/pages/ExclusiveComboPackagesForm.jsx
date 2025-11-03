import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ExclusiveComboPackagesForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');

  // Get advertisement ID from navigation state
  const advertisementId = location.state?.advertisementId;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    categoryType: '',
    locations: '',
    description: '',
    days: '',
    pax: '',
    activities: [],
    includes: [],
    price: '',
    provider: {
      name: user?.name || '',
      facebook: '',
      website: '',
      contact: ''
    }
  });

  // Image state
  const [images, setImages] = useState([]);
  const [providerAvatar, setProviderAvatar] = useState(null);
  const [activitiesInput, setActivitiesInput] = useState('');
  const [includesInput, setIncludesInput] = useState('');

  // Category type options
  const categoryTypeOptions = [
    'Cultural',
    'Adventure',
    'Beach',
    'Mountain',
    'Wildlife',
    'Historical',
    'Religious',
    'Wellness',
    'Luxury',
    'Family',
    'Honeymoon',
    'Corporate'
  ];

  // Activity suggestions
  const activitySuggestions = [
    'Temple Visits',
    'Historical Sites',
    'Local Cuisine',
    'Elephant Safari',
    'Sunset Views',
    'Cultural Shows',
    'Museum Tours',
    'Archaeological Walks',
    'Beach Activities',
    'Water Sports',
    'Hiking',
    'Photography Tours'
  ];

  // Include suggestions
  const includeSuggestions = [
    'Accommodation',
    'All Meals',
    'Entrance Fees',
    'English Guide',
    'Transport',
    'Airport Pickup',
    'Travel Insurance',
    '24/7 Support',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snacks'
  ];

  useEffect(() => {
    if (!advertisementId) {
      navigate('/profile', { state: { activeSection: 'advertisements' } });
    }
  }, [advertisementId, navigate]);

  // Upload to Cloudinary
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
    } catch (err) {
      console.error('Upload error:', err);
    }
    return null;
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 3) {
      setError('Maximum 3 images allowed');
      return;
    }

    setLoading(true);
    try {
      for (const file of files) {
        const uploadedImage = await uploadToCloudinary(file);
        if (uploadedImage) {
          setImages(prev => [...prev, uploadedImage]);
        }
      }
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  // Handle provider avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const uploadedImage = await uploadToCloudinary(file);
      if (uploadedImage) {
        setProviderAvatar(uploadedImage);
      }
    } catch (err) {
      setError('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Add activity
  const addActivity = () => {
    if (activitiesInput.trim() && !formData.activities.includes(activitiesInput.trim())) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, activitiesInput.trim()]
      }));
      setActivitiesInput('');
    }
  };

  // Remove activity
  const removeActivity = (index) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  // Add include
  const addInclude = () => {
    if (includesInput.trim() && !formData.includes.includes(includesInput.trim())) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, includesInput.trim()]
      }));
      setIncludesInput('');
    }
  };

  // Remove include
  const removeInclude = (index) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.categoryType || !formData.locations || 
        !formData.description || !formData.days || !formData.pax || 
        !formData.price || !formData.provider.contact || images.length === 0 || !providerAvatar) {
      setError('Please fill all required fields and upload images');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/exclusive-combo-packages/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          advertisementId,
          ...formData,
          days: parseInt(formData.days),
          price: parseFloat(formData.price),
          images,
          provider: {
            ...formData.provider,
            avatar: providerAvatar
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/profile', { state: { activeSection: 'advertisements' } });
        }, 3000);
      } else {
        setError(data.message || 'Failed to publish. Please try again.');
      }
    } catch (err) {
      console.error('Error publishing:', err);
      setError('Failed to publish. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white ml-4">
            Publish Exclusive Combo Package
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Package Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Cultural Triangle Expedition"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Type *
                </label>
                <select
                  value={formData.categoryType}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryType: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categoryTypeOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Days *
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g., 5"
                  value={formData.days}
                  onChange={(e) => setFormData(prev => ({ ...prev, days: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Locations *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Anuradhapura, Polonnaruwa, Sigiriya"
                  value={formData.locations}
                  onChange={(e) => setFormData(prev => ({ ...prev, locations: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pax (Participants) *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2-6"
                  value={formData.pax}
                  onChange={(e) => setFormData(prev => ({ ...prev, pax: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                placeholder="Describe your package in detail..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (LKR) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 50000"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Images (Max 3) *</h2>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading || images.length >= 3}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <span className="text-blue-600 dark:text-blue-400 hover:underline">Click to upload</span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {images.length}/3 images uploaded
              </p>
            </div>

            {/* Image Preview */}
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img.url} alt={`Package ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Activities Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Activities</h2>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add activity..."
                value={activitiesInput}
                onChange={(e) => setActivitiesInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addActivity())}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={addActivity}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {/* Activity Suggestions */}
            <div className="flex flex-wrap gap-2">
              {activitySuggestions.map(activity => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => {
                    setActivitiesInput(activity);
                    if (!formData.activities.includes(activity)) {
                      setFormData(prev => ({
                        ...prev,
                        activities: [...prev.activities, activity]
                      }));
                    }
                  }}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {activity}
                </button>
              ))}
            </div>

            {/* Selected Activities */}
            <div className="flex flex-wrap gap-2">
              {formData.activities.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                  <span>{activity}</span>
                  <button
                    type="button"
                    onClick={() => removeActivity(idx)}
                    className="hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Includes Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What's Included</h2>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add included item..."
                value={includesInput}
                onChange={(e) => setIncludesInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={addInclude}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {/* Include Suggestions */}
            <div className="flex flex-wrap gap-2">
              {includeSuggestions.map(include => (
                <button
                  key={include}
                  type="button"
                  onClick={() => {
                    setIncludesInput(include);
                    if (!formData.includes.includes(include)) {
                      setFormData(prev => ({
                        ...prev,
                        includes: [...prev.includes, include]
                      }));
                    }
                  }}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {include}
                </button>
              ))}
            </div>

            {/* Selected Includes */}
            <div className="flex flex-wrap gap-2">
              {formData.includes.map((include, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                  <span>{include}</span>
                  <button
                    type="button"
                    onClick={() => removeInclude(idx)}
                    className="hover:text-green-900 dark:hover:text-green-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Provider Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Provider Information</h2>
            
            {/* Provider Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Provider Avatar *
              </label>
              <div className="flex items-center gap-4">
                {providerAvatar ? (
                  <div className="relative">
                    <img src={providerAvatar.url} alt="Provider" className="w-24 h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setProviderAvatar(null)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 w-24 h-24 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={loading}
                  className="hidden"
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <span className="text-blue-600 dark:text-blue-400 hover:underline">Upload Avatar</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Provider Name *
              </label>
              <input
                type="text"
                value={formData.provider.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  provider: { ...prev.provider, name: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact (Phone/WhatsApp) *
              </label>
              <input
                type="text"
                placeholder="e.g., +94771234567"
                value={formData.provider.contact}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  provider: { ...prev.provider, contact: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Facebook URL"
                  value={formData.provider.facebook}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    provider: { ...prev.provider, facebook: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Website URL"
                  value={formData.provider.website}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    provider: { ...prev.provider, website: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Publish Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Published Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your exclusive combo package has been published. Redirecting to My Advertisements...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExclusiveComboPackagesForm;

