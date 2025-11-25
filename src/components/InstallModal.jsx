import { X, Smartphone, Monitor, Apple, Chrome } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useEffect, useState } from 'react';

const InstallModal = ({ isOpen, onClose, onInstall, canInstall }) => {
  const { isDarkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setIsIOS(iOS);
    
    // Check if Android
    const android = /android/i.test(userAgent);
    setIsAndroid(android);
    
    // Check if mobile
    const mobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    setIsMobile(mobile);
  }, []);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInstallClick = () => {
    if (canInstall && onInstall) {
      onInstall();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <h2 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Install Holidaysri App
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Mobile Instructions */}
          {isMobile && (
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
              <div className="flex items-start gap-3 mb-3">
                <Smartphone className={`w-6 h-6 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Mobile Installation
                </h3>
              </div>

              {/* iOS Instructions */}
              {isIOS && (
                <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Apple className="w-5 h-5" />
                    <span className="font-semibold">iOS (Safari)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Tap the <strong>Share</strong> button (square with arrow pointing up) at the bottom of Safari</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                    <li>Tap <strong>"Add"</strong> in the top right corner</li>
                    <li>The app icon will appear on your home screen</li>
                  </ol>
                  <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                      <strong>Note:</strong> This feature only works in Safari browser on iOS. If you're using Chrome or another browser, please open this page in Safari.
                    </p>
                  </div>
                </div>
              )}

              {/* Android Instructions */}
              {isAndroid && (
                <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Chrome className="w-5 h-5" />
                    <span className="font-semibold">Android (Chrome)</span>
                  </div>
                  {canInstall ? (
                    <div className="space-y-3">
                      <p className="text-sm">Click the button below to install the app:</p>
                      <button
                        onClick={handleInstallClick}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                      >
                        Install App Now
                      </button>
                    </div>
                  ) : (
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Tap the <strong>menu</strong> (three dots) in the top right corner</li>
                      <li>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></li>
                      <li>Tap <strong>"Add"</strong> or <strong>"Install"</strong></li>
                      <li>The app icon will appear on your home screen</li>
                    </ol>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Desktop Instructions */}
          {!isMobile && (
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-purple-900/20 border border-purple-800' : 'bg-purple-50 border border-purple-200'}`}>
              <div className="flex items-start gap-3 mb-3">
                <Monitor className={`w-6 h-6 flex-shrink-0 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Desktop Installation
                </h3>
              </div>

              <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {canInstall ? (
                  <div className="space-y-3">
                    <p className="text-sm">Click the button below to install the app:</p>
                    <button
                      onClick={handleInstallClick}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Install App Now
                    </button>
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="text-sm">
                        <strong>Or</strong> click the <strong>Download/Install</strong> icon in the right side of your browser's address bar (near the favorite/star icon).
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm">
                      Look for the <strong>Download/Install</strong> icon in the right side of your browser's address bar (near the favorite/star icon) and click it to install.
                    </p>
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="text-xs">
                        <strong>Alternative:</strong> Click the menu (⋮) → "Install Holidaysri" or "Add to Home Screen"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Benefits Section */}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
            <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>
              Why Install?
            </h4>
            <ul className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>✅ Works offline</li>
              <li>✅ Faster loading</li>
              <li>✅ Home screen access</li>
              <li>✅ Full screen experience</li>
              <li>✅ Push notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallModal;

