import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, DollarSign, Star, Phone, Facebook as FacebookIcon, 
  Globe, FileText, Loader, AlertCircle, CheckCircle, TrendingUp, Award,
  MessageSquare, User, Calendar
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

  useEffect(() => {
    fetchProfileDetails();
    fetchReviews();
  }, [id]);

  const fetchProfileDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/crypto-consulting-signals/${id}`);
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
      const response = await axios.get(`http://localhost:5000/api/crypto-consulting-signals/${id}/reviews`);
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
        `http://localhost:5000/api/crypto-consulting-signals/${id}/contact`,
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
        `http://localhost:5000/api/crypto-consulting-signals/${id}/review`,
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header with Image */}
          <div className="relative h-80">
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
                    <p className="text-gray-600 dark:text-gray-400">
                      No reviews yet. Be the first to review!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoConsultingSignalsDetailView;
