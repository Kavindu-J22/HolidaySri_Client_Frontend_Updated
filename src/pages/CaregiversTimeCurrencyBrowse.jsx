import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Star, Heart, Clock, Filter, AlertCircle, ShoppingBag, Copy, Check, Send, ArrowRightLeft, User } from 'lucide-react';

// Sri Lankan provinces and districts mapping
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

const CaregiversTimeCurrencyBrowse = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('Care Giver');
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(null);
  const [accessMessage, setAccessMessage] = useState('');
  const [error, setError] = useState('');
  const [userHSTC, setUserHSTC] = useState(0);
  const [copiedCareId, setCopiedCareId] = useState(null);

  // HSTC Transfer state
  const [searchCareId, setSearchCareId] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [searchingUser, setSearchingUser] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Check access on mount
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setHasAccess(false);
          setAccessMessage('login_required');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          'http://localhost:5000/api/caregivers-time-currency/check-access',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.hasAccess) {
          setHasAccess(true);
          // Get user's HSTC value from their profile
          if (response.data.data?.profile?.HSTC) {
            setUserHSTC(response.data.data.profile.HSTC);
          }
          fetchProfiles();
        } else {
          setHasAccess(false);
          setAccessMessage(response.data.message);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error checking access:', err);
        setHasAccess(false);
        setAccessMessage('error');
        setLoading(false);
      }
    };

    checkAccess();
  }, []);

  // Fetch profiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:5000/api/caregivers-time-currency/browse'
      );

      if (response.data.success) {
        setProfiles(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  // Copy careID to clipboard
  const handleCopyCareId = (careId) => {
    navigator.clipboard.writeText(careId);
    setCopiedCareId(careId);
    setTimeout(() => setCopiedCareId(null), 2000);
  };

  // Find user by careID
  const handleFindUser = async () => {
    if (!searchCareId.trim()) {
      setTransferError('Please enter a Care ID');
      return;
    }

    setSearchingUser(true);
    setTransferError('');
    setFoundUser(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/caregivers-time-currency/find-by-careid/${searchCareId.trim()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setFoundUser(response.data.data);
      }
    } catch (error) {
      setTransferError(error.response?.data?.message || 'Failed to find user');
    } finally {
      setSearchingUser(false);
    }
  };

  // Handle HSTC transfer
  const handleTransferHSTC = async () => {
    if (!transferAmount || !transferReason.trim()) {
      setTransferError('Please enter transfer amount and reason');
      return;
    }

    const amount = parseInt(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      setTransferError('Please enter a valid positive amount');
      return;
    }

    if (amount > userHSTC) {
      setTransferError(`Insufficient HSTC. You have ${userHSTC}h`);
      return;
    }

    setTransferring(true);
    setTransferError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/caregivers-time-currency/transfer-hstc',
        {
          receiverCareId: foundUser.careID,
          amount,
          reason: transferReason
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setTransferSuccess(response.data.message);
        setUserHSTC(response.data.data.newBalance);
        // Reset form
        setSearchCareId('');
        setFoundUser(null);
        setTransferAmount('');
        setTransferReason('');
        // Clear success message after 5 seconds
        setTimeout(() => setTransferSuccess(''), 5000);
      }
    } catch (error) {
      setTransferError(error.response?.data?.message || 'Failed to transfer HSTC');
    } finally {
      setTransferring(false);
    }
  };

  // Filter profiles based on active tab and filters
  useEffect(() => {
    let filtered = profiles.filter(profile => profile.type === activeTab);

    if (searchTerm) {
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedProvince) {
      filtered = filtered.filter(profile => profile.province === selectedProvince);
    }

    if (selectedCity) {
      filtered = filtered.filter(profile => profile.city === selectedCity);
    }

    setFilteredProfiles(filtered);
  }, [profiles, activeTab, searchTerm, selectedProvince, selectedCity]);

  // Render access denied message
  if (hasAccess === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-600" size={48} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Restricted
            </h2>
            {accessMessage === 'login_required' && (
              <>
                <p className="text-gray-600 mb-6">
                  Please login to access the Compassionate Caregivers & Earn Time Currency page.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
              </>
            )}
            {accessMessage === 'no_advertisement' && (
              <>
                <p className="text-gray-600 mb-6">
                  First you need an Active or Published Care Profile. Publish your care profile first by purchasing a Compassionate Caregivers & Earn Time Currency Advertisement.
                </p>
                <button
                  onClick={() => navigate('/post-advertisement')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center mx-auto"
                >
                  <ShoppingBag className="mr-2" size={20} />
                  Purchase Advertisement
                </button>
              </>
            )}
            {accessMessage === 'no_published_profile' && (
              <>
                <p className="text-gray-600 mb-6">
                  First you need an Active Published Care Profile. Publish your purchased ad first.
                </p>
                <button
                  onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to My Advertisements
                </button>
              </>
            )}
            {accessMessage === 'error' && (
              <>
                <p className="text-gray-600 mb-6">
                  An error occurred while checking your access. Please try again later.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Compassionate Caregivers & Earn Time Currency
          </h1>
          <p className="text-gray-600">
            Connect with care givers or find support for your care needs
          </p>
          {/* Display User's HSTC */}
          {userHSTC > 0 && (
            <div className="mt-4 inline-flex items-center bg-blue-100 px-6 py-3 rounded-full">
              <Clock className="text-blue-600 mr-2" size={24} />
              <span className="text-lg font-bold text-gray-900">
                Your HSTC: {userHSTC}h
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setActiveTab('Care Giver')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'Care Giver'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Care Givers
            </button>
            <button
              onClick={() => setActiveTab('Care Needer')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'Care Needer'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Care Needers
            </button>
            <button
              onClick={() => setActiveTab('HSTC Transfer')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center ${
                activeTab === 'HSTC Transfer'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <ArrowRightLeft size={18} className="mr-2" />
              HSTC Transfer
            </button>
          </div>
        </div>

        {/* HSTC Transfer Tab Content */}
        {activeTab === 'HSTC Transfer' ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ArrowRightLeft className="mr-3 text-green-600" size={28} />
                Transfer HSTC
              </h2>

              {/* Success Message */}
              {transferSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center">
                  <Check className="mr-2" size={20} />
                  {transferSuccess}
                </div>
              )}

              {/* Error Message */}
              {transferError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
                  <AlertCircle className="mr-2" size={20} />
                  {transferError}
                </div>
              )}

              {/* Search Care ID */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Care ID
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchCareId}
                    onChange={(e) => setSearchCareId(e.target.value.toUpperCase())}
                    placeholder="e.g., CHS1234"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
                    maxLength={7}
                  />
                  <button
                    onClick={handleFindUser}
                    disabled={searchingUser}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {searchingUser ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Finding...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2" size={18} />
                        Find
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Found User Display */}
              {foundUser && (
                <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center mb-4">
                    <img
                      src={foundUser.avatar?.url || '/default-avatar.png'}
                      alt={foundUser.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{foundUser.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span><strong>Gender:</strong> {foundUser.gender}</span>
                        <span><strong>Age:</strong> {foundUser.age}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          foundUser.type === 'Care Giver'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {foundUser.type}
                        </span>
                        <span className="text-sm font-semibold text-gray-700">
                          Care ID: {foundUser.careID}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Form */}
                  <div className="border-t border-blue-200 pt-4 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Transfer HSTC</h4>

                    {/* Current HSTC Display */}
                    <div className="mb-4 p-3 bg-white rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Your Current HSTC:</span>
                        <span className="text-lg font-bold text-blue-600">{userHSTC}h</span>
                      </div>
                    </div>

                    {/* Transfer Amount */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Transfer Amount (whole numbers only) *
                      </label>
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="Enter amount in hours"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        min="1"
                        step="1"
                      />
                    </div>

                    {/* Reason */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reason *
                      </label>
                      <textarea
                        value={transferReason}
                        onChange={(e) => setTransferReason(e.target.value)}
                        placeholder="Enter reason for transfer..."
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        maxLength={500}
                      />
                      <p className="text-xs text-gray-500 mt-1">{transferReason.length}/500 characters</p>
                    </div>

                    {/* Transfer Button */}
                    <button
                      onClick={handleTransferHSTC}
                      disabled={transferring}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {transferring ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Transferring...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2" size={20} />
                          Transfer HSTC
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Filter className="mr-2" size={20} />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Province
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedCity('');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Provinces</option>
                  {Object.keys(provincesAndDistricts).map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!selectedProvince}
                >
                  <option value="">All Cities</option>
                  {selectedProvince && provincesAndDistricts[selectedProvince]?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredProfiles.length}</span> {activeTab === 'Care Giver' ? 'Care Givers' : 'Care Needers'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Heart size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No {activeTab === 'Care Giver' ? 'Care Givers' : 'Care Needers'} Found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <div
                key={profile._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Profile Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
                  <img
                    src={profile.avatar?.url || '/default-avatar.png'}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                    <div className="flex items-center">
                      <Clock className="text-blue-600 mr-1" size={16} />
                      <span className="text-sm font-semibold text-gray-700">
                        HSTC: {profile.HSTC}h
                      </span>
                    </div>
                  </div>
                  {profile.type === 'Care Giver' && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Care Giver
                    </div>
                  )}
                  {profile.type === 'Care Needer' && (
                    <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Care Needer
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {profile.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin size={14} className="mr-1" />
                        {profile.city}, {profile.province}
                      </div>
                      {/* Care ID with Copy */}
                      <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 rounded-lg border border-blue-200 w-fit">
                        <span className="text-xs font-semibold text-gray-700 mr-2">
                          ID: {profile.careID}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyCareId(profile.careID);
                          }}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          title="Copy Care ID"
                        >
                          {copiedCareId === profile.careID ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                    {profile.averageRating > 0 && (
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="text-yellow-500 fill-current mr-1" size={16} />
                        <span className="text-sm font-semibold text-gray-700">
                          {profile.averageRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {profile.description}
                  </p>

                  {/* Type-Specific Info */}
                  {profile.type === 'Care Giver' && profile.careGiverDetails && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">
                        <strong>Experience:</strong> {profile.careGiverDetails.experience} years
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {profile.careGiverDetails.services?.slice(0, 3).map((service, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                        {profile.careGiverDetails.services?.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            +{profile.careGiverDetails.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {profile.type === 'Care Needer' && profile.careNeederDetails && (
                    <div className="mb-4">
                      {profile.careNeederDetails.specialNeeds?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {profile.careNeederDetails.specialNeeds.slice(0, 3).map((need, index) => (
                            <span
                              key={index}
                              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                            >
                              {need}
                            </span>
                          ))}
                          {profile.careNeederDetails.specialNeeds.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              +{profile.careNeederDetails.specialNeeds.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Languages */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Languages:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.speakingLanguages?.slice(0, 3).map((lang, index) => (
                        <span
                          key={index}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Availability Status */}
                  <div className="flex items-center gap-2 mb-4">
                    {profile.available && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                        Available
                      </span>
                    )}
                    {profile.occupied && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                        Occupied
                      </span>
                    )}
                  </div>

                  {/* View More Button */}
                  <button
                    onClick={() => navigate(`/caregivers-time-currency/${profile._id}`)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default CaregiversTimeCurrencyBrowse;

