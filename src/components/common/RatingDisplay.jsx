import React from 'react';
import { Star } from 'lucide-react';

/**
 * RatingDisplay Component
 * Displays overall rating professionally with star rating, number of reviews, and average rating value
 *
 * Props:
 * - averageRating: number (0-5) - The average rating value
 * - totalReviews: number - Total number of reviews
 * - size: 'sm' | 'md' | 'lg' - Size of the rating display (default: 'md')
 * - showLabel: boolean - Whether to show "Overall Rating" label (default: true)
 * - ratingDistribution: object - Distribution of ratings {1: count, 2: count, ...} (optional)
 * - className: string - Additional CSS classes
 */
const RatingDisplay = ({
  averageRating = 0,
  totalReviews = 0,
  size = 'md',
  showLabel = true,
  ratingDistribution = {},
  className = ''
}) => {
  // Determine star size based on size prop
  const starSizeMap = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // Determine text size based on size prop
  const textSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const labelSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  };

  const starSize = starSizeMap[size] || starSizeMap.md;
  const textSize = textSizeMap[size] || textSizeMap.md;
  const labelSize = labelSizeMap[size] || labelSizeMap.md;

  // Generate star array (5 stars total)
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  // Calculate filled stars
  const filledStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 !== 0;

  return (
    <div className={`flex flex-col items-start space-y-2 ${className}`}>
      {/* Label */}
      {showLabel && (
        <p className={`font-semibold text-gray-700 dark:text-gray-300 ${labelSize}`}>
          Overall Rating
        </p>
      )}

      {/* Rating Container */}
      <div className="flex items-center space-x-3">
        {/* Stars */}
        <div className="flex items-center space-x-1">
          {stars.map((star) => (
            <div key={star} className="relative">
              {/* Background star (empty) */}
              <Star
                className={`${starSize} text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600`}
              />
              
              {/* Foreground star (filled) */}
              {star <= filledStars && (
                <div className="absolute inset-0">
                  <Star
                    className={`${starSize} text-yellow-400 dark:text-yellow-500 fill-yellow-400 dark:fill-yellow-500`}
                  />
                </div>
              )}

              {/* Half star */}
              {star === filledStars + 1 && hasHalfStar && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <Star
                    className={`${starSize} text-yellow-400 dark:text-yellow-500 fill-yellow-400 dark:fill-yellow-500`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Rating Value and Reviews Count */}
        <div className="flex items-center space-x-2">
          <span className={`font-bold text-gray-900 dark:text-white ${textSize}`}>
            {averageRating.toFixed(1)}
          </span>
          <span className={`text-gray-600 dark:text-gray-400 ${textSize}`}>
            ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>

      {/* Rating Breakdown (Optional - shown only if there are reviews) */}
      {totalReviews > 0 && (
        <div className="w-full mt-2 space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center space-x-2">
                <span className={`text-gray-600 dark:text-gray-400 ${textSize}`}>
                  {rating}★
                </span>
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 dark:bg-yellow-500 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className={`text-gray-600 dark:text-gray-400 ${textSize} w-8 text-right`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RatingDisplay;

