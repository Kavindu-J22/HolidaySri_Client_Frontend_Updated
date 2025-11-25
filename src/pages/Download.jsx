import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Download as DownloadIcon,
  Monitor,
  Smartphone,
  Apple,
  Chrome,
  CheckCircle,
  Info,
  ExternalLink,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import InstallModal from '../components/InstallModal';

const Download = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const platforms = [
    {
      id: 'windows',
      name: 'Windows',
      icon: Monitor,
      description: 'Desktop application for Windows 10/11',
      version: 'v1.0.0',
      size: '85 MB',
      color: 'from-blue-500 to-blue-600',
      downloadUrl: '#', // Will be updated when app is ready
      features: [
        'Full desktop experience',
        'Offline mode support',
        'Native notifications',
        'Auto-updates'
      ],
      comingSoon: true
    },
    {
      id: 'android',
      name: 'Android',
      icon: Smartphone,
      description: 'Mobile app for Android devices',
      version: 'v1.0.0',
      size: '45 MB',
      color: 'from-green-500 to-green-600',
      downloadUrl: '#', // Will be updated when app is ready
      features: [
        'Optimized for mobile',
        'Push notifications',
        'Location services',
        'Camera integration'
      ],
      comingSoon: true
    },
    {
      id: 'ios',
      name: 'iOS',
      icon: Apple,
      description: 'Mobile app for iPhone & iPad',
      version: 'v1.0.0',
      size: '52 MB',
      color: 'from-gray-700 to-gray-900',
      downloadUrl: '#', // Will be updated when app is ready
      features: [
        'iOS 14+ support',
        'Face ID / Touch ID',
        'iCloud sync',
        'Widget support'
      ],
      comingSoon: true
    },
    {
      id: 'pwa',
      name: 'Web App (PWA)',
      icon: Chrome,
      description: 'Install as Progressive Web App',
      version: 'Latest',
      size: 'Instant',
      color: 'from-purple-500 to-purple-600',
      downloadUrl: window.location.origin,
      features: [
        'Works on all devices',
        'No installation needed',
        'Always up-to-date',
        'Offline capable'
      ],
      comingSoon: false,
      isPWA: true
    }
  ];

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    // Always show the modal with instructions
    setShowInstallModal(true);
  };

  const handleModalInstall = async () => {
    if (!deferredPrompt) {
      // Modal will show manual instructions
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleDownload = (platform) => {
    if (platform.comingSoon) {
      alert(`${platform.name} app is coming soon! We'll notify you when it's available.`);
    } else if (platform.isPWA) {
      handleInstallPWA();
    } else {
      window.open(platform.downloadUrl, '_blank');
    }
  };

  const filteredPlatforms = activeTab === 'all'
    ? platforms
    : platforms.filter(p => p.id === activeTab);

  return (
    <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className={`p-3 sm:p-4 rounded-2xl ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'} shadow-xl`}>
              <img
                src={isDarkMode
                  ? "https://res.cloudinary.com/dqdcmluxj/image/upload/v1752712704/4_xi6zj7.png"
                  : "https://res.cloudinary.com/dqdcmluxj/image/upload/v1752712705/Hsllogo_3_gye6nd.png"
                }
                alt="Holidaysri Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
              />
            </div>
          </div>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Download Holidaysri
          </h1>
          <p className={`text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-6 sm:mb-8 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Experience Sri Lanka's premier tourism platform on your favorite device.
            Available for Windows, Android, iOS, and as a Progressive Web App.
          </p>

          {/* Quick Install Button */}
          {!isInstalled && (
            <div className="flex justify-center px-4">
              <button
                onClick={handleInstallPWA}
                className={`group relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isInstallable
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl hover:shadow-blue-500/50'
                    : 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-2xl hover:shadow-green-500/50'
                }`}
              >
                <DownloadIcon className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
                <span className="hidden sm:inline">
                  {isInstallable ? 'Install App Now - One Click!' : 'Install Web App'}
                </span>
                <span className="sm:hidden">
                  {isInstallable ? 'Install Now!' : 'Install App'}
                </span>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  FREE
                </div>
              </button>
            </div>
          )}

          {/* Already Installed Message */}
          {isInstalled && (
            <div className={`flex flex-col sm:flex-row justify-center items-center gap-2 px-4 sm:px-6 py-3 rounded-lg mx-4 ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base text-center sm:text-left">App Already Installed! Open it from your home screen.</span>
            </div>
          )}
        </div>

        {/* Features Banner */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 mb-2 sm:mb-3" />
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Lightning Fast</h3>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Optimized performance for smooth browsing
            </p>
          </div>
          <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 mb-2 sm:mb-3" />
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Secure & Private</h3>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your data is protected with enterprise-grade security
            </p>
          </div>
          <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg sm:col-span-2 md:col-span-1`}>
            <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mb-2 sm:mb-3" />
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Cross-Platform</h3>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Seamless experience across all your devices
            </p>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Platforms
          </button>
          {platforms.map(platform => (
            <button
              key={platform.id}
              onClick={() => setActiveTab(platform.id)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all ${
                activeTab === platform.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {platform.name}
            </button>
          ))}
        </div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {filteredPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.id}
                className={`relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${platform.color} p-4 sm:p-6 text-white`}>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12" />
                    {platform.comingSoon && (
                      <span className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                        Coming Soon
                      </span>
                    )}
                    {!platform.comingSoon && (
                      <span className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                        Available Now
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{platform.name}</h3>
                  <p className="text-sm sm:text-base text-white/90">{platform.description}</p>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between mb-4 sm:mb-6">
                    <div>
                      <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Version</p>
                      <p className={`text-sm sm:text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{platform.version}</p>
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Size</p>
                      <p className={`text-sm sm:text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{platform.size}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4 sm:mb-6">
                    <h4 className={`text-sm sm:text-base font-semibold mb-2 sm:mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Key Features
                    </h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {platform.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(platform)}
                    className={`w-full py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 ${
                      platform.comingSoon
                        ? isDarkMode
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : `bg-gradient-to-r ${platform.color} text-white hover:shadow-xl transform hover:-translate-y-0.5`
                    }`}
                    disabled={platform.comingSoon}
                  >
                    {platform.comingSoon ? (
                      <>
                        <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Coming Soon</span>
                      </>
                    ) : platform.isPWA ? (
                      <>
                        <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Install Web App</span>
                        <span className="sm:hidden">Install App</span>
                      </>
                    ) : (
                      <>
                        <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Download for {platform.name}</span>
                        <span className="sm:hidden">Download</span>
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className={`rounded-xl p-4 sm:p-6 md:p-8 ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <Info className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div className="w-full">
              <h3 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                System Requirements
              </h3>
              <div className={`space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p><strong>Windows:</strong> Windows 10 or later (64-bit)</p>
                <p><strong>Android:</strong> Android 8.0 (Oreo) or later</p>
                <p><strong>iOS:</strong> iOS 14.0 or later, compatible with iPhone, iPad, and iPod touch</p>
                <p><strong>Web App:</strong> Modern browser (Chrome, Firefox, Safari, Edge)</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 sm:mt-12">
          <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-sm sm:text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                When will the mobile apps be available?
              </h3>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                We're working hard to bring you native mobile apps for Android and iOS.
                In the meantime, you can use our Progressive Web App for a great mobile experience.
              </p>
            </div>
            <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-sm sm:text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Is the app free to download?
              </h3>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Yes! All versions of Holidaysri are completely free to download and use.
                Some premium features may require a subscription.
              </p>
            </div>
            <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-sm sm:text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                What is a Progressive Web App (PWA)?
              </h3>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                A PWA is a web application that can be installed on your device and works like a native app,
                with offline support and push notifications.
              </p>
            </div>
            <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-sm sm:text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Will my data sync across devices?
              </h3>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Yes! Your account data, bookmarks, and preferences will sync automatically
                across all devices where you're logged in.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Install Modal */}
      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onInstall={handleModalInstall}
        canInstall={isInstallable && !!deferredPrompt}
      />
    </div>
  );
};

export default Download;
