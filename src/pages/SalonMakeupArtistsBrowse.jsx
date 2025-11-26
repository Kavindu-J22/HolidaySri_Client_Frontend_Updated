import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  Loader,
  AlertCircle,
  Star,
  MapPin,
  Eye
} from 'lucide-react';

const SalonMakeupArtistsBrowse = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});

  // Filter state
  const [filters, setFilters] = useState({
    province: '',
    city: '',
    specialization: '',
    category: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch provinces and profiles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [provincesRes, profilesRes] = await Promise.all([
          fetch('https://holidaysri-backend-9xm4.onrender.com/api/salon-makeup-artists/provinces').then(r => r.json()),
          fetch('https://holidaysri-backend-9xm4.onrender.com/api/salon-makeup-artists/browse').then(r => r.json())
        ]);

        if (provincesRes.success) {
          setProvincesData(provincesRes.data);
        }

        if (profilesRes.success && profilesRes.data) {
          // Shuffle profiles randomly
          const shuffled = [...profilesRes.data].sort(() => Math.random() - 0.5);
          setProfiles(shuffled);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load salon & makeup artists');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      // Reset city when province changes
      ...(name === 'province' && { city: '' })
    }));
  };

  // Apply filters
  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.province) queryParams.append('province', filters.province);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.specialization) queryParams.append('specialization', filters.specialization);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/salon-makeup-artists/browse?${queryParams}`).then(r => r.json());
      if (response.success && response.data) {
        const shuffled = [...response.data].sort(() => Math.random() - 0.5);
        setProfiles(shuffled);
      }
      setShowFilters(false);
    } catch (err) {
      console.error('Error applying filters:', err);
      setError('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const handleResetFilters = async () => {
    setFilters({
      province: '',
      city: '',
      specialization: '',
      category: '',
      search: ''
    });
    try {
      setLoading(true);
      const response = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/salon-makeup-artists/browse').then(r => r.json());
      if (response.success && response.data) {
        const shuffled = [...response.data].sort(() => Math.random() - 0.5);
        setProfiles(shuffled);
      }
    } catch (err) {
      console.error('Error resetting filters:', err);
    } finally {
      setLoading(false);
    }
  };

  const availableCities = filters.province ? provincesData[filters.province] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Salon & Makeup Artists
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Discover professional salon and makeup artist services
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, specialization..."
                value={filters.search}
                onChange={handleFilterChange}
                name="search"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium shadow-md hover:shadow-lg"
            >
              <Filter className="w-5 h-5" />
              <span className="text-sm sm:text-base">Filters</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 space-y-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Options</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="sm:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Province
                  </label>
                  <select
                    name="province"
                    value={filters.province}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Provinces</option>
                    {Object.keys(provincesData).map(province => (
                      <option key={province} value={province}>{province}</option>
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
                    disabled={!filters.province}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Cities</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={filters.specialization}
                    onChange={handleFilterChange}
                    placeholder="e.g., Bridal Makeup"
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
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
                    placeholder="e.g., Premium Salon"
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="flex flex-col justify-end gap-2 sm:col-span-2 lg:col-span-1">
                  <button
                    onClick={handleApplyFilters}
                    className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg text-sm"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="w-full px-4 py-2.5 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium text-sm"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              Found {profiles.length} salon & makeup artist{profiles.length !== 1 ? 's' : ''}
            </div>

            {/* Profiles Grid */}
            {profiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {profiles.map((profile) => (
                  <div
                    key={profile._id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                  >
                    {/* Avatar */}
                    <div className="relative h-56 sm:h-64 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 overflow-hidden">
                      {profile.avatar?.url ? (
                        <img
                          src={profile.avatar.url}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-6xl font-bold">
                            {profile.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-3 py-1.5 flex items-center space-x-1 shadow-lg">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                          {profile.averageRating ? profile.averageRating.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      {/* Category Badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold shadow-md">
                          {profile.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-grow">
                      {/* Name */}
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {profile.name}
                      </h3>

                      {/* Specialization */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 min-h-[2.5rem]">
                        {profile.specialization}
                      </p>

                      {/* Location */}
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
                        <MapPin className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <span className="line-clamp-1">{profile.location?.city}, {profile.location?.province}</span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-t border-b border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            {profile.experience}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Years Exp.
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            {profile.totalReviews || 0}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Reviews
                          </div>
                        </div>
                      </div>

                      {/* View Button */}
                      <button
                        onClick={() => navigate(`/salon-makeup-artists/${profile._id}`)}
                        className="w-full mt-auto px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No salon & makeup artists found. Try adjusting your filters.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SalonMakeupArtistsBrowse;

