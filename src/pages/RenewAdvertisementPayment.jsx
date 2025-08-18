import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  CreditCard,
  Tag,
  CheckCircle,
  AlertCircle,
  Loader,
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  DollarSign,
  Gift,
  RefreshCw,
  Info
} from 'lucide-react';
import { advertisementAPI, promoCodeAPI, userAPI } from '../config/api';
import FavoritePromoCodeSelector from '../components/FavoritePromoCodeSelector';

const RenewAdvertisementPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get data from navigation state
  const { slot, plan, hours, paymentMethod, insufficientBalance, sufficientBalance, isRenewal, renewalType, advertisementId } = location.state || {};
  
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeApplied, setPromoCodeApplied] = useState(false);
  const [promoCodeAgent, setPromoCodeAgent] = useState(null);
  const [promoCodeLoading, setPromoCodeLoading] = useState(false);
  const [showFavoriteSelector, setShowFavoriteSelector] = useState(false);
  
  // Amount states
  const [originalAmount, setOriginalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  
  // Success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState(null);

  // Redirect if no payment data
  useEffect(() => {
    if (!slot || !plan || !paymentMethod || !isRenewal || !advertisementId) {
      navigate('/profile', { state: { activeTab: 'advertisements' } });
      return;
    }

    // Use the requiredAmount from payment method as it's already calculated correctly
    const amount = paymentMethod.requiredAmount;

    setOriginalAmount(amount);
    setFinalAmount(amount);

    // Set user balance based on payment method
    setUserBalance(paymentMethod.balance || 0);
  }, [slot, plan, hours, paymentMethod, navigate, isRenewal, advertisementId]);

  // Apply promo code
  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      setError('Please enter a promo code');
      return;
    }

    try {
      setPromoCodeLoading(true);
      setError('');

      const response = await advertisementAPI.calculateDiscount({
        promoCode: promoCode.trim(),
        plan: plan,
        hours: hours,
        originalAmount: originalAmount,
        paymentMethod: paymentMethod
      });

      if (response.data.isValid) {
        setPromoCodeApplied(true);
        setPromoCodeAgent(response.data.agent);
        setDiscountAmount(response.data.discount.discountAmount);
        setFinalAmount(response.data.discount.finalAmount);
        setSuccess('Promo code applied successfully!');
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      setError(error.response?.data?.message || 'Invalid promo code');
    } finally {
      setPromoCodeLoading(false);
    }
  };

  // Remove promo code
  const handleRemovePromoCode = () => {
    setPromoCode('');
    setPromoCodeApplied(false);
    setPromoCodeAgent(null);
    setDiscountAmount(0);
    setFinalAmount(originalAmount);
    setSuccess('');
    setError('');
  };

  // Handle favorite promo code selection
  const handleFavoritePromoCodeSelect = (selectedPromoCode) => {
    console.log('Selected favorite promo code:', selectedPromoCode); // Debug log
    // The FavoritePromoCodeSelector passes the promo code string directly
    const codeToSet = typeof selectedPromoCode === 'string' ? selectedPromoCode : (selectedPromoCode?.promoCode || selectedPromoCode?.code || '');
    setPromoCode(codeToSet.toUpperCase());
    setShowFavoriteSelector(false);
  };

  // Process renewal payment
  const handleProcessPayment = async () => {
    try {
      setProcessing(true);
      setError('');
      setSuccess('');

      // Prepare payment data for renewal
      const paymentData = {
        advertisementId: advertisementId,
        renewalType: renewalType,
        slot: slot,
        plan: plan,
        hours: hours,
        paymentMethod: paymentMethod,
        originalAmount: originalAmount,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
        appliedPromoCode: promoCodeApplied ? promoCode : null,
        promoCodeAgent: promoCodeAgent
      };

      const response = await advertisementAPI.processRenewalPayment(paymentData);

      if (response.data.success) {
        setPurchaseResult({
          advertisement: response.data.advertisement,
          newBalance: response.data.newBalance,
          transactionId: response.data.transactionId
        });
        setShowSuccessModal(true);
      } else {
        setError('Renewal payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing renewal payment:', error);
      setError(error.response?.data?.message || 'Renewal payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle success modal close
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/profile', { state: { activeTab: 'advertisements' } });
  };

  // Format currency based on payment method
  const formatCurrency = (amount) => {
    const currency = paymentMethod?.type || 'LKR';
    return `${currency} ${amount.toLocaleString()}`;
  };

  // Format plan duration
  const formatPlanDuration = () => {
    if (plan.requiresHours && hours) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    switch (plan.id) {
      case 'daily':
        return '1 day';
      case 'monthly':
        return '30 days';
      case 'yearly':
        return '365 days';
      default:
        return plan.name;
    }
  };

  if (!slot || !plan || !paymentMethod) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Invalid Renewal Request
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Missing renewal information. Please try again.
          </p>
          <button
            onClick={() => navigate('/profile', { state: { activeTab: 'advertisements' } })}
            className="btn-primary"
          >
            Back to Advertisements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile', { state: { activeTab: 'advertisements' } })}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to My Advertisements</span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Renew Advertisement Payment
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Complete your advertisement renewal payment
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Payment Details
              </h2>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <p className="text-green-700 dark:text-green-300">{success}</p>
                  </div>
                </div>
              )}

              {/* Payment Method Display */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {paymentMethod.type} Balance
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Available: {formatCurrency(userBalance)}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userBalance >= finalAmount
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}>
                    {userBalance >= finalAmount ? 'Sufficient' : 'Insufficient'}
                  </div>
                </div>
              </div>

              {/* Promo Code Section - Only show for HSC payment method */}
              {paymentMethod?.type === 'HSC' ? (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Promo Code (Optional)
                  </h3>

                  {!promoCodeApplied ? (
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Enter promo code"
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={promoCodeLoading}
                        />
                        <button
                          onClick={handleApplyPromoCode}
                          disabled={!promoCode.trim() || promoCodeLoading}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {promoCodeLoading ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Tag className="w-4 h-4" />
                          )}
                          <span>Apply</span>
                        </button>
                      </div>

                      {/* Select from Favorites Button */}
                      <button
                        onClick={() => setShowFavoriteSelector(true)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Select from Favorites</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Gift className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="font-medium text-green-700 dark:text-green-300">
                              Promo Code Applied: {promoCode}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              Discount: {formatCurrency(discountAmount)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleRemovePromoCode}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Notice for HSD/HSG payment methods */
                <div className="mb-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-medium mb-1">Payment Method: {paymentMethod?.type}</p>
                        <p>
                          Promo codes are only available for HSC payments. {paymentMethod?.type} payments do not support promotional discounts.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Process Payment Button */}
              <button
                onClick={handleProcessPayment}
                disabled={processing || userBalance < finalAmount}
                className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing Renewal...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Complete Renewal Payment</span>
                  </>
                )}
              </button>

              {userBalance < finalAmount && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
                  Insufficient balance. Please top up your {paymentMethod.type} balance to complete the renewal.
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Renewal Summary
              </h3>

              <div className="space-y-4">
                {/* Slot Details */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {slot.categoryName || slot.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {slot.description}
                  </p>
                </div>

                {/* Plan Details */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {plan.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {formatPlanDuration()}</span>
                  </div>
                </div>

                {/* Renewal Type */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {renewalType === 'expired' ? 'Expired Slot Renewal' : 'Advertisement Renewal'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {renewalType === 'expired' 
                      ? 'Reactivating expired advertisement slot'
                      : 'Extending current advertisement duration'
                    }
                  </p>
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Original Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(originalAmount)}
                    </span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount:</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(finalAmount)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {paymentMethod.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Promo Code Selector */}
      {showFavoriteSelector && (
        <FavoritePromoCodeSelector
          isOpen={showFavoriteSelector}
          onClose={() => setShowFavoriteSelector(false)}
          onSelect={handleFavoritePromoCodeSelect}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && purchaseResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Renewal Successful!
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your advertisement has been successfully renewed and is now active.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      {purchaseResult.transactionId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">New Balance:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(purchaseResult.newBalance)}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSuccessClose}
                className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700"
              >
                Back to My Advertisements
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenewAdvertisementPayment;
