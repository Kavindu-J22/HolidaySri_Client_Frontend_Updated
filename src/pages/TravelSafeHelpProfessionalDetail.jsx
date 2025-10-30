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
  User
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
        const response = await fetch(`/api/travel-safe-help-professional/${id}`, {
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
      const response = await fetch(`/api/travel-safe-help-professional/${id}/reviews`, {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <img
              src={profile.avatar?.url}
              alt={profile.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{profile.name}</h1>
              <p className="text-lg text-blue-600 dark:text-blue-400 mb-2">{profile.specialization}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{profile.category}</p>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  {renderStars(Math.round(profile.averageRating))}
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profile.averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  ({profile.totalReviews} {profile.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                {profile.isAvailable ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">Available for Hire</span>
                  </>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">Not Currently Available</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Experience */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Experience</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profile.experience} Years</p>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Location</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{profile.city}, {profile.province}</p>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${profile.contact}`}
                  className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Phone className="w-5 h-5" />
                  <span>{profile.contact}</span>
                </a>
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Visit Website</span>
                  </a>
                )}
                {profile.facebook && (
                  <a
                    href={profile.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>Facebook Profile</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{profile.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <MessageSquare className="w-6 h-6" />
              <span>Reviews & Ratings</span>
            </h2>
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showReviewForm ? 'Cancel' : 'Write Review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && user && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 cursor-pointer transition-colors ${
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={reviewData.title}
                    onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summary of your experience"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your detailed experience..."
                    rows="4"
                    maxLength="1000"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{reviewData.comment.length}/1000</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {profile.reviews && profile.reviews.length > 0 ? (
              profile.reviews.map((review, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {review.userAvatar && (
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{review.userName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{review.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelSafeHelpProfessionalDetail;

