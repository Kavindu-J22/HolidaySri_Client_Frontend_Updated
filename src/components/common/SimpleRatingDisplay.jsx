import React from 'react';
import { Star } from 'lucide-react';

/**
 * SimpleRatingDisplay Component
 * Displays overall rating professionally without breakdown - for use in cards
 * 
 * Props:
 * - averageRating: number (0-5) - The average rating value
 * - totalReviews: number - Total number of reviews
 * - size: 'sm' | 'md' | 'lg' - Size of the rating display (default: 'md')
 * - className: string - Additional CSS classes
 */
const SimpleRatingDisplay = ({ 
  averageRating = 0, 
  totalReviews = 0, 
  size = 'md',
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

  const starSize = starSizeMap[size] || starSizeMap.md;
  const textSize = textSizeMap[size] || textSizeMap.md;

  // Generate star array (5 stars total)
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  // Calculate filled stars
  const filledStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 !== 0;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Stars */}
      <div className="flex items-center space-x-0.5">
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
      <div className="flex items-center space-x-1">
        <span className={`font-bold text-gray-900 dark:text-white ${textSize}`}>
          {averageRating.toFixed(1)}
        </span>
        <span className={`text-gray-600 dark:text-gray-400 ${textSize}`}>
          ({totalReviews})
        </span>
      </div>
    </div>
  );
};

export default SimpleRatingDisplay;

