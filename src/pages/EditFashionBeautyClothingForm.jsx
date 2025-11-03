import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditFashionBeautyClothingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

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

  const specializationOptions = ['Men', 'Women', 'Kids', 'Unisex', 'Teens', 'Babies'];
  const categoryOptions = [
    'Jackets', 'Dresses', 'Shoes', 'Accessories', 'Shirts', 'Pants',
    'Skirts', 'Sweaters', 'Coats', 'Bags', 'Belts', 'Scarves', 'Hats',
    'Gloves', 'Socks', 'Underwear', 'Swimwear', 'Activewear',
    'Formal Wear', 'Casual Wear'
  ];

  const paymentMethodOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'cards', label: 'Cards' },
    { value: 'koko', label: 'Koko' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'online_payment', label: 'Online Payment' }
  ];

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

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/fashion-beauty-clothing/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const item = response.data.data;
        setFormData({
          name: item.name,
          specialization: item.specialization,
          category: item.category,
          description: item.description,
          price: item.price,
          city: item.city,
          province: item.province,
          paymentMethods: item.paymentMethods,
          deliveryAvailable: item.deliveryAvailable,
          contact: item.contact,
          facebook: item.facebook || '',
          website: item.website || '',
          available: item.available
        });
        setImages(item.images);
        setLoading(false);
      } catch (err) {
        setError('Failed to load item details');
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const uploadToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');
    formDataUpload.append('cloud_name', 'daa9e83as');

    const response = await fetch(`https://api.cloudinary.com/v1_1/daa9e83as/image/upload`, {
      method: 'POST',
      body: formDataUpload
    });

    const data = await response.json();
    return { url: data.secure_url, publicId: data.public_id };
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const totalImages = images.length + newImages.length + files.length;

    if (totalImages > 3) {
      setError('Maximum 3 images allowed');
      return;
    }

    try {
      const uploadedImages = await Promise.all(files.map(file => uploadToCloudinary(file)));
      setNewImages([...newImages, ...uploadedImages]);
      setError('');
    } catch (err) {
      setError('Failed to upload images');
    }
  };

  const removeImage = (index, isNew = false) => {
    if (isNew) {
      setNewImages(newImages.filter((_, i) => i !== index));
    } else {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const allImages = [...images, ...newImages];

      if (allImages.length === 0) {
        setError('At least one image is required');
        setSubmitting(false);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/fashion-beauty-clothing/${id}`, {
        ...formData,
        images: allImages
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/profile', { state: { tab: 'advertisements' } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Edit Fashion Beauty & Clothing</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg">
              Item updated successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name/Business Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specialization *
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Specialization</option>
                {specializationOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>
                {categoryOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                maxLength="2000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.description.length}/2000</p>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (LKR) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Province and City */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Province *
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Province</option>
                  {Object.keys(provincesAndDistricts).map(prov => (
                    <option key={prov} value={prov}>{prov}</option>
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
                  onChange={handleChange}
                  required
                  disabled={!formData.province}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  <option value="">Select City</option>
                  {formData.province && provincesAndDistricts[formData.province].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Payment Methods *
              </label>
              <div className="space-y-2">
                {paymentMethodOptions.map(method => (
                  <label key={method.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.paymentMethods.includes(method.value)}
                      onChange={() => handlePaymentMethodChange(method.value)}
                      className="w-4 h-4 text-blue-500 rounded"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery Available */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="deliveryAvailable"
                checked={formData.deliveryAvailable}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <label className="ml-2 text-gray-700 dark:text-gray-300">Delivery Available</label>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact *
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Facebook (Optional)
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website (Optional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Available */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <label className="ml-2 text-gray-700 dark:text-gray-300">Available</label>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Images (Max 3) *
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <p className="text-gray-600 dark:text-gray-400">Click to upload images</p>
                </label>
              </div>

              {/* Existing Images */}
              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Existing Images:</p>
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img.url} alt="preview" className="w-full h-32 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx, false)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Images:</p>
                  <div className="grid grid-cols-3 gap-4">
                    {newImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img.url} alt="preview" className="w-full h-32 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx, true)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Item'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile', { state: { tab: 'advertisements' } })}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFashionBeautyClothingForm;

