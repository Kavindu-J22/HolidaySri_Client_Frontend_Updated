import React, { useState } from 'react';
import ProfileImage from './ProfileImage';
import { User, Camera, Settings } from 'lucide-react';

const ProfileImageDemo = () => {
  const [demoSrc, setDemoSrc] = useState('');
  const [loadingState, setLoadingState] = useState('');

  const demoImages = {
    valid: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    slow: 'https://httpbin.org/delay/3/image/jpeg?width=150&height=150', // Simulates slow loading
    invalid: 'https://invalid-url-that-will-fail.com/image.jpg',
    empty: ''
  };

  const handleImageLoad = () => {
    setLoadingState('✅ Image loaded successfully');
  };

  const handleImageError = () => {
    setLoadingState('❌ Image failed to load');
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        ProfileImage Component Demo
      </h2>
      
      {/* Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setDemoSrc(demoImages.valid);
              setLoadingState('Loading valid image...');
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Load Valid Image
          </button>
          <button
            onClick={() => {
              setDemoSrc(demoImages.slow);
              setLoadingState('Loading slow image...');
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Load Slow Image (3s delay)
          </button>
          <button
            onClick={() => {
              setDemoSrc(demoImages.invalid);
              setLoadingState('Loading invalid image...');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Load Invalid Image
          </button>
          <button
            onClick={() => {
              setDemoSrc(demoImages.empty);
              setLoadingState('No image source');
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            No Image
          </button>
        </div>
        
        {loadingState && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-300 text-sm">{loadingState}</p>
          </div>
        )}
      </div>

      {/* Size Demonstrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Different Sizes */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Different Sizes
          </h3>
          <div className="space-y-4">
            {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(size => (
              <div key={size} className="flex items-center space-x-4">
                <ProfileImage
                  src={demoSrc}
                  alt="Demo User"
                  size={size}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Size: {size}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Different Fallback Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Custom Fallback Icons
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <ProfileImage
                src=""
                alt="User Icon"
                size="lg"
                fallbackIcon={User}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                User Icon (default)
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ProfileImage
                src=""
                alt="Camera Icon"
                size="lg"
                fallbackIcon={Camera}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Camera Icon
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ProfileImage
                src=""
                alt="Settings Icon"
                size="lg"
                fallbackIcon={Settings}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Settings Icon
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Usage Example
        </h3>
        <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
{`<ProfileImage
  src={user.profileImage}
  alt={user.name}
  size="md"
  className="border-2 border-white shadow-lg"
  onLoad={() => console.log('Loaded!')}
  onError={() => console.log('Failed!')}
/>`}
        </pre>
      </div>
    </div>
  );
};

export default ProfileImageDemo;
