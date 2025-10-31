import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  AlertCircle,
  Loader,
  MapPin,
  Phone,
  Clock,
  FileText,
  Image as ImageIcon,
  Utensils
} from 'lucide-react';
import SuccessModal from '../components/common/SuccessModal';

const EditCafesRestaurants = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    categoryType: '',
    province: '',
    city: '',
    openTime: '11:00',
    closeTime: '22:00',
    diningOptions: [],
    description: '',
    contact: '',
    website: '',
    facebook: '',
    mapLink: ''
  });

  // Images state
  const [images, setImages] = useState([]);
  const [menuPDF, setMenuPDF] = useState({
    url: '',
    publicId: '',
    fileName: '',
    uploading: false
  });

  // Fetch provinces and cafe data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provinces
        const provincesRes = await fetch('/api/cafes-restaurants/provinces');
        const provincesData = await provincesRes.json();
        if (provincesData.success) {
          setProvincesData(provincesData.data);
        }

        // Fetch cafe data
        const cafeRes = await fetch(`/api/cafes-restaurants/${id}`);
        const cafeData = await cafeRes.json();

        if (cafeData.success) {
          const cafe = cafeData.data;
          setFormData({
            name: cafe.name,
            categoryType: cafe.categoryType,
            province: cafe.location.province,
            city: cafe.location.city,
            openTime: cafe.operatingHours.openTime,
            closeTime: cafe.operatingHours.closeTime,
            diningOptions: cafe.diningOptions,
            description: cafe.description,
            contact: cafe.contact,
            website: cafe.website || '',
            facebook: cafe.facebook || '',
            mapLink: cafe.mapLink || ''
          });
          setImages(cafe.images || []);
          if (cafe.menuPDF) {
            setMenuPDF({
              url: cafe.menuPDF.url,
              publicId: cafe.menuPDF.publicId,
              fileName: cafe.menuPDF.fileName,
              uploading: false
            });
          }
        } else {
          setError(cafeData.message || 'Failed to load cafe data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load cafe data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle dining options checkbox
  const handleDiningOptionChange = (option) => {
    setFormData(prev => ({
      ...prev,
      diningOptions: prev.diningOptions.includes(option)
        ? prev.diningOptions.filter(o => o !== option)
        : [...prev.diningOptions, option]
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

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > 3) {
      setError('Maximum 3 images allowed');
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
          alt: formData.name || 'Restaurant image'
        });
      }
      setImages(prev => [...prev, ...uploadedImages]);
      setError('');
    } catch (error) {
      setError('Failed to upload images');
    }
  };

  // Handle PDF upload
  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Menu must be a PDF file');
      return;
    }

    setMenuPDF(prev => ({ ...prev, uploading: true }));

    try {
      const result = await uploadToCloudinary(file, 'raw');
      setMenuPDF({
        url: result.url,
        publicId: result.publicId,
        fileName: file.name,
        uploading: false
      });
      setError('');
    } catch (error) {
      setError('Failed to upload menu PDF');
      setMenuPDF(prev => ({ ...prev, uploading: false }));
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) return 'Restaurant name is required';
    if (!formData.categoryType.trim()) return 'Category type is required';
    if (!formData.province) return 'Province is required';
    if (!formData.city) return 'City is required';
    if (!formData.openTime) return 'Opening time is required';
    if (!formData.closeTime) return 'Closing time is required';
    if (formData.diningOptions.length === 0) return 'At least one dining option is required';
    if (!formData.description.trim()) return 'Description is required';
    if (formData.description.length > 3000) return 'Description must be less than 3000 characters';
    if (!formData.contact.trim()) return 'Contact number is required';
    if (images.length === 0) return 'At least one image is required';
    if (images.length > 3) return 'Maximum 3 images allowed';
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

    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/cafes-restaurants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          images,
          menuPDF: menuPDF.url ? menuPDF : null
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Failed to update cafe/restaurant');
      }
    } catch (error) {
      console.error('Error updating cafe/restaurant:', error);
      setError('Failed to update cafe/restaurant. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle success modal close
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/profile', { state: { activeSection: 'advertisements' } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const diningOptions = ['Dine-in', 'Outdoor Seating', 'Delivery', 'Takeaway', 'Catering'];
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
              Edit Cafe & Restaurant
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update your restaurant details
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

        {/* Form - Will continue in next part */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Utensils className="w-5 h-5" />
              <span>Basic Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter restaurant name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Type *
                </label>
                <input
                  type="text"
                  name="categoryType"
                  value={formData.categoryType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Seafood, Italian, Asian"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Location</span>
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

          {/* Operating Hours */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Operating Hours</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opening Time *
                </label>
                <input
                  type="time"
                  name="openTime"
                  value={formData.openTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Closing Time *
                </label>
                <input
                  type="time"
                  name="closeTime"
                  value={formData.closeTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Dining Options */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Dining Options *
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diningOptions.map(option => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.diningOptions.includes(option)}
                    onChange={() => handleDiningOptionChange(option)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Description *
            </h2>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe your restaurant, specialties, ambiance, etc."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {formData.description.length}/3000 characters
            </p>
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
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter contact number"
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
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Maps Link
                </label>
                <input
                  type="url"
                  name="mapLink"
                  value={formData.mapLink}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </div>

          {/* Images Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <ImageIcon className="w-5 h-5" />
              <span>Restaurant Images * (Max 3)</span>
            </h2>

            <div className="mb-4">
              <label className="block px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">Click to upload images</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={images.length >= 3}
                />
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img.url} alt={`Restaurant ${idx + 1}`} className="w-full h-40 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {images.length}/3 images uploaded
            </p>
          </div>

          {/* Menu PDF Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Menu PDF (Optional)</span>
            </h2>

            <label className="block px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <div className="text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Click to upload menu PDF</p>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={handlePDFUpload}
                className="hidden"
                disabled={menuPDF.uploading}
              />
            </label>

            {menuPDF.url && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-between">
                <span className="text-green-800 dark:text-green-200">{menuPDF.fileName}</span>
                <button
                  type="button"
                  onClick={() => setMenuPDF({ url: '', publicId: '', fileName: '', uploading: false })}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Success!"
        message="Your cafe/restaurant has been updated successfully!"
        redirectText="Back to My Advertisements"
      />
    </div>
  );
};

export default EditCafesRestaurants;

