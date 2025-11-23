import React from 'react';
import { X, Globe, Search } from 'lucide-react';

const SearchOptionModal = ({ isOpen, onClose, onGoogleSearch, onOnsiteSearch, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Search className="w-6 h-6" />
            <span>Choose Search Option</span>
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            How would you like to search for <span className="font-semibold text-gray-900 dark:text-white">{title}</span>?
          </p>

          <div className="space-y-4">
            
            {/* Onsite Search Option */}
            <button
              onClick={() => {
                onOnsiteSearch();
                onClose();
              }}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl p-5 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Search className="w-7 h-7" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-lg mb-1">Onsite Search</div>
                  <div className="text-sm text-primary-100">
                    Browse our curated local listings
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            </button>

          {/* Google Search Option */}
            <button
              onClick={() => {
                onGoogleSearch();
                onClose();
              }}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-5 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Globe className="w-7 h-7" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-lg mb-1">Google Search</div>
                  <div className="text-sm text-blue-100">
                    Search across the web with Google
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchOptionModal;

