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

  // Predefined category options
  const categoryOptions = [
    'Emergency Response',
    'Medical Assistance',
    'Security Services',
    'Wildlife Safety',
    'Adventure Safety',
    'Mountain Rescue',
    'Water Safety',
    'First Aid Services',
    'Travel Insurance Assistance',
    'Crisis Management',
    'Safety Consulting',
    'Risk Assessment',
    'Village Guider',
    'Other'
  ];

  // Fetch provinces and professionals on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provinces
        const provincesRes = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/travel-safe-help-professional/provinces');
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

      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/travel-safe-help-professional/browse?${queryParams}`);
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

  // Get unique specializations from professionals
  const specializations = [...new Set(professionals.map(p => p.specialization))];

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Travel Safe & Help Professionals
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Find expert professionals to help you stay safe while traveling
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialization, or category..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Filters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Province Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Province
              </label>
              <select
                name="province"
                value={filters.province}
                onChange={handleFilterChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesData).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                City
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                disabled={!filters.province}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Cities</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Specialization Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Specialization
              </label>
              <select
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Categories</option>
                {categoryOptions.map(cat => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {professionals.map(professional => (
              <div
                key={professional._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100 dark:border-gray-700"
                style={{ minHeight: '420px' }}
              >
                {/* Avatar */}
                <div className="relative h-48 sm:h-56 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden flex-shrink-0">
                  <img
                    src={professional.avatar?.url}
                    alt={professional.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-3 py-1.5 flex items-center space-x-1 shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {professional.averageRating.toFixed(1)}
                    </span>
                  </div>
                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {professional.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Name and Specialization */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {professional.name}
                  </h3>
                  <p className="text-base text-blue-600 dark:text-blue-400 font-semibold mb-3 line-clamp-1">
                    {professional.specialization}
                  </p>

                  {/* Rating and Reviews */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-1">
                      {renderStars(professional.averageRating)}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      ({professional.totalReviews} {professional.totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{professional.city}, {professional.province}</span>
                  </div>

                  {/* Experience */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span className="font-semibold text-gray-900 dark:text-white">{professional.experience}</span> years of experience
                  </p>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/travel-safe-help-professional/${professional._id}`)}
                    className="w-full mt-auto px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
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
          <div className="text-center py-8 sm:py-12">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 px-4">
              No professionals found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelSafeHelpProfessionalsBrowse;

