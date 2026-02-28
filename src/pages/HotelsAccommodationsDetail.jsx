import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RoomForm from '../components/hotels/RoomForm';
import BookingModal from '../components/hotels/BookingModal';
import {
  MapPin, Phone, Mail, Globe, Facebook, MessageCircle, Star,
  Building2, Utensils, Shield, Activity, Image as ImageIcon,
  ChevronLeft, Loader, AlertCircle, CheckCircle, X, Sparkles,
  MapPinned, Send, Bed, Plus, Edit, Trash2, Info,
  ChevronRight, FileText, Clock, XCircle, RefreshCw, Users,
  Baby, PawPrint, PartyPopper, Cigarette, Wine, Moon, DollarSign,
  CreditCard, Calendar, Ban, AlertTriangle
} from 'lucide-react';

const HotelsAccommodationsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Review state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userReview, setUserReview] = useState(null);

  // Search modal state
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Room state
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    roomName: '',
    type: '',
    capacity: 1,
    beds: '',
    roomDescription: '',
    pricePerNight: 0,
    pricePerFullDay: 0,
    pricing: {
      fullboardPrice: 0,
      fullboardInclude: [],
      halfboardPrice: 0,
      halfboardInclude: []
    },
    isAvailable: true,
    amenities: [],
    images: [],
    noOfRooms: 1,
    roomOpenForAgents: false,
    discountForPromo: 0,
    earnRateForPromo: 0
  });
  const [uploadingRoomImages, setUploadingRoomImages] = useState(false);
  const [selectedRoomImages, setSelectedRoomImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [additionalRoomCharge, setAdditionalRoomCharge] = useState(50);

  // Touch gesture state for image gallery
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Booking state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  // Ref for scrolling to tabs section
  const tabsRef = React.useRef(null);

  // Fetch hotel details
  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/hotels-accommodations/${id}`);
        const data = await response.json();

        if (data.success) {
          setHotel(data.data);
          // Check if user has already reviewed
          const existingReview = data.data.reviews?.find(
            r => r.userId === user?._id
          );
          if (existingReview) {
            setUserReview(existingReview);
            setRating(existingReview.rating);
            setReviewText(existingReview.reviewText || '');
          }
        } else {
          setError('Failed to load hotel details');
        }
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        setError('Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id, user?._id]);

  // Fetch additional room charge configuration
  useEffect(() => {
    const fetchAdditionalRoomCharge = async () => {
      try {
        const response = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/hsc/info');
        const data = await response.json();
        if (data.additionalRoomCharge !== undefined) {
          setAdditionalRoomCharge(data.additionalRoomCharge);
        }
      } catch (error) {
        console.error('Error fetching additional room charge:', error);
        // Keep default value of 50 if fetch fails
      }
    };

    fetchAdditionalRoomCharge();
  }, []);

  // Touch gesture handlers for image gallery
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !selectedRoomImages) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentImageIndex < selectedRoomImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Keyboard navigation for image gallery
  useEffect(() => {
    if (!selectedRoomImages) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      } else if (e.key === 'ArrowRight' && currentImageIndex < selectedRoomImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else if (e.key === 'Escape') {
        setSelectedRoomImages(null);
        setCurrentImageIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRoomImages, currentImageIndex]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedRoomImages) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedRoomImages]);



  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setSubmittingReview(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/hotels-accommodations/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          reviewText
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setHotel(prev => ({
          ...prev,
          averageRating: data.data.averageRating,
          totalReviews: data.data.totalReviews,
          reviews: data.data.reviews
        }));
        setUserReview(data.data.reviews.find(r => r.userId === user._id));
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
        
        // If it's a new review, reset form
        if (!userReview) {
          setReviewText('');
          setRating(0);
        }
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

  // Room functions
  const handleAddRoom = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/hotels-accommodations/${id}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(roomFormData)
      });

      const data = await response.json();

      if (data.success) {
        // Refresh hotel data
        const hotelResponse = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/hotels-accommodations/${id}`);
        const hotelData = await hotelResponse.json();
        if (hotelData.success) {
          setHotel(hotelData.data);
        }

        // Reset form
        setRoomFormData({
          roomName: '',
          type: '',
          capacity: 1,
          beds: '',
          roomDescription: '',
          pricePerNight: 0,
          pricePerFullDay: 0,
          pricing: {
            fullboardPrice: 0,
            fullboardInclude: [],
            halfboardPrice: 0,
            halfboardInclude: []
          },
          isAvailable: true,
          amenities: [],
          images: [],
          noOfRooms: 1,
          roomOpenForAgents: false,
          discountForPromo: 0,
          earnRateForPromo: 0
        });
        setShowAddRoom(false);

        // Show success message with HSC charge info if applicable
        if (data.hscCharged) {
          alert(`Room added successfully! ${data.hscCharged} HSC has been deducted from your balance.`);
          // Refresh user balance
          if (user) {
            const userResponse = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/users/hsc', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            const userData = await userResponse.json();
            if (userData.balance !== undefined) {
              updateUser({ hscBalance: userData.balance });
            }
          }
        } else {
          alert('Room added successfully!');
        }
      } else {
        alert(data.message || 'Failed to add room');
      }
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Failed to add room');
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomFormData({
      roomName: room.roomName,
      type: room.type,
      capacity: room.capacity,
      beds: room.beds,
      roomDescription: room.roomDescription,
      pricePerNight: room.pricePerNight,
      pricePerFullDay: room.pricePerFullDay,
      pricing: room.pricing || {
        fullboardPrice: 0,
        fullboardInclude: [],
        halfboardPrice: 0,
        halfboardInclude: []
      },
      isAvailable: room.isAvailable,
      amenities: room.amenities || [],
      images: room.images || [],
      noOfRooms: room.noOfRooms,
      roomOpenForAgents: room.roomOpenForAgents || false,
      discountForPromo: room.discountForPromo || 0,
      earnRateForPromo: room.earnRateForPromo || 0
    });
    setShowAddRoom(true);
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/hotels-accommodations/${id}/rooms/${editingRoom._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(roomFormData)
      });

      const data = await response.json();

      if (data.success) {
        // Refresh hotel data
        const hotelResponse = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/hotels-accommodations/${id}`);
        const hotelData = await hotelResponse.json();
        if (hotelData.success) {
          setHotel(hotelData.data);
        }

        // Reset form
        setRoomFormData({
          roomName: '',
          type: '',
          capacity: 1,
          beds: '',
          roomDescription: '',
          pricePerNight: 0,
          pricePerFullDay: 0,
          pricing: {
            fullboardPrice: 0,
            fullboardInclude: [],
            halfboardPrice: 0,
            halfboardInclude: []
          },
          isAvailable: true,
          amenities: [],
          images: [],
          noOfRooms: 1,
          roomOpenForAgents: false,
          discountForPromo: 0,
          earnRateForPromo: 0
        });
        setEditingRoom(null);
        setShowAddRoom(false);
        alert('Room updated successfully!');
      } else {
        alert(data.message || 'Failed to update room');
      }
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/hotels-accommodations/${id}/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Refresh hotel data
        const hotelResponse = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/hotels-accommodations/${id}`);
        const hotelData = await hotelResponse.json();
        if (hotelData.success) {
          setHotel(hotelData.data);
        }
        alert('Room deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room');
    }
  };

  // Render star rating
  const renderStars = (value, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type={interactive ? 'button' : 'div'}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            disabled={!interactive}
            className={`transition-colors ${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            }`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= (interactive ? hoverRating || rating : value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (error && !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/hotels-accommodations')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  if (!hotel) return null;

  // Check if user is the owner - handle both populated and non-populated userId
  let isOwner = false;
  let hotelOwnerId = null;
  let currentUserId = null;

  if (user && hotel.userId) {
    // Get current user ID (backend returns 'id', not '_id')
    currentUserId = user.id || user._id;

    // Extract the actual ID from userId (could be object or string)
    if (typeof hotel.userId === 'object' && hotel.userId !== null) {
      hotelOwnerId = hotel.userId._id || hotel.userId.id;
    } else {
      hotelOwnerId = hotel.userId;
    }

    // Compare IDs (convert to string for comparison)
    isOwner = String(currentUserId) === String(hotelOwnerId);
  }

  // Calculate available room slots
  const roomsAdded = (hotel.rooms && Array.isArray(hotel.rooms)) ? hotel.rooms.length : 0;
  const roomsAvailable = 3 - roomsAdded;

  // Define tabs - removed booking tabs (now in browse page)
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'facilities', label: 'Facilities', icon: Shield },
    { id: 'dining', label: 'Dining', icon: Utensils },
    { id: 'policies', label: 'Policies', icon: Shield },
    { id: 'rooms', label: 'Rooms', icon: Bed },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'images', label: 'Gallery', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ];

  // Comprehensive Debug logging
  console.log('═══════════════════════════════════════');
  console.log('🔍 OWNER CHECK DEBUG');
  console.log('═══════════════════════════════════════');
  console.log('User Object:', user);
  console.log('User ID (user.id):', user?.id);
  console.log('User ID (user._id):', user?._id);
  console.log('Current User ID (extracted):', currentUserId);
  console.log('User ID Type:', typeof currentUserId);
  console.log('───────────────────────────────────────');
  console.log('Hotel User ID (raw):', hotel.userId);
  console.log('Hotel User ID Type:', typeof hotel.userId);
  console.log('Hotel User ID._id:', hotel.userId?._id);
  console.log('Hotel User ID.id:', hotel.userId?.id);
  console.log('Extracted Hotel Owner ID:', hotelOwnerId);
  console.log('───────────────────────────────────────');
  console.log('String Comparison:');
  console.log('  User ID (string):', String(currentUserId));
  console.log('  Owner ID (string):', String(hotelOwnerId));
  console.log('  Are Equal?:', String(currentUserId) === String(hotelOwnerId));
  console.log('───────────────────────────────────────');
  console.log('IS OWNER:', isOwner);
  console.log('Rooms Added:', roomsAdded);
  console.log('Rooms Available:', roomsAvailable);
  console.log('Rooms Array:', hotel.rooms);
  console.log('───────────────────────────────────────');
  console.log('Alert Banner Conditions:');
  console.log('  isOwner:', isOwner);
  console.log('  roomsAvailable > 0:', roomsAvailable > 0);
  console.log('  Should Show Banner:', isOwner && roomsAvailable > 0);
  console.log('═══════════════════════════════════════');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/hotels-accommodations')}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Hotels
        </button>



        {/* Room Alert for Owner - Mobile Responsive */}
        {isOwner && (
          <div className={`mb-6 rounded-xl shadow-lg p-4 sm:p-6 text-white ${
            roomsAvailable > 0
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
              : 'bg-gradient-to-r from-orange-500 to-red-600'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Info className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold mb-1">
                    {roomsAvailable > 0
                      ? (roomsAvailable === 3 ? 'Add Your Rooms!' : `${roomsAvailable} Room${roomsAvailable > 1 ? 's' : ''} Available!`)
                      : 'Add More Rooms'
                    }
                  </h3>
                  <p className={`text-xs sm:text-sm ${roomsAvailable > 0 ? 'text-blue-100' : 'text-orange-100'}`}>
                    {roomsAvailable > 0
                      ? (roomsAvailable === 3
                        ? 'You can add up to 3 rooms for free to showcase your accommodation options.'
                        : `You have ${roomsAvailable} more room${roomsAvailable > 1 ? 's' : ''} available to add for free.`)
                      : `Additional rooms cost ${additionalRoomCharge} HSC each. Your current balance: ${user?.hscBalance || 0} HSC`
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('rooms');
                  setShowAddRoom(true);
                  // Scroll to tabs section after a short delay
                  setTimeout(() => {
                    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors font-semibold text-sm sm:text-base whitespace-nowrap w-full sm:w-auto ${
                  roomsAvailable > 0
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-white text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Add Room {roomsAvailable === 0 && `(${additionalRoomCharge} HSC)`}</span>
                <span className="xs:hidden">Add Room</span>
              </button>
            </div>
          </div>
        )}

        {/* Header Card - Mobile Responsive */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Hero Image Slider */}
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-200 dark:bg-gray-700 overflow-hidden">
            {hotel.images && hotel.images.length > 0 ? (
              <img
                key={heroImageIndex}
                src={hotel.images[heroImageIndex].url}
                alt={`${hotel.hotelName} - ${heroImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Building2 className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-400" />
              </div>
            )}

            {/* Gradient overlay — non-interactive */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Prev / Next arrows — only when multiple images */}
            {hotel.images && hotel.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setHeroImageIndex(prev => (prev === 0 ? hotel.images.length - 1 : prev - 1))}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/55 hover:bg-black/80 active:scale-95 text-white rounded-full p-2 sm:p-2.5 transition-all duration-150 shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setHeroImageIndex(prev => (prev === hotel.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/55 hover:bg-black/80 active:scale-95 text-white rounded-full p-2 sm:p-2.5 transition-all duration-150 shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Counter */}
                <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 bg-black/60 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full pointer-events-none">
                  {heroImageIndex + 1} / {hotel.images.length}
                </div>

                {/* Dot indicators */}
                <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2 pointer-events-none">
                  {hotel.images.map((_, i) => (
                    <span
                      key={i}
                      className={`block w-2 h-2 rounded-full transition-all duration-200 ${
                        i === heroImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Badges - Mobile Responsive */}
            <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-20 flex flex-col gap-1.5 sm:gap-2 pointer-events-none">
              <div className="bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                {hotel.category}
              </div>
              {hotel.isHaveStars && hotel.howManyStars && (
                <div className="bg-yellow-500 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-1.5 md:gap-2 shadow-lg">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  <span className="hidden xs:inline">{hotel.howManyStars} Star Hotel</span>
                  <span className="xs:hidden">{hotel.howManyStars}★</span>
                </div>
              )}
              {hotel.isVerified && (
                <div className="bg-green-600 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-1.5 md:gap-2 shadow-lg">
                  <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  <span className="hidden xs:inline">Verified</span>
                  <span className="xs:hidden">✓</span>
                </div>
              )}
            </div>
          </div>

          {/* Hotel Info - Mobile Responsive */}
          <div className="p-4 sm:p-5 md:p-6 lg:p-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
              {hotel.hotelName}
            </h1>

            {/* Rating - Mobile Responsive */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="flex items-center">
                {renderStars(Math.round(hotel.averageRating || 0))}
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {(hotel.averageRating || 0).toFixed(1)}
              </span>
              <span className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                ({hotel.totalReviews || 0} {hotel.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Location - Mobile Responsive */}
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm md:text-base break-words">
                {hotel.location.address}, {hotel.location.city}, {hotel.location.province}
              </span>
            </div>

            {/* Climate & Book Now Button - Mobile Responsive */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4">
              {hotel.climate && (
                <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium">
                  {hotel.climate}
                </div>
              )}

              {/* Book Room Now Button - Only show if hotel has rooms */}
              {hotel.rooms && hotel.rooms.length > 0 && (
                <button
                  onClick={() => {
                    setActiveTab('rooms');
                    // Scroll to tabs section after a short delay
                    setTimeout(() => {
                      tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className="w-full xs:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Book Room Now</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs - Mobile Responsive - Icons Only on Mobile, Full Names on Desktop */}
        <div ref={tabsRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 scroll-mt-4">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
            {/* Mobile: Icons only, Desktop: Full names */}
            <div className="flex w-full">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-1.5 md:gap-2 px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium transition-all whitespace-nowrap text-xs sm:text-sm md:text-base flex-shrink-0 min-w-0 ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                    {/* Show full label on desktop (md and up), hide on mobile */}
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content - Mobile Responsive Padding */}
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Overview Tab - Professional Design */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* About Section with Icon */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-4 md:p-6 border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg">
                      <Info className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">About This Property</h2>
                  </div>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {hotel.description}
                  </p>
                </div>

                {/* Contact Information - Professional Cards */}
                <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-600 dark:bg-green-500 rounded-lg">
                      <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Contact Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {hotel.contactInfo.email && (
                      <div className="group flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg group-hover:scale-110 transition-transform">
                          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Email Address</p>
                          <a href={`mailto:${hotel.contactInfo.email}`} className="text-sm md:text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium break-all">
                            {hotel.contactInfo.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.contactInfo.contactNumber && (
                      <div className="group flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg group-hover:scale-110 transition-transform">
                          <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Phone Number</p>
                          <a href={`tel:${hotel.contactInfo.contactNumber}`} className="text-sm md:text-base text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 font-medium">
                            {hotel.contactInfo.contactNumber}
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.contactInfo.whatsappNumber && (
                      <div className="group flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg group-hover:scale-110 transition-transform">
                          <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">WhatsApp</p>
                          <a href={`https://wa.me/${hotel.contactInfo.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm md:text-base text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 font-medium">
                            {hotel.contactInfo.whatsappNumber}
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.contactInfo.websiteUrl && (
                      <div className="group flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg group-hover:scale-110 transition-transform">
                          <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Website</p>
                          <a href={hotel.contactInfo.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm md:text-base text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 font-medium truncate block">
                            {hotel.contactInfo.websiteUrl}
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.contactInfo.facebookUrl && (
                      <div className="group flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg group-hover:scale-110 transition-transform">
                          <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Facebook</p>
                          <a href={hotel.contactInfo.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-sm md:text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium truncate block">
                            Facebook Page
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.location.mapUrl && (
                      <div className="group flex items-start gap-3 p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200 dark:border-red-800 hover:shadow-md transition-all">
                        <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg group-hover:scale-110 transition-transform">
                          <MapPinned className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Location</p>
                          <a href={hotel.location.mapUrl} target="_blank" rel="noopener noreferrer" className="text-sm md:text-base text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 font-medium">
                            View on Map
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Details - Professional Design */}
                {hotel.location && (
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-600 dark:bg-red-500 rounded-lg">
                        <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Location Details</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {hotel.location.address && (
                        <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-slate-700/50 rounded-lg border border-gray-200 dark:border-gray-600 sm:col-span-2">
                          <div className="flex items-start gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5" />
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Full Address</p>
                          </div>
                          <p className="text-sm md:text-base text-gray-900 dark:text-white font-medium ml-6">{hotel.location.address}</p>
                        </div>
                      )}
                      {hotel.location.city && (
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">City</p>
                          </div>
                          <p className="text-sm md:text-base text-gray-900 dark:text-white font-medium">{hotel.location.city}</p>
                        </div>
                      )}
                      {hotel.location.province && (
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPinned className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Province</p>
                          </div>
                          <p className="text-sm md:text-base text-gray-900 dark:text-white font-medium">{hotel.location.province}</p>
                        </div>
                      )}
                      {hotel.climate && (
                        <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800 sm:col-span-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Climate Zone</p>
                          </div>
                          <p className="text-sm md:text-base text-gray-900 dark:text-white font-medium">{hotel.climate}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Other Info */}
                {hotel.otherInfo && hotel.otherInfo.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Additional Information</h3>
                    <ul className="space-y-2">
                      {hotel.otherInfo.map((info, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{info}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Facilities Tab - Professional Design */}
            {activeTab === 'facilities' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Facilities & Amenities</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                  {hotel.facilities?.internet && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Internet</span>
                    </div>
                  )}
                  {hotel.facilities?.parking && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Parking</span>
                    </div>
                  )}
                  {hotel.facilities?.bbqFacilities && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">BBQ Facilities</span>
                    </div>
                  )}
                  {hotel.facilities?.Weddinghall && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Wedding Hall</span>
                    </div>
                  )}
                  {hotel.facilities?.chef && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Chef</span>
                    </div>
                  )}
                  {hotel.facilities?.cctv && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">CCTV</span>
                    </div>
                  )}
                  {hotel.facilities?.swimmingPool && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Swimming Pool</span>
                    </div>
                  )}
                  {hotel.facilities?.gym && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Gym</span>
                    </div>
                  )}
                  {hotel.facilities?.spa && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Spa</span>
                    </div>
                  )}
                  {hotel.facilities?.kidsPlayArea && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Kids Play Area</span>
                    </div>
                  )}
                  {hotel.facilities?.roomService && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Room Service</span>
                    </div>
                  )}
                  {hotel.facilities?.restaurant && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Restaurant</span>
                    </div>
                  )}
                  {hotel.facilities?.laundryService && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Laundry Service</span>
                    </div>
                  )}
                  {hotel.facilities?.airportShuttle && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Airport Shuttle</span>
                    </div>
                  )}
                  {hotel.facilities?.petFriendly && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Pet Friendly</span>
                    </div>
                  )}
                  {hotel.facilities?.smokingArea && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Smoking Area</span>
                    </div>
                  )}
                  {hotel.facilities?.garden && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Garden</span>
                    </div>
                  )}
                  {hotel.facilities?.library && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Library</span>
                    </div>
                  )}
                  {hotel.facilities?.gameRoom && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Game Room</span>
                    </div>
                  )}
                  {hotel.facilities?.conferenceRoom && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Conference Room</span>
                    </div>
                  )}
                  {hotel.facilities?.banquetHall && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Banquet Hall</span>
                    </div>
                  )}
                  {hotel.facilities?.yogaDeck && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Yoga Deck</span>
                    </div>
                  )}
                  {hotel.facilities?.privateBeach && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Private Beach</span>
                    </div>
                  )}
                  {hotel.facilities?.sauna && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Sauna</span>
                    </div>
                  )}
                  {hotel.facilities?.bar && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Bar</span>
                    </div>
                  )}
                  {hotel.facilities?.wheelchairAccess && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Wheelchair Access</span>
                    </div>
                  )}
                  {hotel.facilities?.electricVehicleCharging && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">EV Charging</span>
                    </div>
                  )}
                  {hotel.facilities?.firepit && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Firepit</span>
                    </div>
                  )}
                  {hotel.facilities?.hikingTrails && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Hiking Trails</span>
                    </div>
                  )}
                  {hotel.facilities?.bikeRental && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Bike Rental</span>
                    </div>
                  )}
                  {hotel.facilities?.rooftopTerrace && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Rooftop Terrace</span>
                    </div>
                  )}
                  {hotel.facilities?.wineCellar && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Wine Cellar</span>
                    </div>
                  )}
                  {hotel.facilities?.movieTheater && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Movie Theater</span>
                    </div>
                  )}
                  {hotel.facilities?.coworkingSpace && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Coworking Space</span>
                    </div>
                  )}
                  {hotel.facilities?.picnicArea && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Picnic Area</span>
                    </div>
                  )}
                  {hotel.facilities?.fishingPond && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Fishing Pond</span>
                    </div>
                  )}
                  {hotel.facilities?.tennisCourt && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Tennis Court</span>
                    </div>
                  )}
                  {hotel.facilities?.golfCourse && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Golf Course</span>
                    </div>
                  )}
                  {hotel.facilities?.skiStorage && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Ski Storage</span>
                    </div>
                  )}
                  {hotel.facilities?.babysittingService && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Babysitting Service</span>
                    </div>
                  )}
                  {hotel.facilities?.meditationRoom && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Meditation Room</span>
                    </div>
                  )}
                  {hotel.facilities?.rooftopPool && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Rooftop Pool</span>
                    </div>
                  )}
                  {hotel.facilities?.artGallery && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Art Gallery</span>
                    </div>
                  )}
                  {hotel.facilities?.farmToTableDining && (
                    <div className="flex flex-col items-center gap-2 p-2 xs:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-center text-gray-900 dark:text-white font-medium">Farm-to-Table Dining</span>
                    </div>
                  )}
                  {hotel.facilities?.outdoorJacuzzi && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Outdoor Jacuzzi</span>
                    </div>
                  )}
                  {hotel.facilities?.birdWatchingArea && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Bird Watching Area</span>
                    </div>
                  )}
                  {hotel.facilities?.EVChargingStation && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">EV Charging Station</span>
                    </div>
                  )}
                  {hotel.facilities?.rooftopBar && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Rooftop Bar</span>
                    </div>
                  )}
                  {hotel.facilities?.karaokeRoom && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Karaoke Room</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dining Tab - Professional Design */}
            {activeTab === 'dining' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-600 dark:bg-orange-500 rounded-lg">
                    <Utensils className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Dining Options</h2>
                </div>

                {hotel.diningOptions && (
                  <div className="space-y-4">
                    {/* Breakfast Information - Professional Card */}
                    {hotel.diningOptions.breakfastIncluded !== undefined && (
                      <div className={`p-4 md:p-6 rounded-xl border shadow-sm ${
                        hotel.diningOptions.breakfastIncluded
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
                          : 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            hotel.diningOptions.breakfastIncluded
                              ? 'bg-green-100 dark:bg-green-900/50'
                              : 'bg-orange-100 dark:bg-orange-900/50'
                          }`}>
                            <Utensils className={`w-5 h-5 md:w-6 md:h-6 ${
                              hotel.diningOptions.breakfastIncluded
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-orange-600 dark:text-orange-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                              Breakfast
                              {hotel.diningOptions.breakfastIncluded && (
                                <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">Included</span>
                              )}
                            </h3>
                            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-2">
                              {hotel.diningOptions.breakfastIncluded ? 'Complimentary breakfast included with your stay' : 'Breakfast available for purchase'}
                            </p>
                            {hotel.diningOptions.breakfastInfo && (
                              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 italic">{hotel.diningOptions.breakfastInfo}</p>
                            )}
                            {!hotel.diningOptions.breakfastIncluded && hotel.diningOptions.breakfastCharge && (
                              <div className="flex items-center gap-2 mt-2">
                                <DollarSign className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                <p className="text-sm md:text-base text-gray-900 dark:text-white font-bold">
                                  LKR {hotel.diningOptions.breakfastCharge.toLocaleString()} <span className="text-xs font-normal text-gray-600 dark:text-gray-400">per person</span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Restaurant Information - Professional Card */}
                    {hotel.diningOptions.restaurantOnSite && (
                      <div className="p-4 md:p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                            <Building2 className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                              On-site Restaurant
                              <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </h3>
                            {hotel.diningOptions.restaurantInfo && (
                              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">{hotel.diningOptions.restaurantInfo}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Menu PDF - Professional Card */}
                    {hotel.diningOptions.menuPDF?.url && (
                      <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                              <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1">Restaurant Menu</h3>
                              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">View our complete dining menu</p>
                            </div>
                          </div>
                          <a
                            href={hotel.diningOptions.menuPDF.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm md:text-base font-medium"
                          >
                            <FileText className="w-4 h-4 md:w-5 md:h-5" />
                            View Menu (PDF)
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Function & Event Spaces - Professional Design */}
                {hotel.functionOptions && (
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-pink-600 dark:bg-pink-500 rounded-lg">
                        <PartyPopper className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Function & Event Spaces</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {hotel.functionOptions.weddingHall && (
                        <div className="group p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg border border-pink-200 dark:border-pink-800 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-100 dark:bg-pink-900/50 rounded-lg group-hover:scale-110 transition-transform">
                              <CheckCircle className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                            </div>
                            <p className="text-sm md:text-base text-gray-900 dark:text-white font-semibold">Wedding Hall</p>
                          </div>
                        </div>
                      )}
                      {hotel.functionOptions.conferenceHall && (
                        <div className="group p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg group-hover:scale-110 transition-transform">
                              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-sm md:text-base text-gray-900 dark:text-white font-semibold">Conference Hall</p>
                          </div>
                        </div>
                      )}
                      {hotel.functionOptions.banquetFacility && (
                        <div className="group p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg group-hover:scale-110 transition-transform">
                              <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="text-sm md:text-base text-gray-900 dark:text-white font-semibold">Banquet Facility</p>
                          </div>
                        </div>
                      )}
                      {hotel.functionOptions.meetingRooms && (
                        <div className="group p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg border border-teal-200 dark:border-teal-800 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-lg group-hover:scale-110 transition-transform">
                              <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <p className="text-sm md:text-base text-gray-900 dark:text-white font-semibold">Meeting Rooms</p>
                          </div>
                        </div>
                      )}
                      {hotel.functionOptions.eventSpace && (
                        <div className="group p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg group-hover:scale-110 transition-transform">
                              <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <p className="text-sm md:text-base text-gray-900 dark:text-white font-semibold">Event Space</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Packages PDF - Mobile Responsive & Professional */}
                    {hotel.functionOptions.packagesPDF?.url && (
                      <div className="mt-4 sm:mt-6">
                        <a
                          href={hotel.functionOptions.packagesPDF.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm sm:text-base font-semibold w-full sm:w-auto"
                        >
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>View Event Packages (PDF)</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Policies Tab - Professional Design */}
            {activeTab === 'policies' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Hotel Policies</h2>
                </div>

                {hotel.policies ? (
                  <div className="space-y-6">
                    {/* Check-in/out Times - Featured Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 md:p-6 border border-blue-200 dark:border-blue-800">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Check-in & Check-out
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {hotel.policies.checkInTime && (
                          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Check-in Time</p>
                              <p className="text-sm md:text-base text-gray-900 dark:text-white font-semibold">{hotel.policies.checkInTime}</p>
                            </div>
                          </div>
                        )}
                        {hotel.policies.checkOutTime && (
                          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                              <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Check-out Time</p>
                              <p className="text-sm md:text-base text-gray-900 dark:text-white font-semibold">{hotel.policies.checkOutTime}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking & Cancellation Policies */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        Booking & Cancellation
                      </h3>
                      <div className="space-y-4">
                        {hotel.policies.cancellationPolicy && (
                          <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border-l-4 border-red-500">
                            <Ban className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Cancellation Policy</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{hotel.policies.cancellationPolicy}</p>
                            </div>
                          </div>
                        )}

                        {hotel.policies.refundPolicy && (
                          <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border-l-4 border-green-500">
                            <RefreshCw className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Refund Policy</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{hotel.policies.refundPolicy}</p>
                            </div>
                          </div>
                        )}

                        {hotel.policies.noShowPolicy && (
                          <div className="flex gap-3 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border-l-4 border-orange-500">
                            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No-Show Policy</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{hotel.policies.noShowPolicy}</p>
                            </div>
                          </div>
                        )}

                        {/* Early Check-in & Late Check-out */}
                        {(hotel.policies.earlyCheckInPolicy || hotel.policies.lateCheckOutPolicy) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            {hotel.policies.earlyCheckInPolicy && (
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                                <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">Early Check-in</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300">{hotel.policies.earlyCheckInPolicy}</p>
                              </div>
                            )}
                            {hotel.policies.lateCheckOutPolicy && (
                              <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                                <p className="text-xs font-semibold text-purple-900 dark:text-purple-300 mb-1">Late Check-out</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300">{hotel.policies.lateCheckOutPolicy}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Guest Policies */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Guest Policies
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {hotel.policies.childPolicy && (
                          <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-lg border border-pink-200 dark:border-pink-800">
                            <div className="flex items-center gap-2 mb-2">
                              <Baby className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">Child Policy</p>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300">{hotel.policies.childPolicy}</p>
                          </div>
                        )}

                        {hotel.policies.ageRestriction && hotel.policies.minimumCheckInAge && (
                          <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">Minimum Age</p>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300">{hotel.policies.minimumCheckInAge} years</p>
                          </div>
                        )}

                        {hotel.policies.pets !== undefined && (
                          <div className={`p-4 rounded-lg border ${hotel.policies.pets ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800' : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 border-red-200 dark:border-red-800'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <PawPrint className={`w-5 h-5 ${hotel.policies.pets ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">Pets</p>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                              {hotel.policies.pets ? 'Allowed' : 'Not Allowed'}
                              {hotel.policies.petPolicyDetails && <span className="block mt-1">{hotel.policies.petPolicyDetails}</span>}
                            </p>
                          </div>
                        )}

                        {hotel.policies.parties !== undefined && (
                          <div className={`p-4 rounded-lg border ${hotel.policies.parties ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200 dark:border-purple-800' : 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/10 dark:to-slate-900/10 border-gray-200 dark:border-gray-700'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <PartyPopper className={`w-5 h-5 ${hotel.policies.parties ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`} />
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">Events/Parties</p>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                              {hotel.policies.parties ? 'Allowed' : 'Not Allowed'}
                              {hotel.policies.partyPolicyDetails && <span className="block mt-1">{hotel.policies.partyPolicyDetails}</span>}
                            </p>
                          </div>
                        )}

                        {hotel.policies.allowsSmoking !== undefined && (
                          <div className={`p-4 rounded-lg border ${hotel.policies.allowsSmoking ? 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border-gray-300 dark:border-gray-600' : 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 border-green-200 dark:border-green-800'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Cigarette className={`w-5 h-5 ${hotel.policies.allowsSmoking ? 'text-gray-600 dark:text-gray-400' : 'text-green-600 dark:text-green-400'}`} />
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">Smoking</p>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300">{hotel.policies.allowsSmoking ? 'Allowed' : 'Not Allowed'}</p>
                          </div>
                        )}

                        {hotel.policies.allowsLiquor !== undefined && (
                          <div className={`p-4 rounded-lg border ${hotel.policies.allowsLiquor ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 border-amber-200 dark:border-amber-800' : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 border-red-200 dark:border-red-800'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Wine className={`w-5 h-5 ${hotel.policies.allowsLiquor ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`} />
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">Liquor</p>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300">{hotel.policies.allowsLiquor ? 'Allowed' : 'Not Allowed'}</p>
                          </div>
                        )}

                        {hotel.policies.quietHours && (
                          <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-lg border border-indigo-200 dark:border-indigo-800 sm:col-span-2">
                            <div className="flex items-center gap-2 mb-2">
                              <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">Quiet Hours</p>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300">{hotel.policies.quietHours}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment & Charges */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                        Payment & Charges
                      </h3>
                      <div className="space-y-4">
                        {hotel.policies.damageDeposit && hotel.policies.damageDepositAmount && (
                          <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Damage Deposit</p>
                              <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">LKR {hotel.policies.damageDepositAmount.toLocaleString()}</p>
                            </div>
                          </div>
                        )}

                        {hotel.policies.taxAndCharges && hotel.policies.taxAndChargesAmount && (
                          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                            <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Tax & Service Charges</p>
                              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{hotel.policies.taxAndChargesAmount}%</p>
                            </div>
                          </div>
                        )}

                        {hotel.policies.additionalCharges && (
                          <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                            <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Additional Charges</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{hotel.policies.additionalCharges}</p>
                            </div>
                          </div>
                        )}

                        {hotel.policies.acceptedPaymentMethods && hotel.policies.acceptedPaymentMethods.length > 0 && (
                          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-2 mb-3">
                              <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">Accepted Payment Methods</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {hotel.policies.acceptedPaymentMethods.map((method, index) => (
                                <span key={index} className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs font-medium shadow-sm">
                                  {method}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No policies information available</p>
                )}
              </div>
            )}

            {/* Rooms Tab - Mobile Responsive */}
            {activeTab === 'rooms' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Available Rooms</h2>
                  {isOwner && !showAddRoom && (
                    <button
                      onClick={() => {
                        setEditingRoom(null);
                        setShowAddRoom(true);
                        // Scroll to top of tabs section
                        setTimeout(() => {
                          tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-sm md:text-base font-medium shadow-md w-full sm:w-auto ${
                        roomsAvailable > 0
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-orange-600 text-white hover:bg-orange-700'
                      }`}
                    >
                      <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="whitespace-nowrap">Add Room {roomsAvailable === 0 && `(${additionalRoomCharge} HSC)`}</span>
                    </button>
                  )}
                </div>

                {/* Add/Edit Room Form */}
                {showAddRoom && isOwner && (
                  <RoomForm
                    formData={roomFormData}
                    setFormData={setRoomFormData}
                    onSubmit={editingRoom ? handleUpdateRoom : handleAddRoom}
                    onCancel={() => {
                      setShowAddRoom(false);
                      setEditingRoom(null);
                      setRoomFormData({
                        roomName: '',
                        type: '',
                        capacity: 1,
                        beds: '',
                        roomDescription: '',
                        pricePerNight: 0,
                        pricePerFullDay: 0,
                        pricing: {
                          fullboardPrice: 0,
                          fullboardInclude: [],
                          halfboardPrice: 0,
                          halfboardInclude: []
                        },
                        isAvailable: true,
                        amenities: [],
                        images: [],
                        noOfRooms: 1,
                        roomOpenForAgents: false,
                        discountForPromo: 0,
                        earnRateForPromo: 0
                      });
                    }}
                    isEditing={!!editingRoom}
                    uploading={uploadingRoomImages}
                  />
                )}

                {/* Rooms List - Mobile Responsive */}
                {hotel.rooms && hotel.rooms.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {hotel.rooms.map((room, index) => (
                      <div key={room._id || index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-4">
                          {/* Room Images - Mobile Responsive */}
                          <div className="lg:col-span-1">
                            {room.images && room.images.length > 0 ? (
                              <div
                                className="relative h-48 sm:h-56 md:h-64 lg:h-full min-h-[200px] cursor-pointer group"
                                onClick={() => {
                                  setSelectedRoomImages(room.images);
                                  setCurrentImageIndex(0);
                                }}
                              >
                                <img
                                  src={room.images[0].url}
                                  alt={room.roomName}
                                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                                />
                                {room.images.length > 1 && (
                                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium">
                                    <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                                    {room.images.length} photos
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Click to view gallery</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-48 sm:h-56 md:h-64 lg:h-full min-h-[200px] bg-gray-200 dark:bg-gray-700">
                                <Bed className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Room Details - Mobile Responsive */}
                          <div className="lg:col-span-2 p-4 sm:p-5 md:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                                  {room.roomName}
                                </h3>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                  <span className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm font-medium">
                                    {room.type}
                                  </span>
                                  <span className="px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs sm:text-sm font-medium">
                                    {room.capacity} Persons
                                  </span>
                                  <span className="px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-xs sm:text-sm font-medium">
                                    {room.beds}
                                  </span>
                                  {room.isAvailable ? (
                                    <span className="px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs sm:text-sm font-medium">
                                      Available
                                    </span>
                                  ) : (
                                    <span className="px-2 sm:px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-xs sm:text-sm font-medium">
                                      Not Available
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isOwner && (
                                <div className="flex gap-2 self-start">
                                  <button
                                    onClick={() => handleEditRoom(room)}
                                    className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    title="Edit Room"
                                  >
                                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRoom(room._id)}
                                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Delete Room"
                                  >
                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-3">
                              {room.roomDescription}
                            </p>

                            {/* Pricing - Mobile Responsive */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Per Night</p>
                                <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                                  LKR {room.pricePerNight.toLocaleString()}
                                </p>
                              </div>
                              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Per Full Day</p>
                                <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                                  LKR {room.pricePerFullDay.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Board Options - Mobile Responsive */}
                            {(room.pricing?.fullboardPrice > 0 || room.pricing?.halfboardPrice > 0) && (
                              <div className="mb-3 sm:mb-4">
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2">Board Options</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                  {room.pricing.fullboardPrice > 0 && (
                                    <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                      <p className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-200">
                                        Full Board - LKR {room.pricing.fullboardPrice.toLocaleString()}
                                      </p>
                                      {room.pricing.fullboardInclude && room.pricing.fullboardInclude.length > 0 && (
                                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                          Includes: {room.pricing.fullboardInclude.join(', ')}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                  {room.pricing.halfboardPrice > 0 && (
                                    <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                      <p className="text-xs sm:text-sm font-medium text-green-900 dark:text-green-200">
                                        Half Board - LKR {room.pricing.halfboardPrice.toLocaleString()}
                                      </p>
                                      {room.pricing.halfboardInclude && room.pricing.halfboardInclude.length > 0 && (
                                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                          Includes: {room.pricing.halfboardInclude.join(', ')}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Amenities - Mobile Responsive */}
                            {room.amenities && room.amenities.length > 0 && (
                              <div className="mb-3 sm:mb-4">
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2">Amenities</h4>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                  {room.amenities.map((amenity, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                                      {amenity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Additional Info & Book Now - Mobile Responsive */}
                            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3">
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                {room.noOfRooms} {room.noOfRooms === 1 ? 'room' : 'rooms'} of this type available
                              </p>
                              <button
                                onClick={() => {
                                  setSelectedRoomForBooking(room);
                                  setShowBookingModal(true);
                                }}
                                className="w-full xs:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                              >
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Book Now</span>
                              </button>
                            </div>

                            {/* Agent Promo Badge */}
                            {room.roomOpenForAgents && (
                              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
                                <div className="flex items-start gap-2 mb-2">
                                  <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                                      Available through Holidaysri Agents
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-1.5 text-yellow-800 dark:text-yellow-300">
                                        <span className="font-medium">Customer Discount:</span>
                                        <span className="font-bold">LKR {room.discountForPromo?.toLocaleString() || 0}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-yellow-800 dark:text-yellow-300">
                                        <span className="font-medium">Agent Earning:</span>
                                        <span className="font-bold">LKR {room.earnRateForPromo?.toLocaleString() || 0}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {isOwner ? 'No rooms added yet. Add your first room to get started!' : 'No rooms available at the moment.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Activities Tab - Professional Design */}
            {activeTab === 'activities' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Activities & Attractions</h2>
                </div>

                {hotel.activities?.onsiteActivities && hotel.activities.onsiteActivities.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-5 md:p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                      <span>On-site Activities</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                      {hotel.activities.onsiteActivities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 xs:p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-all">
                          <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <span className="text-xs xs:text-sm text-gray-900 dark:text-white font-medium">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hotel.activities?.nearbyAttractions && hotel.activities.nearbyAttractions.length > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-5 md:p-6 rounded-xl border border-green-200 dark:border-green-800">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <MapPinned className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                      <span>Nearby Attractions</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                      {hotel.activities.nearbyAttractions.map((attraction, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedAttraction(attraction);
                            setShowSearchModal(true);
                          }}
                          className="flex items-center justify-between gap-2 p-2 xs:p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <MapPin className="w-3 h-3 xs:w-4 xs:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span className="text-xs xs:text-sm text-gray-900 dark:text-white font-medium truncate">{attraction}</span>
                          </div>
                          <ChevronLeft className="w-3 h-3 xs:w-4 xs:h-4 text-green-600 dark:text-green-400 flex-shrink-0 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {hotel.activities?.nearbyActivities && hotel.activities.nearbyActivities.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 sm:p-5 md:p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                      <span>Nearby Activities</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                      {hotel.activities.nearbyActivities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 xs:p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-all">
                          <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                          <span className="text-xs xs:text-sm text-gray-900 dark:text-white font-medium">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!hotel.activities ||
                  (!hotel.activities.onsiteActivities?.length &&
                   !hotel.activities.nearbyAttractions?.length &&
                   !hotel.activities.nearbyActivities?.length)) && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">No activities information available</p>
                  </div>
                )}
              </div>
            )}

            {/* Images Tab - Mobile Responsive */}
            {activeTab === 'images' && (
              <div className="space-y-6 md:space-y-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">Gallery</h2>

                  {/* Hotel Images */}
                  {hotel.images && hotel.images.length > 0 ? (
                    <>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3">Hotel Images</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                        {hotel.images.map((image, index) => (
                          <div
                            key={`hotel-${index}`}
                            className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer"
                            onClick={() => {
                              setSelectedRoomImages(hotel.images);
                              setCurrentImageIndex(index);
                            }}
                          >
                            <img
                              src={image.url}
                              alt={`${hotel.hotelName} - Image ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    Click to view
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* Image Number Badge */}
                            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                              {index + 1} / {hotel.images.length}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}

                  {/* Room Images */}
                  {hotel.rooms && hotel.rooms.length > 0 && hotel.rooms.some(room => room.images && room.images.length > 0) ? (
                    <>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3">Room Images</h3>
                      <div className="space-y-4 md:space-y-6">
                        {hotel.rooms.map((room, roomIndex) => (
                          room.images && room.images.length > 0 && (
                            <div key={`room-${roomIndex}`}>
                              <h4 className="text-sm md:text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                                {room.roomName} ({room.type})
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                {room.images.map((image, imageIndex) => (
                                  <div
                                    key={`room-${roomIndex}-img-${imageIndex}`}
                                    className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer"
                                    onClick={() => {
                                      setSelectedRoomImages(room.images);
                                      setCurrentImageIndex(imageIndex);
                                    }}
                                  >
                                    <img
                                      src={image.url}
                                      alt={`${room.roomName} - Image ${imageIndex + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg">
                                          <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" />
                                            Click to view
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Image Number Badge */}
                                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                                      {imageIndex + 1} / {room.images.length}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </>
                  ) : null}

                  {/* No Images Message */}
                  {(!hotel.images || hotel.images.length === 0) &&
                   (!hotel.rooms || hotel.rooms.length === 0 || !hotel.rooms.some(room => room.images && room.images.length > 0)) && (
                    <p className="text-gray-600 dark:text-gray-400">No images available</p>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab - Mobile Responsive */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Reviews & Ratings</h2>

                {/* Overall Rating - Mobile Responsive */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-5 md:p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                        {(hotel.averageRating || 0).toFixed(1)}
                      </div>
                      <div className="flex justify-center">
                        {renderStars(Math.round(hotel.averageRating || 0))}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {hotel.totalReviews || 0} {hotel.totalReviews === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add Review Form - Mobile Responsive */}
                {user ? (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                      {userReview ? 'Update Your Review' : 'Write a Review'}
                    </h3>
                    <form onSubmit={handleSubmitReview} className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Rating *
                        </label>
                        <div className="flex justify-start">
                          {renderStars(rating, true)}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Review (Optional)
                        </label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          rows="4"
                          maxLength="1000"
                          placeholder="Share your experience..."
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {reviewText.length}/1000 characters
                        </p>
                      </div>

                      {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2 sm:p-3">
                          <p className="text-red-800 dark:text-red-200 text-xs sm:text-sm">{error}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submittingReview || rating === 0}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm sm:text-base font-semibold"
                      >
                        {submittingReview ? (
                          <>
                            <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>{userReview ? 'Update Review' : 'Submit Review'}</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4">
                    <p className="text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm">
                      Please <button onClick={() => navigate('/login')} className="underline font-medium">login</button> to write a review
                    </p>
                  </div>
                )}

                {/* Reviews List - Mobile Responsive */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">All Reviews</h3>

                  {hotel.reviews && hotel.reviews.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {hotel.reviews.map((review, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-3 mb-2 xs:mb-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{review.userName}</p>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          {review.reviewText && (
                            <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{review.reviewText}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center py-4">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Room Image Gallery Modal - Enhanced Mobile Responsive */}
        {selectedRoomImages && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-0 sm:p-4"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button - Mobile Responsive */}
              <button
                onClick={() => {
                  setSelectedRoomImages(null);
                  setCurrentImageIndex(0);
                }}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 bg-black/50 sm:bg-white/10 hover:bg-black/70 sm:hover:bg-white/20 rounded-full text-white transition-colors z-20"
                aria-label="Close gallery"
              >
                <X className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>

              {/* Image Counter - Mobile Responsive */}
              <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/70 backdrop-blur-sm text-white rounded-full text-xs sm:text-sm font-medium z-20">
                {currentImageIndex + 1} / {selectedRoomImages.length}
              </div>

              {/* Previous Button - Enhanced for Mobile */}
              {selectedRoomImages.length > 1 && (
                <button
                  onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentImageIndex === 0}
                  className={`absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 rounded-full text-white transition-all duration-200 z-20 active:scale-95 ${
                    currentImageIndex === 0
                      ? 'bg-black/30 cursor-not-allowed opacity-50'
                      : 'bg-black/50 hover:bg-black/70 sm:bg-white/10 sm:hover:bg-white/20'
                  }`}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              )}

              {/* Image - Mobile Optimized */}
              <div className="w-full h-full flex flex-col items-center justify-center px-12 sm:px-16 py-16 sm:py-20">
                <img
                  src={selectedRoomImages[currentImageIndex].url}
                  alt={`Room image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain select-none"
                  draggable={false}
                />
              </div>

              {/* Next Button - Enhanced for Mobile */}
              {selectedRoomImages.length > 1 && (
                <button
                  onClick={() => setCurrentImageIndex(prev => Math.min(selectedRoomImages.length - 1, prev + 1))}
                  disabled={currentImageIndex === selectedRoomImages.length - 1}
                  className={`absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 rounded-full text-white transition-all duration-200 z-20 active:scale-95 ${
                    currentImageIndex === selectedRoomImages.length - 1
                      ? 'bg-black/30 cursor-not-allowed opacity-50'
                      : 'bg-black/50 hover:bg-black/70 sm:bg-white/10 sm:hover:bg-white/20'
                  }`}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              )}

              {/* Thumbnail Strip - Mobile Responsive */}
              {selectedRoomImages.length > 1 && (
                <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 z-20">
                  <div className="flex justify-center px-2 sm:px-4">
                    <div className="flex space-x-1.5 sm:space-x-2 bg-black/70 backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl max-w-full overflow-x-auto scrollbar-hide">
                      {selectedRoomImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all duration-200 active:scale-95 ${
                            index === currentImageIndex
                              ? 'border-white shadow-lg scale-105'
                              : 'border-transparent opacity-60 hover:opacity-90'
                          }`}
                          aria-label={`View image ${index + 1}`}
                        >
                          <img
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
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
          </div>
        )}

        {/* Search Modal for Attractions */}
        {showSearchModal && selectedAttraction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Search for "{selectedAttraction}"</h3>
                <button
                  onClick={() => {
                    setShowSearchModal(false);
                    setSelectedAttraction('');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                Choose where you'd like to search for this attraction:
              </p>

              <div className="space-y-3">
                
                <button
                  onClick={() => {
                    navigate(`/explore-locations?search=${encodeURIComponent(selectedAttraction)}`);
                  }}
                  className="w-full flex items-center justify-between gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <MapPinned className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Onsite Search</div>
                      <div className="text-xs text-green-100">Search in our locations</div>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </button>

                <button
                  onClick={() => {
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedAttraction + ' Sri Lanka')}`, '_blank');
                    setShowSearchModal(false);
                    setSelectedAttraction('');
                  }}
                  className="w-full flex items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Google Search</div>
                      <div className="text-xs text-blue-100">Search on Google</div>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </button>

              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Review Submitted!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Thank you for your feedback!
              </p>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedRoomForBooking && hotel && (
          <BookingModal
            isOpen={showBookingModal}
            onClose={() => {
              setShowBookingModal(false);
              setSelectedRoomForBooking(null);
            }}
            room={selectedRoomForBooking}
            hotelName={hotel.hotelName}
            hotelId={hotel._id}
            hotelOwnerId={hotel.userId._id || hotel.userId}
          />
        )}
      </div>
    </div>
  );
};

export default HotelsAccommodationsDetail;
