import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Award, Star, Phone, Search } from 'lucide-react';

const CreativePhotographersBrowse = () => {
  const navigate = useNavigate();
  const [photographers, setPhotographers] = useState([]);
  const [filteredPhotographers, setFilteredPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch photographers
        const response = await fetch('/api/creative-photographers/browse');
        const data = await response.json();
        if (data.success) {
          setPhotographers(data.data);
          setFilteredPhotographers(data.data);
        }

        // Fetch provinces
        const provincesResponse = await fetch('/api/creative-photographers/provinces');
        const provincesData = await provincesResponse.json();
        if (provincesData.success) {
          setProvinces(Object.keys(provincesData.data));
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

    setFilteredPhotographers(filtered);
  }, [searchTerm, selectedProvince, photographers]);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

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

            {/* Clear Filters */}
            {(searchTerm || selectedProvince) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedProvince('');
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear Filters
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

                  {/* Contact Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${photographer.contact}`;
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Contact
                  </button>
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

