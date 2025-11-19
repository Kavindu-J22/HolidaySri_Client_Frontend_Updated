import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Star, Heart, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DonationsRaiseFundBrowse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse'); // browse or myRequests
  const [campaigns, setCampaigns] = useState([]);
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

      const response = await axios.get(`http://localhost:5000/api/donations-raise-fund?${params}`);
      
      if (response.data.success) {
        // Filter out expired campaigns and randomize
        const activeCampaigns = response.data.data.filter(campaign => {
          return campaign.publishedAdId && campaign.publishedAdId.status !== 'expired';
        });

        // Randomize campaigns
        const randomized = activeCampaigns.sort(() => Math.random() - 0.5);

        setCampaigns(randomized);
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
      const response = await axios.get('http://localhost:5000/api/donations-raise-fund', {
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
        setMyWithdrawalRequests(userRequests);
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
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const filtered = campaigns.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCampaigns(filtered);
    } else {
      fetchCampaigns();
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Donations & Fundraising Campaigns
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Support meaningful causes and make a difference in people's lives
          </p>
        </div>

        {/* Tabs */}
        {user && (
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'browse'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Browse Campaigns
            </button>
            <button
              onClick={() => setActiveTab('myRequests')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'myRequests'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Filter className="inline w-4 h-4 mr-2" />
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Province
              </label>
              <select
                name="province"
                value={filters.province}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesData).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                disabled={!filters.province}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
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
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading campaigns...</p>
          </div>
        )}

        {/* Campaigns Grid */}
        {!loading && campaigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Campaign Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={campaign.images[0]?.url || campaign.images[0]}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {campaign.category}
                  </div>
                </div>

                {/* Campaign Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {campaign.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    By {campaign.organizer}
                  </p>

                  {/* Rating */}
                  {campaign.averageRating > 0 && (
                    <div className="mb-3">
                      {renderStars(campaign.averageRating)}
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300 font-semibold">
                        {campaign.totalDonatedHSC.toFixed(2)} HSC
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        of {campaign.requestedAmountHSC.toFixed(2)} HSC
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${calculateProgress(campaign.totalDonatedHSC, campaign.requestedAmountHSC)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {campaign.totalDonatedLKR.toLocaleString()}/{campaign.requestedAmountLKR.toLocaleString()} LKR
                    </p>
                  </div>

                  {/* Location */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    📍 {campaign.city}, {campaign.province}
                  </p>

                  {/* View More Button */}
                  <button
                    onClick={() => navigate(`/donations-raise-fund/${campaign._id}`)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && campaigns.length === 0 && (
          <div className="text-center py-12">
            <Heart className="mx-auto w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && campaigns.length > 0 && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        )}
          </>
        )}

        {/* My Withdrawal Requests Tab */}
        {activeTab === 'myRequests' && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : myWithdrawalRequests.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <Heart className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Withdrawal Requests
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You haven't requested any withdrawals yet
                </p>
              </div>
            ) : (
              myWithdrawalRequests.map((request) => {
                const statusBadge = getWithdrawalStatusBadge(request.withdrawalRequest.status);
                const StatusIcon = statusBadge.icon;

                return (
                  <div key={request._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {request.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Organizer: {request.organizer}
                          </p>
                        </div>
                        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusBadge.label}
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Raised</p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {request.totalDonatedHSC.toFixed(2)} HSC
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {request.totalDonatedLKR.toLocaleString()} LKR
                          </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Goal Amount</p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {request.requestedAmountHSC.toFixed(2)} HSC
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {request.requestedAmountLKR.toLocaleString()} LKR
                          </p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Donations</p>
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {request.donationCount}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {request.fundTransfers?.length || 0} transfers
                          </p>
                        </div>
                      </div>

                      {/* Request Details */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Requested On:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {new Date(request.withdrawalRequest.requestedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {request.withdrawalRequest.processedAt && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Processed On:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
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
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mt-4">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              Admin Note:
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {request.withdrawalRequest.adminNote}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* View Campaign Button */}
                      <button
                        onClick={() => navigate(`/donations-raise-fund/${request._id}`)}
                        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

