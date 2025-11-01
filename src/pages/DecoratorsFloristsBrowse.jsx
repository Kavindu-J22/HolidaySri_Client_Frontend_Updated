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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Decorators & Florists</h1>
          <p className="text-gray-600 dark:text-gray-400">Find professional decorators and florists for your special events</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
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
            <div className="mb-8 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name or specialization..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  {/* Province */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Province</label>
                    <select
                      name="province"
                      value={filters.province}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors font-semibold"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {florists.map((florist) => (
                      <div key={florist._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                          {florist.images && florist.images.length > 0 ? (
                            <img
                              src={florist.images[0].url}
                              alt={florist.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                              <span className="text-white text-4xl">🌸</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {/* Name and Specialization */}
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{florist.name}</h3>
                          <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-3">{florist.specialization}</p>

                          {/* Rating */}
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center space-x-1">
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
                              {florist.averageRating || 'No ratings'} ({florist.totalReviews || 0})
                            </span>
                          </div>

                          {/* Location */}
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{florist.city}, {florist.province}</span>
                          </div>

                          {/* Category */}
                          <div className="mb-4">
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                              {florist.category}
                            </span>
                          </div>

                          {/* View Button */}
                          <button
                            onClick={() => navigate(`/decorators-florists/${florist._id}`)}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-semibold"
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

