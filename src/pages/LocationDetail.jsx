import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Star, Heart, Share2, Navigation,
  Calendar, Thermometer, ExternalLink, MessageSquare,
  Camera, User, ThumbsUp, Flag, DollarSign, Info,
  CloudRain, Search, Building, Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LocationReviewForm from '../components/locations/LocationReviewForm';
import LocationReviewCard from '../components/locations/LocationReviewCard';
import LocationImageGallery from '../components/locations/LocationImageGallery';

const LocationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);
  const [reviewsSort, setReviewsSort] = useState('createdAt-desc');
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchLocation();
    fetchReviews();
    if (user) {
      checkFavoriteStatus();
      fetchUserReview();
    }
  }, [id, user]);

  useEffect(() => {
    fetchReviews();
  }, [reviewsPage, reviewsSort]);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/locations/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Location not found');
        } else {
          setError('Failed to load location');
        }
        return;
      }

      const data = await response.json();
      setLocation(data);
    } catch (error) {
      console.error('Error fetching location:', error);
      setError('Failed to load location');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const [sortBy, sortOrder] = reviewsSort.split('-');
      const params = new URLSearchParams({
        locationId: id,
        page: reviewsPage,
        limit: 10,
        sortBy,
        sortOrder
      });

      const response = await fetch(`/api/location-reviews?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setReviewsTotalPages(data.pagination.pages);
        setRatingDistribution(data.ratingDistribution);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/location-reviews/user/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserReview(data);
      }
    } catch (error) {
      console.error('Error fetching user review:', error);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/location-favorites/check/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = isFavorite 
        ? `/api/location-favorites/${id}`
        : '/api/location-favorites';
      
      const method = isFavorite ? 'DELETE' : 'POST';
      const body = isFavorite ? undefined : JSON.stringify({ locationId: id });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: location.name,
      text: `Check out ${location.name} - ${location.description.substring(0, 100)}...`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Location URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Location URL copied to clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
      }
    }
  };

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    fetchLocation(); // Refresh to get updated rating
    fetchReviews();
    fetchUserReview();
  };

  const handleReviewUpdate = () => {
    fetchLocation(); // Refresh to get updated rating
    fetchReviews();
    fetchUserReview();
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowImageGallery(true);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const formatEnteringFee = (enteringFee) => {
    if (enteringFee.isFree) {
      return 'Free Entry';
    }
    return `${enteringFee.currency} ${enteringFee.amount}`;
  };

  const getTypeColor = (type) => {
    const colors = {
      'Cultural and religious site': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Historical landmark': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'Traditional shopping area': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Natural attraction': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'Adventure site': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Beach destination': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'Mountain location': 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
      'Wildlife sanctuary': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
      'Archaeological site': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Scenic viewpoint': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Waterfall': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'National park': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      'Temple complex': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
      'Colonial architecture': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
      'Local market': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!location) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                  {location.name}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    {renderStars(location.averageRating)}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {location.averageRating.toFixed(1)} ({location.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Share Location"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite
                    ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4">
                {location.images.slice(0, 6).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `${location.name} image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {index === 5 && location.images.length > 6 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          +{location.images.length - 6} more
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Location Information
                </h2>
                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getTypeColor(location.locationType)}`}>
                  {location.locationType}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</p>
                      <p className="text-gray-900 dark:text-white">{location.district}, {location.province}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Navigation className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Distance from Colombo</p>
                      <p className="text-gray-900 dark:text-white">{location.distanceFromColombo} km</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Thermometer className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Climate</p>
                      <p className="text-gray-900 dark:text-white">{location.climate}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Best time to visit</p>
                      <p className="text-gray-900 dark:text-white">{location.recommendedToVisit}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Entering Fee</p>
                      <p className={`font-semibold ${location.enteringFee.isFree ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {formatEnteringFee(location.enteringFee)}
                      </p>
                    </div>
                  </div>

                  {location.mainDestination && (
                    <div className="flex items-start space-x-3">
                      <Building className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Main Destination</p>
                        <p className="text-gray-900 dark:text-white">{location.mainDestination.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Link */}
              {location.mapUrl && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                About This Location
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {location.description}
                </p>
              </div>
            </div>

            {/* Facilities & Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facilities */}
              {location.facilities && location.facilities.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Facilities
                  </h3>
                  <div className="space-y-2">
                    {location.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Activities */}
              {location.nearbyActivities && location.nearbyActivities.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Nearby Activities
                  </h3>
                  <div className="space-y-2">
                    {location.nearbyActivities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Reviews ({location.totalReviews})
                </h2>

                {user && !userReview && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Write Review
                  </button>
                )}
              </div>

              {/* Rating Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {location.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {renderStars(location.averageRating)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Based on {location.totalReviews} reviews
                  </p>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                        {rating}★
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${location.totalReviews > 0 ? ((ratingDistribution[rating] || 0) / location.totalReviews) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                        {ratingDistribution[rating] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* User's Review */}
              {userReview && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Your Review</h4>
                  <LocationReviewCard
                    review={userReview}
                    isOwn={true}
                    onUpdate={handleReviewUpdate}
                  />
                </div>
              )}

              {/* Reviews List */}
              {reviews.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      All Reviews
                    </h3>
                    <select
                      value={reviewsSort}
                      onChange={(e) => setReviewsSort(e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="createdAt-desc">Newest First</option>
                      <option value="createdAt-asc">Oldest First</option>
                      <option value="rating-desc">Highest Rated</option>
                      <option value="rating-asc">Lowest Rated</option>
                      <option value="helpful-desc">Most Helpful</option>
                    </select>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <LocationReviewCard
                        key={review._id}
                        review={review}
                        isOwn={user && review.userId._id === user.id}
                        onUpdate={handleReviewUpdate}
                      />
                    ))}
                  </div>

                  {/* Reviews Pagination */}
                  {reviewsTotalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mt-6">
                      <button
                        onClick={() => setReviewsPage(prev => Math.max(prev - 1, 1))}
                        disabled={reviewsPage === 1}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      <span className="text-gray-600 dark:text-gray-400">
                        Page {reviewsPage} of {reviewsTotalPages}
                      </span>

                      <button
                        onClick={() => setReviewsPage(prev => Math.min(prev + 1, reviewsTotalPages))}
                        disabled={reviewsPage === reviewsTotalPages}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* No Reviews State */}
              {reviews.length === 0 && !reviewsLoading && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Be the first to share your experience!
                  </p>
                  {user && !userReview && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Write First Review
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleFavoriteToggle}
                  disabled={favoriteLoading}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors ${
                    isFavorite
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Location
                </button>

                {location.mapUrl && (
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Maps
                  </a>
                )}
              </div>
            </div>

            {/* Location Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Location Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Average Rating</span>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {location.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Reviews</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {location.totalReviews}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Distance</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {location.distanceFromColombo} km
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Entry Fee</span>
                  <span className={`font-semibold ${location.enteringFee.isFree ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {formatEnteringFee(location.enteringFee)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <LocationImageGallery
          images={location.images}
          initialIndex={selectedImageIndex}
          onClose={() => setShowImageGallery(false)}
        />
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <LocationReviewForm
          locationId={id}
          existingReview={userReview}
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
};

export default LocationDetail;
