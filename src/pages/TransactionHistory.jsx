import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { paymentActivityAPI } from '../config/api';
import { 
  Search, 
  Filter, 
  Calendar, 
  CreditCard, 
  Package, 
  TrendingUp,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

const TransactionHistory = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 20
  });
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    totalOriginalAmount: 0,
    totalDiscountedAmount: 0
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    paymentMethods: [],
    statuses: []
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    paymentMethod: 'all',
    status: 'all',
    page: 1
  });

  const [showFilters, setShowFilters] = useState(false);

  const fetchActivities = async (newFilters = filters) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: newFilters.page,
        limit: pagination.limit,
        ...(newFilters.search && { search: newFilters.search }),
        ...(newFilters.category !== 'all' && { category: newFilters.category }),
        ...(newFilters.paymentMethod !== 'all' && { paymentMethod: newFilters.paymentMethod }),
        ...(newFilters.status !== 'all' && { status: newFilters.status })
      };

      const response = await paymentActivityAPI.getActivities(params);
      
      setActivities(response.data.activities);
      setPagination(response.data.pagination);
      setStats(response.data.stats);

    } catch (error) {
      console.error('Failed to fetch payment activities:', error);
      setError('Failed to load transaction history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await paymentActivityAPI.getFilterOptions();
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFilterOptions();
      fetchActivities();
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    fetchActivities(newFilters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    fetchActivities(newFilters);
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    fetchActivities(newFilters);
  };

  const handleRefresh = () => {
    fetchActivities();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'failed': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'refunded': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'HSC Purchase': return <CreditCard className="w-4 h-4" />;
      case 'Promo Codes': return <Package className="w-4 h-4" />;
      case 'Advertisement': return <TrendingUp className="w-4 h-4" />;
      case 'Membership': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (loading && activities.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Transaction History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your payment activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalTransactions}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalAmount.toLocaleString()} HSC
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Original Amount</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalOriginalAmount.toLocaleString()} HSC
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Savings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalDiscountedAmount.toLocaleString()} HSC
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Transaction ID..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="input-field pl-10"
                />
              </div>
            </form>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Categories</option>
                    {filterOptions.categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Payment Method Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={filters.paymentMethod}
                    onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Methods</option>
                    {filterOptions.paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Statuses</option>
                    {filterOptions.statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Transactions Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {activities.map((activity) => (
                  <tr key={activity._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getCategoryIcon(activity.category)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.transactionId}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {activity.item}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Qty: {activity.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.amount.toLocaleString()} HSC
                      </div>
                      {activity.discountedAmount > 0 && (
                        <div className="text-sm text-green-600 dark:text-green-400">
                          Saved: {activity.discountedAmount.toLocaleString()} HSC
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {activity.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(activity.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {activities.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No transactions found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filters.search || filters.category !== 'all' || filters.paymentMethod !== 'all' || filters.status !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'You haven\'t made any transactions yet.'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="bg-white dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={pagination.current === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={pagination.current === pagination.pages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing{' '}
                      <span className="font-medium">
                        {(pagination.current - 1) * pagination.limit + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.current * pagination.limit, pagination.total)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(pagination.current - 1)}
                        disabled={pagination.current === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {/* Page Numbers */}
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pagination.current === pageNum
                                ? 'z-10 bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.current + 1)}
                        disabled={pagination.current === pagination.pages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
