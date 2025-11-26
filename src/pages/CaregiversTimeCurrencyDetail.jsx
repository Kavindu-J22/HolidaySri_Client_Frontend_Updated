import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Star,
  Clock,
  Heart,
  Globe,
  Facebook,
  Languages,
  CheckCircle,
  XCircle,
  Send,
  Copy,
  Check,
  ArrowRightLeft
} from 'lucide-react';

const CaregiversTimeCurrencyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [copiedCareId, setCopiedCareId] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Copy careID to clipboard
  const handleCopyCareId = () => {
    if (profile?.careID) {
      navigator.clipboard.writeText(profile.careID);
      setCopiedCareId(true);
      setTimeout(() => setCopiedCareId(false), 2000);
    }
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://holidaysri-backend-9xm4.onrender.com/api/caregivers-time-currency/${id}`
        );

        if (response.data.success) {
          setProfile(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://holidaysri-backend-9xm4.onrender.com/api/caregivers-time-currency/${id}/reviews`
        );

        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, [id]);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `https://holidaysri-backend-9xm4.onrender.com/api/caregivers-time-currency/${id}/transactions`
        );

        if (response.data.success) {
          setTransactions(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    fetchTransactions();
  }, [id]);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setReviewError('Please login to submit a review');
        return;
      }

      if (rating === 0) {
        setReviewError('Please select a rating');
        return;
      }

      if (!reviewText.trim()) {
        setReviewError('Please write a review');
        return;
      }

      const response = await axios.post(
        `https://holidaysri-backend-9xm4.onrender.com/api/caregivers-time-currency/${id}/review`,
        {
          rating,
          review: reviewText
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setReviewSuccess('Review submitted successfully!');
        setRating(0);
        setReviewText('');
        setShowReviewForm(false);

        // Refresh reviews
        const reviewsResponse = await axios.get(
          `https://holidaysri-backend-9xm4.onrender.com/api/caregivers-time-currency/${id}/reviews`
        );
        if (reviewsResponse.data.success) {
          setReviews(reviewsResponse.data.data);
        }

        // Refresh profile to update average rating
        const profileResponse = await axios.get(
          `https://holidaysri-backend-9xm4.onrender.com/api/caregivers-time-currency/${id}`
        );
        if (profileResponse.data.success) {
          setProfile(profileResponse.data.data);
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Render star rating
  const renderStars = (count, interactive = false, onStarClick = null) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 32 : 20}
            className={`${
              star <= count
                ? 'text-yellow-500 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onStarClick && onStarClick(star)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 text-center max-w-md">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <XCircle className="text-red-600 dark:text-red-400" size={36} />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Profile Not Found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
            {error || 'The profile you are looking for does not exist or has been removed.'}
          </p>
          <button
            onClick={() => navigate('/caregivers-time-currency-browse')}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 px-3 sm:px-4 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/caregivers-time-currency-browse')}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to Browse
        </button>

        {/* Success Message */}
        {reviewSuccess && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 flex items-start sm:items-center text-sm sm:text-base">
            <CheckCircle className="mr-2 flex-shrink-0 mt-0.5 sm:mt-0" size={18} />
            <span>{reviewSuccess}</span>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8">
          <div className="relative h-48 sm:h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
            <img
              src={profile.avatar?.url || '/default-avatar.png'}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white dark:bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
              <div className="flex items-center">
                <Clock className="text-blue-600 dark:text-blue-400 mr-1 sm:mr-2" size={16} />
                <span className="text-sm sm:text-lg font-bold text-gray-700 dark:text-gray-300">
                  HSTC: {profile.HSTC}h
                </span>
              </div>
            </div>
            {profile.type === 'Care Giver' && (
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-blue-600 dark:bg-blue-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                Care Giver
              </div>
            )}
            {profile.type === 'Care Needer' && (
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-purple-600 dark:bg-purple-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                Care Needer
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 sm:mb-6 gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile.name}
                </h1>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2 text-sm sm:text-base">
                  <MapPin size={16} className="mr-2 flex-shrink-0" />
                  <span className="truncate">{profile.city}, {profile.province}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3 text-sm sm:text-base">
                  <Phone size={16} className="mr-2 flex-shrink-0" />
                  <span className="truncate">{profile.contact}</span>
                </div>
                {/* Care ID with Copy */}
                <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-blue-200 dark:border-blue-700 max-w-full">
                  <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 mr-2 sm:mr-3 truncate">
                    Care ID: {profile.careID}
                  </span>
                  <button
                    onClick={handleCopyCareId}
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-white dark:bg-gray-700 px-2 sm:px-3 py-1 rounded-md shadow-sm hover:shadow-md flex-shrink-0"
                    title="Copy Care ID"
                  >
                    {copiedCareId ? (
                      <>
                        <Check size={14} className="text-green-600 dark:text-green-400 mr-1" />
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="mr-1" />
                        <span className="text-xs font-semibold">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Rating Display */}
              <div className="mt-4 md:mt-0 text-center md:text-right flex-shrink-0">
                {profile.averageRating > 0 ? (
                  <>
                    <div className="flex items-center justify-center md:justify-end mb-2">
                      {renderStars(Math.round(profile.averageRating))}
                      <span className="ml-2 text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-300">
                        {profile.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Based on {profile.totalReviews} {profile.totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No reviews yet</p>
                )}
              </div>
            </div>

            {/* Availability Status */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              {profile.available && (
                <span className="flex items-center bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm">
                  <CheckCircle className="mr-1 sm:mr-2" size={16} />
                  Available
                </span>
              )}
              {profile.occupied && (
                <span className="flex items-center bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm">
                  <XCircle className="mr-1 sm:mr-2" size={16} />
                  Occupied
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">About</h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.description}
              </p>
            </div>

            {/* Type-Specific Details */}
            {profile.type === 'Care Giver' && profile.careGiverDetails && (
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">Care Giver Details</h2>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 sm:p-6">
                  <div className="mb-4">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Experience</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {profile.careGiverDetails.experience} years
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Services Provided</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.careGiverDetails.services?.map((service, index) => (
                        <span
                          key={index}
                          className="bg-blue-600 dark:bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {profile.type === 'Care Needer' && profile.careNeederDetails && (
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">Care Needer Details</h2>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 sm:p-6">
                  <div className="mb-4">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Reason for Needing Care</p>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                      {profile.careNeederDetails.reason}
                    </p>
                  </div>
                  {profile.careNeederDetails.specialNeeds?.length > 0 && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Special Needs</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.careNeederDetails.specialNeeds.map((need, index) => (
                          <span
                            key={index}
                            className="bg-purple-600 dark:bg-purple-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                          >
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Languages */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <Languages className="mr-2" size={20} />
                Speaking Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.speakingLanguages?.map((lang, index) => (
                  <span
                    key={index}
                    className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            {(profile.facebook || profile.website) && (
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">Connect</h2>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {profile.facebook && (
                    <a
                      href={profile.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-blue-600 dark:bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm sm:text-base"
                    >
                      <Facebook className="mr-2" size={18} />
                      Facebook
                    </a>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-gray-700 dark:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
                    >
                      <Globe className="mr-2" size={18} />
                      Website
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Gender</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{profile.gender}</p>
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Age</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{profile.age} years</p>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Views</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{profile.viewCount || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Reviews ({reviews.length})
            </h2>
            {isLoggedIn && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center text-sm sm:text-base whitespace-nowrap"
              >
                <Heart className="mr-2" size={18} />
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Write Your Review</h3>

              {reviewError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-xs sm:text-sm">
                  {reviewError}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your Rating *
                </label>
                {renderStars(rating, true, setRating)}
              </div>

              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="4"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm sm:text-base placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Share your experience..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm sm:text-base"
              >
                {submittingReview ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={18} />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <Star size={48} className="mx-auto sm:w-16 sm:h-16" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                Be the first to review this profile!
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-6 last:border-b-0">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <img
                      src={review.userAvatar || '/default-avatar.png'}
                      alt={review.userName}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{review.userName}</h4>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        {review.review}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HSTC Transactions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mt-6 sm:mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
            <ArrowRightLeft className="mr-2 sm:mr-3 text-green-600 dark:text-green-400 flex-shrink-0" size={24} />
            <span className="truncate">HSTC Transactions ({transactions.length})</span>
          </h2>

          {transactions.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <Clock size={48} className="mx-auto sm:w-16 sm:h-16" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Transactions Yet
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                No HSTC transfers have been made yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className={`p-4 sm:p-6 rounded-xl border-2 ${
                    transaction.transactionType === 'Received'
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${
                            transaction.transactionType === 'Received'
                              ? 'bg-green-600 dark:bg-green-500 text-white'
                              : 'bg-blue-600 dark:bg-blue-500 text-white'
                          }`}
                        >
                          {transaction.transactionType}
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {transaction.amount}h
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {transaction.transactionType === 'Received' ? (
                          <>
                            <strong>From:</strong> {transaction.otherPartyName} ({transaction.otherPartyCareID})
                          </>
                        ) : (
                          <>
                            <strong>To:</strong> {transaction.otherPartyName} ({transaction.otherPartyCareID})
                          </>
                        )}
                      </div>

                      <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Reason:</strong> {transaction.reason}
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(transaction.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {transaction.transactionType === 'Received' ? (
                        <div className="text-green-600 dark:text-green-400">
                          <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                        </div>
                      ) : (
                        <div className="text-blue-600 dark:text-blue-400">
                          <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiversTimeCurrencyDetail;

