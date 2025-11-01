import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Loader,
  AlertCircle,
  Send,
  Eye
} from 'lucide-react';

const FashionDesignersDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    review: ''
  });

  // Fetch profile and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, reviewsRes] = await Promise.all([
          fetch(`/api/fashion-designers/${id}`).then(r => r.json()),
          fetch(`/api/fashion-designers/${id}/reviews`).then(r => r.json())
        ]);

        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data);
        } else {
          setError('Profile not found');
        }

        if (reviewsRes.success && reviewsRes.data) {
          setReviews(reviewsRes.data);
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

    if (!user) {
      setError('Please login to add a review');
      return;
    }

    if (reviewData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!reviewData.review.trim()) {
      setError('Please write a review');
      return;
    }

    setSubmittingReview(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/fashion-designers/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setReviews([...reviews, {
          userId: user._id,
          userName: user.name,
          rating: reviewData.rating,
          review: reviewData.review,
          createdAt: new Date()
        }]);
        setReviewData({ rating: 0, review: '' });
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 dark:text-red-200">{error || 'Profile not found'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>

        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <img
                src={profile.avatar?.url}
                alt={profile.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{profile.name}</h1>
              <p className="text-blue-600 dark:text-blue-400 font-semibold mt-2">{profile.specialization}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{profile.category}</p>
            </div>

            {/* Key Info */}
            <div className="md:col-span-2 space-y-4">
              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(profile.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {profile.averageRating || 0} / 5
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  ({profile.totalReviews || 0} reviews)
                </span>
              </div>

              {/* Experience & Availability */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profile.experience} years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className={`text-lg font-semibold ${
                    profile.available
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {profile.available ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>

              {/* Views */}
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{profile.viewCount || 0} views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profile.description}</p>
        </div>

        {/* Services */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Services Offered</h2>
          <div className="flex flex-wrap gap-2">
            {profile.includes?.map((service, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Gallery */}
        {profile.images && profile.images.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Design Samples</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profile.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`Design ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                />
              ))}
            </div>
          </div>
        )}

        {/* Location & Contact */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {profile.location?.city}, {profile.location?.province}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <a href={`tel:${profile.contact}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                {profile.contact}
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <a href={`mailto:${profile.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                {profile.email}
              </a>
            </div>
            {profile.facebook && (
              <div className="flex items-center space-x-3">
                <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Facebook
                </a>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Reviews & Ratings</h2>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleSubmitReview} className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Your Review</h3>

              {error && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || reviewData.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={reviewData.review}
                  onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                  rows="4"
                  placeholder="Share your experience with this fashion designer..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
              >
                {submittingReview ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{review.userName}</p>
                      <div className="flex items-center space-x-1 mt-1">
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
                  <p className="text-gray-700 dark:text-gray-300">{review.review}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionDesignersDetailView;

