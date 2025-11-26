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
  Send,
  Share2,
  X,
  Copy,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    fetchProfileDetails();
    fetchReviews();
  }, [id]);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/babysitters-childcare/${id}`);
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
      const response = await axios.get(`${API_BASE_URL}/babysitters-childcare-reviews/${id}`);
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
      const response = await axios.post('https://holidaysri-backend-9xm4.onrender.com/api/babysitters-childcare-reviews/add', {
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

  // Handle share functionality
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Check out ${profile?.name} - Babysitter & Childcare on HolidaySri`;

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back and Share Buttons */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/babysitters-childcare')}
            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Browse</span>
            <span className="sm:hidden">Back</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Images and Basic Info */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {profile.images && profile.images.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-4 sm:mb-6">
                <div className="relative h-64 sm:h-80 md:h-96 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={profile.images[currentImageIndex].url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  {profile.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition"
                      >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition"
                      >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {profile.name}
                  </h1>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium text-base sm:text-lg">
                    {profile.category}
                  </p>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="flex items-center sm:justify-end gap-1 sm:gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < Math.round(profile.averageRating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {profile.averageRating || 0} ({profile.totalReviews || 0} reviews)
                  </p>
                </div>
              </div>

              {/* Location and Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                      {profile.city}, {profile.province}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Contact</p>
                    <a href={`tel:${profile.contact}`} className="text-sm sm:text-base font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                      {profile.contact}
                    </a>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">About</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {profile.description}
                </p>
              </div>

              {/* Experience and Gender */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Experience</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {profile.experience} years
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Gender</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {profile.gender}
                  </p>
                </div>
              </div>

              {/* Services */}
              {profile.includes && profile.includes.length > 0 && (
                <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">Services Included</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.includes.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 sm:px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              {profile.availability && (profile.availability.weekdays || profile.availability.weekends) && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">Availability</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {profile.availability.weekdays && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Weekdays</p>
                        <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                          {profile.availability.weekdays}
                        </p>
                      </div>
                    )}
                    {profile.availability.weekends && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Weekends</p>
                        <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                          {profile.availability.weekends}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(profile.facebook || profile.website) && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {profile.facebook && (
                    <a
                      href={profile.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                    >
                      <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                      Facebook
                    </a>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm sm:text-base"
                    >
                      <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 lg:sticky lg:top-8">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Add Review</h3>

              {reviewSuccess && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4 text-green-700 dark:text-green-300 text-xs sm:text-sm">
                  {reviewSuccess}
                </div>
              )}

              {reviewError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4 text-red-700 dark:text-red-300 text-xs sm:text-sm">
                  {reviewError}
                </div>
              )}

              <form onSubmit={handleSubmitReview}>
                {/* Rating */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition"
                      >
                        <Star
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
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
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience (minimum 10 characters)..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm sm:text-base"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 sm:py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium text-sm sm:text-base"
                >
                  <Send className="w-4 h-4" />
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
                Reviews ({reviews.length})
              </h3>

              {reviews.length > 0 ? (
                <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                            {review.userName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-0.5 sm:gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {review.review}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center py-6 sm:py-8">
                  No reviews yet. Be the first to review!
                </p>
              )}
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
                    <Facebook className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
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
}

