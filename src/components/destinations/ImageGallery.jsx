import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

const ImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);

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
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors duration-200 z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black bg-opacity-50 text-white rounded-full text-sm z-10">
              {selectedImage + 1} / {images.length}
            </div>
          )}

          {/* Main image */}
          <div className="max-w-full max-h-full flex items-center justify-center">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].alt || `Destination image ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(index);
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === selectedImage 
                      ? 'border-white' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageGallery;
