import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO/SEO';
import {
  Search,
  MapPin,
  Truck,
  DollarSign,
  Star,
  Loader,
  AlertCircle,
  Eye,
  Filter,
  ArrowLeft,
  Users,
  UserCheck,
  X
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const VehicleRentalsHireBrowse = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provinces, setProvinces] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Get destination info from URL params
  const fromDestination = searchParams.get('fromDestination') || '';
  const destinationName = searchParams.get('destinationName') || '';
  const cityFromUrl = searchParams.get('city') || '';

  // Filter state
  const [filters, setFilters] = useState({
    vehicleCategory: '',
    serviceCategory: '',
    province: searchParams.get('province') || '',
    city: cityFromUrl,
    search: '',
    vehicleStatus: '',
    driverStatus: '',
    driverGender: ''
  });

  const vehicleCategories = ['Three Wheeler', 'Car', 'Van', 'Bus', 'Truck', 'Motorcycle', 'Bicycle', 'Other'];
  const serviceCategories = ['Hire', 'Rent', 'Taxi', 'Tour', 'Delivery'];
  const vehicleStatusOptions = ['Available', 'Unavailable'];
  const driverStatusOptions = ['Available', 'Unavailable', 'On Demand'];
  const driverGenderOptions = ['Male Driver', 'Female Driver', 'Any'];

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://holidaysri-backend-9xm4.onrender.com/api/vehicle-rentals-hire/provinces');
        if (response.data.success) {
          setProvinces(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching provinces:', err);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (filters.vehicleCategory) params.append('vehicleCategory', filters.vehicleCategory);
        if (filters.serviceCategory) params.append('serviceCategory', filters.serviceCategory);
        if (filters.province) params.append('province', filters.province);
        if (filters.city) params.append('city', filters.city);
        if (filters.search) params.append('search', filters.search);
        if (filters.vehicleStatus) params.append('vehicleStatus', filters.vehicleStatus);
        if (filters.driverStatus) params.append('driverStatus', filters.driverStatus);
        if (filters.driverGender) params.append('driverGender', filters.driverGender);

        const response = await axios.get(`${API_BASE_URL}/vehicle-rentals-hire/browse?${params}`);
        if (response.data.success) {
          setListings(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { city: '' }) // Reset city when province changes
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      vehicleCategory: '',
      serviceCategory: '',
      province: '',
      city: '',
      search: '',
      driverStatus: '',
      driverGender: ''
    });
  };

  return (
    <>
      <SEO
        title="Vehicle Rentals & Hire Services in Sri Lanka | Car Rentals, Vans & Drivers - Holidaysri"
        description="Rent vehicles in Sri Lanka - cars, vans, buses, tuk-tuks with or without drivers. Find reliable vehicle rental services for your Sri Lankan journey at the best rates."
        keywords="Sri Lanka vehicle rentals, car rental Sri Lanka, van hire Sri Lanka, vehicle hire, rent a car Sri Lanka, driver hire, tuk-tuk rental, bus rental, self-drive rentals"
        canonical="https://www.holidaysri.com/ads/tourism/vehicle-rentals-hire"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Vehicle Rentals & Hire Services{cityFromUrl && ` - ${cityFromUrl}`}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {fromDestination ? `Find the perfect vehicle rental service in ${destinationName}` : 'Find the perfect vehicle rental service for your needs'}
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

            {/* Find a Driver Button */}
            <button
              onClick={() => navigate('/professional-drivers')}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
            >
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Find a Driver</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name or description..."
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'fixed inset-0 z-50 bg-black bg-opacity-50 lg:relative lg:bg-transparent' : 'hidden'} lg:block lg:col-span-1`}>
            <div className={`${showFilters ? 'fixed right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto' : ''} bg-white dark:bg-gray-800 rounded-none lg:rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-8`}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Vehicle Category */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Vehicle Category
                  </label>
                  <select
                    name="vehicleCategory"
                    value={filters.vehicleCategory}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Categories</option>
                    {vehicleCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Service Category */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Service Type
                  </label>
                  <select
                    name="serviceCategory"
                    value={filters.serviceCategory}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Services</option>
                    {serviceCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Vehicle Status */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Vehicle Status
                  </label>
                  <select
                    name="vehicleStatus"
                    value={filters.vehicleStatus}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Status</option>
                    {vehicleStatusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Driver Status */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Driver Status
                  </label>
                  <select
                    name="driverStatus"
                    value={filters.driverStatus}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Status</option>
                    {driverStatusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Driver Gender */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Driver Gender
                  </label>
                  <select
                    name="driverGender"
                    value={filters.driverGender}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Genders</option>
                    {driverGenderOptions.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>

                {/* Province */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Province
                  </label>
                  <select
                    name="province"
                    value={filters.province}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Provinces</option>
                    {Object.keys(provinces).map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    City
                  </label>
                  <select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    disabled={!filters.province}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                  >
                    <option value="">All Cities</option>
                    {filters.province && provinces[filters.province]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetFilters}
                  className="w-full mt-4 sm:mt-6 px-4 py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Listings */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-4 sm:mb-6 flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold text-sm sm:text-base shadow-md"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              Filters
            </button>

            {error && (
              <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12 sm:py-16">
                <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-600" />
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4">
                <Truck className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No listings found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Try adjusting your filters to find what you're looking for
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {listings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                  >
                    {/* Image */}
                    {listing.images && listing.images.length > 0 && (
                      <div className="relative h-44 sm:h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img
                          src={listing.images[0].url}
                          alt={listing.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        {/* Badge for Vehicle Status */}
                        {listing.vehicleStatus && (
                          <div className="absolute top-2 left-2">
                            <span className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                              listing.vehicleStatus === 'Available'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                            }`}>
                              <Truck className="w-3 h-3" />
                              {listing.vehicleStatus}
                            </span>
                          </div>
                        )}
                        {/* Badge for Driver Status */}
                        {listing.driverStatus && (
                          <div className="absolute top-2 right-2">
                            <span className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                              listing.driverStatus === 'Available'
                                ? 'bg-green-500 text-white'
                                : listing.driverStatus === 'On Demand'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-500 text-white'
                            }`}>
                              <UserCheck className="w-3 h-3" />
                              {listing.driverStatus}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4 sm:p-5 flex flex-col flex-grow">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">
                        {listing.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                i < Math.floor(listing.averageRating || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                          {listing.averageRating ? listing.averageRating.toFixed(1) : 'New'}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          ({listing.totalReviews || 0})
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-grow">
                        <div className="flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{listing.vehicleCategory} • {listing.serviceCategory}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{listing.city}, {listing.province}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>Rs. {listing.pricePerKm}/km</span>
                        </div>
                        {listing.driverGender && (
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>{listing.driverGender}</span>
                          </div>
                        )}
                        {listing.capacity && (
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>Capacity: {listing.capacity} passengers</span>
                          </div>
                        )}
                      </div>

                      {/* View Button */}
                      <button
                        onClick={() => navigate(`/vehicle-rentals-hire/${listing._id}`)}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 sm:py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-md hover:shadow-lg mt-auto"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default VehicleRentalsHireBrowse;

