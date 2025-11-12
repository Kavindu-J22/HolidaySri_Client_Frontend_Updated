import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Type,
  FileText,
  ImageIcon,
  LinkIcon,
  MousePointer,
  Loader,
  CheckCircle,
  X,
  Upload,
  ArrowLeft
} from 'lucide-react';

const EditHomeBannerSlot = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    buttonText: ''
  });

  const [image, setImage] = useState({
    url: '',
    publicId: ''
  });

  const [uploading, setUploading] = useState(false);

  // Fetch banner slot data
  useEffect(() => {
    const fetchBannerSlot = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/home-banner-slot/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          const banner = data.data;
          setFormData({
            title: banner.title,
            description: banner.description,
            link: banner.link,
            buttonText: banner.buttonText
          });
          setImage({
            url: banner.image.url,
            publicId: banner.image.publicId
          });
        } else {
          setError(data.message || 'Failed to fetch banner slot');
        }
      } catch (error) {
        console.error('Error fetching banner slot:', error);
        setError('Failed to fetch banner slot');
      } finally {
        setLoading(false);
      }
    };

    fetchBannerSlot();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should not exceed 5MB');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setImage({
          url: data.secure_url,
          publicId: data.public_id
        });
      } else {
        setError('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.description || !formData.link || !formData.buttonText || !image.url) {
      setError('All fields are required');
      return;
    }

    if (formData.title.length > 30) {
      setError('Title must not exceed 30 characters');
      return;
    }

    if (formData.description.length > 100) {
      setError('Description must not exceed 100 characters');
      return;
    }

    if (formData.buttonText.length > 15) {
      setError('Button text must not exceed 15 characters');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/home-banner-slot/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          image: image,
          link: formData.link,
          buttonText: formData.buttonText
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/profile?tab=advertisements');
        }, 2000);
      } else {
        setError(data.message || 'Failed to update banner slot');
      }
    } catch (error) {
      console.error('Error updating banner slot:', error);
      setError('Failed to update banner slot');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading banner slot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile?tab=advertisements')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to My Advertisements
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Home Banner Slot
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update your home page banner advertisement
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Type className="w-4 h-4 mr-2" />
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                maxLength={30}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter banner title"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.title.length}/30 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 mr-2" />
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                maxLength={100}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter banner description"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.description.length}/100 characters
              </p>
            </div>

            {/* Image */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <ImageIcon className="w-4 h-4 mr-2" />
                Banner Image *
              </label>
              <div className="space-y-4">
                {image.url && (
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt="Banner"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                  >
                    {uploading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {image.url ? 'Change Image' : 'Upload Image'}
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Link */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <LinkIcon className="w-4 h-4 mr-2" />
                Link *
              </label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com"
              />
            </div>

            {/* Button Text */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MousePointer className="w-4 h-4 mr-2" />
                Button Text *
              </label>
              <input
                type="text"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleInputChange}
                maxLength={15}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Visit Site"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.buttonText.length}/15 characters
              </p>
            </div>

            {/* Preview */}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Preview
              </h3>
              <div className="relative rounded-lg overflow-hidden">
                {image.url && (
                  <img
                    src={image.url}
                    alt="Banner Preview"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-6">
                  <h4 className="text-2xl font-bold text-white mb-2">
                    {formData.title || 'Your Title'}
                  </h4>
                  <p className="text-white/90 mb-4">
                    {formData.description || 'Your description'}
                  </p>
                  <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold w-fit">
                    {formData.buttonText || 'Button Text'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => navigate('/profile?tab=advertisements')}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Successfully Updated!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your home banner advertisement has been updated successfully. Redirecting to My Advertisements...
            </p>
            <div className="flex items-center justify-center">
              <Loader className="w-5 h-5 animate-spin text-purple-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditHomeBannerSlot;

