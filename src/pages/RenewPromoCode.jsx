import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, promoCodeAPI } from '../config/api';
import {
  RefreshCw,
  ArrowUp,
  Star,
  Crown,
  Zap,
  Gift,
  DollarSign,
  Calendar,
  AlertCircle,
  Check,
  Loader,
  ArrowLeft,
  Copy,
  Tag
} from 'lucide-react';

const RenewPromoCode = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const upgradeMode = searchParams.get('mode') === 'upgrade';
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState(null);
  const [promoConfig, setPromoConfig] = useState(null);
  const [selectedOption, setSelectedOption] = useState(upgradeMode ? 'upgrade' : 'renew'); // 'renew' or 'upgrade'
  const [selectedTier, setSelectedTier] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  // Recalculate final amount when renewal option or tier changes
  useEffect(() => {
    if (appliedPromoCode && discountAmount > 0) {
      const basePrice = calculatePrice();
      setFinalAmount(Math.max(0, basePrice - discountAmount));
    } else {
      setFinalAmount(calculatePrice());
    }
  }, [selectedOption, selectedTier, appliedPromoCode, discountAmount, promoConfig, agentData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch agent data
      const agentResponse = await userAPI.getAgentDashboard();
      if (!agentResponse.data.isAgent) {
        navigate('/profile');
        return;
      }
      
      setAgentData(agentResponse.data.agentData);

      // Fetch promo code configuration
      const configResponse = await promoCodeAPI.getConfig();
      setPromoConfig(configResponse.data);
      
      // Set default selected tier for upgrade
      const currentTier = agentResponse.data.agentData.promoCodeType;
      if (currentTier === 'free') setSelectedTier('silver');
      else if (currentTier === 'silver') setSelectedTier('gold');
      else if (currentTier === 'gold') setSelectedTier('diamond');
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load renewal options');
    } finally {
      setLoading(false);
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'silver': return <Star className="w-6 h-6" />;
      case 'gold': return <Crown className="w-6 h-6" />;
      case 'diamond': return <Zap className="w-6 h-6" />;
      default: return <Gift className="w-6 h-6" />;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'diamond': return 'from-purple-400 to-purple-600';
      default: return 'from-green-400 to-green-600';
    }
  };

  const getCurrentTierData = () => {
    if (!promoConfig || !agentData) return null;
    return promoConfig.promoTypes?.[agentData.promoCodeType];
  };

  const getSelectedTierData = () => {
    if (!promoConfig || !selectedTier) return null;
    return promoConfig.promoTypes?.[selectedTier];
  };

  const calculatePrice = () => {
    if (selectedOption === 'renew') {
      const currentTierData = getCurrentTierData();
      return currentTierData ? currentTierData.priceInHSC : 0;
    } else {
      const selectedTierData = getSelectedTierData();
      return selectedTierData ? selectedTierData.priceInHSC : 0;
    }
  };

  // Get available upgrade options
  const getAvailableUpgrades = () => {
    if (!agentData) return [];

    const currentTier = agentData.promoCodeType;
    const tierHierarchy = ['free', 'silver', 'gold', 'diamond'];
    const currentIndex = tierHierarchy.indexOf(currentTier);

    if (currentIndex === -1 || currentIndex === tierHierarchy.length - 1) {
      return []; // No upgrades available
    }

    return tierHierarchy.slice(currentIndex + 1);
  };

  const validatePromoCode = async () => {
    if (!promoCodeInput.trim()) {
      setError('Please enter a promo code');
      return;
    }

    try {
      setValidatingPromo(true);
      setError('');
      
      const response = await promoCodeAPI.validatePromoCode(promoCodeInput.toUpperCase());
      
      if (response.data.isValid && response.data.isActive) {
        setAppliedPromoCode(promoCodeInput.toUpperCase());

        // Calculate discount based on promo config (use HSC discount value)
        const discountConfig = promoConfig?.discounts;
        const discount = discountConfig ? discountConfig.purchaseDiscountInHSC : 0;

        setDiscountAmount(discount);
        setSuccess(`Promo code applied! You saved ${discount} HSC`);
        // Final amount will be recalculated by useEffect
      } else {
        setError('Invalid or inactive promo code');
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      setError('Failed to validate promo code. Please try again.');
    } finally {
      setValidatingPromo(false);
    }
  };

  const applyUsedPromoCode = async () => {
    if (agentData.usedPromoCode) {
      setPromoCodeInput(agentData.usedPromoCode);

      // Automatically validate the promo code
      try {
        setValidatingPromo(true);
        setError('');

        const response = await promoCodeAPI.validatePromoCode(agentData.usedPromoCode);

        if (response.data.isValid && response.data.isActive) {
          setAppliedPromoCode(agentData.usedPromoCode);

          // Calculate discount based on promo config (use HSC discount value)
          const discountConfig = promoConfig?.discounts;
          const discount = discountConfig ? discountConfig.purchaseDiscountInHSC : 0;

          setDiscountAmount(discount);
          setSuccess(`Promo code applied! You saved ${discount} HSC`);
          // Final amount will be recalculated by useEffect
        } else {
          setError('Your first promo code is no longer valid or active');
          setPromoCodeInput('');
        }
      } catch (error) {
        console.error('Error validating used promo code:', error);
        setError('Failed to validate your first promo code. Please try again.');
        setPromoCodeInput('');
      } finally {
        setValidatingPromo(false);
      }
    }
  };

  const removePromoCode = () => {
    setAppliedPromoCode('');
    setPromoCodeInput('');
    setDiscountAmount(0);
    setSuccess('');
    // Final amount will be recalculated by useEffect
  };

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    setSuccess('Promo code copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const processRenewal = async () => {
    try {
      setProcessing(true);
      setError('');

      const renewalData = {
        renewalType: selectedOption,
        newTier: selectedOption === 'upgrade' ? selectedTier : undefined,
        finalAmount: displayFinalAmount,
        appliedPromoCode: appliedPromoCode || null,
        discountAmount: discountAmount || 0
      };

      const response = await userAPI.renewPromoCode(renewalData);

      if (response.data.success) {
        setSuccess(`Promo code ${selectedOption === 'upgrade' ? 'upgraded and renewed' : 'renewed'} successfully! Redirecting to Agent Dashboard...`);

        // Redirect to Agent Dashboard after 2 seconds
        setTimeout(() => {
          navigate('/profile', { state: { activeSection: 'agent' } });
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to process renewal');
      }
    } catch (error) {
      console.error('Error processing renewal:', error);
      setError(error.response?.data?.message || 'Failed to process renewal. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading renewal options...</p>
        </div>
      </div>
    );
  }

  if (!agentData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">You need to be an agent to access this page.</p>
        </div>
      </div>
    );
  }

  const basePrice = calculatePrice();
  const displayFinalAmount = appliedPromoCode ? finalAmount : basePrice;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {upgradeMode ? 'Upgrade Your Promo Code' : 'Renew Your Promo Code'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {upgradeMode
                ? 'Upgrade to a higher tier and unlock better earning potential'
                : 'Keep your agent status active and continue earning commissions'
              }
            </p>
          </div>
        </div>

        {/* Current Promo Code Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Current Promo Code Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${getTierColor(agentData.promoCodeType)} text-white mb-2`}>
                {getTierIcon(agentData.promoCodeType)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Tier</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">
                {agentData.promoCodeType}
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-2">
                <Tag className="w-6 h-6" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Promo Code</p>
              <div className="flex items-center justify-center space-x-2">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {agentData.promoCode}
                </p>
                <button
                  onClick={() => copyPromoCode(agentData.promoCode)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 mb-2">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expired On</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date(agentData.expirationDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Renewal Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Option Selection */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {upgradeMode ? 'Choose Upgrade Option' : 'Choose Renewal Option'}
            </h2>

            {/* Renew Option - Only show if not in upgrade mode */}
            {!upgradeMode && (
              <div
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedOption === 'renew'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedOption('renew')}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Renew Current Tier
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Extend your current {agentData.promoCodeType} promo code for another year
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getCurrentTierData()?.priceInHSC || 0} HSC
                  </span>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedOption === 'renew'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedOption === 'renew' && (
                      <Check className="w-2 h-2 text-white m-0.5" />
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Upgrade Options */}
            {getAvailableUpgrades().length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upgrade & Renew Options
                </h3>

                {getAvailableUpgrades().map((tier) => {
                  const tierData = promoConfig?.promoTypes?.[tier];
                  if (!tierData) return null;

                  const isSelected = selectedOption === 'upgrade' && selectedTier === tier;

                  return (
                    <div
                      key={tier}
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => {
                        setSelectedOption('upgrade');
                        setSelectedTier(tier);
                      }}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getTierColor(tier)} text-white`}>
                          {getTierIcon(tier)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Upgrade to {tier.charAt(0).toUpperCase() + tier.slice(1)}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tier === 'silver' && 'Enhanced earning potential'}
                            {tier === 'gold' && 'Premium benefits & higher commissions'}
                            {tier === 'diamond' && 'Maximum earnings & exclusive perks'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {tierData.priceInHSC} HSC
                          </span>
                          {tierData.originalPriceInHSC > tierData.priceInHSC && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              {tierData.originalPriceInHSC} HSC
                            </span>
                          )}
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && (
                            <Check className="w-2 h-2 text-white m-0.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Payment Details
            </h2>

            {/* Apply Promo Code for Discount */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Apply Promo Code for Discount
                </h3>
              </div>

              {/* Used Promo Code Option */}
              {agentData.usedPromoCode && agentData.usedPromoCode.trim() && (
                <div className="mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                      💡 Quick Option: Use Your First Promo Code
                    </p>
                    <button
                      onClick={applyUsedPromoCode}
                      className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                            {agentData.usedPromoCode}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            The promo code you used when joining
                          </p>
                        </div>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* Manual Promo Code Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Or enter a different promo code:
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      placeholder="Enter promo code (e.g., ABC1234)"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base"
                      disabled={validatingPromo}
                      maxLength={7}
                    />
                  </div>
                  <button
                    onClick={validatePromoCode}
                    disabled={validatingPromo || !promoCodeInput.trim()}
                    className="px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium transition-colors min-w-[100px] sm:min-w-[120px]"
                  >
                    {validatingPromo ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span className="hidden sm:inline">Checking...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Applied Promo Code Display */}
                {appliedPromoCode && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                      <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-green-800 dark:text-green-300 font-medium">
                          {appliedPromoCode} applied successfully!
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          You saved {discountAmount} HSC
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Discount Info */}
                {promoConfig?.discounts && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      💰 Available discount: <span className="font-medium text-gray-900 dark:text-white">
                        {promoConfig.discounts.purchaseDiscountInHSC} HSC
                      </span> off your renewal
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Price Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {selectedOption === 'renew' ? 'Renewal' : 'Upgrade'} Price:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {basePrice} HSC
                  </span>
                </div>

                {appliedPromoCode && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({appliedPromoCode}):</span>
                    <span>-{discountAmount} HSC</span>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-gray-900 dark:text-white">
                      {displayFinalAmount} HSC
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={processRenewal}
                disabled={processing}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <DollarSign className="w-5 h-5" />
                )}
                <span>
                  {processing
                    ? 'Processing...'
                    : `${selectedOption === 'renew' ? 'Renew' : 'Upgrade & Renew'} for ${displayFinalAmount} HSC`
                  }
                </span>
              </button>

              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Your HSC balance will be deducted and your promo code will be {selectedOption === 'renew' ? 'renewed' : 'upgraded'} immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-300">{success}</p>
            </div>
          </div>
        )}

        {/* Current HSC Value Info */}
        {promoConfig && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current HSC Value: <span className="font-medium text-gray-900 dark:text-white">
                1 HSC = {promoConfig.hscValue} {promoConfig.currency}
              </span>
              {promoConfig.lastUpdated && (
                <span className="ml-2">
                  • Last updated: {new Date(promoConfig.lastUpdated).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenewPromoCode;
