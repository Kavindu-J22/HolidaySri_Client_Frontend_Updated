import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Gift, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const HSGPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only show popup if user is not logged in
    if (!user) {
      // Check if popup has been shown before
      const hasSeenPopup = localStorage.getItem('hsg-popup-shown');
      
      if (!hasSeenPopup) {
        // Show popup after 5 seconds
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleClose = () => {
    setIsVisible(false);
    // Mark popup as shown so it doesn't appear again
    localStorage.setItem('hsg-popup-shown', 'true');
  };

  const handleRegister = () => {
    handleClose();
    navigate('/register');
  };

  const handleLogin = () => {
    handleClose();
    navigate('/login');
  };

  if (!isVisible || user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full mx-2 sm:mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 text-white">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-gray-200 transition-colors p-1"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full mb-3 sm:mb-4">
              <img
                src="https://res.cloudinary.com/dqdcmluxj/image/upload/v1734594961/Untitled-12_mcloq6.webp"
                alt="HSG Gem"
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Welcome Gift! 🎉
            </h2>
            <p className="text-green-100 text-sm sm:text-base">
              Join Holidaysri Today
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500 mr-1" />
                <span className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                  100 HSG
                </span>
                <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500 ml-1" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Free Holidaysri Gem Tokens
              </p>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Register with Us Now and Earn
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-0">
              As a new user gift, get <strong>100 HSG tokens FREE</strong>! Use them to publish your first advertisement and start promoting your tourism services.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 sm:p-3 mb-4 sm:mb-6">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                ✨ Perfect for tourism businesses, hotels, restaurants, and travel services
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base"
            >
              <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Register Now & Get 100 HSG</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={handleLogin}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              Already have an account? Login
            </button>
          </div>

          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Limited time offer • Terms and conditions apply
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HSGPopup;
