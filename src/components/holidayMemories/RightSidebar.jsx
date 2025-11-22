import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, TrendingUp } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';
import QuickActionsMenu from './QuickActionsMenu';

const API_URL = import.meta.env.VITE_API_URL || 'https://holidaysri-backend-9xm4.onrender.com/api';

const RightSidebar = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [popularLocations, setPopularLocations] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularData();
  }, []);

  const fetchPopularData = async () => {
    try {
      setLoading(true);

      // Fetch top 7 locations by averageRating
      const locationsRes = await axios.get(`${API_URL}/locations?sortBy=rating&sortOrder=desc&limit=7`);
      setPopularLocations(locationsRes.data.locations || []);

      // Fetch top 10 destinations by averageRating
      const destinationsRes = await axios.get(`${API_URL}/destinations?sortBy=rating&sortOrder=desc&limit=10`);
      setPopularDestinations(destinationsRes.data.destinations || []);
    } catch (error) {
      console.error('Error fetching popular data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Actions */}
      <div className={`rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm p-4`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Quick Actions
        </h3>
        <QuickActionsMenu />
      </div>

      {/* Popular Locations */}
      <div className={`rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm p-4`}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Popular Locations
          </h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {popularLocations.map((location) => (
              <button
                key={location._id}
                onClick={() => navigate(`/locations/${location._id}`)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <img
                  src={location.images?.[0]?.url || 'https://via.placeholder.com/64'}
                  alt={location.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 text-left">
                  <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {location.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    <span>⭐</span>
                    <span>{location.averageRating?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular Destinations */}
      <div className={`rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm p-4`}>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-500" />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Popular Destinations
          </h3>
        </div>
        {loading ? (
          <div className="grid grid-cols-5 gap-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-square bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {popularDestinations.map((destination) => (
              <button
                key={destination._id}
                onClick={() => navigate(`/destinations/${destination._id}`)}
                className="group text-center"
              >
                <div className="relative">
                  <img
                    src={destination.images?.[0]?.url || 'https://via.placeholder.com/100'}
                    alt={destination.name}
                    className="w-full aspect-square object-cover rounded-full ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 transition-all"
                  />
                </div>
                <p className={`text-xs mt-1 truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {destination.name}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;

