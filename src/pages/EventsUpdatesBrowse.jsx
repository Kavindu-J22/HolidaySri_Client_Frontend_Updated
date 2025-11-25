import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { eventsUpdatesAPI } from '../config/api';
import {
  Search, Filter, Star, MapPin, Calendar,
  DollarSign, Loader, Award, X, ArrowLeft
} from 'lucide-react';

const EventsUpdatesBrowse = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Get destination info from URL params
  const fromDestination = searchParams.get('fromDestination') || '';
  const destinationName = searchParams.get('destinationName') || '';
  const cityFromUrl = searchParams.get('city') || '';

  const [filters, setFilters] = useState({
    featured: false,
    categoryType: '',
    province: searchParams.get('province') || '',
    city: cityFromUrl,
    sortBy: 'random'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [provincesAndDistricts, setProvincesAndDistricts] = useState({});

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, filters]);

  const fetchProvinces = async () => {
    try {
      const response = await eventsUpdatesAPI.getProvinces();
      if (response.data.success) {
        setProvincesAndDistricts(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load provinces:', err);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === false) {
          delete params[key];
        }
      });

      const response = await eventsUpdatesAPI.browseEvents(params);
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Reset city when province changes
      if (key === 'province') {
        newFilters.city = '';
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      featured: false,
      categoryType: '',
      province: '',
      city: '',
      sortBy: 'random'
    });
    setSearchTerm('');
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const getCategoryTypes = () => {
    const types = [...new Set(events.map(e => e.categoryType))];
    return types.filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Events & Updates{cityFromUrl && ` - ${cityFromUrl}`}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {fromDestination ? `Discover exciting events happening in ${destinationName}` : 'Discover exciting events happening in Sri Lanka'}
          </p>
          {fromDestination && (
            <button
              onClick={() => navigate(`/destinations/${fromDestination}`)}
              className="mt-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Back to {destinationName}</span>
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 mb-6 sm:mb-8">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Featured */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    Featured Events Only
                  </label>
                </div>

                {/* Category Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category Type
                  </label>
                  <select
                    value={filters.categoryType}
                    onChange={(e) => handleFilterChange('categoryType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="">All Categories</option>
                    {getCategoryTypes().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Province */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Province
                  </label>
                  <select
                    value={filters.province}
                    onChange={(e) => handleFilterChange('province', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="">All Provinces</option>
                    {Object.keys(provincesAndDistricts).map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    disabled={!filters.province}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm disabled:opacity-50"
                  >
                    <option value="">All Cities</option>
                    {filters.province && provincesAndDistricts[filters.province]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="random">Random</option>
                    <option value="date">By Date</option>
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12 sm:py-20">
            <Loader className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
              No events found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                {/* Event Image */}
                {event.images && event.images.length > 0 ? (
                  <div className="relative h-44 sm:h-48 overflow-hidden flex-shrink-0">
                    <img
                      src={event.images[0].url}
                      alt={event.eventName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {event.featured && (
                      <span className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-semibold shadow-lg">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="relative h-44 sm:h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 dark:text-gray-600" />
                  </div>
                )}

                {/* Event Details */}
                <div className="flex flex-col flex-1 p-4 sm:p-5 md:p-6">
                  {/* Title and Category */}
                  <div className="flex-shrink-0 mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
                      {event.eventName}
                    </h3>

                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium mb-2 truncate">
                      {event.categoryType}
                    </p>

                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                      {event.description}
                    </p>
                  </div>

                  {/* Event Info */}
                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 flex-shrink-0">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{event.city}, {event.province}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{event.ticketPrice} LKR</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      {renderStars(event.averageRating || 0)}
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {event.averageRating ? event.averageRating.toFixed(1) : '0.0'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {event.totalReviews || 0} {event.totalReviews === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>

                  {/* View More Button */}
                  <button
                    onClick={() => navigate(`/events-updates/${event._id}`)}
                    className="w-full px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-sm sm:text-base shadow-md hover:shadow-lg mt-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsUpdatesBrowse;

