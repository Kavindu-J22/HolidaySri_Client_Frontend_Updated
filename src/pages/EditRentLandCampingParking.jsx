import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  Plus,
  Loader,
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone,
  Globe,
  Facebook,
  Clock,
  DollarSign,
  Wifi
} from 'lucide-react';
import axios from 'axios';
import SuccessModal from '../components/common/SuccessModal';

const EditRentLandCampingParking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    province: '',
    city: '',
    nearby: [],
    activities: [],
    includes: [],
    contact: '',
    website: '',
    facebook: '',
    available: true,
    price: '',
    weekendPrice: '',
    availability: {
      weekdays: true,
      weekends: true,
      time: '8:00 AM - 8:00 PM'
    },
    mapLink: ''
  });

  const [images, setImages] = useState([]);
  const [provinces, setProvinces] = useState({});
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newItem, setNewItem] = useState({
    nearby: '',
    activities: '',
    includes: ''
  });

  // Fetch provinces and listing data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provinces
        const provincesRes = await axios.get('/api/rent-land-camping-parking/provinces');
        setProvinces(provincesRes.data.data);

        // Fetch listing data
        const listingRes = await axios.get(`/api/rent-land-camping-parking/${id}`);
        const listing = listingRes.data.data;

        setFormData({
          title: listing.title,
          description: listing.description,
          category: listing.category,
          province: listing.location.province,
          city: listing.location.city,
          nearby: listing.nearby || [],
          activities: listing.activities || [],
          includes: listing.includes || [],
          contact: listing.contact,
          website: listing.website || '',
          facebook: listing.facebook || '',
          available: listing.available,
          price: listing.price,
          weekendPrice: listing.weekendPrice,
          availability: listing.availability || {
            weekdays: true,
            weekends: true,
            time: '8:00 AM - 8:00 PM'
          },
          mapLink: listing.mapLink || ''
        });

        setImages(listing.images || []);
        
        // Set cities based on province
        if (listing.location.province && provincesRes.data.data[listing.location.province]) {
          setCities(provincesRes.data.data[listing.location.province]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load listing data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Update cities when province changes
  useEffect(() => {
    if (formData.province && provinces[formData.province]) {
      setCities(provinces[formData.province]);
      setFormData(prev => ({ ...prev, city: '' }));
    }
  }, [formData.province, provinces]);

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 4) {
      setError('Maximum 4 images allowed');
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        const formDataCloud = new FormData();
        formDataCloud.append('file', file);
        formDataCloud.append('upload_preset', 'ml_default');
        formDataCloud.append('cloud_name', 'daa9e83as');

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
          formDataCloud
        );

        setImages(prev => [...prev, {
          url: response.data.secure_url,
          publicId: response.data.public_id,
          alt: formData.title || 'Rent Land Camping Parking'
        }]);
      }
      setError('');
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Add item to array fields
  const addItem = (field) => {
    if (newItem[field].trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], newItem[field].trim()]
      }));
      setNewItem(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Remove item from array fields
  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('availability.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.category.trim()) return 'Category is required';
    if (!formData.province) return 'Province is required';
    if (!formData.city) return 'City is required';
    if (!formData.contact.trim()) return 'Contact number is required';
    if (!/^\+?[0-9\s\-\(\)]{7,20}$/.test(formData.contact)) return 'Invalid contact number format';
    if (images.length === 0) return 'At least 1 image is required';
    if (images.length > 4) return 'Maximum 4 images allowed';
    if (!formData.price || formData.price < 0) return 'Valid price is required';
    if (!formData.weekendPrice || formData.weekendPrice < 0) return 'Valid weekend price is required';
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
      const response = await axios.put(
        `/api/rent-land-camping-parking/${id}`,
        {
          ...formData,
          images,
          price: parseFloat(formData.price),
          weekendPrice: parseFloat(formData.weekendPrice)
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/my-advertisements');
        }, 3000);
      }
    } catch (err) {
      console.error('Error updating:', err);
      setError(err.response?.data?.message || 'Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Rent Land Camping & Parking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your camping or parking space details
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Success Modal */}
        <SuccessModal
          isOpen={success}
          title="Updated Successfully!"
          message="Your rent land camping & parking listing has been updated successfully. Redirecting to My Advertisements..."
          onClose={() => navigate('/my-advertisements')}
        />

        {/* Form - Will be continued in next part */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  maxLength="200"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength="3000"
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  maxLength="100"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Province *
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Province</option>
                  {Object.keys(provinces).map(province => (
                    <option key={province} value={province}>
                      {province}
                    </option>
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Images (1-4 required) *
            </h2>
            
            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            {images.length < 4 && (
              <label className="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400 font-semibold">
                  {uploading ? 'Uploading...' : 'Click to upload images'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Max 4MB per image. {images.length}/4 uploaded
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Facebook (Optional)
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Pricing (LKR)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Daily Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Weekend Price *
                </label>
                <input
                  type="number"
                  name="weekendPrice"
                  value={formData.weekendPrice}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Availability
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="availability.weekdays"
                    checked={formData.availability.weekdays}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Available on Weekdays</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="availability.weekends"
                    checked={formData.availability.weekends}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Available on Weekends</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Operating Hours
                </label>
                <input
                  type="text"
                  name="availability.time"
                  value={formData.availability.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Amenities & Features
            </h2>

            {/* Nearby Attractions */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nearby Attractions
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newItem.nearby}
                  onChange={(e) => setNewItem(prev => ({ ...prev, nearby: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => addItem('nearby')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.nearby.map((item, index) => (
                  <div key={index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center gap-2">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem('nearby', index)}
                      className="hover:text-blue-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Activities
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newItem.activities}
                  onChange={(e) => setNewItem(prev => ({ ...prev, activities: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => addItem('activities')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.activities.map((item, index) => (
                  <div key={index} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full flex items-center gap-2">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem('activities', index)}
                      className="hover:text-green-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Includes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                What's Included
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newItem.includes}
                  onChange={(e) => setNewItem(prev => ({ ...prev, includes: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => addItem('includes')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.includes.map((item, index) => (
                  <div key={index} className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full flex items-center gap-2">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem('includes', index)}
                      className="hover:text-purple-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Additional Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Google Map Link (Optional)
                </label>
                <input
                  type="url"
                  name="mapLink"
                  value={formData.mapLink}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Currently Available</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/my-advertisements')}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRentLandCampingParking;

