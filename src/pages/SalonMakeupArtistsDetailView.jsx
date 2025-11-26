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
  Mail,
  Eye,
  MessageSquare,
  Share2,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';
import SuccessModal from '../components/common/SuccessModal';

const SalonMakeupArtistsDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  // Handle share functionality
  const handleShare = async () => {
    const shareData = {
      title: `${profile.name} - Salon & Makeup Artist`,
      text: `Check out ${profile.name}, a professional ${profile.specialization} with ${profile.experience} years of experience!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  // Fetch profile and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/salon-makeup-artists/${id}`).then(r => r.json());

        if (response.success && response.data) {
          setProfile(response.data);
          setReviews(response.data.reviews || []);
        } else {
          setError('Profile not found');
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

    if (!user) {
      setError('Please login to add a review');
      return;
    }

    if (!reviewForm.rating) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/salon-makeup-artists/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setReviews(data.data.reviews || []);
        setReviewForm({ rating: 5, comment: '' });
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to add review. Please try again.');
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
            <span>Back</span>
          </button>
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Profile not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 sm:mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        {/* Success Modal */}
        {showSuccessModal && (
          <SuccessModal
            title="Review Added Successfully!"
            message="Thank you for your review. It has been added to the profile."
            onClose={() => setShowSuccessModal(false)}
          />
        )}

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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-6 sm:mb-8">
          {/* Cover Background */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2.5 sm:p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all hover:scale-110"
              title="Share Profile"
            >
              <Share2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row gap-6 -mt-16 sm:-mt-20">
              {/* Avatar */}
              <div className="flex justify-center sm:justify-start flex-shrink-0 relative z-20">
                {profile.avatar?.url ? (
                  <img
                    src={profile.avatar.url}
                    alt={profile.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 sm:border-6 border-white dark:border-gray-800 shadow-2xl relative z-20"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-4 sm:border-6 border-white dark:border-gray-800 shadow-2xl relative z-20">
                    <span className="text-white text-4xl sm:text-5xl font-bold">{profile.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 mt-4 sm:mt-8 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {profile.name}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-3">
                      {profile.specialization}
                    </p>
                  </div>

                  {/* Availability Badge */}
                  <div className="flex justify-center sm:justify-start">
                    {profile.available ? (
                      <span className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        <span>Available</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-semibold">
                        <Clock className="w-4 h-4" />
                        <span>Not Available</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                  <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(profile.averageRating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {profile.averageRating ? profile.averageRating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    ({profile.totalReviews} {profile.totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                </div>

                {/* Category and Location */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                  <span className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                    {profile.category}
                  </span>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{profile.location?.city}, {profile.location?.province}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">{profile.experience} years exp.</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto sm:mx-0">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl text-center border border-blue-100 dark:border-blue-800">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{profile.viewCount || 0}</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-1 mt-1">
                      <Eye className="w-4 h-4" />
                      <span>Profile Views</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl text-center border border-purple-100 dark:border-purple-800">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">{profile.contactCount || 0}</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-1 mt-1">
                      <Phone className="w-4 h-4" />
                      <span>Contacts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 sm:p-8 mb-6 sm:mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <span>About</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
            {profile.description}
          </p>
        </div>

        {/* Services */}
        {profile.includes && profile.includes.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 sm:p-8 mb-6 sm:mb-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span>Services Offered</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {profile.includes.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{service}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 sm:p-8 mb-6 sm:mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Phone className="w-6 h-6 text-blue-600" />
              <span>Contact Information</span>
            </h2>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={`tel:${profile.contact}`}
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:shadow-md transition-all group"
            >
              <div className="p-2 bg-green-600 rounded-lg">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400">Phone</div>
                <div className="text-sm sm:text-base font-semibold text-green-700 dark:text-green-300 truncate group-hover:text-green-800 dark:group-hover:text-green-200">
                  {profile.contact}
                </div>
              </div>
            </a>

            <a
              href={`mailto:${profile.email}`}
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:shadow-md transition-all group"
            >
              <div className="p-2 bg-blue-600 rounded-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
                <div className="text-sm sm:text-base font-semibold text-blue-700 dark:text-blue-300 truncate group-hover:text-blue-800 dark:group-hover:text-blue-200">
                  {profile.email}
                </div>
              </div>
            </a>

            {profile.facebook && (
              <a
                href={profile.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-300 dark:border-blue-700 rounded-lg hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Facebook</div>
                  <div className="text-sm sm:text-base font-semibold text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200">
                    Visit Page
                  </div>
                </div>
              </a>
            )}

            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Website</div>
                  <div className="text-sm sm:text-base font-semibold text-purple-700 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200">
                    Visit Website
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Packages PDF */}
        {profile.packages?.url && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl shadow-xl p-5 sm:p-8 mb-6 sm:mb-8 border border-indigo-200 dark:border-indigo-800">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Award className="w-6 h-6 text-indigo-600" />
              <span>Packages & Pricing</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Download our detailed packages and pricing information
            </p>
            <a
              href={profile.packages.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span>📄</span>
              <span>Download Packages PDF</span>
            </a>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 sm:p-8 mb-6 sm:mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <Star className="w-6 h-6 text-yellow-500" />
            <span>Reviews & Ratings</span>
          </h2>

          {/* Add Review Form */}
          {user ? (
            <form onSubmit={handleSubmitReview} className="mb-8 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Your Review</h3>

              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating *
                </label>
                <div className="flex space-x-1 sm:space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-9 sm:h-9 ${
                          star <= (hoveredRating || reviewForm.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white text-sm sm:text-base resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
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
          ) : (
            <div className="mb-8 p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm sm:text-base text-blue-800 dark:text-blue-200 text-center">
                Please <button onClick={() => navigate('/login')} className="font-bold underline hover:text-blue-900 dark:hover:text-blue-100">login</button> to add a review.
              </p>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer Reviews ({reviews.length})
            </h3>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="p-4 sm:p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {(review.userId?.name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white block">
                          {review.userId?.name || 'Anonymous'}
                        </span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed pl-0 sm:pl-13">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <Star className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonMakeupArtistsDetailView;

