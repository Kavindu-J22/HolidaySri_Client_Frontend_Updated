import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Globe,
  Facebook,
  Star,
  Loader,
  AlertCircle,
  FileText,
  MapPinIcon,
  Share2,
  Check,
  Plus,
  X,
  Upload,
  UtensilsCrossed,
  Edit2,
  Trash2
} from 'lucide-react';
import SuccessModal from '../components/common/SuccessModal';
import { formatOperatingHours } from '../utils/timeFormat';

const CafesRestaurantsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    reviewText: ''
  });

  // Menu items state
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [uploadingMenuItem, setUploadingMenuItem] = useState(false);
  const [menuItemForm, setMenuItemForm] = useState({
    itemName: '',
    category: '',
    price: '',
    image: null
  });
  const [menuItemError, setMenuItemError] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);

  // Handle share functionality
  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: cafe.name,
          text: `Check out ${cafe.name} - ${cafe.categoryType}`,
          url: shareUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Fetch cafe details
  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/cafes-restaurants/${id}`);
        const data = await response.json();

        if (data.success) {
          setCafe(data.data);
        } else {
          setError(data.message || 'Failed to load cafe details');
        }
      } catch (error) {
        console.error('Error fetching cafe:', error);
        setError('Failed to load cafe details');
      } finally {
        setLoading(false);
      }
    };

    fetchCafe();
  }, [id]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (!reviewForm.rating) {
      setError('Please select a rating');
      return;
    }

    setSubmittingReview(true);
    setError('');

    try {
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/cafes-restaurants/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rating: reviewForm.rating,
          reviewText: reviewForm.reviewText
        })
      });

      const data = await response.json();

      if (data.success) {
        setCafe(prev => ({
          ...prev,
          reviews: [...prev.reviews, data.data.review],
          averageRating: data.data.averageRating,
          totalReviews: data.data.totalReviews
        }));
        setReviewForm({ rating: 5, reviewText: '' });
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle menu item image upload
  const handleMenuItemImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMenuItemError('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMenuItemError('Image size must be less than 10MB');
      return;
    }

    setUploadingMenuItem(true);
    setMenuItemError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'daa9e83as');

      const response = await fetch('https://api.cloudinary.com/v1_1/daa9e83as/image/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.secure_url) {
        setMenuItemForm(prev => ({
          ...prev,
          image: {
            url: data.secure_url,
            publicId: data.public_id
          }
        }));
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMenuItemError('Failed to upload image');
    } finally {
      setUploadingMenuItem(false);
    }
  };

  // Handle menu item submission (add or update)
  const handleSubmitMenuItem = async (e) => {
    e.preventDefault();

    if (!menuItemForm.image || !menuItemForm.itemName || !menuItemForm.category || !menuItemForm.price) {
      setMenuItemError('All fields are required');
      return;
    }

    if (parseFloat(menuItemForm.price) < 0) {
      setMenuItemError('Price must be a positive number');
      return;
    }

    setUploadingMenuItem(true);
    setMenuItemError('');

    try {
      const url = editingItemId
        ? `https://holidaysri-backend-9xm4.onrender.com/api/cafes-restaurants/${id}/menu-items/${editingItemId}`
        : `https://holidaysri-backend-9xm4.onrender.com/api/cafes-restaurants/${id}/menu-items`;

      const method = editingItemId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          image: menuItemForm.image,
          itemName: menuItemForm.itemName,
          category: menuItemForm.category,
          price: parseFloat(menuItemForm.price)
        })
      });

      const data = await response.json();

      if (data.success) {
        if (editingItemId) {
          // Update existing menu item
          setCafe(prev => ({
            ...prev,
            menuItems: prev.menuItems.map(item =>
              item._id === editingItemId ? data.data.menuItem : item
            )
          }));
        } else {
          // Add new menu item
          setCafe(prev => ({
            ...prev,
            menuItems: [...(prev.menuItems || []), data.data.menuItem]
          }));
        }

        // Reset form
        setMenuItemForm({
          itemName: '',
          category: '',
          price: '',
          image: null
        });
        setShowMenuItemForm(false);
        setEditingItemId(null);
        setShowSuccessModal(true);
      } else {
        setMenuItemError(data.message || `Failed to ${editingItemId ? 'update' : 'add'} menu item`);
      }
    } catch (error) {
      console.error(`Error ${editingItemId ? 'updating' : 'adding'} menu item:`, error);
      setMenuItemError(`Failed to ${editingItemId ? 'update' : 'add'} menu item`);
    } finally {
      setUploadingMenuItem(false);
    }
  };

  // Handle edit menu item
  const handleEditMenuItem = (item) => {
    setEditingItemId(item._id);
    setMenuItemForm({
      itemName: item.itemName,
      category: item.category,
      price: item.price.toString(),
      image: item.image
    });
    setShowMenuItemForm(true);
    setMenuItemError('');
  };

  // Handle delete menu item
  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    setDeletingItemId(itemId);

    try {
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/cafes-restaurants/${id}/menu-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Remove menu item from state
        setCafe(prev => ({
          ...prev,
          menuItems: prev.menuItems.filter(item => item._id !== itemId)
        }));
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Failed to delete menu item');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setError('Failed to delete menu item');
    } finally {
      setDeletingItemId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 dark:text-red-200">{error || 'Cafe not found'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back and Share buttons */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Go Back</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="relative bg-gray-200 dark:bg-gray-700 h-64 sm:h-80 md:h-96">
                {cafe.images && cafe.images.length > 0 ? (
                  <>
                    <img
                      src={cafe.images[currentImageIndex].url}
                      alt={cafe.name}
                      className="w-full h-full object-cover"
                    />
                    {cafe.images.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {cafe.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              idx === currentImageIndex ? 'bg-white scale-125' : 'bg-gray-400 hover:bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400">No images available</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {cafe.images && cafe.images.length > 1 && (
                <div className="p-3 sm:p-4 flex space-x-2 overflow-x-auto scrollbar-hide">
                  {cafe.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex
                          ? 'border-blue-500 scale-105'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                      }`}
                    >
                      <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">{cafe.name}</h1>
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold">
                  {cafe.categoryType}
                </div>
              </div>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        i < Math.round(cafe.averageRating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {cafe.averageRating ? cafe.averageRating.toFixed(1) : 'No ratings'}
                </span>
                <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  ({cafe.totalReviews || 0} {cafe.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Location */}
                <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location</p>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium truncate">{cafe.location.city}, {cafe.location.province}</p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Operating Hours</p>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                      {formatOperatingHours(cafe.operatingHours.openTime, cafe.operatingHours.closeTime)}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Contact</p>
                    <a href={`tel:${cafe.contact}`} className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      {cafe.contact}
                    </a>
                  </div>
                </div>

                {/* Dining Options */}
                <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:col-span-2">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Dining Options</p>
                    <div className="flex flex-wrap gap-2">
                      {cafe.diningOptions.map(option => (
                        <span key={option} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xs sm:text-sm font-semibold">
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Website */}
                {cafe.website && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Website</p>
                      <a href={cafe.website} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline font-medium break-all">
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}

                {/* Facebook */}
                {cafe.facebook && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Facebook</p>
                      <a href={cafe.facebook} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        Follow on Facebook
                      </a>
                    </div>
                  </div>
                )}

                {/* Google Maps */}
                {cafe.mapLink && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <MapPinIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location on Map</p>
                      <a href={cafe.mapLink} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                )}

                {/* Menu PDF */}
                {cafe.menuPDF && cafe.menuPDF.url && (
                  <div className="sm:col-span-2">
                    <a
                      href={cafe.menuPDF.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <FileText className="w-5 h-5" />
                      <span className="font-semibold text-sm sm:text-base">View Menu PDF</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">About</h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{cafe.description}</p>
            </div>

            {/* Menu Items Section - Only visible to owner */}
            {user && cafe.userId && (user.id === cafe.userId._id || user._id === cafe.userId._id || user.id === cafe.userId || user._id === cafe.userId) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                  <UtensilsCrossed className="w-6 h-6 mr-2" />
                  Top Menu Items
                </h2>

                {/* Banner for adding items */}
                {(!cafe.menuItems || cafe.menuItems.length < 10) && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          🎉 Add Your Menu Items for FREE!
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          You can add {10 - (cafe.menuItems?.length || 0)} more {10 - (cafe.menuItems?.length || 0) === 1 ? 'item' : 'items'} for free.
                        </p>
                      </div>
                      {!showMenuItemForm && (
                        <button
                          onClick={() => setShowMenuItemForm(true)}
                          className="ml-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-semibold flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Item</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Banner when all 10 items are added */}
                {cafe.menuItems && cafe.menuItems.length >= 10 && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      ✅ All 10 Free Slots Used!
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                      Want to add more items? Purchase advertisement slots on our Foods & Beverages page.
                    </p>
                    <button
                      onClick={() => navigate('/foods-beverages')}
                      className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all text-sm font-semibold"
                    >
                      Browse Foods & Beverages
                    </button>
                  </div>
                )}

                {/* Add/Edit Menu Item Form */}
                {showMenuItemForm && (
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {editingItemId ? 'Edit Menu Item' : 'Add Menu Item'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowMenuItemForm(false);
                          setMenuItemForm({ itemName: '', category: '', price: '', image: null });
                          setMenuItemError('');
                          setEditingItemId(null);
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {menuItemError && (
                      <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">{menuItemError}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmitMenuItem} className="space-y-3">
                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Item Image *
                        </label>
                        {menuItemForm.image ? (
                          <div className="relative">
                            <img
                              src={menuItemForm.image.url}
                              alt="Menu item"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setMenuItemForm(prev => ({ ...prev, image: null }))}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMenuItemImageUpload}
                              className="hidden"
                              disabled={uploadingMenuItem}
                            />
                          </label>
                        )}
                      </div>

                      {/* Item Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Item Name *
                        </label>
                        <input
                          type="text"
                          value={menuItemForm.itemName}
                          onChange={(e) => setMenuItemForm(prev => ({ ...prev, itemName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                          placeholder="e.g., Chicken Kottu"
                          maxLength={100}
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Short Description *
                        </label>
                        <input
                          type="text"
                          value={menuItemForm.category}
                          onChange={(e) => setMenuItemForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                          placeholder="Explain Shortly How is that.."
                          maxLength={50}
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Price (LKR) *
                        </label>
                        <input
                          type="number"
                          value={menuItemForm.price}
                          onChange={(e) => setMenuItemForm(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                          placeholder="e.g., 850"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={uploadingMenuItem}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {uploadingMenuItem ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>{editingItemId ? 'Updating...' : 'Adding...'}</span>
                          </>
                        ) : (
                          <span>{editingItemId ? 'Update Menu Item' : 'Add Menu Item'}</span>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Display Menu Items - Visible to everyone if items exist */}
            {cafe.menuItems && cafe.menuItems.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <UtensilsCrossed className="w-6 h-6 mr-2" />
                  Our Top Menu
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cafe.menuItems.map((item, idx) => (
                    <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img
                          src={item.image.url}
                          alt={item.itemName}
                          className="w-full h-40 object-cover"
                        />
                        {/* Edit and Delete buttons - Only visible to owner */}
                        {user && cafe.userId && (user.id === cafe.userId._id || user._id === cafe.userId._id || user.id === cafe.userId || user._id === cafe.userId) && (
                          <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                              onClick={() => handleEditMenuItem(item)}
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                              title="Edit item"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item._id)}
                              disabled={deletingItemId === item._id}
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete item"
                            >
                              {deletingItemId === item._id ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.itemName}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{item.category}</p>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">LKR {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Reviews */}
          <div className="space-y-4 sm:space-y-6">
            {/* Review Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Leave a Review</h2>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= reviewForm.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, reviewText: e.target.value }))}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Share your experience..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submittingReview || !user}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {submittingReview ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>{user ? 'Submit Review' : 'Login to Review'}</span>
                  )}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                Reviews ({cafe.totalReviews || 0})
              </h2>

              {cafe.reviews && cafe.reviews.length > 0 ? (
                <div className="space-y-4">
                  {cafe.reviews.map((review, idx) => (
                    <div key={idx} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{review.userName}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {review.reviewText && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mt-2">{review.reviewText}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Star className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success!"
        message="Your review has been submitted successfully!"
        redirectText="Close"
      />
    </div>
  );
};

export default CafesRestaurantsDetail;

