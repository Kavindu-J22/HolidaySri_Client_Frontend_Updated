import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Loader,
  AlertCircle,
  Filter
} from 'lucide-react';
import axios from 'axios';

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

export default function BabysittersChildcareBrowse() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch profiles
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/babysitters-childcare/browse');
      if (response.data.success) {
        setProfiles(response.data.data);
        setFilteredProfiles(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = profiles;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedProvince) {
      filtered = filtered.filter(p => p.province === selectedProvince);
    }

    if (selectedCity) {
      filtered = filtered.filter(p => p.city === selectedCity);
    }

    setFilteredProfiles(filtered);
  }, [searchTerm, selectedCategory, selectedProvince, selectedCity, profiles]);

  const handleViewProfile = (profileId) => {
    navigate(`/babysitters-childcare-detail/${profileId}`);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedCity('');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedProvince('');
    setSelectedCity('');
  };

  const getUniqueCategories = () => {
    return [...new Set(profiles.map(p => p.category))].sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Trusted Babysitters & Childcare Help
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find professional babysitters and childcare providers in your area
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {(searchTerm || selectedCategory || selectedProvince || selectedCity) && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 transition"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {getUniqueCategories().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Province Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Province
              </label>
              <select
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesAndDistricts).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                disabled={!selectedProvince}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <option value="">All Cities</option>
                {selectedProvince && provincesAndDistricts[selectedProvince].map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-gray-600 dark:text-gray-300">
          Showing {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? 's' : ''}
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map(profile => (
              <div
                key={profile._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
              >
                {/* Image */}
                {profile.images && profile.images.length > 0 && (
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                    <img
                      src={profile.images[0].url}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {profile.category}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {profile.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(profile.averageRating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {profile.averageRating || 0} ({profile.totalReviews || 0} reviews)
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{profile.city}, {profile.province}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {profile.description}
                  </p>

                  {/* Experience */}
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span className="font-medium">{profile.experience} years</span> experience
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => handleViewProfile(profile._id)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No profiles found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

