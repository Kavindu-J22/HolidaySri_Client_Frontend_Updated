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
  Gift
} from 'lucide-react';
import { advertisementAPI, promoCodeAPI, userAPI } from '../config/api';
import FavoritePromoCodeSelector from '../components/FavoritePromoCodeSelector';

const AdvertisementPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get data from navigation state
  const { slot, plan, hours, paymentMethod, insufficientBalance, sufficientBalance } = location.state || {};
  
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState(null);
  const [promoCodeAgent, setPromoCodeAgent] = useState(null);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [showFavoriteSelector, setShowFavoriteSelector] = useState(false);
  
  // Payment calculation state
  const [originalAmount, setOriginalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  
  // User balance state
  const [userBalance, setUserBalance] = useState(0);
  
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState(null);

  // Redirect if no payment data
  useEffect(() => {
    if (!slot || !plan || !paymentMethod) {
      navigate('/post-advertisement');
      return;
    }

    // Use the requiredAmount from payment method as it's already calculated correctly
    const amount = paymentMethod.requiredAmount;

    setOriginalAmount(amount);
    setFinalAmount(amount);

    // Set user balance based on payment method
    setUserBalance(paymentMethod.balance || 0);
  }, [slot, plan, hours, paymentMethod, navigate]);

  // Fetch user balance on component mount
  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const response = await userAPI.getHSCBalance();

        // Update balance based on payment method type
        if (paymentMethod?.type === 'HSC') {
          setUserBalance(response.data.balance || 0); // HSC balance is returned as 'balance'
        } else if (paymentMethod?.type === 'HSD') {
          setUserBalance(response.data.hsdBalance || 0);
        } else if (paymentMethod?.type === 'HSG') {
          setUserBalance(response.data.hsgBalance || 0);
        } else {
          // Fallback to the balance from paymentMethod if API doesn't have the specific balance
          setUserBalance(paymentMethod?.balance || 0);
        }
      } catch (error) {
        console.error('Error fetching user balance:', error);
        // Fallback to the balance from paymentMethod
        setUserBalance(paymentMethod?.balance || 0);
      }
    };

    if (user && paymentMethod) {
      fetchUserBalance();
    }
  }, [user, paymentMethod]);

  // Apply promo code
  const handleApplyPromoCode = async () => {
    if (!promoCodeInput.trim()) {
      setError('Please enter a promo code');
      return;
    }

    try {
      setValidatingPromo(true);
      setError('');
      
      const response = await advertisementAPI.calculateDiscount({
        promoCode: promoCodeInput.toUpperCase(),
        plan: plan.id,
        originalAmount,
        paymentMethod,
        hours: hours || 1 // Include hours for hourly plan calculations
      });
      
      if (response.data.isValid) {
        setAppliedPromoCode(promoCodeInput.toUpperCase());
        setPromoCodeAgent(response.data.agent);
        setDiscountAmount(response.data.discount.discountAmount);
        setFinalAmount(response.data.discount.finalAmount);
        setSuccess(`Promo code applied! You saved ${response.data.discount.discountAmount} ${paymentMethod.currency || paymentMethod.type}`);
      } else {
        setError('Invalid or inactive promo code');
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      setError(error.response?.data?.message || 'Failed to apply promo code. Please try again.');
    } finally {
      setValidatingPromo(false);
    }
  };

  // Remove promo code
  const handleRemovePromoCode = () => {
    setAppliedPromoCode(null);
    setPromoCodeAgent(null);
    setDiscountAmount(0);
    setFinalAmount(originalAmount);
    setPromoCodeInput('');
    setSuccess('');
    setError('');
  };

  // Handle favorite promo code selection
  const handleFavoritePromoCodeSelect = (favoritePromoCode) => {
    setPromoCodeInput(favoritePromoCode.promoCode);
    setShowFavoriteSelector(false);
  };

  // Process payment
  const handlePayment = async () => {
    // Check for insufficient balance
    if (userBalance < finalAmount) {
      setError(`Insufficient ${paymentMethod.currency || paymentMethod.type} balance. Please choose another payment method or recharge.`);
      return;
    }

    try {
      setProcessing(true);
      setError('');
      setSuccess('');

      // Check for duplicate slots first
      const duplicateCheck = await advertisementAPI.checkDuplicateSlot({
        category: slot.category
      });

      if (!duplicateCheck.data.canPurchase) {
        setError(duplicateCheck.data.message);
        setProcessing(false);
        return;
      }

      // Process payment
      const paymentData = {
        slot,
        plan,
        hours,
        paymentMethod,
        originalAmount,
        discountAmount,
        finalAmount,
        appliedPromoCode,
        promoCodeAgent
      };

      const response = await advertisementAPI.processPayment(paymentData);

      if (response.data.success) {
        setPurchaseResult({
          advertisement: response.data.advertisement,
          newBalance: response.data.newBalance,
          transactionId: response.data.transactionId
        });
        setShowSuccessModal(true);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle success modal close
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/profile', { state: { activeTab: 'advertisements' } });
  };

  if (!slot || !plan || !paymentMethod) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Advertisement Payment
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Complete your advertisement purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Advertisement Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                Advertisement Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {slot.mainCategory}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Slot Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {slot.name}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Selected Plan:</span>
                  <span className="font-medium text-gray-900 dark:text-white flex items-center">
                    {plan.id === 'hourly' && <Clock className="w-4 h-4 mr-1" />}
                    {plan.id === 'daily' && <Calendar className="w-4 h-4 mr-1" />}
                    {plan.id === 'monthly' && <Calendar className="w-4 h-4 mr-1" />}
                    {plan.id === 'yearly' && <Calendar className="w-4 h-4 mr-1" />}
                    {plan.name} {plan.id === 'hourly' && `(${hours || 1} hour${(hours || 1) > 1 ? 's' : ''})`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {paymentMethod.name || paymentMethod.type}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {paymentMethod.requiredAmount} {paymentMethod.currency || paymentMethod.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Gift className="w-5 h-5 text-green-500 mr-2" />
                Apply Promo Code for Discount
              </h2>

              {/* Check if payment method supports discounts */}
              {paymentMethod?.type !== 'HSC' ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                        Discount Not Available
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Promo code discounts can only be applied to <strong>HSC payments</strong>.
                        Please select HSC as your payment method to use promo codes and get discounts on your advertisement purchase.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {!appliedPromoCode ? (
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                          placeholder="Enter promo code"
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                        <button
                          onClick={handleApplyPromoCode}
                          disabled={validatingPromo || !promoCodeInput.trim()}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {validatingPromo ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Tag className="w-4 h-4" />
                          )}
                          <span>Apply</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setShowFavoriteSelector(true)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Select from Favorites</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-800 dark:text-green-200">
                            Promo code applied: {appliedPromoCode}
                          </span>
                        </div>
                        <button
                          onClick={handleRemovePromoCode}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      {promoCodeAgent && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          {promoCodeAgent.promoCodeType} promo code by {promoCodeAgent.email}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-800 dark:text-red-200">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-800 dark:text-green-200">{success}</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                Payment Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Original Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {originalAmount} {paymentMethod.currency || paymentMethod.type}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount:</span>
                    <span>-{discountAmount} {paymentMethod.currency || paymentMethod.type}</span>
                  </div>
                )}

                <hr className="border-gray-200 dark:border-gray-700" />

                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-gray-900 dark:text-white">
                    {finalAmount} {paymentMethod.currency || paymentMethod.type}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Your Balance:</span>
                  <span className={`font-medium ${userBalance >= finalAmount ? 'text-green-600' : 'text-red-600'}`}>
                    {userBalance} {paymentMethod.currency || paymentMethod.type}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handlePayment}
                disabled={processing || userBalance < finalAmount}
                className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay Now</span>
                  </>
                )}
              </button>
              
              {userBalance < finalAmount && (
                <p className="text-red-600 text-sm mt-2 text-center">
                  Insufficient {paymentMethod.currency || paymentMethod.type} balance. Please recharge or choose another payment method.
                </p>
              )}
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
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Successful!
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your advertisement has been purchased successfully and is now active.
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
                      {purchaseResult.newBalance} {paymentMethod.type}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSuccessClose}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View My Advertisements
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementPayment;
