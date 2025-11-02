import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, Star, Eye } from 'lucide-react';

const TrustedAstrologistsBrowse = () => {
  const navigate = useNavigate();
  const [astrologists, setAstrologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [provincesData, setProvincesData] = useState({});

  // Filter state
  const [filters, setFilters] = useState({
    specialization: '',
    category: '',
    city: '',
    province: ''
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });

  // Sri Lankan provinces and districts
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

  useEffect(() => {
    setProvincesData(provincesAndDistricts);
    fetchAstrologists(1, searchTerm, filters);
  }, []);

  // Fetch astrologists
  const fetchAstrologists = async (page = 1, search = '', filterParams = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 12,
        search,
        specialization: filterParams.specialization || '',
        category: filterParams.category || '',
        city: filterParams.city || '',
        province: filterParams.province || ''
      });

      const response = await fetch(`/api/trusted-astrologists/browse?${params}`);
      if (!response.ok) throw new Error('Failed to fetch astrologists');

      const data = await response.json();
      setAstrologists(data.data || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error fetching astrologists:', error);
      setError('Failed to load astrologists');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    fetchAstrologists(1, searchTerm, filters);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    if (name === 'province') {
      newFilters.city = '';
    }
    setFilters(newFilters);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setPagination({ ...pagination, currentPage: 1 });
    fetchAstrologists(1, searchTerm, filters);
    setShowFilters(false);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      specialization: '',
      category: '',
      city: '',
      province: ''
    });
    setSearchTerm('');
    setPagination({ ...pagination, currentPage: 1 });
    fetchAstrologists(1, '', {});
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
          {rating ? rating.toFixed(1) : 'N/A'}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Trusted Astrologists
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover experienced astrologists and get personalized readings
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, specialization, or category..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </form>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={filters.specialization}
                    onChange={handleFilterChange}
                    placeholder="e.g., Vedic Astrology"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    placeholder="e.g., Birth Chart"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Province
                  </label>
                  <select
                    name="province"
                    value={filters.province}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Provinces</option>
                    {Object.keys(provincesAndDistricts).map(province => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={!filters.province}
                  >
                    <option value="">All Cities</option>
                    {filters.province && provincesAndDistricts[filters.province]?.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClearFilters}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors font-semibold"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Astrologists Grid */}
        {!loading && astrologists.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {astrologists.map(astrologist => (
                <div
                  key={astrologist._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Avatar */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                    {astrologist.avatar?.url ? (
                      <img
                        src={astrologist.avatar.url}
                        alt={astrologist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                        {astrologist.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {astrologist.name}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">
                      {astrologist.specialization}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {astrologist.category}
                    </p>

                    {/* Rating */}
                    <div className="mb-3">
                      {renderStars(astrologist.averageRating || 0)}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {astrologist.totalReviews || 0} reviews
                      </p>
                    </div>

                    {/* Location */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      📍 {astrologist.city}, {astrologist.province}
                    </p>

                    {/* Experience */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      ⭐ {astrologist.experience} years experience
                    </p>

                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/trusted-astrologists/${astrologist._id}`)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => {
                    const newPage = pagination.currentPage - 1;
                    fetchAstrologists(newPage, searchTerm, filters);
                    setPagination({ ...pagination, currentPage: newPage });
                  }}
                  disabled={pagination.currentPage === 1}
                  className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => {
                        fetchAstrologists(page, searchTerm, filters);
                        setPagination({ ...pagination, currentPage: page });
                      }}
                      className={`px-3 py-2 rounded-lg font-semibold transition ${
                        pagination.currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const newPage = pagination.currentPage + 1;
                    fetchAstrologists(newPage, searchTerm, filters);
                    setPagination({ ...pagination, currentPage: newPage });
                  }}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && astrologists.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No astrologists found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrustedAstrologistsBrowse;

