import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  X,
  CheckCircle,
  Loader,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  FileText,
  MousePointer,
  Grid3x3,
  Clock,
  Bell
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const HomeBannerSlotForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const advertisementId = location.state?.advertisementId;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    buttonText: '',
    slotNumber: null
  });

  const [image, setImage] = useState({
    url: '',
    publicId: '',
    uploading: false
  });

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [hasNotificationRequest, setHasNotificationRequest] = useState(false);

  useEffect(() => {
    if (!advertisementId) {
      navigate('/profile', { state: { activeSection: 'advertisements' } });
    }
  }, [advertisementId, navigate]);

  // Fetch slot availability when reaching step 6
  useEffect(() => {
    if (currentStep === 6) {
      fetchSlotAvailability();
      checkNotificationStatus();
    }
  }, [currentStep]);

  // Fetch slot availability
  const fetchSlotAvailability = async () => {
    setLoadingSlots(true);
    try {
      const response = await fetch(`${API_BASE_URL}/home-banner-slot/slots/availability`);
      const data = await response.json();

      if (data.success) {
        setSlots(data.data);
      }
    } catch (error) {
      console.error('Error fetching slot availability:', error);
      setError('Failed to load slot availability');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Check if user has pending notification request
  const checkNotificationStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/home-banner-slot/my-notification`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success && data.data) {
        setHasNotificationRequest(true);
      }
    } catch (error) {
      console.error('Error checking notification status:', error);
    }
  };

  // Request notification when slot becomes available
  const handleNotifyMe = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail') || '';

      const response = await fetch(`${API_BASE_URL}/home-banner-slot/notify-me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await response.json();

      if (data.success) {
        setHasNotificationRequest(true);
        setShowNotifyModal(true);
        setTimeout(() => setShowNotifyModal(false), 3000);
      } else {
        setError(data.message || 'Failed to register for notifications');
      }
    } catch (error) {
      console.error('Error requesting notification:', error);
      setError('Failed to register for notifications');
    }
  };

  // Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');
    formDataUpload.append('cloud_name', 'daa9e83as');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
        {
          method: 'POST',
          body: formDataUpload
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        return {
          url: data.secure_url,
          publicId: data.public_id
        };
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setImage(prev => ({ ...prev, uploading: true }));
    setError('');

    try {
      const result = await uploadToCloudinary(file);
      setImage({
        url: result.url,
        publicId: result.publicId,
        uploading: false
      });
    } catch (error) {
      setError('Failed to upload image');
      setImage(prev => ({ ...prev, uploading: false }));
    }
  };

  // Remove image
  const removeImage = () => {
    setImage({
      url: '',
      publicId: '',
      uploading: false
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate current step
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          setError('Title is required');
          return false;
        }
        if (formData.title.length > 30) {
          setError('Title must be maximum 30 characters');
          return false;
        }
        break;
      case 2:
        if (!formData.description.trim()) {
          setError('Description is required');
          return false;
        }
        if (formData.description.length > 100) {
          setError('Description must be maximum 100 characters');
          return false;
        }
        break;
      case 3:
        if (!image.url) {
          setError('Image is required');
          return false;
        }
        break;
      case 4:
        if (!formData.link.trim()) {
          setError('Link is required');
          return false;
        }
        
        break;
      case 5:
        if (!formData.buttonText.trim()) {
          setError('Button text is required');
          return false;
        }
        if (formData.buttonText.length > 15) {
          setError('Button text must be maximum 15 characters');
          return false;
        }
        break;
      case 6:
        if (!formData.slotNumber) {
          setError('Please select a slot');
          return false;
        }
        break;
      default:
        break;
    }
    setError('');
    return true;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(6)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/home-banner-slot/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          advertisementId,
          title: formData.title,
          description: formData.description,
          image: {
            url: image.url,
            publicId: image.publicId
          },
          link: formData.link,
          buttonText: formData.buttonText,
          slotNumber: formData.slotNumber
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/profile', { state: { activeSection: 'advertisements' } });
        }, 3000);
      } else {
        setError(data.message || 'Failed to publish. Please try again.');
      }
    } catch (error) {
      console.error('Error publishing home banner slot:', error);
      setError('Failed to publish. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Title', icon: Type },
    { number: 2, title: 'Description', icon: FileText },
    { number: 3, title: 'Image', icon: ImageIcon },
    { number: 4, title: 'Link', icon: LinkIcon },
    { number: 5, title: 'Button Text', icon: MousePointer },
    { number: 6, title: 'Select Slot', icon: Grid3x3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to My Advertisements
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Publish Home Banner Advertisement
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your premium home page banner advertisement step by step
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.number
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Title */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Enter Banner Title
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create a catchy title for your banner (Maximum 30 characters)
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={30}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Discover Sri Lanka's Beauty"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formData.title.length}/30 characters
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Description */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Enter Banner Description
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Provide a compelling description (Maximum 100 characters)
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    maxLength={100}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Experience the paradise island with our exclusive tour packages"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formData.description.length}/100 characters
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Image */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Upload Banner Image
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Upload a high-quality image for your banner (Recommended: 1920x600px)
                </p>
                
                {!image.url ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <label className="cursor-pointer">
                        <span className="text-purple-600 hover:text-purple-700 font-medium">
                          Click to upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={image.uploading}
                        />
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={image.url}
                      alt="Banner"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {image.uploading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader className="w-6 h-6 animate-spin text-purple-600" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Uploading...</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Link */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Enter Destination Link
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Where should users go when they click your banner?
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Link URL *
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/your-page"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Enter a valid URL (e.g., https://example.com)
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Button Text */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Enter Button Text
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  What should the call-to-action button say? (Maximum 15 characters)
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            )}

            {/* Step 6: Select Slot */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Select Your Banner Slot
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose one of the 6 available slots for your home page banner
                </p>

                {loadingSlots ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-purple-600" />
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Loading slots...</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {slots.map((slot) => (
                        <div
                          key={slot.slotNumber}
                          onClick={() => {
                            if (slot.isAvailable) {
                              setFormData(prev => ({ ...prev, slotNumber: slot.slotNumber }));
                              setError('');
                            }
                          }}
                          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                            slot.isAvailable
                              ? formData.slotNumber === slot.slotNumber
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700'
                              : 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              Slot {slot.slotNumber}
                            </h3>
                            {formData.slotNumber === slot.slotNumber && slot.isAvailable && (
                              <CheckCircle className="w-6 h-6 text-purple-600" />
                            )}
                          </div>

                          {slot.isAvailable ? (
                            <div className="flex items-center text-green-600 dark:text-green-400">
                              <CheckCircle className="w-5 h-5 mr-2" />
                              <span className="font-semibold">Available</span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center text-red-600 dark:text-red-400 mb-2">
                                <X className="w-5 h-5 mr-2" />
                                <span className="font-semibold">Occupied</span>
                              </div>
                              {slot.expiresAt && (
                                <div className="flex items-start text-sm text-gray-600 dark:text-gray-400 mt-2">
                                  <Clock className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-medium">Available after:</p>
                                    <p className="text-xs">
                                      {new Date(slot.expiresAt).toLocaleString('en-US', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Notify Me Section */}
                    {slots.every(slot => !slot.isAvailable) && (
                      <div className="mt-6 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-start">
                          <Bell className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              All Slots Currently Occupied
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Don't worry! We'll notify you via email as soon as a slot becomes available.
                            </p>
                            {hasNotificationRequest ? (
                              <div className="flex items-center text-green-600 dark:text-green-400">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                <span className="font-medium">You're on the notification list!</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={handleNotifyMe}
                                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold flex items-center"
                              >
                                <Bell className="w-5 h-5 mr-2" />
                                Notify Me When Available
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Selected Slot Info */}
                    {formData.slotNumber && (
                      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center text-green-700 dark:text-green-400">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <span className="font-semibold">
                            Slot {formData.slotNumber} selected - Ready to publish!
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !formData.slotNumber}
                  className="ml-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Now'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Successfully Published!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your home banner advertisement has been published successfully to Slot {formData.slotNumber}. Redirecting to My Advertisements...
            </p>
            <div className="flex items-center justify-center">
              <Loader className="w-5 h-5 animate-spin text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Notification Request Modal */}
      {showNotifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Notification Registered!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We'll send you an email as soon as a slot becomes available.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeBannerSlotForm;

