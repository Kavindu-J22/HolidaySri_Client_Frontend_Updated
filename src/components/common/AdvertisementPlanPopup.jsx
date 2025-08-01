import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  CalendarDays, 
  CalendarRange,
  Star,
  Zap,
  CreditCard,
  Wallet,
  Gem,
  Diamond,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { hscAPI, userAPI } from '../../config/api';

const AdvertisementPlanPopup = ({ 
  isOpen, 
  onClose, 
  selectedSlot,
  slotCharges,
  hscValue = 100
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [currentStep, setCurrentStep] = useState(1); // 1: Plan Selection, 2: Payment Method
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [userBalances, setUserBalances] = useState({
    hsc: 0,
    hsg: 0,
    hsd: 0
  });
  const [tokenValues, setTokenValues] = useState({
    hsgValue: 1,
    hsdValue: 1,
    currency: 'LKR'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user balances and token values when popup opens
  useEffect(() => {
    if (isOpen && user) {
      fetchUserBalances();
      fetchTokenValues();
    }
  }, [isOpen, user]);

  const fetchUserBalances = async () => {
    try {
      const response = await userAPI.getHSCBalance();
      setUserBalances({
        hsc: response.data.balance || 0,
        hsg: response.data.hsgBalance || 0,
        hsd: response.data.hsdBalance || 0
      });
    } catch (error) {
      console.error('Failed to fetch user balances:', error);
    }
  };

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

  // Get available plans for the selected slot
  const getAvailablePlans = () => {
    if (!selectedSlot || !slotCharges) return [];

    const categoryKey = selectedSlot.categoryId;
    const slotKey = selectedSlot.slotId;
    
    let slotPricing = null;
    
    // Handle home banner special case
    if (categoryKey === 'home_banner') {
      slotPricing = slotCharges.homeBanner;
    } else {
      // Handle other categories
      const categoryData = slotCharges[categoryKey];
      if (categoryData && categoryData[slotKey]) {
        slotPricing = categoryData[slotKey];
      }
    }

    if (!slotPricing) return [];

    const plans = [];
    
    // Add hourly plan if available (only for home banner)
    if (slotPricing.hourlyCharge) {
      plans.push({
        id: 'hourly',
        name: 'Hourly',
        duration: '1 Hour',
        icon: Clock,
        color: 'from-orange-500 to-red-500',
        lkrPrice: slotPricing.hourlyCharge,
        hscPrice: Math.ceil(slotPricing.hourlyCharge / hscValue),
        description: 'Perfect for short-term promotions'
      });
    }

    // Add daily plan
    if (slotPricing.dailyCharge) {
      plans.push({
        id: 'daily',
        name: 'Daily',
        duration: '1 Day',
        icon: Calendar,
        color: 'from-blue-500 to-cyan-500',
        lkrPrice: slotPricing.dailyCharge,
        hscPrice: Math.ceil(slotPricing.dailyCharge / hscValue),
        description: 'Great for daily promotions'
      });
    }

    // Add monthly plan
    if (slotPricing.monthlyCharge) {
      plans.push({
        id: 'monthly',
        name: 'Monthly',
        duration: '30 Days',
        icon: CalendarDays,
        color: 'from-green-500 to-emerald-500',
        lkrPrice: slotPricing.monthlyCharge,
        hscPrice: Math.ceil(slotPricing.monthlyCharge / hscValue),
        description: 'Most popular choice',
        popular: true
      });
    }

    // Add yearly plan
    if (slotPricing.yearlyCharge) {
      plans.push({
        id: 'yearly',
        name: 'Yearly',
        duration: '365 Days',
        icon: CalendarRange,
        color: 'from-purple-500 to-pink-500',
        lkrPrice: slotPricing.yearlyCharge,
        hscPrice: Math.ceil(slotPricing.yearlyCharge / hscValue),
        description: 'Best value for long-term advertising'
      });
    }

    return plans;
  };

  // Get payment methods with converted values
  const getPaymentMethods = () => {
    if (!selectedPlan) return [];

    const methods = [
      {
        id: 'hsc',
        name: 'HSC Tokens',
        icon: Zap,
        color: 'from-blue-500 to-cyan-500',
        balance: userBalances.hsc,
        requiredAmount: selectedPlan.hscPrice,
        convertedValue: selectedPlan.lkrPrice,
        currency: 'HSC',
        description: 'Use your HSC tokens'
      },
      {
        id: 'hsg',
        name: 'HSG Gems',
        icon: Gem,
        color: 'from-green-500 to-emerald-500',
        balance: userBalances.hsg,
        requiredAmount: Math.ceil(selectedPlan.lkrPrice / tokenValues.hsgValue),
        convertedValue: selectedPlan.lkrPrice,
        currency: 'HSG',
        description: 'Use your HSG gems'
      },
      {
        id: 'hsd',
        name: 'HSD Earnings',
        icon: Diamond,
        color: 'from-purple-500 to-pink-500',
        balance: userBalances.hsd,
        requiredAmount: Math.ceil(selectedPlan.lkrPrice / tokenValues.hsdValue),
        convertedValue: selectedPlan.lkrPrice,
        currency: 'HSD',
        description: 'Use your HSD earnings'
      }
    ];

    return methods;
  };

  // Handle authentication check
  const handleAuthCheck = () => {
    if (!user) {
      onClose();
      navigate('/login');
      return false;
    }
    return true;
  };

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    if (!handleAuthCheck()) return;
    
    setSelectedPlan(plan);
    setCurrentStep(2);
    setError(null);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setError(null);
  };

  // Handle next step (proceed with payment)
  const handleNext = () => {
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    // Check if user has sufficient balance
    if (selectedPaymentMethod.balance < selectedPaymentMethod.requiredAmount) {
      // Redirect to advertisement payment page
      onClose();
      navigate('/advertisement-payment', {
        state: {
          slot: selectedSlot,
          plan: selectedPlan,
          paymentMethod: selectedPaymentMethod,
          insufficientBalance: true
        }
      });
      return;
    }

    // If balance is sufficient, proceed with payment processing
    // For now, we'll redirect to payment page as well
    onClose();
    navigate('/advertisement-payment', {
      state: {
        slot: selectedSlot,
        plan: selectedPlan,
        paymentMethod: selectedPaymentMethod,
        sufficientBalance: true
      }
    });
  };

  // Handle back to previous step
  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setSelectedPaymentMethod(null);
      setError(null);
    }
  };

  // Handle popup close
  const handleClose = () => {
    setCurrentStep(1);
    setSelectedPlan(null);
    setSelectedPaymentMethod(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const availablePlans = getAvailablePlans();
  const paymentMethods = getPaymentMethods();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentStep === 1 ? 'Select Advertisement Plan' : 'Choose Payment Method'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedSlot?.name || 'Advertisement Slot'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Choose Your Advertisement Duration
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Select the plan that best fits your advertising needs
                </p>
              </div>

              {availablePlans.length === 0 ? (
                <div className="text-center py-8">
                  <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No plans available for this slot
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availablePlans.map((plan) => {
                    const IconComponent = plan.icon;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => handlePlanSelect(plan)}
                        className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                          plan.popular
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Most Popular
                            </span>
                          </div>
                        )}

                        <div className="text-center">
                          <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${plan.color} mb-4`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>

                          <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {plan.name}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {plan.duration}
                          </p>

                          <div className="space-y-2 mb-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {plan.lkrPrice.toLocaleString()} LKR
                            </div>
                            <div className="text-lg text-blue-600 dark:text-blue-400">
                              {plan.hscPrice} HSC
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {plan.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && selectedPlan && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Choose Your Payment Method
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Selected Plan: {selectedPlan.name} - {selectedPlan.lkrPrice.toLocaleString()} LKR
                </p>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  const isSelected = selectedPaymentMethod?.id === method.id;
                  const hasSufficientBalance = method.balance >= method.requiredAmount;

                  return (
                    <div
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method)}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${method.color}`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>

                          <div>
                            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {method.name}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {method.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {method.requiredAmount} {method.currency}
                          </div>
                          <div className={`text-sm ${
                            hasSufficientBalance
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            Balance: {method.balance} {method.currency}
                          </div>
                          {!hasSufficientBalance && (
                            <div className="text-xs text-red-500 mt-1">
                              Insufficient balance
                            </div>
                          )}
                        </div>

                        {isSelected && (
                          <div className="ml-4">
                            <CheckCircle className="w-6 h-6 text-blue-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            {currentStep === 2 && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>

            {currentStep === 2 && (
              <button
                onClick={handleNext}
                disabled={!selectedPaymentMethod || loading}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Processing...' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementPlanPopup;
