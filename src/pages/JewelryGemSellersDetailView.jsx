import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, MapPin, Phone, Globe, Facebook, Loader, AlertCircle, ArrowLeft, Eye, MessageSquare, Award, Briefcase, Calendar, CheckCircle } from 'lucide-react';

const JewelryGemSellersDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [seller, setSeller] = useState(null);
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
    fetchSellerDetails();
  }, [id]);

  // Fetch seller details
  const fetchSellerDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jewelry-gem-sellers/${id}`);
      if (!response.ok) throw new Error('Failed to fetch seller');

      const data = await response.json();
      setSeller(data.data);
      setReviews(data.data.reviews || []);
    } catch (err) {
      console.error('Error fetching seller:', err);
      setError('Failed to load seller details');
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
      const response = await fetch(`/api/jewelry-gem-sellers/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (data.success) {
        setSeller(data.data);
        setReviews(data.data.reviews || []);
        setReviewForm({ rating: 5, review: '' });
        setShowReviewForm(false);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      } else {
        setError(data.message || 'Failed to add review');
      }
    } catch (err) {
      console.error('Error adding review:', err);
      setError('Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader className="w-12 h-12 text-amber-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/ads/marketplace/jewelry-gem-sellers')}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/ads/marketplace/jewelry-gem-sellers')}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Jewelry Sellers</span>
            <span className="sm:hidden">Back</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{seller.viewCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <CheckCircle className="w-5 h-5" />
            <span>Review added successfully!</span>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">About</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">{seller.description}</p>
            </div>

            {/* Details Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <Briefcase className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Specialization</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{seller.specialization}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Award className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Category</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{seller.category}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Experience</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{seller.experience} years</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Location</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{seller.city}, {seller.province}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Section */}
            {(seller.availability?.weekdays || seller.availability?.weekends) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full"></div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Availability</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {seller.availability?.weekdays && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Weekdays</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{seller.availability.weekdays}</p>
                    </div>
                  )}
                  {seller.availability?.weekends && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Weekends</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{seller.availability.weekends}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gallery Section */}
            {seller.images && seller.images.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full"></div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Gallery</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {seller.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-64 object-cover rounded-lg hover:shadow-lg transition-shadow"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Reviews</h2>
              </div>

              {/* Review Form */}
              {!showReviewForm ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Add Review
                </button>
              ) : (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Rating (1-5 stars)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          className={`text-3xl transition-colors ${
                            star <= reviewForm.rating ? 'text-amber-500' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewForm.review}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Share your experience..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review, idx) => (
                    <div key={idx} className="border-l-4 border-amber-600 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900 dark:text-white">{review.userName}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.review}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 sticky top-24 space-y-6">
              {/* Name and Rating */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">{seller.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(seller.averageRating || 0)
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {seller.averageRating || 'N/A'}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({seller.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6">
                {seller.contact && (
                  <a
                    href={`tel:${seller.contact}`}
                    className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition"
                  >
                    <Phone className="w-5 h-5 text-amber-600" />
                    <span className="text-gray-900 dark:text-white font-medium">{seller.contact}</span>
                  </a>
                )}

                {seller.website && (
                  <a
                    href={seller.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                  >
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900 dark:text-white font-medium">Website</span>
                  </a>
                )}

                {seller.facebook && (
                  <a
                    href={seller.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900 dark:text-white font-medium">Facebook</span>
                  </a>
                )}
              </div>

              {/* Status Badge */}
              {seller.available && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">✓ Currently Available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelryGemSellersDetailView;

