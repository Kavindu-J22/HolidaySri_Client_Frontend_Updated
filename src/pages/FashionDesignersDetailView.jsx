import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Loader,
  AlertCircle,
  Send,
  Eye,
  Share2,
  X,
  MessageCircle,
  Copy,
  Twitter,
  ExternalLink
} from 'lucide-react';

const FashionDesignersDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    review: ''
  });

  // Fetch profile and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, reviewsRes] = await Promise.all([
          fetch(`https://holidaysri-backend-9xm4.onrender.com/api/fashion-designers/${id}`).then(r => r.json()),
          fetch(`https://holidaysri-backend-9xm4.onrender.com/api/fashion-designers/${id}/reviews`).then(r => r.json())
        ]);

        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data);
        } else {
          setError('Profile not found');
        }

        if (reviewsRes.success && reviewsRes.data) {
          setReviews(reviewsRes.data);
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
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `${profile?.name} - Fashion Designer`;
    const text = `Check out ${profile?.name}, a professional ${profile?.specialization} on HolidaySri!`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setShowShareModal(false);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
        break;
      default:
        break;
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to add a review');
      return;
    }

    if (reviewData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!reviewData.review.trim()) {
      setError('Please write a review');
      return;
    }

    setSubmittingReview(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/fashion-designers/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setReviews([...reviews, {
          userId: user._id,
          userName: user.name,
          rating: reviewData.rating,
          review: reviewData.review,
          createdAt: new Date()
        }]);
        setReviewData({ rating: 0, review: '' });
      } else {
        setError(data.message || 'Failed to add review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 dark:text-red-200">{error || 'Profile not found'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button and Share */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1.5 sm:space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Go Back</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md text-sm sm:text-base"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Success Message */}
        {shareSuccess && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg flex items-center space-x-2 sm:space-x-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm sm:text-base text-green-700 dark:text-green-300 font-medium">Link copied to clipboard!</p>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-6 sm:mb-8 border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center md:items-center">
              <div className="relative">
                <img
                  src={profile.avatar?.url}
                  alt={profile.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />
                {profile.available && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full"></div>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white text-center mt-3 sm:mt-4">{profile.name}</h1>
              <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1 sm:mt-2 text-sm sm:text-base text-center">{profile.specialization}</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1 text-center">{profile.category}</p>
            </div>

            {/* Key Info */}
            <div className="md:col-span-2 space-y-3 sm:space-y-4">
              {/* Rating */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Rating & Reviews</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <div className="flex items-center space-x-0.5 sm:space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < Math.round(profile.averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {profile.averageRating ? profile.averageRating.toFixed(1) : '0.0'} / 5
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    ({profile.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Experience & Availability */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Experience</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {profile.experience} years
                  </p>
                </div>
                <div className={`rounded-lg p-3 sm:p-4 ${
                  profile.available
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <p className={`text-lg sm:text-xl font-bold ${
                    profile.available
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {profile.available ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>

              {/* Views */}
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium">{profile.viewCount || 0} views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
            <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
            About
          </h2>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{profile.description}</p>
        </div>

        {/* Services */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
            <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
            Services Offered
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.includes?.map((service, index) => (
              <span
                key={index}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm font-semibold border border-blue-200 dark:border-blue-700 shadow-sm"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Gallery */}
        {profile.images && profile.images.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              Design Samples
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {profile.images.map((img, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                  <img
                    src={img.url}
                    alt={`Design ${index + 1}`}
                    className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
                    <span className="text-white text-xs sm:text-sm font-semibold">View</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location & Contact */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
            <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
            Contact Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                {profile.location?.city}, {profile.location?.province}
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <a href={`tel:${profile.contact}`} className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline font-medium">
                {profile.contact}
              </a>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <a href={`mailto:${profile.email}`} className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline font-medium break-all">
                {profile.email}
              </a>
            </div>
            {profile.facebook && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Facebook Profile
                </a>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline font-medium break-all">
                  Visit Website
                </a>
              </div>
            )}
          </div>

          {/* View On Map Button */}
          <div className="mt-4">
            <button
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location?.city + ', ' + profile.location?.province + ', Sri Lanka')}`, '_blank')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">View On Map</span>
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
            <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
            Reviews & Ratings
          </h2>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleSubmitReview} className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Add Your Review</h3>

              {error && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-800 dark:text-red-200 text-xs sm:text-sm">{error}</p>
                </div>
              )}

              {/* Rating */}
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors ${
                          star <= (hoveredRating || reviewData.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={reviewData.review}
                  onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                  rows="4"
                  placeholder="Share your experience with this fashion designer..."
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold text-sm sm:text-base shadow-md hover:shadow-lg"
              >
                {submittingReview ? (
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
          <div className="space-y-3 sm:space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/30 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{review.userName}</p>
                      <div className="flex items-center space-x-0.5 sm:space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
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
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{review.review}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Share this profile</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-all duration-200 group"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Share on Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/40 rounded-lg transition-all duration-200 group"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">Share on Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-all duration-200 group"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">Share on WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 group"
                >
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FashionDesignersDetailView;

