import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import PostCard from '../components/holidayMemories/PostCard';
import UploadPhotoModal from '../components/holidayMemories/UploadPhotoModal';
import {
  Upload,
  Search,
  Filter,
  X,
  Download,
  Bookmark,
  DollarSign
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://holidaysri-backend-9xm4.onrender.com/api';

const HolidayMemories = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterProvince, setFilterProvince] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch posts
  const fetchPosts = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: 12,
        sortBy,
        ...(searchTerm && { search: searchTerm }),
        ...(filterCity && { city: filterCity }),
        ...(filterProvince && { province: filterProvince })
      };

      const response = await axios.get(`${API_URL}/holiday-memories/browse`, { params });

      if (reset) {
        setPosts(response.data.posts);
      } else {
        setPosts(prev => [...prev, ...response.data.posts]);
      }

      setHasMore(response.data.pagination.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
  }, [sortBy, searchTerm, filterCity, filterProvince]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchPosts(page + 1, false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    // Update the post in the list
    setPosts(posts.map(post =>
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Holiday Memories
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/my-downloads')}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                title="My Downloads"
              >
                <Download className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={() => navigate('/my-saved-posts')}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                title="My Saved Posts"
              >
                <Bookmark className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={() => navigate('/my-photo-earnings')}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                title="My Photo Earnings"
              >
                <DollarSign className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Upload className="w-5 h-5" />
                <span className="hidden sm:inline">Share Memory</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="mostDownloaded">Most Downloaded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Panel */}
        {showFilters && (
          <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Filters
              </h3>
              <button
                onClick={() => {
                  setFilterCity('');
                  setFilterProvince('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Province
                </label>
                <select
                  value={filterProvince}
                  onChange={(e) => setFilterProvince(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">All Provinces</option>
                  <option value="Western Province">Western Province</option>
                  <option value="Central Province">Central Province</option>
                  <option value="Southern Province">Southern Province</option>
                  <option value="Northern Province">Northern Province</option>
                  <option value="Eastern Province">Eastern Province</option>
                  <option value="North Western Province">North Western Province</option>
                  <option value="North Central Province">North Central Province</option>
                  <option value="Uva Province">Uva Province</option>
                  <option value="Sabaragamuwa Province">Sabaragamuwa Province</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {loading && page === 1 ? (
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
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No memories found. Be the first to share!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  isDarkMode={isDarkMode}
                  onUpdate={handlePostUpdate}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Modal */}
      <UploadPhotoModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        isDarkMode={isDarkMode}
        onSuccess={(newPost) => {
          setPosts([newPost, ...posts]);
        }}
      />
    </div>
  );
};

export default HolidayMemories;

