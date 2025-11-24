import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SuccessModal from '../components/common/SuccessModal';
import axios from 'axios';

const EditTourGuiderProfile = () => {
  const { tourGuiderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successModal, setSuccessModal] = useState(false);

  const [provinces, setProvinces] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    province: '',
    city: '',
    description: '',
    experience: '',
    email: '',
    contact: '',
    facilitiesProvided: [],
    isAvailable: true,
    availableFrom: '',
    facebook: '',
    website: ''
  });

  const [images, setImages] = useState({
    avatar: { url: '', publicId: '', uploading: false },
    certificate: { url: '', publicId: '', name: '', uploading: false }
  });

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://holidaysri-backend-9xm4.onrender.com/api/tour-guider/provinces');
        if (response.data.success) {
          setProvinces(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching provinces:', err);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch tour guider profile
  useEffect(() => {
    const fetchTourGuider = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://holidaysri-backend-9xm4.onrender.com/api/tour-guider/${tourGuiderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.data.success) {
          const data = response.data.data;
          setFormData({
            name: data.name || '',
            gender: data.gender || '',
            age: data.age || '',
            province: data.province || '',
            city: data.city || '',
            description: data.description || '',
            experience: data.experience || '',
            email: data.email || '',
            contact: data.contact || '',
            facilitiesProvided: data.facilitiesProvided || [],
            isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
            availableFrom: data.availableFrom ? new Date(data.availableFrom).toISOString().split('T')[0] : '',
            facebook: data.facebook || '',
            website: data.website || ''
          });

          setImages({
            avatar: { url: data.avatar?.url || '', publicId: data.avatar?.publicId || '', uploading: false },
            certificate: {
              url: data.certificate?.url || '',
              publicId: data.certificate?.publicId || '',
              name: data.certificate?.name || '',
              uploading: false
            }
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (tourGuiderId) {
      fetchTourGuider();
    }
  }, [tourGuiderId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Avatar must be an image file');
      return;
    }

    setImages(prev => ({
      ...prev,
      avatar: { ...prev.avatar, uploading: true }
    }));

    try {
      const result = await uploadToCloudinary(file, 'image');
      setImages(prev => ({
        ...prev,
        avatar: {
          url: result.url,
          publicId: result.publicId,
          uploading: false
        }
      }));
      setError('');
    } catch (error) {
      setError('Failed to upload avatar image');
      setImages(prev => ({
        ...prev,
        avatar: { ...prev.avatar, uploading: false }
      }));
    }
  };

  // Handle certificate upload
  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Certificate must be a PDF file');
      return;
    }

    setImages(prev => ({
      ...prev,
      certificate: { ...prev.certificate, uploading: true }
    }));

    try {
      const result = await uploadToCloudinary(file, 'raw');
      setImages(prev => ({
        ...prev,
        certificate: {
          url: result.url,
          publicId: result.publicId,
          name: file.name,
          uploading: false
        }
      }));
      setError('');
    } catch (error) {
      setError('Failed to upload certificate');
      setImages(prev => ({
        ...prev,
        certificate: { ...prev.certificate, uploading: false }
      }));
    }
  };

  // Handle facilities checkbox
  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilitiesProvided: prev.facilitiesProvided.includes(facility)
        ? prev.facilitiesProvided.filter(f => f !== facility)
        : [...prev.facilitiesProvided, facility]
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.gender) return 'Gender is required';
    if (!formData.age || formData.age < 18 || formData.age > 100) return 'Age must be between 18 and 100';
    if (!formData.province) return 'Province is required';
    if (!formData.city) return 'City is required';
    if (!formData.description.trim()) return 'Description is required';
    if (formData.experience === '' || formData.experience < 0 || formData.experience > 70) return 'Experience must be between 0 and 70 years';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.contact.trim()) return 'Contact number is required';
    const contactRegex = /^[\d\s\-\+\(\)]{7,}$/;
    if (!contactRegex.test(formData.contact.trim())) return 'Please enter a valid contact number (at least 7 digits)';
    if (!formData.availableFrom) return 'Available from date is required';
    if (!images.avatar.url) return 'Avatar image is required';
    if (!images.certificate.url) return 'Certificate is required';
    return null;
  };

  const facilities = [
    'Transportation',
    'Meals',
    'Accommodation',
    'Equipment',
    'Insurance',
    'Photography',
    'Interpretation Services'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const updateData = {
        ...formData,
        avatar: { url: images.avatar.url, publicId: images.avatar.publicId },
        certificate: {
          url: images.certificate.url,
          publicId: images.certificate.publicId,
          name: images.certificate.name || 'certificate.pdf'
        }
      };

      const response = await axios.put(
        `https://holidaysri-backend-9xm4.onrender.com/api/tour-guider/${tourGuiderId}`,
        updateData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.data.success) {
        setSuccessModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Tour Guide Profile
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleInputChange}
                min="18"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="tel"
                name="contact"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                name="experience"
                placeholder="Years of Experience"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                max="70"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Province</option>
                {Object.keys(provinces).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!formData.province}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
              >
                <option value="">Select City</option>
                {formData.province && provinces[formData.province]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Professional Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  placeholder="Tell us about your tour guiding experience and services..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Facilities Provided
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facilities.map(facility => (
                    <label key={facility} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.facilitiesProvided.includes(facility)}
                        onChange={() => handleFacilityChange(facility)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Currently Available</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available From *
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Social Media & Website */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Social Media & Website (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook Profile
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://facebook.com/yourprofile"
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Profile Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar Image *
                </label>
                {images.avatar.url && (
                  <img src={images.avatar.url} alt="Avatar" className="w-full h-40 object-cover rounded-lg mb-2" />
                )}
                <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <Upload className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {images.avatar.uploading ? 'Uploading...' : 'Upload Avatar (JPG, PNG)'}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleAvatarUpload}
                    disabled={images.avatar.uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Certificate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate (PDF) *
                </label>
                {images.certificate.url && (
                  <div className="mb-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                      ✓ Certificate uploaded
                    </p>
                    {images.certificate.name && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {images.certificate.name}
                      </p>
                    )}
                  </div>
                )}
                <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <Upload className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {images.certificate.uploading ? 'Uploading...' : 'Upload Certificate (PDF)'}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleCertificateUpload}
                    disabled={images.certificate.uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all font-semibold"
            >
              {submitting ? 'Updating...' : 'Update Profile'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {successModal && (
        <SuccessModal
          title="Profile Updated!"
          message="Your tour guide profile has been updated successfully."
          onClose={() => {
            setSuccessModal(false);
            navigate('/profile');
          }}
        />
      )}
    </div>
  );
};

export default EditTourGuiderProfile;

