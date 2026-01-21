import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, DollarSign, Phone, AlertCircle, Loader, ChevronLeft, ChevronRight, Share2, X, MessageCircle, Copy, Facebook as FacebookIcon, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RentPropertyBuyingSellingDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/rent-property-buying-selling/${id}`);
      const data = await response.json();

      if (data.success) {
        setProperty(data.data);
      } else {
        setError(data.message || 'Failed to fetch property');
      }
    } catch (err) {
      console.error('Error fetching property:', err);
      setError('Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!user) {
      setReviewError('Please login to add a review');
      return;
    }

    if (!review.trim()) {
      setReviewError('Review cannot be empty');
      return;
    }

    setSubmittingReview(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/rent-property-buying-selling/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: parseInt(rating),
          review: review.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setReviewSuccess('Review added successfully!');
        setReview('');
        setRating(5);
        setProperty(data.data);
        setTimeout(() => setReviewSuccess(''), 3000);
      } else {
        setReviewError(data.message || 'Failed to add review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError('Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle share functionality
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Check out ${property?.name} - Property on HolidaySri`;

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
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error || 'Property not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button and Share */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1 sm:space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md text-sm sm:text-base"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Share Success Message */}
        {shareSuccess && (
          <div className="mb-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm sm:text-base text-green-700 dark:text-green-300">Link copied to clipboard!</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-64 sm:h-80 md:h-96 bg-gray-200 dark:bg-gray-700">
            {property.images && property.images.length > 0 ? (
              <>
                <img
                  src={property.images[currentImageIndex].url}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % property.images.length)}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
                      {property.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm sm:text-base">
                No Image Available
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <div className="mb-3 sm:mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span className="text-xl sm:text-2xl font-bold text-blue-600">
                      LKR {property.price.toLocaleString()}
                    </span>
                    {property.urgent && (
                      <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < Math.round(property.averageRating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                  {property.averageRating || 'N/A'} ({property.totalReviews || 0} reviews)
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Type</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{property.type}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Category</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{property.category}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Condition</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{property.condition}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Views</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{property.viewCount || 0}</p>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Location</h2>
              <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <span>{property.location.city}, {property.location.province}</span>
              </div>

              {/* View On Map Button */}
              <button
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location.city + ', ' + property.location.province + ', Sri Lanka')}`, '_blank')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium">View On Map</span>
              </button>
            </div>

            {/* Description */}
            <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Description</h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{property.description}</p>
            </div>

            {/* Special Features */}
            {property.specialFeatures && property.specialFeatures.length > 0 && (
              <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Special Features</h2>
                <div className="flex flex-wrap gap-2">
                  {property.specialFeatures.map((feature, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Contact</h2>
              <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <span>{property.contact}</span>
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Reviews & Ratings</h2>

              {/* Add Review Form */}
              {user && (
                <form onSubmit={handleSubmitReview} className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Add Your Review</h3>

                  {reviewError && (
                    <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-xs sm:text-sm">
                      {reviewError}
                    </div>
                  )}

                  {reviewSuccess && (
                    <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-700 dark:text-green-300 text-xs sm:text-sm">
                      {reviewSuccess}
                    </div>
                  )}

                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 sm:w-8 sm:h-8 cursor-pointer transition-colors ${
                              star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share your experience with this property..."
                      rows="4"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-sm sm:text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-colors font-medium flex items-center justify-center space-x-2 text-sm sm:text-base"
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
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3 sm:space-y-4">
                {property.reviews && property.reviews.length > 0 ? (
                  property.reviews.map((rev, idx) => (
                    <div key={idx} className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{rev.userName}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  i < rev.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{rev.review}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center py-4">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Share this property</h3>
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
                <FacebookIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
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
  );
};

export default RentPropertyBuyingSellingDetailView;

