import React, { useState } from 'react';
import { Star, ThumbsUp, Flag, Edit, Trash2, Calendar, User } from 'lucide-react';
import ReviewForm from './ReviewForm';
import { API_BASE_URL } from '../../config/api';

const ReviewCard = ({ review, isOwn = false, onUpdate }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [helpful, setHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const handleHelpful = async () => {
    // This would typically make an API call to mark review as helpful
    setHelpful(!helpful);
    setHelpfulCount(prev => helpful ? prev - 1 : prev + 1);
  };

  const handleReport = async () => {
    // This would typically make an API call to report the review
    if (confirm('Are you sure you want to report this review?')) {
      // API call to report review
      alert('Review reported. Thank you for your feedback.');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete your review?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/reviews/${review._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          onUpdate && onUpdate();
        } else {
          alert('Failed to delete review');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review');
      }
    }
  };

  const handleEditSubmit = () => {
    setShowEditForm(false);
    onUpdate && onUpdate();
  };

  if (showEditForm) {
    return (
      <ReviewForm
        destinationId={review.destinationId}
        existingReview={review}
        onSubmit={handleEditSubmit}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start space-x-2 sm:space-x-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {review.userId?.profileImage ? (
              <img
                src={review.userId.profileImage}
                alt={review.userId.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* User Info and Rating */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mb-1">
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                {review.userId?.name || 'Anonymous User'}
              </h4>
              {isOwn && (
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full flex-shrink-0">
                  Your Review
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                {renderStars(review.rating)}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                {review.rating}/5
              </span>
            </div>

            <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {isOwn ? (
            <>
              <button
                onClick={() => setShowEditForm(true)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                title="Edit review"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                title="Delete review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={handleReport}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
              title="Report review"
            >
              <Flag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          {review.comment}
        </p>
      </div>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {review.images.map((image, index) => (
            <div key={index} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md sm:rounded-lg overflow-hidden">
              <img
                src={image.url}
                alt={image.alt || `Review image ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => {
                  // Open image in modal or new tab
                  window.open(image.url, '_blank');
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={handleHelpful}
            className={`flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm transition-colors duration-200 ${
              helpful
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${helpful ? 'fill-current' : ''}`} />
            <span>Helpful ({helpfulCount})</span>
          </button>
        </div>

        {review.updatedAt !== review.createdAt && (
          <span className="text-xs text-gray-400">
            Edited {formatDate(review.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
