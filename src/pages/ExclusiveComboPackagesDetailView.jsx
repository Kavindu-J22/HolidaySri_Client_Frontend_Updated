import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Star, Send, Loader, AlertCircle, CheckCircle, Share2, X, Copy, Facebook } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ExclusiveComboPackagesDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch package details
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/exclusive-combo-packages/${id}`);
        const data = await response.json();

        if (data.success) {
          setPkg(data.data);
        } else {
          setError('Failed to load package');
        }
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Failed to load package');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackage();
    }
  }, [id]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('Please login to add a review');
      return;
    }

    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/exclusive-combo-packages/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rating: parseInt(rating),
          reviewText
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Review added successfully!');
        setRating(5);
        setReviewText('');
        setShowReviewForm(false);

        // Update package data
        setPkg(prev => ({
          ...prev,
          reviews: data.data.reviews || prev.reviews,
          averageRating: data.data.averageRating,
          totalReviews: data.data.totalReviews
        }));

        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to add review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle share functionality
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Check out ${pkg?.title} - Exclusive Combo Package on HolidaySri`;

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

  // Render star rating
  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type={interactive ? 'button' : 'div'}
            onClick={() => interactive && onRate && onRate(i + 1)}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer' : ''}
          >
            <Star
              className={`w-5 h-5 ${
                i < Math.round(rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              } ${interactive ? 'hover:fill-yellow-400 hover:text-yellow-400' : ''}`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Package not found</p>
          <button
            onClick={() => navigate('/exclusive-combo-packages')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Header with Back and Share Buttons */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/exclusive-combo-packages')}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Packages</span>
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

        {/* Error and Success Alerts */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2 sm:space-x-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-2 sm:space-x-3">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-green-700 dark:text-green-300">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-8">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64 sm:h-80 md:h-96 bg-gray-200 dark:bg-gray-700">
                {pkg.images && pkg.images.length > 0 ? (
                  <>
                    <img
                      src={pkg.images[currentImageIndex].url}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    {pkg.images.length > 1 && (
                      <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-1.5 sm:gap-2">
                        {pkg.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? 'bg-white w-6 sm:w-8'
                                : 'bg-gray-400 hover:bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm sm:text-base">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* Package Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {pkg.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium text-sm sm:text-base">
                    {pkg.categoryType}
                  </span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {renderStars(pkg.averageRating || 0)}
                    <span className="text-gray-600 dark:text-gray-400">
                      ({pkg.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{pkg.days} Days</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Participants</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{pkg.pax}</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Locations</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                    {pkg.locations}
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Price</span>
                  </div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    LKR {pkg.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {/* Activities */}
              {pkg.activities && pkg.activities.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Activities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {pkg.activities.map((activity, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Includes */}
              {pkg.includes && pkg.includes.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    What's Included
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {pkg.includes.map((include, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                        <span className="text-gray-700 dark:text-gray-300">{include}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Reviews & Ratings
                </h2>
                {user && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {showReviewForm ? 'Cancel' : 'Add Review'}
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating *
                    </label>
                    <div className="flex gap-2">
                      {renderStars(rating, true, setRating)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
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
              <div className="space-y-4">
                {pkg.reviews && pkg.reviews.length > 0 ? (
                  pkg.reviews.map((review, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {review.userName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.reviewText && (
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                          {review.reviewText}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Provider Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Provider Information
              </h2>

              {/* Provider Avatar */}
              {pkg.provider.avatar && (
                <div className="text-center">
                  <img
                    src={pkg.provider.avatar.url}
                    alt={pkg.provider.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover mb-3"
                  />
                </div>
              )}

              {/* Provider Name */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Provider</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {pkg.provider.name}
                </p>
              </div>

              {/* Contact */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Contact</p>
                <a
                  href={`https://wa.me/${pkg.provider.contact.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {pkg.provider.contact}
                </a>
              </div>

              {/* Social Links */}
              <div className="space-y-2">
                {pkg.provider.facebook && (
                  <a
                    href={pkg.provider.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center transition-colors"
                  >
                    Facebook
                  </a>
                )}
                {pkg.provider.website && (
                  <a
                    href={pkg.provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 text-center transition-colors"
                  >
                    Website
                  </a>
                )}
              </div>

              {/* Overall Rating */}
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Overall Rating</p>
                <div className="flex justify-center mb-2">
                  {renderStars(pkg.averageRating || 0)}
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pkg.averageRating ? pkg.averageRating.toFixed(1) : 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Based on {pkg.totalReviews || 0} reviews
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Share Package</h3>
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

export default ExclusiveComboPackagesDetailView;

