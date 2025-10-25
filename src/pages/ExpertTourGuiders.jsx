import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader, Filter, X } from 'lucide-react';
import TourGuiderCard from '../components/tourGuider/TourGuiderCard';
import axios from 'axios';

const ExpertTourGuiders = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [tourGuiders, setTourGuiders] = useState([]);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [provinces, setProvinces] = useState({});
  const [cities, setCities] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    experience: searchParams.get('experience') || '',
    gender: searchParams.get('gender') || '',
    province: searchParams.get('province') || '',
    city: searchParams.get('city') || ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('/api/tour-guider/provinces');
        if (response.data.success) {
          setProvinces(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching provinces:', err);
      }
    };
    fetchProvinces();
  }, []);

  // Update cities when province changes
  useEffect(() => {
    if (filters.province && provinces[filters.province]) {
      setCities(provinces[filters.province]);
    } else {
      setCities([]);
    }
  }, [filters.province, provinces]);

  // Fetch tour guiders
  useEffect(() => {
    const fetchTourGuiders = async () => {
      try {
        setLoading(true);
        setError('');

        const params = new URLSearchParams();
        if (filters.experience) params.append('experience', filters.experience);
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.province) params.append('province', filters.province);
        if (filters.city) params.append('city', filters.city);
        params.append('page', pagination.currentPage);
        params.append('limit', 12);

        const response = await axios.get(`/api/tour-guider/list/all?${params}`);

        if (response.data.success) {
          setTourGuiders(response.data.data);
          setPagination(response.data.pagination);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load tour guiders');
      } finally {
        setLoading(false);
      }
    };

    fetchTourGuiders();
  }, [filters, pagination.currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { city: '' }) // Reset city when province changes
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      experience: '',
      gender: '',
      province: '',
      city: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleViewProfile = (tourGuiderId) => {
    navigate(`/tour-guider/${tourGuiderId}`);
  };

  const hasActiveFilters = Object.values(filters).some(val => val !== '');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Expert Tour Guiders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find and connect with professional tour guides in Sri Lanka
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                {Object.values(filters).filter(v => v).length}
              </span>
            )}
          </button>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Experience
                  </label>
                  <select
                    name="experience"
                    value={filters.experience}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Any</option>
                    <option value="1">1+ years</option>
                    <option value="3">3+ years</option>
                    <option value="5">5+ years</option>
                    <option value="10">10+ years</option>
                  </select>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Province Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Province
                  </label>
                  <select
                    name="province"
                    value={filters.province}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Any</option>
                    {Object.keys(provinces).map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    disabled={!filters.province}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  >
                    <option value="">Any</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : tourGuiders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No tour guiders found matching your criteria
            </p>
          </div>
        ) : (
          <>
            {/* Tour Guiders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {tourGuiders.map(tourGuider => (
                <TourGuiderCard
                  key={tourGuider._id}
                  tourGuider={tourGuider}
                  onView={handleViewProfile}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                  return pageNum <= pagination.totalPages ? (
                    <button
                      key={pageNum}
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pageNum === pagination.currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ) : null;
                })}

                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1) }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
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

export default ExpertTourGuiders;

