import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { X, Upload, MapPin, Tag, Link as LinkIcon, Image as ImageIcon, CheckCircle, AlertCircle, Sparkles, DollarSign, Camera, ShieldAlert } from 'lucide-react';
import './ImageProtection.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://holidaysri-backend-9xm4.onrender.com/api';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
const CLOUDINARY_CLOUD_NAME = 'daa9e83as';

const UploadPhotoModal = ({ isOpen, onClose, isDarkMode, onSuccess }) => {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [caption, setCaption] = useState('');
  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [tags, setTags] = useState('');
  const [isOtherCountry, setIsOtherCountry] = useState(false);
  const [country, setCountry] = useState('');

  // List of countries
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
    "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
    "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus",
    "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
    "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana", "Haiti",
    "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
    "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
    "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
    "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
    "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
    "South Sudan", "Spain", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
    "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  // Image protection handlers
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return {
        url: response.data.secure_url,
        publicId: response.data.public_id
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !caption || !locationName) {
      setError('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload image to Cloudinary
      const { url, publicId } = await uploadToCloudinary(selectedFile);

      // Parse tags
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .slice(0, 5); // Max 5 tags

      // Submit to backend
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/holiday-memories/upload`,
        {
          image: url,
          imagePublicId: publicId,
          caption,
          location: {
            name: locationName,
            city: isOtherCountry ? '' : city,
            province: isOtherCountry ? '' : province,
            country: isOtherCountry ? country : 'Sri Lanka',
            isOtherCountry
          },
          mapLink,
          tags: tagArray
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setCaption('');
      setLocationName('');
      setCity('');
      setProvince('');
      setMapLink('');
      setTags('');
      setIsOtherCountry(false);
      setCountry('');
      setStep(1);

      onSuccess && onSuccess(response.data.post);
      onClose();

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedFile) {
      setError('Please select an image');
      return;
    }
    if (step === 2 && (!caption || !locationName)) {
      setError('Please fill in caption and location name');
      return;
    }
    if (step === 2 && isOtherCountry && !country) {
      setError('Please select a country');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50">
      <div className={`max-w-2xl w-full rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} max-h-[95vh] sm:max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-lg`}>
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
            <div className="flex-1 pr-2">
              <h2 className={`text-lg sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Share Your Travel Memory
              </h2>
              <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Post for FREE & Earn Extra Money! 💰
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg flex-shrink-0 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>

          {/* Attractive Banner - Mobile Responsive */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-white text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-semibold whitespace-nowrap">100% FREE to Post</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-semibold whitespace-nowrap">Earn 1.5 HSC per Download</span>
              </div>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-semibold whitespace-nowrap">Use High-Quality Images</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="p-4 sm:p-6">
          <div className="max-w-md mx-auto mb-4 sm:mb-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-center mb-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                      step >= s
                        ? 'bg-blue-600 text-white shadow-lg'
                        : isDarkMode
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-12 sm:w-24 h-1 mx-2 sm:mx-3 transition-all ${
                        step > s
                          ? 'bg-blue-600'
                          : isDarkMode
                          ? 'bg-gray-700'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Labels */}
            <div className="flex items-center justify-between px-1 sm:px-2">
              <span className={`text-[10px] sm:text-xs font-medium text-center ${step >= 1 ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                Select Image
              </span>
              <span className={`text-[10px] sm:text-xs font-medium text-center ${step >= 2 ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                Add Details
              </span>
              <span className={`text-[10px] sm:text-xs font-medium text-center ${step >= 3 ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                Tags & Map
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Step 1: Select Image */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h3 className={`text-base sm:text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Upload Your Best Travel Photo
                </h3>
                <p className={`text-xs sm:text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Share your amazing travel moments with the world
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-flex items-center gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-lg cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-semibold">Choose High-Quality Image</span>
                </label>
                <p className={`text-[10px] sm:text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Max file size: 10MB • Supported: JPG, PNG, WEBP
                </p>
              </div>

              {/* Copyright Warning Tip */}
              <div className={`mx-2 sm:mx-4 p-3 sm:p-4 rounded-xl border-2 ${
                isDarkMode
                  ? 'bg-amber-900/20 border-amber-600/50'
                  : 'bg-amber-50 border-amber-300'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full flex-shrink-0 ${
                    isDarkMode ? 'bg-amber-600/30' : 'bg-amber-100'
                  }`}>
                    <ShieldAlert className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      isDarkMode ? 'text-amber-400' : 'text-amber-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm sm:text-base font-semibold mb-1 ${
                      isDarkMode ? 'text-amber-400' : 'text-amber-700'
                    }`}>
                      ⚠️ Important: Copyright Policy
                    </h4>
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      isDarkMode ? 'text-amber-300/90' : 'text-amber-800'
                    }`}>
                      Please upload <strong>unique photos that you have personally captured</strong>.
                      Uploading copyrighted images, stock photos, or content owned by others
                      will result in <strong>immediate account suspension</strong>.
                      We take copyright violations seriously to protect our community.
                    </p>
                  </div>
                </div>
              </div>

              {preview && (
                <div className="protected-image-container mt-4 relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="protected-image w-full max-h-96 object-contain rounded-lg border-2 border-blue-500"
                    onContextMenu={handleContextMenu}
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none',
                      WebkitTouchCallout: 'none',
                      pointerEvents: 'none'
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-transparent rounded-lg"
                    onContextMenu={handleContextMenu}
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTouchCallout: 'none'
                    }}
                  />
                </div>
              )}

              {/* Benefits Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className={`p-3 sm:p-4 rounded-lg border-2 ${isDarkMode ? 'bg-gray-700 border-green-500' : 'bg-green-50 border-green-300'}`}>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-green-500 rounded-full p-1.5 sm:p-2 flex-shrink-0">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-semibold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Earn Money
                      </h4>
                      <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Get 1.5 HSC for every download of your photo
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-3 sm:p-4 rounded-lg border-2 ${isDarkMode ? 'bg-gray-700 border-blue-500' : 'bg-blue-50 border-blue-300'}`}>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-blue-500 rounded-full p-1.5 sm:p-2 flex-shrink-0">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-semibold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        100% Free
                      </h4>
                      <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        No fees to post. Share unlimited photos!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-300'}`}>
                <h4 className={`font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  Tips for Best Results
                </h4>
                <ul className={`text-xs sm:text-sm space-y-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
                  <li>✓ Use high-resolution images (at least 1920x1080)</li>
                  <li>✓ Ensure good lighting and clear focus</li>
                  <li>✓ Capture unique and interesting perspectives</li>
                  <li>✓ Avoid blurry or low-quality photos</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Add Details */}
          {step === 2 && (
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Caption *
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe your memory..."
                  rows={3}
                  maxLength={1000}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <p className={`text-[10px] sm:text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {caption.length}/1000 characters
                </p>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Location Name *
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g., Sigiriya Rock Fortress"
                    className={`w-full pl-9 sm:pl-10 pr-3 py-2 text-sm rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>

              {/* Other Country Checkbox */}
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOtherCountry}
                    onChange={(e) => {
                      setIsOtherCountry(e.target.checked);
                      if (e.target.checked) {
                        setCity('');
                        setProvince('');
                      } else {
                        setCountry('');
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Other Country (Outside Sri Lanka)
                  </span>
                </label>
              </div>

              {/* Country Dropdown - Only show when Other Country is checked */}
              {isOtherCountry && (
                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Select Country *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* City and Province - Only show when NOT Other Country */}
              {!isOtherCountry && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g., Sigiriya"
                      className={`w-full px-3 py-2 text-sm rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Province
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className={`w-full px-3 py-2 text-sm rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">Select Province</option>
                      <option value="Western Province">Western Province</option>
                      <option value="Central Province">Central Province</option>
                      <option value="Southern Province">Southern Province</option>
                      <option value="Northern Province">Northern Province</option>
                      <option value="Eastern Province">Eastern Province</option>
                      <option value="North Western Province">North Western Province</option>
                      <option value="North Central Province">North Central Province</option>
                      <option value="Uva Province">Uva Province</option>
                      <option value="Sabaragamuwa Province">Sabaragamuwa Province</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Google Maps Link with Tip */}
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Google Maps Link
                </label>
                <div className="relative">
                  <LinkIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="url"
                    value={mapLink}
                    onChange={(e) => setMapLink(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className={`w-full pl-9 sm:pl-10 pr-3 py-2 text-sm rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                {/* Google Maps Link Tip */}
                <div className={`mt-2 p-2 rounded-lg text-xs ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                  <p className={`font-medium mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                    💡 How to get Google Maps link:
                  </p>
                  <ol className={`list-decimal list-inside space-y-0.5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    <li>Open Google Maps and search for the location</li>
                    <li>Click "Share" button → "Copy link"</li>
                    <li>Or right-click on the location → "What's here?" → Copy the link from address bar</li>
                  </ol>
                </div>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tags (Maximum 5)
                </label>
                <div className="relative">
                  <Tag className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="#vacation, #beach, #sunset"
                    className={`w-full pl-9 sm:pl-10 pr-3 py-2 text-sm rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                <p className={`text-[10px] sm:text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Separate tags with commas
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center mb-3 sm:mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-3 sm:mb-4">
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Ready to Share?
                </h3>
                <p className={`text-xs sm:text-sm mt-2 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your photo will be available for others to download and you'll earn 1.5 HSC per download.
                </p>
              </div>

              {preview && (
                <div className="protected-image-container relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="protected-image w-full max-h-48 sm:max-h-64 object-contain rounded-lg"
                    onContextMenu={handleContextMenu}
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none',
                      WebkitTouchCallout: 'none',
                      pointerEvents: 'none'
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-transparent rounded-lg"
                    onContextMenu={handleContextMenu}
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTouchCallout: 'none'
                    }}
                  />
                </div>
              )}

              <div className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h4 className={`font-semibold mb-2 text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Summary
                </h4>
                <div className="space-y-1 text-xs sm:text-sm">
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    <strong>Location:</strong> {locationName}
                  </p>
                  {isOtherCountry ? (
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      <strong>Country:</strong> {country || 'Not selected'}
                    </p>
                  ) : (
                    <>
                      {city && (
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          <strong>City:</strong> {city}
                        </p>
                      )}
                      {province && (
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          <strong>Province:</strong> {province}
                        </p>
                      )}
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        <strong>Country:</strong> Sri Lanka
                      </p>
                    </>
                  )}
                  {tags && (
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      <strong>Tags:</strong> {tags}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
            {step > 1 && (
              <button
                onClick={handleBack}
                disabled={uploading}
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className={`${step === 1 ? 'w-full' : 'flex-1'} px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors font-medium"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload & Share</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPhotoModal;

