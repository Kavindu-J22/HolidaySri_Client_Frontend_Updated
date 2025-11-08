import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Car,
  DollarSign,
  Star,
  Loader,
  AlertCircle,
  Filter,
  X,
  Calendar,
  Users,
  Clock
} from 'lucide-react';

const LiveRidesCarpoolingBrowse = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    fromLocation: '',
    toLocation: '',
    city: '',
    province: '',
    minPrice: '',
    maxPrice: '',
    rideDate: ''
  });

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
    fetchRides();
  }, [filters]);

  const fetchRides = async () => {
    setLoading(true);
    setError('');

    try {
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.fromLocation) queryParams.append('fromLocation', filters.fromLocation);
      if (filters.toLocation) queryParams.append('toLocation', filters.toLocation);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.province) queryParams.append('province', filters.province);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.rideDate) queryParams.append('rideDate', filters.rideDate);

      const response = await fetch(`/api/live-rides-carpooling/browse?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        // Shuffle rides randomly
        const shuffled = [...data.data].sort(() => Math.random() - 0.5);
        setRides(shuffled);
      } else {
        setError('Failed to load rides');
      }
    } catch (err) {
      console.error('Error fetching rides:', err);
      setError('Failed to load rides');
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

  const clearFilters = () => {
    setFilters({
      search: '',
      fromLocation: '',
      toLocation: '',
      city: '',
      province: '',
      minPrice: '',
      maxPrice: '',
      rideDate: ''
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleViewRide = (rideId) => {
    navigate(`/live-rides-carpooling/${rideId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Live Rides & Carpooling
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find and share rides across Sri Lanka
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by vehicle, owner, or description..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* From Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    From Location
                  </label>
                  <input
                    type="text"
                    name="fromLocation"
                    value={filters.fromLocation}
                    onChange={handleFilterChange}
                    placeholder="e.g., Colombo"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* To Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    To Location
                  </label>
                  <input
                    type="text"
                    name="toLocation"
                    value={filters.toLocation}
                    onChange={handleFilterChange}
                    placeholder="e.g., Kandy"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Province
                  </label>
                  <select
                    name="province"
                    value={filters.province}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Provinces</option>
                    {Object.keys(provincesAndDistricts).map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    disabled={!filters.province}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                  >
                    <option value="">All Cities</option>
                    {filters.province && provincesAndDistricts[filters.province]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Price Range (LKR)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Ride Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ride Date
                  </label>
                  <input
                    type="date"
                    name="rideDate"
                    value={filters.rideDate}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Rides Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : rides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {rides.map(ride => (
                  <div
                    key={ride._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105"
                  >
                    {/* Card Image */}
                    <div className="relative h-48">
                      <img
                        src={ride.images?.vehicleImage?.url || '/placeholder-car.jpg'}
                        alt={`${ride.vehicleBrand} ${ride.vehicleNumber}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        LKR {ride.pricePerSeat}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs">
                        {ride.status}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Route */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold text-lg mb-1">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          {ride.rideRoute.from}
                        </div>
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold text-lg">
                          <MapPin className="w-5 h-5 text-green-600" />
                          {ride.rideRoute.to}
                        </div>
                      </div>

                      {/* Vehicle Info */}
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
                        <Car className="w-4 h-4" />
                        <span>{ride.vehicleBrand} - {ride.vehicleNumber}</span>
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(ride.rideDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{ride.rideTime}</span>
                        </div>
                      </div>

                      {/* Available Seats */}
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
                        <Users className="w-4 h-4" />
                        <span>{ride.availablePassengerCount} / {ride.maxPassengerCount} seats available</span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {renderStars(Math.round(ride.averageRating || 0))}
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ({ride.totalReviews || 0})
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {ride.approximateTimeToRide}
                        </div>
                      </div>

                      {/* View Button */}
                      <button
                        onClick={() => handleViewRide(ride._id)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                      >
                        View More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Rides Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRidesCarpoolingBrowse;

