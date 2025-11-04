import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, Users, Clock, Home, Activity, MessageSquare, DollarSign, CheckCircle, XCircle, Eye } from 'lucide-react';
import api, { userAPI } from '../config/api';

const CustomizeTourPackageForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submit');
  const [loading, setLoading] = useState(false);
  const [hscCharge, setHscCharge] = useState(100);
  const [userBalance, setUserBalance] = useState(0);
  const [myRequests, setMyRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isPartner, setIsPartner] = useState(false);
  const [partnerRequests, setPartnerRequests] = useState([]);
  const [partnerRequestsCount, setPartnerRequestsCount] = useState(0);
  const [expandedRequest, setExpandedRequest] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    startDate: '',
    numberOfTravelers: 1,
    duration: 1,
    accommodation: 'budget',
    accommodationOther: '',
    activities: [],
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});

  const activityOptions = [
    'Wildlife Safari',
    'Beach Activities',
    'Cultural Tours',
    'Adventure Sports',
    'Tea Plantation Visits',
    'Historical Sites',
    'Whale Watching',
    'Hiking & Trekking',
    'Water Sports',
    'Ayurveda & Wellness',
    'Photography Tours',
    'Food & Culinary Tours'
  ];

  useEffect(() => {
    fetchHSCCharge();
    fetchUserBalance();
    checkPartnerStatus();
    if (activeTab === 'my-requests') {
      fetchMyRequests();
    } else if (activeTab === 'partner-requests') {
      fetchPartnerRequests();
      fetchPartnerRequestsCount();
    }
  }, [activeTab]);

  const fetchHSCCharge = async () => {
    try {
      const response = await api.get('/customize-tour-package/charge');
      if (response.data.success) {
        setHscCharge(response.data.charge);
      }
    } catch (error) {
      console.error('Error fetching HSC charge:', error);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await userAPI.getHSCBalance();
      setUserBalance(response.data.balance || 0);

      // Pre-fill user data from profile
      const profileResponse = await userAPI.getProfile();
      const user = profileResponse.data.user; // Backend returns { user: {...} }
      if (activeTab === 'submit') {
        setFormData(prev => ({
          ...prev,
          fullName: user?.name || '',
          email: user?.email || '',
          contactNumber: user?.contactNumber || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  const fetchMyRequests = async () => {
    try {
      setRequestsLoading(true);
      const response = await api.get('/customize-tour-package/my-requests', {
        params: { status: statusFilter !== 'all' ? statusFilter : undefined }
      });
      if (response.data.success) {
        setMyRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setRequestsLoading(false);
    }
  };

  const checkPartnerStatus = async () => {
    try {
      const profileResponse = await userAPI.getProfile();
      const user = profileResponse.data.user; // Backend returns { user: {...} }

      console.log('Partner Status Check:', {
        isPartner: user?.isPartner,
        partnerExpirationDate: user?.partnerExpirationDate,
        expirationValid: user?.partnerExpirationDate ? new Date(user.partnerExpirationDate) > new Date() : false
      });

      // Check if user is a partner with valid expiration
      const isValidPartner = user?.isPartner &&
        user?.partnerExpirationDate &&
        new Date(user.partnerExpirationDate) > new Date();

      setIsPartner(isValidPartner);
      console.log('Is Valid Partner:', isValidPartner);
    } catch (error) {
      console.error('Error checking partner status:', error);
      setIsPartner(false);
    }
  };

  const fetchPartnerRequests = async () => {
    try {
      setRequestsLoading(true);
      const response = await api.get('/customize-tour-package/partner/requests');
      if (response.data.success) {
        setPartnerRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching partner requests:', error);
    } finally {
      setRequestsLoading(false);
    }
  };

  const fetchPartnerRequestsCount = async () => {
    try {
      const response = await api.get('/customize-tour-package/partner/requests/count');
      if (response.data.success) {
        setPartnerRequestsCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching partner requests count:', error);
    }
  };

  const handleApproveRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to approve this request? Your email will be shared with the customer.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(`/customize-tour-package/partner/request/${requestId}/approve`);
      if (response.data.success) {
        alert('Request approved successfully! The customer will be notified with your contact details.');
        fetchPartnerRequests();
        fetchPartnerRequestsCount();
        setExpandedRequest(null);
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert(error.response?.data?.message || 'Failed to approve request');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleActivityToggle = (activity) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (formData.numberOfTravelers < 1) newErrors.numberOfTravelers = 'At least 1 traveler required';
    if (formData.duration < 1) newErrors.duration = 'Duration must be at least 1 day';
    if (formData.accommodation === 'other' && !formData.accommodationOther.trim()) {
      newErrors.accommodationOther = 'Please specify accommodation type';
    }

    // Check if start date is in the future
    const selectedDate = new Date(formData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.startDate = 'Start date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check HSC balance
    if (userBalance < hscCharge) {
      alert(`Insufficient HSC balance. Required: ${hscCharge} HSC, Available: ${userBalance} HSC`);
      return;
    }

    if (!window.confirm(`This will deduct ${hscCharge} HSC from your balance. Continue?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/customize-tour-package/submit', formData);

      if (response.data.success) {
        alert('Your customize tour package request has been submitted successfully!');

        // Reset form
        setFormData({
          fullName: '',
          email: '',
          contactNumber: '',
          startDate: '',
          numberOfTravelers: 1,
          duration: 1,
          accommodation: 'budget',
          accommodationOther: '',
          activities: [],
          specialRequests: ''
        });

        // Refresh balance
        await fetchUserBalance();

        // Switch to my requests tab
        setActiveTab('my-requests');
      } else {
        alert(response.data.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert(error.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-400', icon: Clock },
      'under-review': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-400', icon: Eye },
      'approved': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-400', icon: CheckCircle },
      'rejected': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400', icon: XCircle },
      'show-partners': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-400', icon: Package }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Package className="w-12 h-12 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            CUSTOMIZE YOUR SRI LANKAN ADVENTURE
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tell us your preferences and we'll create the perfect tour package for you
          </p>
          
          {/* HSC Balance & Charge Info */}
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Your Balance: <span className="font-semibold text-blue-600 dark:text-blue-400">{userBalance} HSC</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Request Charge: <span className="font-semibold text-orange-600 dark:text-orange-400">{hscCharge} HSC</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('submit')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'submit'
                  ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Submit Request
            </button>
            <button
              onClick={() => setActiveTab('my-requests')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'my-requests'
                  ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              My Requests
            </button>
            {isPartner && (
              <button
                onClick={() => setActiveTab('partner-requests')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors relative ${
                  activeTab === 'partner-requests'
                    ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Partner Requests
                {partnerRequestsCount > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {partnerRequestsCount}
                  </span>
                )}
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-lg p-6">
          {activeTab === 'submit' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-600" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className={`input-field ${errors.contactNumber ? 'border-red-500' : ''}`}
                      placeholder="Enter any type of contact number"
                    />
                    {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
                  </div>
                </div>
              </div>

              {/* Travel Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Travel Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`input-field ${errors.startDate ? 'border-red-500' : ''}`}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of Travelers *
                    </label>
                    <input
                      type="number"
                      name="numberOfTravelers"
                      value={formData.numberOfTravelers}
                      onChange={handleInputChange}
                      min="1"
                      className={`input-field ${errors.numberOfTravelers ? 'border-red-500' : ''}`}
                    />
                    {errors.numberOfTravelers && <p className="text-red-500 text-sm mt-1">{errors.numberOfTravelers}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (Days) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="1"
                      className={`input-field ${errors.duration ? 'border-red-500' : ''}`}
                    />
                    {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                  </div>
                </div>
              </div>

              {/* Accommodation */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Home className="w-5 h-5 mr-2 text-orange-600" />
                  Accommodation Preference
                </h2>
                <div className="space-y-3">
                  {['budget', 'comfort', 'luxury', 'villas-boutique', 'other'].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="accommodation"
                        value={option}
                        checked={formData.accommodation === option}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-gray-700 dark:text-gray-300 capitalize">
                        {option.replace('-', ' & ')}
                      </span>
                    </label>
                  ))}
                  {formData.accommodation === 'other' && (
                    <input
                      type="text"
                      name="accommodationOther"
                      value={formData.accommodationOther}
                      onChange={handleInputChange}
                      className={`input-field ml-7 ${errors.accommodationOther ? 'border-red-500' : ''}`}
                      placeholder="Please specify accommodation type"
                    />
                  )}
                  {errors.accommodationOther && <p className="text-red-500 text-sm mt-1 ml-7">{errors.accommodationOther}</p>}
                </div>
              </div>

              {/* Activities & Interests */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-orange-600" />
                  Activities & Interests
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {activityOptions.map((activity) => (
                    <label key={activity} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.activities.includes(activity)}
                        onChange={() => handleActivityToggle(activity)}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {activity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-orange-600" />
                  Special Requests / Description
                </h2>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows="4"
                  className="input-field"
                  placeholder="Tell us about any special requirements, dietary restrictions, accessibility needs, or specific places you'd like to visit..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || userBalance < hscCharge}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? 'Submitting...' : `Submit Request (${hscCharge} HSC)`}
                </button>
              </div>

              {userBalance < hscCharge && (
                <p className="text-red-500 text-center text-sm">
                  Insufficient HSC balance. Please purchase more HSC to submit your request.
                </p>
              )}
            </form>
          ) : activeTab === 'my-requests' ? (
            // My Requests Tab
            <div className="space-y-4">
              {/* Filter */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  My Requests
                </h2>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field w-auto"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Requests List */}
              {requestsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                </div>
              ) : myRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No requests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.map((request) => {
                    const statusInfo = getStatusBadge(request.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <div key={request._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {request.numberOfTravelers} Traveler{request.numberOfTravelers > 1 ? 's' : ''} • {request.duration} Day{request.duration > 1 ? 's' : ''}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Starting: {new Date(request.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                            <StatusIcon className="w-4 h-4" />
                            {request.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Accommodation</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                              {request.accommodation === 'other' ? request.accommodationOther : request.accommodation.replace('-', ' ')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">HSC Charge</p>
                            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                              {request.hscCharge} HSC
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Activities</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {request.activities?.length || 0} selected
                            </p>
                          </div>
                        </div>

                        {request.specialRequests && (
                          <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 mb-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Special Requests</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{request.specialRequests}</p>
                          </div>
                        )}

                        {request.adminNote && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Admin Note</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{request.adminNote}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            // Partner Requests Tab
            <div className="space-y-4">
              {/* Header with Count */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Partner Requests
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {partnerRequestsCount} request{partnerRequestsCount !== 1 ? 's' : ''} available for partners
                  </p>
                </div>
              </div>

              {/* Requests List */}
              {requestsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                </div>
              ) : partnerRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No partner requests available at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {partnerRequests.map((request) => {
                    const isExpanded = expandedRequest === request._id;

                    return (
                      <div key={request._id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        {/* Request Header */}
                        <div
                          className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => setExpandedRequest(isExpanded ? null : request._id)}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {request.numberOfTravelers} Traveler{request.numberOfTravelers > 1 ? 's' : ''} • {request.duration} Day{request.duration > 1 ? 's' : ''}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Starting: {new Date(request.startDate).toLocaleDateString()}
                              </p>
                            </div>
                            <button className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                              {isExpanded ? 'Collapse' : 'Expand'} Details
                            </button>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Accommodation</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {request.accommodation === 'other' ? request.accommodationOther : request.accommodation.replace('-', ' ')}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">HSC Charge</p>
                              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                {request.hscCharge} HSC
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Activities</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {request.activities?.length || 0} selected
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 space-y-4">
                            {/* Customer Information */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Users className="w-5 h-5 text-orange-600" />
                                Customer Information
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-gray-800 rounded-lg p-4">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{request.fullName}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{request.email}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Contact Number</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{request.contactNumber}</p>
                                </div>
                              </div>
                            </div>

                            {/* Activities */}
                            {request.activities && request.activities.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                  <Activity className="w-5 h-5 text-orange-600" />
                                  Activities & Interests
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {request.activities.map((activity, index) => (
                                    <span key={index} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 rounded-full text-sm">
                                      {activity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Special Requests */}
                            {request.specialRequests && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                  <MessageSquare className="w-5 h-5 text-orange-600" />
                                  Special Requests
                                </h4>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{request.specialRequests}</p>
                                </div>
                              </div>
                            )}

                            {/* Admin Note */}
                            {request.adminNote && (
                              <div>
                                <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-3 flex items-center gap-2">
                                  <MessageSquare className="w-5 h-5" />
                                  Admin Note
                                </h4>
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                  <p className="text-sm text-blue-900 dark:text-blue-300 whitespace-pre-wrap">{request.adminNote}</p>
                                </div>
                              </div>
                            )}

                            {/* Approve Button */}
                            <div className="pt-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveRequest(request._id);
                                }}
                                disabled={loading}
                                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                              >
                                <CheckCircle className="w-5 h-5" />
                                {loading ? 'Processing...' : 'Approve Request & Share Contact'}
                              </button>
                              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                By approving, your email will be shared with the customer
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizeTourPackageForm;

