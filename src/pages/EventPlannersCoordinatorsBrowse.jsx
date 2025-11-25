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
import { eventPlannersCoordinatorsAPI } from '../config/api';

const EventPlannersCoordinatorsBrowse = () => {
  const navigate = useNavigate();
  const [planners, setPlanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    province: '',
    city: '',
    specialization: '',
    category: '',
    search: ''
  });

  // Fetch provinces and initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [provincesRes, plannersRes] = await Promise.all([
          eventPlannersCoordinatorsAPI.getProvinces(),
          eventPlannersCoordinatorsAPI.browsePlanners({})
        ]);

        if (provincesRes.data && provincesRes.data.data) {
          setProvincesData(provincesRes.data.data);
        }

        if (plannersRes.data && plannersRes.data.data) {
          setPlanners(plannersRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load event planners');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { city: '' })
    }));
  };

  // Apply filters
  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      const response = await eventPlannersCoordinatorsAPI.browsePlanners(filters);
      if (response.data && response.data.data) {
        setPlanners(response.data.data);
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
      const response = await eventPlannersCoordinatorsAPI.browsePlanners({});
      if (response.data && response.data.data) {
        setPlanners(response.data.data);
      }
    } catch (err) {
      console.error('Error clearing filters:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique specializations from all planners
  const uniqueSpecializations = [...new Set(planners.flatMap(p => p.specialization || []))];

  // Get unique categories from all planners
  const uniqueCategories = [...new Set(planners.map(p => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Expert Event Planners & Day Coordinators
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Find the perfect event planner for your special occasion
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name, specialization..."
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center sm:justify-start space-x-2 text-sm sm:text-base"
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Province Filter */}
              <div>
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
              <div>
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
                  {filters.province && provincesData[filters.province]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Specialization Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialization
                </label>
                <select
                  name="specialization"
                  value={filters.specialization}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Specializations</option>
                  {uniqueSpecializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-6 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="flex-1 px-6 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading event planners...</p>
            </div>
          </div>
        )}

        {/* Planners Grid */}
        {!loading && (
          <>
            {planners.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">No event planners found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {planners.map((planner) => (
                  <div
                    key={planner._id}
                    className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 sm:transform sm:hover:scale-105 border border-gray-100 dark:border-gray-700"
                  >
                    {/* Avatar */}
                    <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                      <img
                        src={planner.avatar?.url}
                        alt={planner.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                      {/* Rating Badge */}
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white dark:bg-gray-800 rounded-lg px-2 py-1 sm:px-3 shadow-lg flex items-center space-x-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                          {planner.averageRating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col p-4 sm:p-5">
                      {/* Name and Category */}
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {planner.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold mb-3 line-clamp-1">
                        {planner.category}
                      </p>

                      {/* Experience & Reviews */}
                      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span className="flex items-center space-x-1">
                          <span className="font-semibold text-gray-900 dark:text-white">{planner.experience}</span>
                          <span>years exp.</span>
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          ({planner.totalReviews || 0} reviews)
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{planner.city}, {planner.province}</span>
                      </div>

                      {/* Specializations */}
                      <div className="mb-4 flex-1">
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {planner.specialization?.slice(0, 2).map((spec, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium"
                            >
                              {spec}
                            </span>
                          ))}
                          {planner.specialization?.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium">
                              +{planner.specialization.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* View Button */}
                      <button
                        onClick={() => navigate(`/event-planners-coordinators/${planner._id}`)}
                        className="w-full px-4 py-2.5 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg text-sm sm:text-base"
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
      </div>
    </div>
  );
};

export default EventPlannersCoordinatorsBrowse;

