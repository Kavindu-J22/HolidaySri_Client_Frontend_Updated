import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Download,
  MapPin,
  Map as MapIcon,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://holidaysri-backend-9xm4.onrender.com/api';

const PostCard = ({ post, isDarkMode, onUpdate, skipSaveConfirmation = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [saveCount, setSaveCount] = useState(post.saveCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [touchTimer, setTouchTimer] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  // Initialize state only once when component mounts or post ID changes
  useEffect(() => {
    // Check if current user has liked this post
    if (user?._id && post.likes) {
      const userLiked = post.likes.some(like => {
        const likeUserId = typeof like.userId === 'object' ? like.userId._id : like.userId;
        return likeUserId?.toString() === user._id.toString();
      });
      setLiked(userLiked);
    } else {
      setLiked(false);
    }

    // Check if current user has saved this post
    if (user?._id && post.saves) {
      const userSaved = post.saves.some(save => {
        const saveUserId = typeof save.userId === 'object' ? save.userId._id : save.userId;
        return saveUserId?.toString() === user._id.toString();
      });
      setSaved(userSaved);
    } else {
      setSaved(false);
    }

    // Initialize counts
    setLikeCount(post.likeCount || 0);
    setSaveCount(post.saveCount || 0);
    setComments(post.comments || []);
  }, [post._id, user?._id]); // Run when post ID changes or user loads

  // Prevent right-click on image
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  // Prevent long-press on mobile
  const handleTouchStart = (e) => {
    const timer = setTimeout(() => {
      e.preventDefault();
    }, 500);
    setTouchTimer(timer);
  };

  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/holiday-memories/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state with server response
      setLikeCount(response.data.likeCount);
      setLiked(response.data.liked);

      // Update parent component if callback provided
      if (onUpdate) {
        onUpdate({
          ...post,
          likes: response.data.likes,
          likeCount: response.data.likeCount
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSaveClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // If skipSaveConfirmation is true, directly call handleSaveConfirm
    if (skipSaveConfirmation) {
      handleSaveConfirm();
    } else {
      // Show confirmation modal
      setShowSaveConfirmModal(true);
    }
  };

  const handleSaveConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/holiday-memories/${post._id}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state with server response
      setSaveCount(response.data.saveCount);
      setSaved(response.data.saved);
      setShowSaveConfirmModal(false);

      // Update parent component if callback provided
      if (onUpdate) {
        onUpdate({
          ...post,
          saves: response.data.saves,
          saveCount: response.data.saveCount
        });
      }
    } catch (error) {
      console.error('Error saving post:', error);
      setShowSaveConfirmModal(false);
    }
  };

  const handleSaveCancel = () => {
    setShowSaveConfirmModal(false);
  };

  const handleAddComment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/holiday-memories/${post._id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([...comments, response.data.comment]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDownload = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setDownloading(true);
    setDownloadError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/holiday-memories/${post._id}/download`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Download the image
      const link = document.createElement('a');
      link.href = post.image;
      link.download = `holiday-memory-${post._id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setShowDownloadModal(false);

      // Show success modal with location details
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('Error downloading photo:', error);
      if (error.response?.data?.insufficientBalance) {
        setDownloadError(`Insufficient HSC balance. You need ${error.response.data.required} HSC. Current balance: ${error.response.data.current} HSC`);
      } else if (error.response?.data?.alreadyDownloaded) {
        setDownloadError('You have already downloaded this photo');
      } else {
        setDownloadError(error.response?.data?.message || 'Failed to download photo');
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-xl transition-shadow`}>
        {/* Image */}
        <div className="relative">
          <img
            src={post.image}
            alt={post.caption}
            className="w-full h-64 object-cover"
            onContextMenu={handleContextMenu}
            onDragStart={(e) => e.preventDefault()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchEnd}
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          />
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Download className="w-4 h-4" />
            {post.downloadPrice || 2.5} HSC
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={post.userAvatar || 'https://via.placeholder.com/40'}
              alt={post.userName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {post.userName}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Caption */}
          <p className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {post.caption}
          </p>

          {/* Location */}
          <div className={`flex items-center gap-2 mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {post.location.name}{post.location.city && `, ${post.location.city}`}
            </span>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full ${
                    isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 hover:scale-110 transition-transform"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    liked
                      ? 'fill-red-500 text-red-500 stroke-red-500'
                      : isDarkMode
                        ? 'text-gray-400 stroke-gray-400'
                        : 'text-gray-600 stroke-gray-600'
                  }`}
                  fill={liked ? 'currentColor' : 'none'}
                />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {likeCount}
                </span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1 hover:scale-110 transition-transform"
              >
                <MessageCircle className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {comments.length}
                </span>
              </button>

              <button className="hover:scale-110 transition-transform">
                <Share2 className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveClick}
                className="hover:scale-110 transition-transform"
              >
                <Bookmark
                  className={`w-5 h-5 transition-colors ${
                    saved
                      ? 'fill-yellow-500 text-yellow-500 stroke-yellow-500'
                      : isDarkMode
                        ? 'text-gray-400 stroke-gray-400'
                        : 'text-gray-600 stroke-gray-600'
                  }`}
                  fill={saved ? 'currentColor' : 'none'}
                />
              </button>

              <button
                onClick={() => setShowDownloadModal(true)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3 mb-3 max-h-40 overflow-y-auto">
                {comments.map((comment, index) => (
                  <div key={index} className="flex gap-2">
                    <img
                      src={comment.userAvatar || 'https://via.placeholder.com/32'}
                      alt={comment.userName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {comment.userName}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  className={`flex-1 px-3 py-2 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Download Confirmation Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`max-w-md w-full rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Download Photo
              </h3>
              <button
                onClick={() => setShowDownloadModal(false)}
                className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <div className="mb-4">
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-48 object-cover rounded-lg"
                onContextMenu={handleContextMenu}
                onDragStart={(e) => e.preventDefault()}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchEnd}
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  WebkitTouchCallout: 'none'
                }}
              />
            </div>

            <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Download Price:</span>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {post.downloadPrice || 2.5} HSC
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Photo Owner Earns:</span>
                <span className={`font-bold text-green-500`}>1.5 HSC</span>
              </div>
            </div>

            {downloadError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{downloadError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowDownloadModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Success Modal */}
      {downloadSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`max-w-md w-full rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Download Successful!
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Photo has been saved to your downloads
              </p>
            </div>

            <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Location Details
              </h4>
              <div className="flex items-start gap-2 mb-2">
                <MapPin className={`w-4 h-4 mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {post.location.name}
                  </p>
                  {post.location.city && (
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {post.location.city}, {post.location.province}
                    </p>
                  )}
                </div>
              </div>
              {post.mapLink && (
                <a
                  href={post.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  <MapIcon className="w-4 h-4" />
                  View on Google Maps
                </a>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDownloadSuccess(false)}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDownloadSuccess(false);
                  navigate('/my-downloads');
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Downloads
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      {showSaveConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`max-w-md w-full rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {saved ? 'Unsave Post' : 'Save Post'}
              </h3>
              <button
                onClick={handleSaveCancel}
                className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <div className="mb-6">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {saved
                  ? 'This post is already saved. Do you want to unsave it?'
                  : 'Do you want to save this post?'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveCancel}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfirm}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  saved
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {saved ? 'Unsave' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;

