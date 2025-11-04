import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Shield, MapPin, Phone, Globe, Facebook, 
  Star, MessageSquare, Loader, CheckCircle, AlertCircle,
  Award, TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EmergencyServicesInsuranceDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  // Fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/emergency-services-insurance/${id}`);
        const data = await response.json();

        if (data.success) {
          setProfile(data.data);
        } else {
          setError('Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await fetch(`/api/emergency-services-insurance/${id}/reviews`);
        const data = await response.json();

        if (data.success) {
          setReviews(data.data.reviews);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    setSubmittingReview(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/emergency-services-insurance/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Review submitted successfully!');
        setShowReviewForm(false);
        setRating(0);
        setComment('');
        
        // Refresh reviews
        const reviewsResponse = await fetch(`/api/emergency-services-insurance/${id}/reviews`);
        const reviewsData = await reviewsResponse.json();
        if (reviewsData.success) {
          setReviews(reviewsData.data.reviews);
        }

        // Refresh profile to update rating
        const profileResponse = await fetch(`/api/emergency-services-insurance/${id}`);
        const profileData = await profileResponse.json();
        if (profileData.success) {
          setProfile(profileData.data);
        }

        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Render star rating
  const renderStars = (count, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= (interactive ? (hoverRating || rating) : count)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <p className="text-green-700 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Logo */}
              {profile?.logo?.url && (
                <div className="w-32 h-32 bg-white rounded-xl p-4 shadow-lg flex-shrink-0">
                  <img
                    src={profile.logo.url}
                    alt={profile.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="w-8 h-8" />
                  <h1 className="text-3xl md:text-4xl font-bold">{profile?.name}</h1>
                </div>
                <p className="text-red-100 text-lg mb-4">{profile?.category}</p>
                
                {/* Rating */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    {renderStars(Math.round(profile?.averageRating || 0))}
                    <span className="font-semibold ml-2">
                      {profile?.averageRating ? profile.averageRating.toFixed(1) : '0.0'}
                    </span>
                  </div>
                  <div className="text-red-100">
                    {profile?.totalReviews || 0} {profile?.totalReviews === 1 ? 'Review' : 'Reviews'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-700/50">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.viewCount || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Views</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Phone className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.contactCount || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Contacts</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile?.averageRating ? profile.averageRating.toFixed(1) : '0.0'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageSquare className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.totalReviews || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reviews</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {profile?.description}
              </p>
            </div>

            {/* Coverage Includes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-red-500" />
                Coverage Includes
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile?.includes?.split(',').map((item, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 font-medium"
                  >
                    {item.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Special Offers */}
            {profile?.specialOffers && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl shadow-xl p-6 border-2 border-yellow-300 dark:border-yellow-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  🎁 Special Offers
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {profile.specialOffers}
                </p>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2 text-red-500" />
                  Reviews ({profile?.totalReviews || 0})
                </h2>
                {user && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-medium"
                  >
                    Write Review
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Rating
                    </label>
                    {renderStars(rating, true, 'w-8 h-8')}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      placeholder="Share your experience..."
                      maxLength={1000}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {comment.length}/1000 characters
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        setRating(0);
                        setComment('');
                        setError('');
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {submittingReview ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Review</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 text-red-500 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {review.userName}
                          </p>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {profile?.city}, {profile?.province}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <a
                      href={`tel:${profile?.contact}`}
                      className="font-medium text-gray-900 dark:text-white hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      {profile?.contact}
                    </a>
                  </div>
                </div>

                {/* Website */}
                {profile?.website && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Globe className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Website</p>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}

                {/* Facebook */}
                {profile?.facebook && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Facebook</p>
                      <a
                        href={profile.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        Visit Page
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Button */}
              <button
                onClick={() => {
                  window.location.href = `tel:${profile?.contact}`;
                }}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-medium flex items-center justify-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Contact Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyServicesInsuranceDetailView;

