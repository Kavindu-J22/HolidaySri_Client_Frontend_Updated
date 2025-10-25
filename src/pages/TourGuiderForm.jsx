import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  ArrowLeft,
  AlertCircle,
  Loader,
  Award,
  MapPin,
  Mail,
  Phone,
  Calendar,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import SuccessModal from '../components/common/SuccessModal';

const TourGuiderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});

  // Get advertisement ID from navigation state
  const advertisementId = location.state?.advertisementId;

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: '',
    age: '',
    province: '',
    city: '',
    description: '',
    experience: '',
    email: user?.email || '',
    facilitiesProvided: [],
    contact: user?.contactNumber || '',
    isAvailable: true,
    availableFrom: '',
    facebook: '',
    website: ''
  });

  // Image state
  const [images, setImages] = useState({
    avatar: {
      url: '',
      publicId: '',
      uploading: false
    },
    certificate: {
      url: '',
      publicId: '',
      name: '',
      uploading: false
    }
  });

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('/api/tour-guider/provinces');
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

  // Handle facilities checkbox
  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilitiesProvided: prev.facilitiesProvided.includes(facility)
        ? prev.facilitiesProvided.filter(f => f !== facility)
        : [...prev.facilitiesProvided, facility]
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

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Avatar must be an image file');
      return;
    }

    setImages(prev => ({
      ...prev,
      avatar: { ...prev.avatar, uploading: true }
    }));

    try {
      const result = await uploadToCloudinary(file, 'image');
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

  // Handle certificate upload
  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Certificate must be a PDF file');
      return;
    }

    setImages(prev => ({
      ...prev,
      certificate: { ...prev.certificate, uploading: true }
    }));

    try {
      const result = await uploadToCloudinary(file, 'raw');
      setImages(prev => ({
        ...prev,
        certificate: {
          url: result.url,
          publicId: result.publicId,
          name: file.name,
          uploading: false
        }
      }));
      setError('');
    } catch (error) {
      setError('Failed to upload certificate');
      setImages(prev => ({
        ...prev,
        certificate: { ...prev.certificate, uploading: false }
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.gender) return 'Gender is required';
    if (!formData.age || formData.age < 18 || formData.age > 100) return 'Age must be between 18 and 100';
    if (!formData.province) return 'Province is required';
    if (!formData.city) return 'City is required';
    if (!formData.description.trim()) return 'Description is required';
    if (formData.experience === '' || formData.experience < 0 || formData.experience > 70) return 'Experience must be between 0 and 70 years';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.contact.trim()) return 'Contact number is required';
    if (!formData.availableFrom) return 'Available from date is required';
    if (!images.avatar.url) return 'Avatar image is required';
    if (!images.certificate.url) return 'Certificate is required';
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
      const response = await fetch('/api/tour-guider/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          advertisementId,
          ...formData,
          avatar: {
            url: images.avatar.url,
            publicId: images.avatar.publicId
          },
          certificate: {
            url: images.certificate.url,
            publicId: images.certificate.publicId,
            name: images.certificate.name
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Failed to publish tour guider profile');
      }
    } catch (error) {
      console.error('Error publishing tour guider:', error);
      setError('Failed to publish tour guider profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle success modal close
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/profile', { state: { activeSection: 'advertisements' } });
  };

  if (!advertisementId) {
    return null;
  }

  const facilities = [
    'Transportation',
    'Meals',
    'Accommodation',
    'Equipment',
    'Insurance',
    'Photography',
    'Interpretation Services'
  ];

  const availableCities = formData.province ? provincesData[formData.province] || [] : [];

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
              Create Your Tour Guider Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your expertise and connect with travelers looking for guided tours
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
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your age"
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
                  placeholder="Enter your email"
                />
              </div>

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
                  placeholder="Enter your contact number"
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
                  placeholder="Enter years of experience"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Location Information</span>
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

          {/* Professional Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Professional Information</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe your expertise, specialties, and what makes you a great tour guide"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Facilities Provided
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facilities.map(facility => (
                    <label key={facility} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.facilitiesProvided.includes(facility)}
                        onChange={() => handleFacilityChange(facility)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Availability</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Currently Available</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available From *
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Social Media & Website */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Social Media & Website (Optional)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook Profile
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://facebook.com/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
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
            </div>
          </div>

          {/* Image Uploads */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <ImageIcon className="w-5 h-5" />
              <span>Profile Images</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar Image * (JPG, PNG)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={images.avatar.uploading}
                    className="hidden"
                    id="avatar-input"
                  />
                  <label htmlFor="avatar-input" className="cursor-pointer">
                    {images.avatar.uploading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    ) : images.avatar.url ? (
                      <div className="space-y-2">
                        <div className="text-green-600 dark:text-green-400">✓ Uploaded</div>
                        <img src={images.avatar.url} alt="Avatar" className="w-20 h-20 rounded-lg mx-auto object-cover" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Click to upload avatar</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Certificate Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate * (PDF)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleCertificateUpload}
                    disabled={images.certificate.uploading}
                    className="hidden"
                    id="certificate-input"
                  />
                  <label htmlFor="certificate-input" className="cursor-pointer">
                    {images.certificate.uploading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    ) : images.certificate.url ? (
                      <div className="space-y-2">
                        <div className="text-green-600 dark:text-green-400">✓ Uploaded</div>
                        <FileText className="w-8 h-8 mx-auto text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{images.certificate.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <FileText className="w-8 h-8 mx-auto text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Click to upload certificate</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || images.avatar.uploading || images.certificate.uploading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Award className="w-5 h-5" />
                  <span>Publish Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          title="Profile Published Successfully!"
          message="Your tour guider profile has been published and is now visible to travelers."
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
};

export default TourGuiderForm;

