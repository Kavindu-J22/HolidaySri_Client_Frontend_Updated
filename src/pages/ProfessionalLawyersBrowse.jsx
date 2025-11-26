import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Loader, AlertCircle, MapPin, Briefcase } from 'lucide-react';

const ProfessionalLawyersBrowse = () => {
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    category: '',
    city: '',
    province: ''
  });

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/professional-lawyers/provinces');
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

  // Fetch lawyers with filters
  useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true);
      setError('');

      try {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.specialization) queryParams.append('specialization', filters.specialization);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.city) queryParams.append('city', filters.city);
        if (filters.province) queryParams.append('province', filters.province);
        queryParams.append('page', page);
        queryParams.append('limit', 12);

        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/professional-lawyers/browse?${queryParams}`);
        const data = await response.json();

        if (data.success) {
          setLawyers(data.data);
          setTotalPages(data.pagination.totalPages);
        } else {
          setError('Failed to load lawyers');
        }
      } catch (error) {
        console.error('Error fetching lawyers:', error);
        setError('Failed to load lawyers');
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, [filters, page]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { city: '' }) // Reset city when province changes
    }));
    setPage(1); // Reset to first page
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
    setPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      specialization: '',
      category: '',
      city: '',
      province: ''
    });
    setPage(1);
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Professional Lawyers
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Find and connect with experienced legal professionals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
          {/* Search Bar */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, specialization, or description..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                placeholder="e.g., Criminal Law"
                value={filters.specialization}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                placeholder="e.g., Litigation"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                Province
              </label>
              <select
                name="province"
                value={filters.province}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesData).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                City
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                disabled={!filters.province}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
              >
                <option value="">All Cities</option>
                {filters.province && provincesData[filters.province]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <button
                onClick={handleResetFilters}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2 sm:space-x-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Lawyers Grid */}
        {!loading && lawyers.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
              {lawyers.map(lawyer => (
                <div
                  key={lawyer._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  style={{ minHeight: '480px' }}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-5 md:p-6 text-white flex-shrink-0">
                    <img
                      src={lawyer.avatar?.url}
                      alt={lawyer.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white mb-3 sm:mb-4"
                    />
                    <h3 className="text-lg sm:text-xl font-bold mb-1 line-clamp-1">{lawyer.name}</h3>
                    <p className="text-blue-100 text-xs sm:text-sm line-clamp-1">{lawyer.specialization}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                    {/* Rating */}
                    <div className="mb-3 sm:mb-4">
                      {renderStars(lawyer.averageRating)}
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {lawyer.totalReviews} {lawyer.totalReviews === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                        <span className="line-clamp-1">{lawyer.category}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                        <span className="line-clamp-1">{lawyer.city}, {lawyer.province}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">{lawyer.experience}</span> years experience
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2 flex-grow">
                      {lawyer.description}
                    </p>

                    {/* Availability */}
                    <div className="mb-3 sm:mb-4">
                      <span className={`inline-block px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                        lawyer.available
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {lawyer.available ? '✓ Available' : 'Not Available'}
                      </span>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/professional-lawyers/${lawyer._id}`)}
                      className="w-full px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold mt-auto"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto max-w-full px-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-colors flex-shrink-0 ${
                        page === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && lawyers.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No lawyers found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 px-4">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalLawyersBrowse;

