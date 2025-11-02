import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Phone,
  Facebook,
  Globe,
  Loader,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send
} from 'lucide-react';
import axios from 'axios';

export default function BabysittersChildcareDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    fetchProfileDetails();
    fetchReviews();
  }, [id]);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/babysitters-childcare/${id}`);
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/babysitters-childcare-reviews/${id}`);
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim() || reviewText.trim().length < 10) {
      setReviewError('Review must be at least 10 characters long');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError('');
      const response = await axios.post('/api/babysitters-childcare-reviews/add', {
        babysitterProfileId: id,
        rating: parseInt(rating),
        review: reviewText
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setReviewSuccess('Review added successfully!');
        setReviewText('');
        setRating(5);
        fetchReviews();
        fetchProfileDetails();
        setTimeout(() => setReviewSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const nextImage = () => {
    if (profile?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % profile.images.length);
    }
  };

  const prevImage = () => {
    if (profile?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + profile.images.length) % profile.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <p className="text-red-700 dark:text-red-300 mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={() => navigate('/babysitters-childcare')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/babysitters-childcare')}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Browse
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Basic Info */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {profile.images && profile.images.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="relative h-96 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={profile.images[currentImageIndex].url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  {profile.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {profile.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition ${
                              idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Profile Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {profile.name}
                  </h1>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium text-lg">
                    {profile.category}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 mb-2">
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
                  <p className="text-gray-600 dark:text-gray-400">
                    {profile.averageRating || 0} ({profile.totalReviews || 0} reviews)
                  </p>
                </div>
              </div>

              {/* Location and Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {profile.city}, {profile.province}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contact</p>
                    <p className="font-medium text-gray-900 dark:text-white">{profile.contact}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">About</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {profile.description}
                </p>
              </div>

              {/* Experience and Gender */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Experience</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {profile.experience} years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gender</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {profile.gender}
                  </p>
                </div>
              </div>

              {/* Services */}
              {profile.includes && profile.includes.length > 0 && (
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Services Included</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.includes.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              {profile.availability && (profile.availability.weekdays || profile.availability.weekends) && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Availability</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {profile.availability.weekdays && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weekdays</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {profile.availability.weekdays}
                        </p>
                      </div>
                    )}
                    {profile.availability.weekends && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weekends</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {profile.availability.weekends}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(profile.facebook || profile.website) && (
                <div className="flex gap-4">
                  {profile.facebook && (
                    <a
                      href={profile.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Facebook className="w-5 h-5" />
                      Facebook
                    </a>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                      <Globe className="w-5 h-5" />
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Reviews */}
          <div>
            {/* Add Review Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Review</h3>

              {reviewSuccess && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4 text-green-700 dark:text-green-300 text-sm">
                  {reviewSuccess}
                </div>
              )}

              {reviewError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 text-red-700 dark:text-red-300 text-sm">
                  {reviewError}
                </div>
              )}

              <form onSubmit={handleSubmitReview}>
                {/* Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
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
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience (minimum 10 characters)..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium"
                >
                  <Send className="w-4 h-4" />
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Reviews ({reviews.length})
              </h3>

              {reviews.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {review.userName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1">
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
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
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
    </div>
  );
}

