import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  DollarSign, 
  Calendar,
  User,
  Package,
  AlertCircle,
  Loader
} from 'lucide-react';
import { userAPI } from '../config/api';

const ClaimEarnings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [earnings, setEarnings] = useState([]);
  const [totals, setTotals] = useState({
    pending: 0,
    processed: 0,
    paid: 0,
    total: 0
  });
  const [selectedEarnings, setSelectedEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [displayCount, setDisplayCount] = useState(10);
  const RECORDS_PER_PAGE = 10;

  useEffect(() => {
    fetchEarnings();
    fetchBankDetails();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getPromocodeEarnings();
      setEarnings(response.data.earnings);
      setTotals(response.data.totals);
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBankDetails = async () => {
    try {
      const response = await userAPI.getBankDetailsStatus();
      setBankDetails(response.data.bankDetails);
    } catch (error) {
      console.error('Failed to fetch bank details:', error);
    }
  };

  // Filter and sort earnings (last in, first out) - newest first for all tabs
  const allFilteredEarnings = earnings
    .filter(earning => earning.status === activeTab)
    .sort((a, b) => {
      // Use the most relevant date field based on status
      let dateA, dateB;

      if (activeTab === 'processed') {
        // For processed earnings, use processedAt if available, otherwise createdAt
        dateA = new Date(a.processedAt || a.createdAt);
        dateB = new Date(b.processedAt || b.createdAt);
      } else if (activeTab === 'paid') {
        // For paid earnings, use paidAt if available, otherwise processedAt, otherwise createdAt
        dateA = new Date(a.paidAt || a.processedAt || a.createdAt);
        dateB = new Date(b.paidAt || b.processedAt || b.createdAt);
      } else {
        // For pending earnings, use createdAt
        dateA = new Date(a.createdAt);
        dateB = new Date(b.createdAt);
      }

      // Sort in descending order (newest first)
      return dateB - dateA;
    });

  // Apply pagination
  const filteredEarnings = allFilteredEarnings.slice(0, displayCount);
  const hasMoreRecords = allFilteredEarnings.length > displayCount;

  const handleShowMore = () => {
    setDisplayCount(prev => prev + RECORDS_PER_PAGE);
  };

  // Reset display count when tab changes
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setDisplayCount(RECORDS_PER_PAGE);
  };

  const handleSelectEarning = (earning) => {
    if (activeTab !== 'pending') return;
    
    setSelectedEarnings(prev => {
      const isSelected = prev.find(e => e._id === earning._id);
      if (isSelected) {
        return prev.filter(e => e._id !== earning._id);
      } else {
        return [...prev, earning];
      }
    });
  };

  const selectedTotal = selectedEarnings.reduce((sum, earning) => sum + earning.amount, 0);
  const canClaim = selectedTotal >= 5000;

  const handleClaimSelected = async () => {
    if (!canClaim || claiming) return;

    setClaiming(true);
    try {
      const earningIds = selectedEarnings.map(earning => earning._id);
      const response = await userAPI.claimEarnings(earningIds);

      if (response.data.success) {
        // Show success message
        alert(`${response.data.message}\n\nTotal claimed: ${response.data.claimRequest.totalAmount.toLocaleString()} LKR\nEarnings count: ${response.data.claimRequest.earningsCount}`);

        // Switch to processed tab and refresh data
        setActiveTab('processed');
        setSelectedEarnings([]);
        await fetchEarnings();
      }
    } catch (error) {
      console.error('Failed to claim earnings:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit claim request. Please try again.';
      alert(errorMessage);
    } finally {
      setClaiming(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processed':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/hsc')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wallet
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Claim Earnings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your promocode earnings and submit claim requests
        </p>
      </div>

      {/* Bank Details Summary */}
      {bankDetails && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
            Payment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {bankDetails.bank && (
              <>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Bank:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{bankDetails.bank}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Branch:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{bankDetails.branch}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Account:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">****{bankDetails.accountNo?.slice(-4)}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Account Name:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{bankDetails.accountName}</span>
                </div>
              </>
            )}
            {bankDetails.binanceId && (
              <div className="md:col-span-2">
                <span className="text-gray-600 dark:text-gray-400">Binance ID:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{bankDetails.binanceId}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex flex-col sm:flex-row sm:space-x-8 px-4 sm:px-6">
            {[
              { key: 'pending', label: 'Pending', count: totals.pending, chipColor: 'bg-yellow-500' },
              { key: 'processed', label: 'Processing', count: totals.processed, chipColor: 'bg-blue-500' },
              { key: 'paid', label: 'Paid', count: totals.paid, chipColor: 'bg-green-500' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`py-3 sm:py-4 px-2 sm:px-2 border-b-2 font-medium text-sm transition-colors w-full sm:w-auto ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between sm:justify-center sm:space-x-2">
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tab.chipColor}`}>
                    <span className="text-white">{tab.count.toLocaleString()} LKR</span>
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Selection Summary for Pending Tab */}
        {activeTab === 'pending' && selectedEarnings.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-b border-orange-200 dark:border-orange-800 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedEarnings.length} item(s) selected
                </div>
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {selectedTotal.toLocaleString()} LKR
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                {canClaim ? (
                  <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Ready to claim
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Min. 5,000 LKR required
                  </div>
                )}
                <button
                  onClick={handleClaimSelected}
                  disabled={!canClaim || claiming}
                  className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 w-full sm:w-auto ${
                    canClaim && !claiming
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {claiming ? 'Processing...' : 'Claim Selected'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Earnings List */}
        <div className="p-6">
          {filteredEarnings.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No {activeTab} earnings
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {activeTab === 'pending'
                  ? 'You don\'t have any pending earnings to claim yet.'
                  : `No ${activeTab} earnings found.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEarnings.map((earning) => (
                <div
                  key={earning._id}
                  onClick={() => handleSelectEarning(earning)}
                  className={`border rounded-lg p-3 sm:p-4 transition-all duration-200 ${
                    activeTab === 'pending'
                      ? 'cursor-pointer hover:shadow-md'
                      : 'cursor-default'
                  } ${
                    selectedEarnings.find(e => e._id === earning._id)
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(earning.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(earning.status)}`}>
                            {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {earning.amount.toLocaleString()} LKR
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Buyer:</span>
                            <span className="ml-1 font-medium text-gray-900 dark:text-white">
                              {earning.buyerId?.name || earning.buyerEmail}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Item:</span>
                            <span className="ml-1 font-medium text-gray-900 dark:text-white">
                              {earning.item}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Date:</span>
                            <span className="ml-1 font-medium text-gray-900 dark:text-white">
                              {formatDate(earning.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Promo Code:</span>
                        <span className="ml-1 font-mono font-medium text-blue-600 dark:text-blue-400">
                          {earning.usedPromoCode}
                        </span>
                      </div>
                    </div>

                    {activeTab === 'pending' && (
                      <div className="mt-3 sm:mt-0 sm:ml-4 flex justify-end sm:justify-center">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedEarnings.find(e => e._id === earning._id)
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedEarnings.find(e => e._id === earning._id) && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Show More Records Button */}
              {hasMoreRecords && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleShowMore}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    Show More Records ({allFilteredEarnings.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">
                {totals.pending.toLocaleString()} LKR
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Processing</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                {totals.processed.toLocaleString()} LKR
              </p>
            </div>
            <Loader className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-400">Paid</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                {totals.paid.toLocaleString()} LKR
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimEarnings;
