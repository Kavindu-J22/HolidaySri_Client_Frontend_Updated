import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Loader, MapPin, Eye, AlertCircle, Search } from 'lucide-react';

const TravelSafeHelpProfessionalsBrowse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [professionals, setProfessionals] = useState([]);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    province: '',
    city: '',
    specialization: '',
    category: ''
  });

  // Fetch provinces and professionals on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provinces
        const provincesRes = await fetch('/api/travel-safe-help-professional/provinces');
        const provincesData = await provincesRes.json();
        if (provincesData.success) {
          setProvincesData(provincesData.data);
        }

        // Fetch professionals
        await fetchProfessionals();
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load professionals');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch professionals with filters
  const fetchProfessionals = async (filterParams = filters, search = searchTerm) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filterParams.province) queryParams.append('province', filterParams.province);
      if (filterParams.city) queryParams.append('city', filterParams.city);
      if (filterParams.specialization) queryParams.append('specialization', filterParams.specialization);
      if (filterParams.category) queryParams.append('category', filterParams.category);
      if (search) queryParams.append('search', search);

      const response = await fetch(`/api/travel-safe-help-professional/browse?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setProfessionals(data.data);
        setError('');
      } else {
        setError('Failed to load professionals');
      }
    } catch (err) {
      console.error('Error fetching professionals:', err);
      setError('Failed to load professionals');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };

    // Reset city if province changes
    if (name === 'province') {
      newFilters.city = '';
    }

    setFilters(newFilters);
    fetchProfessionals(newFilters, searchTerm);
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchProfessionals(filters, value);
  };

  // Get available cities for selected province
  const availableCities = filters.province ? provincesData[filters.province] || [] : [];

  // Get unique specializations and categories
  const specializations = [...new Set(professionals.map(p => p.specialization))];
  const categories = [...new Set(professionals.map(p => p.category))];

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Travel Safe & Help Professionals
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find expert professionals to help you stay safe while traveling
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialization, or category..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Province Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Province
              </label>
              <select
                name="province"
                value={filters.province}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesData).map(province => (
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Cities</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Specialization Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specialization
              </label>
              <select
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
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
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Professionals Grid */}
        {!loading && professionals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map(professional => (
              <div
                key={professional._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Avatar */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
                  <img
                    src={professional.avatar?.url}
                    alt={professional.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Name and Specialization */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {professional.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                    {professional.specialization}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {professional.category}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {renderStars(professional.averageRating)}
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {professional.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({professional.totalReviews} reviews)
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{professional.city}, {professional.province}</span>
                  </div>

                  {/* Experience */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span className="font-semibold">{professional.experience}</span> years experience
                  </p>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/travel-safe-help-professional/${professional._id}`)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && professionals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No professionals found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelSafeHelpProfessionalsBrowse;

