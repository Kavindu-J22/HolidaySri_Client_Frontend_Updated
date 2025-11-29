import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Globe, Facebook, Star, Loader, AlertCircle, Send, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EducationalTutoringDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: ''
  });

  // Handle share functionality
  const handleShare = async () => {
    if (!profile) return;

    const shareData = {
      title: profile.name,
      text: `Check out ${profile.name} - Educational Tutoring`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/educational-tutoring/${id}`);
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
      } else {
        setError(data.message || 'Profile not found');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!user) {
      setReviewError('Please login to add a review');
      return;
    }

    if (!reviewForm.review.trim()) {
      setReviewError('Review text is required');
      return;
    }

    setSubmittingReview(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/educational-tutoring/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (data.success) {
        setReviewSuccess('Review added successfully!');
        setReviewForm({ rating: 5, review: '' });
        fetchProfile();
        setTimeout(() => setReviewSuccess(''), 3000);
      } else {
        setReviewError(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewError('Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type={interactive ? 'button' : 'div'}
            onClick={() => interactive && onChange && onChange(i + 1)}
            className={interactive ? 'cursor-pointer' : ''}
          >
            <Star
              className={`w-5 h-5 ${
                i < (interactive ? reviewForm.rating : Math.round(rating))
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              } ${interactive ? 'hover:fill-yellow-300 hover:text-yellow-300' : ''}`}
            />
          </button>
        ))}
        {!interactive && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
            {rating ? rating.toFixed(1) : 'No ratings'}
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button and Share */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-blue-400 to-indigo-600 overflow-hidden">
            {profile.avatar?.url && (
              <img
                src={profile.avatar.url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile.name}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                  {profile.category}
                </p>
                <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
                  {renderStars(profile.averageRating || 0)}
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    ({profile.totalReviews || profile.reviews?.length || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 sm:mt-6 md:mt-0 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {profile.experience}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Years Experience</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                    {profile.available ? '✓' : '✗'}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {profile.available ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Specializations
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.specialization?.map((spec, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                About
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.description}
              </p>
            </div>

            {/* Location */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Location
              </h2>
              <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 flex-shrink-0" />
                <span>{profile.location?.city}, {profile.location?.province}</span>
              </div>
            </div>

            {/* Availability */}
            {(profile.availability?.weekdays || profile.availability?.weekends) && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Availability
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.availability?.weekdays && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="font-medium text-gray-900 dark:text-white mb-1">Weekdays</p>
                      <p className="text-gray-600 dark:text-gray-400">{profile.availability.weekdays}</p>
                    </div>
                  )}
                  {profile.availability?.weekends && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="font-medium text-gray-900 dark:text-white mb-1">Weekends</p>
                      <p className="text-gray-600 dark:text-gray-400">{profile.availability.weekends}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <a href={`tel:${profile.contact}`} className="text-blue-600 hover:underline truncate">
                    {profile.contact}
                  </a>
                </div>
                {profile.website && (
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all text-sm sm:text-base"
                      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
                {profile.facebook && (
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                      Facebook Profile
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery */}
            {profile.images && profile.images.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profile.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`Gallery ${idx}`}
                      className="w-full h-32 rounded-lg object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Reviews & Ratings
              </h2>

              {/* Add Review Form */}
              {user && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Add Your Review
                  </h3>

                  {reviewError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-800 dark:text-red-200 text-sm">{reviewError}</p>
                    </div>
                  )}

                  {reviewSuccess && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                      <p className="text-green-800 dark:text-green-200 text-sm">{reviewSuccess}</p>
                    </div>
                  )}

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rating
                      </label>
                      {renderStars(0, true, (rating) => setReviewForm(prev => ({ ...prev, rating })))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Review
                      </label>
                      <textarea
                        value={reviewForm.review}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                        placeholder="Share your experience..."
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {submittingReview ? (
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
                </div>
              )}

              {!user && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
                  <p className="text-blue-800 dark:text-blue-200">
                    <a href="/login" className="font-semibold hover:underline">Login</a> to add a review
                  </p>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {profile.reviews && profile.reviews.length > 0 ? (
                  profile.reviews.map((review, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {review.userId?.name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.review}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalTutoringDetailView;

