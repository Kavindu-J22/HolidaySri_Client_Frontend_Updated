import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin, DollarSign, TrendingUp, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';

const CryptoConsultingSignalsBrowse = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    city: '',
    province: ''
  });

  // Sri Lankan provinces and districts
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

  // Crypto categories
  const cryptoCategories = [
    "Bitcoin Trading", "Ethereum Trading", "Altcoin Trading", "NFT Trading",
    "DeFi Consulting", "Blockchain Development", "Smart Contract Auditing",
    "Crypto Portfolio Management", "Technical Analysis", "Fundamental Analysis",
    "Risk Management", "Crypto Tax Consulting", "Wallet Security",
    "Exchange Selection", "ICO/IDO Consulting", "Tokenomics",
    "Mining Consulting", "Staking Strategies", "Yield Farming",
    "Crypto Legal Consulting", "Market Research", "Trading Bots",
    "Arbitrage Trading", "Futures & Options Trading", "Other"
  ];

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, profiles]);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get('https://holidaysri-backend-9xm4.onrender.com/api/crypto-consulting-signals/active');
      if (response.data.success) {
        // Filter out expired advertisements and randomize
        const activeProfiles = response.data.data.filter(profile => {
          // Check if the associated advertisement is not expired
          return profile.publishedAdId && profile.publishedAdId.status !== 'expired';
        });
        
        // Randomize the profiles
        const randomized = shuffleArray(activeProfiles);
        setProfiles(randomized);
        setFilteredProfiles(randomized);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load crypto consulting signals');
    } finally {
      setLoading(false);
    }
  };

  // Fisher-Yates shuffle algorithm for random sorting
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const applyFilters = () => {
    let filtered = [...profiles];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.specialist.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(profile => profile.type === filters.type);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(profile => profile.category === filters.category);
    }

    // Province filter
    if (filters.province) {
      filtered = filtered.filter(profile => profile.province === filters.province);
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(profile => profile.city === filters.city);
    }

    setFilteredProfiles(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      // Reset city when province changes
      ...(filterName === 'province' && { city: '' })
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      type: '',
      category: '',
      city: '',
      province: ''
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Crypto Consulting & Courses
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">
            Find expert crypto consultants and comprehensive courses to enhance your crypto journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, category, or specialist area..."
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="Courses">Courses</option>
                <option value="Consultants">Consultants</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                {cryptoCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Province
              </label>
              <select
                value={filters.province}
                onChange={(e) => handleFilterChange('province', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesAndDistricts).map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={!filters.province}
              >
                <option value="">All Cities</option>
                {filters.province && provincesAndDistricts[filters.province]?.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredProfiles.length}</span> results
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Profiles Grid */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProfiles.map((profile) => (
              <div
                key={profile._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-44 sm:h-48 flex-shrink-0">
                  <img
                    src={profile.image?.url || '/placeholder-crypto.jpg'}
                    alt={profile.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <span className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                      {profile.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {profile.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">
                    {profile.category}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(profile.averageRating || 0)}
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {profile.averageRating ? profile.averageRating.toFixed(1) : '0.0'}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      ({profile.totalReviews || 0})
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{profile.city}, {profile.province}</span>
                  </div>

                  {/* Charges */}
                  <div className="flex items-center text-base sm:text-lg font-bold text-green-600 dark:text-green-400 mb-3 sm:mb-4">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-1 flex-shrink-0" />
                    <span className="truncate">LKR {profile.charges?.toLocaleString()}</span>
                  </div>

                  {/* Specialist Tags */}
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4 flex-grow">
                    {profile.specialist?.slice(0, 2).map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs"
                      >
                        {spec}
                      </span>
                    ))}
                    {profile.specialist?.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                        +{profile.specialist.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* View More Button */}
                  <button
                    onClick={() => navigate(`/crypto-consulting-signals/${profile._id}`)}
                    className="w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mt-auto"
                  >
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Results Found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 sm:px-6 py-2.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoConsultingSignalsBrowse;

