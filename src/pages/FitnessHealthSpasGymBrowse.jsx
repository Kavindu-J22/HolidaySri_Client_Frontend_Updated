import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Loader, AlertCircle } from 'lucide-react';

const FitnessHealthSpasGymBrowse = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    specialization: '',
    city: '',
    province: ''
  });

  // Options
  const categoryOptions = ['Spa', 'Gym', 'Yoga Studio', 'Wellness Center', 'Fitness Center', 'Health Club', 'Sauna', 'Steam Room', 'Massage Center', 'Other'];
  const specializationOptions = [
    'Ayurvedic Treatments', 'Weight Loss', 'Fitness Training', 'Yoga & Meditation',
    'Massage Therapy', 'Herbal Treatments', 'Personal Training', 'Group Classes',
    'Rehabilitation', 'Wellness Coaching', 'Other'
  ];

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

  // Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();

        if (activeTab !== 'all') {
          queryParams.append('type', activeTab);
        }
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.specialization) queryParams.append('specialization', filters.specialization);
        if (filters.city) queryParams.append('city', filters.city);
        if (filters.province) queryParams.append('province', filters.province);
        if (searchTerm) queryParams.append('search', searchTerm);

        const response = await fetch(`/api/fitness-health-spas-gym/browse?${queryParams}`);
        const data = await response.json();

        if (data.success) {
          setProfiles(data.data);
          setError('');
        } else {
          setError(data.message || 'Failed to load profiles');
          setProfiles([]);
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles');
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProfiles, 500);
    return () => clearTimeout(timer);
  }, [activeTab, filters, searchTerm]);

  // Get average rating for a profile
  const getAverageRating = async (profileId) => {
    try {
      const response = await fetch(`/api/fitness-health-spas-gym-reviews/${profileId}/rating`);
      const data = await response.json();
      return data.success ? data.data : { averageRating: 0, totalReviews: 0 };
    } catch (err) {
      return { averageRating: 0, totalReviews: 0 };
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { city: '' })
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      specialization: '',
      city: '',
      province: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Fitness, Health, Spas & Gym
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Discover the best fitness and wellness services in Sri Lanka
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Specialization
                </label>
                <select
                  name="specialization"
                  value={filters.specialization}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                >
                  <option value="">All Specializations</option>
                  {specializationOptions.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Province
                </label>
                <select
                  name="province"
                  value={filters.province}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                >
                  <option value="">All Provinces</option>
                  {Object.keys(provincesAndDistricts).map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  disabled={!filters.province}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white disabled:opacity-50"
                >
                  <option value="">All Cities</option>
                  {filters.province && provincesAndDistricts[filters.province]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-300 dark:border-slate-600">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'all'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('Service')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'Service'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('Professionals')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'Professionals'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Professionals
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Profiles Grid */}
        {!loading && profiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile._id}
                profile={profile}
                onViewClick={() => navigate(`/fitness-health-spas-gym/${profile._id}`)}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && profiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No profiles found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Profile Card Component
const ProfileCard = ({ profile, onViewClick }) => {
  const [rating, setRating] = useState({ averageRating: 0, totalReviews: 0 });
  const [loadingRating, setLoadingRating] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(`/api/fitness-health-spas-gym-reviews/${profile._id}/rating`);
        const data = await response.json();
        if (data.success) {
          setRating(data.data);
        }
      } catch (err) {
        console.error('Error fetching rating:', err);
      } finally {
        setLoadingRating(false);
      }
    };

    fetchRating();
  }, [profile._id]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
        <img
          src={profile.avatar.url}
          alt={profile.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {profile.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name and Category */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
            {profile.name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {profile.category} • {profile.specialization}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
          <MapPin className="w-4 h-4" />
          <span>{profile.city}, {profile.province}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(rating.averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
          </div>
          {!loadingRating && (
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {rating.averageRating.toFixed(1)} ({rating.totalReviews})
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {profile.description}
        </p>

        {/* View Button */}
        <button
          onClick={onViewClick}
          className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default FitnessHealthSpasGymBrowse;

