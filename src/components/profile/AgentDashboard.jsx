import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, hscAPI, promoCodeAPI } from '../../config/api';
import {
  CreditCard,
  TrendingUp,
  Users,
  Eye,
  Edit,
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
  X,
  Power,
  PowerOff,
  Zap,
  Gift,
  Target,
  Crown,
  RefreshCw,
  ShoppingCart,
  Calculator,
  Clock
} from 'lucide-react';

const AgentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState(null);
  const [earningsData, setEarningsData] = useState([]);
  const [showEarnings, setShowEarnings] = useState(false);
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [earningsPage, setEarningsPage] = useState(1);
  const [earningsTotalPages, setEarningsTotalPages] = useState(1);
  const [earningsTotal, setEarningsTotal] = useState(0);
  const [loadingMoreEarnings, setLoadingMoreEarnings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [uploadingVerification, setUploadingVerification] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState({
    nicFront: false,
    nicBack: false,
    passport: false
  });
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellPrice, setSellPrice] = useState('');
  const [sellDescription, setSellDescription] = useState('');
  const [sellStep, setSellStep] = useState(1); // 1: Price, 2: Description
  const [hscValue, setHscValue] = useState(100); // Default HSC value
  const [sellAdFee, setSellAdFee] = useState(0); // HSC fee for selling advertisement
  const [showSellConfirm, setShowSellConfirm] = useState(false);
  const [sellProcessing, setSellProcessing] = useState(false);
  const [showSellSuccess, setShowSellSuccess] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [upgradeResult, setUpgradeResult] = useState(null);

  useEffect(() => {
    fetchAgentData();
    fetchHSCInfo();
    fetchSellAdFee();
  }, []);

  const fetchHSCInfo = async () => {
    try {
      const response = await hscAPI.getInfo();
      setHscValue(response.data.currentValue || 100);
    } catch (error) {
      console.error('Error fetching HSC info:', error);
    }
  };

  const fetchSellAdFee = async () => {
    try {
      const response = await promoCodeAPI.getConfig();
      setSellAdFee(response.data.sellAdFee || 0);
    } catch (error) {
      console.error('Error fetching sell ad fee:', error);
    }
  };

  const handleSellPayment = async () => {
    try {
      setSellProcessing(true);

      const response = await userAPI.sellPromocode(sellPrice, sellDescription);

      if (response.data.success) {
        setShowSellConfirm(false);
        setShowSellSuccess(true);
        setSellPrice('');
        setSellDescription('');
        setSellStep(1);

        // Refresh agent data
        await fetchAgentData();
      }
    } catch (error) {
      console.error('Sell payment error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to process payment. Please try again.';
      alert(errorMessage);
    } finally {
      setSellProcessing(false);
    }
  };

  const handleToggleSelling = async () => {
    try {
      const response = await userAPI.toggleSelling();

      if (response.data.success) {
        setShowStopConfirm(false);
        // Refresh agent data
        await fetchAgentData();
      }
    } catch (error) {
      console.error('Toggle selling error:', error);
      alert(error.response?.data?.message || 'Failed to update selling status');
    }
  };

  const handleEditSelling = async () => {
    try {
      const response = await userAPI.editSelling(sellPrice, sellDescription);

      if (response.data.success) {
        setShowEditModal(false);
        setSellPrice('');
        setSellDescription('');

        // Refresh agent data
        await fetchAgentData();
        alert('Selling details updated successfully!');
      }
    } catch (error) {
      console.error('Edit selling error:', error);
      alert(error.response?.data?.message || 'Failed to update selling details');
    }
  };

  const openEditModal = () => {
    setSellPrice(agentData.sellingPrice?.toString() || '');
    setSellDescription(agentData.sellingDescription || '');
    setShowEditModal(true);
  };

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

  // Helper function to mask email (show first 2 characters, rest as asterisks)
  const maskEmail = (email) => {
    if (!email || email.length < 2) return email;
    const [localPart, domain] = email.split('@');
    if (!domain) return email;

    const maskedLocal = localPart.substring(0, 2) + '*'.repeat(Math.max(0, localPart.length - 2));
    const maskedDomain = domain.substring(0, 2) + '*'.repeat(Math.max(0, domain.length - 2));
    return `${maskedLocal}@${maskedDomain}`;
  };

  const fetchEarningsRecords = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoadingEarnings(true);
      } else {
        setLoadingMoreEarnings(true);
      }

      const response = await userAPI.getAgentEarnings({ page, limit: 10 });

      const formattedEarnings = response.data.earnings.map(earning => ({
        id: earning._id,
        buyerEmail: earning.buyerEmail,
        maskedEmail: maskEmail(earning.buyerEmail), // Add masked email
        buyerName: earning.buyerId?.name || 'Unknown User', // Use buyer name if available
        amount: earning.amount,
        category: earning.category,
        item: earning.item,
        status: earning.status,
        createdAt: new Date(earning.createdAt)
      }));

      if (append) {
        setEarningsData(prev => [...prev, ...formattedEarnings]);
      } else {
        setEarningsData(formattedEarnings);
        setShowEarnings(true);
      }

      setEarningsPage(page);
      setEarningsTotalPages(response.data.totalPages);
      setEarningsTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      setError('Failed to load earnings records');
    } finally {
      setLoadingEarnings(false);
      setLoadingMoreEarnings(false);
    }
  };

  const loadMoreEarnings = () => {
    if (earningsPage < earningsTotalPages && !loadingMoreEarnings) {
      fetchEarningsRecords(earningsPage + 1, true);
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

      // Update uploaded documents state
      const docKey = documentType === 'NIC_FRONT' ? 'nicFront' :
                     documentType === 'NIC_BACK' ? 'nicBack' : 'passport';
      setUploadedDocuments(prev => ({ ...prev, [docKey]: true }));

      if (verificationResponse.data.verificationStatus === 'verified') {
        setVerificationSuccess(`${documentType} uploaded successfully! You are now verified!`);
        // Hide verification section and refresh data after verification
        setTimeout(async () => {
          setVerificationSuccess('');
          setShowVerification(false);
          await fetchAgentData(); // Refresh the agent data
        }, 2000);
      } else {
        // Just show success message but keep verification section open for more uploads
        let message = `${documentType} uploaded successfully! `;
        if (documentType === 'NIC_FRONT') {
          message += 'Please upload NIC back side to complete verification.';
        } else if (documentType === 'NIC_BACK') {
          message += 'Please upload NIC front side to complete verification.';
        } else {
          message += 'Verification pending.';
        }
        setVerificationSuccess(message);
        setTimeout(() => {
          setVerificationSuccess('');
          // Don't hide verification section, just refresh data
          fetchAgentData();
        }, 3000);
      }

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

  const handleToggleStatus = async () => {
    try {
      setTogglingStatus(true);
      const response = await userAPI.toggleAgentStatus();

      // Update agent data
      setAgentData(prev => ({ ...prev, isActive: response.data.isActive }));
      setShowStatusConfirm(false);

    } catch (error) {
      console.error('Error toggling status:', error);
      setError('Failed to update status. Please try again.');
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleUpgradeTier = async () => {
    try {
      setUpgrading(true);
      const response = await userAPI.upgradeAgentTier();

      setUpgradeResult({
        message: response.data.message,
        newTier: response.data.newTier,
        previousTier: response.data.previousTier
      });

      setShowUpgradeConfirm(false);
      setShowCongratulations(true);

      // Refresh agent data after upgrade
      setTimeout(async () => {
        await fetchAgentData();
      }, 1000);

    } catch (error) {
      console.error('Error upgrading tier:', error);
      setError(error.response?.data?.message || 'Failed to upgrade tier. Please try again.');
      setShowUpgradeConfirm(false);
    } finally {
      setUpgrading(false);
    }
  };

  // Check if promo code is expired
  const isPromoCodeExpired = () => {
    if (!agentData || !agentData.expirationDate) return false;
    return new Date(agentData.expirationDate) < new Date();
  };

  const getUpgradeInfo = () => {
    if (!agentData) return null;

    const { promoCodeType, usedCount } = agentData;

    switch (promoCodeType) {
      case 'free':
        return {
          nextTier: 'Silver',
          required: 700,
          current: usedCount,
          canUpgrade: usedCount >= 700,
          tip: `Promote ${700 - usedCount > 0 ? 700 - usedCount : 0} more ads and get Free Upgrade to Silver Promo Code`
        };
      case 'silver':
        return {
          nextTier: 'Gold',
          required: 1500,
          current: usedCount,
          canUpgrade: usedCount >= 1500,
          tip: `Promote ${1500 - usedCount > 0 ? 1500 - usedCount : 0} more ads and get Free Upgrade to Gold Promo Code`
        };
      case 'gold':
        return {
          nextTier: 'Diamond',
          required: 2500,
          current: usedCount,
          canUpgrade: usedCount >= 2500,
          tip: `Promote ${2500 - usedCount > 0 ? 2500 - usedCount : 0} more ads and get Free Upgrade to Diamond Promo Code`
        };
      default:
        return null;
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
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                  Upload Identity Document
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-4">
                  Upload both NIC front and back sides, OR upload your passport photo page
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center relative ${
                    uploadedDocuments.nicFront
                      ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                      : 'border-yellow-300 dark:border-yellow-600'
                  }`}>
                    {uploadedDocuments.nicFront && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVerificationUpload(e.target.files[0], 'NIC_FRONT')}
                      className="hidden"
                      id="nic-front-upload"
                      disabled={uploadingVerification || uploadedDocuments.nicFront}
                    />
                    <label htmlFor="nic-front-upload" className={uploadedDocuments.nicFront ? 'cursor-default' : 'cursor-pointer'}>
                      <Camera className={`w-8 h-8 mx-auto mb-2 ${
                        uploadedDocuments.nicFront
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        uploadedDocuments.nicFront
                          ? 'text-green-800 dark:text-green-300'
                          : 'text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {uploadedDocuments.nicFront ? 'NIC Front ✓' : 'Upload NIC Front'}
                      </p>
                      <p className={`text-xs ${
                        uploadedDocuments.nicFront
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {uploadedDocuments.nicFront ? 'Uploaded successfully' : 'Front side only'}
                      </p>
                    </label>
                  </div>

                  <div className={`border-2 border-dashed rounded-lg p-4 text-center relative ${
                    uploadedDocuments.nicBack
                      ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                      : 'border-yellow-300 dark:border-yellow-600'
                  }`}>
                    {uploadedDocuments.nicBack && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVerificationUpload(e.target.files[0], 'NIC_BACK')}
                      className="hidden"
                      id="nic-back-upload"
                      disabled={uploadingVerification || uploadedDocuments.nicBack}
                    />
                    <label htmlFor="nic-back-upload" className={uploadedDocuments.nicBack ? 'cursor-default' : 'cursor-pointer'}>
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${
                        uploadedDocuments.nicBack
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        uploadedDocuments.nicBack
                          ? 'text-green-800 dark:text-green-300'
                          : 'text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {uploadedDocuments.nicBack ? 'NIC Back ✓' : 'Upload NIC Back'}
                      </p>
                      <p className={`text-xs ${
                        uploadedDocuments.nicBack
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {uploadedDocuments.nicBack ? 'Uploaded successfully' : 'Back side only'}
                      </p>
                    </label>
                  </div>

                  <div className={`border-2 border-dashed rounded-lg p-4 text-center sm:col-span-2 lg:col-span-1 relative ${
                    uploadedDocuments.passport
                      ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                      : 'border-yellow-300 dark:border-yellow-600'
                  }`}>
                    {uploadedDocuments.passport && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVerificationUpload(e.target.files[0], 'PASSPORT')}
                      className="hidden"
                      id="passport-upload"
                      disabled={uploadingVerification || uploadedDocuments.passport}
                    />
                    <label htmlFor="passport-upload" className={uploadedDocuments.passport ? 'cursor-default' : 'cursor-pointer'}>
                      <Camera className={`w-8 h-8 mx-auto mb-2 ${
                        uploadedDocuments.passport
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        uploadedDocuments.passport
                          ? 'text-green-800 dark:text-green-300'
                          : 'text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {uploadedDocuments.passport ? 'Passport ✓' : 'Upload Passport (Alternative)'}
                      </p>
                      <p className={`text-xs ${
                        uploadedDocuments.passport
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {uploadedDocuments.passport ? 'Uploaded successfully' : 'Photo page only'}
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

      {/* Promo Code Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Status Toggle Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {isPromoCodeExpired() ? (
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              ) : agentData.isActive ? (
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Power className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <PowerOff className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Promo Code Status
                </h3>
                <p className={`text-sm font-medium ${
                  isPromoCodeExpired()
                    ? 'text-orange-600 dark:text-orange-400'
                    : agentData.isActive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {isPromoCodeExpired()
                    ? 'Expired'
                    : agentData.isActive
                    ? 'Active & Earning'
                    : 'Inactive'
                  }
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
            {isPromoCodeExpired()
              ? 'Your promo code has expired and is no longer active. Renew it to continue earning commissions.'
              : agentData.isActive
              ? 'Your promo code is active and customers can use it for discounts. You earn commissions on every use.'
              : 'Your promo code is inactive. Customers cannot use it for discounts and you won\'t earn commissions.'
            }
          </p>

          {isPromoCodeExpired() ? (
            <div className="space-y-3">
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                <p className="text-orange-800 dark:text-orange-300 text-sm font-medium text-center">
                  Renew your Promo Code to Activate
                </p>
              </div>
              <button
                onClick={() => navigate('/renew-promo-code')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Renew Promo Code</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowStatusConfirm(true)}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                agentData.isActive
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800'
                  : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800'
              }`}
            >
              {agentData.isActive ? (
                <>
                  <PowerOff className="w-4 h-4" />
                  <span>Deactivate Promo Code</span>
                </>
              ) : (
                <>
                  <Power className="w-4 h-4" />
                  <span>Activate Promo Code</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Upgrade Card */}
        {getUpgradeInfo() && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg p-6 border border-purple-200 dark:border-purple-800 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tier Upgrade Available
                  </h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                    {agentData.promoCodeType.toUpperCase()} → {getUpgradeInfo().nextTier.toUpperCase()}
                  </p>
                </div>
              </div>
              {getUpgradeInfo().canUpgrade && (
                <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded-full">
                  <Gift className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">FREE</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {getUpgradeInfo().current} / {getUpgradeInfo().required}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((getUpgradeInfo().current / getUpgradeInfo().required) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Tip */}
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 mb-4 flex-grow">
              <div className="flex items-start space-x-2">
                <Target className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">💡 Tip:</span> {getUpgradeInfo().tip}
                </p>
              </div>
            </div>

            {getUpgradeInfo().canUpgrade ? (
              <button
                onClick={() => setShowUpgradeConfirm(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4" />
                <span>Upgrade to {getUpgradeInfo().nextTier} - FREE!</span>
              </button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {getUpgradeInfo().required - getUpgradeInfo().current} more uses needed
                </p>
                <div className="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-3 rounded-lg font-medium">
                  Keep Promoting to Unlock
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upgrade with HSC Button - Always show */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-800 flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Instant Upgrade
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Upgrade to any tier with HSC
              </p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
            Don't want to wait? Upgrade your promo code instantly using your HSC balance and unlock higher earning potential right away.
          </p>

          <button
            onClick={() => navigate('/renew-promo-code?mode=upgrade')}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <DollarSign className="w-4 h-4" />
            <span>Upgrade with HSC</span>
          </button>
        </div>

        {/* Sell Your Promocode Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sell Your Promocode
                </h3>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  {agentData.isSelling ? 'Listed for Sale' : 'Not Selling'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-grow mb-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {agentData.promoCodeType === 'free'
                ? 'Free promocodes cannot be sold. Upgrade to a paid tier to enable selling.'
                : agentData.isSelling
                  ? `Your promocode is listed for sale at ${agentData.sellingPrice || 0} HSC. Listed on ${agentData.sellingListedAt ? new Date(agentData.sellingListedAt).toLocaleDateString() : 'N/A'}. You can turn off selling anytime.`
                  : 'List your promocode for sale and let other users purchase it. Set your own price in HSC.'
              }
            </p>
          </div>

          {agentData.promoCodeType === 'free' ? (
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Free Promocodes Can't Be Sold</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
                Upgrade to Silver, Gold, or Diamond tier to enable selling
              </p>
            </div>
          ) : agentData.isSelling ? (
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-800 dark:text-green-300 text-sm font-medium">
                    Selling Price: {agentData.sellingPrice || 0} HSC
                  </span>
                  <span className="text-green-600 dark:text-green-400 text-xs">
                    ≈ {((agentData.sellingPrice || 0) * hscValue).toLocaleString()} LKR
                  </span>
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  Listed: {agentData.sellingListedAt ? new Date(agentData.sellingListedAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => navigate('/selling-platform')}
                  className="flex items-center justify-center space-x-1 px-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-xs"
                >
                  <Eye className="w-3 h-3" />
                  <span>Platform</span>
                </button>
                <button
                  onClick={openEditModal}
                  className="flex items-center justify-center space-x-1 px-2 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors text-xs"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setShowStopConfirm(true)}
                  className="flex items-center justify-center space-x-1 px-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-xs"
                >
                  <PowerOff className="w-3 h-3" />
                  <span>Stop</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowSellModal(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Sell Your Promocode</span>
            </button>
          )}
        </div>
      </div>

      {/* Earnings Records Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Earning Records
          </h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            {/* Claim Earnings Button */}
            <button
              onClick={() => navigate('/hsc')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto"
            >
              <Gift className="w-4 h-4" />
              <span>Claim Earnings</span>
            </button>

            {/* View/Hide Records Button */}
            {!showEarnings ? (
              <button
                onClick={() => fetchEarningsRecords()}
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
        </div>

        {showEarnings && (
          <div className="space-y-4">
            {/* Pagination Info */}
            {earningsTotal > 0 && (
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>
                  Showing {earningsData.length} of {earningsTotal} records
                </span>
                <span>
                  Page {earningsPage} of {earningsTotalPages}
                </span>
              </div>
            )}

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
                        <div>
                          <div className="font-medium">{earning.buyerName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{earning.maskedEmail}</div>
                        </div>
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
                        {earning.buyerName}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {earning.maskedEmail}
                      </p>
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

            {/* Show More Button */}
            {earningsPage < earningsTotalPages && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreEarnings}
                  disabled={loadingMoreEarnings}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMoreEarnings ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Show More ({earningsTotal - earningsData.length} remaining)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* No more records message */}
            {earningsPage >= earningsTotalPages && earningsData.length > 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  All records loaded ({earningsTotal} total)
                </p>
              </div>
            )}

            {/* No records message */}
            {earningsData.length === 0 && !loadingEarnings && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <DollarSign className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Earnings Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Start promoting your promo code to earn commissions!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Toggle Confirmation Modal */}
      {showStatusConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                agentData.isActive
                  ? 'bg-red-100 dark:bg-red-900/20'
                  : 'bg-green-100 dark:bg-green-900/20'
              }`}>
                {agentData.isActive ? (
                  <PowerOff className="w-8 h-8 text-red-600 dark:text-red-400" />
                ) : (
                  <Power className="w-8 h-8 text-green-600 dark:text-green-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {agentData.isActive ? 'Deactivate Promo Code?' : 'Activate Promo Code?'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {agentData.isActive
                  ? 'When inactive, customers can\'t use your promo code for discounts and you won\'t earn commissions. You can reactivate it anytime.'
                  : 'When active, customers can use your promo code for discounts and you\'ll earn commissions on every use.'
                }
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowStatusConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleStatus}
                disabled={togglingStatus}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  agentData.isActive
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {togglingStatus ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  agentData.isActive ? 'Deactivate' : 'Activate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Confirmation Modal */}
      {showUpgradeConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Upgrade to {getUpgradeInfo()?.nextTier}?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Congratulations! You've earned enough uses to upgrade your promo code tier for FREE!
              </p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-purple-700 dark:text-purple-300">
                  <Gift className="w-5 h-5" />
                  <span className="font-semibold">FREE UPGRADE</span>
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                  {agentData.promoCodeType.toUpperCase()} → {getUpgradeInfo()?.nextTier.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowUpgradeConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={handleUpgradeTier}
                disabled={upgrading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50"
              >
                {upgrading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Upgrading...</span>
                  </div>
                ) : (
                  'Upgrade Now!'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Congratulations Modal */}
      {showCongratulations && upgradeResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6 animate-bounce">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🎉 Congratulations!
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                {upgradeResult.message}
              </p>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">From</div>
                    <div className="font-bold text-gray-900 dark:text-white uppercase">
                      {upgradeResult.previousTier}
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                  <div className="text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">To</div>
                    <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase">
                      {upgradeResult.newTier}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCongratulations(false);
                  setUpgradeResult(null);
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                Awesome! Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Promocode Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-2xl p-6 text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {sellStep === 1 ? 'Set Selling Price' : 'Add Description (Optional)'}
              </h3>
              <p className="text-white text-opacity-90 text-sm">
                {sellStep === 1 ? 'Set your selling price in HSC' : 'Add a description to attract buyers'}
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              {sellStep === 1 ? (
                // Step 1: Price
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selling Price (HSC)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      placeholder="Enter price in HSC"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">HSC</span>
                    </div>
                  </div>
                  {sellPrice && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700 dark:text-blue-300">LKR Equivalent:</span>
                        <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                          {(parseFloat(sellPrice || 0) * hscValue).toLocaleString()} LKR
                        </span>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Based on current HSC rate: {hscValue} LKR per HSC
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Step 2: Description
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selling Description (Optional)
                  </label>
                  <textarea
                    value={sellDescription}
                    onChange={(e) => setSellDescription(e.target.value)}
                    placeholder="Describe your promocode to attract buyers (optional)"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    A good description can help your promocode sell faster
                  </p>
                </div>
              )}

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Important Note</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {sellStep === 1
                    ? "You'll need to pay an advertisement fee to list your promocode for sale."
                    : "You can skip adding a description if you prefer. The price is the most important factor."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    if (sellStep === 1) {
                      setShowSellModal(false);
                      setSellPrice('');
                      setSellDescription('');
                      setSellStep(1);
                    } else {
                      setSellStep(1);
                    }
                  }}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                >
                  {sellStep === 1 ? 'Cancel' : 'Back'}
                </button>
                <button
                  onClick={() => {
                    if (sellStep === 1) {
                      if (sellPrice && parseFloat(sellPrice) > 0) {
                        setSellStep(2);
                      }
                    } else {
                      setShowSellModal(false);
                      setShowSellConfirm(true);
                    }
                  }}
                  disabled={sellStep === 1 && (!sellPrice || parseFloat(sellPrice) <= 0)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {sellStep === 1 ? 'Next' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sell Confirmation Modal */}
      {showSellConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-t-2xl p-6 text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Confirm Payment</h3>
              <p className="text-white text-opacity-90 text-sm">Pay advertisement fee to list your promocode</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Transaction Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-400">Selling Price:</span>
                    <span className="font-semibold text-blue-800 dark:text-blue-200">
                      {sellPrice} HSC (≈ {(parseFloat(sellPrice || 0) * hscValue).toLocaleString()} LKR)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-400">Advertisement Fee:</span>
                    <span className="font-semibold text-blue-800 dark:text-blue-200">
                      {sellAdFee} HSC (≈ {(sellAdFee * hscValue).toLocaleString()} LKR)
                    </span>
                  </div>
                  <div className="border-t border-blue-200 dark:border-blue-700 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-400">Your HSC Balance:</span>
                      <span className="font-semibold text-blue-800 dark:text-blue-200">
                        {user?.hscBalance || 0} HSC
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Payment Required</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  You need to pay <strong>{sellAdFee} HSC</strong> to post your promocode for sale.
                  This fee will be deducted from your HSC balance.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    setShowSellConfirm(false);
                    setSellPrice('');
                  }}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSellPayment}
                  disabled={sellProcessing || (user?.hscBalance || 0) < sellAdFee}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {sellProcessing ? 'Processing...' :
                   (user?.hscBalance || 0) < sellAdFee ? 'Insufficient HSC Balance' :
                   `Pay ${sellAdFee} HSC`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sell Success Modal */}
      {showSellSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-2xl p-6 text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
              <p className="text-white text-opacity-90 text-sm">Your promocode is now listed for sale</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <ShoppingCart className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="font-medium text-green-800 dark:text-green-300">Promocode Listed Successfully</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Your promocode <strong>{agentData?.promoCode}</strong> is now available for purchase by other users.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 text-left">
                    <li>• Your promocode appears in the marketplace</li>
                    <li>• Users can purchase it at your set price</li>
                    <li>• You can turn off selling anytime</li>
                    <li>• Payment will be processed automatically</li>
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowSellSuccess(false)}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Awesome! Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Selling Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl p-6 text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Edit Selling Details</h3>
              <p className="text-white text-opacity-90 text-sm">Update your price and description</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selling Price (HSC)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    placeholder="Enter price in HSC"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">HSC</span>
                  </div>
                </div>
                {sellPrice && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700 dark:text-blue-300">LKR Equivalent:</span>
                      <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                        {(parseFloat(sellPrice || 0) * hscValue).toLocaleString()} LKR
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selling Description (Optional)
                </label>
                <textarea
                  value={sellDescription}
                  onChange={(e) => setSellDescription(e.target.value)}
                  placeholder="Describe your promocode to attract buyers (optional)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSellPrice('');
                    setSellDescription('');
                  }}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSelling}
                  disabled={!sellPrice || parseFloat(sellPrice) <= 0}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Update Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stop Selling Confirmation Modal */}
      {showStopConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-t-2xl p-6 text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <PowerOff className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Stop Selling</h3>
              <p className="text-white text-opacity-90 text-sm">Remove your promocode from the selling platform</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-300">Important Information</span>
                </div>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• Your promocode will be removed from the selling platform</li>
                  <li>• If you want to sell again, you'll need to pay the advertisement fee again</li>
                  <li>• This action cannot be undone</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Current Listing Details</h4>
                <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <div>Price: {agentData?.sellingPrice || 0} HSC</div>
                  <div>Listed: {agentData?.sellingListedAt ? new Date(agentData.sellingListedAt).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowStopConfirm(false)}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                >
                  Keep Selling
                </button>
                <button
                  onClick={handleToggleSelling}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Stop Selling
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
