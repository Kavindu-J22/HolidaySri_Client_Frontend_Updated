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

const FashionDesignersBrowse = () => {
  const navigate = useNavigate();
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    province: '',
    city: '',
    specialization: '',
    category: '',
    search: ''
  });

  // Fetch provinces and designers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [provincesRes, designersRes] = await Promise.all([
          fetch('/api/fashion-designers/provinces').then(r => r.json()),
          fetch('/api/fashion-designers/browse').then(r => r.json())
        ]);

        if (provincesRes.success) {
          setProvincesData(provincesRes.data);
        }

        if (designersRes.success && designersRes.data) {
          setDesigners(designersRes.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load fashion designers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      const response = await fetch(`/api/fashion-designers/browse?${queryParams}`).then(r => r.json());
      if (response.success && response.data) {
        setDesigners(response.data);
      }
    } catch (err) {
      console.error('Error applying filters:', err);
      setError('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  // Clear filters
  const handleClearFilters = async () => {
    setFilters({
      province: '',
      city: '',
      specialization: '',
      category: '',
      search: ''
    });
    try {
      setLoading(true);
      const response = await fetch('/api/fashion-designers/browse').then(r => r.json());
      if (response.success && response.data) {
        setDesigners(response.data);
      }
    } catch (err) {
      console.error('Error clearing filters:', err);
    } finally {
      setLoading(false);
    }
  };

  const availableCities = filters.province ? provincesData[filters.province] || [] : [];

  if (loading && designers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Fashion Designers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover talented fashion designers for your special occasions
          </p>
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

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by name, specialization, or description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
          >
            <Filter className="w-5 h-5" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Province
                </label>
                <select
                  value={filters.province}
                  onChange={(e) => setFilters({ ...filters, province: e.target.value, city: '' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  disabled={!filters.province}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
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
                  value={filters.specialization}
                  onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                  placeholder="e.g., Bridal Wear"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  placeholder="e.g., Luxury"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply
                </button>
                <button
                  onClick={handleClearFilters}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Designers Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : designers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No fashion designers found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designers.map((designer) => (
              <div
                key={designer._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={designer.avatar?.url}
                    alt={designer.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{designer.viewCount || 0}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {designer.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-2">
                    {designer.specialization}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {designer.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(designer.averageRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {designer.averageRating || 0}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      ({designer.totalReviews || 0})
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{designer.location?.city}, {designer.location?.province}</span>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/fashion-designers/${designer._id}`)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Profile
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

export default FashionDesignersBrowse;

