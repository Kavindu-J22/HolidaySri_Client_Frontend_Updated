import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Loader,
  AlertCircle,
  Filter,
  X,
  Eye
} from 'lucide-react';

const ExpertDoctorsBrowse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expertDoctors, setExpertDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [provincesData, setProvincesData] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    specialization: '',
    category: '',
    province: '',
    city: ''
  });

  // Fetch provinces and expert doctors
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provinces
        const provincesRes = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/expert-doctors/provinces');
        const provincesData = await provincesRes.json();
        if (provincesData.success) {
          setProvincesData(provincesData.data);
        }

        // Fetch expert doctors
        const doctorsRes = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/expert-doctors/browse');
        const doctorsData = await doctorsRes.json();

        if (doctorsData.success) {
          setExpertDoctors(doctorsData.data);
          setFilteredDoctors(doctorsData.data);
        } else {
          setError(doctorsData.message || 'Failed to load expert doctors');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load expert doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = expertDoctors;

    if (filters.specialization) {
      filtered = filtered.filter(doctor =>
        doctor.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(doctor =>
        doctor.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.province) {
      filtered = filtered.filter(doctor =>
        doctor.location.province === filters.province
      );
    }

    if (filters.city) {
      filtered = filtered.filter(doctor =>
        doctor.location.city === filters.city
      );
    }

    setFilteredDoctors(filtered);
  }, [filters, expertDoctors]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      // Reset city when province changes
      ...(name === 'province' && { city: '' })
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      specialization: '',
      category: '',
      province: '',
      city: ''
    });
  };

  // Get available cities for selected province
  const availableCities = filters.province ? provincesData[filters.province] || [] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Meet Expert Doctors
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Find and connect with qualified medical professionals
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors md:hidden w-full sm:w-auto justify-center font-semibold shadow-md"
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className={`${showFilters ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
                {(filters.specialization || filters.category || filters.province || filters.city) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Specialization */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={filters.specialization}
                    onChange={handleFilterChange}
                    placeholder="e.g., Neurologist"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    placeholder="e.g., Brain Specialist"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Province
                  </label>
                  <select
                    name="province"
                    value={filters.province}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                  >
                    <option value="">All Provinces</option>
                    {Object.keys(provincesData).map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    City
                  </label>
                  <select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    disabled={!filters.province}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <option value="">All Cities</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 font-medium">
            Found {filteredDoctors.length} expert doctor{filteredDoctors.length !== 1 ? 's' : ''}
          </p>

          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredDoctors.map(doctor => (
                <div
                  key={doctor._id}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100 dark:border-gray-700"
                >
                  {/* Avatar */}
                  <div className="relative h-48 sm:h-56 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <img
                      src={doctor.avatar.url}
                      alt={doctor.name}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-500"
                    />
                    {doctor.engagement?.totalReviews > 0 && (
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center space-x-1 shadow-lg">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-semibold">{doctor.engagement.viewCount || 0}</span>
                      </div>
                    )}
                    {doctor.available && (
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Available
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mb-1.5 font-semibold line-clamp-1">
                      {doctor.specialization}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">
                      {doctor.category}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{doctor.location.city}, {doctor.location.province}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4 flex-grow">
                      <div className="flex gap-0.5 sm:gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              i < Math.round(doctor.engagement?.averageRating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                        {doctor.engagement?.averageRating ? doctor.engagement.averageRating.toFixed(1) : '0.0'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({doctor.engagement?.totalReviews || 0})
                      </span>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/expert-doctors/${doctor._id}`)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 sm:py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] text-sm sm:text-base"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
                No expert doctors found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertDoctorsBrowse;

