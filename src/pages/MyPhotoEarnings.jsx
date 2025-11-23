import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { DollarSign, TrendingUp, Download, MapPin, Calendar, ArrowLeft, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://holidaysri-backend-9xm4.onrender.com/api';

const MyPhotoEarnings = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [earnings, setEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/holiday-memories/user/earnings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEarnings(response.data.earnings);
      setTotalEarnings(response.data.totalEarnings);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg flex-shrink-0 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <ArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                My Photo Earnings
              </h1>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Track your earnings from photo downloads
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Total Earnings Card */}
        <div className={`mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white shadow-lg`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm opacity-90 mb-1">Total Earnings</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold truncate">{(totalEarnings || 0).toFixed(2)} HSC</h2>
              <p className="text-xs sm:text-sm opacity-90 mt-1 sm:mt-2">
                From {earnings?.length || 0} download{earnings?.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 sm:p-4 rounded-full flex-shrink-0">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
            </div>
          </div>
        </div>

        {/* Earnings List */}
        {loading ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md animate-pulse`}
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg flex-shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <div className={`h-3 sm:h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4`}></div>
                    <div className={`h-3 sm:h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/2`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !earnings || earnings.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <DollarSign className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Earnings Yet
            </h3>
            <p className={`mb-6 text-sm sm:text-base px-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Upload your holiday photos and start earning when others download them!
            </p>
            <button
              onClick={() => navigate('/ads/entertainment/holiday-memories')}
              className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Photos
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {earnings.map((earning) => (
              <div
                key={earning._id}
                className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-lg transition-shadow`}
              >
                <div className="flex gap-3 sm:gap-4">
                  {/* Photo Thumbnail */}
                  <img
                    src={earning.postImage}
                    alt="Photo"
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg object-cover flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className={`flex items-center gap-1.5 sm:gap-2 mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">
                            Downloaded by <span className="font-medium">{earning.buyerName}</span>
                          </span>
                        </div>
                        <div className={`flex items-center gap-1.5 sm:gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">
                            {typeof earning.postLocation === 'string'
                              ? earning.postLocation
                              : `${earning.postLocation?.name || ''}${earning.postLocation?.city ? ', ' + earning.postLocation.city : ''}`
                            }
                          </span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <div className="text-xl sm:text-2xl font-bold text-green-500">
                          +{earning.hscEarnAmount} HSC
                        </div>
                        <div className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Buyer paid {earning.hscPaidByBuyer} HSC
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{new Date(earning.downloadedAt).toLocaleDateString()}</span>
                      </div>
                      <div className={`text-[10px] sm:text-xs px-2 py-1 rounded-full self-start sm:self-auto ${
                        earning.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {earning.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPhotoEarnings;

