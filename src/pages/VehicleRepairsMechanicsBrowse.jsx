import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Loader,
  AlertCircle,
  Star,
  Award,
  Briefcase,
  Eye
} from 'lucide-react';
import { vehicleRepairsMechanicsAPI } from '../config/api';

const VehicleRepairsMechanicsBrowse = () => {
  const navigate = useNavigate();
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});

  // Filter states
  const [filters, setFilters] = useState({
    province: '',
    city: '',
    specialization: '',
    category: '',
    search: ''
  });

  // Fetch provinces and mechanics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(''); // Clear any previous errors
        const provincesRes = await vehicleRepairsMechanicsAPI.getProvinces();
        if (provincesRes.data && provincesRes.data.data) {
          setProvincesData(provincesRes.data.data);
        }
        await fetchMechanics();
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load provinces');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch mechanics with filters
  const fetchMechanics = async (filterParams = filters) => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      const params = {};
      if (filterParams.province) params.province = filterParams.province;
      if (filterParams.city) params.city = filterParams.city;
      if (filterParams.specialization) params.specialization = filterParams.specialization;
      if (filterParams.category) params.category = filterParams.category;
      if (filterParams.search) params.search = filterParams.search;

      const response = await vehicleRepairsMechanicsAPI.browseMechanics(params);
      if (response.data && response.data.data) {
        setMechanics(response.data.data);
        setError(''); // Clear error on success
      }
    } catch (err) {
      console.error('Error fetching mechanics:', err);
      setError('Failed to load mechanics');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'province') {
      newFilters.city = ''; // Reset city when province changes
    }
    setFilters(newFilters);
    fetchMechanics(newFilters);
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, search: value });
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMechanics(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Get unique specializations and categories
  const uniqueSpecializations = [...new Set(mechanics.map(m => m.specialization))];
  const uniqueCategories = [...new Set(mechanics.map(m => m.category))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Vehicle Repairs & Mechanics</h1>
          <p className="text-gray-600 dark:text-gray-400">Find professional mechanics and repair services in your area</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialization, or description..."
              value={filters.search}
              onChange={handleSearch}
              className="flex-1 outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Province Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Province</label>
              <select
                value={filters.province}
                onChange={(e) => handleFilterChange('province', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesData).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Cities</option>
                {filters.province && provincesData[filters.province]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Specialization Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialization</label>
              <select
                value={filters.specialization}
                onChange={(e) => handleFilterChange('specialization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Specializations</option>
                {uniqueSpecializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ province: '', city: '', specialization: '', category: '', search: '' });
                  fetchMechanics({ province: '', city: '', specialization: '', category: '', search: '' });
                }}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Mechanics Grid */}
        {!loading && (
          <>
            {mechanics.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No mechanics found matching your criteria</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Found {mechanics.length} mechanic(s)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mechanics.map((mechanic) => (
                    <div
                      key={mechanic._id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {/* Image */}
                      {mechanic.images && mechanic.images.length > 0 && (
                        <img
                          src={mechanic.images[0].url}
                          alt={mechanic.name}
                          className="w-full h-48 object-cover"
                        />
                      )}

                      {/* Content */}
                      <div className="p-6">
                        {/* Avatar and Name */}
                        <div className="flex items-start space-x-4 mb-4">
                          <img
                            src={mechanic.avatar?.url}
                            alt={mechanic.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{mechanic.name}</h3>
                            <p className="text-sm text-blue-600 dark:text-blue-400">{mechanic.specialization}</p>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-2 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(mechanic.averageRating || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {mechanic.averageRating || 'No ratings'} ({mechanic.totalReviews || 0})
                          </span>
                        </div>

                        {/* Quick Info */}
                        <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{mechanic.category}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4" />
                            <span>{mechanic.experience} years experience</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{mechanic.location?.city}, {mechanic.location?.province}</span>
                          </div>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => navigate(`/vehicle-repairs-mechanics/${mechanic._id}`)}
                          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleRepairsMechanicsBrowse;

