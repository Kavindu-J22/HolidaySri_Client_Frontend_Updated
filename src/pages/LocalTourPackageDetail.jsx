import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Star, MessageCircle, Loader, MapPin, Users, DollarSign, Calendar, Phone, Mail, Globe, Share2, Facebook, Twitter, Link2, Check } from 'lucide-react';
import SuccessModal from '../components/common/SuccessModal';

const LocalTourPackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [packageData, setPackageData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Fetch package data
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/local-tour-package/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setPackageData(data.data);
        } else {
          setError('Failed to load package details');
        }
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Failed to load package details');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  // Handle share functionality
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = packageData?.title || 'Local Tour Package';
    const text = `Check out this amazing tour package: ${title}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => {
          setLinkCopied(false);
          setShowShareMenu(false);
        }, 2000);
        break;
      default:
        break;
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (!rating) {
      setError('Please select a rating');
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/local-tour-package/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rating,
          reviewText
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
        setRating(5);
        setReviewText('');
        // Refresh package data
        const refreshRes = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/local-tour-package/${id}`);
        const refreshData = await refreshRes.json();
        if (refreshData.success) {
          setPackageData(refreshData.data);
        }
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="text-center text-gray-600 dark:text-gray-400">
            {error || 'Package not found'}
          </div>
        </div>
      </div>
    );
  }

  const images = packageData.images || [];
  const currentImage = images[currentImageIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back and Share */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back</span>
          </button>

          {/* Share Button */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm sm:text-base">Share</span>
            </button>

            {/* Share Menu Dropdown */}
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="py-2">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Share on Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                  >
                    <Twitter className="w-4 h-4 text-sky-500" />
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                  >
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    Share on WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 text-gray-600" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Image Gallery - Professional Grid Layout */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {images.length > 0 && (
                <div className="space-y-2 p-2 sm:p-3">
                  {/* Main Image */}
                  <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                    <img
                      src={images[currentImageIndex].url}
                      alt={`Package ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Image counter */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2">
                      {images.map((image, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative h-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            idx === currentImageIndex
                              ? 'border-blue-500 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === currentImageIndex && (
                            <div className="absolute inset-0 bg-blue-500/20"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Package Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    {packageData.title}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < Math.round(packageData.averageRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {packageData.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      ({packageData.totalReviews} {packageData.totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>

                {/* Adventure Type Badge */}
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-full shadow-md">
                    <Calendar className="w-4 h-4" />
                    {packageData.adventureType}
                  </span>
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
                    <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                      {packageData.location.city}, {packageData.location.province}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Capacity</p>
                    <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                      {packageData.pax.min} - {packageData.pax.max} persons
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg sm:col-span-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Price per Person</p>
                    <p className="font-bold text-xl sm:text-2xl text-green-600 dark:text-green-400">
                      LKR {packageData.price.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  About This Tour
                </h2>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {packageData.description}
                </p>
              </div>

              {/* Includes */}
              {packageData.includes && packageData.includes.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                    What's Included
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {packageData.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Available Dates */}
              {packageData.availableDates && packageData.availableDates.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                    Available Dates
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {packageData.availableDates.map((date, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-800 dark:text-purple-300 rounded-lg text-xs sm:text-sm font-medium shadow-sm"
                      >
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Provider Info and Review Form */}
          <div className="space-y-4 sm:space-y-6">
            {/* Provider Info */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                Tour Provider
              </h2>

              <div className="space-y-4">
                <div className="p-3 bg-white dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Provider Name</p>
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                    {packageData.provider.name}
                  </p>
                </div>

                <a
                  href={`tel:${packageData.provider.phone}`}
                  className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Contact Number</p>
                    <p className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400 group-hover:underline truncate">
                      {packageData.provider.phone}
                    </p>
                  </div>
                </a>

                {packageData.facebook && (
                  <a
                    href={packageData.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                      <Facebook className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Social Media</p>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:underline truncate">
                        Facebook Page
                      </p>
                    </div>
                  </a>
                )}

                {packageData.website && (
                  <a
                    href={packageData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors group"
                  >
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                      <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Website</p>
                      <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 group-hover:underline truncate">
                        Visit Website
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Review Form */}
            {user && (
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Leave a Review
                </h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-xs sm:text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Rating */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating *
                    </label>
                    <div className="flex gap-1 sm:gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 cursor-pointer transition-colors ${
                              star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience..."
                      rows="4"
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    {submittingReview ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span className="text-sm sm:text-base">Submitting...</span>
                      </>
                    ) : (
                      <span className="text-sm sm:text-base">Submit Review</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {packageData.reviews && packageData.reviews.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
              Reviews ({packageData.reviews.length})
            </h2>

            <div className="space-y-4">
              {packageData.reviews.map((review, idx) => (
                <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                        {review.userName}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {review.rating}.0
                        </span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  {review.reviewText && (
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      {review.reviewText}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Success!"
          message="Your review has been submitted successfully!"
        />
      )}
    </div>
  );
};

export default LocalTourPackageDetail;

