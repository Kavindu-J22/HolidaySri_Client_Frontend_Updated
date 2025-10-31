import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Loader,
  AlertCircle,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const CafesRestaurantsBrowse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1
  });

  // Filter state
  const [filters, setFilters] = useState({
    categoryType: searchParams.get('categoryType') || '',
    province: searchParams.get('province') || '',
    city: searchParams.get('city') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('/api/cafes-restaurants/provinces');
        const data = await response.json();
        if (data.success) {
          setProvincesData(data.data);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch cafes
  useEffect(() => {
    const fetchCafes = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (filters.categoryType) params.append('categoryType', filters.categoryType);
        if (filters.province) params.append('province', filters.province);
        if (filters.city) params.append('city', filters.city);
        params.append('page', filters.page);
        params.append('limit', 12);

        const response = await fetch(`/api/cafes-restaurants/browse?${params}`);
        const data = await response.json();

        if (data.success) {
          setCafes(data.data);
          setPagination(data.pagination);
          setSearchParams(params);
        } else {
          setError(data.message || 'Failed to load cafes');
        }
      } catch (error) {
        console.error('Error fetching cafes:', error);
        setError('Failed to load cafes');
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, [filters, setSearchParams]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      categoryType: '',
      province: '',
      city: '',
      page: 1
    });
  };

  const availableCities = filters.province ? provincesData[filters.province] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Cafes & Restaurants
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover amazing cafes and restaurants in Sri Lanka
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Filters</h2>

              {/* Category Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Type
                </label>
                <input
                  type="text"
                  name="categoryType"
                  value={filters.categoryType}
                  onChange={handleFilterChange}
                  placeholder="e.g., Seafood, Italian"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Province Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Province
                </label>
                <select
                  name="province"
                  value={filters.province}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Provinces</option>
                  {Object.keys(provincesData).map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  disabled={!filters.province}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  <option value="">All Cities</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleResetFilters}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Main Content - Cafes Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : cafes.length > 0 ? (
              <>
                {/* Results Count */}
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    Showing {(filters.page - 1) * 12 + 1} - {Math.min(filters.page * 12, pagination.total)} of {pagination.total} results
                  </p>
                </div>

                {/* Cafes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {cafes.map(cafe => (
                    <div
                      key={cafe._id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        {cafe.images && cafe.images.length > 0 ? (
                          <img
                            src={cafe.images[0].url}
                            alt={cafe.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                          {cafe.name}
                        </h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                          {cafe.categoryType}
                        </p>

                        {/* Location */}
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>{cafe.location.city}, {cafe.location.province}</span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.round(cafe.averageRating || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {cafe.averageRating || 'N/A'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({cafe.totalReviews || 0})
                          </span>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => navigate(`/cafes-restaurants/${cafe._id}`)}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {[...Array(pagination.pages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.pages ||
                        (pageNum >= filters.page - 1 && pageNum <= filters.page + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              filters.page === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        (pageNum === 2 && filters.page > 3) ||
                        (pageNum === pagination.pages - 1 && filters.page < pagination.pages - 2)
                      ) {
                        return <span key={pageNum} className="text-gray-500">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === pagination.pages}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No cafes & restaurants found matching your filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafesRestaurantsBrowse;

