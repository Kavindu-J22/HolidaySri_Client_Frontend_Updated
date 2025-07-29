import React, { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';

const ProfileImage = ({
  src,
  alt,
  size = 'md',
  className = '',
  showSkeleton = true,
  fallbackIcon = User,
  onLoad,
  onError,
  loadingTimeout = 10000, // 10 seconds timeout
  ...props
}) => {
  const [imageState, setImageState] = useState('loading');
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);
  const timeoutRef = useRef(null);

  // Size configurations
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20 sm:w-24 sm:h-24'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10 sm:w-12 sm:h-12'
  };

  useEffect(() => {
    if (!src) {
      setImageState('error');
      return;
    }

    setImageState('loading');
    setImageSrc(null);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Create a new image to preload
    const img = new Image();

    img.onload = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setImageSrc(src);
      setImageState('loaded');
      onLoad && onLoad();
    };

    img.onerror = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setImageState('error');
      onError && onError();
    };

    // Set timeout for slow loading images
    timeoutRef.current = setTimeout(() => {
      if (imageState === 'loading') {
        setImageState('error');
        onError && onError();
      }
    }, loadingTimeout);

    img.src = src;

    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [src, onLoad, onError, loadingTimeout, imageState]);

  const FallbackIcon = fallbackIcon;
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const iconSize = iconSizes[size] || iconSizes.md;

  // Loading skeleton
  if (imageState === 'loading' && showSkeleton) {
    return (
      <div
        className={`${sizeClass} rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse relative overflow-hidden ${className}`}
        {...props}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-gray-400/20 to-transparent"></div>
        {/* Optional subtle icon in loading state */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <FallbackIcon className={`${iconSize} text-gray-400 dark:text-gray-500`} />
        </div>
      </div>
    );
  }

  // Successfully loaded image
  if (imageState === 'loaded' && imageSrc) {
    return (
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`${sizeClass} rounded-full object-cover transition-opacity duration-200 ${className}`}
        style={{ opacity: imageState === 'loaded' ? 1 : 0 }}
        {...props}
      />
    );
  }

  // Fallback icon for error or no src
  return (
    <div
      className={`${sizeClass} rounded-full bg-primary-600 hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center ${className}`}
      {...props}
    >
      <FallbackIcon className={`${iconSize} text-white`} />
    </div>
  );
};

export default ProfileImage;
