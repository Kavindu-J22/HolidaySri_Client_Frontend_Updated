import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, promoCodeAPI } from '../config/api';
import { 
  ShoppingCart, 
  Tag, 
  DollarSign, 
  Gift,
  CheckCircle,
  AlertCircle,
  Loader,
  CreditCard,
  ArrowLeft,
  Sparkles,
  User,
  Mail
} from 'lucide-react';

const PromoCodePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoCodeAgent, setPromoCodeAgent] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  // Get order data from navigation state
  const orderData = location.state;

  useEffect(() => {
    if (!orderData) {
      navigate('/promo-codes-travel-agents');
      return;
    }
    fetchUserBalance();
    setFinalAmount(orderData.itemPrice);
  }, []);

  const fetchUserBalance = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getHSCBalance();
      setUserBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Error fetching user balance:', error);
      setError('Failed to load user balance');
    } finally {
      setLoading(false);
    }
  };

  const validateAndApplyPromoCode = async () => {
    if (!promoCodeInput.trim()) {
      setError('Please enter a promo code');
      return;
    }

    try {
      setValidatingPromo(true);
      setError('');
      
      // TODO: Replace with actual API call
      const response = await promoCodeAPI.validatePromoCode(promoCodeInput.toUpperCase());
      
      if (response.data.isValid && response.data.isActive) {
        setAppliedPromoCode(promoCodeInput.toUpperCase());
        setPromoCodeAgent(response.data.agent);
        setDiscountAmount(orderData.discountAmount || 0);
        setFinalAmount(Math.max(0, orderData.itemPrice - (orderData.discountAmount || 0)));
        setSuccess(`Promo code applied! You saved ${orderData.discountAmount || 0} HSC`);
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

  const removePromoCode = () => {
    setAppliedPromoCode('');
    setPromoCodeAgent(null);
    setDiscountAmount(0);
    setFinalAmount(orderData.itemPrice);
    setPromoCodeInput('');
    setSuccess('');
    setError('');
  };

  const handlePayment = async () => {
    if (userBalance < finalAmount) {
      setError(`Insufficient HSC balance. You need ${finalAmount} HSC but only have ${userBalance} HSC.`);
      return;
    }

    try {
      setProcessing(true);
      setError('');

      const paymentData = {
        itemName: orderData.itemName,
        itemPrice: orderData.itemPrice,
        itemCategory: orderData.itemCategory,
        quantity: orderData.quantity,
        finalAmount: finalAmount,
        discountAmount: discountAmount,
        appliedPromoCode: appliedPromoCode,
        promoCodeAgent: promoCodeAgent,
        earnRate: orderData.earnRate,
        promoCode: orderData.promoCode,
        promoType: orderData.promoType
      };

      // TODO: Replace with actual API call
      const response = await promoCodeAPI.processPayment(paymentData);

      if (response.data.success) {
        setPaymentResult({
          promoCode: orderData.promoCode,
          promoType: orderData.promoType,
          transactionId: response.data.transactionId,
          newBalance: response.data.newBalance
        });
        setShowCongratulations(true);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Complete Your Purchase
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Review your order and complete the payment with HSC
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Order Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Item Name:</span>
                <span className="font-medium text-gray-900 dark:text-white">{orderData?.itemName}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Category:</span>
                <span className="font-medium text-gray-900 dark:text-white">{orderData?.itemCategory}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                <span className="font-medium text-gray-900 dark:text-white">{orderData?.quantity}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Original Price:</span>
                <span className="font-medium text-gray-900 dark:text-white">{orderData?.itemPrice} HSC</span>
              </div>

              {orderData?.earnRate > 0 && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Earn Rate (per referral):</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{orderData.earnRate} LKR</span>
                </div>
              )}
            </div>
          </div>

          {/* Apply Promo Code Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Gift className="w-5 h-5 mr-2" />
              Apply Promo Code for Discount
            </h3>
            
            {!appliedPromoCode ? (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Have a promo code from another agent? Apply it to get a discount on your purchase.
                </p>
                
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter promo code (e.g., HSABC12)"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white font-mono"
                    maxLength={7}
                  />
                  <button
                    onClick={validateAndApplyPromoCode}
                    disabled={validatingPromo || !promoCodeInput.trim()}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {validatingPromo ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Validating...</span>
                      </>
                    ) : (
                      <>
                        <Tag className="w-4 h-4" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-800 dark:text-green-300">Promo Code Applied</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm underline"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="space-y-2">
                  <p className="text-green-700 dark:text-green-400">
                    <strong>Code:</strong> {appliedPromoCode}
                  </p>
                  <p className="text-green-700 dark:text-green-400">
                    <strong>Discount:</strong> {discountAmount} HSC
                  </p>
                  
                  {promoCodeAgent && (
                    <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-600 dark:text-green-400 mb-2">Agent Details:</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {promoCodeAgent.username}
                        </span>
                        <span className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {promoCodeAgent.email}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          {/* User Balance */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Your HSC Balance
            </h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {userBalance} HSC
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Available Balance
              </p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Payment Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-medium text-gray-900 dark:text-white">{orderData?.itemPrice} HSC</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                  <span>Promo Discount:</span>
                  <span className="font-medium">-{discountAmount} HSC</span>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Final Amount:</span>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{finalAmount} HSC</span>
                </div>
              </div>

              {userBalance < finalAmount && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Insufficient balance. You need {finalAmount - userBalance} more HSC.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Button */}
          <div className="space-y-4">
            <button
              onClick={handlePayment}
              disabled={processing || userBalance < finalAmount}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {processing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay Now with HSC</span>
                </>
              )}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
          <CheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {/* Congratulations Modal */}
      {showCongratulations && paymentResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-8 relative animate-pulse">
            <div className="text-center">
              {/* Celebration Icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 animate-bounce">
                <Sparkles className="w-12 h-12 text-white" />
              </div>

              {/* Main Message */}
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                🎉 Congratulations! 🎉
              </h2>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                You are Now an Agent With Us!
              </h3>

              {/* Promo Code Display */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 mb-6 border-2 border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">Your New Promo Code:</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300 font-mono tracking-wider mb-2">
                  {paymentResult.promoCode}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 capitalize">
                  {paymentResult.promoType} Agent Status
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  🚀 What's Next? Start Earning Today!
                </h4>
                <ul className="text-left space-y-3 text-gray-600 dark:text-gray-400 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span><strong>Share your promo code</strong> with friends and family</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span><strong>Earn money</strong> for every successful referral</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span><strong>Get discounts</strong> on advertisements</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span><strong>Build your network</strong> and grow your business</span>
                  </li>
                </ul>
              </div>

              {/* Transaction Details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                  <span className="font-mono text-gray-900 dark:text-white">{paymentResult.transactionId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Remaining Balance:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{paymentResult.newBalance} HSC</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setShowCongratulations(false);
                  navigate('/profile', {
                    state: {
                      message: 'Welcome to our agent network! Start promoting your promo code today.',
                      promoCode: paymentResult.promoCode,
                      isNewAgent: true
                    }
                  });
                }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Go to My Profile & Start Earning! 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodePayment;
