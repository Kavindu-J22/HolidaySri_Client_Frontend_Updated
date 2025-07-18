import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { promoCodeAPI } from '../config/api';
import { 
  Gift, 
  Star, 
  Crown, 
  Diamond, 
  Sparkles,
  TrendingUp,
  Calendar,
  Clock,
  ShoppingCart,
  Loader,
  RefreshCw,
  AlertCircle,
  Users,
  MapPin,
  CheckCircle
} from 'lucide-react';

const PromoCodesAndTravelAgents = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [promoConfig, setPromoConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPromoCodeModal, setShowPromoCodeModal] = useState(false);
  const [userPromoCodeData, setUserPromoCodeData] = useState(null);

  useEffect(() => {
    fetchPromoConfig();
  }, []);

  const fetchPromoConfig = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await promoCodeAPI.getConfig();
      setPromoConfig(response.data);
    } catch (error) {
      console.error('Error fetching promo config:', error);
      setError('Failed to load promo code information');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (promoType, promoData) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Check if user already has a promo code
      const response = await promoCodeAPI.checkUserHasPromoCode();

      if (response.data.hasPromoCode) {
        // Show creative modal that user already has a promo code
        setUserPromoCodeData(response.data);
        setShowPromoCodeModal(true);
        return;
      }

      // Prepare data to pass to GeneratePromoCode page
      const promoTypeData = {
        type: promoType.key,
        name: promoType.name,
        priceInHSC: promoData.priceInHSC,
        priceInLKR: promoData.priceInLKR,
        originalPriceInHSC: promoData.originalPriceInHSC,
        originalPriceInLKR: promoData.originalPriceInLKR,
        discountRate: promoData.discountRate,
        earningForPurchase: promoData.earningForPurchase,
        earningForMonthlyAd: promoData.earningForMonthlyAd,
        earningForDailyAd: promoData.earningForDailyAd,
        discountAmountHSC: promoConfig?.discounts?.purchaseDiscountInHSC || 0
      };

      navigate('/generate-promo-code', { state: promoTypeData });
    } catch (error) {
      console.error('Error checking user promo code:', error);
      setError('Failed to check promo code status. Please try again.');
    }
  };

  const promoTypes = [
    {
      key: 'silver',
      name: 'Silver Promo Code',
      icon: Star,
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      description: 'Perfect for getting started with promotional benefits',
      features: ['Basic promotional benefits', 'Standard earning rates', 'Promote 1,500 ads and get Free Upgrade to Gold Promo Code', 'For just 5 HSC, you can advertise your promo code to thousands of targeted customers on our site. (Annually).']
    },
    {
      key: 'gold',
      name: 'Gold Promo Code',
      icon: Crown,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      description: 'Enhanced benefits for growing businesses',
      features: ['Enhanced promotional benefits', 'Better earning rates', 'Promote 2,500 ads and get Free Upgrade to Gold Promo Code', 'For just 3 HSC, you can advertise your promo code to thousands of targeted customers on our site. (Annually).']
    },
    {
      key: 'diamond',
      name: 'Diamond Promo Code',
      icon: Diamond,
      color: 'from-blue-400 to-purple-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      description: 'Premium benefits for established businesses',
      features: ['Premium promotional benefits', 'Highest earning rates', 'Advertise your promo code for free on our platform and reach thousands of potential customers. (Annually)', 'Unlock the "Top Agent" badge']
    },
    {
      key: 'free',
      name: 'Free Promo Code',
      icon: Gift,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      description: 'Basic benefits at no cost',
      features: ['Basic promotional benefits', 'Limited earning rates', 'Standard support', 'Promote your promo code to help others purchase Silver, Gold or Diamond promo code and earn Related referral for each successful purchase.', 'Earn free upgrades: If You Promote using your free promo code, you will earn free upgrades based on the number of ads you promote: 700 ads → Silver Promo Code | 1,500 ads → Gold Promo Code| 2,500 ads → Diamond Promo Code.', 'The in-site advertising feature is locked for free promo codes.']
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-600 text-center">{error}</p>
        <button
          onClick={fetchPromoConfig}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4">
          <Gift className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Promo Codes & Travel Agents
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose the perfect promo code type for your business and maximize your earnings with our travel agent network
        </p>
      </div>

      {/* Promo Code Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {promoTypes.map((promoType) => {
          const promoData = promoConfig?.promoTypes?.[promoType.key];
          const IconComponent = promoType.icon;
          const hasDiscount = promoData?.discountRate > 0;

          return (
            <div
              key={promoType.key}
              className={`relative overflow-hidden rounded-2xl border-2 ${promoType.borderColor} ${promoType.bgColor} dark:${promoType.bgColor.replace('bg-', 'bg-gray-800 dark:border-gray-600')} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full`}
            >
              {/* Header */}
              <div className="p-6 pb-4 flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${promoType.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  {promoType.key === 'diamond' && (
                    <div className="flex items-center space-x-1 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      <span>PREMIUM</span>
                    </div>
                  )}
                </div>

                <h3 className={`text-xl font-bold ${promoType.textColor} dark:text-white mb-2`}>
                  {promoType.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {promoType.description}
                </p>

                {/* Price */}
                <div className="text-center mb-4">
                  {hasDiscount ? (
                    <div>
                      {/* Original Price (crossed out) */}
                      <div className="flex items-baseline justify-center space-x-2 mb-1">
                        <span className="text-lg line-through text-gray-400 dark:text-gray-500">
                          {promoData?.originalPriceInHSC || 0}
                        </span>
                        <span className="text-sm text-gray-400 dark:text-gray-500">HSC</span>
                      </div>
                      {/* Discounted Price */}
                      <div className="flex items-baseline justify-center space-x-2">
                        <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {promoData?.priceInHSC || 0}
                        </span>
                        <span className="text-lg text-green-600 dark:text-green-400">HSC</span>
                      </div>
                      {/* Discount Badge */}
                      <div className="inline-flex items-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium mt-2">
                        {promoData?.discountRate}% OFF
                      </div>
                      {promoData?.priceInLKR > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          ( {promoData.discountedPriceInLKR} LKR | Annually )
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline justify-center space-x-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {promoData?.priceInHSC || 0}
                        </span>
                        <span className="text-lg text-gray-500 dark:text-gray-400">HSC</span>
                      </div>
                      {promoData?.priceInLKR > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          ( {promoData.priceInLKR} LKR | Annually )
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Earnings Section */}
              <div className="px-6 pb-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Earning Opportunities
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600 dark:text-gray-400">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Purchase-Promo
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {promoData?.earningForPurchase || 0} LKR
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      Monthly Ad
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {promoData?.earningForMonthlyAd || 0} LKR
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Daily Ad
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {promoData?.earningForDailyAd || 0} LKR
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="px-6 pb-6 flex-grow">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Features & Benefits</h4>
                <ul className="space-y-2">
                  {/* Original Features */}
                  {promoType.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0"></div>
                      <span><strong>Feature:</strong> {feature}</span>
                    </li>
                  ))}

                  {/* Promote Earning Feature - Only for non-free promo codes */}
                  {promoType.key !== 'free' && (
                    <li className="flex items-start text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                      <TrendingUp className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Promote & Earn:</strong> Promote your promo code to help others purchase this {promoType.name.toLowerCase()} and earn{' '}
                        <span className="font-bold">{promoData?.earningForPurchase || 0} LKR</span> for each successful referral
                      </span>
                    </li>
                  )}

                  {/* Purchase Discount Feature - Only for non-free promo codes */}
                  {promoType.key !== 'free' && (
                    <li className="flex items-start text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                      <Gift className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Agent Discount:</strong> Use another agent's promo code when purchasing and get{' '}
                        <span className="font-bold">
                          {promoConfig?.discounts?.purchaseDiscountInHSC || 0} HSC
                        </span>{' '}
                        discount. Final price:{' '}
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {promoData && promoConfig ? Math.max(0, Math.round((promoData.priceInHSC - promoConfig.discounts.purchaseDiscountInHSC) * 100) / 100) : 0} HSC
                        </span>
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Action Button - Always at bottom */}
              <div className="px-6 pb-6 mt-auto">
                <button
                  onClick={() => handlePurchase(promoType, promoData)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors bg-gradient-to-r ${promoType.color} text-white hover:opacity-90 shadow-md hover:shadow-lg`}
                >
                  {promoType.key === 'free' ? 'Get Free Code' : 'Purchase Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pre-Used Promo Codes Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-3">
            Pre-Used Promo Codes
          </h2>
          <p className="text-amber-700 dark:text-amber-400 max-w-2xl mx-auto">
            Explore Pre-Used Promocodes and Buy one For More Benefits. Get exclusive deals from our verified agents and maximize your promotional advantages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Benefits */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-amber-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Why Choose Pre-Used Codes?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                Verified and tested by previous users
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                Often available at discounted rates
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                Immediate activation and benefits
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                Full earning potential maintained
              </li>
            </ul>
          </div>

          {/* How it Works */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-amber-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
              How It Works
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                <span>Browse available pre-used codes from our marketplace</span>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                <span>Check code details, benefits, and pricing</span>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                <span>Purchase and activate instantly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:from-amber-700 hover:to-orange-700 transition-colors shadow-md hover:shadow-lg">
            <div className="flex items-center justify-center space-x-2">
              <span>Explore Pre-Used Codes</span>
              <TrendingUp className="w-4 h-4" />
            </div>
          </button>
          <button className="bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 border-2 border-amber-600 dark:border-amber-400 px-8 py-3 rounded-lg font-medium hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center justify-center space-x-2">
              <span>Check Availability</span>
              <RefreshCw className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            💡 <strong>Pro Tip:</strong> Pre-used codes are regularly updated. Check back frequently for new opportunities!
          </p>
        </div>
      </div>

      {/* Travel Agents Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Travel Agent Network
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join our exclusive network of travel agents and unlock additional earning opportunities with your promo codes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Agent Benefits */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Higher Earnings</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Travel agents earn up to 25% more on promotional activities and referrals
            </p>
          </div>

          {/* Exclusive Access */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Exclusive Access</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get early access to new promo codes and special agent-only promotional campaigns
            </p>
          </div>

          {/* Network Support */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Network Support</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect with other agents, share experiences, and get dedicated support
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md hover:shadow-lg">
            Explore & Find Promo Code
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Explore and Find Promo Code From Our Agents
          </p>
        </div>
      </div>

      {/* Current HSC Value Info */}
      {promoConfig && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current HSC Value: <span className="font-medium text-gray-900 dark:text-white">{promoConfig.hscValue} {promoConfig.currency}</span>
            {promoConfig.lastUpdated && (
              <span className="ml-2">
                • Last updated: {new Date(promoConfig.lastUpdated).toLocaleDateString()}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Already Has Promo Code Modal - Responsive */}
      {showPromoCodeModal && userPromoCodeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
            <button
              onClick={() => setShowPromoCodeModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4 sm:mb-6">
                <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-amber-800 dark:text-amber-300 mb-3 sm:mb-4 px-2">
                You Already Have a Promocode! 🎉
              </h2>

              <p className="text-amber-700 dark:text-amber-400 text-base sm:text-lg mb-4 sm:mb-6 px-2">
                Great news! You already have a <strong className="capitalize">{userPromoCodeData.promoCodeType}</strong> promo code.
              </p>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-amber-200 dark:border-amber-700">
                <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono tracking-wider mb-1 sm:mb-2 break-all">
                  {userPromoCodeData.promoCode}
                </p>
                <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400">Your Active Promo Code</p>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-amber-200 dark:border-amber-600">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">
                  What you can do with your existing promocode:
                </h3>
                <ul className="text-left space-y-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Promote it to earn referral bonuses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Use it for advertisement discounts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Share with friends and family</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Start earning from day one</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowPromoCodeModal(false)}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 sm:px-6 py-3 rounded-lg font-medium hover:from-amber-700 hover:to-orange-700 transition-colors text-sm sm:text-base"
                >
                  Got It! Let's Use My Promo Code
                </button>

                <button
                  onClick={() => {
                    setShowPromoCodeModal(false);
                    navigate('/profile');
                  }}
                  className="w-full border border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400 px-4 sm:px-6 py-3 rounded-lg font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-sm sm:text-base"
                >
                  View My Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodesAndTravelAgents;
