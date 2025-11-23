import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const LocationImageGallery = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Touch handlers for swipe gestures
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && images.length > 1) {
      goToNext();
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex]);

  const handleDownload = async () => {
    try {
      const response = await fetch(images[currentIndex].url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `location-image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-0 sm:p-4"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Close Button - Mobile Responsive */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 bg-black/50 sm:bg-transparent hover:bg-black/70 sm:hover:bg-white/20 rounded-full text-white transition-colors z-20"
        aria-label="Close gallery"
      >
        <X className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* Download Button - Mobile Responsive */}
      <button
        onClick={handleDownload}
        className="absolute top-2 right-14 sm:top-4 sm:right-20 p-2 sm:p-3 bg-black/50 sm:bg-transparent hover:bg-black/70 sm:hover:bg-white/20 rounded-full text-white transition-colors z-20"
        aria-label="Download image"
      >
        <Download className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Image Counter - Mobile Responsive */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/70 backdrop-blur-sm text-white rounded-full text-xs sm:text-sm font-medium z-20">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous Button - Enhanced for Mobile */}
      {images.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black/50 hover:bg-black/70 sm:hover:bg-white/20 rounded-full text-white transition-all duration-200 z-20 active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Next Button - Enhanced for Mobile */}
      {images.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black/50 hover:bg-black/70 sm:hover:bg-white/20 rounded-full text-white transition-all duration-200 z-20 active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Main Image - Mobile Optimized */}
      <div className="w-full h-full flex items-center justify-center px-12 sm:px-16 py-16 sm:py-20">
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
        />
      </div>

      {/* Thumbnail Strip - Mobile Responsive */}
      {images.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 z-20">
          <div className="flex justify-center px-2 sm:px-4">
            <div className="flex space-x-1.5 sm:space-x-2 bg-black/70 backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl max-w-full overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all duration-200 active:scale-95 ${
                    index === currentIndex
                      ? 'border-white shadow-lg scale-105'
                      : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Swipe hint for mobile */}
          <div className="sm:hidden text-center mt-2">
            <p className="text-white/60 text-xs">Swipe left or right to navigate</p>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
};

export default LocationImageGallery;
