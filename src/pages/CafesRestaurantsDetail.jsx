import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Globe,
  Facebook,
  Star,
  Loader,
  AlertCircle,
  FileText,
  MapPinIcon
} from 'lucide-react';
import SuccessModal from '../components/common/SuccessModal';

const CafesRestaurantsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    reviewText: ''
  });

  // Fetch cafe details
  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const response = await fetch(`/api/cafes-restaurants/${id}`);
        const data = await response.json();

        if (data.success) {
          setCafe(data.data);
        } else {
          setError(data.message || 'Failed to load cafe details');
        }
      } catch (error) {
        console.error('Error fetching cafe:', error);
        setError('Failed to load cafe details');
      } finally {
        setLoading(false);
      }
    };

    fetchCafe();
  }, [id]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (!reviewForm.rating) {
      setError('Please select a rating');
      return;
    }

    setSubmittingReview(true);
    setError('');

    try {
      const response = await fetch(`/api/cafes-restaurants/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user._id,
          userName: user.firstName + ' ' + user.lastName,
          rating: reviewForm.rating,
          reviewText: reviewForm.reviewText
        })
      });

      const data = await response.json();

      if (data.success) {
        setCafe(prev => ({
          ...prev,
          reviews: [...prev.reviews, data.data.review],
          averageRating: data.data.averageRating,
          totalReviews: data.data.totalReviews
        }));
        setReviewForm({ rating: 5, reviewText: '' });
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 dark:text-red-200">{error || 'Cafe not found'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="relative bg-gray-200 dark:bg-gray-700 h-96">
                {cafe.images && cafe.images.length > 0 ? (
                  <>
                    <img
                      src={cafe.images[currentImageIndex].url}
                      alt={cafe.name}
                      className="w-full h-full object-cover"
                    />
                    {cafe.images.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {cafe.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              idx === currentImageIndex ? 'bg-white' : 'bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400">No images available</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {cafe.images && cafe.images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {cafe.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === currentImageIndex
                          ? 'border-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{cafe.name}</h1>
                <p className="text-lg text-blue-600 dark:text-blue-400">{cafe.categoryType}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(cafe.averageRating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {cafe.averageRating || 'No ratings'} ({cafe.totalReviews || 0} reviews)
                </span>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-gray-900 dark:text-white">{cafe.location.city}, {cafe.location.province}</p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Operating Hours</p>
                    <p className="text-gray-900 dark:text-white">{cafe.operatingHours.openTime} - {cafe.operatingHours.closeTime}</p>
                  </div>
                </div>

                {/* Dining Options */}
                <div className="flex items-start space-x-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Dining Options</span>
                  <div className="flex flex-wrap gap-2">
                    {cafe.diningOptions.map(option => (
                      <span key={option} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {option}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                    <a href={`tel:${cafe.contact}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {cafe.contact}
                    </a>
                  </div>
                </div>

                {/* Website */}
                {cafe.website && (
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                      <a href={cafe.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}

                {/* Facebook */}
                {cafe.facebook && (
                  <div className="flex items-start space-x-3">
                    <Facebook className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Facebook</p>
                      <a href={cafe.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Follow on Facebook
                      </a>
                    </div>
                  </div>
                )}

                {/* Google Maps */}
                {cafe.mapLink && (
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location on Map</p>
                      <a href={cafe.mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                )}

                {/* Menu PDF */}
                {cafe.menuPDF && cafe.menuPDF.url && (
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Menu</p>
                      <a href={cafe.menuPDF.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Download Menu PDF
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{cafe.description}</p>
            </div>
          </div>

          {/* Right Column - Reviews */}
          <div>
            {/* Review Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Leave a Review</h2>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= reviewForm.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, reviewText: e.target.value }))}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Share your experience..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submittingReview || !user}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {submittingReview ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>{user ? 'Submit Review' : 'Login to Review'}</span>
                  )}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Reviews ({cafe.totalReviews || 0})
              </h2>

              {cafe.reviews && cafe.reviews.length > 0 ? (
                <div className="space-y-4">
                  {cafe.reviews.map((review, idx) => (
                    <div key={idx} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{review.userName}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {review.reviewText && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{review.reviewText}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success!"
        message="Your review has been submitted successfully!"
        redirectText="Close"
      />
    </div>
  );
};

export default CafesRestaurantsDetail;

