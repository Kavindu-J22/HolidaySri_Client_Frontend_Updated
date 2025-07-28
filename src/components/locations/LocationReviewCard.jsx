import React, { useState } from 'react';
import { Star, ThumbsUp, Flag, Edit, Trash2, Calendar, User } from 'lucide-react';
import LocationReviewForm from './LocationReviewForm';

const LocationReviewCard = ({ review, isOwn = false, onUpdate }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [helpful, setHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const handleHelpful = async () => {
    if (helpful) return; // Prevent multiple clicks
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/location-reviews/${review._id}/helpful`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHelpful(true);
        setHelpfulCount(data.helpfulCount);
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!confirm('Are you sure you want to report this review?')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/location-reviews/${review._id}/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Review reported successfully');
      }
    } catch (error) {
      console.error('Error reporting review:', error);
      alert('Failed to report review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/location-reviews/${review._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = () => {
    setShowEditForm(false);
    onUpdate();
  };

  if (showEditForm) {
    return (
      <LocationReviewForm
        locationId={review.locationId}
        existingReview={review}
        onSubmit={handleEditSubmit}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {review.userId?.profileImage ? (
              <img
                src={review.userId.profileImage}
                alt={review.userId.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* User Info and Rating */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {review.userId?.name || 'Anonymous User'}
              </h4>
              {isOwn && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
                  Your Review
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {review.rating}/5
              </span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isOwn && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Edit Review"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
              title="Delete Review"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Comment */}
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {review.comment}
        </p>
      </div>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {review.images.map((image, index) => (
            <div key={index} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
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

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Helpful Button */}
          <button
            onClick={handleHelpful}
            disabled={helpful || loading || isOwn}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              helpful
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${(helpful || loading || isOwn) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            <ThumbsUp className={`w-4 h-4 ${helpful ? 'fill-current' : ''}`} />
            <span>Helpful ({helpfulCount})</span>
          </button>

          {/* Report Button */}
          {!isOwn && (
            <button
              onClick={handleReport}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Flag className="w-4 h-4" />
              <span>Report</span>
            </button>
          )}
        </div>

        {/* Review Date */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {review.updatedAt !== review.createdAt && (
            <span>Edited {formatDate(review.updatedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationReviewCard;
