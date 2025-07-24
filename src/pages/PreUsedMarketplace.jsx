import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { promoCodeAPI, userAPI } from '../config/api';
import { 
  Star, 
  Crown, 
  Diamond, 
  ShoppingCart,
  Filter,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Loader,
  RefreshCw,
  Badge,
  Sparkles,
  Search
} from 'lucide-react';

const PreUsedMarketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({});
  const [userBalance, setUserBalance] = useState(0);
  
  // Filter and pagination states
  const [filters, setFilters] = useState({
    promoCodeType: 'all',
    isActive: 'all',
    sortBy: 'sellingListedAt',
    sortOrder: 'desc',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const fetchMarketplaceData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: pagination.current,
        limit: 12,
        ...filters
      };

      const response = await promoCodeAPI.getMarketplace(params);
      setPromoCodes(response.data.promoCodes);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
      setError('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current]); // Fixed: Only use pagination.current, not the entire pagination object

  const fetchStats = useCallback(async () => {
    try {
      const response = await promoCodeAPI.getMarketplaceStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const fetchUserBalance = useCallback(async () => {
    try {
      const response = await userAPI.getHSCBalance();
      setUserBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  }, []);

  useEffect(() => {
    fetchMarketplaceData();
    fetchStats();
    if (user) {
      fetchUserBalance();
    }
  }, [fetchMarketplaceData, fetchStats, fetchUserBalance, user]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const toggleDescription = (promoCodeId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [promoCodeId]: !prev[promoCodeId]
    }));
  };

  const getPromoTypeIcon = (type) => {
    switch (type) {
      case 'silver': return <Star className="w-5 h-5" />;
      case 'gold': return <Crown className="w-5 h-5" />;
      case 'diamond': return <Diamond className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getPromoTypeColors = (type) => {
    switch (type) {
      case 'silver':
        return {
          bg: 'from-slate-500 to-gray-600',
          badge: 'bg-slate-600 text-white'
        };
      case 'gold':
        return {
          bg: 'from-amber-500 to-yellow-600',
          badge: 'bg-amber-600 text-white'
        };
      case 'diamond':
        return {
          bg: 'from-indigo-500 to-purple-600',
          badge: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
        };
      default:
        return {
          bg: 'from-slate-500 to-gray-600',
          badge: 'bg-slate-600 text-white'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPromoCode = (promoCode) => {
    if (!promoCode || promoCode.length < 4) return promoCode;
    return `${promoCode.substring(0, 4)}***`;
  };

  const handleBuyNow = async (promoCode) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (userBalance < promoCode.sellingPriceHSC) {
      setError(`Insufficient HSC balance. You need ${promoCode.sellingPriceHSC} HSC but only have ${userBalance} HSC.`);
      return;
    }

    const confirmPurchase = window.confirm(
      `Are you sure you want to buy promo code "${promoCode.promoCode}" for ${promoCode.sellingPriceHSC} HSC?`
    );

    if (!confirmPurchase) return;

    try {
      setError('');
      setSuccess('');
      
      const response = await promoCodeAPI.buyPreUsed(promoCode._id);
      
      setSuccess(`Successfully purchased promo code: ${response.data.promoCode}!`);
      setUserBalance(response.data.newBalance);
      
      fetchMarketplaceData();
      fetchStats();
      
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
      
    } catch (error) {
      console.error('Error buying promo code:', error);
      setError(error.response?.data?.message || 'Failed to purchase promo code');
    }
  };

  const renderDescription = (promoCode) => {
    if (!promoCode.sellingDescription) return null;
    
    const isExpanded = expandedDescriptions[promoCode._id];
    const shouldTruncate = promoCode.sellingDescription.length > 50;
    
    if (!shouldTruncate) {
      return (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {promoCode.sellingDescription}
        </p>
      );
    }
    
    return (
      <div className="mt-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isExpanded 
            ? promoCode.sellingDescription 
            : `${promoCode.sellingDescription.substring(0, 50)}...`
          }
        </p>
        <button
          onClick={() => toggleDescription(promoCode._id)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
    );
  };

  if (loading && promoCodes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4">
          <ShoppingCart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Pre-Used Promo Codes Selling Platform
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
          Discover verified pre-used promo codes from our community.
        </p>
        
        {user && (
          <div className="inline-flex items-center bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-blue-800 dark:text-blue-300 font-medium">
              Your HSC Balance: {userBalance.toLocaleString()} HSC
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Available</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCount || 0}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Codes</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeCount || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Silver Codes</p>
              <p className="text-2xl font-bold text-gray-600">{stats.typeStats?.silver || 0}</p>
            </div>
            <Star className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Premium Codes</p>
              <p className="text-2xl font-bold text-purple-600">{(stats.typeStats?.gold || 0) + (stats.typeStats?.diamond || 0)}</p>
            </div>
            <Crown className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-green-700 dark:text-green-400">{success}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters & Search</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username or promo code..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Promo Code Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
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
            </select>
          </div>

          {/* Active Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="true">Active Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sellingListedAt">Recently Listed</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
              <option value="totalEarnings">Total Earnings</option>
              <option value="usedCount">Usage Count</option>
            </select>
          </div>

          {/* Refresh Button */}
          <div className="flex items-end">
            <button
              onClick={fetchMarketplaceData}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Promo Codes Grid */}
      {promoCodes.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Promo Codes Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There are currently no promo codes for sale. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoCodes.map((promoCode) => {
            const colors = getPromoTypeColors(promoCode.promoCodeType);
            const isExpired = promoCode.isExpired;

            return (
              <div
                key={promoCode._id}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Premium Header with Gradient */}
                <div className={`bg-gradient-to-r ${colors.bg} p-6 relative`}>
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
                    <div className="w-full h-full rounded-full bg-white/30 transform rotate-45"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 opacity-20 text-white">
                    {getPromoTypeIcon(promoCode.promoCodeType)}
                  </div>

                  {/* Header Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white">
                          {getPromoTypeIcon(promoCode.promoCodeType)}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-white mb-1">
                            {formatPromoCode(promoCode.promoCode)}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colors.badge} capitalize shadow-lg`}>
                            {promoCode.promoCodeType}
                          </span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-col items-end space-y-1">
                        {isExpired && (
                          <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                            Expired
                          </span>
                        )}
                        {promoCode.isVerified && (
                          <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                            ✓ Verified
                          </span>
                        )}
                        {promoCode.isActive && !isExpired && (
                          <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                            ● Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price Display */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                      <p className="text-white/80 text-sm font-medium mb-1">Price</p>
                      <p className="text-white text-2xl font-bold">
                        {promoCode.sellingPriceHSC} HSC
                      </p>
                      <p className="text-white/70 text-sm">
                        ≈ {promoCode.sellingPriceLKR?.toLocaleString()} LKR
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Earnings</p>
                      <p className="font-bold text-green-600 text-sm">
                        {promoCode.totalEarnings?.toLocaleString()} LKR
                      </p>
                    </div>

                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Referrals</p>
                      <p className="font-bold text-blue-600 text-sm">
                        {promoCode.totalReferrals}
                      </p>
                    </div>

                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-center mb-2">
                        <Badge className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Used</p>
                      <p className="font-bold text-purple-600 text-sm">
                        {promoCode.usedCount}
                      </p>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {promoCode.userName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {promoCode.userName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Joined {formatDate(promoCode.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Last Updated:</span>
                        <br />
                        {formatDate(promoCode.updatedAt)}
                      </div>
                      <div>
                        <span className="font-medium">Listed:</span>
                        <br />
                        {formatDate(promoCode.sellingListedAt)}
                      </div>
                      {!isExpired && (
                        <div className="col-span-2">
                          <span className="font-medium">Expires:</span>
                          <br />
                          {formatDate(promoCode.expirationDate)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {renderDescription(promoCode)}

                  {/* Buy Button - Made smaller and more professional */}
                  <button
                    onClick={() => handleBuyNow(promoCode)}
                    disabled={!user || isExpired || (user && userBalance < promoCode.sellingPriceHSC)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                      !user || isExpired || (user && userBalance < promoCode.sellingPriceHSC)
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white hover:from-green-600 hover:via-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {!user
                      ? '🔐 Login to Buy'
                      : isExpired
                      ? '⏰ Expired'
                      : (user && userBalance < promoCode.sellingPriceHSC)
                      ? '💰 Insufficient Balance'
                      : '🛒 Buy Now'
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg ${
                page === pagination.current
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={!pagination.hasNext}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PreUsedMarketplace;
