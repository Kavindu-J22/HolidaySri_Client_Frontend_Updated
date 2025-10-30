import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  Loader,
  AlertCircle,
  Star,
  Eye,
  Filter,
  X
} from 'lucide-react';
import axios from 'axios';

const RentLandCampingParkingBrowse = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    province: '',
    city: '',
    search: ''
  });

  const [provinces, setProvinces] = useState({});
  const [cities, setCities] = useState([]);

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

  // Fetch listings on mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('/api/rent-land-camping-parking/browse');
        setListings(response.data.data);
        setFilteredListings(response.data.data);
        setProvinces(provincesAndDistricts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings');
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Update cities when province changes
  useEffect(() => {
    if (filters.province && provincesAndDistricts[filters.province]) {
      setCities(provincesAndDistricts[filters.province]);
    } else {
      setCities([]);
    }
  }, [filters.province]);

  // Apply filters
  useEffect(() => {
    let filtered = listings;

    if (filters.category) {
      filtered = filtered.filter(listing =>
        listing.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.province) {
      filtered = filtered.filter(listing =>
        listing.location.province === filters.province
      );
    }

    if (filters.city) {
      filtered = filtered.filter(listing =>
        listing.location.city === filters.city
      );
    }

    if (filters.search) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        listing.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  }, [filters, listings]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      category: '',
      province: '',
      city: '',
      search: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Rent Land for Camping & Parking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover amazing camping and parking spaces across Sri Lanka
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by title or description..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition mb-4"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    placeholder="e.g., RV Parking"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Province
                  </label>
                  <select
                    name="province"
                    value={filters.province}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Provinces</option>
                    {Object.keys(provinces).map(province => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    disabled={!filters.province}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredListings.length}</span> listings
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <div
                key={listing._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-lg px-3 py-1 flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {listing.averageRating || 'N/A'}
                    </span>
                  </div>

                  {/* View Count */}
                  <div className="absolute bottom-3 left-3 bg-black/50 text-white rounded-lg px-3 py-1 flex items-center gap-1 text-sm">
                    <Eye className="w-4 h-4" />
                    {listing.viewCount || 0}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {listing.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{listing.location.city}, {listing.location.province}</span>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {listing.description}
                  </p>

                  {/* Category */}
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                      {listing.category}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Daily</p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          LKR {listing.price?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Weekend</p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          LKR {listing.weekendPrice?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Count */}
                  <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {listing.totalReviews || 0} reviews
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/rent-land-camping-parking/${listing._id}`)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No listings found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentLandCampingParkingBrowse;

