import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Globe,
  Facebook,
  Truck,
  Users,
  DollarSign,
  Star,
  Send,
  Loader,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Share2,
  Copy,
  X,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPinned,
  Info
} from 'lucide-react';
import axios from 'axios';
import SuccessModal from '../components/common/SuccessModal';
import { useAuth } from '../contexts/AuthContext';

const VehicleRentalsHireDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLiveRideModal, setShowLiveRideModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editingLiveRide, setEditingLiveRide] = useState(null);
  const [liveRideForm, setLiveRideForm] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    description: '',
    maxPassengerCount: '',
    availablePassengerCount: '',
    pricePerSeat: '',
    status: 'Upcoming',
    approximateTimeToRide: ''
  });

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`https://holidaysri-backend-9xm4.onrender.com/api/vehicle-rentals-hire/${id}`);
        if (response.data.success) {
          setListing(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(err.response?.data?.message || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating) {
      setError('Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      setError('Please write a review');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await axios.post(
        `https://holidaysri-backend-9xm4.onrender.com/api/vehicle-rentals-hire/${id}/reviews`,
        { rating, reviewText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setRating(0);
        setReviewText('');
        
        // Refresh listing data
        setTimeout(() => {
          const fetchUpdated = async () => {
            const res = await axios.get(`https://holidaysri-backend-9xm4.onrender.com/api/vehicle-rentals-hire/${id}`);
            if (res.data.success) {
              setListing(res.data.data);
            }
          };
          fetchUpdated();
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle share functionality
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = listing?.name || 'Vehicle Rental';
    const text = `Check out this vehicle rental: ${title}`;

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
        setSuccess(true);
        setShowShareModal(false);
        break;
      default:
        break;
    }
  };

  // Handle Live Ride form
  const handleLiveRideFormChange = (e) => {
    const { name, value } = e.target;
    setLiveRideForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLiveRide = () => {
    setEditingLiveRide(null);
    setLiveRideForm({
      from: '',
      to: '',
      date: '',
      time: '',
      description: '',
      maxPassengerCount: '',
      availablePassengerCount: '',
      pricePerSeat: '',
      status: 'Upcoming',
      approximateTimeToRide: ''
    });
    setShowLiveRideModal(true);
  };

  const handleEditLiveRide = (ride) => {
    setEditingLiveRide(ride);
    setLiveRideForm({
      from: ride.from,
      to: ride.to,
      date: new Date(ride.date).toISOString().split('T')[0],
      time: ride.time,
      description: ride.description || '',
      maxPassengerCount: ride.maxPassengerCount,
      availablePassengerCount: ride.availablePassengerCount,
      pricePerSeat: ride.pricePerSeat,
      status: ride.status,
      approximateTimeToRide: ride.approximateTimeToRide
    });
    setShowLiveRideModal(true);
  };

  const handleSubmitLiveRide = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to add live rides');
        setSubmitting(false);
        return;
      }

      const url = editingLiveRide
        ? `https://holidaysri-backend-9xm4.onrender.com/api/vehicle-rentals-hire/${id}/live-rides/${editingLiveRide._id}`
        : `https://holidaysri-backend-9xm4.onrender.com/api/vehicle-rentals-hire/${id}/live-rides`;

      const method = editingLiveRide ? 'put' : 'post';

      const response = await axios[method](url, liveRideForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccess(true);
        setShowLiveRideModal(false);
        // Refresh listing data
        const res = await axios.get(`https://holidaysri-backend-9xm4.onrender.com/api/vehicle-rentals-hire/${id}`);
        if (res.data.success) {
          setListing(res.data.data);
        }
      }
    } catch (err) {
      console.error('Error submitting live ride:', err);
      setError(err.response?.data?.message || 'Failed to submit live ride');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLiveRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to delete this live ride?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `https://holidaysri-backend-9xm4.onrender.com/api/vehicle-rentals-hire/${id}/live-rides/${rideId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess(true);
        // Refresh listing data
        const res = await axios.get(`https://holidaysri-backend-9xm4.onrender.com/api/vehicle-rentals-hire/${id}`);
        if (res.data.success) {
          setListing(res.data.data);
        }
      }
    } catch (err) {
      console.error('Error deleting live ride:', err);
      setError(err.response?.data?.message || 'Failed to delete live ride');
    }
  };

  const isOwner = user && listing && user.id === listing.userId?._id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{error}</p>
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

  if (!listing) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Success Modal */}
        {success && (
          <SuccessModal
            title="Success!"
            message="Action completed successfully."
            onClose={() => setSuccess(false)}
          />
        )}

        {/* Back Button and Share */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-4 sm:mb-6 lg:mb-8">
              {listing.images && listing.images.length > 0 ? (
                <div className="relative h-48 sm:h-64 md:h-80 lg:h-96">
                  <img
                    src={listing.images[currentImageIndex]?.url}
                    alt={`${listing.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {listing.images.length > 1 && (
                    <>
                      {/* Left Arrow */}
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length)}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      {/* Right Arrow */}
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev + 1) % listing.images.length)}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      {/* Dot Indicators */}
                      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
                        {listing.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
                              idx === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                            }`}
                          />
                        ))}
                      </div>
                      {/* Image Counter */}
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                        {currentImageIndex + 1} / {listing.images.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-48 sm:h-64 md:h-80 lg:h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400">
                  No Images Available
                </div>
              )}
            </div>

            {/* Live Ride Banner - Only for Owner */}
            {isOwner && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 lg:mb-8 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">
                      {listing.liveRides && listing.liveRides.length > 0
                        ? '🚗 Add More Live Rides'
                        : '🎉 Add 1 Free Live Ride'}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base opacity-90 leading-relaxed">
                      {listing.liveRides && listing.liveRides.length > 0
                        ? 'Want to add more live rides? Purchase a Live Ride & Carpooling advertisement slot.'
                        : 'Offer carpooling services to passengers! Add your first live ride for free.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (listing.liveRides && listing.liveRides.length > 0) {
                        navigate('/ads/vehicles-transport/live-rides-carpooling');
                      } else {
                        handleAddLiveRide();
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 bg-white text-blue-600 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-100 transition whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {listing.liveRides && listing.liveRides.length > 0 ? 'Browse Live Rides' : 'Add Live Ride'}
                  </button>
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                {listing.name}
              </h1>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-1 sm:gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < Math.floor(listing.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  {listing.averageRating || 'No ratings yet'}
                </span>
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  ({listing.totalReviews} reviews)
                </span>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Vehicle Type</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{listing.vehicleCategory}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Service</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{listing.serviceCategory}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Capacity</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{listing.capacity} persons</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Rs. {listing.pricePerKm}/km</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Location</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    {listing.city}, {listing.province}
                  </p>
                </div>
              </div>

              {/* Status Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Vehicle Status</p>
                  <p className={`text-sm sm:text-base font-semibold ${
                    listing.vehicleStatus === 'Available'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {listing.vehicleStatus}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Driver Status</p>
                  <p className={`text-sm sm:text-base font-semibold ${
                    listing.driverStatus === 'Available'
                      ? 'text-green-600 dark:text-green-400'
                      : listing.driverStatus === 'On Demand'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {listing.driverStatus}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Driver Gender</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{listing.driverGender}</p>
                </div>
              </div>

              {/* Features */}
              {listing.features && listing.features.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {listing.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Live Rides Section */}
            {listing.liveRides && listing.liveRides.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <MapPinned className="w-5 h-5 sm:w-6 sm:h-6" />
                  Available Live Rides
                </h3>
                <div className="space-y-4">
                  {listing.liveRides.map((ride) => (
                    <div key={ride._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                              {ride.from} → {ride.to}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              {new Date(ride.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                              {ride.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                              {ride.availablePassengerCount}/{ride.maxPassengerCount} seats
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                            ride.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            ride.status === 'Starting Soon' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            ride.status === 'Ongoing' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            ride.status === 'Over Soon' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}>
                            {ride.status}
                          </span>
                          <span className="text-base sm:text-lg font-bold text-blue-600">
                            Rs. {ride.pricePerSeat}
                          </span>
                        </div>
                      </div>
                      {ride.description && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {ride.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <Info className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                          Approx. {ride.approximateTimeToRide}
                        </span>
                        {isOwner && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditLiveRide(ride)}
                              className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLiveRide(ride._id)}
                              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Reviews ({listing.totalReviews})
              </h3>

              {listing.reviews && listing.reviews.length > 0 ? (
                <div className="space-y-6">
                  {listing.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {review.userId?.firstName} {review.userId?.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
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
                      <p className="text-gray-600 dark:text-gray-400">{review.reviewText}</p>
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-4 mb-6">
                <a
                  href={`tel:${listing.contact}`}
                  className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                >
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900 dark:text-white font-semibold">{listing.contact}</span>
                </a>

                {listing.website && (
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition"
                  >
                    <Globe className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900 dark:text-white font-semibold">Website</span>
                  </a>
                )}

                {listing.facebook && (
                  <a
                    href={listing.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900 dark:text-white font-semibold">Facebook</span>
                  </a>
                )}
              </div>

              {/* Review Form */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Leave a Review
                </h4>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoverRating || rating)
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
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience..."
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Review
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share this listing</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition"
                >
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">Share on Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center gap-3 p-3 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/40 rounded-lg transition"
                >
                  <Share2 className="w-5 h-5 text-sky-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">Share on Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-full flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">Share on WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition"
                >
                  <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Ride Modal */}
        {showLiveRideModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 my-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {editingLiveRide ? 'Edit Live Ride' : 'Add Live Ride'}
                </h3>
                <button
                  onClick={() => setShowLiveRideModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmitLiveRide} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      From *
                    </label>
                    <input
                      type="text"
                      name="from"
                      value={liveRideForm.from}
                      onChange={handleLiveRideFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Starting location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      To *
                    </label>
                    <input
                      type="text"
                      name="to"
                      value={liveRideForm.to}
                      onChange={handleLiveRideFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Destination"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={liveRideForm.date}
                      onChange={handleLiveRideFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={liveRideForm.time}
                      onChange={handleLiveRideFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Short Description
                  </label>
                  <textarea
                    name="description"
                    value={liveRideForm.description}
                    onChange={handleLiveRideFormChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Additional details about the ride..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Max Passengers *
                    </label>
                    <input
                      type="number"
                      name="maxPassengerCount"
                      value={liveRideForm.maxPassengerCount}
                      onChange={handleLiveRideFormChange}
                      required
                      min="1"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Available Seats *
                    </label>
                    <input
                      type="number"
                      name="availablePassengerCount"
                      value={liveRideForm.availablePassengerCount}
                      onChange={handleLiveRideFormChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Price/Seat (Rs.) *
                    </label>
                    <input
                      type="number"
                      name="pricePerSeat"
                      value={liveRideForm.pricePerSeat}
                      onChange={handleLiveRideFormChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={liveRideForm.status}
                      onChange={handleLiveRideFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Starting Soon">Starting Soon</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Over Soon">Over Soon</option>
                      <option value="Over">Over</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Approx. Time *
                    </label>
                    <input
                      type="text"
                      name="approximateTimeToRide"
                      value={liveRideForm.approximateTimeToRide}
                      onChange={handleLiveRideFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g., 2 hours"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLiveRideModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {editingLiveRide ? 'Update' : 'Add'} Live Ride
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleRentalsHireDetail;

