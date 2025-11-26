import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, MapPin, Star, Phone, Shield, Loader,
  AlertCircle, X, Ambulance, ShieldAlert, Hospital,
  PhoneCall, Info, AlertTriangle, Siren
} from 'lucide-react';

const EmergencyServicesInsuranceBrowse = () => {
  const navigate = useNavigate();

  // Emergency contacts data
  const emergencyContacts = [
    {
      title: "General Emergency",
      number: "112 or 110 (police/fire)",
      icon: Siren,
      color: "#f44336"
    },
    {
      title: "Tourist Police Hotline",
      number: "1912 (SLTDA)",
      icon: ShieldAlert,
      color: "#3f51b5"
    },
    {
      title: "Medical Emergency",
      number: "Suwasariya Ambulance: 1990",
      icon: Ambulance,
      color: "#e91e63"
    },
    {
      title: "Lanka Hospitals Emergency",
      number: "1566 or +94 11 543 1088",
      icon: Hospital,
      color: "#9c27b0"
    },
    {
      title: "National Hospital Colombo",
      number: "+9411-2691111",
      icon: Hospital,
      color: "#673ab7"
    },
    {
      title: "Emergency Assistance",
      number: "1344 (24/7 tourist support)",
      icon: PhoneCall,
      color: "#2196f3"
    },
    {
      title: "Police Emergency",
      number: "119",
      icon: ShieldAlert,
      color: "#03a9f4"
    },
    {
      title: "Ministry of Public Security",
      number: "118",
      icon: Shield,
      color: "#00bcd4"
    },
    {
      title: "Fire & Rescue",
      number: "110",
      icon: AlertTriangle,
      color: "#009688"
    },
    {
      title: "Coast Guard Emergency",
      number: "+94 11 243 0610",
      icon: ShieldAlert,
      color: "#4caf50"
    },
    {
      title: "Tourist Complaints",
      number: "+94 11 242 1052 (SLTDA)",
      icon: Info,
      color: "#8bc34a"
    },
    {
      title: "Road Accident",
      number: "1969 (Motor Traffic Division)",
      icon: AlertTriangle,
      color: "#cddc39"
    },
    {
      title: "Poison Information Center",
      number: "+94 11 269 4433",
      icon: Hospital,
      color: "#ffc107"
    },
    {
      title: "Holidaysri Contact Support",
      number: "+94 11 123 4567",
      icon: PhoneCall,
      color: "#ff9800"
    }
  ];

  // Provinces and districts
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

  // Insurance categories
  const insuranceCategories = [
    'Comprehensive Travel Insurance',
    'Medical Insurance',
    'Trip Cancellation Insurance',
    'Baggage Insurance',
    'Emergency Medical Evacuation',
    'Adventure Sports Coverage',
    'Personal Accident Insurance',
    'Emergency Response Services',
    'Travel Assistance Services',
    'Other'
  ];

  // State
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch profiles
  useEffect(() => {
    fetchProfiles();
  }, [searchTerm, selectedCategory, selectedProvince, selectedCity]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedProvince) params.append('province', selectedProvince);
      if (selectedCity) params.append('city', selectedCity);

      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/emergency-services-insurance/browse?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProfiles(data.data.profiles);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedProvince('');
    setSelectedCity('');
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
            Emergency Services & Insurance
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Find trusted emergency services and comprehensive insurance coverage for your travels in Sri Lanka
          </p>
        </div>

        {/* Emergency Contacts Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
            🚨 Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 hover:shadow-xl transition-all transform hover:-translate-y-1 border-l-4"
                style={{ borderLeftColor: contact.color }}
              >
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div
                    className="p-1.5 sm:p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${contact.color}20` }}
                  >
                    <contact.icon
                      className="w-6 h-6 sm:w-8 sm:h-8"
                      style={{ color: contact.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm mb-1 line-clamp-2">
                      {contact.title}
                    </h3>
                    <a
                      href={`tel:${contact.number.replace(/[^0-9+]/g, '')}`}
                      className="text-xs sm:text-sm font-medium hover:underline break-words"
                      style={{ color: contact.color }}
                    >
                      {contact.number}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-gray-200 dark:border-gray-700 my-8 sm:my-12"></div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-red-500 hover:text-red-600 font-medium mb-4 text-sm sm:text-base"
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Category Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {insuranceCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Province Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Province
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedCity('');
                  }}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">All Provinces</option>
                  {Object.keys(provincesAndDistricts).map((province) => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedProvince}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">All Cities</option>
                  {selectedProvince && provincesAndDistricts[selectedProvince]?.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {(searchTerm || selectedCategory || selectedProvince || selectedCity) && (
            <button
              onClick={clearFilters}
              className="mt-4 flex items-center space-x-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <Loader className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 animate-spin mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading profiles...</p>
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {profiles.map((profile) => (
              <div
                key={profile._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 overflow-hidden flex flex-col h-full"
              >
                {/* Logo */}
                {profile.logo?.url && (
                  <div className="h-44 sm:h-48 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center p-4 sm:p-6 flex-shrink-0">
                    <img
                      src={profile.logo.url}
                      alt={profile.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {profile.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium mb-3">
                    {profile.category}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(profile.averageRating || 0)}
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      {profile.averageRating ? profile.averageRating.toFixed(1) : '0.0'}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      ({profile.totalReviews || 0})
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm line-clamp-1">{profile.city}, {profile.province}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 flex-grow">
                    {profile.description}
                  </p>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/emergency-services-insurance/${profile._id}`)}
                    className="w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-medium mt-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">No profiles found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyServicesInsuranceBrowse;

