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
import { API_BASE_URL } from '../config/api';

const HomeOfficeAccessoriesTechBrowse = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    specialization: '',
    category: '',
    city: '',
    province: ''
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });

  const categoryOptions = ['Home Office', 'Tech Gadgets', 'Accessories', 'Electronics', 'Furniture', 'Other'];
  const specializationOptions = ['Professionals', 'Retailers', 'Wholesalers', 'Manufacturers', 'Distributors'];

  useEffect(() => {
    fetchProvinces();
    fetchProducts(1, '', {});
  }, []);

  // Fetch provinces
  const fetchProvinces = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/home-office-accessories-tech/provinces`);
      if (response.ok) {
        const data = await response.json();
        setProvincesData(data.data || {});
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      setProvincesData({});
    }
  };

  // Fetch products
  const fetchProducts = async (page = 1, search = '', filterObj = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(search && { search }),
        ...(filterObj.specialization && { specialization: filterObj.specialization }),
        ...(filterObj.category && { category: filterObj.category }),
        ...(filterObj.city && { city: filterObj.city }),
        ...(filterObj.province && { province: filterObj.province })
      });

      const response = await fetch(`${API_BASE_URL}/home-office-accessories-tech/browse?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(data.data);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages
      });
      setError('');
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    fetchProducts(1, searchTerm, filters);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    if (name === 'province') {
      newFilters.city = '';
    }
    setFilters(newFilters);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setPagination({ ...pagination, currentPage: 1 });
    fetchProducts(1, searchTerm, filters);
    setShowFilters(false);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      specialization: '',
      category: '',
      city: '',
      province: ''
    });
    setSearchTerm('');
    setPagination({ ...pagination, currentPage: 1 });
    fetchProducts(1, '', {});
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchProducts(newPage, searchTerm, filters);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Home Office Accessories & Tech Gadgets
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Browse and discover quality products from trusted sellers
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-md"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Search</span>
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 lg:p-6 mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Specialization */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Specialization
                </label>
                <select
                  name="specialization"
                  value={filters.specialization}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Specializations</option>
                  {specializationOptions.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
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
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Provinces</option>
                  {provincesData && Object.keys(provincesData).map(prov => (
                    <option key={prov} value={prov}>{prov}</option>
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
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                >
                  <option value="">All Cities</option>
                  {filters.province && provincesData[filters.province]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <button
                onClick={handleApplyFilters}
                className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
              {products.map(product => (
                <div
                  key={product._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative bg-gray-100 dark:bg-gray-700 h-44 sm:h-48 lg:h-52 overflow-hidden flex-shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 lg:p-5 space-y-3 flex flex-col flex-grow">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[3rem]">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{product.category}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 flex-wrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              i < Math.round(product.averageRating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        ({product.totalReviews || 0})
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{product.city}, {product.province}</span>
                    </div>

                    {/* Price */}
                    <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 flex-grow">
                      LKR {product.price?.toLocaleString()}
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/home-office-accessories-tech/${product._id}`)}
                      className="w-full px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg flex-shrink-0"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium"
                >
                  Previous
                </button>

                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 font-medium ${
                      pagination.currentPage === i + 1
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
              No products found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeOfficeAccessoriesTechBrowse;

