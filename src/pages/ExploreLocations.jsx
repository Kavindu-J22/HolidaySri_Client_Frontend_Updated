import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationCard from '../components/locations/LocationCard';
import LocationFilterPanel from '../components/locations/LocationFilterPanel';

const ExploreLocations = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    locationType: '',
    climate: '',
    province: '',
    district: '',
    mainDestination: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    byType: {},
    byClimate: {}
  });

  // Constants
  const [locationTypes, setLocationTypes] = useState([]);
  const [climateOptions, setClimateOptions] = useState([]);
  const [provincesAndDistricts, setProvincesAndDistricts] = useState({});
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetchConstants();
    fetchDestinations();
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [currentPage, searchTerm, filters, sortBy, sortOrder]);

  const fetchConstants = async () => {
    try {
      const response = await fetch('/api/locations/constants');
      if (response.ok) {
        const data = await response.json();
        setLocationTypes(data.locationTypes);
        setClimateOptions(data.climateOptions);
        setProvincesAndDistricts(data.provincesAndDistricts);
      }
    } catch (error) {
      console.error('Error fetching constants:', error);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/destinations?limit=100');
      if (response.ok) {
        const data = await response.json();
        setDestinations(data.destinations);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder
      });

      if (searchTerm) params.append('search', searchTerm);
      if (filters.locationType) params.append('locationType', filters.locationType);
      if (filters.climate) params.append('climate', filters.climate);
      if (filters.province) params.append('province', filters.province);
      if (filters.district) params.append('district', filters.district);
      if (filters.mainDestination) params.append('mainDestination', filters.mainDestination);

      const response = await fetch(`/api/locations?${params}`);

      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations);
        setTotalPages(data.pagination.pages);
        
        // Calculate stats
        const typeStats = {};
        const climateStats = {};
        data.locations.forEach(location => {
          typeStats[location.locationType] = (typeStats[location.locationType] || 0) + 1;
          climateStats[location.climate] = (climateStats[location.climate] || 0) + 1;
        });
        
        setStats({
          total: data.pagination.total,
          byType: typeStats,
          byClimate: climateStats
        });
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({
      locationType: '',
      climate: '',
      province: '',
      district: '',
      mainDestination: ''
    });
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || Object.values(filters).some(filter => filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Explore Locations
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Discover amazing places to visit in Sri Lanka
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{stats.total} locations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>{Object.keys(stats.byType).length} types</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search locations by name or description..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="w-full lg:w-64">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="rating-asc">Lowest Rated</option>
                <option value="distance-asc">Nearest to Colombo</option>
                <option value="distance-desc">Farthest from Colombo</option>
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
                showFilters || hasActiveFilters
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                  {Object.values(filters).filter(f => f).length + (searchTerm ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Filter Panel */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <LocationFilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                locationTypes={locationTypes}
                climateOptions={climateOptions}
                provincesAndDistricts={provincesAndDistricts}
                destinations={destinations}
                stats={stats}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : locations.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No locations found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {hasActiveFilters 
                    ? 'Try adjusting your search or filters to find more locations'
                    : 'No locations are available at the moment'
                  }
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    Showing {locations.length} of {stats.total} locations
                  </p>
                </div>

                {/* Locations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {locations.map((location) => (
                    <LocationCard
                      key={location._id}
                      location={location}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        const pageNum = currentPage <= 3 
                          ? index + 1 
                          : currentPage + index - 2;
                        
                        if (pageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
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

export default ExploreLocations;
