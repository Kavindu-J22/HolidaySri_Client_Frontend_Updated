import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Loader } from 'lucide-react';

const OtherItemsBrowse = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const [filters, setFilters] = useState({
    specialization: '',
    category: '',
    province: '',
    city: '',
    searchTerm: ''
  });

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    setProvincesData(provincesAndDistricts);
    fetchItems();
  }, [filters, page]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.province) params.append('province', filters.province);
      if (filters.city) params.append('city', filters.city);
      params.append('page', page);
      params.append('limit', 12);

      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/other-items/browse?${params}`);
      const data = await response.json();

      if (data.success) {
        let filteredItems = data.data;

        // Client-side filtering for specialization and search term
        if (filters.specialization) {
          filteredItems = filteredItems.filter(item =>
            item.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
          );
        }

        if (filters.searchTerm) {
          filteredItems = filteredItems.filter(item =>
            item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
          );
        }

        setItems(filteredItems);
        setPagination(data.pagination);
        setError('');
      } else {
        setError('Failed to load items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Error loading items');
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
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
    setPage(1);
  };

  const handleViewItem = (itemId) => {
    navigate(`/other-items/${itemId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Other Items
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Browse and discover items for sale
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search items by name or description..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                placeholder="Filter by specialization..."
                value={filters.specialization}
                onChange={handleFilterChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                placeholder="Filter by category..."
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Province
              </label>
              <select
                name="province"
                value={filters.province}
                onChange={handleFilterChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesData).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                City
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!filters.province}
              >
                <option value="">All Cities</option>
                {filters.province && provincesData[filters.province]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
              No items found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <>
            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
              {items.map(item => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative h-44 sm:h-48 lg:h-52 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm sm:text-base text-gray-400">
                        No Image
                      </div>
                    )}
                    {item.available && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md">
                        Available
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 min-h-[3rem]">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                      {item.specialization}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-3 line-clamp-1">
                      {item.category} • {item.city}, {item.province}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-3 flex-wrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              i < Math.round(item.averageRating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {item.averageRating || 'N/A'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({item.totalReviews || 0} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4 flex-grow">
                      LKR {item.price.toLocaleString()}
                    </p>

                    {/* View Button */}
                    <button
                      onClick={() => handleViewItem(item._id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 sm:py-2.5 px-4 text-sm sm:text-base rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex-shrink-0"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
                >
                  Previous
                </button>
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 font-medium ${
                      page === i + 1
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                  disabled={page === pagination.pages}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
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

export default OtherItemsBrowse;

