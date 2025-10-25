import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Upload, X, Plus, Trash2, Loader } from 'lucide-react';
import SuccessModal from '../components/common/SuccessModal';

const EditLocalTourPackage = () => {
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
    title: '',
    categoryType: 'local_tour_packages',
    adventureType: '',
    location: {
      province: '',
      city: ''
    },
    description: '',
    pax: {
      min: '',
      max: ''
    },
    availableDates: [],
    includes: [],
    price: {
      amount: '',
      currency: 'LKR'
    },
    provider: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.contactNumber || ''
    },
    facebook: '',
    website: ''
  });

  const [images, setImages] = useState([]);
  const [currentInclude, setCurrentInclude] = useState('');

  // Fetch provinces and package data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provinces
        const provincesRes = await fetch('/api/local-tour-package/provinces');
        const provincesData = await provincesRes.json();
        if (provincesData.success) {
          setProvincesData(provincesData.data);
        }

        // Fetch package data
        const packageRes = await fetch(`/api/local-tour-package/${id}`);
        const packageData = await packageRes.json();
        
        if (packageData.success) {
          const pkg = packageData.data;
          setFormData({
            title: pkg.title,
            categoryType: pkg.categoryType,
            adventureType: pkg.adventureType,
            location: pkg.location,
            description: pkg.description,
            pax: pkg.pax,
            availableDates: pkg.availableDates.map(d => d.split('T')[0]),
            includes: pkg.includes,
            price: pkg.price,
            provider: pkg.provider,
            facebook: pkg.facebook || '',
            website: pkg.website || ''
          });
          setImages(pkg.images);
        } else {
          setError('Failed to load package data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load package data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', 'ml_default');
      formDataUpload.append('cloud_name', 'daa9e83as');

      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/daa9e83as/image/upload', {
          method: 'POST',
          body: formDataUpload
        });

        const data = await response.json();
        if (data.secure_url) {
          setImages(prev => [...prev, {
            url: data.secure_url,
            publicId: data.public_id,
            alt: formData.title
          }]);
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        setError('Failed to upload image');
      }
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Add include
  const addInclude = () => {
    if (currentInclude.trim()) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, currentInclude.trim()]
      }));
      setCurrentInclude('');
    }
  };

  // Remove include
  const removeInclude = (index) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  // Generate next 7 days
  const getNext7Days = () => {
    const days = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayName = dayNames[date.getDay()];
      const dateStr = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      days.push({
        dayName,
        dateStr,
        displayDate,
        fullDate: `${dayName}, ${displayDate}`
      });
    }
    return days;
  };

  // Toggle available date
  const toggleDate = (dateStr) => {
    setFormData(prev => {
      const exists = prev.availableDates.includes(dateStr);
      if (exists) {
        return {
          ...prev,
          availableDates: prev.availableDates.filter(d => d !== dateStr)
        };
      } else {
        return {
          ...prev,
          availableDates: [...prev.availableDates, dateStr]
        };
      }
    });
  };

  // Generate next 7 days
  const getNext7Days = () => {
    const days = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayName = dayNames[date.getDay()];
      const dateStr = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      days.push({
        dayName,
        dateStr,
        displayDate,
        fullDate: `${dayName}, ${displayDate}`
      });
    }
    return days;
  };

  // Toggle available date
  const toggleDate = (dateStr) => {
    setFormData(prev => {
      const exists = prev.availableDates.includes(dateStr);
      if (exists) {
        return {
          ...prev,
          availableDates: prev.availableDates.filter(d => d !== dateStr)
        };
      } else {
        return {
          ...prev,
          availableDates: [...prev.availableDates, dateStr]
        };
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.adventureType || !formData.location.province || 
        !formData.location.city || !formData.description || images.length === 0 ||
        !formData.pax.min || !formData.pax.max || formData.availableDates.length === 0 ||
        !formData.price.amount || !formData.provider.name || !formData.provider.email || 
        !formData.provider.phone) {
      setError('Please fill in all required fields');
      return;
    }

    if (images.length < 1 || images.length > 4) {
      setError('Please upload between 1 and 4 images');
      return;
    }

    if (parseInt(formData.pax.min) > parseInt(formData.pax.max)) {
      setError('Minimum pax cannot be greater than maximum pax');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/local-tour-package/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          images,
          pax: {
            min: parseInt(formData.pax.min),
            max: parseInt(formData.pax.max)
          },
          price: {
            amount: parseFloat(formData.price.amount),
            currency: formData.price.currency
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Failed to update local tour package');
      }
    } catch (error) {
      console.error('Error updating local tour package:', error);
      setError('Failed to update local tour package. Please try again.');
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

  const availableCities = formData.location.province ? provincesData[formData.location.province] || [] : [];

  const adventureTypes = [
    'Beach', 'Mountain', 'Cultural', 'Wildlife', 'Adventure Sports',
    'Historical', 'Religious', 'Nature', 'Urban', 'Eco-Tourism',
    'Food & Culinary', 'Photography'
  ];

  const adventureTypes = [
    'Beach', 'Mountain', 'Cultural', 'Wildlife', 'Adventure Sports',
    'Historical', 'Religious', 'Nature', 'Urban', 'Eco-Tourism',
    'Food & Culinary', 'Photography'
  ];

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
              Edit Local Tour Package
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update your tour package details
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Form - Similar to LocalTourPackageForm but with PUT method */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Package Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., 3-Day Kandy Cultural Tour"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adventure Type *
                </label>
                <select
                  name="adventureType"
                  value={formData.adventureType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Type</option>
                  {adventureTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Province *
                </label>
                <select
                  name="location.province"
                  value={formData.location.province}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Province</option>
                  {Object.keys(provincesData).map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City *
              </label>
              <select
                name="location.city"
                value={formData.location.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select City</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your tour package in detail..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Images (Max 4) *</h2>

            <div className="mb-4">
              <label className="block px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload images</span>
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image.url} alt={`Package ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Capacity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pricing & Capacity</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Pax *
                </label>
                <input
                  type="number"
                  name="pax.min"
                  value={formData.pax.min}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Pax *
                </label>
                <input
                  type="number"
                  name="pax.max"
                  value={formData.pax.max}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  name="price.amount"
                  value={formData.price.amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Available Dates */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Available Dates *</h2>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Select available days for your tour:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {getNext7Days().map((day) => (
                  <button
                    key={day.dateStr}
                    type="button"
                    onClick={() => toggleDate(day.dateStr)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      formData.availableDates.includes(day.dateStr)
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-green-400'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {day.dayName}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {day.displayDate}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Dates Summary */}
            {formData.availableDates.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                  Selected Dates ({formData.availableDates.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.availableDates.map((date) => {
                    const dateObj = new Date(date);
                    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dateObj.getDay()];
                    const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    return (
                      <span
                        key={date}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                      >
                        {dayName}, {displayDate}
                        <button
                          type="button"
                          onClick={() => toggleDate(date)}
                          className="ml-1 hover:text-green-600 dark:hover:text-green-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Includes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What's Included</h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentInclude}
                onChange={(e) => setCurrentInclude(e.target.value)}
                placeholder="e.g., Meals, Transportation, Guide"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={addInclude}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.includes.map((include, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="text-gray-900 dark:text-white">{include}</span>
                  <button
                    type="button"
                    onClick={() => removeInclude(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Provider Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Provider Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="provider.name"
                value={formData.provider.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="provider.email"
                  value={formData.provider.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="provider.phone"
                  value={formData.provider.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
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
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessClose}
          title="Success!"
          message="Your local tour package has been updated successfully!"
        />
      )}
    </div>
  );
};

export default EditLocalTourPackage;

