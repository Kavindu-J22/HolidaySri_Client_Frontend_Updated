import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Globe,
  Facebook,
  Loader,
  AlertCircle,
  Send,
  Share2,
  Copy,
  X,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPinned,
  Info,
  Users,
  MessageCircle
} from 'lucide-react';
import { professionalDriversAPI } from '../config/api';
import SuccessModal from '../components/common/SuccessModal';

const ProfessionalDriversDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  // Share and Live Ride state
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLiveRideModal, setShowLiveRideModal] = useState(false);
  const [editingLiveRide, setEditingLiveRide] = useState(null);
  const [liveRideForm, setLiveRideForm] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    description: '',
    maxPassengerCount: '',
    availablePassengerCount: '',
    pricePerSeat: '',
    status: 'Upcoming',
    approximateTimeToRide: ''
  });

  // Check if current user is the owner
  const isOwner = user && profile && user.id === profile.userId?._id;

  // Fetch profile and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, reviewsRes] = await Promise.all([
          professionalDriversAPI.getDriverProfile(id),
          professionalDriversAPI.getReviews(id)
        ]);

        if (profileRes.data && profileRes.data.data) {
          setProfile(profileRes.data.data);
        }

        if (reviewsRes.data && reviewsRes.data.data) {
          setReviews(reviewsRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please login to add a review');
      return;
    }

    if (!reviewForm.title || !reviewForm.comment) {
      setError('Please fill in all review fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await professionalDriversAPI.addReview(id, reviewForm);

      if (response.data && response.data.success) {
        setReviews([response.data.data, ...reviews]);
        setReviewForm({ rating: 5, title: '', comment: '' });
        setShowSuccessModal(true);

        // Update profile with new rating
        if (profile) {
          const updatedProfile = { ...profile };
          const allReviews = [response.data.data, ...reviews];
          const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
          updatedProfile.averageRating = parseFloat((totalRating / allReviews.length).toFixed(1));
          updatedProfile.totalReviews = allReviews.length;
          setProfile(updatedProfile);
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle share functionality
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Check out ${profile.name} - Professional Driver on HolidaySri`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setShowShareModal(false);
        setShowSuccessModal(true);
        break;
      default:
        break;
    }
  };

  // Handle Live Ride form changes
  const handleLiveRideFormChange = (e) => {
    const { name, value } = e.target;
    setLiveRideForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle Add Live Ride
  const handleAddLiveRide = () => {
    setEditingLiveRide(null);
    setLiveRideForm({
      from: '',
      to: '',
      date: '',
      time: '',
      description: '',
      maxPassengerCount: '',
      availablePassengerCount: '',
      pricePerSeat: '',
      status: 'Upcoming',
      approximateTimeToRide: ''
    });
    setShowLiveRideModal(true);
  };

  // Handle Edit Live Ride
  const handleEditLiveRide = (ride) => {
    setEditingLiveRide(ride);
    setLiveRideForm({
      from: ride.from,
      to: ride.to,
      date: ride.date ? new Date(ride.date).toISOString().split('T')[0] : '',
      time: ride.time,
      description: ride.description || '',
      maxPassengerCount: ride.maxPassengerCount,
      availablePassengerCount: ride.availablePassengerCount,
      pricePerSeat: ride.pricePerSeat,
      status: ride.status,
      approximateTimeToRide: ride.approximateTimeToRide
    });
    setShowLiveRideModal(true);
  };

  // Handle Submit Live Ride
  const handleSubmitLiveRide = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      let response;

      if (editingLiveRide) {
        response = await professionalDriversAPI.updateLiveRide(id, editingLiveRide._id, liveRideForm);
      } else {
        response = await professionalDriversAPI.addLiveRide(id, liveRideForm);
      }

      if (response.data && response.data.success) {
        // Refresh profile data
        const profileRes = await professionalDriversAPI.getDriverProfile(id);
        if (profileRes.data && profileRes.data.data) {
          setProfile(profileRes.data.data);
        }
        setShowLiveRideModal(false);
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('Error submitting live ride:', err);
      setError(err.response?.data?.message || 'Failed to submit live ride');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Live Ride
  const handleDeleteLiveRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to delete this live ride?')) {
      return;
    }

    try {
      const response = await professionalDriversAPI.deleteLiveRide(id, rideId);

      if (response.data && response.data.success) {
        // Refresh profile data
        const profileRes = await professionalDriversAPI.getDriverProfile(id);
        if (profileRes.data && profileRes.data.data) {
          setProfile(profileRes.data.data);
        }
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('Error deleting live ride:', err);
      setError(err.response?.data?.message || 'Failed to delete live ride');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300">Profile not found</p>
          <button
            onClick={() => navigate('/professional-drivers')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button and Share */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/professional-drivers')}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Browse</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-4 sm:mb-6">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <img
                  src={profile.avatar?.url}
                  alt={profile.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{profile.name}</h1>
                <p className="text-base sm:text-lg text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">{profile.specialization}</p>

                {/* Rating */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < Math.round(profile.averageRating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {profile.averageRating || 'No ratings'} ({profile.totalReviews || 0} reviews)
                  </span>
                </div>

                {/* Categories */}
                <div className="mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Categories:</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {profile.categories?.map((cat, idx) => (
                      <span key={idx} className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 justify-center md:justify-start">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{profile.city}, {profile.province}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Ride Banner - Only for Owner */}
        {isOwner && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {profile.liveRides && profile.liveRides.length > 0
                    ? '🚗 Add More Live Rides'
                    : '🎉 Add 1 Free Live Ride'}
                </h3>
                <p className="text-sm sm:text-base opacity-90">
                  {profile.liveRides && profile.liveRides.length > 0
                    ? 'Want to add more live rides? Purchase a Live Ride & Carpooling advertisement slot.'
                    : 'Offer carpooling services to passengers! Add your first live ride for free.'}
                </p>
              </div>
              <button
                onClick={() => {
                  if (profile.liveRides && profile.liveRides.length > 0) {
                    navigate('/live-rides-carpooling');
                  } else {
                    handleAddLiveRide();
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition whitespace-nowrap"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                {profile.liveRides && profile.liveRides.length > 0 ? 'Browse Live Rides' : 'Add Live Ride'}
              </button>
            </div>
          </div>
        )}

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{profile.description}</p>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold text-gray-700 dark:text-gray-300">Experience:</span> {profile.experience} years</p>
              <p><span className="font-semibold text-gray-700 dark:text-gray-300">Status:</span> {profile.available ? '✅ Available' : '❌ Not Available'}</p>
            </div>
          </div>

          {/* Availability & Contact */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact & Availability</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <a href={`tel:${profile.contact}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {profile.contact}
                </a>
              </div>
              {profile.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Website
                  </a>
                </div>
              )}
              {profile.facebook && (
                <div className="flex items-center space-x-3">
                  <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Facebook
                  </a>
                </div>
              )}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Weekday Availability:</p>
                <p className="text-gray-600 dark:text-gray-400">{profile.weekdayAvailability || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Weekend Availability:</p>
                <p className="text-gray-600 dark:text-gray-400">{profile.weekendAvailability || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Rides Section */}
        {profile.liveRides && profile.liveRides.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <MapPinned className="w-5 h-5 sm:w-6 sm:h-6" />
              Available Live Rides
            </h3>
            <div className="space-y-4">
              {profile.liveRides.map((ride) => (
                <div key={ride._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                          {ride.from} → {ride.to}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          {new Date(ride.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          {ride.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                          {ride.availablePassengerCount}/{ride.maxPassengerCount} seats
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        ride.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        ride.status === 'Starting Soon' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        ride.status === 'Ongoing' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        ride.status === 'Over Soon' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {ride.status}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-blue-600">
                        Rs. {ride.pricePerSeat}
                      </span>
                    </div>
                  </div>
                  {ride.description && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {ride.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <Info className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                      Approx. {ride.approximateTimeToRide}
                    </span>
                    {isOwner && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditLiveRide(ride)}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLiveRide(ride._id)}
                          className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reviews & Ratings</h2>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Your Review</h3>

              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Rating *</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || reviewForm.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  placeholder="e.g., Excellent service"
                />
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Comment *</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  placeholder="Share your experience..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{review.userId?.name || 'Anonymous'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{review.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Success!"
        message="Action completed successfully."
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share this profile</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Share on Facebook</span>
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 p-3 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/40 rounded-lg transition"
              >
                <Share2 className="w-5 h-5 text-sky-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Share on Twitter</span>
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Share on WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition"
              >
                <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-semibold text-gray-900 dark:text-white">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Ride Modal */}
      {showLiveRideModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 my-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {editingLiveRide ? 'Edit Live Ride' : 'Add Live Ride'}
              </h3>
              <button
                onClick={() => setShowLiveRideModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmitLiveRide} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    From *
                  </label>
                  <input
                    type="text"
                    name="from"
                    value={liveRideForm.from}
                    onChange={handleLiveRideFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Starting location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    To *
                  </label>
                  <input
                    type="text"
                    name="to"
                    value={liveRideForm.to}
                    onChange={handleLiveRideFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Destination"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={liveRideForm.date}
                    onChange={handleLiveRideFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={liveRideForm.time}
                    onChange={handleLiveRideFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Short Description
                </label>
                <textarea
                  name="description"
                  value={liveRideForm.description}
                  onChange={handleLiveRideFormChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Additional details about the ride..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Max Passengers *
                  </label>
                  <input
                    type="number"
                    name="maxPassengerCount"
                    value={liveRideForm.maxPassengerCount}
                    onChange={handleLiveRideFormChange}
                    required
                    min="1"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Available Seats *
                  </label>
                  <input
                    type="number"
                    name="availablePassengerCount"
                    value={liveRideForm.availablePassengerCount}
                    onChange={handleLiveRideFormChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Price/Seat (Rs.) *
                  </label>
                  <input
                    type="number"
                    name="pricePerSeat"
                    value={liveRideForm.pricePerSeat}
                    onChange={handleLiveRideFormChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={liveRideForm.status}
                    onChange={handleLiveRideFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Starting Soon">Starting Soon</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Over Soon">Over Soon</option>
                    <option value="Over">Over</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Approx. Time *
                  </label>
                  <input
                    type="text"
                    name="approximateTimeToRide"
                    value={liveRideForm.approximateTimeToRide}
                    onChange={handleLiveRideFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., 2 hours"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLiveRideModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {editingLiveRide ? 'Update' : 'Add'} Live Ride
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalDriversDetailView;

