import React from 'react';
import { 
  Megaphone, 
  Plus, 
  Eye, 
  BarChart3,
  Calendar,
  ArrowRight
} from 'lucide-react';

const Advertisements = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Advertisements
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your travel advertisements and promotional content
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <Megaphone className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Advertisement Management
          </h2>
          
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Create, manage, and track your travel advertisements. Promote your services 
            and reach more customers with our powerful advertising platform.
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Feature Cards */}
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mb-4">
                <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Create Ads
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Design and publish professional travel advertisements
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Track Performance
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Monitor views, clicks, and engagement metrics
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Schedule Campaigns
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Plan and automate your advertising campaigns
              </p>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full mb-4">
              <Eye className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Coming Soon
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              We're working hard to bring you a comprehensive advertisement management system. 
              Stay tuned for updates!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                disabled
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>Create Advertisement</span>
              </button>
              
              <button 
                disabled
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
              >
                <BarChart3 className="w-4 h-4" />
                <span>View Analytics</span>
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Features
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Rich Media Support
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload images, videos, and create interactive content
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Targeted Advertising
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reach specific audiences based on preferences
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Real-time Analytics
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track performance with detailed insights
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Budget Management
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Set budgets and optimize ad spending
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertisements;
