import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Loader,
  AlertCircle,
  Filter,
  X
} from 'lucide-react';

const JewelryGemSellersBrowse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [provincesData, setProvincesData] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    specialization: '',
    category: '',
    province: '',
    city: ''
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });

  // Provinces and districts
  const provincesAndDistricts = {
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Northern Province": ["Jaffna", "Mannar", "Vavuniya", "Kilinochchi", "Mullaitivu"],
    "Eastern Province": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Sabaragamuwa Province": ["Kegalle", "Ratnapura"]
  };

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setProvincesData(provincesAndDistricts);
    fetchSellers();
  }, []);

  // Fetch sellers
  const fetchSellers = async (page = 1, filterParams = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 12);

      if (filterParams.specialization) params.append('specialization', filterParams.specialization);
      if (filterParams.category) params.append('category', filterParams.category);
      if (filterParams.province) params.append('province', filterParams.province);
      if (filterParams.city) params.append('city', filterParams.city);
      if (filterParams.search) params.append('search', filterParams.search);

      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/jewelry-gem-sellers/browse?${params}`);
      if (!response.ok) throw new Error('Failed to fetch sellers');

      const data = await response.json();
      setSellers(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error('Error fetching sellers:', err);
      setError('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    fetchSellers(1, { ...filters, search: searchTerm });
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { city: '' })
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    setPagination({ ...pagination, currentPage: 1 });
    fetchSellers(1, filters);
    setShowFilters(false);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      specialization: '',
      category: '',
      province: '',
      city: ''
    });
    setSearchTerm('');
    setPagination({ ...pagination, currentPage: 1 });
    fetchSellers(1, {});
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, currentPage: newPage });
    fetchSellers(newPage, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-6 sm:py-8 lg:py-12 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4">Jewelry & Gem Sellers</h1>
          <p className="text-sm sm:text-base lg:text-lg text-amber-100">Discover premium jewelry and gemstone professionals</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, specialization, category..."
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 sm:flex-none bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition flex items-center justify-center gap-2 shadow-md"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Search</span>
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 sm:flex-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-5 lg:p-6 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={filters.specialization}
                  onChange={handleFilterChange}
                  placeholder="e.g., Diamond & Gold"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  placeholder="e.g., Diamond"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Province
                </label>
                <select
                  name="province"
                  value={filters.province}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Provinces</option>
                  {Object.keys(provincesData).map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  disabled={!filters.province}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  <option value="">All Cities</option>
                  {filters.province && provincesData[filters.province]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-2 px-4 text-sm sm:text-base rounded-lg transition shadow-md"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 px-4 text-sm sm:text-base rounded-lg transition"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <Loader className="w-8 h-8 sm:w-12 sm:h-12 text-amber-600 animate-spin" />
          </div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">No sellers found</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Sellers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
              {sellers.map(seller => (
                <div
                  key={seller._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col h-full"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 h-24 sm:h-28 lg:h-32 relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 lg:p-6 -mt-10 sm:-mt-12 relative z-10 flex flex-col flex-grow">
                    {/* Avatar/Image */}
                    {seller.images && seller.images.length > 0 && (
                      <img
                        src={seller.images[0].url}
                        alt={seller.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 mb-3 sm:mb-4"
                      />
                    )}

                    {/* Name and Rating */}
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">{seller.name}</h3>

                    <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              i < Math.round(seller.averageRating || 0)
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {seller.averageRating ? seller.averageRating.toFixed(1) : 'N/A'}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        ({seller.totalReviews || 0})
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4 text-xs sm:text-sm flex-grow">
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-1">
                        <span className="font-semibold">Specialization:</span> {seller.specialization}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-1">
                        <span className="font-semibold">Category:</span> {seller.category}
                      </p>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
                        <span className="line-clamp-1">{seller.city}, {seller.province}</span>
                      </div>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/jewelry-gem-sellers/${seller._id}`)}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-2 sm:py-2.5 px-4 text-sm sm:text-base rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex-shrink-0"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition font-medium"
                >
                  Previous
                </button>

                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 font-medium ${
                      pagination.currentPage === i + 1
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition font-medium"
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

export default JewelryGemSellersBrowse;

