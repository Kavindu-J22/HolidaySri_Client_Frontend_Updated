import {
  Crown,
  Check,
  X,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const MembershipSuccessModal = ({ isOpen, onClose, membershipType, features }) => {
  if (!isOpen) return null;

  const handleLetsEarn = async () => {
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Close modal after a short delay to allow scroll animation
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-6 text-center relative overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
            <Sparkles className="absolute top-8 left-8 w-4 h-4 text-white/60 animate-bounce" />
            <Sparkles className="absolute bottom-8 right-8 w-3 h-3 text-white/60 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
          
          {/* Main content */}
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              🎉 Welcome to Premium!
            </h2>
            <p className="text-white/90 text-sm">
              You're now a Holidaysri {membershipType} member
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Your Premium Benefits Are Active!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Start enjoying exclusive features and enhanced visibility
            </p>
          </div>

          {/* Benefits list */}
          <div className="space-y-3 mb-6">
            {features?.slice(0, 4).map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLetsEarn}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Let's Earn!</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipSuccessModal;
