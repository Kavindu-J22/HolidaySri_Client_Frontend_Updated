import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Loader, Send, MapPin, Phone, Globe, Facebook } from 'lucide-react';

const OtherItemsDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    reviewText: ''
  });

  useEffect(() => {
    fetchItemDetail();
  }, [id]);

  const fetchItemDetail = async () => {
    try {
      const response = await fetch(`/api/other-items/${id}`);
      const data = await response.json();

      if (data.success) {
        setItem(data.data);
        setError('');
      } else {
        setError('Failed to load item details');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      setError('Error loading item details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewForm.rating || !reviewForm.reviewText.trim()) {
      alert('Please provide both rating and review text');
      return;
    }

    setSubmittingReview(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/other-items/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (data.success) {
        setItem(data.data);
        setReviewForm({ rating: 5, reviewText: '' });
        alert('Review added successfully!');
      } else {
        alert(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Item not found'}</p>
          <button
            onClick={() => navigate('/other-items')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Back to Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/other-items')}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          ← Back to Items
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Main Image */}
              <div className="relative h-96 bg-gray-200 dark:bg-gray-700">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[currentImageIndex].url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {item.images && item.images.length > 1 && (
                <div className="flex gap-2 p-4 bg-gray-50 dark:bg-gray-700">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index
                          ? 'border-blue-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Item Details */}
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {item.specialization}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(item.averageRating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    {item.averageRating || 'N/A'}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    ({item.totalReviews || 0} reviews)
                  </span>
                </div>

                {/* Price */}
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                  LKR {item.price.toLocaleString()}
                </p>

                {/* Category & Location */}
                <div className="space-y-3 mb-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Category:</span> {item.category}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {item.city}, {item.province}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Availability:</span>{' '}
                    <span className={item.available ? 'text-green-600' : 'text-red-600'}>
                      {item.available ? 'Available' : 'Not Available'}
                    </span>
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Payment Methods
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.paymentMethods.map(method => (
                      <span
                        key={method}
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {method === 'COD' ? 'Cash on Delivery' : method.charAt(0).toUpperCase() + method.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Delivery */}
                {item.delivery && (
                  <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-800 dark:text-green-300 font-semibold">
                      ✓ Delivery Available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Reviews */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>

              <div className="space-y-3">
                <a
                  href={`tel:${item.contact}`}
                  className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                >
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">{item.contact}</span>
                </a>

                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                  >
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">Website</span>
                  </a>
                )}

                {item.facebook && (
                  <a
                    href={item.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">Facebook</span>
                  </a>
                )}
              </div>
            </div>

            {/* Add Review Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Add Review
              </h3>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= reviewForm.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Review *
                  </label>
                  <textarea
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, reviewText: e.target.value }))}
                    rows="4"
                    placeholder="Share your experience..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
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
              </form>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {item.reviews && item.reviews.length > 0 && (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Customer Reviews ({item.reviews.length})
            </h3>

            <div className="space-y-4">
              {item.reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {review.userName}
                      </p>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {review.reviewText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherItemsDetailView;

