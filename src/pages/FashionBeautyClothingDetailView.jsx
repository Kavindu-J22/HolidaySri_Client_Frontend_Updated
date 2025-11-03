import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FashionBeautyClothingDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/api/fashion-beauty-clothing/${id}`);
        setItem(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load item details');
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setReviewError('Please login to add a review');
        setSubmittingReview(false);
        return;
      }

      const response = await axios.post(
        `/api/fashion-beauty-clothing/${id}/reviews`,
        { rating: parseInt(rating), review },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItem(response.data.data);
      setRating(5);
      setReview('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            onClick={() => interactive && onRate && onRate(i + 1)}
            className={`text-2xl cursor-pointer transition ${
              i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-300' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error || 'Item not found'}</p>
          <button
            onClick={() => navigate('/ads/marketplace/fashion-beauty-clothing')}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/ads/marketplace/fashion-beauty-clothing')}
          className="mb-6 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
        >
          ← Back to Browse
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Main Image */}
              <div className="relative h-96 bg-gray-200 dark:bg-gray-700">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[selectedImage].url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {item.images && item.images.length > 1 && (
                <div className="flex gap-2 p-4 bg-gray-100 dark:bg-gray-700">
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === idx
                          ? 'border-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <img src={img.url} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{item.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {item.specialization} • {item.category}
              </p>

              {/* Price */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  Rs. {item.price.toLocaleString()}
                </p>
              </div>

              {/* Location */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {item.city}, {item.province}
                </p>
              </div>

              {/* Rating */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Overall Rating</p>
                <div className="flex items-center gap-3">
                  {renderStars(item.averageRating || 0)}
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    {item.averageRating ? item.averageRating.toFixed(1) : 'No ratings'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">({item.totalReviews || 0} reviews)</p>
              </div>

              {/* Status */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                <p className={`text-lg font-semibold ${item.available ? 'text-green-600' : 'text-red-600'}`}>
                  {item.available ? '✓ Available' : '✗ Not Available'}
                </p>
              </div>

              {/* Delivery */}
              {item.deliveryAvailable && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 font-semibold">🚚 Delivery Available</p>
                </div>
              )}

              {/* Contact */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Contact</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white break-all">{item.contact}</p>
              </div>

              {/* Payment Methods */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Payment Methods</p>
                <div className="flex flex-wrap gap-2">
                  {item.paymentMethods?.map(method => (
                    <span
                      key={method}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold"
                    >
                      {method.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {item.facebook && (
                  <a
                    href={item.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-semibold transition"
                  >
                    Facebook
                  </a>
                )}
                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-center font-semibold transition"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Description</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.description}</p>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Add Review</h3>

              {reviewError && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
                  {reviewError}
                </div>
              )}

              {reviewSuccess && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg text-sm">
                  Review added successfully!
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating
                  </label>
                  {renderStars(rating, true, setRating)}
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview || !review.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Reviews ({item.reviews?.length || 0})
              </h3>

              {item.reviews && item.reviews.length > 0 ? (
                <div className="space-y-4">
                  {item.reviews.map((rev, idx) => (
                    <div key={idx} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-800 dark:text-white">{rev.userName}</p>
                        {renderStars(rev.rating)}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{rev.review}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionBeautyClothingDetailView;

