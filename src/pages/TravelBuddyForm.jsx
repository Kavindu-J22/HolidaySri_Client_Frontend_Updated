import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Phone,
  Globe,
  FileText,
  Users,
  Heart,
  Camera,
  Upload,
  X,
  Loader,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Share2
} from 'lucide-react';

const TravelBuddyForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');

  // Get advertisement ID from navigation state
  const advertisementId = location.state?.advertisementId;

  // Form state
  const [formData, setFormData] = useState({
    userName: user?.name || '',
    nickName: '',
    age: '',
    whatsappNumber: '',
    country: 'Sri Lanka',
    description: '',
    gender: '',
    interests: [],
    socialMedia: {
      facebook: '',
      instagram: '',
      tiktok: ''
    }
  });

  // Image upload state
  const [images, setImages] = useState({
    coverPhoto: { url: '', publicId: '', uploading: false },
    avatarImage: { url: '', publicId: '', uploading: false }
  });

  // Interest input state
  const [currentInterest, setCurrentInterest] = useState('');

  // Redirect if no advertisement ID
  useEffect(() => {
    if (!advertisementId) {
      navigate('/profile', { state: { activeSection: 'advertisements' } });
      return;
    }
  }, [advertisementId, navigate]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/travel-buddy/countries');
        const data = await response.json();
        if (data.success) {
          setCountries(data.countries);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        // Fallback countries list
        setCountries(['Sri Lanka', 'India', 'United States', 'United Kingdom', 'Australia', 'Canada']);
      }
    };

    fetchCountries();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle social media input changes
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value
      }
    }));
  };

  // Handle interest addition
  const addInterest = () => {
    if (currentInterest.trim() && formData.interests.length < 10) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, currentInterest.trim()]
      }));
      setCurrentInterest('');
    }
  };

  // Handle interest removal
  const removeInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  // Handle image upload to Cloudinary
  const uploadImage = async (file, imageType) => {
    try {
      setImages(prev => ({
        ...prev,
        [imageType]: { ...prev[imageType], uploading: true }
      }));

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'daa9e83as');

      const response = await fetch('https://api.cloudinary.com/v1_1/daa9e83as/image/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.secure_url) {
        setImages(prev => ({
          ...prev,
          [imageType]: {
            url: data.secure_url,
            publicId: data.public_id,
            uploading: false
          }
        }));
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setImages(prev => ({
        ...prev,
        [imageType]: { ...prev[imageType], uploading: false }
      }));
      setError('Failed to upload image. Please try again.');
    }
  };

  // Handle file selection
  const handleFileSelect = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
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

      uploadImage(file, imageType);
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.userName.trim()) return 'User name is required';
    if (!formData.age || formData.age < 18 || formData.age > 100) return 'Age must be between 18 and 100';
    if (!formData.whatsappNumber.trim()) return 'WhatsApp number is required';
    if (!formData.country) return 'Country is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.gender) return 'Gender is required';
    if (!images.coverPhoto.url) return 'Cover photo is required';
    if (!images.avatarImage.url) return 'Avatar image is required';
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/travel-buddy/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          advertisementId,
          ...formData,
          coverPhoto: {
            url: images.coverPhoto.url,
            publicId: images.coverPhoto.publicId
          },
          avatarImage: {
            url: images.avatarImage.url,
            publicId: images.avatarImage.publicId
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Failed to publish travel buddy profile');
      }
    } catch (error) {
      console.error('Error publishing travel buddy:', error);
      setError('Failed to publish travel buddy profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle success modal close and navigation
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/profile', { state: { activeSection: 'advertisements' } });
  };

  if (!advertisementId) {
    return null;
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
              Create Your Travel Buddy Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your travel preferences and connect with like-minded travelers
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Personal Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User Name *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nick Name (Optional)
                </label>
                <input
                  type="text"
                  name="nickName"
                  value={formData.nickName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your nickname"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your age"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
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
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="+94771234567"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Social Media Profiles */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span>Social Media Profiles</span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">f</span>
                  </div>
                  <span>Facebook Profile</span>
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.socialMedia.facebook}
                  onChange={handleSocialMediaChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://facebook.com/yourprofile"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Paste your Facebook profile link here
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs">📷</span>
                  </div>
                  <span>Instagram Profile</span>
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.socialMedia.instagram}
                  onChange={handleSocialMediaChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://instagram.com/yourprofile"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Paste your Instagram profile link here
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <span>TikTok Profile</span>
                </label>
                <input
                  type="url"
                  name="tiktok"
                  value={formData.socialMedia.tiktok}
                  onChange={handleSocialMediaChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://tiktok.com/@yourprofile"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Paste your TikTok profile link here
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Adding your social media profiles helps other travelers get to know you better and builds trust. All fields are optional.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>About You</span>
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Tell other travelers about yourself, your travel style, interests, and what kind of travel companion you're looking for..."
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {formData.description.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Interests</span>
            </h2>

            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentInterest}
                  onChange={(e) => setCurrentInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Add an interest (e.g., hiking, photography, food)"
                  maxLength={50}
                />
                <button
                  type="button"
                  onClick={addInterest}
                  disabled={!currentInterest.trim() || formData.interests.length >= 10}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>

              {formData.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(index)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add up to 10 interests that describe your travel preferences
              </p>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Photos</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  {images.coverPhoto.url ? (
                    <div className="relative">
                      <img
                        src={images.coverPhoto.url}
                        alt="Cover"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(prev => ({ ...prev, coverPhoto: { url: '', publicId: '', uploading: false } }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      {images.coverPhoto.uploading ? (
                        <div className="flex flex-col items-center">
                          <Loader className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Upload your cover photo
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e, 'coverPhoto')}
                            className="hidden"
                            id="coverPhoto"
                          />
                          <label
                            htmlFor="coverPhoto"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                          >
                            Choose File
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  {images.avatarImage.url ? (
                    <div className="relative">
                      <img
                        src={images.avatarImage.url}
                        alt="Avatar"
                        className="w-32 h-32 object-cover rounded-full mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(prev => ({ ...prev, avatarImage: { url: '', publicId: '', uploading: false } }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      {images.avatarImage.uploading ? (
                        <div className="flex flex-col items-center">
                          <Loader className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
                        </div>
                      ) : (
                        <div>
                          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Upload your profile picture
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e, 'avatarImage')}
                            className="hidden"
                            id="avatarImage"
                          />
                          <label
                            htmlFor="avatarImage"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                          >
                            Choose File
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || images.coverPhoto.uploading || images.avatarImage.uploading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  <span>Publish Now</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Success!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your travel buddy profile has been published successfully!
                </p>
                <button
                  onClick={handleSuccessClose}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to My Advertisements
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelBuddyForm;
