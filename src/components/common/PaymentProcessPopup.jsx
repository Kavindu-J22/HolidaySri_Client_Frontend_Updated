import React from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Loader, 
  X, 
  CreditCard,
  Shield,
  Clock,
  Zap,
  Crown,
  Diamond,
  Star
} from 'lucide-react';

const PaymentProcessPopup = ({ 
  isOpen, 
  onClose, 
  status, // 'loading', 'success', 'error', 'warning'
  title,
  message,
  promoCode,
  amount,
  amountLKR,
  onConfirm,
  onCancel,
  showConfirmation = false,
  autoCloseDelay = null
}) => {
  const [countdown, setCountdown] = React.useState(autoCloseDelay);

  React.useEffect(() => {
    if (autoCloseDelay && status === 'success') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [autoCloseDelay, status, onClose]);

  const getPromoCodeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'diamond': return <Diamond className="w-5 h-5 text-purple-500" />;
      case 'gold': return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'silver': return <Star className="w-5 h-5 text-gray-500" />;
      default: return <Zap className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <Loader className="w-12 h-12 text-blue-500 animate-spin" />,
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          titleColor: 'text-blue-800 dark:text-blue-200',
          messageColor: 'text-blue-700 dark:text-blue-300'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          titleColor: 'text-green-800 dark:text-green-200',
          messageColor: 'text-green-700 dark:text-green-300'
        };
      case 'error':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          titleColor: 'text-red-800 dark:text-red-200',
          messageColor: 'text-red-700 dark:text-red-300'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          titleColor: 'text-yellow-800 dark:text-yellow-200',
          messageColor: 'text-yellow-700 dark:text-yellow-300'
        };
      default:
        return {
          icon: <CreditCard className="w-12 h-12 text-gray-500" />,
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          titleColor: 'text-gray-800 dark:text-gray-200',
          messageColor: 'text-gray-700 dark:text-gray-300'
        };
    }
  };

  if (!isOpen) return null;

  const config = getStatusConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {showConfirmation ? 'Confirm Purchase' : 'Payment Process'}
            </h3>
          </div>
          {!showConfirmation && status !== 'loading' && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {showConfirmation ? (
            // Confirmation State
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                  <CreditCard className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Confirm Your Purchase
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to purchase this promo code?
                </p>
              </div>

              {/* Purchase Details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Promo Code:</span>
                  <div className="flex items-center space-x-2">
                    {getPromoCodeIcon(promoCode?.promoCodeType)}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {promoCode?.promoCode}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">
                    {promoCode?.promoCodeType}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {amount} HSC
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">LKR Equivalent:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {amountLKR?.toLocaleString()} LKR
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Confirm Purchase
                </button>
              </div>
            </div>
          ) : (
            // Status States (loading, success, error, warning)
            <div className="text-center">
              <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-6 mb-6`}>
                <div className="flex justify-center mb-4">
                  {config.icon}
                </div>
                <h4 className={`text-xl font-semibold ${config.titleColor} mb-2`}>
                  {title}
                </h4>
                <p className={`${config.messageColor} text-sm leading-relaxed`}>
                  {message}
                </p>
                
                {status === 'success' && countdown && (
                  <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Redirecting in {countdown} seconds...</span>
                  </div>
                )}
              </div>

              {/* Action Button for non-loading states */}
              {status !== 'loading' && !autoCloseDelay && (
                <button
                  onClick={onClose}
                  className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    status === 'success' 
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : status === 'error'
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {status === 'success' ? 'Continue to Dashboard' : 'Close'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessPopup;
