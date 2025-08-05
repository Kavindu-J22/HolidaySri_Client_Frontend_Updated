import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { promoCodeAPI } from '../config/api';
import {
  Heart,
  Star,
  Crown,
  Diamond,
  Gift,
  Loader,
  XCircle,
  CheckCircle,
  Shield,
  Search
} from 'lucide-react';

const FavoritePromoCodeSelector = ({ isOpen, onClose, onSelect }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchFavorites();
    }
  }, [isOpen]);

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

  const handleSelectPromoCode = (promoCode) => {
    onSelect(promoCode);
    onClose();
  };

  const handleFindPromoCodes = () => {
    onClose(); // Close the modal first
    navigate('/promo-codes-travel-agents');

    // Scroll to Travel Agent Network section after navigation with improved timing
    const scrollToSection = (attempts = 0) => {
      const maxAttempts = 15; // Try for up to 3 seconds (15 * 200ms)

      const travelAgentSection = document.querySelector('[data-section="travel-agent-network"]');
      if (travelAgentSection) {
        // Found the section, scroll to it
        travelAgentSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
        console.log('Successfully scrolled to Travel Agent Network section');
      } else if (attempts < maxAttempts) {
        // Section not found yet, try again after a short delay
        setTimeout(() => scrollToSection(attempts + 1), 200);
      } else {
        // Fallback: scroll to bottom portion of page where the section typically is
        console.log('Travel Agent Network section not found, using fallback scroll');
        window.scrollTo({
          top: document.body.scrollHeight * 0.75,
          behavior: 'smooth'
        });
      }
    };

    // Start scrolling attempt after navigation completes
    setTimeout(() => scrollToSection(), 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">
                Select from Favorites
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <XCircle className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-pink-100 mt-2">
            Choose a promo code from your saved favorites
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading favorites...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-800 dark:text-red-400">
                <XCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Favorite Promo Codes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't added any promo codes to your favorites yet.
              </p>
              <button
                onClick={handleFindPromoCodes}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Search className="w-5 h-5" />
                <span>Find Promo Codes</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((favorite) => {
                const colors = getPromoTypeColors(favorite.promoCodeType);
                const IconComponent = colors.icon;

                return (
                  <div
                    key={favorite._id}
                    onClick={() => handleSelectPromoCode(favorite.promoCode)}
                    className="relative bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600 overflow-hidden cursor-pointer group"
                  >
                    {/* Header with gradient */}
                    <div className={`bg-gradient-to-r ${colors.bg} p-4 relative`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-5 h-5 text-white" />
                          <span className="text-white font-semibold capitalize text-sm">
                            {favorite.promoCodeType}
                          </span>
                        </div>
                        <div className="bg-red-500 p-1 rounded-full">
                          <Heart className="w-3 h-3 text-white fill-current" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                            {favorite.userName}
                          </h3>
                          {favorite.isVerified && (
                            <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-1.5 py-0.5 rounded-full text-xs font-medium">
                              <Shield className="w-2.5 h-2.5" />
                              <span>Verified</span>
                            </div>
                          )}
                        </div>
                        <div className="text-lg font-mono font-bold text-primary-600 dark:text-primary-400">
                          {favorite.promoCode}
                        </div>
                      </div>

                      {/* Select indicator */}
                      <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Select</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritePromoCodeSelector;
