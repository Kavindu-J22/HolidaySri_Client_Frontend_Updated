import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, TrendingUp, History } from 'lucide-react';

const HSCWallet = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          HSC Wallet
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Manage your HSC tokens and purchase packages
        </p>
      </div>

      {/* Balance Card */}
      <div className="card p-8 text-center bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-xl mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Current Balance
        </h2>
        <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">
          {user?.hscBalance || 0} HSC
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Use HSC tokens to publish advertisements and promote your services
        </p>
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
          <button className="btn-primary w-full">
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
