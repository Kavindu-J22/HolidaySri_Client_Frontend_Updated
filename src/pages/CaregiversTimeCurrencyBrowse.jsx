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
          'https://holidaysri-backend-9xm4.onrender.com/api/caregivers-time-currency/check-access',
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
        'https://holidaysri-backend-9xm4.onrender.com/api/caregivers-time-currency/browse'
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
        `https://holidaysri-backend-9xm4.onrender.com/api/caregivers-time-currency/find-by-careid/${searchCareId.trim()}`,
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
        'https://holidaysri-backend-9xm4.onrender.com/api/caregivers-time-currency/transfer-hstc',
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 px-3 sm:px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-600 dark:text-red-400" size={36} />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Restricted
            </h2>
            {accessMessage === 'login_required' && (
              <>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                  Please login to access the Compassionate Caregivers & Earn Time Currency page.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Login
                </button>
              </>
            )}
            {accessMessage === 'no_advertisement' && (
              <>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                  First you need an Active or Published Care Profile. Publish your care profile first by purchasing a Compassionate Caregivers & Earn Time Currency Advertisement.
                </p>
                <button
                  onClick={() => navigate('/post-advertisement')}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center mx-auto"
                >
                  <ShoppingBag className="mr-2" size={20} />
                  Purchase Advertisement
                </button>
              </>
            )}
            {accessMessage === 'no_published_profile' && (
              <>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                  First you need an Active Published Care Profile. Publish your purchased ad first.
                </p>
                <button
                  onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Go to My Advertisements
                </button>
              </>
            )}
            {accessMessage === 'error' && (
              <>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                  An error occurred while checking your access. Please try again later.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-8 lg:py-12 px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 px-1 sm:px-2 leading-tight">
            Compassionate Caregivers & Earn Time Currency
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 px-1 sm:px-2">
            Connect with care givers or find support for your care needs
          </p>
          {/* Display User's HSTC */}
          {userHSTC > 0 && (
            <div className="mt-3 sm:mt-4 inline-flex items-center bg-blue-100 dark:bg-blue-900/30 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-full">
              <Clock className="text-blue-600 dark:text-blue-400 mr-1.5 sm:mr-2" size={16} />
              <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white">
                Your HSTC: {userHSTC}h
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8 overflow-x-auto px-1 sm:px-2 scrollbar-hide">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-0.5 sm:p-1 inline-flex gap-0.5 sm:gap-1 min-w-max">
            <button
              onClick={() => setActiveTab('Care Giver')}
              className={`px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm md:text-base whitespace-nowrap ${
                activeTab === 'Care Giver'
                  ? 'bg-blue-600 dark:bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Care Givers
            </button>
            <button
              onClick={() => setActiveTab('Care Needer')}
              className={`px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm md:text-base whitespace-nowrap ${
                activeTab === 'Care Needer'
                  ? 'bg-purple-600 dark:bg-purple-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              Care Needers
            </button>
            <button
              onClick={() => setActiveTab('HSTC Transfer')}
              className={`px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg font-semibold transition-all flex items-center text-xs sm:text-sm md:text-base whitespace-nowrap ${
                activeTab === 'HSTC Transfer'
                  ? 'bg-green-600 dark:bg-green-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
              }`}
            >
              <ArrowRightLeft size={14} className="mr-1 sm:mr-1.5 md:mr-2" />
              <span>Transfer</span>
            </button>
          </div>
        </div>

        {/* HSTC Transfer Tab Content */}
        {activeTab === 'HSTC Transfer' ? (
          <div className="max-w-2xl mx-auto px-1 sm:px-0">
            <div className="bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-xl sm:rounded-2xl shadow-2xl border border-green-100 dark:border-gray-700 p-3 sm:p-4 md:p-6 lg:p-8">
              <div className="flex items-center mb-3 sm:mb-4 md:mb-6 pb-3 sm:pb-4 border-b-2 border-green-200 dark:border-green-700/50">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl shadow-lg mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <ArrowRightLeft className="text-white" size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    Transfer HSTC
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                    Send time currency to members
                  </p>
                </div>
              </div>

              {/* Success Message */}
              {transferSuccess && (
                <div className="mb-3 sm:mb-4 md:mb-6 p-2.5 sm:p-3 md:p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 flex items-start text-xs sm:text-sm md:text-base">
                  <Check className="mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <span className="break-words">{transferSuccess}</span>
                </div>
              )}

              {/* Error Message */}
              {transferError && (
                <div className="mb-3 sm:mb-4 md:mb-6 p-2.5 sm:p-3 md:p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 flex items-start text-xs sm:text-sm md:text-base">
                  <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <span className="break-words">{transferError}</span>
                </div>
              )}

              {/* Search Care ID */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Enter Care ID
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={searchCareId}
                    onChange={(e) => setSearchCareId(e.target.value.toUpperCase())}
                    placeholder="e.g., CHS1234"
                    className="flex-1 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent uppercase text-xs sm:text-sm md:text-base"
                    maxLength={7}
                  />
                  <button
                    onClick={handleFindUser}
                    disabled={searchingUser}
                    className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm md:text-base whitespace-nowrap"
                  >
                    {searchingUser ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Finding...
                      </>
                    ) : (
                      <>
                        <Search className="mr-1.5 sm:mr-2" size={14} />
                        Find
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Found User Display */}
              {foundUser && (
                <div className="mb-3 sm:mb-4 md:mb-6 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50 via-purple-50/50 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl border-2 border-blue-300 dark:border-blue-600 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start mb-3 sm:mb-4 gap-2 sm:gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={foundUser.avatar?.url || '/default-avatar.png'}
                        alt={foundUser.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border-3 sm:border-4 border-white dark:border-gray-700 shadow-lg sm:mr-3 md:mr-4"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 bg-green-500 dark:bg-green-600 rounded-full p-1 sm:p-1.5 border-2 border-white dark:border-gray-700">
                        <User size={10} className="text-white sm:w-3 sm:h-3" />
                      </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">{foundUser.name}</h3>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 md:gap-4 mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        <span><strong>Gender:</strong> {foundUser.gender}</span>
                        <span><strong>Age:</strong> {foundUser.age}</span>
                      </div>
                      <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 md:gap-3">
                        <span className={`px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-sm ${
                          foundUser.type === 'Care Giver'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white'
                            : 'bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white'
                        }`}>
                          {foundUser.type}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold bg-white dark:bg-gray-700 px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-gray-700 dark:text-gray-300 shadow-sm truncate max-w-[150px] sm:max-w-none">
                          ID: {foundUser.careID}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Form */}
                  <div className="border-t-2 border-blue-200 dark:border-blue-700/50 pt-3 sm:pt-4 mt-3 sm:mt-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 text-xs sm:text-sm md:text-base flex items-center">
                      <div className="w-0.5 sm:w-1 h-4 sm:h-5 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-1.5 sm:mr-2"></div>
                      Transfer Details
                    </h4>

                    {/* Current HSTC Display */}
                    <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 md:p-4 bg-gradient-to-r from-white to-blue-50 dark:from-gray-700 dark:to-gray-700/50 rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-700/50 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Your Current HSTC:</span>
                        <span className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{userHSTC}h</span>
                      </div>
                    </div>

                    {/* Transfer Amount */}
                    <div className="mb-3 sm:mb-4">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                        Transfer Amount (whole numbers) *
                      </label>
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="Enter amount in hours"
                        className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent text-xs sm:text-sm md:text-base"
                        min="1"
                        step="1"
                      />
                    </div>

                    {/* Reason */}
                    <div className="mb-3 sm:mb-4">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                        Reason *
                      </label>
                      <textarea
                        value={transferReason}
                        onChange={(e) => setTransferReason(e.target.value)}
                        placeholder="Enter reason for transfer..."
                        rows="3"
                        className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent text-xs sm:text-sm md:text-base"
                        maxLength={500}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{transferReason.length}/500 characters</p>
                    </div>

                    {/* Transfer Button */}
                    <button
                      onClick={handleTransferHSTC}
                      disabled={transferring}
                      className="w-full px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm md:text-base"
                    >
                      {transferring ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Transferring...
                        </>
                      ) : (
                        <>
                          <Send className="mr-1.5 sm:mr-2" size={16} />
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm md:text-base placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              <Filter className="mr-1.5 sm:mr-2" size={16} />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Province
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedCity('');
                  }}
                  className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm md:text-base"
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
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
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
        <div className="mb-3 sm:mb-4 md:mb-6 px-2">
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
            Showing <span className="font-semibold">{filteredProfiles.length}</span> {activeTab === 'Care Giver' ? 'Care Givers' : 'Care Needers'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 sm:mb-4 md:mb-6 p-2.5 sm:p-3 md:p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-xs sm:text-sm md:text-base">
            {error}
          </div>
        )}

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-3 sm:mb-4">
              <Heart size={40} className="mx-auto sm:w-12 sm:h-12 md:w-16 md:h-16" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No {activeTab === 'Care Giver' ? 'Care Givers' : 'Care Needers'} Found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {filteredProfiles.map((profile) => (
              <div
                key={profile._id}
                className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transform hover:-translate-y-1"
              >
                {/* Profile Image */}
                <div className="relative h-36 sm:h-40 md:h-48 bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-indigo-900/30 overflow-hidden">
                  <img
                    src={profile.avatar?.url || '/default-avatar.png'}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-1.5 sm:top-2 md:top-4 right-1.5 sm:right-2 md:right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 rounded-full shadow-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center">
                      <Clock className="text-blue-600 dark:text-blue-400 mr-0.5 sm:mr-1" size={12} />
                      <span className="text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        {profile.HSTC}h
                      </span>
                    </div>
                  </div>
                  {profile.type === 'Care Giver' && (
                    <div className="absolute top-1.5 sm:top-2 md:top-4 left-1.5 sm:left-2 md:left-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-lg">
                      Care Giver
                    </div>
                  )}
                  {profile.type === 'Care Needer' && (
                    <div className="absolute top-1.5 sm:top-2 md:top-4 left-1.5 sm:left-2 md:left-4 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 text-white px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-lg">
                      Care Needer
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-800/50">
                  <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1 truncate">
                        {profile.name}
                      </h3>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2">
                        <MapPin size={10} className="mr-0.5 sm:mr-1 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                        <span className="truncate text-xs">{profile.city}, {profile.province}</span>
                      </div>
                      {/* Care ID with Copy */}
                      <div className="flex items-center bg-gradient-to-r from-blue-50 via-purple-50/50 to-indigo-50 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-indigo-900/30 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg border border-blue-300 dark:border-blue-600 w-fit max-w-full shadow-sm">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 mr-1 sm:mr-2 truncate">
                          ID: {profile.careID}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyCareId(profile.careID);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex-shrink-0 hover:scale-110 transform"
                          title="Copy Care ID"
                        >
                          {copiedCareId === profile.careID ? (
                            <Check size={10} className="text-green-600 dark:text-green-400 sm:w-3 sm:h-3" />
                          ) : (
                            <Copy size={10} className="sm:w-3 sm:h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    {profile.averageRating > 0 && (
                      <div className="flex items-center bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg flex-shrink-0 border border-yellow-200 dark:border-yellow-700 shadow-sm">
                        <Star className="text-yellow-500 dark:text-yellow-400 fill-current mr-0.5 sm:mr-1" size={12} />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          {profile.averageRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                    {profile.description}
                  </p>

                  {/* Type-Specific Info */}
                  {profile.type === 'Care Giver' && profile.careGiverDetails && (
                    <div className="mb-2 sm:mb-3 md:mb-4 p-2 sm:p-2.5 md:p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2 font-medium">
                        <strong className="text-blue-700 dark:text-blue-400">Exp:</strong> {profile.careGiverDetails.experience}y
                      </p>
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {profile.careGiverDetails.services?.slice(0, 3).map((service, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full font-medium shadow-sm border border-blue-200 dark:border-blue-700"
                          >
                            {service}
                          </span>
                        ))}
                        {profile.careGiverDetails.services?.length > 3 && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full font-medium">
                            +{profile.careGiverDetails.services.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {profile.type === 'Care Needer' && profile.careNeederDetails && (
                    <div className="mb-2 sm:mb-3 md:mb-4 p-2 sm:p-2.5 md:p-3 bg-purple-50/50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800">
                      {profile.careNeederDetails.specialNeeds?.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {profile.careNeederDetails.specialNeeds.slice(0, 3).map((need, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full font-medium shadow-sm border border-purple-200 dark:border-purple-700"
                            >
                              {need}
                            </span>
                          ))}
                          {profile.careNeederDetails.specialNeeds.length > 3 && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full font-medium">
                              +{profile.careNeederDetails.specialNeeds.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Languages */}
                  <div className="mb-2 sm:mb-3 md:mb-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 sm:mb-1.5 font-medium">Languages:</p>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {profile.speakingLanguages?.slice(0, 3).map((lang, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-700 dark:text-green-300 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full font-medium shadow-sm border border-green-200 dark:border-green-700"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Availability Status */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {profile.available && (
                      <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-700 dark:text-green-300 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full font-bold shadow-sm border border-green-300 dark:border-green-600">
                        ✓ Available
                      </span>
                    )}
                    {profile.occupied && (
                      <span className="text-xs bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 text-orange-700 dark:text-orange-300 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full font-bold shadow-sm border border-orange-300 dark:border-orange-600">
                        ⚠ Occupied
                      </span>
                    )}
                  </div>

                  {/* View More Button */}
                  <button
                    onClick={() => navigate(`/caregivers-time-currency/${profile._id}`)}
                    className="w-full py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-500 dark:via-purple-500 dark:to-indigo-500 text-white rounded-lg sm:rounded-xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:via-purple-600 dark:hover:to-indigo-600 transition-all text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    View Full Profile
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

