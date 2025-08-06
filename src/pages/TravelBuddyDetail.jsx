import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Star,
  Eye,
  MessageCircle,
  Heart,
  Calendar,
  User,
  Phone,
  Send,
  Loader2,
  ExternalLink,
  Flag,
  AlertTriangle,
  X,
  Edit,
  Trash2,
  Share2,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TravelBuddyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [buddy, setBuddy] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reportCount, setReportCount] = useState(0);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: 'other', description: '' });
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [updatingReview, setUpdatingReview] = useState(false);
  const [deletingReview, setDeletingReview] = useState(null);

  useEffect(() => {
    fetchBuddyDetails();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, id]);

  const fetchBuddyDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/travel-buddy/${id}`);
      const data = await response.json();

      if (data.success) {
        setBuddy(data.data);
        setReportCount(data.data.reportCount || 0);
      } else {
        navigate('/travel-buddies');
      }
    } catch (error) {
      console.error('Error fetching buddy details:', error);
      navigate('/travel-buddies');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`/api/travel-buddy/${id}/reviews`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/travel-buddy/${id}/favorite-status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`/api/travel-buddy/${id}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleWhatsAppContact = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Record contact
      await fetch(`/api/travel-buddy/${id}/contact`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Open WhatsApp
      const message = encodeURIComponent(`Hi ${buddy.userName}! I found your travel buddy profile on HolidaySri and would love to connect for potential travel opportunities.`);
      const whatsappUrl = `https://wa.me/${buddy.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error recording contact:', error);
    }
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
  };

  const handleReportBuddy = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowReportModal(true);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    if (reportForm.description.trim().length < 30) {
      alert('Description must be at least 30 characters long.');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to submit this report? This action will be reviewed by our moderation team.'
    );

    if (!confirmed) return;

    try {
      setIsReporting(true);
      const response = await fetch(`/api/travel-buddy/${id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          reason: reportForm.reason,
          description: reportForm.description.trim()
        })
      });
      const data = await response.json();

      if (data.success) {
        setReportCount(prev => prev + 1);
        setShowReportModal(false);
        setReportForm({ reason: 'other', description: '' });
        alert('Report submitted successfully. Thank you for helping keep our community safe.');
      } else {
        alert(data.message || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error reporting buddy:', error);
      alert('Failed to submit report');
    } finally {
      setIsReporting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await fetch(`/api/travel-buddy/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewForm)
      });
      const data = await response.json();

      if (data.success) {
        setReviews(prev => [data.data, ...prev]);
        setReviewForm({ rating: 5, comment: '' });
        setShowReviewForm(false);
        // Refresh buddy details to update rating
        fetchBuddyDetails();
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review._id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    try {
      setUpdatingReview(true);
      const response = await fetch(`/api/travel-buddy/reviews/${editingReview}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });
      const data = await response.json();

      if (data.success) {
        setReviews(prev => prev.map(review =>
          review._id === editingReview ? data.data : review
        ));
        setEditingReview(null);
        setEditForm({ rating: 5, comment: '' });
        // Refresh buddy details to update rating
        fetchBuddyDetails();
      } else {
        alert(data.message || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review');
    } finally {
      setUpdatingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      setDeletingReview(reviewId);
      const response = await fetch(`/api/travel-buddy/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setReviews(prev => prev.filter(review => review._id !== reviewId));
        // Refresh buddy details to update rating
        fetchBuddyDetails();
      } else {
        alert(data.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    } finally {
      setDeletingReview(null);
    }
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setEditForm({ rating: 5, comment: '' });
  };

  const renderStars = (rating, interactive = false, onRatingChange = null, size = 'w-5 h-5') => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive ? () => onRatingChange(index + 1) : undefined}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!buddy) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Travel Buddy Not Found
          </h2>
          <button
            onClick={() => navigate('/travel-buddies')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Travel Buddies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/travel-buddies')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Travel Buddies</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
          {/* Cover Photo */}
          <div className="relative h-72 md:h-96 overflow-hidden">
            <img
              src={buddy.coverPhoto.url}
              alt={`${buddy.userName}'s cover`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Member/Partner Badge */}
            {(buddy.user?.isMember || buddy.user?.isPartner) && (
              <div className={`absolute top-6 right-6 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm ${
                buddy.user?.isPartner
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : 'bg-gradient-to-r from-amber-400 to-orange-500'
              }`}>
                <span className="flex items-center space-x-2">
                  <span>{buddy.user?.isPartner ? '💼' : '👑'}</span>
                  <span>{buddy.user?.isPartner ? 'PARTNER' : 'MEMBER'}</span>
                </span>
              </div>
            )}

            {/* Verified Badge */}
            {buddy.user?.isVerified && (
              <div className="absolute bottom-6 right-6">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
                    fill="#1D9BF0"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-end space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={buddy.avatarImage.url}
                    alt={buddy.userName}
                    className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-2xl ring-4 ring-white/20"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-lg"></div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                      {buddy.userName}
                    </h1>
                    {buddy.nickName && (
                      <span className="text-xl text-white/90 font-medium">
                        "{buddy.nickName}"
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-white/90 mb-3">
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{buddy.country}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{buddy.age} years old</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Joined {new Date(buddy.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Rating and Stats */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <div className="flex items-center space-x-1">
                        {renderStars(buddy.averageRating)}
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {buddy.averageRating > 0 ? buddy.averageRating.toFixed(1) : 'New'}
                      </span>
                      {buddy.totalReviews > 0 && (
                        <span className="text-xs text-white/80">({buddy.totalReviews})</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-semibold">{formatViewCount(buddy.viewCount)} views</span>
                    </div>
                    {reportCount > 0 && (
                      <div className="flex items-center space-x-2 bg-red-500/80 backdrop-blur-sm rounded-full px-3 py-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-semibold">{reportCount} reports</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleWhatsAppContact}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              {user && (
                <>
                  <button
                    onClick={handleFavoriteToggle}
                    className={`flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      isFavorite
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                        : 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    <span>{isFavorite ? 'Remove Favorite' : 'Add to Favorites'}</span>
                  </button>

                  <button
                    onClick={handleReportBuddy}
                    disabled={isReporting}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {isReporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Flag className="w-4 h-4" />
                    )}
                    <span>Report</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Me</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              {buddy.description}
            </p>
          </div>

          {/* Personal Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{buddy.age}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Years Old</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{buddy.gender}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Gender</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{buddy.country}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Location</div>
            </div>
          </div>

          {/* Interests */}
          {buddy.interests && buddy.interests.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <span>🎯</span>
                <span>Interests & Hobbies</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {buddy.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-700 hover:shadow-md transition-shadow duration-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Social Media Profiles */}
        {(buddy.socialMedia?.facebook || buddy.socialMedia?.instagram || buddy.socialMedia?.tiktok) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Connect on Social Media</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {buddy.socialMedia?.facebook && (
                <a
                  href={buddy.socialMedia?.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">Facebook</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300">View Profile</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-300 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              )}

              {buddy.socialMedia?.instagram && (
                <a
                  href={buddy.socialMedia?.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-4 bg-gradient-to-r from-pink-50 to-purple-100 dark:from-pink-900/20 dark:to-purple-800/20 rounded-xl border border-pink-200 dark:border-pink-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-pink-800 dark:text-pink-200">Instagram</h3>
                    <p className="text-sm text-pink-600 dark:text-pink-300">View Profile</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-pink-600 dark:text-pink-300 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              )}

              {buddy.socialMedia?.tiktok && (
                <a
                  href={buddy.socialMedia?.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">TikTok</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View Profile</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              )}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center space-x-2">
                <span>🔗</span>
                <span>Connect with {buddy.userName} on social media to learn more about their travel experiences and adventures!</span>
              </p>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-current" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Reviews & Ratings
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} from fellow travelers
                </p>
              </div>
            </div>
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Write Review</span>
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-5 mb-6 border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <span>✍️</span>
                <span>Share Your Experience</span>
              </h3>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    How would you rate this travel buddy?
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    {renderStars(reviewForm.rating, true, (rating) =>
                      setReviewForm(prev => ({ ...prev, rating }))
                    )}
                    <span className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {reviewForm.rating} out of 5 stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tell us about your experience
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 resize-none text-sm"
                    placeholder="Share your experience with this travel buddy... What made them a great companion?"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                  >
                    {submittingReview ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Submit Review</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Loading reviews...</p>
              </div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-200">
                  {editingReview === review._id ? (
                    // Edit Form
                    <form onSubmit={handleUpdateReview} className="space-y-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Edit Your Review</h4>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Rating
                        </label>
                        <div className="flex items-center space-x-2">
                          {renderStars(editForm.rating, true, (rating) =>
                            setEditForm(prev => ({ ...prev, rating }))
                          )}
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {editForm.rating} out of 5 stars
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Comment
                        </label>
                        <textarea
                          value={editForm.comment}
                          onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 resize-none text-sm"
                          placeholder="Update your review..."
                          required
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={updatingReview}
                          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                          {updatingReview ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          <span>Update</span>
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Review Display
                    <div className="flex items-start space-x-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={review.userId.profileImage || '/default-avatar.png'}
                          alt={review.userId.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-700"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {review.userId.name}
                            </h4>
                            <div className="flex items-center space-x-1">
                              {renderStars(review.rating, false, null, 'w-3.5 h-3.5')}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>

                            {user && user.id === review.userId._id && (
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleEditReview(review)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                                  title="Edit review"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  disabled={deletingReview === review._id}
                                  className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                                  title="Delete review"
                                >
                                  {deletingReview === review._id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                            "{review.comment}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-white fill-current" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No reviews yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Be the first to share your experience with this travel buddy!
              </p>
              {user && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Write First Review
                </button>
              )}
            </div>
          )}
        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Flag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Report Travel Buddy</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Help us keep the community safe</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleReportSubmit} className="p-6 space-y-6">
                {/* Reason Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    What's the issue? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reportForm.reason}
                    onChange={(e) => setReportForm(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="inappropriate_content">Inappropriate Content</option>
                    <option value="fake_profile">Fake Profile</option>
                    <option value="harassment">Harassment</option>
                    <option value="spam">Spam</option>
                    <option value="safety_concern">Safety Concern</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Please provide details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reportForm.description}
                    onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 resize-none"
                    placeholder="Please describe the issue in detail. This helps our moderation team understand the problem better. (Minimum 30 characters)"
                    required
                    minLength={30}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs ${
                      reportForm.description.length >= 30
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}>
                      {reportForm.description.length >= 30 ? '✓' : '✗'} Minimum 30 characters
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {reportForm.description.length}/500
                    </span>
                  </div>
                </div>

                {/* Warning Message */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      <p className="font-semibold mb-1">Important:</p>
                      <p>False reports may result in action against your account. Please only report genuine concerns.</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isReporting || reportForm.description.length < 30}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {isReporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Flag className="w-4 h-4" />
                    )}
                    <span>Submit Report</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelBuddyDetail;
