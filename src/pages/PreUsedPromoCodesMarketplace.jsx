import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { promoCodeAPI, hscAPI, userAPI } from '../config/api';
import { 
  Star, 
  Crown, 
  Diamond, 
  ShoppingCart,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Loader,
  RefreshCw,
  Eye,
  EyeOff,
  Badge,
  Sparkles
} from 'lucide-react';

const PreUsedPromoCodesMarketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({});
  const [hscValue, setHscValue] = useState(100);
  const [userBalance, setUserBalance] = useState(0);
  
  // Filter and pagination states
  const [filters, setFilters] = useState({
    promoCodeType: 'all',
    isActive: 'all',
    sortBy: 'sellingListedAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    fetchMarketplaceData();
    fetchStats();
    if (user) {
      fetchUserBalance();
    }
  }, [filters, pagination.current]);

  const fetchMarketplaceData = async () => {
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
      setHscValue(response.data.hscValue);
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
      setError('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await promoCodeAPI.getMarketplaceStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUserBalance = async () => {
    try {
      // Get user balance from user API
      const response = await userAPI.getProfile();
      setUserBalance(response.data.hscBalance || 0);
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

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
          bg: 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
          border: 'border-gray-300 dark:border-gray-600',
          text: 'text-gray-700 dark:text-gray-300',
          badge: 'bg-gray-500 text-white',
          icon: 'text-gray-600 dark:text-gray-400'
        };
      case 'gold':
        return {
          bg: 'from-yellow-100 to-amber-200 dark:from-yellow-900/30 dark:to-amber-900/30',
          border: 'border-yellow-300 dark:border-yellow-600',
          text: 'text-yellow-800 dark:text-yellow-300',
          badge: 'bg-yellow-500 text-white',
          icon: 'text-yellow-600 dark:text-yellow-400'
        };
      case 'diamond':
        return {
          bg: 'from-blue-100 to-purple-200 dark:from-blue-900/30 dark:to-purple-900/30',
          border: 'border-blue-300 dark:border-blue-600',
          text: 'text-blue-800 dark:text-blue-300',
          badge: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
          icon: 'text-blue-600 dark:text-blue-400'
        };
      default:
        return {
          bg: 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
          border: 'border-gray-300 dark:border-gray-600',
          text: 'text-gray-700 dark:text-gray-300',
          badge: 'bg-gray-500 text-white',
          icon: 'text-gray-600 dark:text-gray-400'
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

  const handleBuyNow = async (promoCode) => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user has sufficient balance
    if (userBalance < promoCode.sellingPriceHSC) {
      setError(`Insufficient HSC balance. You need ${promoCode.sellingPriceHSC} HSC but only have ${userBalance} HSC.`);
      return;
    }

    // Confirm purchase
    const confirmPurchase = window.confirm(
      `Are you sure you want to buy promo code "${promoCode.promoCode}" for ${promoCode.sellingPriceHSC} HSC (≈ ${promoCode.sellingPriceLKR.toLocaleString()} LKR)?`
    );

    if (!confirmPurchase) return;

    try {
      setError('');
      setSuccess('');

      const response = await promoCodeAPI.buyPreUsed(promoCode._id);

      setSuccess(`Successfully purchased promo code: ${response.data.promoCode}! Redirecting to your profile...`);

      // Update user balance
      setUserBalance(response.data.newBalance);

      // Refresh the marketplace data
      fetchMarketplaceData();
      fetchStats();

      // Redirect to profile after 3 seconds
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
          Discover verified pre-used promo codes from our community. Get exclusive deals and maximize your promotional advantages.
        </p>

        {/* User Balance Display */}
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters & Sorting</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                className={`bg-gradient-to-br ${colors.bg} rounded-xl p-6 border-2 ${colors.border} shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  {getPromoTypeIcon(promoCode.promoCodeType)}
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${colors.icon}`}>
                      {getPromoTypeIcon(promoCode.promoCodeType)}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${colors.text}`}>
                        {promoCode.promoCode}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colors.badge} capitalize`}>
                        {promoCode.promoCodeType}
                      </span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-col items-end space-y-1">
                    {isExpired && (
                      <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        Expired
                      </span>
                    )}
                    {promoCode.isVerified && (
                      <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        Verified
                      </span>
                    )}
                    {promoCode.isActive && !isExpired && (
                      <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Earnings</p>
                    <p className={`font-semibold ${colors.text}`}>
                      {promoCode.totalEarnings.toLocaleString()} LKR
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-blue-600 mr-1" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Referrals</p>
                    <p className={`font-semibold ${colors.text}`}>
                      {promoCode.totalReferrals}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Badge className="w-4 h-4 text-purple-600 mr-1" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Used</p>
                    <p className={`font-semibold ${colors.text}`}>
                      {promoCode.usedCount}
                    </p>
                  </div>
                </div>

                {/* User Info */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Owner:</strong> {promoCode.userName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    <strong>Joined:</strong> {formatDate(promoCode.createdAt)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    <strong>Last Updated:</strong> {formatDate(promoCode.updatedAt)}
                  </p>
                  {!isExpired && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      <strong>Expires:</strong> {formatDate(promoCode.expirationDate)}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    <strong>Listed:</strong> {formatDate(promoCode.sellingListedAt)}
                  </p>
                </div>

                {/* Description */}
                {renderDescription(promoCode)}

                {/* Price */}
                <div className="mb-4 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                    <p className={`text-2xl font-bold ${colors.text}`}>
                      {promoCode.sellingPriceHSC} HSC
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ≈ {promoCode.sellingPriceLKR.toLocaleString()} LKR
                    </p>
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => handleBuyNow(promoCode)}
                  disabled={!user || isExpired || (user && userBalance < promoCode.sellingPriceHSC)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    !user || isExpired || (user && userBalance < promoCode.sellingPriceHSC)
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {!user
                    ? 'Login to Buy'
                    : isExpired
                    ? 'Expired'
                    : (user && userBalance < promoCode.sellingPriceHSC)
                    ? 'Insufficient Balance'
                    : 'Buy Now'
                  }
                </button>
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

export default PreUsedPromoCodesMarketplace;
