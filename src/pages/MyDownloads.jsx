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

  const handleDownloadAgain = (imageUrl, postId) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `holiday-memory-${postId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                My Downloads
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {downloads?.length || 0} photo{downloads?.length !== 1 ? 's' : ''} downloaded
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md animate-pulse`}
              >
                <div className={`h-64 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className="p-4 space-y-3">
                  <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4`}></div>
                  <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/2`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : !downloads || downloads.length === 0 ? (
          <div className="text-center py-20">
            <Download className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Downloads Yet
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Start exploring and download your favorite holiday memories!
            </p>
            <button
              onClick={() => navigate('/ads/entertainment/holiday-memories')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Memories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Downloaded
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Caption */}
                  <p className={`mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {download.caption}
                  </p>

                  {/* Location */}
                  <div className={`flex items-start gap-2 mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {download.location.name}
                      </p>
                      {download.location.city && (
                        <p className="text-xs">
                          {download.location.city}, {download.location.province}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Download Date */}
                  <div className={`flex items-center gap-2 mb-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Calendar className="w-4 h-4" />
                    <span>
                      Downloaded on {new Date(download.downloadedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {download.mapLink && (
                      <a
                        href={download.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <MapIcon className="w-4 h-4" />
                        View on Map
                      </a>
                    )}
                    <button
                      onClick={() => handleDownloadAgain(download.image, download._id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } transition-colors text-sm`}
                    >
                      <Download className="w-4 h-4" />
                      Download Again
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

