import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Eye, Loader, MapPin, Phone, Award } from 'lucide-react';

const LocalSimMobileDataBrowse = () => {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    province: '',
    city: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  // Sri Lankan provinces
  const provinces = [
    'Western', 'Central', 'Southern', 'Northern', 'Eastern',
    'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
  ];

  // Fetch profiles
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/local-sim-mobile-data/browse');
      const data = await response.json();

      if (data.success) {
        setProfiles(data.data);
        setFilteredProfiles(data.data);
      } else {
        setError(data.message || 'Failed to fetch profiles');
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to fetch profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...profiles];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(profile =>
        profile.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Province filter
    if (filters.province) {
      filtered = filtered.filter(profile => profile.province === filters.province);
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(profile =>
        profile.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    setFilteredProfiles(filtered);
  }, [searchTerm, filters, profiles]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      province: '',
      city: ''
    });
  };

  const handleViewProfile = (id) => {
    navigate(`/local-sim-mobile-data/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Local SIM Cards & Mobile Data Plans
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find the best local SIM cards and mobile data providers in Sri Lanka
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  placeholder="e.g., Telecommunication"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Provinces</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="Enter city"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Found <span className="font-semibold text-gray-900 dark:text-white">{filteredProfiles.length}</span> provider{filteredProfiles.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No providers found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <div
                key={profile._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Logo */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
                  {profile.logo && profile.logo.url ? (
                    <img
                      src={profile.logo.url}
                      alt={profile.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-white text-4xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {profile.name}
                  </h3>

                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                    {profile.category}
                  </p>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {profile.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{profile.experienceYears} years</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{profile.viewCount || 0}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= (profile.averageRating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {profile.averageRating ? profile.averageRating.toFixed(1) : '0.0'} ({profile.totalReviews || 0} reviews)
                    </span>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => handleViewProfile(profile._id)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalSimMobileDataBrowse;

