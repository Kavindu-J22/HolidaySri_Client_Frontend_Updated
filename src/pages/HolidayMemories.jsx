import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import PostCard from '../components/holidayMemories/PostCard';
import UploadPhotoModal from '../components/holidayMemories/UploadPhotoModal';
import RightSidebar from '../components/holidayMemories/RightSidebar';
import {
  Upload,
  Search,
  TrendingUp,
  Clock,
  DownloadCloud,
  Filter
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://holidaysri-backend-9xm4.onrender.com/api';

const provinces = [
  'Western Province',
  'Central Province',
  'Southern Province',
  'Northern Province',
  'Eastern Province',
  'North Western Province',
  'North Central Province',
  'Uva Province',
  'Sabaragamuwa Province'
];

const HolidayMemories = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('random');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Fetch posts
  const fetchPosts = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: 12,
        sortBy,
        ...(searchTerm && { search: searchTerm }),
        ...(provinceFilter && { province: provinceFilter })
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
  }, [sortBy, searchTerm, provinceFilter]);

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
      <div className={`sticky top-0 z-40 ${isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-3">
            <h1 className={`text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
              Holiday Memories
            </h1>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Create Post</span>
              <span className="sm:hidden font-semibold">Post</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search by location or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-full border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilter(true)}
              className={`lg:hidden flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                provinceFilter
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>

            {/* Sort Options */}
            <button
              onClick={() => setSortBy('random')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                sortBy === 'random'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-sm font-medium">🎲 Random</span>
            </button>
            <button
              onClick={() => setSortBy('recent')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                sortBy === 'recent'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Recent</span>
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                sortBy === 'popular'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Popular</span>
            </button>
            <button
              onClick={() => setSortBy('mostDownloaded')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                sortBy === 'mostDownloaded'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <DownloadCloud className="w-4 h-4" />
              <span className="text-sm font-medium">Most Downloaded</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Province Filter (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className={`sticky top-20 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm p-4`}>
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-blue-500" />
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Filter by Province
                </h3>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setProvinceFilter('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    provinceFilter === ''
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  All Provinces
                </button>
                {provinces.map((province) => (
                  <button
                    key={province}
                    onClick={() => setProvinceFilter(province)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                      provinceFilter === province
                        ? 'bg-blue-600 text-white'
                        : isDarkMode
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {province}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Posts Feed */}
          <div className="lg:col-span-6">
            {/* Posts Feed */}
            {loading && page === 1 ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md animate-pulse`}
                  >
                    <div className="p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                      <div className="flex-1">
                        <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/3 mb-2`}></div>
                        <div className={`h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/4`}></div>
                      </div>
                    </div>
                    <div className={`h-96 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                    <div className="p-4 space-y-3">
                      <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4`}></div>
                      <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/2`}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className={`text-center py-20 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="text-6xl mb-4">📸</div>
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  No Memories Yet
                </h3>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Be the first to share your travel memories!
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Share Your First Memory
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
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
                  <div className="text-center mt-6">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
                    >
                      {loading ? 'Loading...' : 'Load More Memories'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar - User Actions & Popular Sections (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20">
              <RightSidebar />
            </div>
          </div>
        </div>
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

      {/* Mobile Filter Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilter(false)}
          ></div>

          {/* Modal Content */}
          <div className={`relative w-full rounded-t-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Filter by Province
              </h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setProvinceFilter('');
                  setShowMobileFilter(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  provinceFilter === ''
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                All Provinces
              </button>
              {provinces.map((province) => (
                <button
                  key={province}
                  onClick={() => {
                    setProvinceFilter(province);
                    setShowMobileFilter(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    provinceFilter === province
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {province}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayMemories;

