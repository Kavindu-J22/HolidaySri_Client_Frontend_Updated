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
  Calendar,
  Clock,
  AlertCircle,
  Loader,
  Send,
  Share2,
  Copy,
  X,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import SuccessModal from '../components/common/SuccessModal';

const ExpertDoctorsDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [expertDoctor, setExpertDoctor] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch expert doctor details
  useEffect(() => {
    const fetchExpertDoctor = async () => {
      try {
        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/expert-doctors/${id}`);
        const data = await response.json();

        if (data.success) {
          setExpertDoctor(data.data);
        } else {
          setError(data.message || 'Failed to load expert doctor details');
        }
      } catch (error) {
        console.error('Error fetching expert doctor:', error);
        setError('Failed to load expert doctor details');
      } finally {
        setLoading(false);
      }
    };

    fetchExpertDoctor();
  }, [id]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to add a review');
      return;
    }

    if (!reviewText.trim()) {
      setError('Please write a review');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/expert-doctors/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          reviewText
        })
      });

      const data = await response.json();

      if (data.success) {
        setExpertDoctor(data.data);
        setReviewText('');
        setRating(5);
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

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  // Handle share functionality
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Check out ${expertDoctor.name} - Expert Doctor on HolidaySri`;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!expertDoctor) {
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
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = expertDoctor.engagement?.averageRating || 0;
  const totalReviews = expertDoctor.engagement?.totalReviews || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button and Share */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Go Back</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base font-semibold"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Share</span>
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

        {/* Success Modal */}
        {showSuccessModal && (
          <SuccessModal
            title="Review Added Successfully!"
            message="Thank you for your review. It has been added to the profile."
            onClose={handleSuccessClose}
          />
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Header with Avatar */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10">
              <img
                src={expertDoctor.avatar.url}
                alt={expertDoctor.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl object-cover border-4 border-white shadow-2xl"
              />
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{expertDoctor.name}</h1>
                <p className="text-blue-100 text-base sm:text-lg mb-1.5 sm:mb-2 font-semibold">{expertDoctor.specialization}</p>
                <p className="text-blue-100 mb-3 sm:mb-4 text-sm sm:text-base">{expertDoctor.category}</p>

                {/* Rating */}
                <div className="flex items-center gap-3 sm:gap-4 justify-center sm:justify-start">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5 sm:gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < Math.round(averageRating)
                              ? 'fill-yellow-300 text-yellow-300'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white font-bold text-base sm:text-lg">{averageRating ? averageRating.toFixed(1) : '0.0'}</span>
                  </div>
                  <span className="text-blue-100 text-sm sm:text-base">({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">About</h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                {expertDoctor.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-5 rounded-xl border border-blue-200 dark:border-gray-600">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Experience</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {expertDoctor.experienceYears} years
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-5 rounded-xl border border-green-200 dark:border-gray-600">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                    {expertDoctor.available ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                Location
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium mb-4">
                {expertDoctor.location.city}, {expertDoctor.location.province}
              </p>

              {/* View On Map Button */}
              <button
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(expertDoctor.location.city + ', ' + expertDoctor.location.province + ', Sri Lanka')}`, '_blank')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium">View On Map</span>
              </button>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Contact</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <a href={`tel:${expertDoctor.contact}`} className="text-sm sm:text-base text-blue-600 hover:underline font-medium">
                    {expertDoctor.contact}
                  </a>
                </div>
                {expertDoctor.socialLinks.facebook && (
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                    <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                    <a
                      href={expertDoctor.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base text-blue-600 hover:underline font-medium"
                    >
                      Facebook Profile
                    </a>
                  </div>
                )}
                {expertDoctor.socialLinks.website && (
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                    <a
                      href={expertDoctor.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base text-blue-600 hover:underline font-medium"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Availability</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {expertDoctor.availability.weekdays.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      Weekdays
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      {expertDoctor.availability.weekdays.join(', ')}
                    </p>
                  </div>
                )}
                {expertDoctor.availability.weekends.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      Weekends
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      {expertDoctor.availability.weekends.join(', ')}
                    </p>
                  </div>
                )}
              </div>
              {expertDoctor.availability.times.length > 0 && (
                <div className="mt-4 sm:mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Time Slots
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {expertDoctor.availability.times.map((time, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Reviews</h2>

              {/* Add Review Form */}
              {user ? (
                <form onSubmit={handleSubmitReview} className="mb-6 sm:mb-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Add Your Review</h3>

                  {/* Rating */}
                  <div className="mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-1.5 sm:gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              star <= (hoverRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-500'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with this doctor..."
                      rows="4"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        Submit Review
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="mb-6 sm:mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                  <p className="text-sm sm:text-base text-blue-800 dark:text-blue-200">
                    Please <a href="/login" className="font-bold hover:underline">login</a> to add a review.
                  </p>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-3 sm:space-y-4">
                {expertDoctor.reviews && expertDoctor.reviews.length > 0 ? (
                  expertDoctor.reviews.map((review, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 sm:mb-3 gap-2">
                        <div>
                          <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{review.userName}</p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-0.5 sm:gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-500'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{review.reviewText}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      No reviews yet. Be the first to review!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Share this profile</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 transition"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-all duration-300 group"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Share on Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/40 rounded-lg transition-all duration-300 group"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Share on Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-all duration-300 group"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Share on WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-300 group"
                >
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
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

export default ExpertDoctorsDetailView;

