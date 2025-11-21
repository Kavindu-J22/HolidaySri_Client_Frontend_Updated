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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <ArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <div className="flex-1">
              <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                My Photo Earnings
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Track your earnings from photo downloads
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Total Earnings Card */}
        <div className={`mb-6 p-6 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Earnings</p>
              <h2 className="text-4xl font-bold">{(totalEarnings || 0).toFixed(2)} HSC</h2>
              <p className="text-sm opacity-90 mt-2">
                From {earnings?.length || 0} download{earnings?.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <TrendingUp className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Earnings List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md animate-pulse`}
              >
                <div className="flex gap-4">
                  <div className={`w-24 h-24 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                  <div className="flex-1 space-y-3">
                    <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4`}></div>
                    <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/2`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !earnings || earnings.length === 0 ? (
          <div className="text-center py-20">
            <DollarSign className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Earnings Yet
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Upload your holiday photos and start earning when others download them!
            </p>
            <button
              onClick={() => navigate('/ads/entertainment/holiday-memories')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Photos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {earnings.map((earning) => (
              <div
                key={earning._id}
                className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-lg transition-shadow`}
              >
                <div className="flex gap-4">
                  {/* Photo Thumbnail */}
                  <img
                    src={earning.postImage}
                    alt="Photo"
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className={`flex items-center gap-2 mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <User className="w-4 h-4" />
                          <span className="text-sm">
                            Downloaded by <span className="font-medium">{earning.buyerName}</span>
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {typeof earning.postLocation === 'string'
                              ? earning.postLocation
                              : `${earning.postLocation?.name || ''}${earning.postLocation?.city ? ', ' + earning.postLocation.city : ''}`
                            }
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-500">
                          +{earning.hscEarnAmount} HSC
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Buyer paid {earning.hscPaidByBuyer} HSC
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(earning.downloadedAt).toLocaleDateString()}</span>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
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

