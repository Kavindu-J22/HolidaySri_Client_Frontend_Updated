import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, History, Gift, AlertCircle, CheckCircle } from 'lucide-react';
import { hscAPI, userAPI } from '../config/api';

const HSCWallet = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tokenValues, setTokenValues] = useState({
    hsgValue: 1,
    hsdValue: 1,
    currency: 'LKR'
  });
  const [promocodeEarnings, setPromocodeEarnings] = useState({
    pending: 0,
    total: 0,
    canClaim: false
  });
  const [bankDetailsStatus, setBankDetailsStatus] = useState({
    canClaim: false,
    hasCompleteBankDetails: false,
    hasBinanceId: false
  });
  const [hscEarned, setHscEarned] = useState({
    totals: {
      completed: 0,
      processing: 0,
      paidAsLKR: 0,
      paidAsHSC: 0,
      total: 0
    },
    hscValue: 100,
    currency: 'LKR'
  });
  const [loading, setLoading] = useState(false);
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  const [showHSCConvertModal, setShowHSCConvertModal] = useState(false);

  const fetchTokenValues = async () => {
    try {
      const response = await hscAPI.getInfo();
      setTokenValues({
        hsgValue: response.data.hsgValue || 1,
        hsdValue: response.data.hsdValue || 1,
        currency: response.data.currency || 'LKR'
      });
    } catch (error) {
      console.error('Failed to fetch token values:', error);
    }
  };

  const fetchUserBalances = useCallback(async () => {
    try {
      const response = await userAPI.getHSCBalance();
      updateUser({
        hscBalance: response.data.balance,
        hsgBalance: response.data.hsgBalance,
        hsdBalance: response.data.hsdBalance
      });
    } catch (error) {
      console.error('Failed to fetch user balances:', error);
    }
  }, [updateUser]);

  const fetchPromocodeEarnings = useCallback(async () => {
    try {
      const response = await userAPI.getPromocodeEarnings();
      setPromocodeEarnings({
        pending: response.data.totals.pending,
        total: response.data.totals.total,
        canClaim: response.data.canClaim
      });
    } catch (error) {
      console.error('Failed to fetch promocode earnings:', error);
    }
  }, []);

  const fetchBankDetailsStatus = useCallback(async () => {
    try {
      const response = await userAPI.getBankDetailsStatus();
      setBankDetailsStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch bank details status:', error);
    }
  }, []);

  const fetchHSCEarned = useCallback(async () => {
    try {
      const response = await userAPI.getHSCEarned();
      setHscEarned({
        totals: response.data.totals,
        hscValue: response.data.hscValue,
        currency: response.data.currency
      });
    } catch (error) {
      console.error('Failed to fetch HSC earned data:', error);
    }
  }, []);

  const handleClaimNow = async () => {
    setLoading(true);
    try {
      // Check bank details first
      const bankResponse = await userAPI.getBankDetailsStatus();

      if (!bankResponse.data.canClaim) {
        setLoading(false);
        setShowBankDetailsModal(true);
        return;
      }

      // Navigate to claim earnings page
      navigate('/claim-earnings');
    } catch (error) {
      console.error('Error during claim process:', error);
      setLoading(false);

      // Show error message
      alert('❌ Error\n\nUnable to check bank details. Please try again or contact support if the problem persists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenValues();
  }, []);

  const handleConvertToHSC = async () => {
    try {
      setLoading(true);
      const response = await userAPI.convertHSCEarnedToTokens();

      if (response.data.success) {
        alert(`Successfully converted ${response.data.data.convertedAmount} HSC earnings to tokens!\n\nNew HSC Balance: ${response.data.data.newHSCBalance} HSC`);

        // Refresh data
        await fetchUserBalances();
        await fetchHSCEarned();
        setShowHSCConvertModal(false);
      }
    } catch (error) {
      console.error('Failed to convert HSC earned to tokens:', error);
      const errorMessage = error.response?.data?.message || 'Failed to convert earnings. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewWithdrawLKR = async () => {
    setLoading(true);
    try {
      // Check bank details first
      const bankResponse = await userAPI.getBankDetailsStatus();

      if (!bankResponse.data.canClaim) {
        setLoading(false);
        setShowBankDetailsModal(true);
        return;
      }

      // Navigate to HSC earnings claim page
      navigate('/hsc-earnings-claim');
    } catch (error) {
      console.error('Error during HSC claim process:', error);
      setLoading(false);

      // Show error message
      alert('❌ Error\n\nUnable to check bank details. Please try again or contact support if the problem persists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenValues();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserBalances();
      fetchPromocodeEarnings();
      fetchBankDetailsStatus();
      fetchHSCEarned();
    }
  }, [user, fetchUserBalances, fetchPromocodeEarnings, fetchBankDetailsStatus, fetchHSCEarned]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          My Holidaysri Wallet
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Manage your HSC tokens, HSG Gems, and HSD earnings
        </p>
      </div>

      {/* Multi-Token Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* HSC Balance */}
        <div className="card p-6 text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
            <img
              src="https://res.cloudinary.com/dqdcmluxj/image/upload/v1734337684/hsc_resll6_1_q0eksv.webp"
              alt="HSC Coin"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            HSC Tokens
          </h3>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {user?.hscBalance || 0} HSC
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            For publishing ads
          </p>
        </div>

        {/* HSG Balance */}
        <div className="card p-6 text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl mb-4">
            <img
              src="https://res.cloudinary.com/dqdcmluxj/image/upload/v1734594961/Untitled-12_mcloq6.webp"
              alt="HSG Gem"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            HSG Gems
          </h3>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            {user?.hsgBalance || 0} HSG
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            1 HSG = {tokenValues.hsgValue} {tokenValues.currency}
          </p>
        </div>

        {/* HSD Balance */}
        <div className="card p-6 text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-xl mb-4">
            <img
              src="https://res.cloudinary.com/dqdcmluxj/image/upload/v1734609205/file_g75vh2.png"
              alt="HSD Diamond"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            HSD Diamond
          </h3>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {user?.hsdBalance || 0} HSD
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            1 HSD = {tokenValues.hsdValue} {tokenValues.currency}
          </p>
        </div>

        {/* Promocode Earnings */}
        <div className="card p-6 text-center bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-200 dark:border-orange-800 flex flex-col">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl mb-4 mx-auto">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Promocode Earnings
          </h3>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            {promocodeEarnings.pending.toLocaleString()} LKR
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 flex-grow">
            Pending earnings from referrals
          </p>

          {/* Claim Status */}
          <div className="mb-4">
            {promocodeEarnings.pending >= 5000 ? (
              <div className="flex items-center justify-center text-green-600 dark:text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Ready to claim
              </div>
            ) : (
              <div className="flex items-center justify-center text-amber-600 dark:text-amber-400 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                Min. 5,000 LKR required
              </div>
            )}
          </div>

          {/* Claim Button */}
          <button
            onClick={handleClaimNow}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 mt-auto"
          >
            {loading ? 'Processing...' : 'View & Claim Now'}
          </button>
        </div>

        {/* HSC Earned */}
        <div className="card p-6 text-center bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-2 border-teal-200 dark:border-teal-800 flex flex-col">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl mb-4 mx-auto">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            HSC Earned
          </h3>
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-2">
            {hscEarned.totals.completed.toLocaleString()} HSC
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 flex-grow">
            ≈ {Math.round(hscEarned.totals.completed * hscEarned.hscValue).toLocaleString()} {hscEarned.currency}
          </p>

          {/* Action Buttons */}
          <div className="space-y-2 mt-auto">
            <button
              onClick={() => setShowHSCConvertModal(true)}
              disabled={loading || hscEarned.totals.completed === 0}
              className="w-full py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-200 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50"
            >
              Add to HSC Tokens
            </button>
            <button
              onClick={handleViewWithdrawLKR}
              disabled={loading}
              className="w-full py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-200 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50"
            >
              View & Withdraw as LKR
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Purchase Packages */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Purchase HSC
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Buy HSC tokens to start advertising your tourism services
          </p>
          <button
            className="btn-primary w-full"
            onClick={() => navigate('/hsc-treasure')}
          >
            Buy HSC Tokens
          </button>
        </div>

        {/* Transaction History */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <History className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Transaction History
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            View your HSC purchase and spending history
          </p>
          <button className="btn-secondary w-full">
            View History
          </button>
        </div>
      </div>

      <div className="card p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          HSC Wallet Features Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Full HSC wallet functionality including purchases, packages, and transaction history will be available soon.
        </p>
      </div>

      {/* Bank Details Required Modal */}
      {showBankDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-t-2xl p-6 text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bank Details Required</h3>
              <p className="text-white text-opacity-90 text-sm">Complete your payment information to claim earnings</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  To claim your promocode earnings, you need to complete your bank details or add your Binance ID for secure payments.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">What you need:</span>
                  </div>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Bank name and branch details</li>
                    <li>• Account number and account name</li>
                    <li>• Or your Binance ID for crypto payments</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowBankDetailsModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowBankDetailsModal(false);
                    navigate('/profile', {
                      state: {
                        activeSection: 'bank',
                        message: 'Please complete your bank details or add Binance ID to claim earnings',
                        returnTo: '/hsc'
                      }
                    });
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Complete Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HSC Convert to Tokens Modal */}
      {showHSCConvertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-t-2xl p-6 text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Convert HSC Earnings</h3>
              <p className="text-white text-opacity-90 text-sm">Add your earned HSC to your token balance</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 mb-4">
                  <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                    {hscEarned.totals.completed.toLocaleString()} HSC
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Will be added to your HSC token balance
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" />
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Important Notice:</span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Once converted to HSC tokens, you cannot withdraw them as LKR.
                    However, you can use them for professional actions and earn more through the platform.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowHSCConvertModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConvertToHSC}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? 'Converting...' : 'Confirm & Convert'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HSCWallet;
