import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Globe,
  Facebook,
  Loader,
  AlertCircle,
  Send,
  Mail
} from 'lucide-react';
import { decoratorsFloristsAPI } from '../config/api';
import SuccessModal from '../components/common/SuccessModal';

const DecoratorsFloristsDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  // Fetch profile and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, reviewsRes] = await Promise.all([
          decoratorsFloristsAPI.getFloristProfile(id),
          decoratorsFloristsAPI.getReviews(id)
        ]);

        if (profileRes.data && profileRes.data.data) {
          setProfile(profileRes.data.data);
        }

        if (reviewsRes.data && reviewsRes.data.data) {
          setReviews(reviewsRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please login to add a review');
      return;
    }

    if (!reviewForm.title || !reviewForm.comment) {
      setError('Please fill in all review fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await decoratorsFloristsAPI.addReview(id, reviewForm);

      if (response.data && response.data.success) {
        setReviews([response.data.data, ...reviews]);
        setReviewForm({ rating: 5, title: '', comment: '' });
        setShowSuccessModal(true);
        
        // Update profile with new rating
        if (profile) {
          const updatedProfile = { ...profile };
          const allReviews = [response.data.data, ...reviews];
          const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
          updatedProfile.averageRating = parseFloat((totalRating / allReviews.length).toFixed(1));
          updatedProfile.totalReviews = allReviews.length;
          setProfile(updatedProfile);
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Profile not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <SuccessModal
            title="Review Added!"
            message="Thank you for your review!"
            onClose={() => setShowSuccessModal(false)}
          />
        )}

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Images Carousel */}
          {profile.images && profile.images.length > 0 && (
            <div className="relative h-96 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                src={profile.images[0].url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              {profile.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  1 / {profile.images.length}
                </div>
              )}
            </div>
          )}

          {/* Profile Info */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{profile.name}</h1>
                <p className="text-lg text-blue-600 dark:text-blue-400 mb-4">{profile.specialization}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{profile.category}</p>

                {/* Rating */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(profile.averageRating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {profile.averageRating || 'No ratings'} ({profile.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profile.description}</p>
            </div>

            {/* Experience */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Experience</h2>
              <p className="text-gray-700 dark:text-gray-300">{profile.experience} years of experience</p>
            </div>

            {/* Services/Items */}
            {profile.includes && profile.includes.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Services & Items</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.includes.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Location</h2>
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <MapPin className="w-5 h-5" />
                <span>{profile.city}, {profile.province}</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <a href={`tel:${profile.contact}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {profile.contact}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <a href={`mailto:${profile.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {profile.email}
                  </a>
                </div>
                {profile.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
                {profile.facebook && (
                  <div className="flex items-center space-x-3">
                    <Facebook className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Follow on Facebook
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Availability</h2>
              <p className={`text-lg font-semibold ${profile.available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {profile.available ? '✓ Currently Available' : '✗ Not Available'}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Reviews & Ratings</h2>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Your Review</h3>

              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || reviewForm.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Review Title</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  placeholder="e.g., Excellent service!"
                  maxLength="100"
                />
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  placeholder="Share your experience..."
                  maxLength="1000"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold"
              >
                {submitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          )}

          {!user && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-700 dark:text-blue-300">
                <a href="/login" className="font-semibold hover:underline">Login</a> to add a review
              </p>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{review.userId?.name || 'Anonymous'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{review.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecoratorsFloristsDetailView;

