import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  MapPin, Star, Eye, Filter, X, ChevronLeft, ChevronRight, 
  Loader, AlertCircle, Building2, Sparkles
} from 'lucide-react';

const HotelsAccommodationsBrowse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1
  });

  // Filter state
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    climate: searchParams.get('climate') || '',
    province: searchParams.get('province') || '',
    city: searchParams.get('city') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  // Sri Lankan provinces and districts
  const provincesAndDistricts = {
    "Western": ["Colombo", "Gampaha", "Kalutara"],
    "Central": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern": ["Galle", "Matara", "Hambantota"],
    "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    "Eastern": ["Trincomalee", "Batticaloa", "Ampara"],
    "North Western": ["Kurunegala", "Puttalam"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Uva": ["Badulla", "Monaragala"],
    "Sabaragamuwa": ["Ratnapura", "Kegalle"]
  };

  // Climate options
  const climateOptions = [
    { value: "", label: "All Climates" },
    { value: "Dry Zone - Arid", label: "🌵 Dry Zone - Arid" },
    { value: "Dry Zone - Semi-Arid", label: "🏜️ Dry Zone - Semi-Arid" },
    { value: "Intermediate Zone", label: "🌾 Intermediate Zone" },
    { value: "Wet Zone - Tropical Rainforest", label: "🌴 Wet Zone - Tropical Rainforest" },
    { value: "Wet Zone - Tropical Monsoon", label: "🌧️ Wet Zone - Tropical Monsoon" },
    { value: "Hill Country - Temperate", label: "⛰️ Hill Country - Temperate" },
    { value: "Hill Country - Montane", label: "🏔️ Hill Country - Montane" },
    { value: "Coastal - Tropical", label: "🏖️ Coastal - Tropical" },
    { value: "Coastal - Humid", label: "🌊 Coastal - Humid" }
  ];

  // Category options
  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "Hotels", label: "Hotels" },
    { value: "Apartments", label: "Apartments" },
    { value: "Resorts", label: "Resorts" },
    { value: "Villas", label: "Villas" },
    { value: "Guest Houses", label: "Guest Houses" },
    { value: "Boutique Hotels", label: "Boutique Hotels" },
    { value: "Hostels", label: "Hostels" },
    { value: "Lodges", label: "Lodges" },
    { value: "Bungalows", label: "Bungalows" },
    { value: "Homestays", label: "Homestays" }
  ];

  // Load provinces data
  useEffect(() => {
    setProvincesData(provincesAndDistricts);
  }, []);

  // Fetch hotels
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.climate) params.append('climate', filters.climate);
        if (filters.province) params.append('province', filters.province);
        if (filters.city) params.append('city', filters.city);
        params.append('page', filters.page);
        params.append('limit', 12);

        const response = await fetch(`/api/hotels-accommodations/browse?${params}`);
        const data = await response.json();

        if (data.success) {
          setHotels(data.data);
          setPagination(data.pagination);
          setSearchParams(params);
        } else {
          setError(data.message || 'Failed to load hotels');
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setError('Failed to load hotels');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [filters, setSearchParams]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filter changes
      ...(name === 'province' && { city: '' }) // Reset city when province changes
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      category: '',
      climate: '',
      province: '',
      city: '',
      page: 1
    });
  };

  const availableCities = filters.province ? provincesData[filters.province] || [] : [];

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading && hotels.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Building2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            Hotels & Accommodations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover the perfect place to stay in Sri Lanka
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Climate Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Climate
              </label>
              <select
                name="climate"
                value={filters.climate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {climateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesData).map(province => (
                  <option key={province} value={province}>
                    {province}
                  </option>
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Cities</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Found <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> hotels
          </p>
        </div>

        {/* Hotels Grid */}
        {hotels.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {hotels.map(hotel => (
                <div
                  key={hotel._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {hotel.images && hotel.images.length > 0 ? (
                      <img
                        src={hotel.images[0].url}
                        alt={hotel.hotelName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Building2 className="w-12 h-12 text-gray-400" />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {hotel.category}
                    </div>

                    {/* Star Rating Badge */}
                    {hotel.isHaveStars && hotel.howManyStars && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {hotel.howManyStars} Star
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {hotel.hotelName}
                    </h3>

                    {/* Climate */}
                    {hotel.climate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {hotel.climate}
                      </p>
                    )}

                    {/* Location */}
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.location.city}, {hotel.location.province}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {hotel.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      {renderStars(Math.round(hotel.averageRating || 0))}
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {(hotel.averageRating || 0).toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({hotel.totalReviews || 0} {hotel.totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/hotels-accommodations/${hotel._id}`)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {[...Array(pagination.pages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === pagination.pages ||
                    (pageNumber >= filters.page - 1 && pageNumber <= filters.page + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          filters.page === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === filters.page - 2 ||
                    pageNumber === filters.page + 2
                  ) {
                    return <span key={pageNumber} className="px-2 text-gray-500">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === pagination.pages}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No hotels found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelsAccommodationsBrowse;

