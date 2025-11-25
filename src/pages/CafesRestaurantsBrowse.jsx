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
  ChevronRight,
  ArrowLeft,
  Clock,
  UtensilsCrossed
} from 'lucide-react';
import { formatOperatingHours } from '../utils/timeFormat';

const CafesRestaurantsBrowse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});
  const [provincesLoading, setProvincesLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1
  });

  // Get destination info from URL params
  const fromDestination = searchParams.get('fromDestination') || '';
  const destinationName = searchParams.get('destinationName') || '';
  const cityFromUrl = searchParams.get('city') || '';

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    categoryType: searchParams.get('categoryType') || '',
    province: searchParams.get('province') || '',
    city: cityFromUrl,
    diningOptions: [],
    search: '',
    page: parseInt(searchParams.get('page')) || 1
  });

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      setProvincesLoading(true);
      try {
        const response = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/cafes-restaurants/provinces');
        const data = await response.json();
        if (data.success && data.data) {
          setProvincesData(data.data);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setProvincesLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  // Reset city when province changes
  useEffect(() => {
    if (filters.province === '') {
      setFilters(prev => ({ ...prev, city: '' }));
    }
  }, [filters.province]);

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
        if (filters.search) params.append('search', filters.search);
        if (filters.diningOptions && filters.diningOptions.length > 0) {
          filters.diningOptions.forEach(option => params.append('diningOptions', option));
        }
        params.append('page', filters.page);
        params.append('limit', 12);

        // Preserve destination parameters
        if (fromDestination) params.append('fromDestination', fromDestination);
        if (destinationName) params.append('destinationName', destinationName);

        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/cafes-restaurants/browse?${params}`);
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
  }, [filters, fromDestination, destinationName]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  // Handle dining options checkbox
  const handleDiningOptionChange = (option) => {
    setFilters(prev => ({
      ...prev,
      diningOptions: prev.diningOptions.includes(option)
        ? prev.diningOptions.filter(o => o !== option)
        : [...prev.diningOptions, option],
      page: 1 // Reset to first page when filter changes
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1 // Reset to first page when searching
    }));
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setFilters(prev => ({
      ...prev,
      search: '',
      page: 1
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
    setSearchTerm('');
    setFilters({
      categoryType: '',
      province: '',
      city: '',
      diningOptions: [],
      search: '',
      page: 1
    });
  };

  const availableCities = filters.province ? provincesData[filters.province] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Cafes & Restaurants{cityFromUrl && ` - ${cityFromUrl}`}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {fromDestination ? `Discover amazing cafes and restaurants in ${destinationName}` : 'Discover amazing cafes and restaurants in Sri Lanka'}
          </p>
          {fromDestination && (
            <button
              onClick={() => navigate(`/destinations/${fromDestination}`)}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to {destinationName}</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder="Search by name or description..."
                className="w-full pl-12 pr-24 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm sm:text-base shadow-sm"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
          {filters.search && (
            <div className="mt-3 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Searching for: <span className="font-semibold">"{filters.search}"</span>
              </p>
              <button
                onClick={handleClearSearch}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
              >
                Clear Search
              </button>
            </div>
          )}
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Filters
              </h2>

              {/* Category Type Filter */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Type
                </label>
                <select
                  name="categoryType"
                  value={filters.categoryType}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Categories</option>
                  <option value="Seafood">All Types</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Thai">Thai</option>
                  <option value="Korean">Korean</option>
                  <option value="Mexican">Mexican</option>
                  <option value="French">French</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="American">American</option>
                  <option value="Sri Lankan">Sri Lankan</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="Cafe">Cafe</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="BBQ & Grill">BBQ & Grill</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Burger">Burger</option>
                  <option value="Sushi">Sushi</option>
                  <option value="Fine Dining">Fine Dining</option>
                  <option value="Casual Dining">Casual Dining</option>
                  <option value="Street Food">Street Food</option>
                  <option value="Buffet">Buffet</option>
                  <option value="Bar & Pub">Bar & Pub</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Province Filter */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Province
                </label>
                <select
                  name="province"
                  value={filters.province}
                  onChange={handleFilterChange}
                  disabled={provincesLoading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {provincesLoading ? 'Loading provinces...' : 'All Provinces'}
                  </option>
                  {!provincesLoading && Object.keys(provincesData).length > 0 &&
                    Object.keys(provincesData).map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))
                  }
                </select>
              </div>

              {/* City Filter */}
              <div className="mb-4 sm:mb-6">
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

              {/* Dining Options Filter */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Dining Options
                </label>
                <div className="space-y-2">
                  {['Dine-in', 'Outdoor Seating', 'Delivery', 'Takeaway', 'Catering'].map(option => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.diningOptions.includes(option)}
                        onChange={() => handleDiningOptionChange(option)}
                        className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                  {cafes.map(cafe => (
                    <div
                      key={cafe._id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative h-48 sm:h-52 bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                        {cafe.images && cafe.images.length > 0 ? (
                          <img
                            src={cafe.images[0].url}
                            alt={cafe.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        {/* Category Badge */}
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          {cafe.categoryType}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 flex flex-col flex-grow">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                          {cafe.name}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{cafe.location.city}, {cafe.location.province}</span>
                        </div>

                        {/* Operating Hours */}
                        {cafe.operatingHours && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">
                              {formatOperatingHours(cafe.operatingHours.openTime, cafe.operatingHours.closeTime)}
                            </span>
                          </div>
                        )}

                        {/* Dining Options */}
                        {cafe.diningOptions && cafe.diningOptions.length > 0 && (
                          <div className="flex items-start space-x-1 mb-3">
                            <UtensilsCrossed className="w-4 h-4 flex-shrink-0 text-gray-600 dark:text-gray-400 mt-0.5" />
                            <div className="flex flex-wrap gap-1">
                              {cafe.diningOptions.slice(0, 3).map((option, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full"
                                >
                                  {option}
                                </span>
                              ))}
                              {cafe.diningOptions.length > 3 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  +{cafe.diningOptions.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Rating */}
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="flex items-center space-x-0.5">
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
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {cafe.averageRating ? cafe.averageRating.toFixed(1) : 'N/A'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({cafe.totalReviews || 0} reviews)
                          </span>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => navigate(`/cafes-restaurants/${cafe._id}`)}
                          className="w-full mt-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
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

