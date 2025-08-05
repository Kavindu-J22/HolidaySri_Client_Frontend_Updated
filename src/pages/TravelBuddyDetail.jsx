import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  MapPin,
  Star,
  Eye,
  MessageCircle,
  Heart,
  Calendar,
  User,
  Phone,
  Send,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TravelBuddyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [buddy, setBuddy] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchBuddyDetails();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, id]);

  const fetchBuddyDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/travel-buddy/${id}`);
      const data = await response.json();

      if (data.success) {
        setBuddy(data.data);
      } else {
        navigate('/travel-buddies');
      }
    } catch (error) {
      console.error('Error fetching buddy details:', error);
      navigate('/travel-buddies');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`/api/travel-buddy/${id}/reviews`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/travel-buddy/${id}/favorite-status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`/api/travel-buddy/${id}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleWhatsAppContact = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Record contact
      await fetch(`/api/travel-buddy/${id}/contact`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Open WhatsApp
      const message = encodeURIComponent(`Hi ${buddy.userName}! I found your travel buddy profile on HolidaySri and would love to connect for potential travel opportunities.`);
      const whatsappUrl = `https://wa.me/${buddy.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error recording contact:', error);
    }
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await fetch(`/api/travel-buddy/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewForm)
      });
      const data = await response.json();

      if (data.success) {
        setReviews(prev => [data.data, ...prev]);
        setReviewForm({ rating: 5, comment: '' });
        setShowReviewForm(false);
        // Refresh buddy details to update rating
        fetchBuddyDetails();
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive ? () => onRatingChange(index + 1) : undefined}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!buddy) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Travel Buddy Not Found
          </h2>
          <button
            onClick={() => navigate('/travel-buddies')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Travel Buddies
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
          <button
            onClick={() => navigate('/travel-buddies')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Travel Buddies</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
          {/* Cover Photo */}
          <div className="relative h-72 md:h-96 overflow-hidden">
            <img
              src={buddy.coverPhoto.url}
              alt={`${buddy.userName}'s cover`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Member Badge */}
            {buddy.user?.isMember && (
              <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                <span className="flex items-center space-x-2">
                  <span>👑</span>
                  <span>PREMIUM MEMBER</span>
                </span>
              </div>
            )}

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-end space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={buddy.avatarImage.url}
                    alt={buddy.userName}
                    className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-2xl ring-4 ring-white/20"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-lg"></div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                      {buddy.userName}
                    </h1>
                    {buddy.nickName && (
                      <span className="text-xl text-white/90 font-medium">
                        "{buddy.nickName}"
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-white/90 mb-3">
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{buddy.country}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{buddy.age} years old</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Joined {new Date(buddy.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Rating and Stats */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <div className="flex items-center space-x-1">
                        {renderStars(buddy.averageRating)}
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {buddy.averageRating > 0 ? buddy.averageRating.toFixed(1) : 'New'}
                      </span>
                      {buddy.totalReviews > 0 && (
                        <span className="text-xs text-white/80">({buddy.totalReviews})</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-semibold">{formatViewCount(buddy.viewCount)} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleWhatsAppContact}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              {user && (
                <button
                  onClick={handleFavoriteToggle}
                  className={`flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    isFavorite
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                      : 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? 'Remove Favorite' : 'Add to Favorites'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Me</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {buddy.description}
            </p>
          </div>

          {/* Personal Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{buddy.age}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Years Old</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{buddy.gender}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Gender</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{buddy.country}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Location</div>
            </div>
          </div>

          {/* Interests */}
          {buddy.interests && buddy.interests.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <span>🎯</span>
                <span>Interests & Hobbies</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {buddy.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-700 hover:shadow-md transition-shadow duration-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-current" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Reviews & Ratings
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} from fellow travelers
                </p>
              </div>
            </div>
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Write Review</span>
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-8 border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <span>✍️</span>
                <span>Share Your Experience</span>
              </h3>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    How would you rate this travel buddy?
                  </label>
                  <div className="flex items-center space-x-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                    {renderStars(reviewForm.rating, true, (rating) =>
                      setReviewForm(prev => ({ ...prev, rating }))
                    )}
                    <span className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {reviewForm.rating} out of 5 stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Tell us about your experience
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 resize-none"
                    placeholder="Share your experience with this travel buddy... What made them a great companion?"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {submittingReview ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Submit Review</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Loading reviews...</p>
              </div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={review.userId.profileImage || '/default-avatar.png'}
                        alt={review.userId.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-700"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                            {review.userId.name}
                          </h4>
                          <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/50 px-2 py-1 rounded-full">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-white fill-current" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No reviews yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Be the first to share your experience with this travel buddy!
              </p>
              {user && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Write First Review
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelBuddyDetail;
