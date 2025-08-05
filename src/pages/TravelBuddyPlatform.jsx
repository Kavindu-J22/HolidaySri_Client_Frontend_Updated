import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Eye,
  Heart,
  Users,
  User,
  Calendar,
  ChevronDown,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TravelBuddyPlatform = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [travelBuddies, setTravelBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [filters, setFilters] = useState({
    country: '',
    gender: '',
    minAge: '',
    maxAge: '',
    sortBy: 'newest'
  });

  const countries = [
    'Sri Lanka', 'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Japan', 'Singapore', 'Malaysia', 'Thailand'
  ];

  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ];

  useEffect(() => {
    fetchTravelBuddies();
  }, [currentPage, searchTerm, filters]);

  const fetchTravelBuddies = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 12,
        search: searchTerm,
        ...filters
      });

      const response = await fetch(`/api/travel-buddy/platform?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setTravelBuddies(data.data.travelBuddies);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching travel buddies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTravelBuddies();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      country: '',
      gender: '',
      minAge: '',
      maxAge: '',
      sortBy: 'newest'
    });
    setCurrentPage(1);
  };

  const handleProfileClick = (buddyId) => {
    navigate(`/travel-buddy/${buddyId}`);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const TravelBuddyCard = ({ buddy }) => (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
      {/* Cover Photo with Avatar and Info Overlay */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={buddy.coverPhoto.url}
          alt={`${buddy.userName}'s cover`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Member Badge */}
        {buddy.user?.isMember && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
            <span className="flex items-center space-x-1">
              <span>👑</span>
              <span>PREMIUM</span>
            </span>
          </div>
        )}

        {/* Avatar and Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end space-x-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={buddy.avatarImage.url}
                alt={buddy.userName}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-2xl ring-2 ring-white/30"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-lg"></div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-white pb-2">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-xl font-bold leading-tight drop-shadow-lg">
                  {buddy.userName}
                </h3>
                {buddy.nickName && (
                  <span className="text-sm font-medium text-white/90 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    "{buddy.nickName}"
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3 text-sm text-white/90 mb-2">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{buddy.country}</span>
                </div>
                <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{buddy.age} years</span>
                </div>
                <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                <span className="text-xs uppercase tracking-wide font-semibold bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {buddy.gender}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                  <Eye className="w-3 h-3" />
                  <span className="text-xs font-medium">{buddy.viewCount}</span>
                </div>
                {buddy.averageRating > 0 && (
                  <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium">{buddy.averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-5">

        {/* Rating Display */}
        <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(buddy.averageRating)}
            </div>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {buddy.averageRating > 0 ? buddy.averageRating.toFixed(1) : 'New Profile'}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            {buddy.totalReviews > 0 ? `${buddy.totalReviews} ${buddy.totalReviews === 1 ? 'review' : 'reviews'}` : 'No reviews yet'}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {buddy.description}
        </p>

        {/* Interests */}
        {buddy.interests && buddy.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {buddy.interests.slice(0, 3).map((interest, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-700"
              >
                {interest}
              </span>
            ))}
            {buddy.interests.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                +{buddy.interests.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => handleProfileClick(buddy._id)}
          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>View Profile</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center relative">
            {user && (
              <button
                onClick={() => navigate('/travel-buddy-favorites')}
                className="absolute right-0 top-0 flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span>My Favorites</span>
              </button>
            )}
            <h1 className="text-4xl font-bold mb-2">Find Your Travel Buddy</h1>
            <p className="text-xl opacity-90">Connect with amazing travel companions from around the world</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, interests, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Country Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <select
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Genders</option>
                    {genders.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Min Age
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={filters.minAge}
                    onChange={(e) => handleFilterChange('minAge', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="18"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Age
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={filters.maxAge}
                    onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="100"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {travelBuddies.length > 0 
                  ? `Showing ${travelBuddies.length} travel ${travelBuddies.length === 1 ? 'buddy' : 'buddies'}`
                  : 'No travel buddies found'
                }
              </p>
            </div>

            {/* Travel Buddy Grid */}
            {travelBuddies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {travelBuddies.map((buddy) => (
                  <TravelBuddyCard key={buddy._id} buddy={buddy} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Travel Buddies Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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

export default TravelBuddyPlatform;
