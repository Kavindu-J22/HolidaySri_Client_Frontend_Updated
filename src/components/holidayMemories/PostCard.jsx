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
  X,
  Flag,
  MoreHorizontal,
  Send
} from 'lucide-react';
import './ImageProtection.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://holidaysri-backend-9xm4.onrender.com/api';

const PostCard = ({ post, isDarkMode, onUpdate, skipSaveConfirmation = false, downloadButtonText }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [saveCount, setSaveCount] = useState(post.saveCount || 0);
  const [downloadCount, setDownloadCount] = useState(post.downloadCount || 0);
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
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

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

      // Fetch the image as a blob to properly download it
      const response = await fetch(post.image);
      const blob = await response.blob();

      // Create a blob URL and download the image
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `holiday-memory-${post.location?.name?.replace(/[^a-z0-9]/gi, '-') || 'photo'}-${post._id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      setShowDownloadModal(false);
      setDownloadCount(prev => prev + 1);

      // Navigate to My Downloads after 3 seconds
      setTimeout(() => {
        setDownloadSuccess(false);
        navigate('/my-downloads');
      }, 3000);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Holiday Memory - ${post.location?.name}`,
        text: post.caption,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: Copy link to clipboard
      const url = `${window.location.origin}/ads/entertainment/holiday-memories?post=${post._id}`;
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      });
    }
    setShowShareMenu(false);
  };

  const handleReport = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!reportReason.trim()) {
      alert('Please provide a reason for reporting');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/holiday-memories/${post._id}/report`,
        { reason: reportReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Post reported successfully. We will review it shortly.');
      setShowReportModal(false);
      setReportReason('');
    } catch (error) {
      console.error('Error reporting post:', error);
      alert(error.response?.data?.message || 'Failed to report post');
    }
  };

  return (
    <>
      <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-md max-w-full`}>
        {/* Post Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={post.userId?.profileImage || 'https://via.placeholder.com/40'}
              alt={post.userId?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
            />
            <div>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {post.userId?.name || 'Anonymous'}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {post.location?.isOtherCountry
                      ? 'Other Country'
                      : post.location?.province
                        ? `${post.location.province}, Sri Lanka`
                        : 'Sri Lanka'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
          >
            <MoreHorizontal className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Image - Original Size */}
        <div
          className="protected-image-container relative w-full overflow-hidden cursor-pointer"
          onClick={() => setShowImageModal(true)}
        >
          <img
            src={post.image}
            alt={post.caption}
            className="protected-image w-full object-contain max-h-[600px] bg-black"
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
              WebkitTouchCallout: 'none',
              pointerEvents: 'none',
              maxWidth: '100%'
            }}
          />
          {/* Transparent overlay to prevent any interaction */}
          <div
            className="absolute inset-0 bg-transparent"
            onContextMenu={handleContextMenu}
            onDragStart={(e) => e.preventDefault()}
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="hover:scale-110 transition-transform active:scale-95"
              >
                <Heart
                  className={`w-6 h-6 transition-all ${
                    liked
                      ? 'fill-red-500 text-red-500'
                      : isDarkMode
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-700 hover:text-gray-900'
                  }`}
                />
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:scale-110 transition-transform active:scale-95"
              >
                <MessageCircle className={`w-6 h-6 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'}`} />
              </button>

              <button
                onClick={handleShare}
                className="hover:scale-110 transition-transform active:scale-95"
              >
                <Share2 className={`w-6 h-6 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'}`} />
              </button>
            </div>

            <button
              onClick={handleSaveClick}
              className="hover:scale-110 transition-transform active:scale-95"
            >
              <Bookmark
                className={`w-6 h-6 transition-all ${
                  saved
                    ? 'fill-yellow-500 text-yellow-500'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-700 hover:text-gray-900'
                }`}
              />
            </button>
          </div>

          {/* Likes and Downloads Count */}
          <div className="mb-2">
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {likeCount} {likeCount === 1 ? 'like' : 'likes'}
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {downloadCount} {downloadCount === 1 ? 'download' : 'downloads'}
            </p>
          </div>

          {/* Caption */}
          <div className="mb-2">
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} break-words`}>
              <span className="font-semibold mr-2">{post.userId?.name || 'Anonymous'}</span>
              {post.caption}
            </p>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`text-xs font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} break-all`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* View Comments */}
          {comments.length > 0 && !showComments && (
            <button
              onClick={() => setShowComments(true)}
              className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}
            >
              View all {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </button>
          )}

          {/* Download Button - Attractive & Responsive */}
          <button
            onClick={() => setShowDownloadModal(true)}
            className="w-full mt-3 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
          >
            <Download className="w-5 h-5 group-hover:animate-bounce flex-shrink-0" />
            {downloadButtonText ? (
              <span>{downloadButtonText}</span>
            ) : (
              <>
                <span className="hidden sm:inline">Download Original Image + Location Info</span>
                <span className="sm:hidden">Download Image + Info</span>
              </>
            )}
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs flex-shrink-0">
              {post.downloadPrice || 2.5} HSC
            </span>
          </button>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3 mb-3 max-h-60 overflow-y-auto">
                {comments.map((comment, index) => (
                  <div key={index} className="flex gap-2">
                    <img
                      src={comment.userAvatar || 'https://via.placeholder.com/32'}
                      alt={comment.userName}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className={`flex-1 min-w-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl px-3 py-2`}>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                        {comment.userName}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} break-words`}>
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 items-center">
                <img
                  src={user?.profileImage || 'https://via.placeholder.com/32'}
                  alt="You"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                  className={`flex-1 min-w-0 px-3 sm:px-4 py-2 rounded-full border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`max-w-md w-full rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Report Post
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Why are you reporting this post?
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={4}
                placeholder="Please provide details..."
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
            </div>
          </div>
        </div>
      )}

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

            <div className="protected-image-container mb-4 relative">
              <img
                src={post.image}
                alt={post.caption}
                className="protected-image w-full h-48 object-cover rounded-lg"
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
                  WebkitTouchCallout: 'none',
                  pointerEvents: 'none'
                }}
              />
              <div
                className="absolute inset-0 bg-transparent rounded-lg"
                onContextMenu={handleContextMenu}
                onDragStart={(e) => e.preventDefault()}
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none'
                }}
              />
            </div>

            <div className={`mb-4 p-4 rounded-lg border-2 ${isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
              <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`}>
                What You'll Receive:
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>Original High-Quality Image</strong> - Full resolution download
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>Location Name</strong> - exact location Name
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>Google Map Link</strong> - Navigate to exact location
                  </span>
                </div>
              </div>
            </div>

            <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Download Price:
                </span>
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {post.downloadPrice || 2.5} HSC
                </span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className={`max-w-lg w-full rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8 shadow-2xl`}>
            {/* Success Icon with Animation */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-4 animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🎉 Download Successful!
              </h3>
              <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your image has been downloaded to your device
              </p>
            </div>

            {/* Image Preview */}
            <div className="protected-image-container mb-6 relative">
              <img
                src={post.image}
                alt={post.caption}
                className="protected-image w-full h-48 object-cover rounded-lg border-2 border-green-500"
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
                  WebkitTouchCallout: 'none',
                  pointerEvents: 'none'
                }}
              />
              <div
                className="absolute inset-0 bg-transparent rounded-lg"
                onContextMenu={handleContextMenu}
                onDragStart={(e) => e.preventDefault()}
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none'
                }}
              />
            </div>

            {/* What You Received */}
            <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20 border-2 border-green-700' : 'bg-green-50 border-2 border-green-300'}`}>
              <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-green-400' : 'text-green-900'}`}>
                <CheckCircle className="w-5 h-5" />
                What You Received:
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>Original High-Quality Image</strong> downloaded to your device
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>Location:</strong> {post.location?.name || 'Unknown'}
                    {post.location?.city && `, ${post.location.city}`}
                  </span>
                </div>
                {post.mapLink && (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <a
                      href={post.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                    >
                      <strong>Google Map Link</strong> - Click to navigate
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Redirect Message */}
            <div className={`mb-6 p-3 rounded-lg text-center ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                Redirecting to My Downloads in 3 seconds...
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                setDownloadSuccess(false);
                navigate('/my-downloads');
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Go to My Downloads Now
            </button>
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

      {/* Image View Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-90 backdrop-blur-sm"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all transform hover:scale-110 active:scale-95"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image Container */}
            <div
              className="protected-image-container relative max-h-[90vh] max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={post.image}
                alt={post.caption}
                className="protected-image max-h-[90vh] max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl"
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
                  WebkitTouchCallout: 'none',
                  pointerEvents: 'none'
                }}
              />
              {/* Transparent overlay to prevent any interaction with image */}
              <div
                className="absolute inset-0 bg-transparent"
                onContextMenu={handleContextMenu}
                onDragStart={(e) => e.preventDefault()}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none'
                }}
              />
            </div>

            {/* Image Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-md rounded-lg p-4 text-white">
              <p className="font-semibold text-lg mb-1">{post.userId?.name || 'Anonymous'}</p>
              <p className="text-sm mb-2">{post.caption}</p>
              {post.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {post.location.isOtherCountry
                      ? 'Other Country'
                      : post.location.province
                        ? `${post.location.province}, Sri Lanka`
                        : 'Sri Lanka'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;

