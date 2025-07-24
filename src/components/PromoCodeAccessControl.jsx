import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { promoCodeAPI, userAPI } from '../config/api';
import { 
  Shield, 
  CreditCard, 
  User, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Loader,
  ArrowLeft,
  Gift,
  Crown,
  Wallet,
  ShoppingCart
} from 'lucide-react';

const PromoCodeAccessControl = ({ onAccessGranted, onCancel }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [accessStatus, setAccessStatus] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (user) {
      checkAccessStatus();
      fetchUserBalance();
    }
  }, [user]);

  const checkAccessStatus = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await promoCodeAPI.checkAccess();
      setAccessStatus(response.data);

      if (response.data.hasAccess) {
        // User already has access, proceed directly
        setSuccess('✅ Access verified! Redirecting...');
        setTimeout(() => onAccessGranted(), 1000);
      }
    } catch (error) {
      console.error('Error checking access:', error);

      if (error.response?.status === 403) {
        setError('❌ Access denied. Please login and try again.');
      } else if (error.response?.status === 500) {
        setError('❌ Server error occurred. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR') {
        setError('❌ Network error. Please check your internet connection.');
      } else {
        setError('❌ Failed to check access status. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await userAPI.getProfile();
      setUserBalance(response.data.user.hscBalance || 0);
    } catch (error) {
      console.error('Error fetching user balance:', error);
      // Don't show error for balance fetch as it's not critical
      // User can still see the balance requirement and proceed
    }
  };

  const handlePaymentConfirm = () => {
    setShowConfirmation(true);
  };

  const handlePayment = async () => {
    setShowConfirmation(false);
    try {
      setProcessing(true);
      setError('');
      setSuccess('');

      // Show processing message
      setSuccess('Processing payment...');

      const response = await promoCodeAPI.payAccess();

      setSuccess(`✅ ${response.data.message}`);
      setUserBalance(response.data.newBalance);

      // Update user balance in real-time
      await fetchUserBalance();

      // Wait a moment to show success message, then proceed
      setTimeout(() => {
        onAccessGranted();
      }, 2500);

    } catch (error) {
      console.error('Payment error:', error);

      if (error.response?.status === 400) {
        const data = error.response.data;

        if (data.message === 'Insufficient HSC balance') {
          setError(
            `❌ Insufficient HSC balance! You need ${data.required} HSC but only have ${data.current} HSC. ` +
            `You're short by ${data.shortfall} HSC. Please buy more HSC first.`
          );
        } else if (data.message === 'You already have access to the promo code view page') {
          setSuccess('✅ You already have access! Redirecting...');
          setTimeout(() => onAccessGranted(), 1500);
        } else if (data.message === 'Agents get free access to promo codes') {
          setSuccess('✅ Welcome agent! You have free access. Redirecting...');
          setTimeout(() => onAccessGranted(), 1500);
        } else {
          setError(`❌ ${data.message}`);
        }
      } else if (error.response?.status === 403) {
        setError('❌ Access denied. Please login and try again.');
      } else if (error.response?.status === 500) {
        setError('❌ Server error occurred. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR') {
        setError('❌ Network error. Please check your internet connection and try again.');
      } else {
        setError(`❌ ${error.response?.data?.message || 'Payment failed. Please try again.'}`);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleGoToHSCTreasure = () => {
    navigate('/hsc-treasure');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <User className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Login Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to be logged in to access the promo code viewing page.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleLogin}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Checking access status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (accessStatus?.hasAccess) {
    return null; // Access already granted, component will unmount
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full w-16 h-16 mx-auto mb-4">
            <Gift className="w-8 h-8 text-white mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Promo Code View Page
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {accessStatus?.isAgent 
              ? 'Welcome! You have free access as a travel agent.'
              : 'One-time payment required to access premium promo codes'
            }
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 text-green-800 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 text-red-800 dark:text-red-400">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Agent Access */}
        {accessStatus?.isAgent ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                Travel Agent Access
              </h3>
            </div>
            <p className="text-green-700 dark:text-green-400 mb-4">
              As a verified travel agent, you get free access to all promo codes!
            </p>
            <button
              onClick={onAccessGranted}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Continue to Promo Codes
            </button>
          </div>
        ) : (
          /* Payment Required */
          <div className="space-y-6">
            {/* Payment Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                    Premium Access
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {accessStatus?.accessAmount || 50} HSC
                  </div>
                  <div className="text-sm text-blue-500 dark:text-blue-400">
                    One-time payment
                  </div>
                </div>
              </div>
              <p className="text-blue-700 dark:text-blue-400 mb-4">
                Get unlimited access to browse and copy active promo codes from verified travel agents.
              </p>
              
              {/* Features */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Browse all active promo codes</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Copy codes with one click</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Add codes to favorites</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Lifetime access (pay once)</span>
                </div>
              </div>
            </div>

            {/* Balance Check */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">Your HSC Balance:</span>
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {userBalance} HSC
                </div>
              </div>
              {userBalance < (accessStatus?.accessAmount || 50) && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Insufficient balance. You need {(accessStatus?.accessAmount || 50) - userBalance} more HSC.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
              
              {userBalance >= (accessStatus?.accessAmount || 50) ? (
                <button
                  onClick={handlePaymentConfirm}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {processing ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Now</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleGoToHSCTreasure}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy HSC</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Payment Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Confirm Payment
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You are about to pay <strong>{accessStatus?.accessAmount || 50} HSC</strong> for
                  lifetime access to the promo code viewing page. This is a one-time payment.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Current Balance:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{userBalance} HSC</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Payment Amount:</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">-{accessStatus?.accessAmount || 50} HSC</span>
                  </div>
                  <hr className="my-2 border-gray-200 dark:border-gray-600" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-white">New Balance:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {userBalance - (accessStatus?.accessAmount || 50)} HSC
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {processing ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirm Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoCodeAccessControl;
