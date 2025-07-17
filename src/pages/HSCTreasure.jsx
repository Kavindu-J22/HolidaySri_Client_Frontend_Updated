import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Star,
  DollarSign,
  Calculator,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { hscAPI, userAPI } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

const HSCTreasure = () => {
  const [packages, setPackages] = useState([]);
  const [hscConfig, setHscConfig] = useState({ hscValue: 100, currency: 'LKR' });
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomPurchase, setShowCustomPurchase] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHSCInfo();
    if (user) {
      fetchUserBalance();
    }

    // Check for payment success from navigation state
    if (location.state?.status === 'PaymentSuccess') {
      setSuccess(`Payment successful! You have received ${location.state.hscAmount} HSC tokens.`);
      // Clear the navigation state
      navigate(location.pathname, { replace: true });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    }
  }, [user, navigate]); // Removed location.state from dependencies

  const fetchHSCInfo = async () => {
    try {
      setLoading(true);
      const response = await hscAPI.getInfo();
      setPackages(response.data.packages || []);
      setHscConfig({
        hscValue: response.data.hscValue,
        currency: response.data.currency
      });
    } catch (error) {
      setError('Failed to fetch HSC packages');
      console.error('Fetch HSC info error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await userAPI.getHSCBalance();
      setUserBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Fetch user balance error:', error);
    }
  };

  const calculatePrice = (hscAmount, discount = 0) => {
    const basePrice = hscAmount * hscConfig.hscValue;
    const discountAmount = (basePrice * discount) / 100;
    return basePrice - discountAmount;
  };

  const handlePackagePurchase = (pkg) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const finalPrice = calculatePrice(pkg.hscAmount, pkg.discount);
    
    // Navigate to PayHere payment page with package data
    navigate('/payment/payhere', {
      state: {
        HSCamount: pkg.hscAmount,
        Amount: finalPrice,
        currency: hscConfig.currency,
        items: `HSC Package - ${pkg.name}`,
        packageId: pkg._id,
        type: 'package'
      }
    });
  };

  const handleCustomPurchase = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const hscAmount = parseInt(customAmount);
    if (!hscAmount || hscAmount <= 0) {
      setError('Please enter a valid HSC amount');
      return;
    }

    const totalPrice = hscAmount * hscConfig.hscValue;
    
    // Navigate to PayHere payment page with custom data
    navigate('/payment/payhere', {
      state: {
        HSCamount: hscAmount,
        Amount: totalPrice,
        currency: hscConfig.currency,
        items: `Custom HSC Purchase - ${hscAmount} HSC`,
        type: 'custom'
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mb-4 overflow-hidden">
          <img
            src="https://res.cloudinary.com/dqdcmluxj/image/upload/v1734337684/hsc_resll6_1_q0eksv.webp"
            alt="HSC Coin"
            className="w-10 h-10 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Coins (HSC) and Treasure
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Purchase HSC tokens to advertise your tourism services and reach more customers
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-sm text-green-600 dark:text-green-400">{success}</span>
          </div>
        </div>
      )}

      {/* Current Balance & HSC Value Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user && (
          <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center mb-4">
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your HSC Balance
              </h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {userBalance} HSC
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current balance in your wallet
            </p>
          </div>
        )}

        <div className="card p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-center mb-4">
            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Current HSC Value
            </h3>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            1 HSC = {hscConfig.hscValue} {hscConfig.currency}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current exchange rate
          </p>
        </div>
      </div>

      {/* HSC Packages */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            HSC Packages
          </h2>
          <button
            onClick={() => setShowCustomPurchase(!showCustomPurchase)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Custom Purchase</span>
          </button>
        </div>

        {/* Custom Purchase Section */}
        {showCustomPurchase && (
          <div className="card p-6 mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Custom HSC Purchase
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  HSC Amount
                </label>
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="input-field"
                  placeholder="Enter HSC amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Price
                </label>
                <div className="input-field bg-gray-50 dark:bg-gray-700">
                  {customAmount ? (parseInt(customAmount) * hscConfig.hscValue).toFixed(2) : '0.00'} {hscConfig.currency}
                </div>
              </div>
              <button
                onClick={handleCustomPurchase}
                disabled={!customAmount || parseInt(customAmount) <= 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Purchase Now
              </button>
            </div>
          </div>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg._id} className="card p-6 relative hover:shadow-lg transition-shadow duration-200 flex flex-col">
              {/* Discount Badge */}
              {pkg.discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {pkg.discount}% OFF
                </div>
              )}

              {/* Package Icon */}
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>

              {/* Package Details */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {pkg.name}
              </h3>

              <div className="mb-4">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {pkg.hscAmount} HSC
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {pkg.discount > 0 ? (
                    <>
                      <span className="line-through mr-2">
                        {(pkg.hscAmount * hscConfig.hscValue).toFixed(2)} {hscConfig.currency}
                      </span>
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {calculatePrice(pkg.hscAmount, pkg.discount).toFixed(2)} {hscConfig.currency}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {(pkg.hscAmount * hscConfig.hscValue).toFixed(2)} {hscConfig.currency}
                    </span>
                  )}
                </div>
              </div>

              {pkg.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {pkg.description}
                </p>
              )}

              {/* Features */}
              <div className="flex-grow">
                {pkg.features && pkg.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features:</h4>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Star className="w-3 h-3 text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Purchase Button - Always at bottom */}
              <div className="mt-auto">
                <button
                  onClick={() => handlePackagePurchase(pkg)}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Purchase Package</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {packages.length === 0 && (
          <div className="card p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No packages available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              HSC packages will be displayed here once they are created by the admin.
            </p>
          </div>
        )}
      </div>

      {/* Information Section */}
      <div className="card p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          How HSC Tokens Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">1</span>
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Purchase HSC</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Buy HSC tokens using our secure payment system
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">2</span>
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Create Ads</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use HSC tokens to publish your tourism advertisements
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">3</span>
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Reach Customers</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get more visibility and attract more customers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HSCTreasure;
