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
          `http://localhost:5000/api/caregivers-time-currency/${id}`
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
          `http://localhost:5000/api/caregivers-time-currency/${id}/reviews`
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
          `http://localhost:5000/api/caregivers-time-currency/${id}/transactions`
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
        `http://localhost:5000/api/caregivers-time-currency/${id}/review`,
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
          `http://localhost:5000/api/caregivers-time-currency/${id}/reviews`
        );
        if (reviewsResponse.data.success) {
          setReviews(reviewsResponse.data.data);
        }

        // Refresh profile to update average rating
        const profileResponse = await axios.get(
          `http://localhost:5000/api/caregivers-time-currency/${id}`
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="text-red-600" size={48} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'The profile you are looking for does not exist or has been removed.'}
          </p>
          <button
            onClick={() => navigate('/caregivers-time-currency-browse')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/caregivers-time-currency-browse')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Browse
        </button>

        {/* Success Message */}
        {reviewSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            {reviewSuccess}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100">
            <img
              src={profile.avatar?.url || '/default-avatar.png'}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
              <div className="flex items-center">
                <Clock className="text-blue-600 mr-2" size={20} />
                <span className="text-lg font-bold text-gray-700">
                  HSTC: {profile.HSTC}h
                </span>
              </div>
            </div>
            {profile.type === 'Care Giver' && (
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Care Giver
              </div>
            )}
            {profile.type === 'Care Needer' && (
              <div className="absolute top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Care Needer
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {profile.name}
                </h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={18} className="mr-2" />
                  {profile.city}, {profile.province}
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <Phone size={18} className="mr-2" />
                  {profile.contact}
                </div>
                {/* Care ID with Copy */}
                <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg border-2 border-blue-200">
                  <span className="text-sm font-bold text-gray-800 mr-3">
                    Care ID: {profile.careID}
                  </span>
                  <button
                    onClick={handleCopyCareId}
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors bg-white px-3 py-1 rounded-md shadow-sm hover:shadow-md"
                    title="Copy Care ID"
                  >
                    {copiedCareId ? (
                      <>
                        <Check size={16} className="text-green-600 mr-1" />
                        <span className="text-xs font-semibold text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="mr-1" />
                        <span className="text-xs font-semibold">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Rating Display */}
              <div className="mt-4 md:mt-0 text-center md:text-right">
                {profile.averageRating > 0 ? (
                  <>
                    <div className="flex items-center justify-center md:justify-end mb-2">
                      {renderStars(Math.round(profile.averageRating))}
                      <span className="ml-2 text-2xl font-bold text-gray-700">
                        {profile.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Based on {profile.totalReviews} {profile.totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">No reviews yet</p>
                )}
              </div>
            </div>

            {/* Availability Status */}
            <div className="flex items-center gap-3 mb-6">
              {profile.available && (
                <span className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                  <CheckCircle className="mr-2" size={18} />
                  Available
                </span>
              )}
              {profile.occupied && (
                <span className="flex items-center bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">
                  <XCircle className="mr-2" size={18} />
                  Occupied
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {profile.description}
              </p>
            </div>

            {/* Type-Specific Details */}
            {profile.type === 'Care Giver' && profile.careGiverDetails && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Care Giver Details</h2>
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Experience</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {profile.careGiverDetails.experience} years
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Services Provided</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.careGiverDetails.services?.map((service, index) => (
                        <span
                          key={index}
                          className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
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
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Care Needer Details</h2>
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Reason for Needing Care</p>
                    <p className="text-gray-900">
                      {profile.careNeederDetails.reason}
                    </p>
                  </div>
                  {profile.careNeederDetails.specialNeeds?.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Special Needs</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.careNeederDetails.specialNeeds.map((need, index) => (
                          <span
                            key={index}
                            className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium"
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                <Languages className="mr-2" />
                Speaking Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.speakingLanguages?.map((lang, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            {(profile.facebook || profile.website) && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Connect</h2>
                <div className="flex flex-wrap gap-4">
                  {profile.facebook && (
                    <a
                      href={profile.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="mr-2" size={20} />
                      Facebook
                    </a>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Globe className="mr-2" size={20} />
                      Website
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600">Gender</p>
                <p className="text-lg font-semibold text-gray-900">{profile.gender}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Age</p>
                <p className="text-lg font-semibold text-gray-900">{profile.age} years</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Views</p>
                <p className="text-lg font-semibold text-gray-900">{profile.viewCount || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Reviews ({reviews.length})
            </h2>
            {isLoggedIn && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
              >
                <Heart className="mr-2" size={20} />
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Write Your Review</h3>

              {reviewError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {reviewError}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Rating *
                </label>
                {renderStars(rating, true, setRating)}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Share your experience..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submittingReview ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={20} />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Star size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-500">
                Be the first to review this profile!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start">
                    <img
                      src={review.userAvatar || '/default-avatar.png'}
                      alt={review.userName}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-700 leading-relaxed">
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
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <ArrowRightLeft className="mr-3 text-green-600" size={32} />
            HSTC Transactions ({transactions.length})
          </h2>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Clock size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Transactions Yet
              </h3>
              <p className="text-gray-500">
                No HSTC transfers have been made yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className={`p-6 rounded-xl border-2 ${
                    transaction.transactionType === 'Received'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            transaction.transactionType === 'Received'
                              ? 'bg-green-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {transaction.transactionType}
                        </span>
                        <span className="ml-3 text-2xl font-bold text-gray-900">
                          {transaction.amount}h
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
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

                      <div className="text-sm text-gray-700 mb-2">
                        <strong>Reason:</strong> {transaction.reason}
                      </div>

                      <div className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <div className="ml-4">
                      {transaction.transactionType === 'Received' ? (
                        <div className="text-green-600">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                        </div>
                      ) : (
                        <div className="text-blue-600">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

