import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Globe,
  Star,
  Loader,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign
} from 'lucide-react';

const SouvenirsCollectiblesDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [souvenirsCollectibles, setSouvenirsCollectibles] = useState(null);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [userReview, setUserReview] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch souvenirs & collectibles detail
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`/api/souvenirs-collectibles/${id}`);
        const data = await response.json();

        if (data.success) {
          setSouvenirsCollectibles(data.data);
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
          setError('Failed to load souvenirs & collectibles details');
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
      const response = await fetch(`/api/souvenirs-collectibles/${id}/review`, {
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
        setSouvenirsCollectibles(prev => ({
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

  if (!souvenirsCollectibles) {
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
            <p className="text-red-800 dark:text-red-200">{error || 'Souvenirs & Collectibles not found'}</p>
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
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
            className={`transition-colors ${interactive ? 'cursor-pointer' : ''}`}
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

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === souvenirsCollectibles.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? souvenirsCollectibles.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {souvenirsCollectibles.images && souvenirsCollectibles.images.length > 0 ? (
              <div className="relative">
                <img
                  src={souvenirsCollectibles.images[currentImageIndex].url}
                  alt={souvenirsCollectibles.images[currentImageIndex].alt}
                  className="w-full h-96 object-cover"
                />
                {souvenirsCollectibles.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {souvenirsCollectibles.images.map((_, idx) => (
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
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}

            {/* Thumbnail Gallery */}
            {souvenirsCollectibles.images && souvenirsCollectibles.images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {souvenirsCollectibles.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      idx === currentImageIndex
                        ? 'border-blue-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {souvenirsCollectibles.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {souvenirsCollectibles.specialization}
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(souvenirsCollectibles.averageRating))}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({souvenirsCollectibles.totalReviews} reviews)
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  souvenirsCollectibles.available
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  {souvenirsCollectibles.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                <DollarSign className="w-8 h-8" />
                <span>{souvenirsCollectibles.price.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">LKR</p>
            </div>

            {/* Category and Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {souvenirsCollectibles.category}
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Location
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {souvenirsCollectibles.location.city}, {souvenirsCollectibles.location.province}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {souvenirsCollectibles.description}
              </p>
            </div>

            {/* Includes */}
            {souvenirsCollectibles.includes && souvenirsCollectibles.includes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  What's Included
                </h3>
                <div className="flex flex-wrap gap-2">
                  {souvenirsCollectibles.includes.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <a
                  href={`tel:${souvenirsCollectibles.contact.phone}`}
                  className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>{souvenirsCollectibles.contact.phone}</span>
                </a>
                <a
                  href={`mailto:${souvenirsCollectibles.contact.email}`}
                  className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>{souvenirsCollectibles.contact.email}</span>
                </a>
                {souvenirsCollectibles.website && (
                  <a
                    href={souvenirsCollectibles.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Visit Website</span>
                  </a>
                )}
                {souvenirsCollectibles.facebook && (
                  <a
                    href={souvenirsCollectibles.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>Facebook</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Reviews & Ratings
          </h2>

          {/* Add Review Form */}
          {user && !userReview && (
            <form onSubmit={handleReviewSubmit} className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add Your Review
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
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Share your experience..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {souvenirsCollectibles.reviews && souvenirsCollectibles.reviews.length > 0 ? (
              souvenirsCollectibles.reviews.map((review, idx) => (
                <div key={idx} className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
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
                  <p className="text-gray-600 dark:text-gray-400">{review.reviewText}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SouvenirsCollectiblesDetailView;

