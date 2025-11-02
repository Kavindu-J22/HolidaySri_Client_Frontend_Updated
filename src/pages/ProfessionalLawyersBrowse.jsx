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
        const response = await fetch('/api/professional-lawyers/provinces');
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

        const response = await fetch(`/api/professional-lawyers/browse?${queryParams}`);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Professional Lawyers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find and connect with experienced legal professionals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, specialization, or description..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                placeholder="e.g., Criminal Law"
                value={filters.specialization}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                placeholder="e.g., Litigation"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Province
              </label>
              <select
                name="province"
                value={filters.province}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesData).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                City
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                disabled={!filters.province}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm disabled:opacity-50"
              >
                <option value="">All Cities</option>
                {filters.province && provincesData[filters.province]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
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
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Lawyers Grid */}
        {!loading && lawyers.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {lawyers.map(lawyer => (
                <div
                  key={lawyer._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <img
                      src={lawyer.avatar?.url}
                      alt={lawyer.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white mb-4"
                    />
                    <h3 className="text-xl font-bold mb-1">{lawyer.name}</h3>
                    <p className="text-blue-100 text-sm">{lawyer.specialization}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Rating */}
                    <div className="mb-4">
                      {renderStars(lawyer.averageRating)}
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {lawyer.totalReviews} reviews
                      </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        <span>{lawyer.category}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{lawyer.city}, {lawyer.province}</span>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">{lawyer.experience}</span> years experience
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {lawyer.description}
                    </p>

                    {/* Availability */}
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
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
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && lawyers.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No lawyers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

