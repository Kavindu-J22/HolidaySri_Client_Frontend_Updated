import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  MapPin, Star, Eye, Filter, X, ChevronLeft, ChevronRight,
  Loader, AlertCircle, Building2, Sparkles, FileText, Users,
  Check, XCircle, ArrowLeft, Search, TrendingUp, DoorOpen, Bed
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
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/room-bookings/${booking.bookingId}/approve`, {
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
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/room-bookings/${booking.bookingId}/reject`, {
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{booking.hotelName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Room: {booking.roomName}</p>
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

const HotelsAccommodationsBrowse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1
  });

  // Tab state
  const [activeTab, setActiveTab] = useState('browse');

  // Booking state
  const [myBookings, setMyBookings] = useState([]);
  const [clientRequests, setClientRequests] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [isHotelOwner, setIsHotelOwner] = useState(false);

  // Get destination info from URL params
  const fromDestination = searchParams.get('fromDestination') || '';
  const destinationName = searchParams.get('destinationName') || '';
  const cityFromUrl = searchParams.get('city') || '';

  // Filter state
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    climate: searchParams.get('climate') || '',
    province: searchParams.get('province') || '',
    city: cityFromUrl,
    page: parseInt(searchParams.get('page')) || 1
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Sri Lankan provinces and districts
  const provincesAndDistricts = {
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Northern Province": ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    "Eastern Province": ["Trincomalee", "Batticaloa", "Ampara"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Sabaragamuwa Province": ["Ratnapura", "Kegalle"]
  };

  // Climate options
  const climateOptions = [
    { value: "", label: "All Climates" },
    { value: "Dry Zone - Arid", label: "🌵 Dry Zone - Arid" },
    { value: "Dry Zone - Semi-Arid", label: "🏜️ Dry Zone - Semi-Arid" },
    { value: "Intermediate Zone", label: "🌾 Intermediate Zone" },
    { value: "Wet Zone - Tropical Rainforest", label: "🌴 Wet Zone - Tropical Rainforest" },
    { value: "Wet Zone - Tropical Monsoon", label: "🌧️ Wet Zone - Tropical Monsoon" },
    { value: "Hill Country - Temperate", label: "⛰️ Hill Country - Temperate" },
    { value: "Hill Country - Montane", label: "🏔️ Hill Country - Montane" },
    { value: "Coastal - Tropical", label: "🏖️ Coastal - Tropical" },
    { value: "Coastal - Humid", label: "🌊 Coastal - Humid" }
  ];

  // Category options
  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "Hotels", label: "Hotels" },
    { value: "Apartments", label: "Apartments" },
    { value: "Resorts", label: "Resorts" },
    { value: "Villas", label: "Villas" },
    { value: "Guest Houses", label: "Guest Houses" },
    { value: "Boutique Hotels", label: "Boutique Hotels" },
    { value: "Hostels", label: "Hostels" },
    { value: "Lodges", label: "Lodges" },
    { value: "Bungalows", label: "Bungalows" },
    { value: "Homestays", label: "Homestays" }
  ];

  // Load provinces data
  useEffect(() => {
    setProvincesData(provincesAndDistricts);
  }, []);

  // Fetch hotels
  useEffect(() => {
    if (activeTab === 'browse') {
      const fetchHotels = async () => {
        setLoading(true);
        setError('');

        try {
          const params = new URLSearchParams();
          if (filters.category) params.append('category', filters.category);
          if (filters.climate) params.append('climate', filters.climate);
          if (filters.province) params.append('province', filters.province);
          if (filters.city) params.append('city', filters.city);
          params.append('page', filters.page);
          params.append('limit', 12);

          // Preserve destination parameters
          if (fromDestination) params.append('fromDestination', fromDestination);
          if (destinationName) params.append('destinationName', destinationName);

          const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/hotels-accommodations/browse?${params}`);
          const data = await response.json();

          if (data.success) {
            setHotels(data.data);
            setPagination(data.pagination);
            setSearchParams(params);
          } else {
            setError(data.message || 'Failed to load hotels');
          }
        } catch (error) {
          console.error('Error fetching hotels:', error);
          setError('Failed to load hotels');
        } finally {
          setLoading(false);
        }
      };

      fetchHotels();
    }
  }, [filters, setSearchParams, activeTab]);

  // Check if user is hotel owner by trying to fetch client requests
  useEffect(() => {
    const checkHotelOwner = async () => {
      if (!user) {
        setIsHotelOwner(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/room-bookings/all-client-requests', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setIsHotelOwner(data.data.length > 0 || true); // Set true if they can access the endpoint
        }
      } catch (error) {
        setIsHotelOwner(false);
      }
    };

    checkHotelOwner();
  }, [user]);

  // Fetch my bookings when tab is active
  useEffect(() => {
    if (activeTab === 'my-bookings' && user) {
      fetchMyBookings();
    }
  }, [activeTab, user]);

  // Fetch client requests when tab is active
  useEffect(() => {
    if (activeTab === 'client-requests' && user) {
      fetchClientRequests();
    }
  }, [activeTab, user]);

  // Fetch my bookings
  const fetchMyBookings = async () => {
    setLoadingBookings(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/room-bookings/my-bookings', {
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
      const response = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/room-bookings/all-client-requests', {
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

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filter changes
      ...(name === 'province' && { city: '' }) // Reset city when province changes
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      category: '',
      climate: '',
      province: '',
      city: '',
      page: 1
    });
  };

  const availableCities = filters.province ? provincesData[filters.province] || [] : [];

  // Filter hotels by search query
  const filteredHotels = useMemo(() => {
    if (!searchQuery.trim()) return hotels;

    const query = searchQuery.toLowerCase();
    return hotels.filter(hotel =>
      hotel.hotelName.toLowerCase().includes(query) ||
      hotel.description.toLowerCase().includes(query) ||
      hotel.location.city.toLowerCase().includes(query) ||
      hotel.location.province.toLowerCase().includes(query)
    );
  }, [hotels, searchQuery]);

  // Calculate lowest price from rooms
  const getLowestPrice = (hotel) => {
    if (!hotel.rooms || hotel.rooms.length === 0) return null;

    const prices = [];
    hotel.rooms.forEach(room => {
      if (room.pricePerNight > 0) prices.push(room.pricePerNight);
      if (room.pricePerFullDay > 0) prices.push(room.pricePerFullDay);
      if (room.pricing?.fullboardPrice > 0) prices.push(room.pricing.fullboardPrice);
      if (room.pricing?.halfboardPrice > 0) prices.push(room.pricing.halfboardPrice);
    });

    return prices.length > 0 ? Math.min(...prices) : null;
  };

  // Check if any room is open for agents
  const hasAgentRooms = (hotel) => {
    if (!hotel.rooms || hotel.rooms.length === 0) return false;
    return hotel.rooms.some(room => room.roomOpenForAgents === true);
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading && hotels.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading hotels...</p>
        </div>
      </div>
    );
  }

  // Calculate pending counts
  const myBookingsPendingCount = myBookings.filter(b => b.status === 'Pending').length;
  const clientRequestsPendingCount = clientRequests.filter(b => b.status === 'Pending').length;

  // Define tabs
  const tabs = [
    { id: 'browse', label: 'Browse Hotels', icon: Building2 }
  ];

  if (user) {
    tabs.push({
      id: 'my-bookings',
      label: 'My Booking Requests',
      icon: FileText,
      count: myBookingsPendingCount
    });
  }

  if (isHotelOwner) {
    tabs.push({
      id: 'client-requests',
      label: "Client's Requests",
      icon: Users,
      count: clientRequestsPendingCount
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <Building2 className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="break-words">Hotels & Accommodations{cityFromUrl && ` - ${cityFromUrl}`}</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 ml-0 sm:ml-11 lg:ml-13">
            {fromDestination ? `Discover the perfect place to stay in ${destinationName}` : 'Discover the perfect place to stay in Sri Lanka'}
          </p>
          {fromDestination && (
            <button
              onClick={() => navigate(`/destinations/${fromDestination}`)}
              className="mt-2 ml-0 sm:ml-11 lg:ml-13 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to {destinationName}</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg mb-4 sm:mb-6 lg:mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  {tab.count > 0 && (
                    <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] sm:min-w-[20px] text-center">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters - Only show for browse tab */}
        {activeTab === 'browse' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Filters & Search</span>
              </h2>
              <button
                onClick={handleResetFilters}
                className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Reset All</span>
              </button>
            </div>

          {/* Search Bar */}
          <div className="mb-5 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Hotels
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, description, or location..."
                className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-sm sm:placeholder:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Climate Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Climate
              </label>
              <select
                name="climate"
                value={filters.climate}
                onChange={handleFilterChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {climateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Province Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Province
              </label>
              <select
                name="province"
                value={filters.province}
                onChange={handleFilterChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Provinces</option>
                {Object.keys(provincesData).map(province => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                City
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                disabled={!filters.province}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Cities</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Browse Hotels Tab Content */}
        {activeTab === 'browse' && (
          <>
            {/* Results Count */}
            <div className="mb-3 sm:mb-4 px-1">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {searchQuery ? (
                  <>
                    Found <span className="font-semibold text-gray-900 dark:text-white">{filteredHotels.length}</span> hotels matching "<span className="break-words">{searchQuery}</span>"
                    <span className="text-xs sm:text-sm ml-2">({pagination.total} total)</span>
                  </>
                ) : (
                  <>
                    Found <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> hotels
                  </>
                )}
              </p>
            </div>

            {/* Hotels Grid */}
            {filteredHotels.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredHotels.map(hotel => {
                const lowestPrice = getLowestPrice(hotel);
                const isAgentFriendly = hasAgentRooms(hotel);
                const roomCount = hotel.rooms?.length || 0;

                return (
                <div
                  key={hotel._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700"
                >
                  {/* Image */}
                  <div className="relative h-56 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {hotel.images && hotel.images.length > 0 ? (
                      <img
                        src={hotel.images[0].url}
                        alt={hotel.hotelName}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Building2 className="w-16 h-16 text-gray-400" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      {hotel.category}
                    </div>

                    {/* Star Rating Badge */}
                    {hotel.isHaveStars && hotel.howManyStars && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        {hotel.howManyStars} Star
                      </div>
                    )}

                    {/* Agent Badge */}
                    {isAgentFriendly && (
                      <div className="absolute bottom-3 left-3 bg-green-600 text-white px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                        <DoorOpen className="w-3 h-3" />
                        Open for Agents
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {hotel.hotelName}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{hotel.location.city}, {hotel.location.province}</span>
                    </div>

                    {/* Climate */}
                    {hotel.climate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
                        {hotel.climate}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
                      {hotel.description}
                    </p>

                    {/* Room Info & Price Section */}
                    <div className="mb-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-blue-100 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                          <Bed className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold">{roomCount} {roomCount === 1 ? 'Room Type' : 'Room Types'}</span>
                        </div>
                        {lowestPrice && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">From</span>
                          </div>
                        )}
                      </div>
                      {lowestPrice ? (
                        <div className="text-right">
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            LKR {lowestPrice.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Lowest Price</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Contact for pricing</p>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      {renderStars(Math.round(hotel.averageRating || 0))}
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {(hotel.averageRating || 0).toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({hotel.totalReviews || 0})
                      </span>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/hotels-accommodations/${hotel._id}`)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2">
                {/* Mobile: Page info */}
                <div className="sm:hidden text-sm text-gray-600 dark:text-gray-400">
                  Page {filters.page} of {pagination.pages}
                </div>

                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="p-1.5 sm:p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {[...Array(pagination.pages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    // On mobile, show fewer pages
                    const isMobileView = window.innerWidth < 640;
                    const showPage = isMobileView
                      ? (pageNumber === 1 ||
                         pageNumber === pagination.pages ||
                         pageNumber === filters.page)
                      : (pageNumber === 1 ||
                         pageNumber === pagination.pages ||
                         (pageNumber >= filters.page - 1 && pageNumber <= filters.page + 1));

                    if (showPage) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
                            filters.page === pageNumber
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === filters.page - 2 ||
                      pageNumber === filters.page + 2
                    ) {
                      return <span key={pageNumber} className="px-1 sm:px-2 text-gray-500 text-sm">...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.pages}
                    className="p-1.5 sm:p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
            ) : (
              <div className="text-center py-8 sm:py-12 px-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-2 break-words">
                  {searchQuery ? `No hotels found matching "${searchQuery}"` : 'No hotels found'}
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm px-4">
                  {searchQuery ? 'Try a different search term or adjust your filters.' : 'Try adjusting your filters.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* My Booking Requests Tab Content */}
        {activeTab === 'my-bookings' && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-1">My Booking Requests</h2>

            {loadingBookings ? (
              <div className="flex justify-center items-center py-8 sm:py-12">
                <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
              </div>
            ) : myBookings.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {myBookings.map((booking) => (
                  <div key={booking._id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white break-words">{booking.hotelName}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-all">Booking ID: {booking.bookingId}</p>
                      </div>
                      <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start whitespace-nowrap ${
                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        booking.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
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

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total: <span className="text-lg font-bold text-gray-900 dark:text-white">LKR {booking.totalAmount.toLocaleString()}</span></p>
                      {booking.discountedAmount > 0 && (
                        <p className="text-sm text-green-600 dark:text-green-400">After Discount: LKR {booking.discountedAmount.toLocaleString()}</p>
                      )}
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Final Amount: LKR {booking.finalAmount.toLocaleString()}</p>
                    </div>

                    {booking.ownerNote && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Hotel Note:</p>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">{booking.ownerNote}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 px-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg">
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">No booking requests yet</p>
              </div>
            )}
          </div>
        )}

        {/* Client's Requests Tab Content */}
        {activeTab === 'client-requests' && isHotelOwner && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-1">Client's Booking Requests</h2>

            {loadingBookings ? (
              <div className="flex justify-center items-center py-8 sm:py-12">
                <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
              </div>
            ) : clientRequests.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {clientRequests.map((booking) => (
                  <ClientBookingCard
                    key={booking._id}
                    booking={booking}
                    onUpdate={fetchClientRequests}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 px-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">No client requests yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelsAccommodationsBrowse;

