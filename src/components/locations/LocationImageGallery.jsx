import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const LocationImageGallery = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

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
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="absolute top-4 right-16 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-10"
      >
        <Download className="w-6 h-6" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 px-3 py-1 bg-black bg-opacity-50 text-white rounded-full text-sm z-10">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-10"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-10"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Main Image */}
      <div className="max-w-7xl max-h-full mx-4 flex items-center justify-center">
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 p-2 rounded-lg max-w-full overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-white'
                  : 'border-transparent opacity-60 hover:opacity-80'
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

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
};

export default LocationImageGallery;
