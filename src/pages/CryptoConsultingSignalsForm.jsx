import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, Loader, AlertCircle, CheckCircle, X, Plus, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const CryptoConsultingSignalsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Get advertisement ID from navigation state
  const advertisementId = location.state?.advertisementId;

  // Sri Lankan provinces and districts
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

  // Crypto categories
  const cryptoCategories = [
    "Bitcoin Trading",
    "Ethereum Trading",
    "Altcoin Trading",
    "NFT Trading",
    "DeFi Consulting",
    "Blockchain Development",
    "Smart Contract Auditing",
    "Crypto Portfolio Management",
    "Technical Analysis",
    "Fundamental Analysis",
    "Risk Management",
    "Crypto Tax Consulting",
    "Wallet Security",
    "Exchange Selection",
    "ICO/IDO Consulting",
    "Tokenomics",
    "Mining Consulting",
    "Staking Strategies",
    "Yield Farming",
    "Crypto Legal Consulting",
    "Market Research",
    "Trading Bots",
    "Arbitrage Trading",
    "Futures & Options Trading",
    "Other"
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    type: '',
    specialist: [],
    category: '',
    description: '',
    charges: '',
    city: '',
    province: '',
    online: false,
    physical: false,
    includes: [],
    contactNumber: '',
    facebook: '',
    website: ''
  });

  // Specialist input
  const [specialistInput, setSpecialistInput] = useState('');
  
  // Includes input
  const [includesInput, setIncludesInput] = useState('');

  // Image and PDF state
  const [image, setImage] = useState({ url: '', publicId: '', uploading: false });
  const [coursesPDF, setCoursesPDF] = useState({ url: '', publicId: '', uploading: false, fileName: '' });

  // Available cities based on selected province
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    if (!advertisementId) {
      setError('No advertisement ID provided');
      setTimeout(() => navigate('/profile', { state: { activeSection: 'advertisements' } }), 2000);
    }
  }, [advertisementId, navigate]);

  useEffect(() => {
    if (formData.province) {
      setAvailableCities(provincesAndDistricts[formData.province] || []);
    } else {
      setAvailableCities([]);
    }
  }, [formData.province]);

  // Upload to Cloudinary
  const uploadToCloudinary = async (file, resourceType = 'image') => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');
    formDataUpload.append('cloud_name', 'daa9e83as');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/daa9e83as/${resourceType}/upload`,
        { method: 'POST', body: formDataUpload }
      );

      const data = await response.json();
      if (data.secure_url) {
        return { url: data.secure_url, publicId: data.public_id };
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    try {
      setImage({ ...image, uploading: true });
      setError('');
      const uploadedImage = await uploadToCloudinary(file, 'image');
      setImage({ ...uploadedImage, uploading: false });
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      setImage({ url: '', publicId: '', uploading: false });
    }
  };

  // Handle PDF upload
  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('PDF must be less than 10MB');
      return;
    }

    try {
      setCoursesPDF({ ...coursesPDF, uploading: true });
      setError('');
      const uploadedPDF = await uploadToCloudinary(file, 'raw');
      setCoursesPDF({ ...uploadedPDF, uploading: false, fileName: file.name });
    } catch (err) {
      setError('Failed to upload PDF. Please try again.');
      setCoursesPDF({ url: '', publicId: '', uploading: false, fileName: '' });
    }
  };

  // Add specialist
  const addSpecialist = () => {
    if (specialistInput.trim() && !formData.specialist.includes(specialistInput.trim())) {
      setFormData({
        ...formData,
        specialist: [...formData.specialist, specialistInput.trim()]
      });
      setSpecialistInput('');
    }
  };

  // Remove specialist
  const removeSpecialist = (index) => {
    setFormData({
      ...formData,
      specialist: formData.specialist.filter((_, i) => i !== index)
    });
  };

  // Add includes
  const addIncludes = () => {
    if (includesInput.trim() && !formData.includes.includes(includesInput.trim())) {
      setFormData({
        ...formData,
        includes: [...formData.includes, includesInput.trim()]
      });
      setIncludesInput('');
    }
  };

  // Remove includes
  const removeIncludes = (index) => {
    setFormData({
      ...formData,
      includes: formData.includes.filter((_, i) => i !== index)
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle province change
  const handleProvinceChange = (e) => {
    setFormData({
      ...formData,
      province: e.target.value,
      city: ''
    });
  };

  // Validate step
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.type || formData.specialist.length === 0 || !formData.category) {
          setError('Please fill in all required fields in Step 1');
          return false;
        }
        break;
      case 2:
        if (!formData.description || !formData.charges || !formData.contactNumber || !formData.province || !formData.city) {
          setError('Please fill in all required fields in Step 2');
          return false;
        }
        if (!formData.online && !formData.physical) {
          setError('Please select at least one service type (Online or Physical)');
          return false;
        }
        break;
      case 3:
        if (!image.url) {
          setError('Please upload an image');
          return false;
        }
        break;
      default:
        return true;
    }
    setError('');
    return true;
  };

  // Next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        advertisementId,
        name: formData.name,
        type: formData.type,
        specialist: formData.specialist,
        category: formData.category,
        description: formData.description,
        charges: parseFloat(formData.charges),
        city: formData.city,
        province: formData.province,
        online: formData.online,
        physical: formData.physical,
        includes: formData.includes,
        image: {
          url: image.url,
          publicId: image.publicId
        },
        contactNumber: formData.contactNumber
      };

      // Add optional fields
      if (formData.facebook) payload.facebook = formData.facebook;
      if (formData.website) payload.website = formData.website;
      if (coursesPDF.url) {
        payload.coursesPDF = {
          url: coursesPDF.url,
          publicId: coursesPDF.publicId
        };
      }

      const response = await axios.post(
        'https://holidaysri-backend-9xm4.onrender.com/api/crypto-consulting-signals/publish',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/profile', { state: { activeSection: 'advertisements' } });
        }, 3000);
      }
    } catch (err) {
      console.error('Error publishing profile:', err);
      setError(err.response?.data?.message || 'Failed to publish profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to My Advertisements
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Crypto Consulting & Signals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Publish your crypto consulting or signals service
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={currentStep >= 1 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500'}>
              Basic Info
            </span>
            <span className={currentStep >= 2 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500'}>
              Details
            </span>
            <span className={currentStep >= 3 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500'}>
              Media & Publish
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Basic Information
              </h2>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your name or business name"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Courses">Courses</option>
                  <option value="Consultants">Consultants</option>
                </select>
              </div>

              {/* Specialist */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Specialist Areas * (Add multiple)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={specialistInput}
                    onChange={(e) => setSpecialistInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialist())}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Bitcoin Expert, DeFi Specialist"
                  />
                  <button
                    type="button"
                    onClick={addSpecialist}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specialist.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => removeSpecialist(index)}
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                {formData.specialist.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Add at least one specialist area
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Category</option>
                  {cryptoCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Navigation */}
              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Service Details
              </h2>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe your crypto consulting/signals service in detail..."
                  required
                />
              </div>

              {/* Charges */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Charges (LKR) *
                </label>
                <input
                  type="number"
                  name="charges"
                  value={formData.charges}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your charges in LKR"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your contact number (any country)"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Include country code (e.g., +94771234567, +1234567890)
                </p>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Province *
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleProvinceChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Province</option>
                    {Object.keys(provincesAndDistricts).map((province) => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    disabled={!formData.province}
                  >
                    <option value="">Select City</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Service Type * (Select at least one)
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="online"
                      checked={formData.online}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Online</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="physical"
                      checked={formData.physical}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Physical</span>
                  </label>
                </div>
              </div>

              {/* Includes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  What's Included (Optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={includesInput}
                    onChange={(e) => setIncludesInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncludes())}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 6 Modules, Portfolio Tools, Case Studies"
                  />
                  <button
                    type="button"
                    onClick={addIncludes}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.includes.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeIncludes(index)}
                        className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Media & Publish */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Media & Social Links
              </h2>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Service Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  {image.url ? (
                    <div className="relative">
                      <img
                        src={image.url}
                        alt="Service"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImage({ url: '', publicId: '', uploading: false })}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <label className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          {image.uploading ? 'Uploading...' : 'Click to upload'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={image.uploading}
                        />
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Facebook (Optional)
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              {/* Courses PDF */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Courses Details PDF (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  {coursesPDF.url ? (
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-red-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {coursesPDF.fileName || 'Courses Details.pdf'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">PDF Document</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCoursesPDF({ url: '', publicId: '', uploading: false, fileName: '' })}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <label className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          {coursesPDF.uploading ? 'Uploading...' : 'Click to upload PDF'}
                        </span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handlePDFUpload}
                          className="hidden"
                          disabled={coursesPDF.uploading}
                        />
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        PDF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={loading || image.uploading || coursesPDF.uploading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Now'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Success!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your crypto consulting/signals service has been published successfully!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to My Advertisements...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoConsultingSignalsForm;

