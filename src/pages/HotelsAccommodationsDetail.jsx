import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  MapPin, Phone, Mail, Globe, Facebook, MessageCircle, Star,
  Building2, Utensils, Users, Shield, Activity, Image as ImageIcon,
  ChevronLeft, Loader, AlertCircle, CheckCircle, X, Sparkles,
  FileText, MapPinned, Send
} from 'lucide-react';

const HotelsAccommodationsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Review state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch hotel details
  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`/api/hotels-accommodations/${id}`);
        const data = await response.json();

        if (data.success) {
          setHotel(data.data);
          // Check if user has already reviewed
          const existingReview = data.data.reviews?.find(
            r => r.userId === user?._id
          );
          if (existingReview) {
            setUserReview(existingReview);
            setRating(existingReview.rating);
            setReviewText(existingReview.reviewText || '');
          }
        } else {
          setError('Failed to load hotel details');
        }
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        setError('Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id, user?._id]);

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setSubmittingReview(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/hotels-accommodations/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          reviewText
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setHotel(prev => ({
          ...prev,
          averageRating: data.data.averageRating,
          totalReviews: data.data.totalReviews,
          reviews: data.data.reviews
        }));
        setUserReview(data.data.reviews.find(r => r.userId === user._id));
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
        
        // If it's a new review, reset form
        if (!userReview) {
          setReviewText('');
          setRating(0);
        }
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Render star rating
  const renderStars = (value, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type={interactive ? 'button' : 'div'}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            disabled={!interactive}
            className={`transition-colors ${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            }`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= (interactive ? hoverRating || rating : value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (error && !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/hotels-accommodations')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  if (!hotel) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'facilities', label: 'Facilities', icon: Shield },
    { id: 'dining', label: 'Dining', icon: Utensils },
    { id: 'policies', label: 'Policies', icon: Shield },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'images', label: 'Gallery', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/hotels-accommodations')}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Hotels
        </button>

        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Hero Image */}
          <div className="relative h-64 md:h-96 bg-gray-200 dark:bg-gray-700">
            {hotel.images && hotel.images.length > 0 ? (
              <img
                src={hotel.images[0].url}
                alt={hotel.hotelName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Building2 className="w-24 h-24 text-gray-400" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {hotel.category}
              </div>
              {hotel.isHaveStars && hotel.howManyStars && (
                <div className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {hotel.howManyStars} Star Hotel
                </div>
              )}
              {hotel.isVerified && (
                <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </div>
              )}
            </div>
          </div>

          {/* Hotel Info */}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {hotel.hotelName}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              {renderStars(Math.round(hotel.averageRating || 0))}
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {(hotel.averageRating || 0).toFixed(1)}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                ({hotel.totalReviews || 0} {hotel.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
              <MapPin className="w-5 h-5" />
              <span>{hotel.location.address}, {hotel.location.city}, {hotel.location.province}</span>
            </div>

            {/* Climate */}
            {hotel.climate && (
              <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg text-sm mb-4">
                {hotel.climate}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {hotel.description}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotel.contactInfo.email && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                          <a href={`mailto:${hotel.contactInfo.email}`} className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                            {hotel.contactInfo.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.contactInfo.contactNumber && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                          <a href={`tel:${hotel.contactInfo.contactNumber}`} className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                            {hotel.contactInfo.contactNumber}
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.contactInfo.whatsappNumber && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">WhatsApp</p>
                          <a href={`https://wa.me/${hotel.contactInfo.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400">
                            {hotel.contactInfo.whatsappNumber}
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.contactInfo.websiteUrl && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Website</p>
                          <a href={hotel.contactInfo.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block">
                            {hotel.contactInfo.websiteUrl}
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.contactInfo.facebookUrl && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Facebook</p>
                          <a href={hotel.contactInfo.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block">
                            Facebook Page
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.location.mapUrl && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <MapPinned className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                          <a href={hotel.location.mapUrl} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400">
                            View on Map
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Details */}
                {hotel.location && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotel.location.address && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg md:col-span-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                          <p className="text-gray-900 dark:text-white font-medium">{hotel.location.address}</p>
                        </div>
                      )}
                      {hotel.location.city && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">City</p>
                          <p className="text-gray-900 dark:text-white font-medium">{hotel.location.city}</p>
                        </div>
                      )}
                      {hotel.location.province && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Province</p>
                          <p className="text-gray-900 dark:text-white font-medium">{hotel.location.province}</p>
                        </div>
                      )}
                      {hotel.climate && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg md:col-span-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Climate Zone</p>
                          <p className="text-gray-900 dark:text-white font-medium">{hotel.climate}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Other Info */}
                {hotel.otherInfo && hotel.otherInfo.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Additional Information</h3>
                    <ul className="space-y-2">
                      {hotel.otherInfo.map((info, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{info}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Facilities Tab */}
            {activeTab === 'facilities' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Facilities & Amenities</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {hotel.facilities?.internet && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Internet</span>
                    </div>
                  )}
                  {hotel.facilities?.parking && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Parking</span>
                    </div>
                  )}
                  {hotel.facilities?.bbqFacilities && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">BBQ Facilities</span>
                    </div>
                  )}
                  {hotel.facilities?.Weddinghall && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Wedding Hall</span>
                    </div>
                  )}
                  {hotel.facilities?.chef && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Chef</span>
                    </div>
                  )}
                  {hotel.facilities?.cctv && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">CCTV</span>
                    </div>
                  )}
                  {hotel.facilities?.swimmingPool && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Swimming Pool</span>
                    </div>
                  )}
                  {hotel.facilities?.gym && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Gym</span>
                    </div>
                  )}
                  {hotel.facilities?.spa && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Spa</span>
                    </div>
                  )}
                  {hotel.facilities?.kidsPlayArea && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Kids Play Area</span>
                    </div>
                  )}
                  {hotel.facilities?.roomService && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Room Service</span>
                    </div>
                  )}
                  {hotel.facilities?.restaurant && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Restaurant</span>
                    </div>
                  )}
                  {hotel.facilities?.laundryService && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Laundry Service</span>
                    </div>
                  )}
                  {hotel.facilities?.airportShuttle && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Airport Shuttle</span>
                    </div>
                  )}
                  {hotel.facilities?.petFriendly && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Pet Friendly</span>
                    </div>
                  )}
                  {hotel.facilities?.smokingArea && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Smoking Area</span>
                    </div>
                  )}
                  {hotel.facilities?.garden && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Garden</span>
                    </div>
                  )}
                  {hotel.facilities?.library && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Library</span>
                    </div>
                  )}
                  {hotel.facilities?.gameRoom && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Game Room</span>
                    </div>
                  )}
                  {hotel.facilities?.conferenceRoom && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Conference Room</span>
                    </div>
                  )}
                  {hotel.facilities?.banquetHall && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Banquet Hall</span>
                    </div>
                  )}
                  {hotel.facilities?.yogaDeck && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Yoga Deck</span>
                    </div>
                  )}
                  {hotel.facilities?.privateBeach && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Private Beach</span>
                    </div>
                  )}
                  {hotel.facilities?.sauna && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Sauna</span>
                    </div>
                  )}
                  {hotel.facilities?.bar && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Bar</span>
                    </div>
                  )}
                  {hotel.facilities?.wheelchairAccess && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Wheelchair Access</span>
                    </div>
                  )}
                  {hotel.facilities?.electricVehicleCharging && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">EV Charging</span>
                    </div>
                  )}
                  {hotel.facilities?.firepit && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Firepit</span>
                    </div>
                  )}
                  {hotel.facilities?.hikingTrails && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Hiking Trails</span>
                    </div>
                  )}
                  {hotel.facilities?.bikeRental && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Bike Rental</span>
                    </div>
                  )}
                  {hotel.facilities?.rooftopTerrace && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Rooftop Terrace</span>
                    </div>
                  )}
                  {hotel.facilities?.wineCellar && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Wine Cellar</span>
                    </div>
                  )}
                  {hotel.facilities?.movieTheater && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Movie Theater</span>
                    </div>
                  )}
                  {hotel.facilities?.coworkingSpace && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Coworking Space</span>
                    </div>
                  )}
                  {hotel.facilities?.picnicArea && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Picnic Area</span>
                    </div>
                  )}
                  {hotel.facilities?.fishingPond && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Fishing Pond</span>
                    </div>
                  )}
                  {hotel.facilities?.tennisCourt && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Tennis Court</span>
                    </div>
                  )}
                  {hotel.facilities?.golfCourse && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Golf Course</span>
                    </div>
                  )}
                  {hotel.facilities?.skiStorage && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Ski Storage</span>
                    </div>
                  )}
                  {hotel.facilities?.babysittingService && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Babysitting Service</span>
                    </div>
                  )}
                  {hotel.facilities?.meditationRoom && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Meditation Room</span>
                    </div>
                  )}
                  {hotel.facilities?.rooftopPool && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Rooftop Pool</span>
                    </div>
                  )}
                  {hotel.facilities?.artGallery && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Art Gallery</span>
                    </div>
                  )}
                  {hotel.facilities?.farmToTableDining && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Farm-to-Table Dining</span>
                    </div>
                  )}
                  {hotel.facilities?.outdoorJacuzzi && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Outdoor Jacuzzi</span>
                    </div>
                  )}
                  {hotel.facilities?.birdWatchingArea && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Bird Watching Area</span>
                    </div>
                  )}
                  {hotel.facilities?.EVChargingStation && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">EV Charging Station</span>
                    </div>
                  )}
                  {hotel.facilities?.rooftopBar && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Rooftop Bar</span>
                    </div>
                  )}
                  {hotel.facilities?.karaokeRoom && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Karaoke Room</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dining Tab */}
            {activeTab === 'dining' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Dining Options</h2>

                {hotel.diningOptions && (
                  <div className="space-y-4">
                    {/* Breakfast Information */}
                    {hotel.diningOptions.breakfastIncluded !== undefined && (
                      <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Breakfast</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {hotel.diningOptions.breakfastIncluded ? 'Breakfast Included' : 'Breakfast Available'}
                        </p>
                        {hotel.diningOptions.breakfastInfo && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{hotel.diningOptions.breakfastInfo}</p>
                        )}
                        {!hotel.diningOptions.breakfastIncluded && hotel.diningOptions.breakfastCharge && (
                          <p className="text-gray-900 dark:text-white font-medium">
                            LKR {hotel.diningOptions.breakfastCharge.toLocaleString()} per person
                          </p>
                        )}
                      </div>
                    )}

                    {/* Restaurant Information */}
                    {hotel.diningOptions.restaurantOnSite && (
                      <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">On-site Restaurant</h3>
                        {hotel.diningOptions.restaurantInfo && (
                          <p className="text-gray-700 dark:text-gray-300">{hotel.diningOptions.restaurantInfo}</p>
                        )}
                      </div>
                    )}

                    {/* Menu PDF */}
                    {hotel.diningOptions.menuPDF?.url && (
                      <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Menu</h3>
                        <a
                          href={hotel.diningOptions.menuPDF.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                          View Menu (PDF)
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Function & Event Spaces */}
                {hotel.functionOptions && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Function & Event Spaces</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotel.functionOptions.weddingHall && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                          <p className="text-gray-900 dark:text-white font-medium">Wedding Hall</p>
                        </div>
                      )}
                      {hotel.functionOptions.conferenceHall && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                          <p className="text-gray-900 dark:text-white font-medium">Conference Hall</p>
                        </div>
                      )}
                      {hotel.functionOptions.banquetFacility && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                          <p className="text-gray-900 dark:text-white font-medium">Banquet Facility</p>
                        </div>
                      )}
                      {hotel.functionOptions.meetingRooms && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                          <p className="text-gray-900 dark:text-white font-medium">Meeting Rooms</p>
                        </div>
                      )}
                      {hotel.functionOptions.eventSpace && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                          <p className="text-gray-900 dark:text-white font-medium">Event Space</p>
                        </div>
                      )}
                    </div>

                    {/* Packages PDF */}
                    {hotel.functionOptions.packagesPDF?.url && (
                      <div className="mt-6">
                        <a
                          href={hotel.functionOptions.packagesPDF.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                          View Event Packages (PDF)
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Policies Tab */}
            {activeTab === 'policies' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Policies</h2>

                {hotel.policies ? (
                  <div className="space-y-4">
                    {/* Check-in/out Times */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotel.policies.checkInTime && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Check-in Time</p>
                          <p className="text-gray-900 dark:text-white font-medium">{hotel.policies.checkInTime}</p>
                        </div>
                      )}
                      {hotel.policies.checkOutTime && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Check-out Time</p>
                          <p className="text-gray-900 dark:text-white font-medium">{hotel.policies.checkOutTime}</p>
                        </div>
                      )}
                    </div>

                    {/* Cancellation Policy */}
                    {hotel.policies.cancellationPolicy && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cancellation Policy</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.cancellationPolicy}</p>
                      </div>
                    )}

                    {/* Refund Policy */}
                    {hotel.policies.refundPolicy && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Refund Policy</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.refundPolicy}</p>
                      </div>
                    )}

                    {/* No Show Policy */}
                    {hotel.policies.noShowPolicy && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">No-Show Policy</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.noShowPolicy}</p>
                      </div>
                    )}

                    {/* Early Check-in & Late Check-out */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotel.policies.earlyCheckInPolicy && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Early Check-in</p>
                          <p className="text-gray-900 dark:text-white text-sm">{hotel.policies.earlyCheckInPolicy}</p>
                        </div>
                      )}
                      {hotel.policies.lateCheckOutPolicy && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Late Check-out</p>
                          <p className="text-gray-900 dark:text-white text-sm">{hotel.policies.lateCheckOutPolicy}</p>
                        </div>
                      )}
                    </div>

                    {/* Child Policy */}
                    {hotel.policies.childPolicy && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Child Policy</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.childPolicy}</p>
                      </div>
                    )}

                    {/* Age Restriction */}
                    {hotel.policies.ageRestriction && hotel.policies.minimumCheckInAge && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Minimum Check-in Age</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.minimumCheckInAge} years</p>
                      </div>
                    )}

                    {/* Pet Policy */}
                    {hotel.policies.pets !== undefined && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pet Policy</p>
                        <p className="text-gray-900 dark:text-white">
                          {hotel.policies.pets ? 'Pets allowed' : 'Pets not allowed'}
                          {hotel.policies.petPolicyDetails && ` - ${hotel.policies.petPolicyDetails}`}
                        </p>
                      </div>
                    )}

                    {/* Party Policy */}
                    {hotel.policies.parties !== undefined && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Party/Events Policy</p>
                        <p className="text-gray-900 dark:text-white">
                          {hotel.policies.parties ? 'Parties/Events allowed' : 'Parties/Events not allowed'}
                          {hotel.policies.partyPolicyDetails && ` - ${hotel.policies.partyPolicyDetails}`}
                        </p>
                      </div>
                    )}

                    {/* Smoking & Liquor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotel.policies.allowsSmoking !== undefined && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Smoking</p>
                          <p className="text-gray-900 dark:text-white">{hotel.policies.allowsSmoking ? 'Allowed' : 'Not Allowed'}</p>
                        </div>
                      )}
                      {hotel.policies.allowsLiquor !== undefined && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Liquor</p>
                          <p className="text-gray-900 dark:text-white">{hotel.policies.allowsLiquor ? 'Allowed' : 'Not Allowed'}</p>
                        </div>
                      )}
                    </div>

                    {/* Quiet Hours */}
                    {hotel.policies.quietHours && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Quiet Hours</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.quietHours}</p>
                      </div>
                    )}

                    {/* Damage Deposit */}
                    {hotel.policies.damageDeposit && hotel.policies.damageDepositAmount && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Damage Deposit</p>
                        <p className="text-gray-900 dark:text-white">LKR {hotel.policies.damageDepositAmount.toLocaleString()}</p>
                      </div>
                    )}

                    {/* Tax and Charges */}
                    {hotel.policies.taxAndCharges && hotel.policies.taxAndChargesAmount && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tax & Service Charges</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.taxAndChargesAmount}%</p>
                      </div>
                    )}

                    {/* Additional Charges */}
                    {hotel.policies.additionalCharges && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Additional Charges</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.additionalCharges}</p>
                      </div>
                    )}

                    {/* Payment Methods */}
                    {hotel.policies.acceptedPaymentMethods && hotel.policies.acceptedPaymentMethods.length > 0 && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Accepted Payment Methods</p>
                        <div className="flex flex-wrap gap-2">
                          {hotel.policies.acceptedPaymentMethods.map((method, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No policies information available</p>
                )}
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Activities & Attractions</h2>

                {hotel.activities?.onsiteActivities && hotel.activities.onsiteActivities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">On-site Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {hotel.activities.onsiteActivities.map((activity, index) => (
                        <span key={index} className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hotel.activities?.nearbyAttractions && hotel.activities.nearbyAttractions.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Nearby Attractions</h3>
                    <div className="flex flex-wrap gap-2">
                      {hotel.activities.nearbyAttractions.map((attraction, index) => (
                        <span key={index} className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
                          {attraction}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hotel.activities?.nearbyActivities && hotel.activities.nearbyActivities.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Nearby Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {hotel.activities.nearbyActivities.map((activity, index) => (
                        <span key={index} className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(!hotel.activities ||
                  (!hotel.activities.onsiteActivities?.length &&
                   !hotel.activities.nearbyAttractions?.length &&
                   !hotel.activities.nearbyActivities?.length)) && (
                  <p className="text-gray-600 dark:text-gray-400">No activities information available</p>
                )}
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Gallery</h2>

                {hotel.images && hotel.images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hotel.images.map((image, index) => (
                      <div key={index} className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group">
                        <img
                          src={image.url}
                          alt={`${hotel.hotelName} - Image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No images available</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reviews & Ratings</h2>

                {/* Overall Rating */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                        {(hotel.averageRating || 0).toFixed(1)}
                      </div>
                      {renderStars(Math.round(hotel.averageRating || 0))}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {hotel.totalReviews || 0} {hotel.totalReviews === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add Review Form */}
                {user ? (
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {userReview ? 'Update Your Review' : 'Write a Review'}
                    </h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Rating *
                        </label>
                        {renderStars(rating, true)}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Review (Optional)
                        </label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          rows="4"
                          maxLength="1000"
                          placeholder="Share your experience..."
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {reviewText.length}/1000 characters
                        </p>
                      </div>

                      {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submittingReview || rating === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingReview ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            {userReview ? 'Update Review' : 'Submit Review'}
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-yellow-800 dark:text-yellow-200">
                      Please <button onClick={() => navigate('/login')} className="underline font-medium">login</button> to write a review
                    </p>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Reviews</h3>

                  {hotel.reviews && hotel.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {hotel.reviews.map((review, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{review.userName}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            {renderStars(review.rating)}
                          </div>
                          {review.reviewText && (
                            <p className="text-gray-700 dark:text-gray-300">{review.reviewText}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Review Submitted!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Thank you for your feedback!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelsAccommodationsDetail;
