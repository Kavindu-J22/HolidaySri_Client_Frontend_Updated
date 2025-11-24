import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  AlertCircle,
  Loader,
  MapPin,
  Phone,
  Globe,
  Facebook,
  Star,
  MessageSquare,
  CheckCircle,
  User,
  Share2,
  Copy,
  Check
} from 'lucide-react';

const TravelSafeHelpProfessionalDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Review form state
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/travel-safe-help-professional/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.success) {
          setProfile(data.data);
        } else {
          setError('Failed to load profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewData.title.trim() || !reviewData.comment.trim()) {
      setError('Please fill in all review fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/travel-safe-help-professional/${id}/reviews`, {
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
        setReviewData({ rating: 5, title: '', comment: '' });
        setShowReviewForm(false);
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle share profile
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out ${profile.name}'s Travel Safe Help Professional profile on HolidaySri!`;

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} - Travel Safe Help Professional`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Fallback to clipboard
          copyToClipboard(shareUrl);
        }
      }
    } else {
      // Fallback to clipboard
      copyToClipboard(shareUrl);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          <div className="text-center text-gray-600 dark:text-gray-400">Profile not found</div>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header with Back and Share buttons */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Go Back</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            {linkCopied ? (
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm sm:text-base text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8">
            {/* Avatar */}
            <img
              src={profile.avatar?.url}
              alt={profile.name}
              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">{profile.name}</h1>
              <p className="text-base sm:text-lg text-blue-600 dark:text-blue-400 mb-1.5 sm:mb-2">{profile.specialization}</p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">{profile.category}</p>

              {/* Rating */}
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-4 mb-3 sm:mb-4">
                <div className="flex items-center space-x-2">
                  {renderStars(Math.round(profile.averageRating))}
                  <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    {profile.averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  ({profile.totalReviews} {profile.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                {profile.isAvailable ? (
                  <>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="text-sm sm:text-base text-green-600 dark:text-green-400 font-medium">Available for Hire</span>
                  </>
                ) : (
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Not Currently Available</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Experience */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Experience</h3>
              <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{profile.experience} Years</p>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center space-x-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Location</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{profile.city}, {profile.province}</p>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Contact Information</h3>
              <div className="space-y-2.5 sm:space-y-3">
                <a
                  href={`tel:${profile.contact}`}
                  className="flex items-center space-x-2 sm:space-x-3 text-blue-600 dark:text-blue-400 hover:underline text-sm sm:text-base"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="break-all">{profile.contact}</span>
                </a>
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 sm:space-x-3 text-blue-600 dark:text-blue-400 hover:underline text-sm sm:text-base"
                  >
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="break-all">Visit Website</span>
                  </a>
                )}
                {profile.facebook && (
                  <a
                    href={profile.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 sm:space-x-3 text-blue-600 dark:text-blue-400 hover:underline text-sm sm:text-base"
                  >
                    <Facebook className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>Facebook Profile</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">About</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{profile.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Reviews & Ratings</span>
            </h2>
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showReviewForm ? 'Cancel' : 'Write Review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && user && (
            <form onSubmit={handleSubmitReview} className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 sm:w-8 sm:h-8 cursor-pointer transition-colors ${
                            star <= reviewData.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={reviewData.title}
                    onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summary of your experience"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your detailed experience..."
                    rows="4"
                    maxLength="1000"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{reviewData.comment.length}/1000</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-3 sm:space-y-4">
            {profile.reviews && profile.reviews.length > 0 ? (
              profile.reviews.map((review, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      {review.userAvatar && (
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">{review.userName}</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">{review.title}</h4>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 py-6 sm:py-8">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelSafeHelpProfessionalDetail;

