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
  Briefcase,
  Award,
  Clock,
  Share2,
  Check,
  FileText,
  Wrench,
  Camera
} from 'lucide-react';
import { vehicleRepairsMechanicsAPI } from '../config/api';
import SuccessModal from '../components/common/SuccessModal';

const VehicleRepairsMechanicsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Fetch profile and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, reviewsRes] = await Promise.all([
          vehicleRepairsMechanicsAPI.getMechanicProfile(id),
          vehicleRepairsMechanicsAPI.getReviews(id)
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

  // Handle share functionality
  const handleShare = async () => {
    const shareData = {
      title: `${profile.name} - Vehicle Repairs & Mechanics`,
      text: `Check out ${profile.name}, a ${profile.specialization} with ${profile.experience} years of experience!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');

    if (!reviewForm.title || !reviewForm.comment) {
      setError('Please fill in all review fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await vehicleRepairsMechanicsAPI.addReview(id, reviewForm);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button & Share */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all border border-white/20"
            >
              {shareSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={profile.avatar?.url}
                  alt={profile.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-2xl object-cover shadow-2xl border-4 border-white/20"
                />
                {profile.available && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Available
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
                {profile.name}
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 mb-4 sm:mb-6 font-medium">
                {profile.specialization}
              </p>

              {/* Rating */}
              <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-3 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.round(profile.averageRating || 0)
                          ? 'fill-yellow-300 text-yellow-300'
                          : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-white">
                  <span className="text-xl font-bold">
                    {profile.averageRating ? profile.averageRating.toFixed(1) : 'N/A'}
                  </span>
                  <span className="text-blue-100 ml-2">
                    ({profile.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 mb-2 mx-auto md:mx-0" />
                  <p className="text-xs sm:text-sm text-blue-100">Experience</p>
                  <p className="text-lg sm:text-xl font-bold">{profile.experience} years</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300 mb-2 mx-auto md:mx-0" />
                  <p className="text-xs sm:text-sm text-blue-100">Category</p>
                  <p className="text-sm sm:text-base font-bold truncate" title={profile.category}>{profile.category}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 mb-2 mx-auto md:mx-0" />
                  <p className="text-xs sm:text-sm text-blue-100">Location</p>
                  <p className="text-sm sm:text-base font-bold">{profile.location?.city}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 mb-2 mx-auto md:mx-0" />
                  <p className="text-xs sm:text-sm text-blue-100">Reviews</p>
                  <p className="text-lg sm:text-xl font-bold">{profile.totalReviews || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                About
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                {profile.description}
              </p>
            </div>

            {/* Services */}
            {profile.services && profile.services.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                    <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Services Offered
                </h2>
                <div className="flex flex-wrap gap-3">
                  {profile.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {profile.images && profile.images.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                    <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {profile.images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all group">
                      <img
                        src={image.url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <div className="space-y-3">
                {profile.contact && (
                  <a
                    href={`tel:${profile.contact}`}
                    className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-lg transition-all group"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {profile.contact}
                      </p>
                    </div>
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all group"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Website</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        Visit Website
                      </p>
                    </div>
                  </a>
                )}
                {profile.facebook && (
                  <a
                    href={profile.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg border border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition-all group"
                  >
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Facebook className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Facebook</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        View Profile
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Availability */}
            {profile.availability && (profile.availability.weekdays || profile.availability.weekends) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Availability
                </h2>
                <div className="space-y-3">
                  {profile.availability.weekdays && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">Weekdays</p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{profile.availability.weekdays}</p>
                    </div>
                  )}
                  {profile.availability.weekends && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-sm font-bold text-purple-900 dark:text-purple-100 mb-1">Weekends</p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{profile.availability.weekends}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section - Full Width */}
        <div className="lg:col-span-3 mt-8 sm:mt-12 lg:mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              Reviews & Ratings
            </h2>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleSubmitReview} className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-md">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Add Your Review</h3>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  placeholder="e.g., Excellent Service"
                />
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  placeholder="Share your experience..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 font-medium"
              >
                {submitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4 sm:space-y-5">
            {reviews.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm sm:text-base">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="p-4 sm:p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{review.userId?.name || 'Anonymous'}</p>
                      <div className="flex items-center space-x-1 mt-1.5">
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
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">{review.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          title="Review Submitted!"
          message="Thank you for your review. It has been posted successfully."
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default VehicleRepairsMechanicsDetail;

