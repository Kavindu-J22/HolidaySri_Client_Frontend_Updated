import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Mail, Phone, Facebook, Globe, Star, Loader, Calendar, FileText, Download, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RatingDisplay from '../components/common/RatingDisplay';
import axios from 'axios';

const TourGuiderDetailView = () => {
  const { tourGuiderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [tourGuider, setTourGuider] = useState(null);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Fetch tour guider profile
  const fetchTourGuider = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://holidaysri-backend-9xm4.onrender.com/api/tour-guider/${tourGuiderId}`);

      if (response.data.success) {
        setTourGuider(response.data.data);
        setRatingDistribution(response.data.ratingDistribution || {});
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews for tour guider
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`https://holidaysri-backend-9xm4.onrender.com/api/tour-guider/${tourGuiderId}/reviews?page=1&limit=10`);

      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  useEffect(() => {
    if (tourGuiderId) {
      fetchTourGuider();
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourGuiderId]);

  // Share profile function
  const handleShareProfile = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out ${tourGuider?.name}'s tour guide profile on HolidaySri!`;

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tourGuider?.name} - Tour Guide Profile`,
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!rating || !review.trim()) {
      setError('Please provide both rating and review');
      return;
    }

    try {
      setSubmittingReview(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/tour-guider/${tourGuiderId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          review: review.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add the new review to the list
        setReviews(prev => [data.data, ...prev]);
        setRating(0);
        setReview('');

        // Refresh tour guider details to update rating
        fetchTourGuider();
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!tourGuider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Tour guide profile not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1 sm:space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareProfile}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg text-sm sm:text-base flex-shrink-0"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Share</span>
          </button>
        </div>

        {/* Share Success Message */}
        {shareSuccess && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg text-sm text-center">
            ✓ Profile link copied to clipboard!
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header Image */}
          <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
            {tourGuider.avatar?.url && (
              <img
                src={tourGuider.avatar.url}
                alt={tourGuider.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Name and Basic Info */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {tourGuider.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {tourGuider.gender}
                </span>
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {tourGuider.age} years old
                </span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              {/* Experience */}
              <div className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Experience</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {tourGuider.experience} {tourGuider.experience === 1 ? 'year' : 'years'}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg flex-shrink-0">
                  <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Location</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {tourGuider.city}, {tourGuider.province}
                  </p>
                </div>
              </div>

              {/* Availability Status */}
              <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <div className={`p-3 rounded-lg flex-shrink-0 ${tourGuider.isAvailable ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <div className={`w-6 h-6 rounded-full ${tourGuider.isAvailable ? 'bg-green-600' : 'bg-gray-600'}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {tourGuider.isAvailable ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>

              {/* Available From */}
              {tourGuider.availableFrom && (
                <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Available From</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {new Date(tourGuider.availableFrom).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Overall Rating Section */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Overall Rating</h2>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                <RatingDisplay
                  averageRating={tourGuider.averageRating || 0}
                  totalReviews={tourGuider.totalReviews || 0}
                  ratingDistribution={ratingDistribution}
                  size="lg"
                  showLabel={true}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                {tourGuider.description}
              </p>
            </div>

            {/* Facilities */}
            {tourGuider.facilitiesProvided && tourGuider.facilitiesProvided.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Facilities Provided</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {tourGuider.facilitiesProvided.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                    >
                      <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                      {facility}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificate */}
            {tourGuider.certificate?.url && (
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Certification</h2>
                <div className="p-2 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  {/* Certificate Info */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                    <div className="p-1.5 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                      <FileText className="w-4 h-4 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-lg font-semibold text-gray-900 dark:text-white truncate" title={tourGuider.certificate.name || 'Tour Guide Certificate'}>
                        {tourGuider.certificate.name || 'Tour Guide Certificate'}
                      </p>
                      <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400">
                        Verified document
                      </p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <a
                    href={tourGuider.certificate.url}
                    download={tourGuider.certificate.name || 'certificate.pdf'}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg w-full"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-base">Download Certificate</span>
                  </a>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`mailto:${tourGuider.email}`}
                  className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium truncate">
                    {tourGuider.email}
                  </span>
                </a>
                <a
                  href={`tel:${tourGuider.contact}`}
                  className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                >
                  <Phone className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {tourGuider.contact}
                  </span>
                </a>
                {tourGuider.facebook && (
                  <a
                    href={tourGuider.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      Facebook Profile
                    </span>
                  </a>
                )}
                {tourGuider.website && (
                  <a
                    href={tourGuider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      Visit Website
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Reviews & Ratings</h2>

              {/* Add Review Form */}
              {user && (
                <form onSubmit={handleSubmitReview} className="mb-8 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Your Review</h3>

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Rating */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating *
                    </label>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 ${
                              star <= rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share your experience with this tour guide..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <Star className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      No reviews yet. Be the first to review!
                    </p>
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-4 sm:p-5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">
                          {rev.userId?.name || 'Anonymous'}
                        </p>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rev.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                            {rev.rating}.0
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        {rev.review}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuiderDetailView;

