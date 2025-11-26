import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Eye,
  Globe,
  User,
  Phone,
  MapPin,
  Calendar,
  Save,
  X,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Users,
  Camera,
  Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ManageTravelBuddyProfile = () => {
  const { advertisementId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [travelBuddy, setTravelBuddy] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countries, setCountries] = useState([]);

  const [editForm, setEditForm] = useState({
    userName: '',
    nickName: '',
    age: '',
    whatsappNumber: '',
    country: '',
    description: '',
    gender: '',
    interests: [],
    socialMedia: {
      facebook: '',
      instagram: '',
      tiktok: ''
    }
  });

  // Image upload state
  const [images, setImages] = useState({
    coverPhoto: { url: '', publicId: '', uploading: false },
    avatarImage: { url: '', publicId: '', uploading: false }
  });

  const [newInterest, setNewInterest] = useState('');

  // Handle image upload to Cloudinary
  const uploadImage = async (file, imageType) => {
    try {
      setImages(prev => ({
        ...prev,
        [imageType]: { ...prev[imageType], uploading: true }
      }));

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'daa9e83as');

      const response = await fetch('https://api.cloudinary.com/v1_1/daa9e83as/image/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.secure_url) {
        setImages(prev => ({
          ...prev,
          [imageType]: {
            url: data.secure_url,
            publicId: data.public_id,
            uploading: false
          }
        }));
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setImages(prev => ({
        ...prev,
        [imageType]: { ...prev[imageType], uploading: false }
      }));
      setError('Failed to upload image. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Handle file selection
  const handleFileSelect = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        setTimeout(() => setError(''), 3000);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        setTimeout(() => setError(''), 3000);
        return;
      }

      uploadImage(file, imageType);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCountries();
    fetchTravelBuddyProfile();
  }, [advertisementId, user]);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/travel-buddy/countries');
      const data = await response.json();
      if (data.success) {
        setCountries(data.data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchTravelBuddyProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/travel-buddy/manage/${advertisementId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setTravelBuddy(data.data.travelBuddy);

        // Initialize edit form with current data
        const buddy = data.data.travelBuddy;
        setEditForm({
          userName: buddy.userName || '',
          nickName: buddy.nickName || '',
          age: buddy.age || '',
          whatsappNumber: buddy.whatsappNumber || '',
          country: buddy.country || '',
          description: buddy.description || '',
          gender: buddy.gender || '',
          interests: buddy.interests || [],
          socialMedia: buddy.socialMedia || {
            facebook: '',
            instagram: '',
            tiktok: ''
          }
        });

        // Initialize images with current data
        setImages({
          coverPhoto: {
            url: buddy.coverPhoto?.url || '',
            publicId: buddy.coverPhoto?.publicId || '',
            uploading: false
          },
          avatarImage: {
            url: buddy.avatarImage?.url || '',
            publicId: buddy.avatarImage?.publicId || '',
            uploading: false
          }
        });
      } else {
        setError(data.message || 'Failed to fetch travel buddy profile');
        setTimeout(() => navigate('/profile', { state: { activeSection: 'advertisements' } }), 3000);
      }
    } catch (error) {
      console.error('Error fetching travel buddy profile:', error);
      setError('Failed to fetch travel buddy profile');
      setTimeout(() => navigate('/profile', { state: { activeSection: 'advertisements' } }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      setSaving(true);
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/travel-buddy/manage/${advertisementId}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          isAvailable: !(travelBuddy.isAvailable === undefined || travelBuddy.isAvailable === true)
        })
      });

      const data = await response.json();

      if (data.success) {
        setTravelBuddy(prev => ({
          ...prev,
          isAvailable: data.data.isAvailable
        }));
        setSuccess(`Profile ${data.data.isAvailable ? 'marked as available' : 'marked as unavailable'}`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update availability');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      setError('Failed to update availability');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !editForm.interests.includes(newInterest.trim())) {
      setEditForm(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleInterestKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError('');

      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/travel-buddy/manage/${advertisementId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...editForm,
          coverPhoto: {
            url: images.coverPhoto.url,
            publicId: images.coverPhoto.publicId
          },
          avatarImage: {
            url: images.avatarImage.url,
            publicId: images.avatarImage.publicId
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setTravelBuddy(data.data);
        setIsEditing(false);
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update profile');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleViewAd = () => {
    navigate(`/travel-buddy/${travelBuddy._id}`);
  };

  const handleGoToPlatform = () => {
    navigate('/travel-buddies');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading travel buddy profile...</p>
        </div>
      </div>
    );
  }

  if (!travelBuddy) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The travel buddy profile could not be found or you don't have permission to manage it.
          </p>
          <button
            onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to My Advertisements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <button
              onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
              className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs sm:text-sm lg:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Back to My Advertisements</span>
            </button>
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
              Manage Travel Buddy Profile
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-red-800 dark:text-red-200 break-words">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 sm:mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-green-800 dark:text-green-200 break-words">{success}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-xs sm:text-sm"
          >
            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>

          <button
            onClick={handleViewAd}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-xs sm:text-sm"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">View</span>
          </button>

          <button
            onClick={handleGoToPlatform}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-xs sm:text-sm"
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Platform</span>
          </button>

          <button
            onClick={handleToggleAvailability}
            disabled={saving}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-xs sm:text-sm ${
              (travelBuddy.isAvailable === undefined || travelBuddy.isAvailable === true)
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-500 hover:bg-gray-600 text-white'
            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin flex-shrink-0" />
            ) : (
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            )}
            <span className="truncate">
              {(travelBuddy.isAvailable === undefined || travelBuddy.isAvailable === true) ? 'Unavail.' : 'Avail.'}
            </span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Cover Photo */}
          <div className="relative h-48 sm:h-64 overflow-hidden">
            <img
              src={travelBuddy.coverPhoto.url}
              alt={`${travelBuddy.userName}'s cover`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Availability Status */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold ${
                (travelBuddy.isAvailable === undefined || travelBuddy.isAvailable === true)
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${
                  (travelBuddy.isAvailable === undefined || travelBuddy.isAvailable === true) ? 'bg-green-500' : 'bg-gray-500'
                }`}></div>
                <span className="whitespace-nowrap">{(travelBuddy.isAvailable === undefined || travelBuddy.isAvailable === true) ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-3 sm:p-6">
            {/* Avatar */}
            <div className="flex justify-center -mt-12 sm:-mt-16 mb-4 sm:mb-6">
              <div className="relative">
                <img
                  src={travelBuddy.avatarImage.url}
                  alt={travelBuddy.userName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl"
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-3 border-white dark:border-gray-800 shadow-lg ${
                  (travelBuddy.isAvailable === undefined || travelBuddy.isAvailable === true) ? 'bg-green-400' : 'bg-gray-400'
                }`}></div>
              </div>
            </div>

            {isEditing ? (
              /* Edit Form */
              <div className="space-y-4 sm:space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        User Name *
                      </label>
                      <input
                        type="text"
                        value={editForm.userName}
                        onChange={(e) => handleInputChange('userName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nick Name
                      </label>
                      <input
                        type="text"
                        value={editForm.nickName}
                        onChange={(e) => handleInputChange('nickName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Age *
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="100"
                        value={editForm.age}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Gender *
                      </label>
                      <select
                        value={editForm.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        value={editForm.whatsappNumber}
                        onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="+94771234567"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country *
                      </label>
                      <select
                        value={editForm.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select Country</option>
                        {countries && countries.length > 0 ? (
                          countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))
                        ) : (
                          <option disabled>Loading countries...</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Tell others about yourself and your travel preferences..."
                    required
                  />
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Travel Interests
                  </label>

                  {/* Add Interest Input */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={handleInterestKeyDown}
                      placeholder="Add interest..."
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={handleAddInterest}
                      className="flex-shrink-0 px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-1 text-sm sm:text-base"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>

                  {/* Current Interests */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {editForm.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium"
                      >
                        <span className="break-all">{interest}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="flex-shrink-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {editForm.interests.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      No interests added yet. Add some interests to help other travelers find you!
                    </p>
                  )}
                </div>

                {/* Images */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Photos</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Cover Photo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cover Photo
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        {images.coverPhoto.url ? (
                          <div className="relative">
                            <img
                              src={images.coverPhoto.url}
                              alt="Cover"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setImages(prev => ({ ...prev, coverPhoto: { url: '', publicId: '', uploading: false } }))}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            {images.coverPhoto.uploading ? (
                              <div className="flex flex-col items-center">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
                              </div>
                            ) : (
                              <div>
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  Upload your cover photo
                                </p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileSelect(e, 'coverPhoto')}
                                  className="hidden"
                                  id="coverPhoto"
                                />
                                <label
                                  htmlFor="coverPhoto"
                                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                                >
                                  Choose File
                                </label>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Avatar Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Avatar Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        {images.avatarImage.url ? (
                          <div className="relative">
                            <img
                              src={images.avatarImage.url}
                              alt="Avatar"
                              className="w-32 h-32 object-cover rounded-full mx-auto"
                            />
                            <button
                              type="button"
                              onClick={() => setImages(prev => ({ ...prev, avatarImage: { url: '', publicId: '', uploading: false } }))}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            {images.avatarImage.uploading ? (
                              <div className="flex flex-col items-center">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
                              </div>
                            ) : (
                              <div>
                                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  Upload your profile picture
                                </p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileSelect(e, 'avatarImage')}
                                  className="hidden"
                                  id="avatarImage"
                                />
                                <label
                                  htmlFor="avatarImage"
                                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                                >
                                  Choose File
                                </label>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Social Media (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={editForm.socialMedia.facebook}
                        onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={editForm.socialMedia.instagram}
                        onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        TikTok
                      </label>
                      <input
                        type="url"
                        value={editForm.socialMedia.tiktok}
                        onChange={(e) => handleInputChange('socialMedia.tiktok', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="https://tiktok.com/@username"
                      />
                    </div>
                  </div>
                </div>

                {/* Save/Cancel Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Info */}
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {travelBuddy.userName}
                    {travelBuddy.nickName && (
                      <span className="text-base sm:text-lg text-gray-500 ml-2">({travelBuddy.nickName})</span>
                    )}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate max-w-[100px] sm:max-w-none">{travelBuddy.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{travelBuddy.age} years</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="capitalize">{travelBuddy.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    About Me
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed break-words">
                    {travelBuddy.description}
                  </p>
                </div>

                {/* Interests */}
                {travelBuddy.interests && travelBuddy.interests.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                      Travel Interests
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {travelBuddy.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    Contact Information
                  </h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="break-all">{travelBuddy.whatsappNumber}</span>
                  </div>
                </div>

                {/* Social Media */}
                {(travelBuddy.socialMedia?.facebook || travelBuddy.socialMedia?.instagram || travelBuddy.socialMedia?.tiktok) && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                      Social Media
                    </h3>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      {travelBuddy.socialMedia?.facebook && (
                        <a
                          href={travelBuddy.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-700 transition-colors text-xs sm:text-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>Facebook</span>
                        </a>
                      )}
                      {travelBuddy.socialMedia?.instagram && (
                        <a
                          href={travelBuddy.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 sm:gap-2 text-pink-600 hover:text-pink-700 transition-colors text-xs sm:text-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>Instagram</span>
                        </a>
                      )}
                      {travelBuddy.socialMedia?.tiktok && (
                        <a
                          href={travelBuddy.socialMedia.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 sm:gap-2 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors text-xs sm:text-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>TikTok</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {travelBuddy.viewCount || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {travelBuddy.contactCount || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Contacts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {travelBuddy.averageRating ? travelBuddy.averageRating.toFixed(1) : '0.0'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {travelBuddy.totalReviews || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTravelBuddyProfile;
