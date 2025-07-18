import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../config/api';
import {
  CreditCard,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  DollarSign,
  Award,
  ArrowRight,
  Loader,
  AlertCircle,
  Star,
  Copy,
  Check,
  Shield,
  Upload,
  Camera,
  CheckCircle,
  X
} from 'lucide-react';

const AgentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState(null);
  const [earningsData, setEarningsData] = useState([]);
  const [showEarnings, setShowEarnings] = useState(false);
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [uploadingVerification, setUploadingVerification] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState('');

  useEffect(() => {
    fetchAgentData();
  }, []);

  const fetchAgentData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await userAPI.getAgentDashboard();

      if (response.data.isAgent) {
        setAgentData(response.data.agentData);
      } else {
        setAgentData(null);
      }

    } catch (error) {
      console.error('Error fetching agent data:', error);
      setError('Failed to load agent data');
      setAgentData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchEarningsRecords = async () => {
    try {
      setLoadingEarnings(true);
      const response = await userAPI.getAgentEarnings({ page: 1, limit: 10 });

      const formattedEarnings = response.data.earnings.map(earning => ({
        id: earning._id,
        buyerEmail: earning.buyerEmail,
        amount: earning.amount,
        category: earning.category,
        item: earning.item,
        status: earning.status,
        createdAt: new Date(earning.createdAt)
      }));

      setEarningsData(formattedEarnings);
      setShowEarnings(true);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      setError('Failed to load earnings records');
    } finally {
      setLoadingEarnings(false);
    }
  };

  const copyPromoCode = () => {
    if (agentData?.promoCode) {
      navigator.clipboard.writeText(agentData.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerificationUpload = async (file, documentType) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingVerification(true);
      setError('');

      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'daa9e83as');

      // Upload to Cloudinary
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      // Submit verification to backend
      const verificationResponse = await userAPI.submitAgentVerification({
        documentType,
        documentUrl: data.secure_url
      });

      setVerificationSuccess(`${documentType} uploaded successfully! ${verificationResponse.data.verificationStatus === 'verified' ? 'You are now verified!' : 'Verification pending.'}`);

      // Refresh agent data to get updated verification status
      setTimeout(async () => {
        setVerificationSuccess('');
        setShowVerification(false);
        await fetchAgentData(); // Refresh the agent data
      }, 2000);

    } catch (error) {
      console.error('Error uploading verification document:', error);
      setError('Failed to upload document. Please try again.');
    } finally {
      setUploadingVerification(false);
    }
  };

  const getPromoTypeColor = (type) => {
    switch (type) {
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'diamond': return 'from-blue-400 to-purple-600';
      case 'free': return 'from-green-400 to-green-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'processed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // Non-agent state
  if (!agentData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            You're Not Our Agent Yet
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join our exclusive agent network and start earning money by promoting travel packages and services. 
            Get your own promo code and earn commissions on every successful referral.
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Agent Benefits
            </h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Earn up to 15% commission</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Get your unique promo code</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Track your earnings in real-time</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Monthly bonus rewards</span>
              </li>
            </ul>
          </div>
          
          <button
            onClick={() => navigate('/promo-codes-travel-agents')}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Award className="w-5 h-5" />
            <span>Become an Agent Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Agent dashboard
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Agent Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your performance and manage your agent activities
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      {/* Agent Verification Section */}
      {!agentData.isVerified && (
        <div className="mb-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                    Agent Verification Required
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Verify your identity to get the verified badge
                  </p>
                </div>
              </div>
              {!showVerification && (
                <button
                  onClick={() => setShowVerification(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors w-full sm:w-auto justify-center"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify Now</span>
                </button>
              )}
            </div>

            {showVerification && (
              <div className="border-t border-yellow-200 dark:border-yellow-700 pt-4">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-4">
                  Upload Identity Document
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border-2 border-dashed border-yellow-300 dark:border-yellow-600 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVerificationUpload(e.target.files[0], 'NIC_FRONT')}
                      className="hidden"
                      id="nic-front-upload"
                      disabled={uploadingVerification}
                    />
                    <label htmlFor="nic-front-upload" className="cursor-pointer">
                      <Camera className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Upload NIC Front
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        Front side only
                      </p>
                    </label>
                  </div>

                  <div className="border-2 border-dashed border-yellow-300 dark:border-yellow-600 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVerificationUpload(e.target.files[0], 'NIC_BACK')}
                      className="hidden"
                      id="nic-back-upload"
                      disabled={uploadingVerification}
                    />
                    <label htmlFor="nic-back-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Upload NIC Back
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        Back side only
                      </p>
                    </label>
                  </div>

                  <div className="border-2 border-dashed border-yellow-300 dark:border-yellow-600 rounded-lg p-4 text-center sm:col-span-2 lg:col-span-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVerificationUpload(e.target.files[0], 'PASSPORT')}
                      className="hidden"
                      id="passport-upload"
                      disabled={uploadingVerification}
                    />
                    <label htmlFor="passport-upload" className="cursor-pointer">
                      <Camera className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Upload Passport (Alternative)
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        Photo page only
                      </p>
                    </label>
                  </div>
                </div>

                {uploadingVerification && (
                  <div className="flex items-center justify-center space-x-2 mt-4 text-yellow-700 dark:text-yellow-400">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Uploading document...</span>
                  </div>
                )}

                {verificationSuccess && (
                  <div className="flex items-center space-x-2 mt-4 text-green-700 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>{verificationSuccess}</span>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowVerification(false)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Promo Code Card */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Promo Code
        </h2>
        
        <div className={`relative bg-gradient-to-r ${getPromoTypeColor(agentData.promoCodeType)} rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-2xl transform hover:scale-95 transition-transform duration-200`}>
          {/* Card Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-white/80 text-sm uppercase tracking-wider">
                    {agentData.promoCodeType} Agent
                  </p>
                  {agentData.isVerified && (
                    <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3 text-green-300" />
                      <span className="text-xs text-green-300 font-medium">Verified</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {agentData.promoCode}
                </h3>
              </div>
              <button
                onClick={copyPromoCode}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                {copied ? (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="text-xs sm:text-sm">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-white/80 text-xs sm:text-sm">Owner</p>
                <p className="font-semibold text-sm sm:text-base truncate">{user?.name}</p>
              </div>
              <div>
                <p className="text-white/80 text-xs sm:text-sm">Status</p>
                <p className="font-semibold text-sm sm:text-base">
                  {agentData.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <div>
                <p className="text-white/80 text-xs sm:text-sm">Expires</p>
                <p className="font-semibold text-sm sm:text-base">
                  {new Date(agentData.expirationDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                <span className="text-xs sm:text-sm capitalize">{agentData.promoCodeType} Tier</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              LKR {agentData.totalEarnings.toLocaleString()}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Total Earnings
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            Lifetime commission earned
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              {agentData.totalReferrals}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Total Referrals
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            People you've referred
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              {agentData.usedCount}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Used Count
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            Times your code was used
          </p>
        </div>
      </div>

      {/* Earnings Records Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Earning Records
          </h3>
          {!showEarnings ? (
            <button
              onClick={fetchEarningsRecords}
              disabled={loadingEarnings}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
            >
              {loadingEarnings ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>View Records</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setShowEarnings(false)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors w-full sm:w-auto"
            >
              <span>Hide Records</span>
            </button>
          )}
        </div>

        {showEarnings && (
          <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Buyer
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Item
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData.map((earning) => (
                    <tr key={earning.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {earning.buyerEmail}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {earning.item}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        LKR {earning.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(earning.status)}`}>
                          {earning.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {earning.createdAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {earningsData.map((earning) => (
                <div key={earning.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {earning.buyerEmail}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {earning.item}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(earning.status)} ml-2`}>
                      {earning.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      LKR {earning.amount.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {earning.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
