import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';

export default function PetCareAnimalServicesDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: ''
  });

  // Fetch profile and reviews
  useEffect(() => {
    fetchProfileAndReviews();
  }, [id]);

  const fetchProfileAndReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch profile
      const profileResponse = await axios.get(`/api/pet-care-animal-services/${id}`);
      if (profileResponse.data.success) {
        setProfile(profileResponse.data.data);
      }

      // Fetch reviews
      const reviewsResponse = await axios.get(`/api/pet-care-animal-services-reviews/${id}`);
      if (reviewsResponse.data.success) {
        setReviews(reviewsResponse.data.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);

    if (!reviewForm.review.trim() || reviewForm.review.trim().length < 10) {
      setReviewError('Review must be at least 10 characters long');
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await axios.post(
        '/api/pet-care-animal-services-reviews/add',
        {
          petCareProfileId: id,
          rating: parseInt(reviewForm.rating),
          review: reviewForm.review.trim()
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.data.success) {
        setReviewSuccess(true);
        setReviewForm({ rating: 5, review: '' });
        
        // Refresh reviews and profile
        setTimeout(() => {
          fetchProfileAndReviews();
          setReviewSuccess(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">{error || 'Profile not found'}</p>
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
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section with Image */}
          {profile.avatar && (
            <div className="relative h-96 bg-gray-200 dark:bg-gray-700">
              <img
                src={profile.avatar.url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-full font-medium">
                {profile.category}
              </div>
            </div>
          )}

          {/* Profile Info */}
          <div className="p-8">
            {/* Name and Rating */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {profile.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
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
                  {profile.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  ({profile.totalReviews} reviews)
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400">
                {profile.viewCount} views
              </p>
            </div>

            {/* Specialization and Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Specialization
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.specialization.map(spec => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Services
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.services.map(service => (
                    <span
                      key={service}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                About
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {profile.description}
              </p>
            </div>

            {/* Experience and Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Experience
                </h3>
                <p className="text-gray-900 dark:text-white text-lg font-medium">
                  {profile.experience} years
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Availability
                </h3>
                <div className="space-y-1">
                  {profile.availability.map(avail => (
                    <p key={avail} className="text-gray-600 dark:text-gray-400 text-sm">
                      {avail}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {profile.city}, {profile.province}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <p className="text-gray-600 dark:text-gray-400">{profile.contact}</p>
                </div>
                {profile.facebook && (
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <a
                      href={profile.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Facebook Profile
                    </a>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="mb-6">
              <span className={`px-4 py-2 rounded-full font-medium ${
                profile.available
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}>
                {profile.available ? 'Currently Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Reviews & Ratings
          </h2>

          {/* Review Form */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Leave a Review
            </h3>

            {reviewError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 dark:text-red-300">{reviewError}</p>
              </div>
            )}

            {reviewSuccess && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-green-700 dark:text-green-300">Review submitted successfully!</p>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating }))}
                      className="focus:outline-none transition"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= reviewForm.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                  placeholder="Share your experience with this service..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  disabled={submittingReview}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {reviewForm.review.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition flex items-center gap-2"
              >
                {submittingReview ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
            </h3>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div
                    key={review._id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {review.userName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {review.review}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

