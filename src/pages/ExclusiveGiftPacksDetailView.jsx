import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Loader, AlertCircle, Send, MapPin, Phone, Globe, Facebook, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ExclusiveGiftPacksDetailView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [giftPack, setGiftPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchGiftPackDetails();
  }, [id]);

  const fetchGiftPackDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/exclusive-gift-packs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch gift pack');
      const data = await response.json();
      setGiftPack(data.data);
    } catch (error) {
      console.error('Error fetching gift pack:', error);
      setError('Failed to load gift pack details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    try {
      setSubmittingReview(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/exclusive-gift-packs/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: parseInt(rating),
          reviewText
        })
      });

      if (!response.ok) throw new Error('Failed to submit review');

      const data = await response.json();
      setGiftPack(data.data);
      setRating(5);
      setReviewText('');
      setShowReviewForm(false);
      setError('');
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!giftPack) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Gift pack not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{giftPack.name}</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {giftPack.images && giftPack.images.length > 0 && (
              <div className="mb-8">
                <div className="relative bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden h-96 mb-4">
                  <img
                    src={giftPack.images[currentImageIndex].url}
                    alt={giftPack.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {giftPack.images.length > 1 && (
                  <div className="flex gap-2">
                    {giftPack.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          idx === currentImageIndex
                            ? 'border-blue-600'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{giftPack.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{giftPack.specialization}</p>
              </div>

              <div className="mb-6">
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  Rs. {giftPack.price.toLocaleString()}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{giftPack.description}</p>
              </div>

              {giftPack.includes && giftPack.includes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What's Included</h3>
                  <div className="flex flex-wrap gap-2">
                    {giftPack.includes.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Category</h3>
                <p className="text-gray-700 dark:text-gray-300">{giftPack.category}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Availability</h3>
                <p className={`text-lg font-semibold ${giftPack.available ? 'text-green-600' : 'text-red-600'}`}>
                  {giftPack.available ? '✓ Available' : '✗ Not Available'}
                </p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reviews</h3>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showReviewForm ? 'Cancel' : 'Write Review'}
                </button>
              </div>

              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRating(r)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              r <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
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
                    disabled={submittingReview}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submittingReview ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Review
                      </>
                    )}
                  </button>
                </form>
              )}

              {giftPack.reviews && giftPack.reviews.length > 0 ? (
                <div className="space-y-4">
                  {giftPack.reviews.map((review, idx) => (
                    <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{review.userName}</p>
                          <div className="flex gap-1">
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
                      <p className="text-gray-700 dark:text-gray-300">{review.reviewText}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>

              <div className="space-y-4">
                {/* Phone */}
                <a
                  href={`tel:${giftPack.contact}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">{giftPack.contact}</span>
                </a>

                {/* Location */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div className="text-gray-700 dark:text-gray-300">
                    <p className="text-sm">{giftPack.location.city}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{giftPack.location.province}</p>
                  </div>
                </div>

                {/* Website */}
                {giftPack.website && (
                  <a
                    href={giftPack.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300 truncate">Visit Website</span>
                  </a>
                )}

                {/* Facebook */}
                {giftPack.facebook && (
                  <a
                    href={giftPack.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300 truncate">Follow on Facebook</span>
                  </a>
                )}
              </div>

              {/* Rating Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {giftPack.averageRating || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(giftPack.averageRating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {giftPack.totalReviews} {giftPack.totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExclusiveGiftPacksDetailView;

