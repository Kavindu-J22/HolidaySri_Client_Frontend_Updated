import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, Eye, Share2, Navigation, Calendar, Thermometer } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DestinationCard = ({ destination }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [destination._id, user]);

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/favorites/check/${destination._id}`, {
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

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = isFavorite 
        ? `/api/favorites/${destination._id}`
        : '/api/favorites';
      
      const method = isFavorite ? 'DELETE' : 'POST';
      const body = isFavorite ? undefined : JSON.stringify({ destinationId: destination._id });

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

  const handleShare = async (e) => {
    e.stopPropagation();
    
    const shareData = {
      title: destination.name,
      text: destination.description.substring(0, 100) + '...',
      url: `${window.location.origin}/destinations/${destination._id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(shareData.url);
      // You could show a toast notification here
    }
  };

  const handleViewMore = () => {
    navigate(`/destinations/${destination._id}`);
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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const truncatedDescription = destination.description.length > 120 
    ? destination.description.substring(0, 120) + '...'
    : destination.description;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800" onClick={handleViewMore}>
        {destination.images && destination.images.length > 0 ? (
          <img
            src={destination.images[0].url}
            alt={destination.images[0].alt || destination.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${getTypeColor(destination.type)} shadow-lg`}>
            {destination.type}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={toggleFavorite}
            disabled={favoriteLoading}
            className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all duration-200 ${
              isFavorite
                ? 'bg-red-500/90 text-white hover:bg-red-600/90 scale-110'
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:scale-110'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 bg-white/90 dark:bg-gray-800/90 rounded-full backdrop-blur-md shadow-lg hover:bg-white dark:hover:bg-gray-800 hover:scale-110 transition-all duration-200"
            title="Share destination"
          >
            <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Rating Badge */}
        {destination.averageRating > 0 && (
          <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {destination.averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col" onClick={handleViewMore}>
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 leading-tight">
            {destination.name}
          </h3>

          {/* Location & Distance */}
          <div className="flex flex-col space-y-2 mb-3">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-2 text-primary-500" />
              <span className="font-medium">{destination.district}, {destination.province}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Navigation className="w-4 h-4 mr-2 text-primary-500" />
              <span>{destination.distanceFromColombo} km from Colombo</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {renderStars(destination.averageRating)}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {destination.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {destination.totalReviews} reviews
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4 flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
            {showMore ? destination.description : truncatedDescription}
          </p>
          {destination.description.length > 120 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMore(!showMore);
              }}
              className="text-primary-600 dark:text-primary-400 text-xs font-semibold hover:underline mt-2 transition-colors duration-200"
            >
              {showMore ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Climate and Recommended Visit Time */}
        <div className="mb-5 space-y-3">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
              {destination.climate}
            </span>
          </div>
          {destination.recommendedToVisit && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-green-600 dark:text-green-400">Best time:</span> {destination.recommendedToVisit}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View More Button - Fixed at bottom */}
      <div className="px-6 pb-6 pt-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewMore();
          }}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Eye className="w-4 h-4" />
          <span>Explore Now</span>
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;