import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RoomForm from '../components/hotels/RoomForm';
import BookingModal from '../components/hotels/BookingModal';
import {
  MapPin, Phone, Mail, Globe, Facebook, MessageCircle, Star,
  Building2, Utensils, Users, Shield, Activity, Image as ImageIcon,
  ChevronLeft, Loader, AlertCircle, CheckCircle, X, Sparkles,
  FileText, MapPinned, Send, Bed, Plus, Edit, Trash2, Info,
  ChevronRight, Check, XCircle
} from 'lucide-react';

// Client Booking Card Component
const ClientBookingCard = ({ booking, onUpdate }) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [note, setNote] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/room-bookings/${booking.bookingId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note })
      });

      const data = await response.json();
      if (data.success) {
        setShowApproveModal(false);
        setNote('');
        onUpdate();
      } else {
        alert(data.message || 'Failed to approve booking');
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      alert('Failed to approve booking');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/room-bookings/${booking.bookingId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note })
      });

      const data = await response.json();
      if (data.success) {
        setShowRejectModal(false);
        setNote('');
        onUpdate();
      } else {
        alert(data.message || 'Failed to reject booking');
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Failed to reject booking');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{booking.roomName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Booking ID: {booking.bookingId}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
            booking.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {booking.status}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Customer Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">Name: <span className="text-gray-900 dark:text-white font-medium">{booking.customerName}</span></p>
              <p className="text-gray-600 dark:text-gray-400">Email: <span className="text-gray-900 dark:text-white font-medium">{booking.customerEmail}</span></p>
              <p className="text-gray-600 dark:text-gray-400">Contact: <span className="text-gray-900 dark:text-white font-medium">{booking.customerContactNumber}</span></p>
              <p className="text-gray-600 dark:text-gray-400">NIC/Passport: <span className="text-gray-900 dark:text-white font-medium">{booking.customerNicOrPassport}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Room Type: <span className="text-gray-900 dark:text-white font-medium">{booking.roomType}</span></p>
              <p className="text-gray-600 dark:text-gray-400">Package: <span className="text-gray-900 dark:text-white font-medium">{booking.selectedPackage}</span></p>
              <p className="text-gray-600 dark:text-gray-400">Check-in: <span className="text-gray-900 dark:text-white font-medium">{new Date(booking.checkInDate).toLocaleDateString()}</span></p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Days: <span className="text-gray-900 dark:text-white font-medium">{booking.numberOfDays}</span></p>
              <p className="text-gray-600 dark:text-gray-400">Rooms: <span className="text-gray-900 dark:text-white font-medium">{booking.numberOfRooms}</span></p>
              <p className="text-gray-600 dark:text-gray-400">Persons: <span className="text-gray-900 dark:text-white font-medium">{booking.numberOfAdults} adults, {booking.numberOfChildren} children</span></p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total: <span className="text-lg font-bold text-gray-900 dark:text-white">LKR {booking.totalAmount.toLocaleString()}</span></p>
              {booking.discountedAmount > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400">After Discount: LKR {booking.discountedAmount.toLocaleString()}</p>
              )}
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Final Amount: LKR {booking.finalAmount.toLocaleString()}</p>
            </div>
            {booking.promocodeUsed && (
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Promocode</p>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{booking.promocodeUsed}</p>
              </div>
            )}
          </div>

          {booking.status === 'Pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <Check className="w-5 h-5" />
                Approve
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                <XCircle className="w-5 h-5" />
                Reject
              </button>
            </div>
          )}

          {booking.ownerNote && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Your Note:</p>
              <p className="text-sm text-gray-900 dark:text-white mt-1">{booking.ownerNote}</p>
            </div>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Approve Booking</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Add a note for the customer (optional):</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Looking forward to hosting you!"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white mb-4"
              rows="3"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reject Booking</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Please provide a reason for rejection:</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Room not available for selected dates"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white mb-4"
              rows="3"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

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
  const [additionalRoomCharge, setAdditionalRoomCharge] = useState(50);

  // Booking state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [clientRequests, setClientRequests] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Fetch hotel details
  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`/api/hotels-accommodations/${id}`);
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
        const response = await fetch('/api/hsc/info');
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

  // Fetch my bookings when tab is active
  useEffect(() => {
    if (activeTab === 'my-bookings' && user) {
      fetchMyBookings();
    }
  }, [activeTab, user]);

  // Fetch client requests when tab is active
  useEffect(() => {
    if (activeTab === 'client-requests' && hotel) {
      fetchClientRequests();
    }
  }, [activeTab, hotel]);

  // Fetch my bookings
  const fetchMyBookings = async () => {
    setLoadingBookings(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/room-bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMyBookings(data.data);
      }
    } catch (error) {
      console.error('Error fetching my bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Fetch client requests
  const fetchClientRequests = async () => {
    setLoadingBookings(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/room-bookings/client-requests/${hotel._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setClientRequests(data.data);
      }
    } catch (error) {
      console.error('Error fetching client requests:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

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
      const response = await fetch(`/api/hotels-accommodations/${id}/review`, {
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
      const response = await fetch(`/api/hotels-accommodations/${id}/rooms`, {
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
        const hotelResponse = await fetch(`/api/hotels-accommodations/${id}`);
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
            const userResponse = await fetch('/api/users/hsc', {
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
      const response = await fetch(`/api/hotels-accommodations/${id}/rooms/${editingRoom._id}`, {
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
        const hotelResponse = await fetch(`/api/hotels-accommodations/${id}`);
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
      const response = await fetch(`/api/hotels-accommodations/${id}/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Refresh hotel data
        const hotelResponse = await fetch(`/api/hotels-accommodations/${id}`);
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

  // Define tabs based on user role
  const baseTabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'facilities', label: 'Facilities', icon: Shield },
    { id: 'dining', label: 'Dining', icon: Utensils },
    { id: 'policies', label: 'Policies', icon: Shield },
    { id: 'rooms', label: 'Rooms', icon: Bed },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'images', label: 'Gallery', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ];

  // Add booking tabs
  const bookingTabs = [];
  if (user) {
    bookingTabs.push({ id: 'my-bookings', label: 'My Booking Requests', icon: FileText });
  }
  if (isOwner) {
    bookingTabs.push({ id: 'client-requests', label: "Client's Requests", icon: Users });
  }

  const tabs = [...baseTabs, ...bookingTabs];

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



        {/* Room Alert for Owner */}
        {isOwner && (
          <div className={`mb-6 rounded-xl shadow-lg p-6 text-white ${
            roomsAvailable > 0
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
              : 'bg-gradient-to-r from-orange-500 to-red-600'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-1">
                    {roomsAvailable > 0
                      ? (roomsAvailable === 3 ? 'Add Your Rooms!' : `${roomsAvailable} Room${roomsAvailable > 1 ? 's' : ''} Available!`)
                      : 'Add More Rooms'
                    }
                  </h3>
                  <p className={roomsAvailable > 0 ? 'text-blue-100' : 'text-orange-100'}>
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
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold whitespace-nowrap ${
                  roomsAvailable > 0
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-white text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Plus className="w-5 h-5" />
                Add Room {roomsAvailable === 0 && `(${additionalRoomCharge} HSC)`}
              </button>
            </div>
          </div>
        )}

        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Hero Image */}
          <div className="relative h-64 md:h-96 bg-gray-200 dark:bg-gray-700">
            {hotel.images && hotel.images.length > 0 ? (
              <img
                src={hotel.images[0].url}
                alt={hotel.hotelName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Building2 className="w-24 h-24 text-gray-400" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {hotel.category}
              </div>
              {hotel.isHaveStars && hotel.howManyStars && (
                <div className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {hotel.howManyStars} Star Hotel
                </div>
              )}
              {hotel.isVerified && (
                <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </div>
              )}
            </div>
          </div>

          {/* Hotel Info */}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {hotel.hotelName}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              {renderStars(Math.round(hotel.averageRating || 0))}
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {(hotel.averageRating || 0).toFixed(1)}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                ({hotel.totalReviews || 0} {hotel.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
              <MapPin className="w-5 h-5" />
              <span>{hotel.location.address}, {hotel.location.city}, {hotel.location.province}</span>
            </div>

            {/* Climate */}
            {hotel.climate && (
              <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg text-sm mb-4">
                {hotel.climate}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {hotel.description}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotel.contactInfo.email && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                          <a href={`mailto:${hotel.contactInfo.email}`} className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                            {hotel.contactInfo.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.contactInfo.contactNumber && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                          <a href={`tel:${hotel.contactInfo.contactNumber}`} className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                            {hotel.contactInfo.contactNumber}
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.contactInfo.whatsappNumber && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">WhatsApp</p>
                          <a href={`https://wa.me/${hotel.contactInfo.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400">
                            {hotel.contactInfo.whatsappNumber}
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.contactInfo.websiteUrl && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Website</p>
                          <a href={hotel.contactInfo.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block">
                            {hotel.contactInfo.websiteUrl}
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.contactInfo.facebookUrl && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Facebook</p>
                          <a href={hotel.contactInfo.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block">
                            Facebook Page
                          </a>
                        </div>
                      </div>
                    )}

                    {hotel.location.mapUrl && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <MapPinned className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                          <a href={hotel.location.mapUrl} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400">
                            View on Map
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Details */}
                {hotel.location && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotel.location.address && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg md:col-span-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                          <p className="text-gray-900 dark:text-white font-medium">{hotel.location.address}</p>
                        </div>
                      )}
                      {hotel.location.city && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">City</p>
                          <p className="text-gray-900 dark:text-white font-medium">{hotel.location.city}</p>
                        </div>
                      )}
                      {hotel.location.province && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Province</p>
                          <p className="text-gray-900 dark:text-white font-medium">{hotel.location.province}</p>
                        </div>
                      )}
                      {hotel.climate && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg md:col-span-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Climate Zone</p>
                          <p className="text-gray-900 dark:text-white font-medium">{hotel.climate}</p>
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

            {/* Facilities Tab */}
            {activeTab === 'facilities' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Facilities & Amenities</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {hotel.facilities?.internet && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Internet</span>
                    </div>
                  )}
                  {hotel.facilities?.parking && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Parking</span>
                    </div>
                  )}
                  {hotel.facilities?.bbqFacilities && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">BBQ Facilities</span>
                    </div>
                  )}
                  {hotel.facilities?.Weddinghall && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Wedding Hall</span>
                    </div>
                  )}
                  {hotel.facilities?.chef && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Chef</span>
                    </div>
                  )}
                  {hotel.facilities?.cctv && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">CCTV</span>
                    </div>
                  )}
                  {hotel.facilities?.swimmingPool && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Swimming Pool</span>
                    </div>
                  )}
                  {hotel.facilities?.gym && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Gym</span>
                    </div>
                  )}
                  {hotel.facilities?.spa && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Spa</span>
                    </div>
                  )}
                  {hotel.facilities?.kidsPlayArea && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Kids Play Area</span>
                    </div>
                  )}
                  {hotel.facilities?.roomService && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Room Service</span>
                    </div>
                  )}
                  {hotel.facilities?.restaurant && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Restaurant</span>
                    </div>
                  )}
                  {hotel.facilities?.laundryService && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Laundry Service</span>
                    </div>
                  )}
                  {hotel.facilities?.airportShuttle && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Airport Shuttle</span>
                    </div>
                  )}
                  {hotel.facilities?.petFriendly && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Pet Friendly</span>
                    </div>
                  )}
                  {hotel.facilities?.smokingArea && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Smoking Area</span>
                    </div>
                  )}
                  {hotel.facilities?.garden && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Garden</span>
                    </div>
                  )}
                  {hotel.facilities?.library && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Library</span>
                    </div>
                  )}
                  {hotel.facilities?.gameRoom && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Game Room</span>
                    </div>
                  )}
                  {hotel.facilities?.conferenceRoom && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Conference Room</span>
                    </div>
                  )}
                  {hotel.facilities?.banquetHall && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Banquet Hall</span>
                    </div>
                  )}
                  {hotel.facilities?.yogaDeck && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Yoga Deck</span>
                    </div>
                  )}
                  {hotel.facilities?.privateBeach && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Private Beach</span>
                    </div>
                  )}
                  {hotel.facilities?.sauna && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Sauna</span>
                    </div>
                  )}
                  {hotel.facilities?.bar && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Bar</span>
                    </div>
                  )}
                  {hotel.facilities?.wheelchairAccess && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Wheelchair Access</span>
                    </div>
                  )}
                  {hotel.facilities?.electricVehicleCharging && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">EV Charging</span>
                    </div>
                  )}
                  {hotel.facilities?.firepit && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Firepit</span>
                    </div>
                  )}
                  {hotel.facilities?.hikingTrails && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Hiking Trails</span>
                    </div>
                  )}
                  {hotel.facilities?.bikeRental && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Bike Rental</span>
                    </div>
                  )}
                  {hotel.facilities?.rooftopTerrace && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Rooftop Terrace</span>
                    </div>
                  )}
                  {hotel.facilities?.wineCellar && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Wine Cellar</span>
                    </div>
                  )}
                  {hotel.facilities?.movieTheater && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Movie Theater</span>
                    </div>
                  )}
                  {hotel.facilities?.coworkingSpace && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Coworking Space</span>
                    </div>
                  )}
                  {hotel.facilities?.picnicArea && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Picnic Area</span>
                    </div>
                  )}
                  {hotel.facilities?.fishingPond && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Fishing Pond</span>
                    </div>
                  )}
                  {hotel.facilities?.tennisCourt && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Tennis Court</span>
                    </div>
                  )}
                  {hotel.facilities?.golfCourse && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Golf Course</span>
                    </div>
                  )}
                  {hotel.facilities?.skiStorage && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Ski Storage</span>
                    </div>
                  )}
                  {hotel.facilities?.babysittingService && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Babysitting Service</span>
                    </div>
                  )}
                  {hotel.facilities?.meditationRoom && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Meditation Room</span>
                    </div>
                  )}
                  {hotel.facilities?.rooftopPool && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Rooftop Pool</span>
                    </div>
                  )}
                  {hotel.facilities?.artGallery && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Art Gallery</span>
                    </div>
                  )}
                  {hotel.facilities?.farmToTableDining && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Farm-to-Table Dining</span>
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

            {/* Dining Tab */}
            {activeTab === 'dining' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Dining Options</h2>

                {hotel.diningOptions && (
                  <div className="space-y-4">
                    {/* Breakfast Information */}
                    {hotel.diningOptions.breakfastIncluded !== undefined && (
                      <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Breakfast</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {hotel.diningOptions.breakfastIncluded ? 'Breakfast Included' : 'Breakfast Available'}
                        </p>
                        {hotel.diningOptions.breakfastInfo && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{hotel.diningOptions.breakfastInfo}</p>
                        )}
                        {!hotel.diningOptions.breakfastIncluded && hotel.diningOptions.breakfastCharge && (
                          <p className="text-gray-900 dark:text-white font-medium">
                            LKR {hotel.diningOptions.breakfastCharge.toLocaleString()} per person
                          </p>
                        )}
                      </div>
                    )}

                    {/* Restaurant Information */}
                    {hotel.diningOptions.restaurantOnSite && (
                      <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">On-site Restaurant</h3>
                        {hotel.diningOptions.restaurantInfo && (
                          <p className="text-gray-700 dark:text-gray-300">{hotel.diningOptions.restaurantInfo}</p>
                        )}
                      </div>
                    )}

                    {/* Menu PDF */}
                    {hotel.diningOptions.menuPDF?.url && (
                      <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Menu</h3>
                        <a
                          href={hotel.diningOptions.menuPDF.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                          View Menu (PDF)
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Function & Event Spaces */}
                {hotel.functionOptions && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Function & Event Spaces</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotel.functionOptions.weddingHall && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                          <p className="text-gray-900 dark:text-white font-medium">Wedding Hall</p>
                        </div>
                      )}
                      {hotel.functionOptions.conferenceHall && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                          <p className="text-gray-900 dark:text-white font-medium">Conference Hall</p>
                        </div>
                      )}
                      {hotel.functionOptions.banquetFacility && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                          <p className="text-gray-900 dark:text-white font-medium">Banquet Facility</p>
                        </div>
                      )}
                      {hotel.functionOptions.meetingRooms && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                          <p className="text-gray-900 dark:text-white font-medium">Meeting Rooms</p>
                        </div>
                      )}
                      {hotel.functionOptions.eventSpace && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                          <p className="text-gray-900 dark:text-white font-medium">Event Space</p>
                        </div>
                      )}
                    </div>

                    {/* Packages PDF */}
                    {hotel.functionOptions.packagesPDF?.url && (
                      <div className="mt-6">
                        <a
                          href={hotel.functionOptions.packagesPDF.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                          View Event Packages (PDF)
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Policies Tab */}
            {activeTab === 'policies' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Policies</h2>

                {hotel.policies ? (
                  <div className="space-y-4">
                    {/* Check-in/out Times */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotel.policies.checkInTime && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Check-in Time</p>
                          <p className="text-gray-900 dark:text-white font-medium">{hotel.policies.checkInTime}</p>
                        </div>
                      )}
                      {hotel.policies.checkOutTime && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Check-out Time</p>
                          <p className="text-gray-900 dark:text-white font-medium">{hotel.policies.checkOutTime}</p>
                        </div>
                      )}
                    </div>

                    {/* Cancellation Policy */}
                    {hotel.policies.cancellationPolicy && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cancellation Policy</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.cancellationPolicy}</p>
                      </div>
                    )}

                    {/* Refund Policy */}
                    {hotel.policies.refundPolicy && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Refund Policy</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.refundPolicy}</p>
                      </div>
                    )}

                    {/* No Show Policy */}
                    {hotel.policies.noShowPolicy && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">No-Show Policy</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.noShowPolicy}</p>
                      </div>
                    )}

                    {/* Early Check-in & Late Check-out */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotel.policies.earlyCheckInPolicy && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Early Check-in</p>
                          <p className="text-gray-900 dark:text-white text-sm">{hotel.policies.earlyCheckInPolicy}</p>
                        </div>
                      )}
                      {hotel.policies.lateCheckOutPolicy && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Late Check-out</p>
                          <p className="text-gray-900 dark:text-white text-sm">{hotel.policies.lateCheckOutPolicy}</p>
                        </div>
                      )}
                    </div>

                    {/* Child Policy */}
                    {hotel.policies.childPolicy && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Child Policy</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.childPolicy}</p>
                      </div>
                    )}

                    {/* Age Restriction */}
                    {hotel.policies.ageRestriction && hotel.policies.minimumCheckInAge && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Minimum Check-in Age</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.minimumCheckInAge} years</p>
                      </div>
                    )}

                    {/* Pet Policy */}
                    {hotel.policies.pets !== undefined && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pet Policy</p>
                        <p className="text-gray-900 dark:text-white">
                          {hotel.policies.pets ? 'Pets allowed' : 'Pets not allowed'}
                          {hotel.policies.petPolicyDetails && ` - ${hotel.policies.petPolicyDetails}`}
                        </p>
                      </div>
                    )}

                    {/* Party Policy */}
                    {hotel.policies.parties !== undefined && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Party/Events Policy</p>
                        <p className="text-gray-900 dark:text-white">
                          {hotel.policies.parties ? 'Parties/Events allowed' : 'Parties/Events not allowed'}
                          {hotel.policies.partyPolicyDetails && ` - ${hotel.policies.partyPolicyDetails}`}
                        </p>
                      </div>
                    )}

                    {/* Smoking & Liquor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotel.policies.allowsSmoking !== undefined && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Smoking</p>
                          <p className="text-gray-900 dark:text-white">{hotel.policies.allowsSmoking ? 'Allowed' : 'Not Allowed'}</p>
                        </div>
                      )}
                      {hotel.policies.allowsLiquor !== undefined && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Liquor</p>
                          <p className="text-gray-900 dark:text-white">{hotel.policies.allowsLiquor ? 'Allowed' : 'Not Allowed'}</p>
                        </div>
                      )}
                    </div>

                    {/* Quiet Hours */}
                    {hotel.policies.quietHours && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Quiet Hours</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.quietHours}</p>
                      </div>
                    )}

                    {/* Damage Deposit */}
                    {hotel.policies.damageDeposit && hotel.policies.damageDepositAmount && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Damage Deposit</p>
                        <p className="text-gray-900 dark:text-white">LKR {hotel.policies.damageDepositAmount.toLocaleString()}</p>
                      </div>
                    )}

                    {/* Tax and Charges */}
                    {hotel.policies.taxAndCharges && hotel.policies.taxAndChargesAmount && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tax & Service Charges</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.taxAndChargesAmount}%</p>
                      </div>
                    )}

                    {/* Additional Charges */}
                    {hotel.policies.additionalCharges && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Additional Charges</p>
                        <p className="text-gray-900 dark:text-white">{hotel.policies.additionalCharges}</p>
                      </div>
                    )}

                    {/* Payment Methods */}
                    {hotel.policies.acceptedPaymentMethods && hotel.policies.acceptedPaymentMethods.length > 0 && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Accepted Payment Methods</p>
                        <div className="flex flex-wrap gap-2">
                          {hotel.policies.acceptedPaymentMethods.map((method, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No policies information available</p>
                )}
              </div>
            )}

            {/* Rooms Tab */}
            {activeTab === 'rooms' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rooms</h2>
                  {isOwner && !showAddRoom && (
                    <button
                      onClick={() => {
                        setEditingRoom(null);
                        setShowAddRoom(true);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        roomsAvailable > 0
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-orange-600 text-white hover:bg-orange-700'
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                      Add Room {roomsAvailable === 0 && `(${additionalRoomCharge} HSC)`}
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

                {/* Rooms List */}
                {hotel.rooms && hotel.rooms.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {hotel.rooms.map((room, index) => (
                      <div key={room._id || index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Room Images */}
                          <div className="md:col-span-1">
                            {room.images && room.images.length > 0 ? (
                              <div
                                className="relative h-64 md:h-full cursor-pointer group"
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
                                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                                    <ImageIcon className="w-4 h-4 inline mr-1" />
                                    {room.images.length} photos
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Click to view gallery</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-64 md:h-full bg-gray-200 dark:bg-gray-700">
                                <Bed className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Room Details */}
                          <div className="md:col-span-2 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                  {room.roomName}
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                                    {room.type}
                                  </span>
                                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm">
                                    {room.capacity} Persons
                                  </span>
                                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                                    {room.beds}
                                  </span>
                                  {room.isAvailable ? (
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm">
                                      Available
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-sm">
                                      Not Available
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isOwner && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditRoom(room)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                  >
                                    <Edit className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRoom(room._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              {room.roomDescription}
                            </p>

                            {/* Pricing */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Per Night</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                  LKR {room.pricePerNight.toLocaleString()}
                                </p>
                              </div>
                              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Per Full Day</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                  LKR {room.pricePerFullDay.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Board Options */}
                            {(room.pricing?.fullboardPrice > 0 || room.pricing?.halfboardPrice > 0) && (
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Board Options</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {room.pricing.fullboardPrice > 0 && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                      <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
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
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                      <p className="text-sm font-medium text-green-900 dark:text-green-200">
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

                            {/* Amenities */}
                            {room.amenities && room.amenities.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Amenities</h4>
                                <div className="flex flex-wrap gap-2">
                                  {room.amenities.map((amenity, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                                      {amenity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Additional Info */}
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {room.noOfRooms} {room.noOfRooms === 1 ? 'room' : 'rooms'} of this type available
                              </p>
                              <button
                                onClick={() => {
                                  setSelectedRoomForBooking(room);
                                  setShowBookingModal(true);
                                }}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                              >
                                Book Now
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

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Activities & Attractions</h2>

                {hotel.activities?.onsiteActivities && hotel.activities.onsiteActivities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">On-site Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {hotel.activities.onsiteActivities.map((activity, index) => (
                        <span key={index} className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hotel.activities?.nearbyAttractions && hotel.activities.nearbyAttractions.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Nearby Attractions</h3>
                    <div className="flex flex-wrap gap-2">
                      {hotel.activities.nearbyAttractions.map((attraction, index) => (
                        <span key={index} className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
                          {attraction}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hotel.activities?.nearbyActivities && hotel.activities.nearbyActivities.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Nearby Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {hotel.activities.nearbyActivities.map((activity, index) => (
                        <span key={index} className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(!hotel.activities ||
                  (!hotel.activities.onsiteActivities?.length &&
                   !hotel.activities.nearbyAttractions?.length &&
                   !hotel.activities.nearbyActivities?.length)) && (
                  <p className="text-gray-600 dark:text-gray-400">No activities information available</p>
                )}
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Gallery</h2>

                  {/* Hotel Images */}
                  {hotel.images && hotel.images.length > 0 ? (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Hotel Images</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Room Images</h3>
                      <div className="space-y-6">
                        {hotel.rooms.map((room, roomIndex) => (
                          room.images && room.images.length > 0 && (
                            <div key={`room-${roomIndex}`}>
                              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                                {room.roomName} ({room.type})
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reviews & Ratings</h2>

                {/* Overall Rating */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                        {(hotel.averageRating || 0).toFixed(1)}
                      </div>
                      {renderStars(Math.round(hotel.averageRating || 0))}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {hotel.totalReviews || 0} {hotel.totalReviews === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add Review Form */}
                {user ? (
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {userReview ? 'Update Your Review' : 'Write a Review'}
                    </h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Rating *
                        </label>
                        {renderStars(rating, true)}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Review (Optional)
                        </label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          rows="4"
                          maxLength="1000"
                          placeholder="Share your experience..."
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {reviewText.length}/1000 characters
                        </p>
                      </div>

                      {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submittingReview || rating === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingReview ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            {userReview ? 'Update Review' : 'Submit Review'}
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-yellow-800 dark:text-yellow-200">
                      Please <button onClick={() => navigate('/login')} className="underline font-medium">login</button> to write a review
                    </p>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Reviews</h3>

                  {hotel.reviews && hotel.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {hotel.reviews.map((review, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{review.userName}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            {renderStars(review.rating)}
                          </div>
                          {review.reviewText && (
                            <p className="text-gray-700 dark:text-gray-300">{review.reviewText}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>
            )}

            {/* My Booking Requests Tab */}
            {activeTab === 'my-bookings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Booking Requests</h2>

                {loadingBookings ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : myBookings.length > 0 ? (
                  <div className="space-y-4">
                    {myBookings.map((booking) => (
                      <div key={booking._id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{booking.hotelName}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Booking ID: {booking.bookingId}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            booking.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Room: <span className="text-gray-900 dark:text-white font-medium">{booking.roomName}</span></p>
                            <p className="text-gray-600 dark:text-gray-400">Type: <span className="text-gray-900 dark:text-white font-medium">{booking.roomType}</span></p>
                            <p className="text-gray-600 dark:text-gray-400">Package: <span className="text-gray-900 dark:text-white font-medium">{booking.selectedPackage}</span></p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Check-in: <span className="text-gray-900 dark:text-white font-medium">{new Date(booking.checkInDate).toLocaleDateString()}</span></p>
                            <p className="text-gray-600 dark:text-gray-400">Days: <span className="text-gray-900 dark:text-white font-medium">{booking.numberOfDays}</span></p>
                            <p className="text-gray-600 dark:text-gray-400">Rooms: <span className="text-gray-900 dark:text-white font-medium">{booking.numberOfRooms}</span></p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount: <span className="text-lg font-bold text-gray-900 dark:text-white">LKR {booking.totalAmount.toLocaleString()}</span></p>
                              {booking.discountedAmount > 0 && (
                                <p className="text-sm text-green-600 dark:text-green-400">Discounted: LKR {booking.discountedAmount.toLocaleString()}</p>
                              )}
                              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Final Amount: LKR {booking.finalAmount.toLocaleString()}</p>
                            </div>
                            {booking.promocodeUsed && (
                              <div className="text-right">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Promocode Used</p>
                                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{booking.promocodeUsed}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {booking.ownerNote && (
                          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Note from hotel:</p>
                            <p className="text-sm text-gray-900 dark:text-white mt-1">{booking.ownerNote}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No booking requests yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Client's Requests Tab */}
            {activeTab === 'client-requests' && isOwner && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Client's Booking Requests</h2>

                {loadingBookings ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : clientRequests.length > 0 ? (
                  <div className="space-y-4">
                    {clientRequests.map((booking) => (
                      <ClientBookingCard
                        key={booking._id}
                        booking={booking}
                        onUpdate={fetchClientRequests}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No client requests yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Room Image Gallery Modal */}
        {selectedRoomImages && (
          <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedRoomImages(null);
                  setCurrentImageIndex(0);
                }}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Previous Button */}
              {selectedRoomImages.length > 1 && currentImageIndex > 0 && (
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                  className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              )}

              {/* Image */}
              <div className="max-w-6xl max-h-[90vh] flex flex-col items-center">
                <img
                  src={selectedRoomImages[currentImageIndex].url}
                  alt={`Room image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                {/* Image Counter */}
                <div className="mt-4 px-4 py-2 bg-white/10 rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {selectedRoomImages.length}
                </div>
              </div>

              {/* Next Button */}
              {selectedRoomImages.length > 1 && currentImageIndex < selectedRoomImages.length - 1 && (
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                  className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              )}
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
