import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  AlertCircle,
  Loader,
  MapPin,
  Phone,
  FileText,
  Image as ImageIcon,
  Globe,
  Facebook,
  Plus,
  X
} from 'lucide-react';
import { vehicleRepairsMechanicsAPI } from '../config/api';
import SuccessModal from '../components/common/SuccessModal';

const EditVehicleRepairsMechanicsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});
  const [profileData, setProfileData] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    category: '',
    description: '',
    experience: '',
    province: '',
    city: '',
    available: true,
    contact: '',
    website: '',
    facebook: ''
  });

  const [availability, setAvailability] = useState({
    weekdays: '',
    weekends: ''
  });

  const [services, setServices] = useState([]);
  const [serviceInput, setServiceInput] = useState('');
  const [images, setImages] = useState({
    avatar: { url: '', publicId: '' },
    gallery: []
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch provinces and profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [provincesRes, profileRes] = await Promise.all([
          vehicleRepairsMechanicsAPI.getProvinces(),
          vehicleRepairsMechanicsAPI.getMechanicProfile(id)
        ]);

        if (provincesRes.data && provincesRes.data.data) {
          setProvincesData(provincesRes.data.data);
        }

        if (profileRes.data && profileRes.data.data) {
          const profile = profileRes.data.data;
          setProfileData(profile);
          setFormData({
            name: profile.name || '',
            specialization: profile.specialization || '',
            category: profile.category || '',
            description: profile.description || '',
            experience: profile.experience || '',
            province: profile.location?.province || '',
            city: profile.location?.city || '',
            available: profile.available !== undefined ? profile.available : true,
            contact: profile.contact || '',
            website: profile.website || '',
            facebook: profile.facebook || ''
          });
          setAvailability(profile.availability || { weekdays: '', weekends: '' });
          setServices(profile.services || []);
          if (profile.avatar && profile.avatar.url) {
            setImages(prev => ({
              ...prev,
              avatar: profile.avatar
            }));
          }
          if (profile.images && Array.isArray(profile.images)) {
            setImages(prev => ({
              ...prev,
              gallery: profile.images
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e, type = 'avatar') => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', 'ml_default');

      const response = await fetch('https://api.cloudinary.com/v1_1/daa9e83as/image/upload', {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();

      if (data.secure_url) {
        if (type === 'avatar') {
          setImages(prev => ({
            ...prev,
            avatar: {
              url: data.secure_url,
              publicId: data.public_id
            }
          }));
        } else if (type === 'gallery') {
          if (images.gallery.length < 4) {
            setImages(prev => ({
              ...prev,
              gallery: [...prev.gallery, {
                url: data.secure_url,
                publicId: data.public_id,
                alt: ''
              }]
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    setImages(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  // Add service
  const addService = () => {
    if (serviceInput.trim() && services.length < 10) {
      setServices([...services, serviceInput.trim()]);
      setServiceInput('');
    }
  };

  // Remove service
  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.specialization || !formData.category ||
        !formData.description || !formData.province || !formData.city || !formData.contact ||
        services.length === 0 || images.gallery.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.experience < 0 || formData.experience > 70) {
      setError('Experience must be between 0 and 70 years');
      return;
    }

    try {
      setSubmitting(true);
      const response = await vehicleRepairsMechanicsAPI.updateProfile(id, {
        name: formData.name,
        specialization: formData.specialization,
        category: formData.category,
        description: formData.description,
        experience: parseInt(formData.experience),
        city: formData.city,
        province: formData.province,
        contact: formData.contact,
        available: formData.available,
        facebook: formData.facebook || null,
        website: formData.website || null,
        availability,
        services,
        images: images.gallery,
        avatar: images.avatar
      });

      if (response.data && response.data.success) {
        setShowSuccessModal(true);
      } else {
        setError(response.data?.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/profile?tab=advertisements');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/profile?tab=advertisements')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Vehicle Repairs & Mechanics Profile</h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h2>
            
            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Your full name"
              />
            </div>

            {/* Experience */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                min="0"
                max="70"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>

            {/* Avatar Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture *
              </label>
              <div className="flex items-center space-x-4">
                {images.avatar.url && (
                  <img src={images.avatar.url} alt="Avatar" className="w-20 h-20 rounded-lg object-cover" />
                )}
                <label className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'avatar')}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {uploadingImage ? 'Uploading...' : 'Click to upload'}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Professional Details Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Professional Details</h2>
            
            {/* Specialization */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specialization (e.g., Engine Repair, Transmission) *
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Engine Repair, Transmission, Brake System"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category (e.g., General Mechanic) *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="General Mechanic, Specialist, Certified Technician"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe your services and expertise..."
              />
            </div>

            {/* Services */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Services (Add up to 10) *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Engine Diagnostics"
                />
                <button
                  type="button"
                  onClick={addService}
                  disabled={services.length >= 10}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                    <span className="text-sm text-blue-900 dark:text-blue-100">{service}</span>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-blue-600 dark:text-blue-300 hover:text-blue-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location & Contact Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Location & Contact</h2>
            
            {/* Province */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Province *
              </label>
              <select
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value, city: '' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Province</option>
                {Object.keys(provincesData).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select City</option>
                {formData.province && provincesData[formData.province]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Contact */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="+94 71 234 5678"
              />
            </div>

            {/* Website */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com"
              />
            </div>

            {/* Facebook */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://facebook.com/example"
              />
            </div>
          </div>

          {/* Availability Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Availability</h2>
            
            {/* Weekdays */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weekdays Availability
              </label>
              <input
                type="text"
                value={availability.weekdays}
                onChange={(e) => setAvailability({ ...availability, weekdays: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 8:00 AM - 6:00 PM"
              />
            </div>

            {/* Weekends */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weekends Availability
              </label>
              <input
                type="text"
                value={availability.weekends}
                onChange={(e) => setAvailability({ ...availability, weekends: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 9:00 AM - 3:00 PM"
              />
            </div>

            {/* Available */}
            <div className="mb-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-gray-700 dark:text-gray-300">Currently Available</span>
              </label>
            </div>
          </div>

          {/* Gallery Images Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Gallery Images (1-4) *</h2>
            
            {/* Upload Button */}
            {images.gallery.length < 4 && (
              <label className="block mb-6 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'gallery')}
                  disabled={uploadingImage}
                  className="hidden"
                />
                <div className="flex items-center justify-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {uploadingImage ? 'Uploading...' : `Click to upload (${images.gallery.length}/4)`}
                  </span>
                </div>
              </label>
            )}

            {/* Gallery Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.gallery.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image.url} alt={`Gallery ${index + 1}`} className="w-full h-32 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Update Profile</span>
            )}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          title="Profile Updated!"
          message="Your vehicle repairs & mechanics profile has been updated successfully."
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
};

export default EditVehicleRepairsMechanicsForm;

