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
        const response = await fetch('/api/creative-photographers/browse');
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
        const provincesResponse = await fetch('/api/creative-photographers/provinces');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Creative Photographers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover talented photographers for your special moments
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, specialization, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Province Filter */}
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        ) : filteredPhotographers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No photographers found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotographers.map(photographer => (
              <div
                key={photographer._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/creative-photographers/${photographer._id}`)}
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                  <img
                    src={photographer.avatar?.url}
                    alt={photographer.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {photographer.averageRating?.toFixed(1) || '0'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {photographer.name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                    {photographer.specialization}
                  </p>

                  {/* Category */}
                  <div className="mb-3">
                    <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                      {photographer.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>{photographer.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{photographer.city}, {photographer.province}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    {photographer.available ? (
                      <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                        ✓ Available
                      </span>
                    ) : (
                      <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">
                        Not Available
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/creative-photographers/${photographer._id}`);
                      }}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${photographer.contact}`;
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredPhotographers.length > 0 && (
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            <p>Showing {filteredPhotographers.length} of {photographers.length} photographers</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativePhotographersBrowse;

