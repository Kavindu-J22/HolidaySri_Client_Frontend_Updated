import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO/SEO';
import {
  MapPin, Star, Eye, Filter, X, ChevronLeft, ChevronRight,
  Loader, AlertCircle, Building2, Sparkles, FileText, Users,
  Check, XCircle, ArrowLeft, Search, TrendingUp, DoorOpen, Bed,
  Copy, CheckCircle2, Calendar, Home, Tag
} from 'lucide-react';

// Client Booking Card Component
const ClientBookingCard = ({ booking, onUpdate }) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [note, setNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const copyBookingId = () => {
    navigator.clipboard.writeText(booking.bookingId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

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
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-5 border-b border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white break-words">{booking.hotelName}</h3>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{booking.roomName}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono break-all">{booking.bookingId}</span>
                <button
                  onClick={copyBookingId}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  title="Copy Booking ID"
                >
                  {copiedId ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold self-start whitespace-nowrap shadow-sm ${
              booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700' :
              booking.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-700'
            }`}>
              {booking.status}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6">
          {/* Customer Details */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-5 rounded-lg mb-4 border border-gray-200 dark:border-gray-600">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Customer Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400 mb-1">Name</span>
                <span className="text-gray-900 dark:text-white font-semibold break-words">{booking.customerName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400 mb-1">Email</span>
                <span className="text-gray-900 dark:text-white font-semibold break-all">{booking.customerEmail}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400 mb-1">Contact</span>
                <span className="text-gray-900 dark:text-white font-semibold">{booking.customerContactNumber}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400 mb-1">NIC/Passport</span>
                <span className="text-gray-900 dark:text-white font-semibold break-all">{booking.customerNicOrPassport}</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 text-sm">Room Information</h5>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Room Type:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{booking.roomType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Package:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{booking.selectedPackage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Check-in:</span>
                  <span className="text-gray-900 dark:text-white font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h5 className="font-semibold text-purple-900 dark:text-purple-300 mb-3 text-sm">Booking Details</h5>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Days:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{booking.numberOfDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rooms:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{booking.numberOfRooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Persons:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{booking.numberOfAdults} adults, {booking.numberOfChildren} children</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-5 rounded-lg border border-green-200 dark:border-green-800 mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Amount:</span>
                  <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">LKR {booking.totalAmount.toLocaleString()}</span>
                </div>
                {booking.discountedAmount > 0 && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">After Discount:</span>
                    <span className="text-base sm:text-lg font-semibold text-green-600 dark:text-green-400">LKR {booking.discountedAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Final Amount:</span>
                  <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">LKR {booking.finalAmount.toLocaleString()}</span>
                </div>
              </div>
              {booking.promocodeUsed && (
                <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-2 rounded-lg border border-purple-300 dark:border-purple-700 self-start sm:self-auto">
                  <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Promocode Applied</p>
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-300">{booking.promocodeUsed}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {booking.status === 'Pending' && (
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={() => setShowApproveModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <Check className="w-5 h-5" />
                <span>Approve Booking</span>
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <XCircle className="w-5 h-5" />
                <span>Reject Booking</span>
              </button>
            </div>
          )}

          {/* Owner Note */}
          {booking.ownerNote && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-300 mb-2">Your Note:</p>
              <p className="text-sm text-gray-900 dark:text-white">{booking.ownerNote}</p>
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

  // Get destination info from URL params
  const fromDestination = searchParams.get('fromDestination') || '';
  const destinationName = searchParams.get('destinationName') || '';
  const cityFromUrl = searchParams.get('city') || '';
  const tabFromUrl = searchParams.get('tab') || 'browse';

  // Tab state - initialize from URL parameter
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Booking state
  const [myBookings, setMyBookings] = useState([]);
  const [clientRequests, setClientRequests] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [isHotelOwner, setIsHotelOwner] = useState(false);

  // My Bookings filters and UI state
  const [myBookingsStatusFilter, setMyBookingsStatusFilter] = useState('all');
  const [copiedBookingId, setCopiedBookingId] = useState(null);

  // Client Requests search
  const [clientRequestsSearch, setClientRequestsSearch] = useState('');

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

  // Update active tab when URL parameter changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

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
    <>
      <SEO
        title="Hotels & Accommodations in Sri Lanka | Book Hotels, Resorts & Stays - Holidaysri"
        description="Find and book the best hotels, resorts, and accommodations in Sri Lanka. Browse luxury hotels, budget stays, beach resorts, and boutique accommodations across Sri Lanka."
        keywords="Sri Lanka hotels, hotels in Sri Lanka, Sri Lanka accommodations, book hotels Sri Lanka, Sri Lanka resorts, beach hotels Sri Lanka, luxury hotels, budget hotels, boutique hotels"
        canonical="https://www.holidaysri.com/ads/tourism/hotels-accommodations"
      />
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
                      <span>Details & Booking</span>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white px-1">My Booking Requests</h2>

              {/* Status Filter */}
              <div className="flex items-center gap-2 px-1">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={myBookingsStatusFilter}
                  onChange={(e) => setMyBookingsStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {loadingBookings ? (
              <div className="flex justify-center items-center py-8 sm:py-12">
                <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
              </div>
            ) : (() => {
              const filteredMyBookings = myBookingsStatusFilter === 'all'
                ? myBookings
                : myBookings.filter(b => b.status === myBookingsStatusFilter);

              return filteredMyBookings.length > 0 ? (
                <>
                  <div className="mb-3 px-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredMyBookings.length}</span> of {myBookings.length} booking{myBookings.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {filteredMyBookings.map((booking) => (
                  <div key={booking._id} className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-5 border-b border-gray-200 dark:border-gray-600">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-2">
                            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white break-words">{booking.hotelName}</h3>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono break-all">{booking.bookingId}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(booking.bookingId);
                                setCopiedBookingId(booking.bookingId);
                                setTimeout(() => setCopiedBookingId(null), 2000);
                              }}
                              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                              title="Copy Booking ID"
                            >
                              {copiedBookingId === booking.bookingId ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold self-start whitespace-nowrap shadow-sm ${
                          booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700' :
                          booking.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                      {/* Booking Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 text-sm">Room Information</h5>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Room:</span>
                              <span className="text-gray-900 dark:text-white font-medium break-words text-right">{booking.roomName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Type:</span>
                              <span className="text-gray-900 dark:text-white font-medium">{booking.roomType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Package:</span>
                              <span className="text-gray-900 dark:text-white font-medium">{booking.selectedPackage}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                          <h5 className="font-semibold text-purple-900 dark:text-purple-300 mb-3 text-sm">Stay Details</h5>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Check-in:</span>
                              <span className="text-gray-900 dark:text-white font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(booking.checkInDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Days:</span>
                              <span className="text-gray-900 dark:text-white font-medium">{booking.numberOfDays}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Rooms:</span>
                              <span className="text-gray-900 dark:text-white font-medium">{booking.numberOfRooms}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                        <div className="space-y-1">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Amount:</span>
                            <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">LKR {booking.totalAmount.toLocaleString()}</span>
                          </div>
                          {booking.discountedAmount > 0 && (
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">After Discount:</span>
                              <span className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400">LKR {booking.discountedAmount.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex items-baseline justify-between pt-2 border-t border-green-300 dark:border-green-700">
                            <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">Final Amount:</span>
                            <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">LKR {booking.finalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Hotel Note */}
                      {booking.ownerNote && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                          <p className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-300 mb-2">Hotel Note:</p>
                          <p className="text-sm text-gray-900 dark:text-white">{booking.ownerNote}</p>
                        </div>
                      )}
                    </div>
                  </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 sm:py-12 px-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg">
                  <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {myBookingsStatusFilter === 'all' ? 'No booking requests yet' : `No ${myBookingsStatusFilter.toLowerCase()} bookings found`}
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {/* Client's Requests Tab Content */}
        {activeTab === 'client-requests' && isHotelOwner && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white px-1">Client's Booking Requests</h2>

              {/* Search Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search by Booking ID
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={clientRequestsSearch}
                    onChange={(e) => setClientRequestsSearch(e.target.value)}
                    placeholder="Enter booking ID to search..."
                    className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-sm sm:placeholder:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {clientRequestsSearch && (
                    <button
                      onClick={() => setClientRequestsSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {loadingBookings ? (
              <div className="flex justify-center items-center py-8 sm:py-12">
                <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
              </div>
            ) : (() => {
              const filteredClientRequests = clientRequestsSearch.trim()
                ? clientRequests.filter(booking =>
                    booking.bookingId.toLowerCase().includes(clientRequestsSearch.toLowerCase())
                  )
                : clientRequests;

              return filteredClientRequests.length > 0 ? (
                <>
                  <div className="mb-3 px-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {clientRequestsSearch ? (
                        <>
                          Found <span className="font-semibold text-gray-900 dark:text-white">{filteredClientRequests.length}</span> of {clientRequests.length} request{clientRequests.length !== 1 ? 's' : ''} matching "<span className="font-mono">{clientRequestsSearch}</span>"
                        </>
                      ) : (
                        <>
                          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredClientRequests.length}</span> client request{filteredClientRequests.length !== 1 ? 's' : ''}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {filteredClientRequests.map((booking) => (
                      <ClientBookingCard
                        key={booking._id}
                        booking={booking}
                        onUpdate={fetchClientRequests}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 sm:py-12 px-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
                    {clientRequestsSearch ? `No requests found matching "${clientRequestsSearch}"` : 'No client requests yet'}
                  </p>
                  {clientRequestsSearch && (
                    <button
                      onClick={() => setClientRequestsSearch('')}
                      className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default HotelsAccommodationsBrowse;

