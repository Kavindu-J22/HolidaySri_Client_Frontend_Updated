import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsUpdatesAPI } from '../config/api';
import { 
  Calendar, MapPin, DollarSign, Phone, Globe, 
  Star, User, Loader, ArrowLeft, Facebook, ExternalLink,
  Clock, Users, Award
} from 'lucide-react';

const EventsUpdatesDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    fetchReviews();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await eventsUpdatesAPI.getEvent(id);
      if (response.data.success) {
        setEvent(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await eventsUpdatesAPI.getReviews(id);
      if (response.data.success) {
        // Backend returns { reviews: [], averageRating, totalReviews }
        setReviews(response.data.data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setReviews([]); // Set empty array on error to prevent map error
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewLoading(true);

    try {
      const response = await eventsUpdatesAPI.addReview(id, reviewForm);
      if (response.data.success) {
        setReviewSuccess(true);
        setReviewForm({ rating: 5, comment: '' });
        fetchReviews();
        fetchEventDetails(); // Refresh to get updated average rating
        setTimeout(() => setReviewSuccess(false), 3000);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const renderStars = (rating, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Event not found'}</p>
          <button
            onClick={() => navigate('/ads/events-management/events-updates')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Events
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
          className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Event Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Image Gallery */}
          {event.images && event.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {event.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`${event.eventName} ${index + 1}`}
                  className={`w-full object-cover ${
                    index === 0 ? 'md:col-span-3 h-96' : 'h-48'
                  }`}
                />
              ))}
            </div>
          )}

          <div className="p-8">
            {/* Title and Rating */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {event.eventName}
                </h1>
                <p className="text-lg text-blue-600 dark:text-blue-400 mb-4">
                  {event.categoryType}
                </p>
              </div>
              
              {/* Overall Rating */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {event.averageRating || 0}
                  </span>
                </div>
                {renderStars(Math.round(event.averageRating || 0))}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {event.totalReviews || 0} {event.totalReviews === 1 ? 'Review' : 'Reviews'}
                </p>
              </div>
            </div>

            {/* Featured Badge */}
            {event.featured && (
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold mb-4">
                ⭐ Featured Event
              </span>
            )}

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                About This Event
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Date & Time */}
              <div className="flex items-start space-x-3">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Date & Time</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {event.time}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Location</p>
                  <p className="text-gray-700 dark:text-gray-300">{event.eventLocation}</p>
                  <p className="text-gray-600 dark:text-gray-400">{event.city}, {event.province}</p>
                  {event.mapLink && (
                    <a
                      href={event.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center mt-1"
                    >
                      View on Map <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-start space-x-3">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Ticket Price</p>
                  <p className="text-gray-700 dark:text-gray-300">{event.ticketPrice}</p>
                  {event.ticketsAvailable && (
                    <p className="text-green-600 dark:text-green-400 text-sm flex items-center mt-1">
                      <Users className="w-4 h-4 mr-1" />
                      Tickets Available
                    </p>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start space-x-3">
                <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Contact</p>
                  <p className="text-gray-700 dark:text-gray-300">{event.contact}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Organized by: {event.organizer}
                  </p>
                </div>
              </div>
            </div>

            {/* What's Included */}
            {event.includes && event.includes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  What's Included
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.includes.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(event.facebook || event.website) && (
              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                {event.facebook && (
                  <a
                    href={event.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5 mr-2" />
                    Facebook
                  </a>
                )}
                {event.website && (
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Reviews & Ratings
          </h2>

          {/* Add Review Form */}
          <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share Your Experience
            </h3>

            {reviewSuccess && (
              <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                ✓ Review submitted successfully!
              </div>
            )}

            {reviewError && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Rating Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Rating *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= reviewForm.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-4 text-gray-700 dark:text-gray-300 font-medium">
                    {reviewForm.rating} {reviewForm.rating === 1 ? 'Star' : 'Stars'}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your thoughts about this event..."
                  required
                  maxLength={1000}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {reviewForm.comment.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={reviewLoading || !reviewForm.comment.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
              >
                {reviewLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Reviews ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No reviews yet. Be the first to review this event!
              </p>
            ) : (
              reviews.map((review, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {review.userName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    {renderStars(review.rating, 'w-4 h-4')}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsUpdatesDetailView;

