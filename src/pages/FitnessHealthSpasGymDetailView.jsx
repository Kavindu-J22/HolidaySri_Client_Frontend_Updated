import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, Facebook, Globe, Loader, AlertCircle, CheckCircle, X, Share2, Copy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const FitnessHealthSpasGymDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState({ averageRating: 0, totalReviews: 0 });
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/fitness-health-spas-gym/${id}`);
        const data = await response.json();

        if (data.success) {
          setProfile(data.data);
          setError('');
        } else {
          setError(data.message || 'Profile not found');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  // Load reviews and rating
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoadingReviews(true);
        const [reviewsRes, ratingRes] = await Promise.all([
          fetch(`https://holidaysri-backend-9xm4.onrender.com/api/fitness-health-spas-gym-reviews/${id}/reviews`),
          fetch(`https://holidaysri-backend-9xm4.onrender.com/api/fitness-health-spas-gym-reviews/${id}/rating`)
        ]);

        const reviewsData = await reviewsRes.json();
        const ratingData = await ratingRes.json();

        if (reviewsData.success) {
          setReviews(reviewsData.data.reviews);
        }

        if (ratingData.success) {
          setRating(ratingData.data);
        }
      } catch (err) {
        console.error('Error loading reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (id) {
      loadReviews();
    }
  }, [id]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');

    if (!user) {
      setReviewError('Please login to add a review');
      return;
    }

    if (reviewForm.review.trim().length < 10) {
      setReviewError('Review must be at least 10 characters long');
      return;
    }

    setSubmittingReview(true);

    try {
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/fitness-health-spas-gym-reviews/${id}/add-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (data.success) {
        setReviewSuccess(true);
        setReviewForm({ rating: 5, review: '' });
        setShowReviewForm(false);

        // Reload reviews
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setReviewError(data.message || 'Failed to add review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError('Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle share functionality
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Check out ${profile?.name} - Fitness, Health, Spas & Gym on HolidaySri`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setShowShareModal(false);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error || 'Profile not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back and Share Buttons */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Go Back</span>
            <span className="sm:hidden">Back</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Share Success Message */}
        {shareSuccess && (
          <div className="mb-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-300 text-sm sm:text-base">Link copied to clipboard!</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-slate-200 dark:bg-slate-700">
            <img
              src={profile.avatar.url}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
                  <p className="text-lg opacity-90">{profile.category} • {profile.specialization}</p>
                </div>
                <div className="bg-blue-600 px-4 py-2 rounded-full font-semibold">
                  {profile.type}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Rating Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.round(rating.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {rating.averageRating.toFixed(1)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Based on {rating.totalReviews} reviews
                </p>
              </div>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Location</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-slate-900 dark:text-white font-semibold">{profile.city}</p>
                    <p className="text-slate-600 dark:text-slate-400">{profile.province}</p>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Availability</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold text-slate-900 dark:text-white">Weekdays:</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-2">{profile.availability.weekdays}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-slate-900 dark:text-white">Weekends:</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-2">{profile.availability.weekends}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-slate-900 dark:text-white">Status:</span>
                    <span className={`ml-2 ${profile.availability.available ? 'text-green-600' : 'text-red-600'}`}>
                      {profile.availability.available ? 'Available' : 'Not Available'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">About</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {profile.description}
              </p>
            </div>

            {/* Services Included */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Services Included</h3>
              <div className="flex flex-wrap gap-2">
                {profile.includes.map((service, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <a href={`tel:${profile.contact.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {profile.contact.phone}
                  </a>
                </div>
                {profile.contact.facebook && (
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <a href={profile.contact.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Facebook Page
                    </a>
                  </div>
                )}
                {profile.contact.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <a href={profile.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      {profile.contact.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Packages */}
            {profile.packages && profile.packages.url && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Packages</h3>
                <a
                  href={profile.packages.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Download Packages PDF
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reviews</h2>
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {showReviewForm ? 'Cancel' : 'Add Review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-slate-50 dark:bg-slate-700 rounded-lg space-y-4">
              {reviewError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{reviewError}</p>
                </div>
              )}

              {reviewSuccess && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-green-700 dark:text-green-300 text-sm">Review added successfully!</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
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
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                  placeholder="Share your experience..."
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-600 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submittingReview ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {loadingReviews ? (
            <div className="flex justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {review.userId?.name || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{review.review}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm sm:text-base text-slate-600 dark:text-slate-400 py-6 sm:py-8">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Share Profile</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <Facebook className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Facebook</span>
                </button>

                <button
                  onClick={() => handleShare('twitter')}
                  className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded-xl transition group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sky-500 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Twitter</span>
                </button>

                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleShare('copy')}
                  className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <Copy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessHealthSpasGymDetailView;

