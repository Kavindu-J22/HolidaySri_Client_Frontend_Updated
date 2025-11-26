import { useState, useEffect } from 'react';
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
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mb-3 sm:mb-4 overflow-hidden shadow-lg">
          <img
            src="https://res.cloudinary.com/dqdcmluxj/image/upload/v1734337684/hsc_resll6_1_q0eksv.webp"
            alt="HSC Coin"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
          Coins (HSC) and Treasure
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
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
      <div className={`grid grid-cols-1 ${user ? 'md:grid-cols-2' : ''} gap-4 sm:gap-6 max-w-4xl mx-auto justify-items-center`}>
        {user && (
          <div className="card p-6 sm:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-blue-800/30 border-2 border-blue-200 dark:border-blue-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-3 sm:mb-4 shadow-lg">
                <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Your HSC Balance
              </h3>
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
                {userBalance} HSC
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Current balance in your wallet
              </p>
            </div>
          </div>
        )}

        <div className="card p-6 sm:p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-green-800/30 border-2 border-green-200 dark:border-green-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-md">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-3 sm:mb-4 shadow-lg">
              <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
              Current HSC Value
            </h3>
            <div className="text-3xl sm:text-4xl font-extrabold text-green-600 dark:text-green-400 mb-2">
              1 HSC = {hscConfig.hscValue} {hscConfig.currency}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Current exchange rate
            </p>
          </div>
        </div>
      </div>

      {/* HSC Packages */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            HSC Packages
          </h2>
          <button
            onClick={() => setShowCustomPurchase(!showCustomPurchase)}
            className="btn-secondary flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Custom HSC Purchase</span>
            <span className="sm:hidden">Custom Purchase</span>
          </button>
        </div>

        {/* Custom Purchase Section */}
        {showCustomPurchase && (
          <div className="card p-6 sm:p-8 mb-4 sm:mb-6 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-purple-800/30 border-2 border-purple-200 dark:border-purple-700 shadow-lg">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 mr-2" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Custom HSC Purchase
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  HSC Amount
                </label>
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="input-field text-base"
                  placeholder="Enter HSC amount"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Total Price
                </label>
                <div className="input-field bg-gray-100 dark:bg-gray-700 font-bold text-purple-600 dark:text-purple-400 text-base">
                  {customAmount ? (parseInt(customAmount) * hscConfig.hscValue).toFixed(2) : '0.00'} {hscConfig.currency}
                </div>
              </div>
              <button
                onClick={handleCustomPurchase}
                disabled={!customAmount || parseInt(customAmount) <= 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed h-[42px] shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base w-full"
              >
                Purchase Now
              </button>
            </div>
          </div>
        )}

        {/* Packages Grid - Centered with justify-content-center */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 w-full max-w-7xl mx-auto">
          {packages.map((pkg) => (
              <div key={pkg._id} className="card p-6 sm:p-8 relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm">
                {/* Discount Badge */}
                {pkg.discount > 0 && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                    {pkg.discount}% OFF
                  </div>
                )}

                {/* Package Icon */}
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-lg">
                    <Package className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>

                {/* Package Details */}
                <div className="text-center mb-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-3 px-2">
                    {pkg.name}
                  </h3>

                  <div className="mb-3 sm:mb-4">
                    <div className="text-2xl sm:text-3xl font-extrabold text-primary-600 dark:text-primary-400 mb-2">
                      {pkg.hscAmount} HSC
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {pkg.discount > 0 ? (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                          <span className="line-through text-gray-500 text-xs sm:text-sm">
                            {(pkg.hscAmount * hscConfig.hscValue).toFixed(2)} {hscConfig.currency}
                          </span>
                          <span className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                            {calculatePrice(pkg.hscAmount, pkg.discount).toFixed(2)} {hscConfig.currency}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                          {(pkg.hscAmount * hscConfig.hscValue).toFixed(2)} {hscConfig.currency}
                        </span>
                      )}
                    </div>
                  </div>

                  {pkg.description && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 px-2">
                      {pkg.description}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex-grow flex items-center justify-center">
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="mb-4 sm:mb-6 w-full">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 text-center">Package Features:</h4>
                      <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1.5 sm:space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center justify-center px-2">
                            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 mr-1.5 sm:mr-2 flex-shrink-0" />
                            <span className="text-center">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Purchase Button - Always at bottom */}
                <div className="mt-auto flex justify-center">
                  <button
                    onClick={() => handlePackagePurchase(pkg)}
                    className="btn-primary w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 shadow-lg hover:shadow-xl transition-shadow text-sm sm:text-base"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-semibold">Purchase Package</span>
                  </button>
                </div>
              </div>
            ))}
        </div>

        {packages.length === 0 && (
          <div className="card p-8 sm:p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 max-w-2xl mx-auto">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              No packages available
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
              HSC packages will be displayed here once they are created by the admin.
            </p>
          </div>
        )}
      </div>

      {/* Information Section */}
      <div className="card p-6 sm:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 border-2 border-indigo-200 dark:border-indigo-700 shadow-lg">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
          How HSC Tokens Work
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <span className="text-white font-bold text-xl sm:text-2xl">1</span>
            </div>
            <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-2 sm:mb-3">Purchase HSC</h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-2">
              Buy HSC tokens using our secure payment system
            </p>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <span className="text-white font-bold text-xl sm:text-2xl">2</span>
            </div>
            <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-2 sm:mb-3">Create Ads</h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-2">
              Use HSC tokens to publish your tourism advertisements
            </p>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <span className="text-white font-bold text-xl sm:text-2xl">3</span>
            </div>
            <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-2 sm:mb-3">Reach Customers</h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-2">
              Get more visibility and attract more customers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HSCTreasure;
