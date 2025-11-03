import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Star, Send, Loader, AlertCircle, CheckCircle } from 'lucide-react';
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

  // Review form state
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch package details
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/exclusive-combo-packages/${id}`);
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
      const response = await fetch(`/api/exclusive-combo-packages/${id}/reviews`, {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate('/exclusive-combo-packages')}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Packages</span>
        </button>

        {/* Error and Success Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-700 dark:text-green-300">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-96 bg-gray-200 dark:bg-gray-700">
                {pkg.images && pkg.images.length > 0 ? (
                  <>
                    <img
                      src={pkg.images[currentImageIndex].url}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    {pkg.images.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {pkg.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? 'bg-white w-8'
                                : 'bg-gray-400 hover:bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* Package Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {pkg.title}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                    {pkg.categoryType}
                  </span>
                  <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
};

export default ExclusiveComboPackagesDetailView;

