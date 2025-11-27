import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO/SEO';
import { Loader, Filter, X, ArrowLeft, Search } from 'lucide-react';
import TourGuiderCard from '../components/tourGuider/TourGuiderCard';
import axios from 'axios';

const ExpertTourGuiders = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [tourGuiders, setTourGuiders] = useState([]);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [provinces, setProvinces] = useState({});
  const [cities, setCities] = useState([]);

  // Get destination info from URL params
  const fromDestination = searchParams.get('fromDestination') || '';
  const destinationName = searchParams.get('destinationName') || '';
  const cityFromUrl = searchParams.get('city') || '';

  // Filter states
  const [filters, setFilters] = useState({
    experience: searchParams.get('experience') || '',
    gender: searchParams.get('gender') || '',
    province: searchParams.get('province') || '',
    city: cityFromUrl
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
        const response = await axios.get('https://holidaysri-backend-9xm4.onrender.com/api/tour-guider/provinces');
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

        const response = await axios.get(`https://holidaysri-backend-9xm4.onrender.com/api/tour-guider/list/all?${params}`);

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

  // Filter tour guiders based on search query
  const filteredTourGuiders = useMemo(() => {
    if (!searchQuery.trim()) {
      return tourGuiders;
    }

    const query = searchQuery.toLowerCase().trim();
    return tourGuiders.filter(tourGuider => {
      const name = tourGuider.name?.toLowerCase() || '';
      const description = tourGuider.description?.toLowerCase() || '';
      return name.includes(query) || description.includes(query);
    });
  }, [tourGuiders, searchQuery]);

  return (
    <>
      <SEO
        title="Expert Tour Guides in Sri Lanka | Professional Tour Guiders - Holidaysri"
        description="Find and hire professional tour guides in Sri Lanka. Connect with experienced, certified tour guiders for personalized tours across Sri Lanka's beautiful destinations."
        keywords="Sri Lanka tour guides, professional tour guiders, tour guide Sri Lanka, hire tour guide, certified tour guides, Sri Lanka travel guides, local tour guides, expert tour guiders"
        canonical="https://www.holidaysri.com/ads/tourism/tour-guiders"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Expert Tour Guiders{cityFromUrl && ` - ${cityFromUrl}`}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {fromDestination ? `Find and connect with professional tour guides in ${destinationName}` : 'Find and connect with professional tour guides in Sri Lanka'}
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
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2.5 sm:py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto justify-center sm:justify-start"
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
            <div className="mt-4 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
        ) : filteredTourGuiders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
              {searchQuery
                ? `No tour guiders found matching "${searchQuery}"`
                : 'No tour guiders found matching your criteria'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            {searchQuery && (
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Found {filteredTourGuiders.length} tour guider{filteredTourGuiders.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </div>
            )}

            {/* Tour Guiders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {filteredTourGuiders.map(tourGuider => (
                <TourGuiderCard
                  key={tourGuider._id}
                  tourGuider={tourGuider}
                  onView={handleViewProfile}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                  disabled={pagination.currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                  return pageNum <= pagination.totalPages ? (
                    <button
                      key={pageNum}
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
                      className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
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
                  className="px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </>
  );
};

export default ExpertTourGuiders;

