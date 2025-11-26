import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Star, Heart, Clock, CheckCircle, XCircle, MapPin, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DonationsRaiseFundBrowse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse'); // browse or myRequests
  const [campaigns, setCampaigns] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]); // Store all campaigns for search
  const [myWithdrawalRequests, setMyWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    province: '',
    city: ''
  });
  const [provincesData, setProvincesData] = useState({
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Northern Province": ["Jaffna", "Mannar", "Vavuniya", "Kilinochchi", "Mullaitivu"],
    "Eastern Province": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Sabaragamuwa Province": ["Kegalle", "Ratnapura"]
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const categories = [
    'Education',
    'Medical & Healthcare',
    'Disaster Relief',
    'Community Development',
    'Environmental Conservation',
    'Animal Welfare',
    'Arts & Culture',
    'Sports & Recreation',
    'Religious & Spiritual',
    'Children & Youth',
    'Elderly Care',
    'Women Empowerment',
    'Technology & Innovation',
    'Other'
  ];

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchCampaigns();
    } else if (activeTab === 'myRequests' && user) {
      fetchMyWithdrawalRequests();
    }
  }, [activeTab, filters, pagination.currentPage, user]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.province) params.append('province', filters.province);
      if (filters.city) params.append('city', filters.city);
      params.append('page', pagination.currentPage);
      params.append('limit', 12);

      const response = await axios.get(`https://holidaysri-backend-9xm4.onrender.com/api/donations-raise-fund?${params}`);

      if (response.data.success) {
        console.log('Raw data from API:', response.data.data.length, 'campaigns');

        // Filter out expired campaigns
        const activeCampaigns = response.data.data.filter(campaign => {
          return campaign.publishedAdId && campaign.publishedAdId.status !== 'expired';
        });

        console.log('After filtering expired:', activeCampaigns.length, 'campaigns');

        // Remove duplicates based on _id using Map for better performance
        const uniqueCampaignsMap = new Map();
        activeCampaigns.forEach(campaign => {
          if (!uniqueCampaignsMap.has(campaign._id)) {
            uniqueCampaignsMap.set(campaign._id, campaign);
          }
        });
        const uniqueCampaigns = Array.from(uniqueCampaignsMap.values());

        console.log('After removing duplicates:', uniqueCampaigns.length, 'campaigns');

        // Check for duplicates
        const ids = activeCampaigns.map(c => c._id);
        const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
        if (duplicateIds.length > 0) {
          console.warn('Found duplicate campaign IDs:', duplicateIds);
        }

        // Randomize campaigns
        const randomized = uniqueCampaigns.sort(() => Math.random() - 0.5);

        setAllCampaigns(randomized); // Store all campaigns
        setCampaigns(randomized); // Display campaigns
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total
        });
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyWithdrawalRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://holidaysri-backend-9xm4.onrender.com/api/donations-raise-fund', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Filter campaigns where user is the owner and has a withdrawal request
        const userRequests = response.data.data.filter(
          campaign =>
            campaign.publishedAdId &&
            campaign.publishedAdId.userId === user.id &&
            campaign.withdrawalRequest &&
            campaign.withdrawalRequest.status !== 'none'
        );

        // Remove duplicates based on _id
        const uniqueRequests = userRequests.reduce((acc, current) => {
          const exists = acc.find(item => item._id === current._id);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);

        setMyWithdrawalRequests(uniqueRequests);
      }
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { city: '' }) // Reset city when province changes
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setSearchTerm(''); // Clear search when filters change
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Filter from all campaigns
      const filtered = allCampaigns.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Remove duplicates from filtered results
      const uniqueFiltered = filtered.reduce((acc, current) => {
        const exists = acc.find(item => item._id === current._id);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      setCampaigns(uniqueFiltered);
    } else {
      // Reset to show all campaigns
      setCampaigns(allCampaigns);
    }
  };

  const calculateProgress = (raised, requested) => {
    return Math.min((raised / requested) * 100, 100);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  const getWithdrawalStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', icon: Clock, label: 'Pending' },
      approved: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', icon: CheckCircle, label: 'Approved' },
      rejected: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', icon: XCircle, label: 'Rejected' }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-6 sm:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Donations & Fundraising Campaigns
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Support meaningful causes and make a difference in people's lives
          </p>
        </div>

        {/* Tabs */}
        {user && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-all rounded-lg text-sm sm:text-base ${
                activeTab === 'browse'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 shadow-md'
              }`}
            >
              Browse Campaigns
            </button>
            <button
              onClick={() => setActiveTab('myRequests')}
              className={`flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-all rounded-lg text-sm sm:text-base ${
                activeTab === 'myRequests'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 shadow-md'
              }`}
            >
              My Withdrawal Requests
            </button>
          </div>
        )}

        {/* Browse Campaigns Tab */}
        {activeTab === 'browse' && (
          <>
            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-purple-100 dark:border-gray-700">
          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search campaigns by title, organizer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all text-sm sm:text-base"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium text-sm sm:text-base whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Filter className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-purple-600" />
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all text-sm sm:text-base"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-purple-600" />
                Province
              </label>
              <select
                name="province"
                value={filters.province}
                onChange={handleFilterChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all text-sm sm:text-base"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesData).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-purple-600" />
                City
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                disabled={!filters.province}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
              >
                <option value="">All Cities</option>
                {filters.province && provincesData[filters.province]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 sm:py-16">
            <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20">
              <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-900"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin"></div>
            </div>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Loading campaigns...</p>
          </div>
        )}

        {/* Campaigns Grid */}
        {!loading && campaigns.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full"
              >
                {/* Campaign Image */}
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  <img
                    src={campaign.images[0]?.url || campaign.images[0]}
                    alt={campaign.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    {campaign.category}
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                    <Users className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-medium">{campaign.donationCount || 0} Donors</span>
                  </div>
                </div>

                {/* Campaign Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">
                    {campaign.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-purple-500" />
                    By {campaign.organizer}
                  </p>

                  {/* Rating */}
                  {campaign.averageRating > 0 && (
                    <div className="mb-3">
                      {renderStars(campaign.averageRating)}
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4 flex-grow">
                    <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
                      <span className="text-purple-700 dark:text-purple-400 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {campaign.totalDonatedHSC.toFixed(2)} HSC
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        Goal: {campaign.requestedAmountHSC.toFixed(2)} HSC
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                        style={{ width: `${calculateProgress(campaign.totalDonatedHSC, campaign.requestedAmountHSC)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                      {campaign.totalDonatedLKR.toLocaleString()}/{campaign.requestedAmountLKR.toLocaleString()} LKR
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-purple-500" />
                    <span className="truncate">{campaign.city}, {campaign.province}</span>
                  </div>

                  {/* View More Button */}
                  <button
                    onClick={() => navigate(`/donations-raise-fund/${campaign._id}`)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && campaigns.length === 0 && (
          <div className="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="relative inline-block">
              <Heart className="mx-auto w-16 h-16 sm:w-20 sm:h-20 text-purple-300 dark:text-purple-700 mb-4" />
              <div className="absolute inset-0 animate-ping">
                <Heart className="mx-auto w-16 h-16 sm:w-20 sm:h-20 text-purple-200 dark:text-purple-800 opacity-75" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              No campaigns found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto px-4">
              Try adjusting your filters or search terms to discover more campaigns
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && campaigns.length > 0 && pagination.totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={pagination.currentPage === 1}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 dark:hover:bg-gray-700 hover:border-purple-400 transition-all font-medium text-sm sm:text-base shadow-md"
            >
              Previous
            </button>
            <span className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-sm sm:text-base shadow-lg">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 dark:hover:bg-gray-700 hover:border-purple-400 transition-all font-medium text-sm sm:text-base shadow-md"
            >
              Next
            </button>
          </div>
        )}
          </>
        )}

        {/* My Withdrawal Requests Tab */}
        {activeTab === 'myRequests' && (
          <div className="space-y-4 sm:space-y-6">
            {loading ? (
              <div className="flex justify-center py-12 sm:py-16">
                <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-900"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin"></div>
                </div>
              </div>
            ) : myWithdrawalRequests.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="relative inline-block">
                  <Heart className="mx-auto w-16 h-16 sm:w-20 sm:h-20 text-purple-300 dark:text-purple-700 mb-4" />
                  <div className="absolute inset-0 animate-ping">
                    <Heart className="mx-auto w-16 h-16 sm:w-20 sm:h-20 text-purple-200 dark:text-purple-800 opacity-75" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  No Withdrawal Requests
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto px-4">
                  You haven't requested any withdrawals yet
                </p>
              </div>
            ) : (
              myWithdrawalRequests.map((request) => {
                const statusBadge = getWithdrawalStatusBadge(request.withdrawalRequest.status);
                const StatusIcon = statusBadge.icon;

                return (
                  <div key={request._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-purple-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                    <div className="p-4 sm:p-6">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {request.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-purple-500" />
                            Organizer: {request.organizer}
                          </p>
                        </div>
                        <span className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md ${statusBadge.bg} ${statusBadge.text}`}>
                          <StatusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {statusBadge.label}
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 sm:p-5 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Total Raised</p>
                          <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {request.totalDonatedHSC.toFixed(2)} HSC
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {request.totalDonatedLKR.toLocaleString()} LKR
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 sm:p-5 rounded-xl border border-green-200 dark:border-green-800 shadow-sm">
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Goal Amount</p>
                          <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                            {request.requestedAmountHSC.toFixed(2)} HSC
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {request.requestedAmountLKR.toLocaleString()} LKR
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 sm:p-5 rounded-xl border border-purple-200 dark:border-purple-800 shadow-sm">
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Donations</p>
                          <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {request.donationCount}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {request.fundTransfers?.length || 0} transfers
                          </p>
                        </div>
                      </div>

                      {/* Request Details */}
                      <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 sm:pt-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-purple-500" />
                            Requested On:
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {new Date(request.withdrawalRequest.requestedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {request.withdrawalRequest.processedAt && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                              Processed On:
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {new Date(request.withdrawalRequest.processedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        )}

                        {/* Admin Note */}
                        {request.withdrawalRequest.adminNote && (
                          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                            <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                              Admin Note:
                            </p>
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                              {request.withdrawalRequest.adminNote}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* View Campaign Button */}
                      <button
                        onClick={() => navigate(`/donations-raise-fund/${request._id}`)}
                        className="w-full mt-4 sm:mt-6 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-semibold text-sm sm:text-base"
                      >
                        View Campaign Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationsRaiseFundBrowse;

