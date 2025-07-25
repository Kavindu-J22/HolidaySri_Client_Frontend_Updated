import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { promoCodeAPI } from '../config/api';
import {
  Search,
  Star,
  Crown,
  Diamond,
  Sparkles,
  Copy,
  Heart,
  HeartOff,
  Loader,
  RefreshCw,
  AlertCircle,
  Gift,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ShoppingCart,
  Shield,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ExplorePromoCodes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userAccess, setUserAccess] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  // Filter and search states
  const [filters, setFilters] = useState({
    search: '',
    promoCodeType: 'all',
    sortBy: 'random'
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchPromoCodes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: pagination.current,
        limit: 12,
        ...filters
      };

      const response = await promoCodeAPI.getExplorePromoCodes(params);
      setPromoCodes(response.data.promoCodes);
      setPagination(response.data.pagination);
      setUserAccess(response.data.userAccess);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      if (error.response?.status === 403) {
        setError('Access denied. Please pay for access or become an agent.');
      } else {
        setError('Failed to load promo codes');
      }
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current]);

  useEffect(() => {
    fetchPromoCodes();
  }, [fetchPromoCodes]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
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

  const handleToggleFavorite = async (agentId, promoCode, isFavorite) => {
    try {
      if (isFavorite) {
        await promoCodeAPI.removeFromFavorites(agentId);
        setSuccess('Removed from favorites');
      } else {
        await promoCodeAPI.addToFavorites(agentId, promoCode);
        setSuccess('Added to favorites');
      }
      
      // Update local state
      setPromoCodes(prev => prev.map(promo => 
        promo._id === agentId 
          ? { ...promo, isFavorite: !isFavorite }
          : promo
      ));
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError('Failed to update favorites');
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
          <p className="text-gray-600 dark:text-gray-400">Loading promo codes...</p>
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
            onClick={() => navigate('/promo-codes-travel-agents')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Explore & Find Promo Codes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover active promo codes from verified travel agents
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            userAccess?.isAgent 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
          }`}>
            {userAccess?.isAgent ? '🎯 Agent Access' : '💎 Premium Access'}
          </div>
          <button
            onClick={() => navigate('/favorite-promo-codes')}
            className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>My Favorites</span>
          </button>
          <button
            onClick={fetchPromoCodes}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Active & Promoted Promo Codes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {pagination.total} verified codes available
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {pagination.total}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Codes
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search & Filter
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by username or promo code..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            {/* Promo Code Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Promo Code Type
              </label>
              <select
                value={filters.promoCodeType}
                onChange={(e) => handleFilterChange('promoCodeType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="diamond">Diamond</option>
                <option value="free">Free</option>
              </select>
            </div>

            {/* Sort By Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="random">Random Order</option>
                <option value="createdAt">Recently Created</option>
                <option value="totalEarnings">Highest Earnings</option>
                <option value="totalReferrals">Most Referrals</option>
                <option value="usedCount">Most Used</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Promo Codes Grid */}
      {promoCodes.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {filters.search || filters.promoCodeType !== 'all' ? 'No Matching Promo Codes' : 'No Active Promo Codes'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filters.search || filters.promoCodeType !== 'all'
              ? 'Try adjusting your search criteria or filters to find more results.'
              : 'There are currently no active promoted promo codes. Check back later!'
            }
          </p>
          {(filters.search || filters.promoCodeType !== 'all') && (
            <button
              onClick={() => {
                setFilters({ search: '', promoCodeType: 'all', sortBy: 'random' });
                setPagination(prev => ({ ...prev, current: 1 }));
              }}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoCodes.map((promoCode) => {
            const colors = getPromoTypeColors(promoCode.promoCodeType);
            const IconComponent = colors.icon;

            return (
              <div
                key={promoCode._id}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${colors.bg} p-6 relative`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-6 h-6 text-white" />
                      <span className="text-white font-semibold capitalize">
                        {promoCode.promoCodeType}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(promoCode._id, promoCode.promoCode, promoCode.isFavorite)}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      {promoCode.isFavorite ? (
                        <Heart className="w-5 h-5 text-red-300 fill-current" />
                      ) : (
                        <HeartOff className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {promoCode.userName}
                      </h3>
                      {promoCode.isVerified && (
                        <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                          <Shield className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-mono font-bold text-primary-600 dark:text-primary-400">
                        {promoCode.promoCode}
                      </span>
                      <button
                        onClick={() => handleCopyPromoCode(promoCode.promoCode)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Copy promo code"
                      >
                        <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Expiration */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Expires: {new Date(promoCode.expirationDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  page === pagination.current
                    ? 'bg-primary-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={!pagination.hasNext}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExplorePromoCodes;
