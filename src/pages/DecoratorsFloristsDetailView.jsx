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
  Mail,
  Share2,
  Copy,
  Check,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X
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
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  // Share functionality
  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = `Check out ${profile?.name} - ${profile?.specialization}`;
    const text = `${profile?.name} - Professional ${profile?.category} in ${profile?.city}, ${profile?.province}`;

    switch (platform) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({ title, text, url });
          } catch (err) {
            console.error('Error sharing:', err);
          }
        }
        break;
      default:
        break;
    }
    setShowShareMenu(false);
  };

  // Image carousel navigation
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

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Keyboard navigation for image modal
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (showImageModal) {
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'Escape') setShowImageModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showImageModal, profile]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button and Share */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Share Button */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="py-2">
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <span className="text-sm">📱 WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Facebook className="w-4 h-4" />
                    <span className="text-sm">Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <span className="text-sm">🐦 Twitter</span>
                  </button>
                  {navigator.share && (
                    <button
                      onClick={() => handleShare('native')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">More...</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-red-700 dark:text-red-300">{error}</p>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          {/* Images Carousel */}
          {profile.images && profile.images.length > 0 && (
            <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-200 dark:bg-gray-700 overflow-hidden group">
              {/* Main Image */}
              <img
                src={profile.images[currentImageIndex].url}
                alt={`${profile.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setShowImageModal(true)}
              />

              {/* Navigation Arrows - Show on hover for multiple images */}
              {profile.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm">
                    {currentImageIndex + 1} / {profile.images.length}
                  </div>

                  {/* Thumbnail Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2">
                    {profile.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`transition-all duration-300 rounded-full ${
                          index === currentImageIndex
                            ? 'w-8 h-2 bg-white'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Click to expand hint */}
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-lg text-xs backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to expand
                  </div>
                </>
              )}
            </div>
          )}

          {/* Profile Info */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {profile.name}
                  </h1>
                  <p className="text-base sm:text-lg text-blue-600 dark:text-blue-400 font-semibold mb-2">
                    {profile.specialization}
                  </p>
                  <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    <Award className="w-4 h-4 mr-1.5" />
                    {profile.category}
                  </div>
                </div>
              </div>

              {/* Rating and Stats */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
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
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {profile.averageRating ? profile.averageRating.toFixed(1) : 'New'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <span className="text-sm font-medium">{profile.totalReviews || 0} Reviews</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{profile.experience} Years Experience</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <span className="w-1 h-6 bg-blue-600 mr-3 rounded"></span>
                About
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.description}
              </p>
            </div>

            {/* Services/Items */}
            {profile.includes && profile.includes.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-blue-600 mr-3 rounded"></span>
                  Services & Items
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {profile.includes.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Contact Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
              {/* Location */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Location
                </h2>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">
                  {profile.city}, {profile.province}
                </p>
              </div>

              {/* Availability */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Availability
                </h2>
                <p className={`text-base sm:text-lg font-bold flex items-center ${
                  profile.available
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {profile.available ? (
                    <>
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Currently Available
                    </>
                  ) : (
                    <>
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      Not Available
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-1 h-6 bg-blue-600 mr-3 rounded"></span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${profile.contact}`}
                  className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 truncate">
                      {profile.contact}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 truncate">
                      {profile.email}
                    </p>
                  </div>
                </a>

                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Website</p>
                      <p className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400">
                        Visit Website
                      </p>
                    </div>
                  </a>
                )}

                {profile.facebook && (
                  <a
                    href={profile.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Facebook</p>
                      <p className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400">
                        Follow on Facebook
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 flex items-center">
            <span className="w-1 h-6 bg-blue-600 mr-3 rounded"></span>
            Reviews & Ratings
          </h2>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleSubmitReview} className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-xl border border-blue-100 dark:border-gray-600">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Add Your Review
              </h3>

              {/* Rating */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transform hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-9 sm:h-9 transition-colors ${
                          star <= (hoveredRating || reviewForm.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {reviewForm.rating} / 5
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  placeholder="e.g., Excellent service!"
                  maxLength="100"
                />
              </div>

              {/* Comment */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  rows="4"
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white resize-none"
                  placeholder="Share your experience..."
                  maxLength="1000"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
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
            <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
              <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300">
                <a href="/login" className="font-bold hover:underline">Login</a> to add a review
              </p>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-3 sm:space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 sm:p-5 bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                          {(review.userId?.name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                            {review.userId?.name || 'Anonymous'}
                          </p>
                          <div className="flex items-center space-x-1 mt-0.5">
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
                            <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1">
                              {review.rating}.0
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {review.title && (
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                      {review.title}
                    </h4>
                  )}
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Full-Screen Image Modal */}
        {showImageModal && profile.images && profile.images.length > 0 && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setShowImageModal(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
              {currentImageIndex + 1} / {profile.images.length}
            </div>

            {/* Main Image */}
            <div
              className="relative w-full h-full flex items-center justify-center p-4 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={profile.images[currentImageIndex].url}
                alt={`${profile.name} - Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation Arrows */}
              {profile.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {profile.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-full overflow-x-auto px-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {profile.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToImage(index);
                      }}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all ${
                        index === currentImageIndex
                          ? 'ring-4 ring-white scale-110'
                          : 'ring-2 ring-white/30 hover:ring-white/60 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 text-white/70 text-xs sm:text-sm text-center">
              <p className="hidden sm:block">Use arrow keys or click arrows to navigate • Press ESC to close</p>
              <p className="sm:hidden">Swipe or tap arrows to navigate</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecoratorsFloristsDetailView;

