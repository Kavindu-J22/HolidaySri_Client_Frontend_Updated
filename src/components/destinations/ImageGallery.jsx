import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

const ImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const modalRef = useRef(null);

  if (!images || images.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <ZoomIn className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">No images available</p>
      </div>
    );
  }

  const openModal = (index) => {
    setSelectedImage(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  };

  // Touch gesture handling for mobile swipe
  const minSwipeDistance = 50;

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
      nextImage();
    }
    if (isRightSwipe && images.length > 1) {
      prevImage();
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  return (
    <>
      {/* Gallery Grid */}
      <div className="card overflow-hidden">
        {images.length === 1 ? (
          // Single image
          <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
            <img
              src={images[0].url}
              alt={images[0].alt || 'Destination image'}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => openModal(0)}
            />
            <button
              onClick={() => openModal(0)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
              title="View full size"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        ) : images.length === 2 ? (
          // Two images
          <div className="grid grid-cols-2 gap-2 aspect-video">
            {images.map((image, index) => (
              <div key={index} className="relative bg-gray-200 dark:bg-gray-700">
                <img
                  src={image.url}
                  alt={image.alt || `Destination image ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => openModal(index)}
                />
                <button
                  onClick={() => openModal(index)}
                  className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
                  title="View full size"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          // Three or more images
          <div className="grid grid-cols-4 gap-2 aspect-video">
            {/* Main image */}
            <div className="col-span-2 row-span-2 relative bg-gray-200 dark:bg-gray-700">
              <img
                src={images[0].url}
                alt={images[0].alt || 'Main destination image'}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => openModal(0)}
              />
              <button
                onClick={() => openModal(0)}
                className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
                title="View full size"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Secondary images */}
            {images.slice(1, 5).map((image, index) => (
              <div key={index + 1} className="relative bg-gray-200 dark:bg-gray-700">
                <img
                  src={image.url}
                  alt={image.alt || `Destination image ${index + 2}`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => openModal(index + 1)}
                />
                <button
                  onClick={() => openModal(index + 1)}
                  className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
                  title="View full size"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                
                {/* Show more overlay for last image if there are more than 5 images */}
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      +{images.length - 5} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-0 sm:p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          tabIndex={0}
        >
          {/* Close button - Mobile Responsive */}
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 bg-black/50 sm:bg-transparent hover:bg-black/70 sm:hover:bg-white/20 rounded-full text-white transition-colors duration-200 z-20"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Navigation buttons - Enhanced for Mobile */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black/50 hover:bg-black/70 sm:hover:bg-white/20 rounded-full text-white transition-all duration-200 z-20 active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black/50 hover:bg-black/70 sm:hover:bg-white/20 rounded-full text-white transition-all duration-200 z-20 active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </>
          )}

          {/* Image counter - Mobile Responsive */}
          {images.length > 1 && (
            <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/70 text-white rounded-full text-xs sm:text-sm font-medium z-20 backdrop-blur-sm">
              {selectedImage + 1} / {images.length}
            </div>
          )}

          {/* Main image - Mobile Optimized */}
          <div className="w-full h-full flex items-center justify-center px-12 sm:px-16 py-16 sm:py-20">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].alt || `Destination image ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain select-none"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />
          </div>

          {/* Thumbnail strip - Mobile Responsive with Scroll Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 z-20">
              <div className="flex justify-center px-2 sm:px-4">
                <div className="flex space-x-1.5 sm:space-x-2 bg-black/70 backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl max-w-full overflow-x-auto scrollbar-hide">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(index);
                      }}
                      className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all duration-200 active:scale-95 ${
                        index === selectedImage
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
        </div>
      )}
    </>
  );
};

export default ImageGallery;
