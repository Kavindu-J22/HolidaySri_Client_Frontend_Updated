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
          fetch('/api/salon-makeup-artists/provinces').then(r => r.json()),
          fetch('/api/salon-makeup-artists/browse').then(r => r.json())
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

      const response = await fetch(`/api/salon-makeup-artists/browse?${queryParams}`).then(r => r.json());
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
      const response = await fetch('/api/salon-makeup-artists/browse').then(r => r.json());
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Salon & Makeup Artists
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover professional salon and makeup artist services
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, specialization, or category..."
                value={filters.search}
                onChange={handleFilterChange}
                name="search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Province
                  </label>
                  <select
                    name="province"
                    value={filters.province}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
                  >
                    Reset
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <div key={profile._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Avatar */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                      {profile.avatar?.url && (
                        <img
                          src={profile.avatar.url}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {profile.averageRating || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Name */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {profile.name}
                      </h3>

                      {/* Specialization */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {profile.specialization}
                      </p>

                      {/* Category Badge */}
                      <div className="mb-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                          {profile.category}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location?.city}, {profile.location?.province}</span>
                      </div>

                      {/* Experience */}
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span className="font-medium">{profile.experience}</span> years experience
                      </div>

                      {/* Reviews Count */}
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span className="font-medium">{profile.totalReviews}</span> reviews
                      </div>

                      {/* View Button */}
                      <button
                        onClick={() => navigate(`/salon-makeup-artists/${profile._id}`)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-semibold"
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

