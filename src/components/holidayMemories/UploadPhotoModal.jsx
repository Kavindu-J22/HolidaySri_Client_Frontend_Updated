import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { X, Upload, MapPin, Tag, Link as LinkIcon, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

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
            city,
            province
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
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`max-w-2xl w-full rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Share Your Memory
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Step 1: Select Image */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer ${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition-colors`}
                >
                  <ImageIcon className="w-5 h-5" />
                  Select Image
                </label>
              </div>

              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                </div>
              )}

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  💰 Earn 1.5 HSC for each download of your photo!
                </p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Users pay 2.5 HSC to download. You earn 1.5 HSC per download.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Add Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Caption *
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe your memory..."
                  rows={3}
                  maxLength={1000}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {caption.length}/1000 characters
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Location Name *
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g., Sigiriya Rock Fortress"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Sigiriya"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
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

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Google Maps Link
                </label>
                <div className="relative">
                  <LinkIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="url"
                    value={mapLink}
                    onChange={(e) => setMapLink(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tags (Maximum 5)
                </label>
                <div className="relative">
                  <Tag className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="#vacation, #beach, #sunset"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Separate tags with commas
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Ready to Share?
                </h3>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your photo will be available for others to download and you'll earn 1.5 HSC per download.
                </p>
              </div>

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-lg"
                />
              )}

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Summary
                </h4>
                <div className="space-y-1 text-sm">
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    <strong>Location:</strong> {locationName}
                  </p>
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
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                onClick={handleBack}
                disabled={uploading}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className={`${step === 1 ? 'w-full' : 'flex-1'} px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload & Share
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

