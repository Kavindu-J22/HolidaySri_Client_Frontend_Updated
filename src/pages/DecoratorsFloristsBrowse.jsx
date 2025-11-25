import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  Loader,
  AlertCircle,
  Star,
  MapPin,
  Eye
} from 'lucide-react';
import { decoratorsFloristsAPI } from '../config/api';

const DecoratorsFloristsBrowse = () => {
  const navigate = useNavigate();
  const [florists, setFlorists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});

  // Filter state
  const [filters, setFilters] = useState({
    province: '',
    city: '',
    specialization: '',
    category: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch provinces and florists
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [provincesRes, floristsRes] = await Promise.all([
          decoratorsFloristsAPI.getProvinces(),
          decoratorsFloristsAPI.browseFlorists({})
        ]);

        if (provincesRes.data) {
          setProvincesData(provincesRes.data);
        }

        if (floristsRes.data && floristsRes.data.data) {
          // Shuffle florists randomly
          const shuffled = [...floristsRes.data.data].sort(() => Math.random() - 0.5);
          setFlorists(shuffled);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load decorators & florists');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      // Reset city when province changes
      ...(name === 'province' && { city: '' })
    }));
  };

  // Apply filters
  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      const response = await decoratorsFloristsAPI.browseFlorists(filters);
      if (response.data && response.data.data) {
        const shuffled = [...response.data.data].sort(() => Math.random() - 0.5);
        setFlorists(shuffled);
      }
      setShowFilters(false);
    } catch (err) {
      console.error('Error applying filters:', err);
      setError('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  // Clear filters
  const handleClearFilters = async () => {
    setFilters({
      province: '',
      city: '',
      specialization: '',
      category: '',
      search: ''
    });
    try {
      setLoading(true);
      const response = await decoratorsFloristsAPI.browseFlorists({});
      if (response.data && response.data.data) {
        const shuffled = [...response.data.data].sort(() => Math.random() - 0.5);
        setFlorists(shuffled);
      }
    } catch (err) {
      console.error('Error clearing filters:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique specializations and categories
  const specializations = [...new Set(florists.map(f => f.specialization))];
  const categories = [...new Set(florists.map(f => f.category))];

  // Get available cities based on selected province
  const availableCities = filters.province ? provincesData[filters.province] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Decorators & Florists
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Find professional decorators and florists for your special events
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {!loading && (
          <>
            {/* Search and Filter Bar */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name or specialization..."
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center space-x-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                <Filter className="w-5 h-5" />
                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
                  {/* Province */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Province</label>
                    <select
                      name="province"
                      value={filters.province}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Provinces</option>
                      {Object.keys(provincesData).map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City</label>
                    <select
                      name="city"
                      value={filters.city}
                      onChange={handleFilterChange}
                      disabled={!filters.province}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                    >
                      <option value="">All Cities</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Specialization</label>
                    <select
                      name="specialization"
                      value={filters.specialization}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Specializations</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 px-4 py-2.5 sm:py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors font-semibold text-sm sm:text-base"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Florists Grid */}
            {!loading && (
              <>
                {florists.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No decorators & florists found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {florists.map((florist) => (
                      <div key={florist._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700">
                        {/* Image */}
                        <div className="relative h-56 sm:h-52 overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                          {florist.images && florist.images.length > 0 ? (
                            <img
                              src={florist.images[0].url}
                              alt={florist.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500">
                              <span className="text-white text-5xl">🌸</span>
                            </div>
                          )}
                          {/* Category Badge */}
                          <div className="absolute top-3 right-3">
                            <span className="px-3 py-1.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold shadow-lg">
                              {florist.category}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-5 flex flex-col flex-grow">
                          {/* Name and Specialization */}
                          <div className="mb-3 flex-grow">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-1" title={florist.name}>
                              {florist.name}
                            </h3>
                            <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-2 line-clamp-1" title={florist.specialization}>
                              {florist.specialization}
                            </p>

                            {/* Rating */}
                            <div className="flex items-center space-x-2 mb-2.5">
                              <div className="flex items-center space-x-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.round(florist.averageRating || 0)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {florist.averageRating ? florist.averageRating.toFixed(1) : 'New'}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({florist.totalReviews || 0})
                              </span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="line-clamp-1">{florist.city}, {florist.province}</span>
                            </div>
                          </div>

                          {/* View Button */}
                          <button
                            onClick={() => navigate(`/decorators-florists/${florist._id}`)}
                            className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-semibold shadow-md hover:shadow-lg"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Profile</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DecoratorsFloristsBrowse;

