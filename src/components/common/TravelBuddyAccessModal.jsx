import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  Clock,
  ArrowRight,
  Star
} from 'lucide-react';

const TravelBuddyAccessModal = ({ isOpen, onClose, reason, message, redirectTo }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handlePrimaryAction = () => {
    onClose();
    if (reason === 'expired') {
      // For expired profiles, "Renew Profile" should go to My Advertisements
      navigate('/profile', { state: { activeSection: 'advertisements' } });
    } else {
      navigate(redirectTo);
    }
  };

  const handleSecondaryAction = () => {
    onClose();
    if (reason === 'no_profile') {
      // "View My Ads" should go to My Advertisements page
      navigate('/profile', { state: { activeSection: 'advertisements' } });
    }
  };

  const getModalContent = () => {
    switch (reason) {
      case 'no_profile':
        return {
          icon: <ShoppingBag className="w-16 h-16 text-blue-500" />,
          title: 'Purchase Travel Buddy Advertisement Slot',
          description: 'To access the Travel Buddies Platform and connect with other travel companions, you need to purchase a Travel Buddy advertisement slot first and Publish.',
          primaryButton: 'Purchase Slot',
          secondaryButton: 'View My Ads',
          bgGradient: 'from-blue-500 to-purple-600'
        };
      
      case 'no_ad':
      case 'inactive':
        return {
          icon: <Users className="w-16 h-16 text-orange-500" />,
          title: 'Publish Your Travel Buddy Profile',
          description: 'You have purchased a Travel Buddy slot but haven\'t published your profile yet. Complete your profile to start connecting with other travel buddies.',
          primaryButton: 'Publish Profile',
          secondaryButton: 'View My Ads',
          bgGradient: 'from-orange-500 to-red-500'
        };
      
      case 'expired':
        return {
          icon: <Clock className="w-16 h-16 text-red-500" />,
          title: 'Profile Expired - Renew Now',
          description: 'Your Travel Buddy profile has expired. Renew your advertisement to continue connecting with travel companions and accessing platform features.',
          primaryButton: 'Renew Profile',
          secondaryButton: null,
          bgGradient: 'from-red-500 to-pink-600'
        };
      
      default:
        return {
          icon: <AlertTriangle className="w-16 h-16 text-yellow-500" />,
          title: 'Access Restricted',
          description: message || 'You don\'t have access to the Travel Buddies Platform.',
          primaryButton: 'Get Access',
          secondaryButton: null,
          bgGradient: 'from-yellow-500 to-orange-500'
        };
    }
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header with gradient background */}
        <div className={`bg-gradient-to-r ${content.bgGradient} p-6 text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4">
              {content.icon}
            </div>
            <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
            {content.description}
          </p>

          {/* Features highlight for no_profile case */}
          {reason === 'no_profile' && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                Platform Benefits
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Connect with verified travel companions
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Professional messaging system
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Build your travel network
                </li>
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePrimaryAction}
              className={`w-full bg-gradient-to-r ${content.bgGradient} text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}
            >
              <span>{content.primaryButton}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {content.secondaryButton && (
              <button
                onClick={handleSecondaryAction}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {content.secondaryButton}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelBuddyAccessModal;
