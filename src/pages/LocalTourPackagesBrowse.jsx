import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star, Loader, MapPin, Users, DollarSign, Eye, ArrowLeft, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const LocalTourPackagesBrowse = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});

  // Get destination info from URL params
  const fromDestination = searchParams.get('fromDestination') || '';
  const destinationName = searchParams.get('destinationName') || '';
  const cityFromUrl = searchParams.get('city') || '';

  const [filters, setFilters] = useState({
    province: searchParams.get('province') || '',
    city: cityFromUrl,
    adventureType: '',
    categoryType: 'local_tour_packages'
  });

  const adventureTypes = [
    'Beach', 'Mountain', 'Cultural', 'Wildlife', 'Adventure Sports',
    'Historical', 'Religious', 'Nature', 'Urban', 'Eco-Tourism',
    'Food & Culinary', 'Photography'
  ];

  // Fetch provinces and packages on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provinces
        const provincesRes = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/local-tour-package/provinces');
        const provincesData = await provincesRes.json();
        if (provincesData.success) {
          setProvincesData(provincesData.data);
        }

        // Fetch packages
        await fetchPackages();
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load packages');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch packages with filters
  const fetchPackages = async (filterParams = filters) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filterParams.province) queryParams.append('province', filterParams.province);
      if (filterParams.city) queryParams.append('city', filterParams.city);
      if (filterParams.adventureType) queryParams.append('adventureType', filterParams.adventureType);
      if (filterParams.categoryType) queryParams.append('categoryType', filterParams.categoryType);

      const response = await fetch(`${API_BASE_URL}/local-tour-package/browse/all?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        // Shuffle packages randomly
        const shuffledPackages = [...data.data].sort(() => Math.random() - 0.5);
        setPackages(shuffledPackages);
        setError('');
      } else {
        setError('Failed to load packages');
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages');
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
    fetchPackages(newFilters);
  };

  // Get available cities for selected province
  const availableCities = filters.province ? provincesData[filters.province] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Local Tour Packages{cityFromUrl && ` - ${cityFromUrl}`}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {fromDestination ? `Discover amazing tour packages in ${destinationName}` : 'Discover amazing tour packages across Sri Lanka'}
          </p>
          {fromDestination && (
            <button
              onClick={() => navigate(`/destinations/${fromDestination}`)}
              className="mt-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to {destinationName}</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Filters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

            {/* Adventure Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adventure Type
              </label>
              <select
                name="adventureType"
                value={filters.adventureType}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Types</option>
                {adventureTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({
                    province: '',
                    city: '',
                    adventureType: '',
                    categoryType: 'local_tour_packages'
                  });
                  fetchPackages({
                    province: '',
                    city: '',
                    adventureType: '',
                    categoryType: 'local_tour_packages'
                  });
                }}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Packages Grid */}
        {!loading && packages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {packages.map(pkg => (
              <div
                key={pkg._id}
                className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
              >
                {/* Image */}
                {pkg.images && pkg.images.length > 0 && (
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                    <img
                      src={pkg.images[0].url}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Rating Badge Overlay */}
                    <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-lg px-2.5 py-1.5 shadow-lg flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                        {pkg.averageRating.toFixed(1)}
                      </span>
                    </div>
                    {/* Adventure Type Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        <Calendar className="w-3 h-3" />
                        {pkg.adventureType}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content - Flex grow to fill space */}
                <div className="flex flex-col flex-grow p-4 sm:p-5">
                  {/* Title - Fixed height with line clamp */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">
                    {pkg.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{pkg.location.city}, {pkg.location.province}</span>
                  </div>

                  {/* Reviews count */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>({pkg.totalReviews} {pkg.totalReviews === 1 ? 'review' : 'reviews'})</span>
                  </div>

                  {/* Spacer to push bottom content down */}
                  <div className="flex-grow"></div>

                  {/* Info Row */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Capacity</span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                          {pkg.pax.min}-{pkg.pax.max}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                          LKR {pkg.price.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/local-tour-package/${pkg._id}`)}
                    className="w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm sm:text-base">View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && packages.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="max-w-md mx-auto">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-2">
                No tour packages found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Try adjusting your filters to see more results
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalTourPackagesBrowse;

