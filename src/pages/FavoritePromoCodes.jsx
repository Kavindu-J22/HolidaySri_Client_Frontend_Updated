import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { promoCodeAPI } from '../config/api';
import {
  Heart,
  Star,
  Crown,
  Diamond,
  Gift,
  Copy,
  HeartOff,
  Loader,
  RefreshCw,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  Search,
  Shield
} from 'lucide-react';

const FavoritePromoCodes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await promoCodeAPI.getFavorites();
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load favorite promo codes');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPromoCode = async (promoCode) => {
    try {
      await navigator.clipboard.writeText(promoCode);
      setSuccess(`Promo code ${promoCode} copied to clipboard!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setError('Failed to copy promo code');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleRemoveFromFavorites = async (agentId, promoCode) => {
    try {
      await promoCodeAPI.removeFromFavorites(agentId);
      setFavorites(prev => prev.filter(fav => fav._id !== agentId));
      setSuccess(`${promoCode} removed from favorites`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error removing favorite:', error);
      setError('Failed to remove from favorites');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getPromoTypeColors = (type) => {
    switch (type) {
      case 'silver':
        return {
          bg: 'from-gray-400 to-gray-600',
          text: 'text-gray-800',
          border: 'border-gray-300',
          icon: Star
        };
      case 'gold':
        return {
          bg: 'from-yellow-400 to-yellow-600',
          text: 'text-yellow-800',
          border: 'border-yellow-300',
          icon: Crown
        };
      case 'diamond':
        return {
          bg: 'from-blue-400 to-purple-600',
          text: 'text-blue-800',
          border: 'border-blue-300',
          icon: Diamond
        };
      case 'free':
        return {
          bg: 'from-green-400 to-green-600',
          text: 'text-green-800',
          border: 'border-green-300',
          icon: Gift
        };
      default:
        return {
          bg: 'from-gray-400 to-gray-600',
          text: 'text-gray-800',
          border: 'border-gray-300',
          icon: Star
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading favorite promo codes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/explore-promo-codes')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Explore</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Favorite Promo Codes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your saved promo codes for quick access
            </p>
          </div>
        </div>
        <button
          onClick={fetchFavorites}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-green-800 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800 dark:text-red-400">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-pink-100 dark:border-pink-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-pink-500 p-3 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Favorite Promo Codes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {favorites.length} codes saved for quick access
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              {favorites.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Favorites
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Favorite Promo Codes
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't added any promo codes to your favorites yet.
          </p>
          <button
            onClick={() => navigate('/explore-promo-codes')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Explore Promo Codes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => {
            const colors = getPromoTypeColors(favorite.promoCodeType);
            const IconComponent = colors.icon;

            return (
              <div
                key={favorite._id}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${colors.bg} p-6 relative`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-6 h-6 text-white" />
                      <span className="text-white font-semibold capitalize">
                        {favorite.promoCodeType}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFromFavorites(favorite._id, favorite.promoCode)}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      title="Remove from favorites"
                    >
                      <HeartOff className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  
                  {/* Favorite badge */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-red-500 p-1 rounded-full">
                      <Heart className="w-3 h-3 text-white fill-current" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {favorite.userName}
                      </h3>
                      {favorite.isVerified && (
                        <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                          <Shield className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-mono font-bold text-primary-600 dark:text-primary-400">
                        {favorite.promoCode}
                      </span>
                      <button
                        onClick={() => handleCopyPromoCode(favorite.promoCode)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Copy promo code"
                      >
                        <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Added date */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Added: {new Date(favorite.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritePromoCodes;
