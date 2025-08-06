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
  Heart,
  Star,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ManageTravelBuddyProfile = () => {
  const { advertisementId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [travelBuddy, setTravelBuddy] = useState(null);
  const [advertisement, setAdvertisement] = useState(null);
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

  const availableInterests = [
    'Adventure Sports', 'Beach Activities', 'Cultural Tours', 'Food & Dining',
    'Hiking & Trekking', 'Historical Sites', 'Nightlife', 'Photography',
    'Shopping', 'Wildlife & Nature', 'Water Sports', 'Local Experiences',
    'Backpacking', 'Luxury Travel', 'Budget Travel', 'Solo Travel',
    'Group Travel', 'Road Trips', 'City Tours', 'Mountain Climbing'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTravelBuddyProfile();
    fetchCountries();
  }, [advertisementId, user]);

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/travel-buddy/countries');
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
      const response = await fetch(`/api/travel-buddy/manage/${advertisementId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setTravelBuddy(data.data.travelBuddy);
        setAdvertisement(data.data.advertisement);
        
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
      const response = await fetch(`/api/travel-buddy/manage/${advertisementId}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          isAvailable: !travelBuddy.isAvailable
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

  const handleInterestToggle = (interest) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError('');

      const response = await fetch(`/api/travel-buddy/manage/${advertisementId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to My Advertisements</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Travel Buddy Profile
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-800 dark:text-green-200">{success}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Edit className="w-5 h-5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>

          <button
            onClick={handleViewAd}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Eye className="w-5 h-5" />
            <span>View Ad</span>
          </button>

          <button
            onClick={handleGoToPlatform}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Go to Platform</span>
          </button>

          <button
            onClick={handleToggleAvailability}
            disabled={saving}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
              travelBuddy.isAvailable
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-500 hover:bg-gray-600 text-white'
            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Globe className="w-5 h-5" />
            )}
            <span>
              {travelBuddy.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
            </span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Cover Photo */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={travelBuddy.coverPhoto.url}
              alt={`${travelBuddy.userName}'s cover`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Availability Status */}
            <div className="absolute top-4 right-4">
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                travelBuddy.isAvailable
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  travelBuddy.isAvailable ? 'bg-green-500' : 'bg-gray-500'
                }`}></div>
                <span>{travelBuddy.isAvailable ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="relative">
                <img
                  src={travelBuddy.avatarImage.url}
                  alt={travelBuddy.userName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl"
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white dark:border-gray-800 shadow-lg ${
                  travelBuddy.isAvailable ? 'bg-green-400' : 'bg-gray-400'
                }`}></div>
              </div>
            </div>

            {isEditing ? (
              /* Edit Form */
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
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
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
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
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {availableInterests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          editForm.interests.includes(interest)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
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
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {travelBuddy.userName}
                    {travelBuddy.nickName && (
                      <span className="text-lg text-gray-500 ml-2">({travelBuddy.nickName})</span>
                    )}
                  </h2>
                  <div className="flex items-center justify-center space-x-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{travelBuddy.country}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{travelBuddy.age} years</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span className="capitalize">{travelBuddy.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    About Me
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {travelBuddy.description}
                  </p>
                </div>

                {/* Interests */}
                {travelBuddy.interests && travelBuddy.interests.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Travel Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {travelBuddy.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Contact Information
                  </h3>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{travelBuddy.whatsappNumber}</span>
                  </div>
                </div>

                {/* Social Media */}
                {(travelBuddy.socialMedia?.facebook || travelBuddy.socialMedia?.instagram || travelBuddy.socialMedia?.tiktok) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Social Media
                    </h3>
                    <div className="flex space-x-4">
                      {travelBuddy.socialMedia?.facebook && (
                        <a
                          href={travelBuddy.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Facebook</span>
                        </a>
                      )}
                      {travelBuddy.socialMedia?.instagram && (
                        <a
                          href={travelBuddy.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Instagram</span>
                        </a>
                      )}
                      {travelBuddy.socialMedia?.tiktok && (
                        <a
                          href={travelBuddy.socialMedia.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
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
