import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Loader,
  AlertCircle,
  Filter,
  X
} from 'lucide-react';

const JewelryGemSellersBrowse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [provincesData, setProvincesData] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    specialization: '',
    category: '',
    province: '',
    city: ''
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });

  // Provinces and districts
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

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setProvincesData(provincesAndDistricts);
    fetchSellers();
  }, []);

  // Fetch sellers
  const fetchSellers = async (page = 1, filterParams = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 12);

      if (filterParams.specialization) params.append('specialization', filterParams.specialization);
      if (filterParams.category) params.append('category', filterParams.category);
      if (filterParams.province) params.append('province', filterParams.province);
      if (filterParams.city) params.append('city', filterParams.city);
      if (filterParams.search) params.append('search', filterParams.search);

      const response = await fetch(`/api/jewelry-gem-sellers/browse?${params}`);
      if (!response.ok) throw new Error('Failed to fetch sellers');

      const data = await response.json();
      setSellers(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error('Error fetching sellers:', err);
      setError('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    fetchSellers(1, { ...filters, search: searchTerm });
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { city: '' })
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    setPagination({ ...pagination, currentPage: 1 });
    fetchSellers(1, filters);
    setShowFilters(false);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      specialization: '',
      category: '',
      province: '',
      city: ''
    });
    setSearchTerm('');
    setPagination({ ...pagination, currentPage: 1 });
    fetchSellers(1, {});
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, currentPage: newPage });
    fetchSellers(newPage, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Jewelry & Gem Sellers</h1>
          <p className="text-amber-100 text-lg">Discover premium jewelry and gemstone professionals</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, specialization, category..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={filters.specialization}
                  onChange={handleFilterChange}
                  placeholder="e.g., Diamond & Gold"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  placeholder="e.g., Diamond"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Provinces</option>
                  {Object.keys(provincesData).map(province => (
                    <option key={province} value={province}>{province}</option>
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  <option value="">All Cities</option>
                  {filters.province && provincesData[filters.province]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-12 h-12 text-amber-600 animate-spin" />
          </div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No sellers found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Sellers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {sellers.map(seller => (
                <div
                  key={seller._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 h-32 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 -mt-12 relative z-10">
                    {/* Avatar/Image */}
                    {seller.images && seller.images.length > 0 && (
                      <img
                        src={seller.images[0].url}
                        alt={seller.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 mb-4"
                      />
                    )}

                    {/* Name and Rating */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{seller.name}</h3>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(seller.averageRating || 0)
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {seller.averageRating || 'N/A'}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        ({seller.totalReviews || 0})
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Specialization:</span> {seller.specialization}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Category:</span> {seller.category}
                      </p>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <span>{seller.city}, {seller.province}</span>
                      </div>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/jewelry-gem-sellers/${seller._id}`)}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  Previous
                </button>

                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg transition ${
                      pagination.currentPage === i + 1
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JewelryGemSellersBrowse;

