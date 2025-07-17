import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, TrendingUp, History, Gift, DollarSign, Coins } from 'lucide-react';
import { hscAPI, userAPI } from '../config/api';

const HSCWallet = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tokenValues, setTokenValues] = useState({
    hsgValue: 1,
    hsdValue: 1,
    currency: 'LKR'
  });

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

  useEffect(() => {
    fetchTokenValues();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserBalances();
    }
  }, [user, fetchUserBalances]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          My Holidaysri Wallet
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Manage your HSC tokens, HSG gifts, and HSD earnings
        </p>
      </div>

      {/* Multi-Token Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* HSC Balance */}
        <div className="card p-6 text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
            <CreditCard className="w-6 h-6 text-white" />
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
            <Gift className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            HSG Gifts
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
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            HSD Dollars
          </h3>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {user?.hsdBalance || 0} HSD
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            1 HSD = {tokenValues.hsdValue} {tokenValues.currency}
          </p>
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
    </div>
  );
};

export default HSCWallet;
