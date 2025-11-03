import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  AlertCircle,
  Loader,
  MapPin,
  Phone,
  Image as ImageIcon,
  DollarSign,
  CheckCircle,
  Link as LinkIcon
} from 'lucide-react';
import SuccessModal from '../components/common/SuccessModal';

const EditSouvenirsCollectiblesForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    category: '',
    description: '',
    province: '',
    city: '',
    contact: {
      phone: '',
      email: ''
    },
    price: '',
    available: true,
    includes: [],
    website: '',
    facebook: ''
  });

  // Images state
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [includeInput, setIncludeInput] = useState('');

  // Fetch provinces and souvenirs & collectibles data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provinces
        const provincesRes = await fetch('/api/souvenirs-collectibles/provinces');
        const provincesData = await provincesRes.json();
        if (provincesData.success) {
          setProvincesData(provincesData.data);
        }

        // Fetch souvenirs & collectibles data
        const souvenirsRes = await fetch(`/api/souvenirs-collectibles/${id}`);
        const souvenirsData = await souvenirsRes.json();

        if (souvenirsData.success) {
          const sc = souvenirsData.data;
          setFormData({
            name: sc.name,
            specialization: sc.specialization,
            category: sc.category,
            description: sc.description,
            province: sc.location.province,
            city: sc.location.city,
            contact: {
              phone: sc.contact.phone,
              email: sc.contact.email
            },
            price: sc.price.toString(),
            available: sc.available,
            includes: sc.includes || [],
            website: sc.website || '',
            facebook: sc.facebook || ''
          });
          setImages(sc.images);
        } else {
          setError('Failed to load souvenirs & collectibles data');
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

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    
    if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: inputType === 'checkbox' ? checked : value
      }));
    }
  };

  // Add include item
  const addInclude = () => {
    if (includeInput.trim() && formData.includes.length < 10) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, includeInput.trim()]
      }));
      setIncludeInput('');
    }
  };

  // Remove include item
  const removeInclude = (index) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

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

    if (images.length + newImages.length + files.length > 4) {
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
        const result = await uploadToCloudinary(file);
        uploadedImages.push({
          url: result.url,
          publicId: result.publicId,
          alt: formData.name || 'Souvenir image'
        });
      }
      setNewImages(prev => [...prev, ...uploadedImages]);
      setError('');
    } catch (error) {
      setError('Failed to upload images');
    }
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove new image
  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.specialization.trim()) return 'Specialization is required';
    if (!formData.category.trim()) return 'Category is required';
    if (!formData.description.trim()) return 'Description is required';
    if (formData.description.length > 3000) return 'Description must be less than 3000 characters';
    if (!formData.province) return 'Province is required';
    if (!formData.city) return 'City is required';
    if (!formData.contact.phone.trim()) return 'Phone number is required';
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    if (!phoneRegex.test(formData.contact.phone.trim())) return 'Please enter a valid phone number';
    if (!formData.contact.email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact.email.trim())) return 'Please enter a valid email';
    if (!formData.price || parseFloat(formData.price) <= 0) return 'Price must be greater than 0';
    if (images.length + newImages.length === 0) return 'At least one image is required';
    if (images.length + newImages.length > 4) return 'Maximum 4 images allowed';
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

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/souvenirs-collectibles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          images: [...images, ...newImages]
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Failed to update souvenirs & collectibles');
      }
    } catch (error) {
      console.error('Error updating souvenirs & collectibles:', error);
      setError('Failed to update souvenirs & collectibles. Please try again.');
    } finally {
      setSubmitting(false);
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
              Edit Souvenirs & Collectibles
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update your souvenirs and collectibles listing
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
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialization *
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Traditional Art"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Handicrafts"
                />
              </div>
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
              placeholder="Describe your souvenir..."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {formData.description.length}/3000 characters
            </p>
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

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website (Optional)
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
                  Facebook (Optional)
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Facebook profile URL"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Availability */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Pricing & Availability</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter price"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Currently Available</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Includes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              What's Included (Optional)
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={includeInput}
                onChange={(e) => setIncludeInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Certificate of Authenticity"
              />
              <button
                type="button"
                onClick={addInclude}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>

            {formData.includes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.includes.map((item, index) => (
                  <div key={index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full flex items-center gap-2">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeInclude(index)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <ImageIcon className="w-5 h-5" />
              <span>Product Images (Maximum 4) *</span>
            </h2>

            <div className="mb-6">
              <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload images or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Existing Images */}
            {images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Current Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {newImages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  New Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {newImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-40 object-cover rounded-lg border-2 border-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Listing</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          title="Souvenirs & Collectibles Updated Successfully!"
          message="Your souvenirs & collectibles listing has been updated. Changes are now live."
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
};

export default EditSouvenirsCollectiblesForm;

