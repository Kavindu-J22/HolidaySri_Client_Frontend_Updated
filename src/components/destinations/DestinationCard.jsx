import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, Eye, Share2, Navigation } from 'lucide-react';
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
    <div className="card overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700" onClick={handleViewMore}>
        {destination.images && destination.images.length > 0 ? (
          <img
            src={destination.images[0].url}
            alt={destination.images[0].alt || destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(destination.type)}`}>
            {destination.type}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={toggleFavorite}
            disabled={favoriteLoading}
            className={`p-2 rounded-full shadow-md transition-colors duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            title="Share destination"
          >
            <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6" onClick={handleViewMore}>
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {destination.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-1">
              {renderStars(destination.averageRating)}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {destination.averageRating.toFixed(1)} ({destination.totalReviews} reviews)
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{destination.district}, {destination.province}</span>
            <span className="mx-2">•</span>
            <Navigation className="w-4 h-4 mr-1" />
            <span>{destination.distanceFromColombo} km from Colombo</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {showMore ? destination.description : truncatedDescription}
          </p>
          {destination.description.length > 120 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMore(!showMore);
              }}
              className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline mt-1"
            >
              {showMore ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Climate */}
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {destination.climate}
          </span>
        </div>

        {/* View More Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewMore();
          }}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>View More</span>
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;
