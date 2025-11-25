import React, { useState } from 'react';
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

const Download = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('all');

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

  const handleInstallPWA = () => {
    // PWA installation will be handled by the browser
    alert('To install the web app:\n\n1. Click the menu (⋮) in your browser\n2. Select "Install Holidaysri" or "Add to Home Screen"\n3. Follow the prompts to install');
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'} shadow-xl`}>
              <img
                src="https://res.cloudinary.com/dqdcmluxj/image/upload/v1752712705/Hsllogo_3_gye6nd.png"
                alt="Holidaysri Logo"
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Download Holidaysri
          </h1>
          <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Experience Sri Lanka's premier tourism platform on your favorite device.
            Available for Windows, Android, iOS, and as a Progressive Web App.
          </p>
        </div>

        {/* Features Banner */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Zap className="w-10 h-10 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Optimized performance for smooth browsing
            </p>
          </div>
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Shield className="w-10 h-10 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Your data is protected with enterprise-grade security
            </p>
          </div>
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Globe className="w-10 h-10 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Cross-Platform</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Seamless experience across all your devices
            </p>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
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
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {filteredPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.id}
                className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${platform.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-12 h-12" />
                    {platform.comingSoon && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                        Coming Soon
                      </span>
                    )}
                    {!platform.comingSoon && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                        Available Now
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{platform.name}</h3>
                  <p className="text-white/90">{platform.description}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between mb-6">
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Version</p>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{platform.version}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Size</p>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{platform.size}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {platform.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(platform)}
                    className={`w-full py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
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
                        <Info className="w-5 h-5" />
                        <span>Coming Soon</span>
                      </>
                    ) : platform.isPWA ? (
                      <>
                        <DownloadIcon className="w-5 h-5" />
                        <span>Install Web App</span>
                      </>
                    ) : (
                      <>
                        <DownloadIcon className="w-5 h-5" />
                        <span>Download for {platform.name}</span>
                        <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className={`rounded-xl p-8 ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
          <div className="flex items-start gap-4">
            <Info className={`w-6 h-6 flex-shrink-0 mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                System Requirements
              </h3>
              <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p><strong>Windows:</strong> Windows 10 or later (64-bit)</p>
                <p><strong>Android:</strong> Android 8.0 (Oreo) or later</p>
                <p><strong>iOS:</strong> iOS 14.0 or later, compatible with iPhone, iPad, and iPod touch</p>
                <p><strong>Web App:</strong> Modern browser (Chrome, Firefox, Safari, Edge)</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className={`text-3xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                When will the mobile apps be available?
              </h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                We're working hard to bring you native mobile apps for Android and iOS.
                In the meantime, you can use our Progressive Web App for a great mobile experience.
              </p>
            </div>
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Is the app free to download?
              </h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Yes! All versions of Holidaysri are completely free to download and use.
                Some premium features may require a subscription.
              </p>
            </div>
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                What is a Progressive Web App (PWA)?
              </h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                A PWA is a web application that can be installed on your device and works like a native app,
                with offline support and push notifications.
              </p>
            </div>
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Will my data sync across devices?
              </h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Yes! Your account data, bookmarks, and preferences will sync automatically
                across all devices where you're logged in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Download;
