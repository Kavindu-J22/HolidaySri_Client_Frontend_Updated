import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, MessageCircle, Phone, Globe, Facebook, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfessionalLawyersDetailView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [lawyer, setLawyer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: ''
  });

  // Fetch lawyer details and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/professional-lawyers/${id}`);
        const data = await response.json();

        if (data.success) {
          setLawyer(data.data);
          setReviews(data.data.reviews || []);

          // Check if user has already reviewed
          if (user && data.data.reviews) {
            const hasReviewed = data.data.reviews.some(r => r.userId._id === user._id);
            setUserHasReviewed(hasReviewed);
          }
        } else {
          setError('Failed to load lawyer details');
        }
      } catch (error) {
        console.error('Error fetching lawyer:', error);
        setError('Failed to load lawyer details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to add a review');
      return;
    }

    if (!reviewForm.review.trim()) {
      setError('Please write a review');
      return;
    }

    setSubmittingReview(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/professional-lawyers/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: parseInt(reviewForm.rating),
          review: reviewForm.review
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Review added successfully!');
        setReviewForm({ rating: 5, review: '' });
        setShowReviewForm(false);
        setUserHasReviewed(true);

        // Refresh reviews
        const refreshRes = await fetch(`/api/professional-lawyers/${id}`);
        const refreshData = await refreshRes.json();
        if (refreshData.success) {
          setLawyer(refreshData.data);
          setReviews(refreshData.data.reviews || []);
        }

        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to add review. Please try again.');
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

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Lawyer Not Found
          </h2>
          <button
            onClick={() => navigate('/professional-lawyers')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Lawyers
          </button>
        </div>
      </div>
    );
  }

  const avgRating = lawyer.averageRating || 0;
  const totalReviews = lawyer.totalReviews || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/professional-lawyers')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Lawyers</span>
        </button>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-700 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <img
                src={lawyer.avatar?.url}
                alt={lawyer.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white"
              />

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{lawyer.name}</h1>
                <p className="text-blue-100 text-lg mb-3">{lawyer.specialization}</p>

                {/* Rating */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(avgRating)
                            ? 'fill-yellow-300 text-yellow-300'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">
                    {avgRating.toFixed(1)} ({totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Professional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Professional Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                    <p className="text-gray-900 dark:text-white font-medium">{lawyer.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
                    <p className="text-gray-900 dark:text-white font-medium">{lawyer.experience} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {lawyer.available ? '✓ Available' : '✗ Not Available'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Location & Contact
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {lawyer.city}, {lawyer.province}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 mt-4">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <a
                      href={`tel:${lawyer.contact}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {lawyer.contact}
                    </a>
                  </div>
                  {lawyer.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <a
                        href={lawyer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  {lawyer.facebook && (
                    <div className="flex items-center space-x-3">
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <a
                        href={lawyer.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Facebook
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                About
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {lawyer.description}
              </p>
            </div>

            {/* Availability */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Availability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lawyer.weekdays && lawyer.weekdays.length > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Weekdays</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {lawyer.weekdays.join(', ')}
                    </p>
                  </div>
                )}
                {lawyer.weekends && lawyer.weekends.length > 0 && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Weekends</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {lawyer.weekends.join(', ')}
                    </p>
                  </div>
                )}
                {lawyer.times && lawyer.times.length > 0 && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Time Slots</p>
                    <div className="space-y-1">
                      {lawyer.times.slice(0, 2).map((time, idx) => (
                        <p key={idx} className="text-sm text-gray-900 dark:text-white font-medium">
                          {time}
                        </p>
                      ))}
                      {lawyer.times.length > 2 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          +{lawyer.times.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Reviews ({totalReviews})</span>
                </h3>
                {user && !userHasReviewed && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {showReviewForm ? 'Cancel' : 'Add Review'}
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && !userHasReviewed && (
                <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Rating
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 cursor-pointer transition-colors ${
                              star <= reviewForm.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewForm.review}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                      rows="4"
                      placeholder="Share your experience with this lawyer..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {review.userId?.name || 'Anonymous'}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
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
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.review}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLawyersDetailView;

