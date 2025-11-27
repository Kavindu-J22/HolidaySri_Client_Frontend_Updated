import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  ArrowLeft,
  Upload,
  X,
  Loader,
  CheckCircle,
  Heart,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  FileText,
  Image as ImageIcon,
  User,
  Building2
} from 'lucide-react';

const DonationsRaiseFundForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const advertisementId = location.state?.advertisementId;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hscValue, setHscValue] = useState(100);
  const [provincesData, setProvincesData] = useState({
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Northern Province": ["Jaffna", "Mannar", "Vavuniya", "Kilinochchi", "Mullaitivu"],
    "Eastern Province": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Sabaragamuwa Province": ["Kegalle", "Ratnapura"]
  });

  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    category: '',
    province: '',
    city: '',
    address: '',
    description: '',
    email: user?.email || '',
    contact: '',
    requestedAmountLKR: ''
  });

  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const categories = [
    'Education',
    'Medical & Healthcare',
    'Disaster Relief',
    'Community Development',
    'Animal Welfare',
    'Environmental Conservation',
    'Children & Youth',
    'Elderly Care',
    'Poverty Alleviation',
    'Arts & Culture',
    'Sports & Recreation',
    'Religious & Spiritual',
    'Emergency & Crisis',
    'Other'
  ];

  // Fetch HSC value
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hscResponse = await axios.get('https://holidaysri-backend-9xm4.onrender.com/api/donations-raise-fund/current-hsc-value');

        if (hscResponse.data.success) {
          setHscValue(hscResponse.data.data.hscValue);
        }
      } catch (err) {
        console.error('Error fetching HSC value:', err);
        // Use default HSC value of 100 if fetch fails
      }
    };

    fetchData();
  }, []);

  // Set user email (read-only)
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user, formData.email]);

  // Calculate HSC amount automatically
  const calculateHSCAmount = () => {
    if (formData.requestedAmountLKR && hscValue) {
      return (parseFloat(formData.requestedAmountLKR) / hscValue).toFixed(2);
    }
    return '0.00';
  };

  // Upload image to Cloudinary
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

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 4) {
      setError('Maximum 4 images allowed');
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('All files must be images');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be less than 5MB');
        return;
      }
    }

    setUploadingImage(true);
    try {
      const uploadedImages = [];
      for (const file of files) {
        const result = await uploadToCloudinary(file);
        uploadedImages.push(result);
      }
      setImages(prev => [...prev, ...uploadedImages]);
      setError('');
    } catch (error) {
      setError('Failed to upload images');
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!advertisementId) {
      setError('Advertisement ID is missing');
      return;
    }

    // Detailed validation with specific error messages
    const missingFields = [];
    if (!formData.title?.trim()) missingFields.push('Title');
    if (!formData.organizer?.trim()) missingFields.push('Organizer');
    if (!formData.category) missingFields.push('Category');
    if (!formData.province) missingFields.push('Province');
    if (!formData.city) missingFields.push('City');
    if (!formData.address?.trim()) missingFields.push('Address');
    if (!formData.description?.trim()) missingFields.push('Description');
    if (!formData.email?.trim()) missingFields.push('Email');
    if (!formData.contact?.trim()) missingFields.push('Contact');
    if (!formData.requestedAmountLKR || parseFloat(formData.requestedAmountLKR) <= 0) missingFields.push('Requested Amount (LKR)');

    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const requestedAmountHSC = parseFloat(calculateHSCAmount());

      const response = await axios.post(
        'https://holidaysri-backend-9xm4.onrender.com/api/donations-raise-fund/publish',
        {
          advertisementId,
          ...formData,
          images,
          requestedAmountLKR: parseFloat(formData.requestedAmountLKR),
          requestedAmountHSC
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('Error publishing campaign:', err);
      setError(err.response?.data?.message || 'Failed to publish campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle success modal close
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/profile', { state: { activeTab: 'advertisements' } });
  };

  // Get cities for selected province
  const getCities = () => {
    return formData.province ? provincesData[formData.province] || [] : [];
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: FileText },
    { number: 2, title: 'Location', icon: MapPin },
    { number: 3, title: 'Details', icon: Heart },
    { number: 4, title: 'Contact & Amount', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/profile', { state: { activeTab: 'advertisements' } })}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back to My Advertisements</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mb-3 sm:mb-4">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Publish Your Fundraising Campaign
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Share your cause and raise funds for what matters
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                    <span className={`mt-1 sm:mt-2 text-[10px] sm:text-xs font-medium text-center ${
                      currentStep >= step.number
                        ? 'text-pink-600 dark:text-pink-400'
                        : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 ${
                      currentStep > step.number
                        ? 'bg-gradient-to-r from-pink-500 to-red-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Basic Information</h2>

              {/* Title */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                  placeholder="e.g., Help Build a School in Rural Area"
                  maxLength={200}
                />
              </div>

              {/* Organizer */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                  Organizer Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                    placeholder="Organization or individual name"
                    maxLength={150}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                  Campaign Images * (Maximum 4)
                </label>
                <div className="space-y-3 sm:space-y-4">
                  {/* Upload Button */}
                  {images.length < 4 && (
                    <label className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-4 sm:pt-5 pb-4 sm:pb-6">
                        {uploadingImage ? (
                          <Loader className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-2" />
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              Click to upload images ({images.length}/4)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploadingImage || images.length >= 4}
                      />
                    </label>
                  )}

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 sm:h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Location Details</h2>

              {/* Province */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                  Province *
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value, city: '' })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                >
                  <option value="">Select a province</option>
                  {Object.keys(provincesData).map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                  disabled={!formData.province}
                >
                  <option value="">Select a city</option>
                  {getCities().map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                  Full Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                  rows={3}
                  placeholder="Enter complete address"
                  maxLength={500}
                />
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Campaign Details</h2>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                  rows={8}
                  placeholder="Describe your fundraising campaign in detail. Include the purpose, goals, and how the funds will be used."
                  maxLength={5000}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.description.length}/5000 characters
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Contact & Amount */}
          {currentStep === 4 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Contact & Funding Details</h2>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 dark:text-white cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email is auto-filled from your account
                </p>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                  Contact Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                    placeholder="e.g., +94 77 123 4567"
                  />
                </div>
              </div>

              {/* Requested Amount LKR */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                  Requested Amount (LKR) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.requestedAmountLKR}
                    onChange={(e) => setFormData({ ...formData, requestedAmountLKR: e.target.value })}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                    placeholder="Enter amount in LKR"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Requested Amount HSC (Auto-calculated, Read-only) */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                  Requested Amount (HSC)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={calculateHSCAmount()}
                    readOnly
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 dark:text-white cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Auto-calculated based on current HSC value (1 HSC = {hscValue} LKR)
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="ml-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Publish Now</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Campaign Published!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your fundraising campaign has been successfully published and is now live.
            </p>
            <button
              onClick={handleSuccessClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition-colors font-semibold"
            >
              Back to My Advertisements
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsRaiseFundForm;

