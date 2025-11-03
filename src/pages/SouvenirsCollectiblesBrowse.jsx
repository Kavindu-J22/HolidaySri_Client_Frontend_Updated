import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Loader,
  AlertCircle,
  Filter,
  X,
  DollarSign
} from 'lucide-react';

const SouvenirsCollectiblesBrowse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [souvenirsCollectibles, setSouvenirsCollectibles] = useState([]);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    specialization: searchParams.get('specialization') || '',
    province: searchParams.get('province') || '',
    city: searchParams.get('city') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1
  });

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('/api/souvenirs-collectibles/provinces');
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

  // Fetch souvenirs & collectibles
  useEffect(() => {
    const fetchSouvenirsCollectibles = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.specialization) params.append('specialization', filters.specialization);
        if (filters.province) params.append('province', filters.province);
        if (filters.city) params.append('city', filters.city);
        params.append('page', filters.page);
        params.append('limit', 12);

        const response = await fetch(`/api/souvenirs-collectibles/browse?${params}`);
        const data = await response.json();

        if (data.success) {
          setSouvenirsCollectibles(data.data);
          setPagination(data.pagination);
          setSearchParams(params);
        } else {
          setError('Failed to load souvenirs & collectibles');
        }
      } catch (error) {
        console.error('Error fetching souvenirs & collectibles:', error);
        setError('Failed to load souvenirs & collectibles');
      } finally {
        setLoading(false);
      }
    };

    fetchSouvenirsCollectibles();
  }, [filters, setSearchParams]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      category: '',
      specialization: '',
      province: '',
      city: '',
      page: 1
    });
  };

  // Get available cities
  const availableCities = filters.province ? provincesData[filters.province] || [] : [];

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Souvenirs & Collectibles
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover unique souvenirs and collectibles from around Sri Lanka
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-600 dark:text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  placeholder="e.g., Handicrafts"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              {/* Specialization Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={filters.specialization}
                  onChange={handleFilterChange}
                  placeholder="e.g., Traditional Art"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm disabled:opacity-50"
                >
                  <option value="">All Cities</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {(filters.category || filters.specialization || filters.province || filters.city) && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-800 dark:text-red-200">{error}</span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : souvenirsCollectibles.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No souvenirs & collectibles found</p>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {souvenirsCollectibles.map(item => (
                    <div
                      key={item._id}
                      onClick={() => navigate(`/souvenirs-collectibles/${item._id}`)}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    >
                      {/* Image */}
                      {item.images && item.images.length > 0 && (
                        <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                          <img
                            src={item.images[0].url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {item.specialization}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          {renderStars(Math.round(item.averageRating))}
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ({item.totalReviews})
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>{item.location.city}, {item.location.province}</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-lg font-bold text-blue-600">
                            <DollarSign className="w-5 h-5" />
                            <span>{item.price.toLocaleString()}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.available
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                          }`}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setFilters(prev => ({ ...prev, page }))}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          pagination.page === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SouvenirsCollectiblesBrowse;

