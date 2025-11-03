import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, Mail, Facebook, Globe, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TalentedEntertainersArtistsDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, review: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/talented-entertainers-artists/${id}`);
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setError('');
      } else {
        setError('Profile not found');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to add a review');
      return;
    }

    setReviewLoading(true);
    try {
      const response = await fetch(`/api/talented-entertainers-artists/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewData)
      });

      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setReviewData({ rating: 5, review: '' });
        setShowReviewForm(false);
      } else {
        setError(data.message || 'Failed to add review');
      }
    } catch (err) {
      console.error('Error adding review:', err);
      setError('Failed to add review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-8 hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-700 dark:text-red-300">
            {error || 'Profile not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-8 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="h-64 bg-gradient-to-br from-blue-400 to-indigo-600 overflow-hidden">
            {profile.avatar?.url && (
              <img
                src={profile.avatar.url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {profile.name}
              </h1>
              <p className="text-xl text-blue-600 dark:text-blue-400 mb-4">
                {profile.specialization} • {profile.category}
              </p>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(profile.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {profile.averageRating.toFixed(1)} ({profile.totalReviews} reviews)
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              {/* Location */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profile.city}, {profile.province}
                  </p>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0">
                  <span className="text-lg font-bold">★</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profile.experience} years
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start space-x-3">
                <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Contact</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profile.contact}
                  </p>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0">
                  <span className="text-lg">📅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Availability</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profile.available ? 'Available' : 'Not Available'}
                  </p>
                  {profile.availability && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {profile.availability}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.description}
              </p>
            </div>

            {/* Social Links */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Connect
              </h2>
              <div className="flex flex-wrap gap-4">
                {profile.social?.facebook && (
                  <a
                    href={profile.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>Facebook</span>
                  </a>
                )}
                {profile.social?.website && (
                  <a
                    href={profile.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Reviews ({profile.totalReviews})
                </h2>
                {user && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    {showReviewForm ? 'Cancel' : 'Add Review'}
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && user && (
                <form onSubmit={handleAddReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewData(prev => ({ ...prev, rating: num }))}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              num <= reviewData.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Review
                    </label>
                    <textarea
                      value={reviewData.review}
                      onChange={(e) => setReviewData(prev => ({ ...prev, review: e.target.value }))}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      placeholder="Share your experience..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {profile.reviews && profile.reviews.length > 0 ? (
                  profile.reviews.map((review, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {review.userName}
                          </p>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.review && (
                        <p className="text-gray-700 dark:text-gray-300">
                          {review.review}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentedEntertainersArtistsDetailView;

