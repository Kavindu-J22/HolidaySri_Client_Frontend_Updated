import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  DollarSign,
  Star,
  Loader,
  AlertCircle,
  Eye,
  Filter
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const DailyGroceryEssentialsBrowse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    specialization: searchParams.get('specialization') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    province: searchParams.get('province') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  // Provinces data
  const [provincesData, setProvincesData] = useState({});
  const [uniqueSpecializations, setUniqueSpecializations] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/daily-grocery-essentials/provinces');
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

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.specialization) queryParams.append('specialization', filters.specialization);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.city) queryParams.append('city', filters.city);
        if (filters.province) queryParams.append('province', filters.province);
        queryParams.append('page', filters.page);
        queryParams.append('limit', 12);

        const response = await fetch(`${API_BASE_URL}/daily-grocery-essentials/browse/all?${queryParams}`);
        const data = await response.json();

        if (data.success) {
          setListings(data.data);
          setPagination(data.pagination);
          setError('');

          // Extract unique specializations and categories
          const specs = [...new Set(data.data.map(l => l.specialization))];
          const cats = [...new Set(data.data.map(l => l.category))];
          setUniqueSpecializations(specs);
          setUniqueCategories(cats);
        } else {
          setError(data.message || 'Failed to load listings');
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError('Error loading listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      page: 1
    }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      specialization: '',
      category: '',
      city: '',
      province: '',
      page: 1
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Daily Grocery Essentials
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Browse and discover quality grocery essentials from local sellers
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search by name, description, or specialization..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-md"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-5 lg:p-6 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <select
                name="province"
                value={filters.province}
                onChange={handleFilterChange}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesData).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>

              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Cities</option>
                {filters.province && provincesData[filters.province]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <select
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Specializations</option>
                {uniqueSpecializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>

              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={clearFilters}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-blue-500" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">No listings found</p>
          </div>
        ) : (
          <>
            {/* Listings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
              {listings.map(listing => {
                const avgRating = listing.averageRating || 0;
                const totalReviews = listing.totalReviews || 0;

                return (
                  <div
                    key={listing._id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative bg-gray-200 dark:bg-gray-700 h-44 sm:h-48 lg:h-52 overflow-hidden flex-shrink-0">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0].url}
                          alt={listing.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
                      {listing.discount > 0 && (
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                          {listing.discount}% OFF
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-grow">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">
                        {listing.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                i < Math.round(avgRating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {avgRating.toFixed(1)} ({totalReviews})
                        </span>
                      </div>

                      {/* Specialization & Category */}
                      <div className="mb-3">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {listing.specialization} • {listing.category}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                        <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          LKR {listing.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 mb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-grow">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{listing.city}, {listing.province}</span>
                      </div>

                      {/* View Button */}
                      <button
                        onClick={() => navigate(`/daily-grocery-essentials/${listing._id}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg flex-shrink-0"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                >
                  Previous
                </button>

                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    (pageNum >= pagination.currentPage - 1 && pageNum <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 font-medium ${
                          pageNum === pagination.currentPage
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === 2 || pageNum === pagination.totalPages - 1) {
                    return <span key={pageNum} className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DailyGroceryEssentialsBrowse;

