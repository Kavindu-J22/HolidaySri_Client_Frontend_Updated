import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Facebook,
  MessageCircle,
  Star,
  Loader,
  AlertCircle,
  Truck,
  CheckCircle
} from 'lucide-react';

const FoodsBeveragesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [foodsBeverages, setFoodsBeverages] = useState(null);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [userReview, setUserReview] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch foods & beverages detail
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`/api/foods-beverages/${id}`);
        const data = await response.json();

        if (data.success) {
          setFoodsBeverages(data.data);
          // Check if user has already reviewed
          const existingReview = data.data.reviews.find(
            r => r.userId === user?._id
          );
          if (existingReview) {
            setUserReview(existingReview);
            setRating(existingReview.rating);
            setReviewText(existingReview.reviewText);
          }
        } else {
          setError('Failed to load foods & beverages details');
        }
      } catch (error) {
        console.error('Error fetching detail:', error);
        setError('Failed to load details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, user?._id]);

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to add a review');
      return;
    }

    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/foods-beverages/${id}/review`, {
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
        // Update local state
        setFoodsBeverages(prev => ({
          ...prev,
          averageRating: data.data.averageRating,
          totalReviews: data.data.totalReviews,
          reviews: data.data.reviews
        }));
        setUserReview(data.data.reviews.find(r => r.userId === user._id));
        setReviewText('');
        setRating(0);
      } else {
        setError(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error adding review:', error);
      setError('Failed to add review');
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

  if (!foodsBeverages) {
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
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error || 'Foods & Beverages not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const renderStars = (value, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type={interactive ? 'button' : 'div'}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            disabled={!interactive}
            className={`transition-colors ${
              interactive ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= (interactive ? hoverRating || rating : value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="relative bg-gray-200 dark:bg-gray-700 aspect-video">
                <img
                  src={foodsBeverages.images[currentImageIndex]?.url}
                  alt={foodsBeverages.images[currentImageIndex]?.alt}
                  className="w-full h-full object-cover"
                />
                {foodsBeverages.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? foodsBeverages.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === foodsBeverages.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {foodsBeverages.images.length > 1 && (
                <div className="flex gap-2 p-4 bg-gray-100 dark:bg-gray-700">
                  {foodsBeverages.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === currentImageIndex
                          ? 'border-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {foodsBeverages.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {foodsBeverages.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    LKR {foodsBeverages.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  {renderStars(foodsBeverages.averageRating)}
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {foodsBeverages.averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  ({foodsBeverages.totalReviews} reviews)
                </span>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {foodsBeverages.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
                {foodsBeverages.delivery && (
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Delivery Available</span>
                  </div>
                )}
              </div>

              {/* Types */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Product Types:</h3>
                <div className="flex flex-wrap gap-2">
                  {foodsBeverages.type.map(t => (
                    <span
                      key={t}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description:</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {foodsBeverages.description}
                </p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Reviews ({foodsBeverages.totalReviews})
              </h2>

              {/* Add Review Form */}
              {user && (
                <form onSubmit={handleReviewSubmit} className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    {userReview ? 'Update Your Review' : 'Add Your Review'}
                  </h3>

                  {error && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating *
                    </label>
                    {renderStars(rating, true)}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Review (Optional)
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      maxLength={1000}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Share your experience..."
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {reviewText.length}/1000 characters
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>{userReview ? 'Update Review' : 'Submit Review'}</span>
                    )}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {foodsBeverages.reviews.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    No reviews yet. Be the first to review!
                  </p>
                ) : (
                  foodsBeverages.reviews.map((review, idx) => (
                    <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {review.userName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      {review.reviewText && (
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                          {review.reviewText}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h2>

              {/* Location */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {foodsBeverages.location.city}, {foodsBeverages.location.province}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                    <a
                      href={`tel:${foodsBeverages.contact.phone}`}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {foodsBeverages.contact.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                    <a
                      href={`mailto:${foodsBeverages.contact.email}`}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline break-all"
                    >
                      {foodsBeverages.contact.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Facebook */}
              {foodsBeverages.contact.facebook && (
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Facebook</p>
                      <a
                        href={foodsBeverages.contact.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        Visit Profile
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              {foodsBeverages.contact.whatsapp && (
                <div>
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">WhatsApp</p>
                      <a
                        href={`https://wa.me/${foodsBeverages.contact.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-green-600 dark:text-green-400 hover:underline"
                      >
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodsBeveragesDetail;

