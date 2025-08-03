import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  Plus,
  Eye,
  BarChart3,
  Calendar,
  ArrowRight,
  Clock,
  MapPin,
  Star,
  Loader,
  AlertCircle,
  CheckCircle,
  Pause,
  Play
} from 'lucide-react';
import { userAPI } from '../../config/api';

const Advertisements = () => {
  const navigate = useNavigate();
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user advertisements
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getAdvertisements();
        setAdvertisements(response.data.advertisements || []);
      } catch (error) {
        console.error('Error fetching advertisements:', error);
        setError('Failed to load advertisements');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  // Format category name for display
  const formatCategoryName = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'expired':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'draft':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  // Get plan icon
  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'hourly':
        return <Clock className="w-4 h-4" />;
      case 'daily':
        return <Calendar className="w-4 h-4" />;
      case 'monthly':
        return <Calendar className="w-4 h-4" />;
      case 'yearly':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Advertisements
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your travel advertisements and promotional content
            </p>
          </div>
          <button
            onClick={() => navigate('/post-advertisement')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Ad</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Advertisements List */}
      {!loading && !error && (
        <>
          {advertisements.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                  <Megaphone className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Start Your Advertising Journey
                </h2>

                <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-6">
                  Create, manage, and track your travel advertisements. Promote your services
                  and reach more customers with our powerful advertising platform.
                </p>

                <button
                  onClick={() => navigate('/post-advertisement')}
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Advertisement</span>
                </button>
              </div>

              {/* Features Preview */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Track Performance
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Monitor views, clicks, and engagement metrics
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mb-4">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Analytics Dashboard
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Detailed insights and performance reports
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Premium Placement
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Get maximum visibility for your business
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Advertisements Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advertisements.map((ad) => (
                <div key={ad._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Ad Header */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getPlanIcon(ad.selectedPlan)}
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                          {ad.selectedPlan}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                        {ad.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {formatCategoryName(ad.category)}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Advertisement Slot
                    </p>

                    {/* Ad Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {ad.finalAmount} {ad.paymentMethod}
                        </span>
                      </div>

                      {ad.usedPromoCode && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Promo Code:</span>
                          <span className="font-medium text-green-600">
                            {ad.usedPromoCode}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Expires:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(ad.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ad Info */}
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Advertisement Status: <span className="font-medium text-gray-900 dark:text-white capitalize">{ad.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ad Actions */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                      {ad.status === 'active' ? (
                        <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors text-sm">
                          <Pause className="w-4 h-4" />
                          <span>Pause</span>
                        </button>
                      ) : ad.status === 'paused' ? (
                        <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors text-sm">
                          <Play className="w-4 h-4" />
                          <span>Resume</span>
                        </button>
                      ) : null}

                      <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors text-sm">
                        <BarChart3 className="w-4 h-4" />
                        <span>Analytics</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Advertisements;
