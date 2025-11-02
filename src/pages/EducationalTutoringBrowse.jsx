import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, Loader, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const EducationalTutoringBrowse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    specialization: searchParams.get('specialization') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    province: searchParams.get('province') || ''
  });

  const [provincesData, setProvincesData] = useState({});

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
    fetchProfiles(1);
  }, []);

  const fetchProfiles = async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 12);

      if (filters.search) params.append('search', filters.search);
      if (filters.specialization) params.append('specialization', filters.specialization);
      if (filters.category) params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);
      if (filters.province) params.append('province', filters.province);

      const response = await fetch(`/api/educational-tutoring/browse?${params}`);
      const data = await response.json();

      if (data.success) {
        setProfiles(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch profiles');
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError('Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { city: '' })
    }));
  };

  const handleSearch = () => {
    fetchProfiles(1);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      specialization: '',
      category: '',
      city: '',
      province: ''
    });
    setSearchParams({});
    fetchProfiles(1);
  };

  const handlePageChange = (newPage) => {
    fetchProfiles(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
          {rating ? rating.toFixed(1) : 'No ratings'}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Educational Tutoring Services
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find qualified tutors and educational professionals
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Search & Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search by Name or Description
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
                placeholder="e.g., Mathematics"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                placeholder="e.g., University Level"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Province */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Province
              </label>
              <select
                name="province"
                value={filters.province}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesAndDistricts).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={!filters.province}
              >
                <option value="">All Cities</option>
                {filters.province && provincesAndDistricts[filters.province]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              className="flex-1 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        )}

        {/* Profiles Grid */}
        {!loading && profiles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {profiles.map(profile => (
                <div
                  key={profile._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Avatar */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-indigo-600 overflow-hidden">
                    {profile.avatar?.url && (
                      <img
                        src={profile.avatar.url}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-3 py-1 flex items-center space-x-1">
                      {renderStars(profile.overallRating || 0)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {profile.name}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {profile.category}
                    </p>

                    {/* Specializations */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {profile.specialization?.slice(0, 2).map((spec, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                        {profile.specialization?.length > 2 && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
                            +{profile.specialization.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location?.city}, {profile.location?.province}</span>
                    </div>

                    {/* Experience */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      <span className="font-semibold">{profile.experience}</span> years experience
                    </p>

                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/educational-tutoring/${profile._id}`)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-2">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                        pagination.page === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && profiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No educational tutoring profiles found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationalTutoringBrowse;

