import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, Phone, Mail, Globe, Facebook, FileText, 
  Award, Eye, Loader, MapPin, Send, User 
} from 'lucide-react';

const LocalSimMobileDataDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Fetch profile
  useEffect(() => {
    fetchProfile();
    fetchReviews();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/local-sim-mobile-data/${id}`);
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`/api/local-sim-mobile-data/${id}/reviews`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!reviewForm.review.trim()) {
      setReviewError('Please write a review');
      return;
    }

    setSubmittingReview(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setReviewError('Please login to submit a review');
        setSubmittingReview(false);
        return;
      }

      const response = await fetch(`/api/local-sim-mobile-data/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (data.success) {
        setReviewSuccess('Review submitted successfully!');
        setReviewForm({ rating: 5, review: '' });
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSuccess('');
          fetchProfile();
          fetchReviews();
        }, 2000);
      } else {
        setReviewError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={() => navigate('/ads/special-opportunities/local-sim-mobile-data')}
            className="btn-primary"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/ads/special-opportunities/local-sim-mobile-data')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Browse
        </button>

        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Logo */}
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center p-4">
                {profile.logo && profile.logo.url ? (
                  <img
                    src={profile.logo.url}
                    alt={profile.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-blue-600 text-5xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                <p className="text-blue-100 text-lg mb-4">{profile.category}</p>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-white">
                    <Award className="w-5 h-5" />
                    <span>{profile.experienceYears} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Eye className="w-5 h-5" />
                    <span>{profile.viewCount || 0} Views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {profile.averageRating ? profile.averageRating.toFixed(1) : '0.0'}
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= (profile.averageRating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {profile.totalReviews || 0} reviews
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center gap-2"
              >
                <Star className="w-5 h-5" />
                Write a Review
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {profile.description}
              </p>
            </div>

            {/* Specialties */}
            {profile.specialties && profile.specialties.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Packages PDF */}
            {profile.packagesPDF && profile.packagesPDF.url && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Packages</h2>
                <a
                  href={profile.packagesPDF.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FileText className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {profile.packagesPDF.fileName || 'View Packages'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click to view PDF</p>
                  </div>
                </a>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Reviews ({reviews.length})
              </h2>

              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {review.userId?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {review.userId?.name || 'Anonymous'}
                            </h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">{review.review}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>

              <div className="space-y-4">
                {/* Contact */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contact</p>
                    <p className="font-medium text-gray-900 dark:text-white">{profile.contact}</p>
                  </div>
                </div>

                {/* Facebook */}
                {profile.facebook && (
                  <div className="flex items-start gap-3">
                    <Facebook className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Facebook</p>
                      <a
                        href={profile.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        Visit Page
                      </a>
                    </div>
                  </div>
                )}

                {/* Website */}
                {profile.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Website</p>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Write a Review</h3>

              {reviewError && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 dark:text-red-300">{reviewError}</p>
                </div>
              )}

              {reviewSuccess && (
                <div className="mb-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-green-700 dark:text-green-300">{reviewSuccess}</p>
                </div>
              )}

              <form onSubmit={handleSubmitReview}>
                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= reviewForm.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          } hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={reviewForm.review}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                    rows="4"
                    placeholder="Share your experience..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewModal(false);
                      setReviewError('');
                      setReviewSuccess('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalSimMobileDataDetailView;

