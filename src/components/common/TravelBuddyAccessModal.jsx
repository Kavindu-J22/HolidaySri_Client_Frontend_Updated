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

  const handleClose = () => {
    onClose();
    // Redirect to home page when modal is closed
    navigate('/');
  };

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
          icon: <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" />,
          title: 'Purchase Travel Buddy Advertisement Slot',
          description: 'To access the Travel Buddies Platform and connect with other travel companions, you need to purchase a Travel Buddy advertisement slot first and Publish.',
          primaryButton: 'Purchase Slot',
          secondaryButton: 'Check Purchased Slots',
          bgGradient: 'from-blue-500 to-purple-600'
        };

      case 'no_ad':
      case 'inactive':
        return {
          icon: <Users className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500" />,
          title: 'Publish Your Travel Buddy Profile',
          description: 'You have purchased a Travel Buddy slot but haven\'t published your profile yet. Complete your profile to start connecting with other travel buddies.',
          primaryButton: 'Publish Profile',
          secondaryButton: 'Check Purchased Slots',
          bgGradient: 'from-orange-500 to-red-500'
        };

      case 'expired':
        return {
          icon: <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />,
          title: 'Profile Expired - Renew Now',
          description: 'Your Travel Buddy profile has expired. Renew your advertisement to continue connecting with travel companions and accessing platform features.',
          primaryButton: 'Renew Profile',
          secondaryButton: null,
          bgGradient: 'from-red-500 to-pink-600'
        };

      default:
        return {
          icon: <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />,
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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-2 sm:mx-4 overflow-hidden max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient background */}
        <div className={`bg-gradient-to-r ${content.bgGradient} p-4 sm:p-6 text-white relative`}>
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-gray-200 transition-colors z-10"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full mb-3 sm:mb-4">
              {content.icon}
            </div>
            <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 pr-8 sm:pr-0">{content.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center mb-4 sm:mb-6 leading-relaxed">
            {content.description}
          </p>

          {/* Features highlight for no_profile case */}
          {reason === 'no_profile' && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2 flex-shrink-0" />
                Platform Benefits
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Connect with verified travel companions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Publish Your Travel Requests</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Join With Other Travelers requested travels</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Build your travel network</span>
                </li>
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={handlePrimaryAction}
              className={`w-full bg-gradient-to-r ${content.bgGradient} text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}
            >
              <span>{content.primaryButton}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {content.secondaryButton && (
              <button
                onClick={handleSecondaryAction}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
