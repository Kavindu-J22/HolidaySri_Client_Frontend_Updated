import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Globe, Facebook, Instagram, Calendar, Award, Briefcase, Star, MessageCircle, Send, Trash2, Edit2 } from 'lucide-react';

const CreativePhotographersDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photographer, setPhotographer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
          // Get current user info
          const userResponse = await fetch('/api/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setCurrentUser(userData.data);
          }
        }

        // Fetch photographer
        const response = await fetch(`/api/creative-photographers/${id}`);
        const data = await response.json();
        if (data.success) {
          setPhotographer(data.data);
        } else {
          setError('Photographer not found');
        }

        // Fetch reviews
        const reviewsResponse = await fetch(`/api/creative-photographers/${id}/reviews`);
        const reviewsData = await reviewsResponse.json();
        if (reviewsData.success) {
          setReviews(reviewsData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load photographer details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setReviewError('Please login to add a review');
      return;
    }

    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      setReviewError('Please fill in all fields');
      return;
    }

    setReviewLoading(true);
    setReviewError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/creative-photographers/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (data.success) {
        // Add new review to the list
        setReviews([data.data, ...reviews]);
        setReviewForm({ rating: 5, title: '', comment: '' });
        setShowReviewForm(false);

        // Update photographer rating
        const updatedPhotographer = await fetch(`/api/creative-photographers/${id}`);
        const updatedData = await updatedPhotographer.json();
        if (updatedData.success) {
          setPhotographer(updatedData.data);
        }
      } else {
        setReviewError(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewError('Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/creative-photographers/${id}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        setReviews(reviews.filter(r => r._id !== reviewId));

        // Update photographer rating
        const updatedPhotographer = await fetch(`/api/creative-photographers/${id}`);
        const updatedData = await updatedPhotographer.json();
        if (updatedData.success) {
          setPhotographer(updatedData.data);
        }
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading photographer details...</p>
        </div>
      </div>
    );
  }

  if (error || !photographer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/creative-photographers')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Photographers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/creative-photographers')}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
        >
          ← Back to Photographers
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <div className="flex items-start gap-6">
              <img
                src={photographer.avatar?.url}
                alt={photographer.name}
                className="w-32 h-32 rounded-lg object-cover border-4 border-white"
              />
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{photographer.name}</h1>
                <p className="text-blue-100 text-lg mb-4">{photographer.specialization}</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <Award className="w-4 h-4" />
                    <span>{photographer.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4" />
                    <span>{photographer.city}, {photographer.province}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Category & Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{photographer.category}</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rating</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(photographer.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">({photographer.totalReviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">About</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{photographer.description}</p>
            </div>

            {/* Services Included */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Services Included</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photographer.includes?.map((service, index) => (
                  <div key={index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Availability</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weekdays</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{photographer.availability?.weekdays || 'Not specified'}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weekends</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{photographer.availability?.weekends || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Contact Information</h2>
              <div className="space-y-3">
                <a href={`tel:${photographer.contact}`} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-900 dark:text-white">{photographer.contact}</span>
                </a>

                {photographer.website && (
                  <a href={photographer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-900 dark:text-white truncate">{photographer.website}</span>
                  </a>
                )}

                {photographer.social?.facebook && (
                  <a href={photographer.social.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-900 dark:text-white">Facebook</span>
                  </a>
                )}

                {photographer.social?.instagram && (
                  <a href={photographer.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Instagram className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-900 dark:text-white">Instagram</span>
                  </a>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {photographer.available ? '✓ Currently Available' : '✗ Not Available'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => navigate('/creative-photographers')}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => window.location.href = `tel:${photographer.contact}`}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Reviews & Ratings</h2>

            {/* Overall Rating */}
            <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-yellow-600 dark:text-yellow-400">
                    {photographer.averageRating.toFixed(1)}
                  </div>
                  <div className="flex gap-1 mt-2 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(photographer.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {photographer.totalReviews} {photographer.totalReviews === 1 ? 'Review' : 'Reviews'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Based on customer feedback</p>
                </div>
              </div>
            </div>

            {/* Add Review Button */}
            {isAuthenticated && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                {showReviewForm ? 'Cancel' : 'Add Review'}
              </button>
            )}

            {/* Review Form */}
            {showReviewForm && isAuthenticated && (
              <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {reviewError && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                    {reviewError}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Review Title
                    </label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      placeholder="e.g., Excellent photographer!"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      maxLength={100}
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your experience with this photographer..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      maxLength={1000}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}

            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
                Please <button onClick={() => navigate('/login')} className="underline font-semibold">login</button> to add a review.
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{review.userId?.name || 'Anonymous'}</p>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      {currentUser?._id === review.userId?._id && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{review.title}</h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativePhotographersDetail;

