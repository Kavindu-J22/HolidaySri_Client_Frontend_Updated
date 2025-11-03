import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader, Upload, X, Check } from 'lucide-react';

const FashionBeautyClothingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const advertisementId = location.state?.advertisementId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [provincesData, setProvincesData] = useState({});

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

  const specializationOptions = ['Men', 'Women', 'Kids', 'Unisex', 'Teens', 'Babies'];
  const categoryOptions = ['Jackets', 'Dresses', 'Shoes', 'Accessories', 'Shirts', 'Pants', 'Skirts', 'Sweaters', 'Coats', 'Bags', 'Belts', 'Scarves', 'Hats', 'Gloves', 'Socks', 'Underwear', 'Swimwear', 'Activewear', 'Formal Wear', 'Casual Wear'];
  const paymentMethodOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'cards', label: 'Cards' },
    { value: 'koko', label: 'Koko' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'online_payment', label: 'Online Payment' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    category: '',
    description: '',
    price: '',
    city: '',
    province: '',
    paymentMethods: [],
    deliveryAvailable: false,
    contact: '',
    facebook: '',
    website: '',
    available: true
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    setProvincesData(provincesAndDistricts);
  }, []);

  // Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');
    formDataUpload.append('cloud_name', 'daa9e83as');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/daa9e83as/image/upload`,
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
    
    if (images.length + files.length > 3) {
      setError('Maximum 3 images allowed');
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be less than 5MB');
        return;
      }

      try {
        setError('');
        const uploadedImage = await uploadToCloudinary(file);
        setImages(prev => [...prev, uploadedImage]);
      } catch (err) {
        setError('Failed to upload image. Please try again.');
      }
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method]
    }));
  };

  // Handle province change
  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setFormData(prev => ({
      ...prev,
      province,
      city: '' // Reset city when province changes
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.specialization) {
      setError('Specialization is required');
      return;
    }

    if (!formData.category) {
      setError('Category is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      setError('Valid price is required');
      return;
    }

    if (!formData.province) {
      setError('Province is required');
      return;
    }

    if (!formData.city) {
      setError('City is required');
      return;
    }

    if (formData.paymentMethods.length === 0) {
      setError('At least one payment method is required');
      return;
    }

    if (!formData.contact.trim()) {
      setError('Contact information is required');
      return;
    }

    if (images.length === 0) {
      setError('At least one image is required');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/fashion-beauty-clothing/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          advertisementId,
          ...formData,
          price: parseFloat(formData.price),
          images
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Fashion Beauty & Clothing
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Publish your fashion, beauty, and clothing products
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your name or business name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Specialization *
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Specialization</option>
                {specializationOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>
                {categoryOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
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
                placeholder="Describe your products in detail"
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Price (LKR) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price in LKR"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Province and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Province *
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleProvinceChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Province</option>
                  {Object.keys(provincesData).map(province => (
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
                  disabled={!formData.province}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  <option value="">Select City</option>
                  {formData.province && provincesData[formData.province]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Payment Methods *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {paymentMethodOptions.map(method => (
                  <label key={method.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.paymentMethods.includes(method.value)}
                      onChange={() => handlePaymentMethodChange(method.value)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery Available */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="deliveryAvailable"
                checked={formData.deliveryAvailable}
                onChange={handleInputChange}
                className="w-4 h-4 rounded"
              />
              <label className="text-gray-700 dark:text-gray-300">
                Delivery Available
              </label>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Contact Information *
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="Phone number or contact details"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
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
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Available */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleInputChange}
                className="w-4 h-4 rounded"
              />
              <label className="text-gray-700 dark:text-gray-300">
                Currently Available
              </label>
            </div>

            {/* Images Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Images (Maximum 3) *
              </label>
              
              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Area */}
              {images.length < 3 && (
                <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload images
                    </span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish Now'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
                className="px-6 py-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Success!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your fashion beauty clothing profile has been published successfully!
            </p>
            <button
              onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Back to My Advertisements
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FashionBeautyClothingForm;

