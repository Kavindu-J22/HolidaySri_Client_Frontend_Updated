import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft, Car, MapPin, Calendar, Clock, DollarSign, Users,
  Star, Phone, User, Loader, Send, Image as ImageIcon
} from 'lucide-react';

const LiveRidesCarpoolingDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchRideDetails();
  }, [id]);

  const fetchRideDetails = async () => {
    try {
      const response = await fetch(`/api/live-rides-carpooling/${id}`);
      const data = await response.json();

      if (data.success) {
        setRide(data.data);
      } else {
        setError('Failed to load ride details');
      }
    } catch (err) {
      console.error('Error fetching ride:', err);
      setError('Failed to load ride details');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setReviewError('Please login to submit a review');
      return;
    }

    if (!reviewForm.comment.trim()) {
      setReviewError('Please enter a comment');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');

    try {
      const response = await fetch(`/api/live-rides-carpooling/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (data.success) {
        setReviewSuccess(true);
        setReviewForm({ rating: 5, comment: '' });
        // Refresh ride details to show new review
        fetchRideDetails();
        setTimeout(() => setReviewSuccess(false), 3000);
      } else {
        setReviewError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingInput = () => {
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 cursor-pointer transition-colors ${
                star <= reviewForm.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
          {reviewForm.rating} / 5
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Ride not found'}</p>
          <button
            onClick={() => navigate('/ads/vehicles-transport/live-rides-carpooling')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Live Rides
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/ads/vehicles-transport/live-rides-carpooling')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Live Rides
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <ImageIcon className="w-6 h-6 mr-2" />
                Vehicle Images
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ride.images?.vehicleImage?.url && (
                  <div className="relative aspect-square">
                    <img
                      src={ride.images.vehicleImage.url}
                      alt="Vehicle"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      Vehicle
                    </div>
                  </div>
                )}
                {ride.images?.numberPlate?.url && (
                  <div className="relative aspect-square">
                    <img
                      src={ride.images.numberPlate.url}
                      alt="Number Plate"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      Number Plate
                    </div>
                  </div>
                )}
                {ride.images?.ownerPhoto?.url && (
                  <div className="relative aspect-square">
                    <img
                      src={ride.images.ownerPhoto.url}
                      alt="Owner"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      Owner
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ride Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {ride.rideRoute.from} → {ride.rideRoute.to}
                  </h1>
                  <div className="flex items-center gap-2">
                    {renderStars(Math.round(ride.averageRating || 0))}
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      ({ride.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    LKR {ride.pricePerSeat}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">per seat</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Vehicle</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {ride.vehicleBrand} - {ride.vehicleNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Available Seats</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {ride.availablePassengerCount} / {ride.maxPassengerCount}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Ride Date</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {new Date(ride.rideDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Ride Time</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {ride.rideTime}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                  {ride.status}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {ride.description}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Approximate Duration:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {ride.approximateTimeToRide}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Location:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {ride.ownerLocation.city}, {ride.ownerLocation.province}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Reviews & Ratings
              </h2>

              {/* Add Review Form */}
              {user && (
                <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Write a Review
                  </h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Rating
                      </label>
                      {renderRatingInput()}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Review
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        rows="4"
                        maxLength="1000"
                        placeholder="Share your experience with this ride..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {reviewForm.comment.length}/1000 characters
                      </p>
                    </div>

                    {reviewError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {reviewError}
                      </div>
                    )}

                    {reviewSuccess && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
                        Review submitted successfully!
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      {submittingReview ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Review
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {ride.reviews && ride.reviews.length > 0 ? (
                  ride.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {review.userProfileImage ? (
                            <img
                              src={review.userProfileImage}
                              alt={review.userName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {review.userName}
                            </h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mb-2">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Owner Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Owner Name</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {ride.vehicleOwnerName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Contact</div>
                    <a
                      href={`tel:${ride.phoneNumber}`}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {ride.phoneNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Address</div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {ride.ownerLocation.address}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Overall Rating
                </h4>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {ride.averageRating ? ride.averageRating.toFixed(1) : '0.0'}
                  </div>
                  <div>
                    {renderStars(Math.round(ride.averageRating || 0))}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {ride.totalReviews || 0} reviews
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Views:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {ride.viewCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contacts:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {ride.contactCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRidesCarpoolingDetailView;

