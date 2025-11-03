import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FashionBeautyClothingBrowse = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    category: '',
    city: '',
    province: ''
  });

  const [filterOptions, setFilterOptions] = useState({
    specializations: [],
    categories: [],
    cities: [],
    provinces: []
  });

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.specialization) params.append('specialization', filters.specialization);
        if (filters.category) params.append('category', filters.category);
        if (filters.city) params.append('city', filters.city);
        if (filters.province) params.append('province', filters.province);
        params.append('page', page);
        params.append('limit', 12);

        const response = await axios.get(`/api/fashion-beauty-clothing/browse?${params}`);
        setItems(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setFilterOptions(response.data.filterOptions);
        setError('');
      } catch (err) {
        setError('Failed to load items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [filters, page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setFilters(prev => ({
      ...prev,
      search: value
    }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      specialization: '',
      category: '',
      city: '',
      province: ''
    });
    setPage(1);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Fashion, Beauty & Clothing</h1>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleSearch}
                placeholder="Search items..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specialization
              </label>
              <select
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All</option>
                {filterOptions.specializations?.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All</option>
                {filterOptions.categories?.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Province */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Province
              </label>
              <select
                name="province"
                value={filters.province}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All</option>
                {filterOptions.provinces?.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All</option>
                {filterOptions.cities?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleResetFilters}
            className="mt-4 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No items found</p>
          </div>
        ) : (
          <>
            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {items.map(item => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Rs. {item.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 truncate">
                      {item.name}
                    </h3>

                    <div className="mb-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">{item.specialization}</span> • {item.category}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.city}, {item.province}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                      {item.averageRating ? (
                        renderStars(item.averageRating)
                      ) : (
                        <p className="text-sm text-gray-500">No ratings yet</p>
                      )}
                    </div>

                    {/* Description Preview */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/fashion-beauty-clothing/${item._id}`)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mb-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
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

export default FashionBeautyClothingBrowse;

