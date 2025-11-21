import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import PostCard from '../components/holidayMemories/PostCard';
import { Bookmark, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://holidaysri-backend-9xm4.onrender.com/api';

const MySavedPosts = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/holiday-memories/user/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedPosts(response.data.savedPosts);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    // Check if the post is still saved
    const isStillSaved = updatedPost.saves?.some(save => save.userId === user?._id);

    if (!isStillSaved) {
      // Remove the post from the list if it's been unsaved
      setSavedPosts(savedPosts.filter(post => post._id !== updatedPost._id));
    } else {
      // Update the post in the list
      setSavedPosts(savedPosts.map(post =>
        post._id === updatedPost._id ? updatedPost : post
      ));
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
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                My Saved Posts
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {savedPosts?.length || 0} saved post{savedPosts?.length !== 1 ? 's' : ''}
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
        ) : !savedPosts || savedPosts.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Saved Posts Yet
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Save your favorite holiday memories to view them later!
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
            {savedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                isDarkMode={isDarkMode}
                onUpdate={handlePostUpdate}
                skipSaveConfirmation={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySavedPosts;

