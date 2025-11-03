import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Loader, AlertCircle, Star, MapPin, Gift } from 'lucide-react';

const ExclusiveGiftPacksBrowse = () => {
  const navigate = useNavigate();
  const [giftPacks, setGiftPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    specialization: '',
    category: '',
    city: '',
    province: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
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

  const specializationOptions = [
    'Relaxation Package',
    'Luxury Package',
    'Adventure Package',
    'Romance Package',
    'Wellness Package',
    'Family Package',
    'Corporate Package',
    'Custom Package'
  ];

  const categoryOptions = [
    'Wellness',
    'Romance',
    'Adventure',
    'Spa & Relaxation',
    'Travel',
    'Dining',
    'Entertainment',
    'Lifestyle'
  ];

  useEffect(() => {
    fetchGiftPacks();
  }, []);

  const fetchGiftPacks = async (page = 1, search = searchTerm, currentFilters = filters, useRandom = true) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 12);
      params.append('random', useRandom);

      if (search.trim()) params.append('search', search.trim());
      if (currentFilters.specialization) params.append('specialization', currentFilters.specialization);
      if (currentFilters.category) params.append('category', currentFilters.category);
      if (currentFilters.city) params.append('city', currentFilters.city);
      if (currentFilters.province) params.append('province', currentFilters.province);

      const response = await fetch(`/api/exclusive-gift-packs/browse?${params}`);
      if (!response.ok) throw new Error('Failed to fetch gift packs');

      const data = await response.json();
      setGiftPacks(data.data || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error fetching gift packs:', error);
      setError('Failed to load gift packs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    fetchGiftPacks(1, searchTerm, filters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    if (name === 'province') {
      newFilters.city = '';
    }
    setFilters(newFilters);
    setPagination({ ...pagination, currentPage: 1 });
    fetchGiftPacks(1, searchTerm, newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      specialization: '',
      category: '',
      city: '',
      province: ''
    });
    setSearchTerm('');
    setPagination({ ...pagination, currentPage: 1 });
    fetchGiftPacks(1, '', {});
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Exclusive Gift Packs</h1>
          </div>
          <p className="text-blue-100">Discover premium gift packages for every occasion</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search gift packs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialization
                </label>
                <select
                  name="specialization"
                  value={filters.specialization}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Specializations</option>
                  {specializationOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Province
                </label>
                <select
                  name="province"
                  value={filters.province}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Provinces</option>
                  {Object.keys(provincesAndDistricts).map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  disabled={!filters.province}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  <option value="">All Cities</option>
                  {filters.province && provincesAndDistricts[filters.province]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Clear Filters
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : giftPacks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {giftPacks.map(pack => (
                <div
                  key={pack._id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  {pack.images && pack.images.length > 0 && (
                    <div className="h-48 overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
                      <img
                        src={pack.images[0].url}
                        alt={pack.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                      {/* Rating Badge */}
                      {pack.averageRating && (
                        <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-bold text-sm">{pack.averageRating}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {pack.name}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{pack.specialization}</p>

                    <div className="flex items-center justify-between mb-3">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        Rs. {pack.price.toLocaleString()}
                      </p>
                      {pack.available && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                          Available
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{pack.location.city}, {pack.location.province}</span>
                    </div>

                    <button
                      onClick={() => navigate(`/exclusive-gift-packs/${pack._id}`)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => {
                      fetchGiftPacks(page, searchTerm, filters);
                      window.scrollTo(0, 0);
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === pagination.currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No gift packs found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExclusiveGiftPacksBrowse;

