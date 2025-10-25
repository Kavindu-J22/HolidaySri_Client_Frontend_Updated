import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Mail, Phone, Facebook, Globe, Star, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RatingDisplay from '../components/common/RatingDisplay';
import axios from 'axios';

const TourGuiderDetailView = () => {
  const { tourGuiderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [tourGuider, setTourGuider] = useState(null);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Fetch tour guider profile
  const fetchTourGuider = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/tour-guider/${tourGuiderId}`);

      if (response.data.success) {
        setTourGuider(response.data.data);
        setRatingDistribution(response.data.ratingDistribution || {});
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews for tour guider
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/tour-guider/${tourGuiderId}/reviews?page=1&limit=10`);

      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  useEffect(() => {
    if (tourGuiderId) {
      fetchTourGuider();
      fetchReviews();
    }
  }, [tourGuiderId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!rating || !review.trim()) {
      setError('Please provide both rating and review');
      return;
    }

    try {
      setSubmittingReview(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tour-guider/${tourGuiderId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          review: review.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add the new review to the list
        setReviews(prev => [data.data, ...prev]);
        setRating(0);
        setReview('');

        // Refresh tour guider details to update rating
        fetchTourGuider();
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!tourGuider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Tour guide profile not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header Image */}
          <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
            {tourGuider.avatar?.url && (
              <img
                src={tourGuider.avatar.url}
                alt={tourGuider.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Name and Rating */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {tourGuider.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    {tourGuider.gender}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {tourGuider.age} years old
                  </span>
                </div>
              </div>
              <div className="text-right">
                <RatingDisplay
                  averageRating={tourGuider.averageRating || 0}
                  totalReviews={tourGuider.totalReviews || 0}
                  ratingDistribution={ratingDistribution}
                  size="lg"
                  showLabel={true}
                />
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              {/* Experience */}
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {tourGuider.experience} {tourGuider.experience === 1 ? 'year' : 'years'}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {tourGuider.city}, {tourGuider.province}
                  </p>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${tourGuider.isAvailable ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <div className={`w-6 h-6 rounded-full ${tourGuider.isAvailable ? 'bg-green-600' : 'bg-gray-600'}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {tourGuider.isAvailable ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {tourGuider.description}
              </p>
            </div>

            {/* Facilities */}
            {tourGuider.facilitiesProvided && tourGuider.facilitiesProvided.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Facilities Provided</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tourGuider.facilitiesProvided.map((facility, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                    >
                      ✓ {facility}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <a href={`mailto:${tourGuider.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {tourGuider.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <a href={`tel:${tourGuider.contact}`} className="text-green-600 dark:text-green-400 hover:underline">
                    {tourGuider.contact}
                  </a>
                </div>
                {tourGuider.facebook && (
                  <div className="flex items-center space-x-3">
                    <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <a href={tourGuider.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Facebook Profile
                    </a>
                  </div>
                )}
                {tourGuider.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <a href={tourGuider.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reviews & Ratings</h2>

              {/* Add Review Form */}
              {user && (
                <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Your Review</h3>

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Rating */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= rating
                                ? 'text-yellow-400 fill-yellow-400'
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
                      Your Review
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share your experience with this tour guide..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
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
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {rev.userId?.name || 'Anonymous'}
                        </p>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rev.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{rev.review}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuiderDetailView;

