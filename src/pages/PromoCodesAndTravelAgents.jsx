import React, { useState, useEffect } from 'react';
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
  MapPin
} from 'lucide-react';

const PromoCodesAndTravelAgents = () => {
  const [promoConfig, setPromoConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      features: ['Basic promotional benefits', 'Standard earning rates', 'Monthly advertisement support']
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
      features: ['Enhanced promotional benefits', 'Better earning rates', 'Priority advertisement support']
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
      features: ['Premium promotional benefits', 'Highest earning rates', 'VIP advertisement support']
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
      features: ['Basic promotional benefits', 'Limited earning rates', 'Standard support']
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
          
          return (
            <div
              key={promoType.key}
              className={`relative overflow-hidden rounded-2xl border-2 ${promoType.borderColor} ${promoType.bgColor} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${promoType.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  {promoType.key === 'diamond' && (
                    <div className="flex items-center space-x-1 text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      <span>PREMIUM</span>
                    </div>
                  )}
                </div>
                
                <h3 className={`text-xl font-bold ${promoType.textColor} mb-2`}>
                  {promoType.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {promoType.description}
                </p>

                {/* Price */}
                <div className="text-center mb-4">
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {promoData?.priceInHSC || 0}
                    </span>
                    <span className="text-lg text-gray-500">HSC</span>
                  </div>
                  {promoData?.priceInLKR > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      ({promoData.priceInLKR} LKR)
                    </p>
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
                    <span className="flex items-center text-gray-600">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Purchase-Promo
                    </span>
                    <span className="font-medium text-green-600">
                      {promoData?.earningForPurchase || 0} LKR
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      Monthly Ad
                    </span>
                    <span className="font-medium text-green-600">
                      {promoData?.earningForMonthlyAd || 0} LKR
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <Clock className="w-3 h-3 mr-1" />
                      Daily Ad
                    </span>
                    <span className="font-medium text-green-600">
                      {promoData?.earningForDailyAd || 0} LKR
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="px-6 pb-6">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Features</h4>
                <ul className="space-y-1">
                  {promoType.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6">
                <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors bg-gradient-to-r ${promoType.color} text-white hover:opacity-90`}>
                  {promoType.key === 'free' ? 'Get Free Code' : 'Purchase Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Travel Agents Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Higher Earnings</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Travel agents earn up to 25% more on promotional activities and referrals
            </p>
          </div>

          {/* Exclusive Access */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Crown className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Exclusive Access</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get early access to new promo codes and special agent-only promotional campaigns
            </p>
          </div>

          {/* Network Support */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
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
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors">
            Explore & Find Promo Code
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Explore and Find Promo Code From Our Agents
          </p>
        </div>
      </div>

      {/* Pre-Used Promo Codes Info */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
              Pre-Used Promo Codes
            </h3>
            <p className="text-amber-700 dark:text-amber-400 text-sm mb-3">
              Already have a promo code from a previous purchase or promotion? You can still use it to earn benefits on your advertisements and activities.
            </p>
            <button className="text-amber-600 hover:text-amber-700 font-medium text-sm underline">
              Learn more about pre-used codes →
            </button>
          </div>
        </div>
      </div>

      {/* Current HSC Value Info */}
      {promoConfig && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current HSC Value: <span className="font-medium">{promoConfig.hscValue} {promoConfig.currency}</span>
            {promoConfig.lastUpdated && (
              <span className="ml-2">
                • Last updated: {new Date(promoConfig.lastUpdated).toLocaleDateString()}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default PromoCodesAndTravelAgents;
