import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Globe,
  Facebook,
  Clock,
  DollarSign,
  Star,
  MessageCircle,
  Loader,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Share2
} from 'lucide-react';
import axios from 'axios';
import SuccessModal from '../components/common/SuccessModal';

const RentLandCampingParkingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch listing details
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`/api/rent-land-camping-parking/${id}`);
        setListing(response.data.data);

        // Fetch reviews
        const reviewsRes = await axios.get(`/api/rent-land-camping-parking/${id}/reviews`);
        setReviews(reviewsRes.data.data.reviews || []);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing details');
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Handle image navigation
  const nextImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setSubmittingReview(true);
    setError('');

    try {
      const response = await axios.post(
        `/api/rent-land-camping-parking/${id}/review`,
        { rating, reviewText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setReviews(response.data.data.reviews);
        setRating(0);
        setReviewText('');
        setShowSuccessModal(true);

        // Update listing with new average rating
        setListing(prev => ({
          ...prev,
          averageRating: response.data.data.averageRating,
          totalReviews: response.data.data.totalReviews
        }));
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            {error || 'Listing not found'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Go Back
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
          className="mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <img
                      src={listing.images[currentImageIndex].url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    {listing.images.length > 1 && (
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
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {listing.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-gray-400">No images available</div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        index === currentImageIndex
                          ? 'border-blue-600'
                          : 'border-gray-300 dark:border-gray-600'
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
              )}
            </div>

            {/* Title and Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-5 h-5" />
                      <span>{listing.location.city}, {listing.location.province}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-5 h-5" />
                      <span>{listing.viewCount || 0} views</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                  <Share2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(listing.averageRating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {listing.averageRating || 'No'} ({listing.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  About this place
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Category and Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{listing.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {listing.available ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              {(listing.nearby?.length > 0 || listing.activities?.length > 0 || listing.includes?.length > 0) && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Amenities & Features
                  </h3>
                  <div className="space-y-4">
                    {listing.nearby?.length > 0 && (
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white mb-2">Nearby Attractions</p>
                        <div className="flex flex-wrap gap-2">
                          {listing.nearby.map((item, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {listing.activities?.length > 0 && (
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white mb-2">Activities</p>
                        <div className="flex flex-wrap gap-2">
                          {listing.activities.map((item, index) => (
                            <span
                              key={index}
                              className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {listing.includes?.length > 0 && (
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white mb-2">What's Included</p>
                        <div className="flex flex-wrap gap-2">
                          {listing.includes.map((item, index) => (
                            <span
                              key={index}
                              className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Availability
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>
                    <span className="font-semibold">Weekdays:</span>{' '}
                    {listing.availability?.weekdays ? 'Available' : 'Not Available'}
                  </p>
                  <p>
                    <span className="font-semibold">Weekends:</span>{' '}
                    {listing.availability?.weekends ? 'Available' : 'Not Available'}
                  </p>
                  <p>
                    <span className="font-semibold">Operating Hours:</span> {listing.availability?.time}
                  </p>
                </div>
              </div>

              {/* Map Link */}
              {listing.mapLink && (
                <div className="mb-6">
                  <a
                    href={listing.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition"
                  >
                    <MapPin className="w-5 h-5" />
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Reviews & Ratings
              </h2>

              {/* Review Form */}
              {localStorage.getItem('token') && (
                <form onSubmit={handleSubmitReview} className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Your Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="transition transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Your Review (Optional)
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience..."
                      maxLength="500"
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {reviewText.length}/500 characters
                    </p>
                  </div>

                  {error && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition flex items-center gap-2"
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
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <div className="flex items-start gap-4">
                        {review.userImage && (
                          <img
                            src={review.userImage}
                            alt={review.userName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {review.userName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-1 mb-2">
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
                          {review.reviewText && (
                            <p className="text-gray-700 dark:text-gray-300">{review.reviewText}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Contact & Pricing */}
          <div className="lg:col-span-1">
            {/* Pricing Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 sticky top-8">
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Daily Price</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  LKR {listing.price?.toLocaleString()}
                </p>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weekend Price</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  LKR {listing.weekendPrice?.toLocaleString()}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                {listing.contact && (
                  <a
                    href={`tel:${listing.contact}`}
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition text-blue-600 dark:text-blue-400 font-semibold"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                )}

                {listing.website && (
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition text-gray-700 dark:text-gray-300 font-semibold"
                  >
                    <Globe className="w-5 h-5" />
                    Website
                  </a>
                )}

                {listing.facebook && (
                  <a
                    href={listing.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white font-semibold"
                  >
                    <Facebook className="w-5 h-5" />
                    Facebook
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Review Submitted!"
        message="Thank you for your review. It has been posted successfully."
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default RentLandCampingParkingDetail;

