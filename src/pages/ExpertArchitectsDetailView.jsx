import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, MapPin, Phone, Globe, Facebook, Loader, AlertCircle, ArrowLeft, Eye, MessageSquare, Award, Briefcase, Calendar, CheckCircle } from 'lucide-react';

const ExpertArchitectsDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [architect, setArchitect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: ''
  });

  useEffect(() => {
    fetchArchitectDetails();
  }, [id]);

  // Fetch architect details
  const fetchArchitectDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expert-architects/${id}`);
      if (!response.ok) throw new Error('Failed to fetch architect');

      const data = await response.json();
      setArchitect(data.data);
      setReviews(data.data.reviews || []);
    } catch (err) {
      console.error('Error fetching architect:', err);
      setError('Failed to load architect details');
    } finally {
      setLoading(false);
    }
  };

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
      const response = await fetch(`/api/expert-architects/${id}/reviews`, {
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
        setShowSuccessModal(true);
        setReviewForm({ rating: 5, review: '' });
        setShowReviewForm(false);
        setArchitect(data.data);
        setReviews(data.data.reviews || []);
      } else {
        setError(data.message || 'Failed to add review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to add review');
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

  if (!architect) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="w-12 h-12 text-red-600 mr-4" />
        <p className="text-lg text-gray-600">Architect not found</p>
      </div>
    );
  }

  const avgRating = architect.averageRating || 0;
  const totalReviews = architect.totalReviews || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/expert-architects-browse')}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Architects</span>
            <span className="sm:hidden">Back</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">({totalReviews})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Background */}
        <div className="relative mb-8">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-90 dark:opacity-70"></div>

          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8 lg:p-12 text-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 items-start">
              {/* Avatar */}
              <div className="flex justify-center sm:justify-start">
                <div className="relative">
                  <img
                    src={architect.avatar?.url}
                    alt={architect.name}
                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover border-4 border-white shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-3 border-4 border-white shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="sm:col-span-2 flex flex-col justify-center">
                <div className="mb-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">{architect.name}</h1>
                  <p className="text-lg sm:text-xl text-blue-100 font-semibold">{architect.specialization}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm text-blue-100">Experience</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">{architect.experience}y</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm text-blue-100">Views</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">{architect.viewCount || 0}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm text-blue-100">Reviews</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">{totalReviews}</p>
                  </div>
                </div>

                {/* Rating Display */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(avgRating)
                            ? 'fill-yellow-300 text-yellow-300'
                            : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">{avgRating.toFixed(1)} out of 5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3 animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">About</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">{architect.description}</p>
            </div>

            {/* Portfolio Section */}
            {architect.images && architect.images.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Portfolio</h2>
                  <span className="ml-auto text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {architect.images.length} projects
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {architect.images.map((img, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all">
                      <img
                        src={img.url}
                        alt={`Portfolio ${idx + 1}`}
                        className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Reviews & Ratings</h2>
                </div>
                {user && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2 justify-center sm:justify-start"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {showReviewForm ? 'Cancel' : 'Add Review'}
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && user && (
                <form onSubmit={handleSubmitReview} className="mb-8 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-blue-100 dark:border-gray-600">
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Your Rating</label>
                    <div className="flex items-center space-x-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          className="focus:outline-none transition-all hover:scale-125"
                        >
                          <Star
                            className={`w-8 h-8 sm:w-10 sm:h-10 ${
                              star <= reviewForm.rating
                                ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                                : 'text-gray-300 dark:text-gray-500'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-300">{reviewForm.rating}/5</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Your Review</label>
                    <textarea
                      value={reviewForm.review}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                      rows="5"
                      placeholder="Share your experience with this architect..."
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submittingReview ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Submit Review
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review, idx) => (
                    <div key={idx} className="p-5 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">{review.userName}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-500'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-400">{review.rating}/5</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.review}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Professional Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Professional Info</h3>
              </div>

              <div className="space-y-5">
                {/* Category */}
                <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Specialization</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{architect.specialization}</p>
                </div>

                {/* Category */}
                <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Category</p>
                  <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-semibold">
                    {architect.category}
                  </div>
                </div>

                {/* Experience */}
                <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Experience</p>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{architect.experience} Years</p>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Location</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{architect.city}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{architect.province}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="w-6 h-6 text-green-600" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Get in Touch</h3>
              </div>

              <div className="space-y-4">
                {/* Phone */}
                <a
                  href={`tel:${architect.contact}`}
                  className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors group"
                >
                  <Phone className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Phone</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{architect.contact}</p>
                  </div>
                </a>

                {/* Website */}
                {architect.website && (
                  <a
                    href={architect.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group"
                  >
                    <Globe className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Website</p>
                      <p className="font-semibold text-blue-600 dark:text-blue-400 truncate">Visit Website</p>
                    </div>
                  </a>
                )}

                {/* Facebook */}
                {architect.facebook && (
                  <a
                    href={architect.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group"
                  >
                    <Facebook className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Facebook</p>
                      <p className="font-semibold text-blue-600 dark:text-blue-400 truncate">Follow Us</p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Availability Card */}
            {(architect.availability?.weekdays || architect.availability?.weekends) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Availability</h3>
                </div>
                <div className="space-y-4">
                  {architect.availability?.weekdays && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Weekdays</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{architect.availability.weekdays}</p>
                    </div>
                  )}
                  {architect.availability?.weekends && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Weekends</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{architect.availability.weekends}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">Success!</h2>
            <p className="text-center text-gray-700 dark:text-gray-300 mb-8 text-base sm:text-lg">Your review has been added successfully. Thank you for sharing your experience!</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertArchitectsDetailView;

