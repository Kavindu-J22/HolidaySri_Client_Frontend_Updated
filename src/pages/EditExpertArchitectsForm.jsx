import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Upload, X, Loader } from 'lucide-react';

const EditExpertArchitectsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    category: '',
    description: '',
    experience: '',
    city: '',
    province: '',
    contact: '',
    available: true,
    facebook: '',
    website: ''
  });

  // Availability state
  const [availability, setAvailability] = useState({
    weekdays: '',
    weekends: ''
  });

  // Image state
  const [images, setImages] = useState({
    avatar: { url: '', publicId: '', uploading: false },
    gallery: []
  });

  // Provinces and districts
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

  // Fetch expert architect data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/expert-architects/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        const architect = data.data;

        setFormData({
          name: architect.name || '',
          specialization: architect.specialization || '',
          category: architect.category || '',
          description: architect.description || '',
          experience: architect.experience || '',
          city: architect.city || '',
          province: architect.province || '',
          contact: architect.contact || '',
          available: architect.available || true,
          facebook: architect.facebook || '',
          website: architect.website || ''
        });

        setAvailability({
          weekdays: architect.availability?.weekdays || '',
          weekends: architect.availability?.weekends || ''
        });

        setImages({
          avatar: {
            url: architect.avatar?.url || '',
            publicId: architect.avatar?.publicId || '',
            uploading: false
          },
          gallery: architect.images || []
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');
    formDataUpload.append('cloud_name', 'daa9e83as');

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
      { method: 'POST', body: formDataUpload }
    );

    const data = await response.json();
    return { url: data.secure_url, publicId: data.public_id };
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImages(prev => ({
      ...prev,
      avatar: { ...prev.avatar, uploading: true }
    }));

    try {
      const uploadedImage = await uploadToCloudinary(file);
      setImages(prev => ({
        ...prev,
        avatar: { ...uploadedImage, uploading: false }
      }));
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Failed to upload avatar');
      setImages(prev => ({
        ...prev,
        avatar: { ...prev.avatar, uploading: false }
      }));
    }
  };

  // Handle gallery upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (images.gallery.length + files.length > 4) {
      setError('Maximum 4 images allowed');
      return;
    }

    try {
      for (const file of files) {
        const uploadedImage = await uploadToCloudinary(file);
        setImages(prev => ({
          ...prev,
          gallery: [...prev.gallery, uploadedImage]
        }));
      }
    } catch (err) {
      console.error('Error uploading gallery:', err);
      setError('Failed to upload gallery images');
    }
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    setImages(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle availability change
  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setAvailability(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/expert-architects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          experience: parseInt(formData.experience),
          availability,
          avatar: images.avatar,
          images: images.gallery
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Expert Architect Profile</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">Profile Photo</label>
            <div className="flex items-center space-x-6">
              {images.avatar.url && (
                <img src={images.avatar.url} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
              )}
              <label className="cursor-pointer">
                <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {images.avatar.uploading ? 'Uploading...' : 'Upload Photo'}
                </div>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={images.avatar.uploading} />
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialization *</label>
              <input type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
            </div>
          </div>

          {/* Category and Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience (Years) *</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} min="0" max="70" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Province *</label>
              <select name="province" value={formData.province} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required>
                <option value="">Select Province</option>
                {Object.keys(provincesAndDistricts).map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City *</label>
              <select name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required>
                <option value="">Select City</option>
                {formData.province && provincesAndDistricts[formData.province]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact and Social */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact *</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Facebook</label>
              <input type="text" name="facebook" value={formData.facebook} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
              <input type="text" name="website" value={formData.website} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>

          {/* Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weekdays Availability</label>
              <input type="text" name="weekdays" value={availability.weekdays} onChange={handleAvailabilityChange} placeholder="e.g., 9AM-5PM" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weekends Availability</label>
              <input type="text" name="weekends" value={availability.weekends} onChange={handleAvailabilityChange} placeholder="e.g., 10AM-4PM" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>

          {/* Gallery Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Portfolio Images (Max 4)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.gallery.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {images.gallery.length < 4 && (
              <label className="cursor-pointer">
                <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Add Images</span>
                </div>
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={saving} className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Success!</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">Your profile has been updated successfully.</p>
            <button onClick={() => navigate('/my-advertisements')} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Back to My Advertisements
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditExpertArchitectsForm;

