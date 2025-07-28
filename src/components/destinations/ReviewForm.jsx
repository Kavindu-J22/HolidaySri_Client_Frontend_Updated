import React, { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';

const ReviewForm = ({ destinationId, onSubmit, onCancel, existingReview = null }) => {
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    comment: existingReview?.comment || '',
    images: existingReview?.images || []
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const uploadToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
      {
        method: 'POST',
        body: formDataUpload,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleCommentChange = (e) => {
    setFormData(prev => ({ ...prev, comment: e.target.value }));
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: '' }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remainingSlots = 3 - formData.images.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      alert('Maximum 3 images allowed');
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 5MB`);
        }

        const result = await uploadToCloudinary(file);
        return {
          url: result.secure_url,
          publicId: result.public_id,
          alt: file.name.split('.')[0]
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));

    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Please write a comment';
    } else if (formData.comment.length > 1000) {
      newErrors.comment = 'Comment must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = existingReview 
        ? `/api/reviews/${existingReview._id}`
        : '/api/reviews';
      
      const method = existingReview ? 'PUT' : 'POST';
      const body = existingReview 
        ? formData
        : { ...formData, destinationId };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        onSubmit();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          onClick={() => handleRatingClick(starValue)}
          className={`transition-colors duration-200 ${
            starValue <= formData.rating
              ? 'text-yellow-400 hover:text-yellow-500'
              : 'text-gray-300 hover:text-yellow-300'
          }`}
        >
          <Star className={`w-8 h-8 ${starValue <= formData.rating ? 'fill-current' : ''}`} />
        </button>
      );
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating *
          </label>
          <div className="flex items-center space-x-1">
            {renderStars()}
          </div>
          {formData.rating > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formData.rating} out of 5 stars
            </p>
          )}
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Review *
          </label>
          <textarea
            value={formData.comment}
            onChange={handleCommentChange}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors duration-200 resize-none ${
              errors.comment ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Share your experience about this destination..."
          />
          <div className="flex justify-between items-center mt-1">
            {errors.comment ? (
              <p className="text-red-500 text-sm">{errors.comment}</p>
            ) : (
              <p className="text-gray-500 text-sm">
                {formData.comment.length}/1000 characters
              </p>
            )}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Photos (Optional)
          </label>
          
          {/* Upload Button */}
          {formData.images.length < 3 && (
            <div className="mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="review-images"
                disabled={uploading}
              />
              <label
                htmlFor="review-images"
                className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200 ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Add Photos'}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {3 - formData.images.length} more photos allowed (max 5MB each)
              </p>
            </div>
          )}

          {/* Image Preview */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.alt || `Review image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || uploading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{existingReview ? 'Updating...' : 'Submitting...'}</span>
              </div>
            ) : (
              existingReview ? 'Update Review' : 'Submit Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
