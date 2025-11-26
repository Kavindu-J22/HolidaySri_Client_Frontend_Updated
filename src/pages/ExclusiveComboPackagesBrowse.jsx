import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, Star, Loader, AlertCircle, ArrowLeft } from 'lucide-react';

const ExclusiveComboPackagesBrowse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get destination info from URL params
  const fromDestination = searchParams.get('fromDestination') || '';
  const destinationName = searchParams.get('destinationName') || '';
  const locationsFromUrl = searchParams.get('locations') || '';

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [locations, setLocations] = useState(locationsFromUrl);
  const [categoryType, setCategoryType] = useState(searchParams.get('categoryType') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);

  const categoryTypeOptions = [
    'Cultural', 'Adventure', 'Beach', 'Mountain', 'Wildlife', 'Historical',
    'Religious', 'Wellness', 'Luxury', 'Family', 'Honeymoon', 'Corporate'
  ];

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (locations) params.append('locations', locations);
        if (categoryType) params.append('categoryType', categoryType);
        params.append('page', page);
        params.append('limit', 12);

        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/exclusive-combo-packages/browse?${params}`);
        const data = await response.json();

        if (data.success) {
          setPackages(data.data);
        } else {
          setError('Failed to load packages');
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError('Failed to load packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [search, locations, categoryType, page]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    updateSearchParams();
  };

  // Update search params
  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (locations) params.set('locations', locations);
    if (categoryType) params.set('categoryType', categoryType);
    params.set('page', page);
    setSearchParams(params);
  };

  // Clear filters
  const clearFilters = () => {
    setSearch('');
    setLocations('');
    setCategoryType('');
    setPage(1);
    setSearchParams({});
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Exclusive Combo Packages{locationsFromUrl && ` - ${locationsFromUrl}`}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {fromDestination ? `Discover amazing tour packages for ${destinationName}` : 'Discover amazing tour packages tailored for you'}
          </p>
          {fromDestination && (
            <button
              onClick={() => navigate(`/destinations/${fromDestination}`)}
              className="mt-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to {destinationName}</span>
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-2" />
                  Locations
                </label>
                <input
                  type="text"
                  placeholder="e.g., Colombo, Kandy"
                  value={locations}
                  onChange={(e) => setLocations(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-2" />
                  Category Type
                </label>
                <select
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categoryTypeOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
              No packages found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <>
            {/* Packages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                    {pkg.images && pkg.images.length > 0 ? (
                      <img
                        src={pkg.images[0].url}
                        alt={pkg.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm sm:text-base text-gray-400">
                        No Image
                      </div>
                    )}
                    {/* Rating Badge */}
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white dark:bg-gray-800 rounded-lg p-1.5 sm:p-2 shadow-lg">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                          {pkg.averageRating || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 space-y-3 flex flex-col flex-grow">
                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                      {pkg.title}
                    </h3>

                    {/* Category and Days */}
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                        {pkg.categoryType}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {pkg.days} Days
                      </span>
                    </div>

                    {/* Locations */}
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{pkg.locations}</span>
                    </div>

                    {/* Price */}
                    <div className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                      LKR {pkg.price.toLocaleString()}
                    </div>

                    {/* Rating */}
                    <div className="text-xs sm:text-sm flex-grow">
                      {renderStars(pkg.averageRating || 0)}
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/exclusive-combo-packages/${pkg._id}`)}
                      className="w-full mt-auto px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 flex-wrap">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Page {page}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExclusiveComboPackagesBrowse;

