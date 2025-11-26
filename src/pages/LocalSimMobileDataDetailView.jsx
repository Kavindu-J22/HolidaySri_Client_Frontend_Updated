import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, Phone, Mail, Globe, Facebook, FileText,
  Award, Eye, Loader, MapPin, Send, User, Share2, X, Copy, CheckCircle
} from 'lucide-react';

const LocalSimMobileDataDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Fetch profile
  useEffect(() => {
    fetchProfile();
    fetchReviews();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/local-sim-mobile-data/${id}`);
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/local-sim-mobile-data/${id}/reviews`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!reviewForm.review.trim()) {
      setReviewError('Please write a review');
      return;
    }

    setSubmittingReview(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setReviewError('Please login to submit a review');
        setSubmittingReview(false);
        return;
      }

      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/local-sim-mobile-data/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (data.success) {
        setReviewSuccess('Review submitted successfully!');
        setReviewForm({ rating: 5, review: '' });
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSuccess('');
          fetchProfile();
          fetchReviews();
        }, 2000);
      } else {
        setReviewError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle share functionality
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Check out ${profile?.name} - Local SIM Cards & Mobile Data on HolidaySri`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={() => navigate('/ads/special-opportunities/local-sim-mobile-data')}
            className="btn-primary"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back and Share Buttons */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/ads/special-opportunities/local-sim-mobile-data')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Back to Browse</span>
            <span className="sm:hidden">Back</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Share Success Message */}
        {shareSuccess && (
          <div className="mb-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-300 text-sm sm:text-base">Link copied to clipboard!</p>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Logo */}
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center p-4">
                {profile.logo && profile.logo.url ? (
                  <img
                    src={profile.logo.url}
                    alt={profile.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-blue-600 text-5xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                <p className="text-blue-100 text-lg mb-4">{profile.category}</p>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-white">
                    <Award className="w-5 h-5" />
                    <span>{profile.experienceYears} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Eye className="w-5 h-5" />
                    <span>{profile.viewCount || 0} Views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {profile.averageRating ? profile.averageRating.toFixed(1) : '0.0'}
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= (profile.averageRating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {profile.totalReviews || 0} reviews
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center gap-2"
              >
                <Star className="w-5 h-5" />
                Write a Review
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {profile.description}
              </p>
            </div>

            {/* Specialties */}
            {profile.specialties && profile.specialties.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Packages PDF */}
            {profile.packagesPDF && profile.packagesPDF.url && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Packages</h2>
                <a
                  href={profile.packagesPDF.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FileText className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {profile.packagesPDF.fileName || 'View Packages'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click to view PDF</p>
                  </div>
                </a>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Reviews ({reviews.length})
              </h2>

              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {review.userId?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {review.userId?.name || 'Anonymous'}
                            </h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">{review.review}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>

              <div className="space-y-4">
                {/* Contact */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contact</p>
                    <p className="font-medium text-gray-900 dark:text-white">{profile.contact}</p>
                  </div>
                </div>

                {/* Facebook */}
                {profile.facebook && (
                  <div className="flex items-start gap-3">
                    <Facebook className="w-5 h-5 text-blue-500 mt-1" />
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

                {/* Website */}
                {profile.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-500 mt-1" />
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
              </div>
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Write a Review</h3>

              {reviewError && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 dark:text-red-300">{reviewError}</p>
                </div>
              )}

              {reviewSuccess && (
                <div className="mb-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-green-700 dark:text-green-300">{reviewSuccess}</p>
                </div>
              )}

              <form onSubmit={handleSubmitReview}>
                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= reviewForm.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          } hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={reviewForm.review}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                    rows="4"
                    placeholder="Share your experience..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewModal(false);
                      setReviewError('');
                      setReviewSuccess('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submittingReview ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Share Profile</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <Facebook className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Facebook</span>
                </button>

                <button
                  onClick={() => handleShare('twitter')}
                  className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded-xl transition group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sky-500 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Twitter</span>
                </button>

                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleShare('copy')}
                  className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <Copy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalSimMobileDataDetailView;

