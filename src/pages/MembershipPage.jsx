import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Star,
  Check,
  Loader,
  AlertCircle,
  Calendar,
  Coins,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { membershipAPI, commercialPartnerAPI } from '../config/api';
import MembershipSuccessModal from '../components/MembershipSuccessModal';

const MembershipPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [membershipConfig, setMembershipConfig] = useState(null);
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState(null);
  const [partnerStatus, setPartnerStatus] = useState(null);

  useEffect(() => {
    fetchMembershipData();
  }, []);

  const fetchMembershipData = async () => {
    try {
      setLoading(true);
      const [configResponse, statusResponse, partnerStatusResponse] = await Promise.all([
        membershipAPI.getConfig(),
        user ? membershipAPI.getStatus() : Promise.resolve({ data: null }),
        user ? commercialPartnerAPI.getStatus() : Promise.resolve({ data: null })
      ]);

      setMembershipConfig(configResponse.data);
      if (statusResponse.data) {
        setMembershipStatus(statusResponse.data);
      }
      if (partnerStatusResponse.data) {
        setPartnerStatus(partnerStatusResponse.data);
      }
    } catch (error) {
      console.error('Error fetching membership data:', error);
      setError('Failed to load membership information');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setPurchasing(true);
      setError('');

      const response = await membershipAPI.purchase({ membershipType: selectedPlan });

      // Store purchase result and show success modal
      setPurchaseResult({
        membershipType: selectedPlan,
        features: membershipConfig.features,
        ...response.data
      });
      setShowSuccessModal(true);

      // Refresh user data to show membership status in profile
      await refreshUser();
      
    } catch (error) {
      console.error('Purchase error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to purchase membership. Please try again.');
      }
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!membershipConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Failed to load membership information</p>
        </div>
      </div>
    );
  }

  // If user is a commercial partner, show special message
  if (partnerStatus?.isPartner && partnerStatus?.partnerDetails) {
    const expirationDate = new Date(partnerStatus.partnerExpirationDate);
    const isExpired = expirationDate < new Date();

    if (!isExpired) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              You're Already a Commercial Partner!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No need to become a member - you already enjoy benefits more than a member
            </p>
          </div>

          <div className="card p-8 text-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <img
                src={partnerStatus.partnerDetails.businessLogo}
                alt={partnerStatus.partnerDetails.companyName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {partnerStatus.partnerDetails.companyName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Commercial Partner
                </p>
              </div>
            </div>

            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              <Crown className="w-4 h-4 mr-2" />
              Active Commercial Partner
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Valid until {expirationDate.toLocaleDateString()}
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                🎉 You Enjoy Premium Commercial Benefits
              </h4>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                As a Commercial Partner, you have access to all membership benefits and much more:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-700 dark:text-blue-300 text-sm">All membership benefits included</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-700 dark:text-blue-300 text-sm">Enhanced business visibility</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-700 dark:text-blue-300 text-sm">Premium listing features</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-700 dark:text-blue-300 text-sm">Priority customer support</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-700 dark:text-blue-300 text-sm">Access to exclusive business tools</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-700 dark:text-blue-300 text-sm">Advanced analytics and insights</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Continue enjoying your premium commercial partner benefits!
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/ads/opportunities/partnerships')}
                className="btn-secondary"
              >
                View Partner Dashboard
              </button>
              <button
                onClick={() => navigate('/post-advertisement')}
                className="btn-primary"
              >
                Post Advertisement
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // If user is already a member
  if (membershipStatus?.isMember) {
    const expirationDate = new Date(membershipStatus.membershipExpirationDate);
    const isExpired = expirationDate < new Date();

    // If expired, don't show as member - let them purchase again
    if (isExpired) {
      // Reset membership status locally and continue to show purchase options
      setMembershipStatus(prev => ({
        ...prev,
        isMember: false,
        membershipType: null,
        membershipStartDate: null,
        membershipExpirationDate: null
      }));
    } else {
      // Show active membership page
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              You are a Holidaysri Member!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Enjoying premium benefits as a {membershipStatus.membershipType} member
            </p>
          </div>

          <div className="card p-8 text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <Crown className="w-4 h-4 mr-2" />
              Active Member
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {membershipStatus.membershipType?.charAt(0).toUpperCase() + membershipStatus.membershipType?.slice(1)} Plan
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Valid until {expirationDate.toLocaleDateString()}
            </p>

            <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4">
                🎉 Enjoy Your Premium Benefits
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {membershipConfig.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-primary-700 dark:text-primary-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Thank you for being a valued Holidaysri member!
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="btn-secondary"
              >
                View Profile
              </button>
              <button
                onClick={() => navigate('/post-advertisement')}
                className="btn-primary"
              >
                Post Advertisement
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  const monthlyHSC = Math.ceil(membershipConfig.monthlyCharge / membershipConfig.hscValue);
  const yearlyHSC = Math.ceil(membershipConfig.yearlyCharge / membershipConfig.hscValue);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Become a Holidaysri Member
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Unlock premium benefits and take your business to the next level with enhanced visibility and exclusive features
        </p>
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Premium Member Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {membershipConfig.features.map((feature, index) => (
            <div key={index} className="card p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-gray-900 dark:text-white font-medium">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Choose Your Plan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className={`card p-8 relative cursor-pointer transition-all duration-200 ${
            selectedPlan === 'monthly' 
              ? 'ring-2 ring-primary-500 shadow-lg' 
              : 'hover:shadow-lg'
          }`} onClick={() => setSelectedPlan('monthly')}>
            <div className="text-center">
              <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Monthly Plan</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {membershipConfig.monthlyCharge.toLocaleString()} LKR
                </span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {monthlyHSC} HSC
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Current HSC Rate: {membershipConfig.hscValue} LKR
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPlan === 'monthly' 
                    ? 'bg-primary-500 border-primary-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`} />
              </div>
            </div>
          </div>

          {/* Yearly Plan */}
          <div className={`card p-8 relative cursor-pointer transition-all duration-200 ${
            selectedPlan === 'yearly' 
              ? 'ring-2 ring-primary-500 shadow-lg' 
              : 'hover:shadow-lg'
          }`} onClick={() => setSelectedPlan('yearly')}>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Best Value
              </span>
            </div>
            <div className="text-center">
              <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Yearly Plan</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {membershipConfig.yearlyCharge.toLocaleString()} LKR
                </span>
                <span className="text-gray-600 dark:text-gray-400">/year</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {yearlyHSC} HSC
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Current HSC Rate: {membershipConfig.hscValue} LKR
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPlan === 'yearly' 
                    ? 'bg-primary-500 border-primary-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Purchase Section */}
      <div className="text-center">
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {user ? (
              <>Your current HSC balance: <span className="font-semibold">{membershipStatus?.hscBalance || 0} HSC</span></>
            ) : (
              'Please login to purchase membership'
            )}
          </p>
          {user && membershipStatus && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Required: {selectedPlan === 'monthly' ? monthlyHSC : yearlyHSC} HSC
            </p>
          )}
        </div>

        <button
          onClick={handlePurchase}
          disabled={purchasing || (!user)}
          className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {purchasing ? (
            <div className="flex items-center space-x-2">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : user ? (
            `Join Now - ${selectedPlan === 'monthly' ? monthlyHSC : yearlyHSC} HSC`
          ) : (
            'Login to Join'
          )}
        </button>

        {!user && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <button 
              onClick={() => navigate('/login')} 
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Login
            </button> or <button 
              onClick={() => navigate('/register')} 
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Register
            </button> to get started
          </p>
        )}
      </div>

      {/* Success Modal */}
      <MembershipSuccessModal
        isOpen={showSuccessModal}
        onClose={async () => {
          setShowSuccessModal(false);
          // Refresh membership data after modal is closed
          await fetchMembershipData();
        }}
        membershipType={purchaseResult?.membershipType}
        features={purchaseResult?.features}
      />
    </div>
  );
};

export default MembershipPage;
