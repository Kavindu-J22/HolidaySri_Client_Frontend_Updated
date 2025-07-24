import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  DollarSign,
  AlertCircle,
  Calendar,
  User,
  Package
} from 'lucide-react';
import { userAPI } from '../config/api';

const HSCEarningsClaim = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('completed');
  const [hscEarnedData, setHscEarnedData] = useState({
    totals: {
      completed: 0,
      processing: 0,
      paidAsLKR: 0,
      paidAsHSC: 0,
      total: 0
    },
    records: {
      completed: [],
      processing: [],
      paidAsLKR: [],
      paidAsHSC: []
    },
    hscValue: 100,
    currency: 'LKR'
  });
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [displayCount, setDisplayCount] = useState(10);
  const RECORDS_PER_PAGE = 10;

  useEffect(() => {
    fetchHSCEarnedData();
    fetchBankDetails();
  }, []);

  const fetchHSCEarnedData = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getHSCEarned();
      setHscEarnedData(response.data);
    } catch (error) {
      console.error('Failed to fetch HSC earned data:', error);
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

  // Filter and sort records (newest first)
  const getFilteredRecords = () => {
    const statusMap = {
      'completed': 'completed',
      'processing': 'processing', 
      'paidAsLKR': 'paidAsLKR',
      'paidAsHSC': 'paidAsHSC'
    };
    
    return hscEarnedData.records[statusMap[activeTab]] || [];
  };

  const filteredRecords = getFilteredRecords();
  const displayedRecords = filteredRecords.slice(0, displayCount);

  const handleRecordSelect = (record) => {
    if (activeTab !== 'completed') return;
    
    setSelectedRecords(prev => {
      const isSelected = prev.find(r => r._id === record._id);
      if (isSelected) {
        return prev.filter(r => r._id !== record._id);
      } else {
        return [...prev, record];
      }
    });
  };

  const handleSelectAll = () => {
    if (activeTab !== 'completed') return;
    
    if (selectedRecords.length === displayedRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords([...displayedRecords]);
    }
  };

  const calculateSelectedTotal = () => {
    const hscTotal = selectedRecords.reduce((sum, record) => sum + record.earnedAmount, 0);
    const lkrTotal = Math.round(hscTotal * hscEarnedData.hscValue);
    return { hscTotal, lkrTotal };
  };

  const handleClaimSelected = async () => {
    if (selectedRecords.length === 0) {
      alert('Please select records to claim');
      return;
    }

    const { lkrTotal } = calculateSelectedTotal();
    
    if (lkrTotal < 5000) {
      alert(`Minimum claim amount is 5,000 LKR. Selected amount: ${lkrTotal.toLocaleString()} LKR`);
      return;
    }

    // Check bank details
    const hasBankDetails = bankDetails?.bank && bankDetails?.branch && 
                          bankDetails?.accountNo && bankDetails?.accountName;
    const hasBinanceId = bankDetails?.binanceId;

    if (!hasBankDetails && !hasBinanceId) {
      alert('Please complete your bank details or add Binance ID before claiming earnings');
      navigate('/profile', {
        state: {
          activeSection: 'bank',
          message: 'Please complete your bank details or add Binance ID to claim HSC earnings',
          returnTo: '/hsc-earnings-claim'
        }
      });
      return;
    }

    setClaiming(true);
    try {
      const recordIds = selectedRecords.map(record => record._id);
      const response = await userAPI.claimHSCEarned(recordIds);

      if (response.data.success) {
        alert(`${response.data.message}\n\nTotal claimed: ${response.data.claimRequest.totalLKRAmount.toLocaleString()} LKR\nHSC Amount: ${response.data.claimRequest.totalHSCAmount.toLocaleString()} HSC\nRecords count: ${response.data.claimRequest.earningsCount}`);

        // Switch to processing tab and refresh data
        setActiveTab('processing');
        setSelectedRecords([]);
        await fetchHSCEarnedData();
      }
    } catch (error) {
      console.error('Failed to claim HSC earnings:', error);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'processing': return 'text-yellow-600 dark:text-yellow-400';
      case 'paidAsLKR': return 'text-blue-600 dark:text-blue-400';
      case 'paidAsHSC': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'paidAsLKR': return <DollarSign className="w-4 h-4" />;
      case 'paidAsHSC': return <TrendingUp className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const { hscTotal, lkrTotal } = calculateSelectedTotal();

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
          HSC Earnings Claim
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your HSC earnings and submit withdrawal requests
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
            {hscEarnedData.totals.completed.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">HSC Available</p>
        </div>
        
        <div className="card p-6 text-center bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
            {hscEarnedData.totals.processing.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">HSC Processing</p>
        </div>
        
        <div className="card p-6 text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {hscEarnedData.totals.paidAsLKR.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">HSC Paid as LKR</p>
        </div>
        
        <div className="card p-6 text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {hscEarnedData.totals.paidAsHSC.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">HSC Paid as Tokens</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'completed', label: 'Completed', count: hscEarnedData.totals.completed },
              { key: 'processing', label: 'Processing', count: hscEarnedData.totals.processing },
              { key: 'paidAsLKR', label: 'Paid As LKR', count: hscEarnedData.totals.paidAsLKR },
              { key: 'paidAsHSC', label: 'Paid As HSC', count: hscEarnedData.totals.paidAsHSC }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSelectedRecords([]);
                  setDisplayCount(RECORDS_PER_PAGE);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label} ({tab.count.toLocaleString()})
              </button>
            ))}
          </nav>
        </div>

        {/* Selection and Claim Section for Completed Tab */}
        {activeTab === 'completed' && filteredRecords.length > 0 && (
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  {selectedRecords.length === displayedRecords.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedRecords.length > 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRecords.length} selected • {hscTotal.toLocaleString()} HSC • {lkrTotal.toLocaleString()} LKR
                  </div>
                )}
              </div>

              {selectedRecords.length > 0 && (
                <button
                  onClick={handleClaimSelected}
                  disabled={claiming || lkrTotal < 5000}
                  className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    lkrTotal >= 5000
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  } disabled:opacity-50`}
                >
                  {claiming ? 'Processing...' : `Claim Selected (Min. 5,000 LKR)`}
                </button>
              )}
            </div>

            {lkrTotal > 0 && lkrTotal < 5000 && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2" />
                  <span className="text-sm text-amber-700 dark:text-amber-300">
                    Minimum claim amount is 5,000 LKR. Current selection: {lkrTotal.toLocaleString()} LKR
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Records List */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading HSC earnings...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No {activeTab} records found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {activeTab === 'completed'
                  ? 'You don\'t have any completed HSC earnings yet.'
                  : `No ${activeTab} HSC earnings found.`
                }
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {displayedRecords.map((record) => (
                  <div
                    key={record._id}
                    className={`border rounded-lg p-4 transition-all duration-200 ${
                      activeTab === 'completed'
                        ? 'cursor-pointer hover:shadow-md'
                        : ''
                    } ${
                      selectedRecords.find(r => r._id === record._id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleRecordSelect(record)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {activeTab === 'completed' && (
                            <input
                              type="checkbox"
                              checked={!!selectedRecords.find(r => r._id === record._id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleRecordSelect(record);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                          )}
                          <div className={`flex items-center space-x-2 ${getStatusColor(activeTab)}`}>
                            {getStatusIcon(activeTab)}
                            <span className="font-medium text-sm capitalize">
                              {activeTab === 'paidAsLKR' ? 'Paid as LKR' :
                               activeTab === 'paidAsHSC' ? 'Paid as HSC' : activeTab}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">HSC Amount</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {record.earnedAmount.toLocaleString()} HSC
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">LKR Value</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {Math.round(record.earnedAmount * hscEarnedData.hscValue).toLocaleString()} LKR
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Category</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {record.category}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {formatDate(record.createdAt)}
                            </p>
                          </div>
                        </div>

                        {record.description && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {record.description}
                            </p>
                          </div>
                        )}

                        {record.buyerUserId && (
                          <div className="mt-3 flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Buyer: {record.buyerUserId.name} ({record.buyerUserId.email})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {displayCount < filteredRecords.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setDisplayCount(prev => prev + RECORDS_PER_PAGE)}
                    className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200"
                  >
                    Load More ({filteredRecords.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HSCEarningsClaim;
