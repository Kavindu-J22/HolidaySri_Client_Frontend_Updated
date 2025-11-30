import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Download, MapPin, Map as MapIcon, Calendar, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://holidaysri-backend-9xm4.onrender.com/api';

const MyDownloads = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/holiday-memories/user/downloads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDownloads(response.data.downloads);
    } catch (error) {
      console.error('Error fetching downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAgain = async (imageUrl, postId) => {
    try {
      // Fetch the image as a blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `holiday-memory-${postId}.jpg`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
      // Fallback: open in new tab
      window.open(imageUrl, '_blank');
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
                My Downloads
              </h1>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {downloads?.length || 0} photo{downloads?.length !== 1 ? 's' : ''} downloaded
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md animate-pulse`}
              >
                <div className={`h-48 sm:h-64 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className="p-3 sm:p-4 space-y-3">
                  <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4`}></div>
                  <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/2`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : !downloads || downloads.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <Download className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Downloads Yet
            </h3>
            <p className={`mb-6 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Start exploring and download your favorite holiday memories!
            </p>
            <button
              onClick={() => navigate('/ads/entertainment/holiday-memories')}
              className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Memories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {downloads.map((download) => (
              <div
                key={download._id}
                className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-xl transition-shadow`}
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={download.image}
                    alt={download.caption}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                    Downloaded
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                  {/* Caption */}
                  <p className={`mb-2 sm:mb-3 line-clamp-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {download.caption}
                  </p>

                  {/* Location */}
                  <div className={`flex items-start gap-2 mb-2 sm:mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {download.location?.isOtherCountry ? (
                        <>
                          <p className="text-xs sm:text-sm font-medium truncate">
                            {download.location.country || 'Other Country'}
                          </p>
                          <p className="text-[10px] sm:text-xs truncate">
                            {download.location.name}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs sm:text-sm font-medium truncate">
                            {download.location.name}
                          </p>
                          {download.location.city && (
                            <p className="text-[10px] sm:text-xs truncate">
                              {download.location.city}, {download.location.province}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Download Date */}
                  <div className={`flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">
                      Downloaded on {new Date(download.downloadedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
                    {download.mapLink && (
                      <a
                        href={download.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                      >
                        <MapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">View on Map</span>
                      </a>
                    )}
                    <button
                      onClick={() => handleDownloadAgain(download.image, download._id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg border ${
                        isDarkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } transition-colors text-xs sm:text-sm font-medium`}
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">Download Again</span>
                    </button>
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

export default MyDownloads;

