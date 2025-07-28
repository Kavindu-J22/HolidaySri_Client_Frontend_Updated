import React, { useState, useEffect } from 'react';
import { MapPin, Star, Heart, Eye, DollarSign, Navigation, Thermometer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LocationCard = ({ location, onFavoriteChange }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, location._id]);

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/location-favorites/check/${location._id}`, {
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

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = isFavorite 
        ? `/api/location-favorites/${location._id}`
        : '/api/location-favorites';
      
      const method = isFavorite ? 'DELETE' : 'POST';
      const body = isFavorite ? undefined : JSON.stringify({ locationId: location._id });

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
        if (onFavoriteChange) {
          onFavoriteChange(location._id);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleViewMore = () => {
    navigate(`/locations/${location._id}`);
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

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const formatEnteringFee = (enteringFee) => {
    if (enteringFee.isFree) {
      return 'Free';
    }
    return `${enteringFee.currency} ${enteringFee.amount}`;
  };

  const truncateDescription = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700">
      {/* Image */}
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        {location.images && location.images.length > 0 ? (
          <img
            src={location.images[0].url}
            alt={location.images[0].alt || location.name}
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
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${getTypeColor(location.locationType)} shadow-lg`}>
            {location.locationType}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          disabled={favoriteLoading}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isFavorite
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Entering Fee Badge */}
        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg ${
            location.enteringFee.isFree 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-500 text-white'
          }`}>
            <DollarSign className="w-3 h-3 inline mr-1" />
            {formatEnteringFee(location.enteringFee)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {location.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-1">
              {renderStars(location.averageRating)}
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {location.averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({location.totalReviews} reviews)
            </span>
          </div>
        </div>

        {/* Location Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{location.district}, {location.province}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Navigation className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{location.distanceFromColombo} km from Colombo</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Thermometer className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{location.climate}</span>
          </div>
        </div>

        {/* Main Destination */}
        {location.mainDestination && (
          <div className="mb-4">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
              Near {location.mainDestination.name}
            </span>
          </div>
        )}

        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {showFullDescription 
              ? location.description 
              : truncateDescription(location.description)
            }
          </p>
          {location.description.length > 120 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFullDescription(!showFullDescription);
              }}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 mt-1"
            >
              {showFullDescription ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Recommended Visit Time */}
        <div className="mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Best time:</span> {location.recommendedToVisit}
          </span>
        </div>

        {/* Facilities */}
        {location.facilities && location.facilities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {location.facilities.slice(0, 3).map((facility, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                >
                  {facility}
                </span>
              ))}
              {location.facilities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                  +{location.facilities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* View More Button */}
        <button
          onClick={handleViewMore}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 group"
        >
          <Eye className="w-4 h-4 mr-2" />
          View More
          <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
        </button>
      </div>
    </div>
  );
};

export default LocationCard;
