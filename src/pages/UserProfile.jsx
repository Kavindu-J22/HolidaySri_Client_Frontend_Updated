import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/holidayMemories/PostCard';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Heart,
  Download,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Globe
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://holidaysri-backend-9xm4.onrender.com/api';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user: currentUser } = useAuth();

  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUserPosts(1, true);
  }, [userId]);

  const fetchUserPosts = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/holiday-memories/user/posts/${userId}`, {
        params: { page: pageNum, limit: 12 }
      });

      if (reset) {
        setPosts(response.data.posts);
      } else {
        setPosts(prev => [...prev, ...response.data.posts]);
      }

      // Set user profile from first post
      if (response.data.posts.length > 0 && response.data.posts[0].userId) {
        setUserProfile(response.data.posts[0].userId);
      }

      setHasMore(response.data.pagination.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchUserPosts(page + 1, false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const totalLikes = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
  const totalDownloads = posts.reduce((sum, post) => sum + (post.downloadCount || 0), 0);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Profile Section */}
      {userProfile && (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <img
                src={userProfile.profileImage || 'https://via.placeholder.com/150'}
                alt={userProfile.name}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-500"
              />

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userProfile.name}
                </h1>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {userProfile.email}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {posts.length}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Posts</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {totalLikes}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Likes</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {totalDownloads}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Downloads</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && page === 1 ? (
          <div className="grid grid-cols-1 gap-4">
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
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className={`text-center py-20 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <ImageIcon className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Posts Yet
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              This user hasn't shared any memories yet.
            </p>
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
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className={`px-8 py-3 rounded-full font-semibold transition-all ${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

