import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Loader, AlertCircle, Star, MapPin, Briefcase } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const AdvisorsCounselorsBrowse = () => {
  const navigate = useNavigate();
  const [advisors, setAdvisors] = useState([]);
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
    fetchAdvisors();
  }, []);

  // Fetch advisors
  const fetchAdvisors = async (page = 1, search = searchTerm, currentFilters = filters) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 12);

      if (search.trim()) params.append('search', search.trim());
      if (currentFilters.specialization) params.append('specialization', currentFilters.specialization);
      if (currentFilters.category) params.append('category', currentFilters.category);
      if (currentFilters.city) params.append('city', currentFilters.city);
      if (currentFilters.province) params.append('province', currentFilters.province);

      const response = await fetch(`${API_BASE_URL}/advisors-counselors/browse?${params}`);
      if (!response.ok) throw new Error('Failed to fetch advisors');

      const data = await response.json();
      setAdvisors(data.data || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error fetching advisors:', error);
      setError('Failed to load advisors');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    fetchAdvisors(1, searchTerm, filters);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    if (name === 'province') {
      newFilters.city = ''; // Reset city when province changes
    }
    setFilters(newFilters);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setPagination({ ...pagination, currentPage: 1 });
    fetchAdvisors(1, searchTerm, filters);
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
    fetchAdvisors(1, '', {
      specialization: '',
      category: '',
      city: '',
      province: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Experienced Advisors & Counselors
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Find professional advisors and counselors for your needs
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 sm:space-x-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-red-700">{error}</p>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, specialization, or category..."
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Filters</span>
              </button>
            </div>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Specialization */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={filters.specialization}
                    onChange={handleFilterChange}
                    placeholder="e.g., Career Counseling"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    placeholder="e.g., Consultation"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Province
                  </label>
                  <select
                    name="province"
                    value={filters.province}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">All Provinces</option>
                    {Object.keys(provincesData).map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    City
                  </label>
                  <select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">All Cities</option>
                    {filters.province && provincesData[filters.province]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 sm:pt-4">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClearFilters}
                  className="flex-1 px-4 py-2.5 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold text-sm sm:text-base"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Advisors Grid */}
        {!loading && advisors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
            {advisors.map(advisor => (
              <div
                key={advisor._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden flex-shrink-0">
                  <img
                    src={advisor.avatar?.url}
                    alt={advisor.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                  {/* Name and Rating */}
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {advisor.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              i < Math.round(advisor.averageRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {advisor.averageRating || 0} ({advisor.totalReviews || 0})
                      </span>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                      <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{advisor.specialization}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {advisor.experience} years experience
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{advisor.city}, {advisor.province}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                    {advisor.description}
                  </p>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/advisors-counselors/${advisor._id}`)}
                    className="w-full px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold text-sm sm:text-base mt-auto"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && advisors.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 px-4">
              No advisors found. Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2">
            <button
              onClick={() => fetchAdvisors(pagination.currentPage - 1, searchTerm, filters)}
              disabled={pagination.currentPage === 1}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
            >
              Previous
            </button>
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchAdvisors(pagination.currentPage + 1, searchTerm, filters)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisorsCounselorsBrowse;

