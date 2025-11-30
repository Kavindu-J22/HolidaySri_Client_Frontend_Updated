import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import PostCard from '../components/holidayMemories/PostCard';
import UploadPhotoModal from '../components/holidayMemories/UploadPhotoModal';
import RightSidebar from '../components/holidayMemories/RightSidebar';
import LeftSidebar from '../components/holidayMemories/LeftSidebar';
import QuickActionsMenu from '../components/holidayMemories/QuickActionsMenu';
import {
  Upload,
  Search,
  TrendingUp,
  Clock,
  DownloadCloud,
  Filter,
  Menu,
  X
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
  const [otherCountryFilter, setOtherCountryFilter] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Fetch posts
  const fetchPosts = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: 12,
        sortBy,
        ...(searchTerm && { search: searchTerm }),
        ...(provinceFilter && { province: provinceFilter }),
        ...(otherCountryFilter && { otherCountry: 'true' })
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
  }, [sortBy, searchTerm, provinceFilter, otherCountryFilter]);

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
        <div className="w-full max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-3 gap-2 px-3 sm:px-4 pt-3">
            <h1 className={`text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate`}>
              Holiday Memories
            </h1>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex-shrink-0"
            >
              <Upload className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline font-semibold whitespace-nowrap">Create Post</span>
              <span className="sm:hidden font-semibold text-sm whitespace-nowrap">Post</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3 px-3 sm:px-4">
            <Search className={`absolute left-6 sm:left-7 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} pointer-events-none`} />
            <input
              type="text"
              placeholder="Search by location or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-full border text-sm sm:text-base ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
          </div>

          {/* Navigation Tabs - Scrollable Container */}
          <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide pb-3 px-3 sm:px-4">
            <div className="flex items-center gap-2 min-w-max">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilter(true)}
                className={`lg:hidden flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
                  provinceFilter || sortBy === 'random' || sortBy === 'mostDownloaded'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Filters</span>
              </button>

              {/* Sort Options - Mobile: Only Recent & Popular */}
              {/* Desktop: All Options */}
              <button
                onClick={() => setSortBy('random')}
                className={`hidden lg:flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
                  sortBy === 'random'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs sm:text-sm font-medium">🎲 Random</span>
              </button>
              <button
                onClick={() => setSortBy('recent')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
                  sortBy === 'recent'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Recent</span>
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
                  sortBy === 'popular'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Popular</span>
              </button>
              <button
                onClick={() => setSortBy('mostDownloaded')}
                className={`hidden lg:flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
                  sortBy === 'mostDownloaded'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <DownloadCloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Most Downloaded</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Sidebar - Province Filter & Services (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20">
              <LeftSidebar
                provinceFilter={provinceFilter}
                setProvinceFilter={setProvinceFilter}
                otherCountryFilter={otherCountryFilter}
                setOtherCountryFilter={setOtherCountryFilter}
              />
            </div>
          </div>

          {/* Center - Posts Feed */}
          <div className="lg:col-span-6 min-w-0">
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
                <div className="space-y-4 w-full">
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
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMobileFilter(false)}
          ></div>

          {/* Modal Content */}
          <div className={`relative w-full rounded-t-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl max-h-[75vh] overflow-hidden animate-slide-up`}>
            {/* Header */}
            <div className={`sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'} px-4 py-3`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Sort & Filter
                </h3>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(75vh-56px)] px-4 py-3 space-y-4">
              {/* Sort Options Section */}
              <div>
                <h4 className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wide`}>
                  Sort Options
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSortBy('random');
                      setShowMobileFilter(false);
                    }}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      sortBy === 'random'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-base">🎲</span>
                    <span>Random</span>
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('recent');
                      setShowMobileFilter(false);
                    }}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      sortBy === 'recent'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent</span>
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('popular');
                      setShowMobileFilter(false);
                    }}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      sortBy === 'popular'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Popular</span>
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('mostDownloaded');
                      setShowMobileFilter(false);
                    }}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      sortBy === 'mostDownloaded'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Downloads</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>

              {/* Province Filter Section */}
              <div>
                <h4 className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wide`}>
                  Filter by Province
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      setProvinceFilter('');
                      setOtherCountryFilter(false);
                      setShowMobileFilter(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      provinceFilter === '' && !otherCountryFilter
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Provinces
                  </button>
                  {provinces.map((province) => (
                    <button
                      key={province}
                      onClick={() => {
                        setProvinceFilter(province);
                        setOtherCountryFilter(false);
                        setShowMobileFilter(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        provinceFilter === province && !otherCountryFilter
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                          : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {province}
                    </button>
                  ))}
                </div>
              </div>

              {/* Other Countries Section */}
              <div className={`pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h4 className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wide`}>
                  International
                </h4>
                <button
                  onClick={() => {
                    setProvinceFilter('');
                    setOtherCountryFilter(true);
                    setShowMobileFilter(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                    otherCountryFilter
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🌍 Other Countries
                </button>
              </div>

              {/* Bottom Padding for safe area */}
              <div className="h-2"></div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Quick Actions FAB & Dropdown */}
      <div className="lg:hidden">
        {/* Floating Action Button */}
        <button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 ${
            showQuickActions
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
          aria-label="Quick Actions Menu"
        >
          {showQuickActions ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Quick Actions Dropdown */}
        {showQuickActions && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-30 bg-black bg-opacity-30"
              onClick={() => setShowQuickActions(false)}
            ></div>

            {/* Dropdown Menu */}
            <div className={`fixed bottom-24 right-6 z-40 w-64 rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} overflow-hidden animate-slide-up`}>
              <div className="p-4">
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </h3>
                <QuickActionsMenu onActionClick={() => setShowQuickActions(false)} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HolidayMemories;

