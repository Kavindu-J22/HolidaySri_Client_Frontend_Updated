import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Phone, MessageCircle, Globe, Facebook, Download, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TrustedAstrologistsDetailView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [astrologist, setAstrologist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchAstrologistDetails();
  }, [id]);

  // Fetch astrologist details
  const fetchAstrologistDetails = async () => {
    try {
      const response = await fetch(`/api/trusted-astrologists/${id}`);
      if (!response.ok) throw new Error('Failed to fetch details');

      const data = await response.json();
      setAstrologist(data.data);
      setReviews(data.data.reviews || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching details:', err);
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  // Handle submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to add a review');
      return;
    }

    if (!reviewText.trim()) {
      setError('Please write a review');
      return;
    }

    try {
      setSubmittingReview(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/trusted-astrologists/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: parseInt(rating),
          review: reviewText
        })
      });

      if (!response.ok) throw new Error('Failed to submit review');

      const data = await response.json();
      setAstrologist(data.data);
      setReviews(data.data.reviews || []);
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

  // Render star rating
  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type={interactive ? 'button' : 'div'}
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer focus:outline-none transition-transform hover:scale-110' : ''}
          >
            <Star
              className={`w-5 h-5 ${
                star <= Math.round(rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
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

  if (!astrologist) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Not Found
          </h2>
          <button
            onClick={() => navigate('/trusted-astrologists')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/trusted-astrologists')}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Browse
        </button>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
            {/* Avatar */}
            <div className="md:col-span-1">
              <div className="relative">
                {astrologist.avatar?.url ? (
                  <img
                    src={astrologist.avatar.url}
                    alt={astrologist.name}
                    className="w-full h-64 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-64 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-6xl font-bold">
                    {astrologist.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Availability Badge */}
              <div className="mt-4">
                {astrologist.available ? (
                  <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                    ✓ Available
                  </span>
                ) : (
                  <span className="inline-block px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-semibold">
                    ✗ Not Available
                  </span>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {astrologist.name}
              </h1>

              <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-1">
                {astrologist.specialization}
              </p>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {astrologist.category}
              </p>

              {/* Rating */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  {renderStars(astrologist.averageRating || 0)}
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {astrologist.averageRating ? astrologist.averageRating.toFixed(1) : 'N/A'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on {astrologist.totalReviews || 0} reviews • {astrologist.viewCount || 0} views
                </p>
              </div>

              {/* Experience & Location */}
              <div className="space-y-2 mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Experience:</span> {astrologist.experience} years
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Location:</span> {astrologist.city}, {astrologist.province}
                </p>
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${astrologist.contact}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
                <a
                  href={`https://wa.me/${astrologist.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                {astrologist.website && (
                  <a
                    href={astrologist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                {astrologist.facebook && (
                  <a
                    href={astrologist.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition font-semibold"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                )}
                {astrologist.pricingPDF?.url && (
                  <a
                    href={astrologist.pricingPDF.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Pricing
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {astrologist.description}
          </p>
        </div>

        {/* Schedule */}
        {(astrologist.schedule?.weekdays || astrologist.schedule?.weekends) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {astrologist.schedule?.weekdays && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Weekdays
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {astrologist.schedule.weekdays}
                  </p>
                </div>
              )}
              {astrologist.schedule?.weekends && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Weekends
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {astrologist.schedule.weekends}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reviews & Ratings
            </h2>
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                {showReviewForm ? 'Cancel' : 'Add Review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && user && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {renderStars(rating, true, setRating)}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="4"
                  placeholder="Share your experience..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold flex items-center justify-center gap-2"
              >
                {submittingReview ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {review.userName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {review.review}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                No reviews yet. Be the first to review!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrustedAstrologistsDetailView;

