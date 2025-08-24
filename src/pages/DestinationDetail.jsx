import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Star, Heart, Share2, Navigation,
  Calendar, Thermometer, ExternalLink, MessageSquare,
  Camera, User, ThumbsUp, Flag, Bed, Coffee, UtensilsCrossed,
  Car, Users, UserCheck, Package, Plane, Bell, Image,
  Info, CloudRain, Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ReviewForm from '../components/destinations/ReviewForm';
import ReviewCard from '../components/destinations/ReviewCard';
import ImageGallery from '../components/destinations/ImageGallery';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(1);
  const [reviewSort, setReviewSort] = useState('createdAt');
  const [ratingStats, setRatingStats] = useState([]);

  useEffect(() => {
    fetchDestination();
    fetchReviews();
    if (user) {
      checkFavoriteStatus();
      checkUserReview();
    }
  }, [id, user]);

  useEffect(() => {
    fetchReviews();
  }, [reviewsPage, reviewSort]);

  const fetchDestination = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/destinations/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setDestination(data);
      } else if (response.status === 404) {
        navigate('/plan-dream-tour');
      }
    } catch (error) {
      console.error('Error fetching destination:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const params = new URLSearchParams({
        page: reviewsPage,
        limit: 10,
        sortBy: reviewSort,
        sortOrder: 'desc'
      });

      const response = await fetch(`/api/reviews/destination/${id}?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setTotalReviewPages(data.pagination.pages);
        setRatingStats(data.ratingStats);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/favorites/check/${id}`, {
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

  const checkUserReview = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reviews/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const existingReview = data.reviews.find(review => 
          review.destinationId._id === id
        );
        setUserReview(existingReview);
      }
    } catch (error) {
      console.error('Error checking user review:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = isFavorite 
        ? `/api/favorites/${id}`
        : '/api/favorites';
      
      const method = isFavorite ? 'DELETE' : 'POST';
      const body = isFavorite ? undefined : JSON.stringify({ destinationId: id });

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
      title: destination.name,
      text: destination.description.substring(0, 100) + '...',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      // Show toast notification
    }
  };

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    fetchReviews();
    fetchDestination(); // Refresh to update average rating
    checkUserReview();
  };

  const openGoogleMaps = () => {
    window.open(destination.mapUrl, '_blank');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-5 h-5 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      );
    }

    return stars;
  };

  const getTypeColor = (type) => {
    const colors = {
      'Famous': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Popular': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Hidden': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Adventure': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Cultural': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Beach': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'Mountain': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      'Historical': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Wildlife': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'Religious': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Destination not found
        </h2>
        <button
          onClick={() => navigate('/plan-dream-tour')}
          className="btn-primary"
        >
          Back to Destinations
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/plan-dream-tour')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 self-start"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Destinations</span>
        </button>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={toggleFavorite}
            disabled={favoriteLoading}
            className={`btn-secondary flex items-center justify-center space-x-2 ${
              isFavorite ? 'text-red-600 border-red-600' : ''
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
            <span className="sm:hidden">{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleShare}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Image Gallery */}
          <ImageGallery images={destination.images} />

          {/* Basic Info */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {destination.name}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(destination.type)}`}>
                    {destination.type}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{destination.district}, {destination.province}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Navigation className="w-4 h-4" />
                    <span>{destination.distanceFromColombo} km from Colombo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {renderStars(destination.averageRating)}
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {destination.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  ({destination.totalReviews} reviews)
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none text-justify">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {destination.description}
              </p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="card p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reviews & Ratings
              </h2>

              {user && !userReview && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Write a Review</span>
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="mb-8">
                <ReviewForm
                  destinationId={id}
                  onSubmit={handleReviewSubmit}
                  onCancel={() => setShowReviewForm(false)}
                />
              </div>
            )}

            {/* User's Review */}
            {userReview && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Your Review
                </h3>
                <ReviewCard review={userReview} isOwn={true} onUpdate={handleReviewSubmit} />
              </div>
            )}

            {/* Rating Statistics */}
            {ratingStats.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Rating Breakdown
                </h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const stat = ratingStats.find(s => s._id === rating);
                    const count = stat ? stat.count : 0;
                    const percentage = destination.totalReviews > 0
                      ? (count / destination.totalReviews) * 100
                      : 0;

                    return (
                      <div key={rating} className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">
                          {rating}★
                        </span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                          <div
                            className="bg-yellow-400 dark:bg-yellow-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {/* Sort Controls */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  All Reviews ({destination.totalReviews})
                </h3>
                
                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors duration-200"
                >
                  <option value="createdAt">Most Recent</option>
                  <option value="rating">Highest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>

              {/* Reviews */}
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="flex space-x-4">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Be the first to share your experience!
                  </p>
                </div>
              ) : (
                <>
                  {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}

                  {/* Pagination */}
                  {totalReviewPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 pt-6">
                      <button
                        onClick={() => setReviewsPage(prev => Math.max(prev - 1, 1))}
                        disabled={reviewsPage === 1}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {reviewsPage} of {totalReviewPages}
                      </span>
                      
                      <button
                        onClick={() => setReviewsPage(prev => Math.min(prev + 1, totalReviewPages))}
                        disabled={reviewsPage === totalReviewPages}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Explore Around Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Search className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Explore Around {destination.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Discover services and attractions nearby
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => window.open(`https://www.google.com/search?q=locations+around+${encodeURIComponent(destination.name)}+Sri+Lanka`, '_blank')}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-left hover:shadow-md"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Explore Locations
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Discover nearby attractions
                </div>
              </button>

              <button
                onClick={() => window.open(`https://www.google.com/search?q=hotels+accommodation+near+${encodeURIComponent(destination.name)}+Sri+Lanka`, '_blank')}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-left hover:shadow-md"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Bed className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Find Perfect Stay
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hotels & accommodations
                </div>
              </button>

              <button
                onClick={() => window.open(`https://www.google.com/search?q=cafes+restaurants+near+${encodeURIComponent(destination.name)}+Sri+Lanka`, '_blank')}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-left hover:shadow-md"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Coffee className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Cafes & Restaurants
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Dining options nearby
                </div>
              </button>

              <button
                onClick={() => window.open(`https://www.google.com/search?q=food+beverages+local+cuisine+${encodeURIComponent(destination.name)}+Sri+Lanka`, '_blank')}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-left hover:shadow-md"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <UtensilsCrossed className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Foods & Beverages
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Local cuisine & drinks
                </div>
              </button>

              <button
                onClick={() => window.open(`https://www.google.com/search?q=live+traffic+updates+${encodeURIComponent(destination.name)}+Sri+Lanka`, '_blank')}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-left hover:shadow-md"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Navigation className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Live Ride Updates
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Traffic & transport info
                </div>
              </button>

              <button
                onClick={() => window.open(`https://www.google.com/search?q=vehicle+rentals+car+bike+rental+${encodeURIComponent(destination.name)}+Sri+Lanka`, '_blank')}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-left hover:shadow-md"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Car className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Vehicle Rentals
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Cars, bikes & more
                </div>
              </button>

              <button
                onClick={() => window.open(`https://www.google.com/search?q=travel+buddy+companions+${encodeURIComponent(destination.name)}+Sri+Lanka`, '_blank')}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-left hover:shadow-md"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Find Travel Buddy
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Travel companions
                </div>
              </button>

              <button
                onClick={() => window.open(`https://www.google.com/search?q=tour+guides+${encodeURIComponent(destination.name)}+Sri+Lanka`, '_blank')}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-left hover:shadow-md"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <UserCheck className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Find Tour Guides
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Local expert guides
                </div>
              </button>

              <button
                onClick={() => window.open(`https://www.google.com/search?q=exclusive+combo+packages+tours+${encodeURIComponent(destination.name)}+Sri+Lanka`, '_blank')}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-left hover:shadow-md"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Package className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Exclusive Combo Packages
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Special tour deals
                </div>
              </button>

              <button
                onClick={() => window.open(`https://www.google.com/search?q=local+tour+packages+${encodeURIComponent(destination.name)}+Sri+Lanka`, '_blank')}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-left hover:shadow-md"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Plane className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Local Tour Packages
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Guided local tours
                </div>
              </button>

              <button
                onClick={() => window.open(`https://www.google.com/search?q=event+updates+delivery+services+${encodeURIComponent(destination.name)}+Sri+Lanka`, '_blank')}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-left hover:shadow-md"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Event Updates & Services
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Local events & delivery
                </div>
              </button>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Info className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  More About {destination.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Additional resources and information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(destination.name)}+images&tbm=isch`, '_blank')}
                className="group p-6 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-center hover:shadow-md"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <Image className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      View More Images
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Browse photo gallery
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(destination.name)}+Sri+Lanka+information`, '_blank')}
                className="group p-6 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-center hover:shadow-md"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <Info className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      Know More About
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Detailed information
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(destination.name)}+weather+Sri+Lanka`, '_blank')}
                className="group p-6 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-center hover:shadow-md"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <CloudRain className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      Check Current Weather
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Weather updates
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Climate:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {destination.climate}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Province:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {destination.province}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">District:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {destination.district}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Distance from colombo:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {destination.distanceFromColombo} km
                </span>
              </div>

              {destination.recommendedToVisit && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Best time to visit:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {destination.recommendedToVisit}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Location
            </h3>
            
            <button
              onClick={openGoogleMaps}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-5 h-5" />
              <span>View on Google Maps</span>
            </button>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Statistics
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-600 dark:text-gray-400">Average Rating:</span>
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {destination.averageRating.toFixed(1)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Total Reviews:</span>
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {destination.totalReviews}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">Photos:</span>
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {destination.images?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
