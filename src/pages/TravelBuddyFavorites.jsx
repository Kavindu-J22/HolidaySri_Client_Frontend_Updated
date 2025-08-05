import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart,
  Star,
  Eye,
  MapPin,
  User,
  Trash2,
  MessageCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TravelBuddyFavorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingFavorite, setRemovingFavorite] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/travel-buddy/favorites/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setFavorites(data.data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (buddyId) => {
    try {
      setRemovingFavorite(buddyId);
      const response = await fetch(`/api/travel-buddy/${buddyId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setFavorites(prev => prev.filter(fav => fav._id !== buddyId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setRemovingFavorite(null);
    }
  };

  const handleProfileClick = (buddyId) => {
    navigate(`/travel-buddy/${buddyId}`);
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
  };

  const handleWhatsAppContact = async (buddy) => {
    try {
      // Record contact
      await fetch(`/api/travel-buddy/${buddy._id}/contact`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Open WhatsApp
      const message = encodeURIComponent(`Hi ${buddy.userName}! I found your travel buddy profile on HolidaySri and would love to connect for potential travel opportunities.`);
      const whatsappUrl = `https://wa.me/${buddy.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error recording contact:', error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const FavoriteCard = ({ buddy }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Cover Photo */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={buddy.coverPhoto.url}
          alt={`${buddy.userName}'s cover`}
          className="w-full h-full object-cover"
        />
        {buddy.user?.isMember && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            ⭐ Member
          </div>
        )}
        <button
          onClick={() => handleRemoveFavorite(buddy._id)}
          disabled={removingFavorite === buddy._id}
          className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
          title="Remove from favorites"
        >
          {removingFavorite === buddy._id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Profile Content */}
      <div className="p-4">
        {/* Avatar and Basic Info */}
        <div className="flex items-start space-x-3 mb-3">
          <img
            src={buddy.avatarImage.url}
            alt={buddy.userName}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg -mt-6 relative z-10"
          />
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {buddy.userName}
              {buddy.nickName && (
                <span className="text-sm text-gray-500 ml-2">({buddy.nickName})</span>
              )}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{buddy.country}</span>
              <span>•</span>
              <span>{buddy.age} years</span>
            </div>
          </div>
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(buddy.averageRating)}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {buddy.averageRating > 0 ? buddy.averageRating.toFixed(1) : 'No ratings'}
              {buddy.totalReviews > 0 && ` (${buddy.totalReviews})`}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Eye className="w-4 h-4" />
            <span>{formatViewCount(buddy.viewCount)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {buddy.description}
        </p>

        {/* Interests */}
        {buddy.interests && buddy.interests.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {buddy.interests.slice(0, 2).map((interest, index) => (
              <span
                key={index}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs"
              >
                {interest}
              </span>
            ))}
            {buddy.interests.length > 2 && (
              <span className="text-xs text-gray-500">+{buddy.interests.length - 2} more</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleProfileClick(buddy._id)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
          >
            View Profile
          </button>
          <button
            onClick={() => handleWhatsAppContact(buddy)}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/travel-buddies')}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Travel Buddies</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Favorite Travel Buddies
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                You have {favorites.length} favorite travel {favorites.length === 1 ? 'buddy' : 'buddies'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((buddy) => (
                <FavoriteCard key={buddy._id} buddy={buddy} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Favorite Travel Buddies Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring and add travel buddies to your favorites to see them here
            </p>
            <button
              onClick={() => navigate('/travel-buddies')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Explore Travel Buddies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelBuddyFavorites;
