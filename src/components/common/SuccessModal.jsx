import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessModal = ({
  title = 'Success!',
  message = 'Operation completed successfully',
  onClose,
  autoCloseDelay = 3000,
  showAutoClose = true,
  isOpen = true
}) => {
  useEffect(() => {
    if (isOpen && showAutoClose && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose, showAutoClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
            {message}
          </p>

          {/* Progress bar for auto-close */}
          {showAutoClose && (
            <div className="mb-4">
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-shrink"
                  style={{
                    animation: `shrink ${autoCloseDelay}ms linear forwards`
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                Redirecting in {Math.ceil(autoCloseDelay / 1000)} seconds...
              </p>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessModal;

