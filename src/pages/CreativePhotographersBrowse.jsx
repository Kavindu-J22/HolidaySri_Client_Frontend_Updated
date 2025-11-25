import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Award, Star, Phone, Search, X } from 'lucide-react';

const CreativePhotographersBrowse = () => {
  const navigate = useNavigate();
  const [photographers, setPhotographers] = useState([]);
  const [filteredPhotographers, setFilteredPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [provincesData, setProvincesData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch photographers
        const response = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/creative-photographers/browse');
        const data = await response.json();
        if (data.success) {
          // Shuffle photographers randomly
          const shuffled = [...data.data].sort(() => Math.random() - 0.5);
          setPhotographers(shuffled);
          setFilteredPhotographers(shuffled);

          // Extract unique filter options
          const uniqueSpecializations = [...new Set(data.data.map(p => p.specialization))].sort();
          const uniqueCategories = [...new Set(data.data.map(p => p.category))].sort();
          setSpecializations(uniqueSpecializations);
          setCategories(uniqueCategories);
        }

        // Fetch provinces
        const provincesResponse = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/creative-photographers/provinces');
        const provincesDataResponse = await provincesResponse.json();
        if (provincesDataResponse.success) {
          setProvincesData(provincesDataResponse.data);
          setProvinces(Object.keys(provincesDataResponse.data));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load photographers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update cities when province changes
  useEffect(() => {
    if (selectedProvince && provincesData[selectedProvince]) {
      setCities(provincesData[selectedProvince]);
      setSelectedCity(''); // Reset city when province changes
    } else {
      setCities([]);
    }
  }, [selectedProvince, provincesData]);

  useEffect(() => {
    let filtered = photographers;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedProvince) {
      filtered = filtered.filter(p => p.province === selectedProvince);
    }

    if (selectedCity) {
      filtered = filtered.filter(p => p.city === selectedCity);
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(p => p.specialization === selectedSpecialization);
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredPhotographers(filtered);
  }, [searchTerm, selectedProvince, selectedCity, selectedSpecialization, selectedCategory, photographers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading photographers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Creative Photographers
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Discover talented photographers for your special moments
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="space-y-3 sm:space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, specialization, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Province Filter */}
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Provinces</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>

              {/* City Filter */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedProvince}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              {/* Specialization Filter */}
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedProvince || selectedCity || selectedSpecialization || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedProvince('');
                  setSelectedCity('');
                  setSelectedSpecialization('');
                  setSelectedCategory('');
                }}
                className="w-full px-4 py-2 text-sm sm:text-base bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-sm sm:text-base text-red-700 dark:text-red-300">{error}</p>
          </div>
        ) : filteredPhotographers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              No photographers found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPhotographers.map(photographer => (
              <div
                key={photographer._id}
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col border border-gray-100 dark:border-gray-700 transform hover:scale-105"
                onClick={() => navigate(`/creative-photographers/${photographer._id}`)}
                style={{ minHeight: '480px' }}
              >
                {/* Image */}
                <div className="relative h-48 sm:h-52 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden flex-shrink-0">
                  <img
                    src={photographer.avatar?.url}
                    alt={photographer.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white dark:bg-gray-800 px-2 sm:px-3 py-1 rounded-full shadow-lg">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                        {photographer.averageRating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {photographer.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mb-3 line-clamp-1">
                    {photographer.specialization}
                  </p>

                  {/* Category */}
                  <div className="mb-3">
                    <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
                      {photographer.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-grow">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium">{photographer.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-medium line-clamp-1">{photographer.city}, {photographer.province}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    {photographer.available ? (
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        Not Available
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/creative-photographers/${photographer._id}`);
                      }}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${photographer.contact}`;
                      }}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg"
                    >
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredPhotographers.length > 0 && (
          <div className="mt-6 sm:mt-8 text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
            <p className="font-medium">Showing {filteredPhotographers.length} of {photographers.length} photographers</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativePhotographersBrowse;

