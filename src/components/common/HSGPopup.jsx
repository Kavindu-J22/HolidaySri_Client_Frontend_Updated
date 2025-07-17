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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header with close button */}
        <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome Gift! 🎉
            </h2>
            <p className="text-green-100">
              Join Holidaysri Today
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-yellow-500 mr-1" />
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  100 HSG
                </span>
                <Star className="w-6 h-6 text-yellow-500 ml-1" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Free Holidaysri Gem Tokens
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Register with Us Now and Earn
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              As a new user gift, get <strong>100 HSG tokens FREE</strong>! Use them to publish your first advertisement and start promoting your tourism services.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-6">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                ✨ Perfect for tourism businesses, hotels, restaurants, and travel services
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Gift className="w-5 h-5" />
              <span>Register Now & Get 100 HSG</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogin}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Already have an account? Login
            </button>
          </div>

          <div className="mt-4 text-center">
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
