import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, DollarSign, Star, Phone, Facebook as FacebookIcon,
  Globe, FileText, Loader, AlertCircle, CheckCircle, TrendingUp, Award,
  MessageSquare, User, Calendar, Share2, X, Copy
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const CryptoConsultingSignalsDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    fetchProfileDetails();
    fetchReviews();
  }, [id]);

  const fetchProfileDetails = async () => {
    try {
      const response = await axios.get(`https://holidaysri-backend-9xm4.onrender.com/api/crypto-consulting-signals/${id}`);
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`https://holidaysri-backend-9xm4.onrender.com/api/crypto-consulting-signals/${id}/reviews`);
      if (response.data.success) {
        setReviews(response.data.data.reviews || []);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleContact = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://holidaysri-backend-9xm4.onrender.com/api/crypto-consulting-signals/${id}/contact`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      // Open phone dialer with contact number
      if (profile?.contactNumber) {
        window.location.href = `tel:${profile.contactNumber}`;
      }
    } catch (err) {
      console.error('Error tracking contact:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewLoading(true);

    if (!user) {
      setReviewError('Please login to submit a review');
      setReviewLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://holidaysri-backend-9xm4.onrender.com/api/crypto-consulting-signals/${id}/review`,
        reviewForm,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setReviewSuccess(true);
        setReviewForm({ rating: 5, comment: '' });
        fetchReviews();
        fetchProfileDetails();
        setTimeout(() => setReviewSuccess(false), 3000);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  // Handle share functionality
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Check out ${profile?.name} - Crypto Consulting & Courses on HolidaySri`;

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

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Profile not found'}
          </h2>
          <button
            onClick={() => navigate('/crypto-consulting-signals')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back and Share Buttons */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Back</span>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header with Image */}
          <div className="relative h-64 sm:h-80">
            <img
              src={profile.image?.url || '/placeholder-crypto.jpg'}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8" />
                <h1 className="text-4xl font-bold">{profile.name}</h1>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="px-3 py-1 bg-blue-600 rounded-full text-sm font-medium">
                  {profile.type}
                </span>
                <span className="px-3 py-1 bg-purple-600 rounded-full text-sm font-medium">
                  {profile.category}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Rating and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {profile.averageRating ? profile.averageRating.toFixed(1) : '0.0'}
                  </span>
                </div>
                {renderStars(Math.round(profile.averageRating || 0))}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {profile.totalReviews || 0} {profile.totalReviews === 1 ? 'Review' : 'Reviews'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 text-center">
                <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {profile.contactCount || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Contacts</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  LKR {profile.charges?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Charges</p>
              </div>
            </div>

            {/* Specialist Areas */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Specialist Areas
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.specialist?.map((spec, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {profile.description}
              </p>
            </div>

            {/* Service Type, Location, and Contact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Service Type
                </h3>
                <div className="flex gap-3">
                  {profile.online && (
                    <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
                      Online
                    </span>
                  )}
                  {profile.physical && (
                    <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg">
                      Physical
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Location
                </h3>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  <span>{profile.city}, {profile.province}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Contact Number
                </h3>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Phone className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  <a href={`tel:${profile.contactNumber}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {profile.contactNumber}
                  </a>
                </div>
              </div>
            </div>

            {/* What's Included */}
            {profile.includes && profile.includes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What's Included
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.includes.map((item, index) => (
                    <div key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact and Links */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Get in Touch
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleContact}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Now
                </button>
                {profile.facebook && (
                  <a
                    href={profile.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FacebookIcon className="w-5 h-5 mr-2" />
                    Facebook
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Website
                  </a>
                )}
                {profile.coursesPDF && (
                  <a
                    href={profile.coursesPDF.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Download PDF
                  </a>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Reviews & Ratings
              </h2>

              {/* Add Review Form */}
              {user ? (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Write a Review
                  </h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rating *
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 cursor-pointer transition-colors ${
                                star <= reviewForm.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Comment *
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Share your experience..."
                        required
                      />
                    </div>

                    {reviewError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-red-600 dark:text-red-400 text-sm">{reviewError}</p>
                      </div>
                    )}

                    {reviewSuccess && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-green-600 dark:text-green-400 text-sm">Review submitted successfully!</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {reviewLoading ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Review'
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
                  <p className="text-blue-800 dark:text-blue-300">
                    Please <button onClick={() => navigate('/login')} className="underline font-medium">login</button> to write a review.
                  </p>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {review.userName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      No reviews yet. Be the first to review!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                    <FacebookIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
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

export default CryptoConsultingSignalsDetailView;
