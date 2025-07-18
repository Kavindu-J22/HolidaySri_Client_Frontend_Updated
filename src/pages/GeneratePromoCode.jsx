import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { promoCodeAPI } from '../config/api';
import { 
  Gift, 
  Shuffle, 
  Edit3, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
  Sparkles,
  DollarSign
} from 'lucide-react';

const GeneratePromoCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userHasPromoCode, setUserHasPromoCode] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Get promo type data from navigation state
  const promoTypeData = location.state;

  useEffect(() => {
    if (!promoTypeData) {
      navigate('/promo-codes-travel-agents');
      return;
    }
    checkUserPromoCode();
  }, []);

  const checkUserPromoCode = async () => {
    try {
      setLoading(true);
      // TODO: Add API call to check if user already has a promo code
      // For now, simulate the check
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserHasPromoCode(false); // Set to true to test the blocking message
    } catch (error) {
      console.error('Error checking user promo code:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'HS';
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleGenerateCode = () => {
    const newCode = generateRandomCode();
    setPromoCode(newCode);
    setSelectedOption('generate');
    setError('');
  };

  const handleCustomCodeChange = (value) => {
    // Only allow capital letters and numbers, max 5 characters
    const filtered = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
    setCustomCode(filtered);
    setPromoCode('HS' + filtered);
    setError('');
  };

  const validatePromoCode = async (codeToValidate) => {
    try {
      setIsValidating(true);
      // TODO: Add API call to validate promo code uniqueness
      // For now, simulate validation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate some codes already existing
      const existingCodes = ['HSABC12', 'HSTEST1', 'HS12345'];
      if (existingCodes.includes(codeToValidate)) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error validating promo code:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleNext = async () => {
    if (!promoCode || promoCode.length !== 7) {
      setError('Please generate or customize a valid promo code');
      return;
    }

    setError('');
    const isValid = await validatePromoCode(promoCode);
    
    if (!isValid) {
      setError('This Promocode already exists. Generate or customize another one.');
      return;
    }

    // Calculate discount amount in HSC
    const discountAmountHSC = promoTypeData.discountAmountHSC || 0;
    
    // Prepare data for payment page
    const paymentData = {
      itemName: `${promoTypeData.name} - ${promoCode}`,
      itemPrice: promoTypeData.priceInHSC,
      itemCategory: 'Promocode',
      quantity: 1,
      discountAmount: discountAmountHSC,
      earnRate: promoTypeData.earningForPurchase,
      promoCode: promoCode,
      promoType: promoTypeData.type
    };

    // Navigate to promo code payment page with data
    navigate('/promo-code-payment', { state: paymentData });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (userHasPromoCode) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-6">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-4">
            You Already Have a Promocode! 🎉
          </h2>
          <p className="text-amber-700 dark:text-amber-400 text-lg mb-6">
            Great news! You're already equipped with a powerful promocode. 
            Why not put it to work and start earning amazing benefits?
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-amber-200 dark:border-amber-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              What you can do with your existing promocode:
            </h3>
            <ul className="text-left space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Promote it to earn referral bonuses
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Use it for advertisement discounts
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Share with friends and family
              </li>
            </ul>
          </div>
          <button
            onClick={() => navigate('/promo-codes-travel-agents')}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:from-amber-700 hover:to-orange-700 transition-colors"
          >
            Back to Promo Codes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Generate Your Promocode
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Create your unique {promoTypeData?.name} and start earning benefits
        </p>
      </div>

      {/* Selected Promo Type Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {promoTypeData?.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Price: {promoTypeData?.priceInHSC} HSC
              </span>
              <span className="flex items-center">
                <Gift className="w-4 h-4 mr-1" />
                Earn: {promoTypeData?.earningForPurchase} LKR per referral
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generate Option */}
        <div
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
            selectedOption === 'generate'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-600'
          }`}
          onClick={() => setSelectedOption('generate')}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-xl ${selectedOption === 'generate' ? 'bg-green-500' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <Shuffle className={`w-6 h-6 ${selectedOption === 'generate' ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Generate Promocode</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Let us create a unique promocode for you automatically
          </p>
          {selectedOption === 'generate' && (
            <div className="space-y-4">
              <button
                onClick={handleGenerateCode}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Shuffle className="w-4 h-4" />
                <span>Generate New Code</span>
              </button>
              {promoCode && selectedOption === 'generate' && (
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Generated Code:</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 font-mono tracking-wider">
                    {promoCode}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Customize Option */}
        <div
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
            selectedOption === 'customize'
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
          }`}
          onClick={() => setSelectedOption('customize')}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-xl ${selectedOption === 'customize' ? 'bg-purple-500' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <Edit3 className={`w-6 h-6 ${selectedOption === 'customize' ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Customize Promocode</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your own personalized promocode
          </p>
          {selectedOption === 'customize' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter 5 characters (A-Z, 0-9 only):
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400 font-mono">HS</span>
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => handleCustomCodeChange(e.target.value)}
                    placeholder="ABC12"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white font-mono text-lg"
                    maxLength={5}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Only capital letters (A-Z) and numbers (0-9) allowed
                </p>
              </div>
              {promoCode && selectedOption === 'customize' && customCode.length === 5 && (
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Custom Code:</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono tracking-wider">
                    {promoCode}
                  </p>
                </div>
              )}
            </div>
          )}
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

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate('/promo-codes-travel-agents')}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!promoCode || promoCode.length !== 7 || isValidating}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isValidating ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Validating...</span>
            </>
          ) : (
            <>
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GeneratePromoCode;
