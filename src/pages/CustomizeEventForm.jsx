import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, CheckCircle, XCircle, Eye, Clock, MessageSquare, Briefcase, Camera, Music, Flower2, Sparkles, Shirt, Wrench } from 'lucide-react';
import { customizeEventRequestAPI, userAPI } from '../config/api';

const CustomizeEventForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submit');
  const [loading, setLoading] = useState(false);
  const [hscCharge, setHscCharge] = useState(100);
  const [userBalance, setUserBalance] = useState(0);
  const [myRequests, setMyRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedRequest, setExpandedRequest] = useState(null);

  // Open Requests state (for partners & members)
  const [openRequests, setOpenRequests] = useState([]);
  const [openRequestsLoading, setOpenRequestsLoading] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [expandedOpenRequest, setExpandedOpenRequest] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    eventType: '',
    eventTypeOther: '',
    numberOfGuests: 1,
    estimatedBudget: '',
    activities: [],
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});

  const eventTypeOptions = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'corporate-party', label: 'Corporate Party' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'conference', label: 'Conference' },
    { value: 'concert', label: 'Concert' },
    { value: 'other', label: 'Other' }
  ];

  const activityOptions = [
    'Catering',
    'Decoration',
    'Photography',
    'Videography',
    'Entertainment',
    'Music & DJ',
    'Venue Setup',
    'Lighting',
    'Sound System',
    'Stage Setup',
    'Guest Management',
    'Transportation'
  ];

  useEffect(() => {
    fetchHSCCharge();
    fetchUserBalance();
    checkPartnerMemberStatus();
    if (activeTab === 'my-requests') {
      fetchMyRequests();
    }
    if (activeTab === 'open-requests') {
      fetchOpenRequests();
    }
  }, [activeTab, statusFilter]);

  const fetchHSCCharge = async () => {
    try {
      const response = await customizeEventRequestAPI.getCharge();
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
      const user = profileResponse.data.user;
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

  const checkPartnerMemberStatus = async () => {
    try {
      const response = await userAPI.getProfile();
      const user = response.data.user;

      // Check if user is a valid partner
      const validPartner = user.isPartner &&
        user.partnerExpirationDate &&
        new Date(user.partnerExpirationDate) > new Date();

      // Check if user is a valid member
      const validMember = user.isMember &&
        user.membershipExpirationDate &&
        new Date(user.membershipExpirationDate) > new Date();

      setIsPartner(validPartner);
      setIsMember(validMember);
    } catch (error) {
      console.error('Error checking partner/member status:', error);
    }
  };

  const fetchMyRequests = async () => {
    try {
      setRequestsLoading(true);
      const response = await customizeEventRequestAPI.getMyRequests({
        status: statusFilter !== 'all' ? statusFilter : undefined
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

  const fetchOpenRequests = async () => {
    try {
      setOpenRequestsLoading(true);
      const response = await customizeEventRequestAPI.getOpenRequests();
      if (response.data.success) {
        setOpenRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching open requests:', error);
      if (error.response?.status === 403) {
        // User is not a partner or member
        setOpenRequests([]);
      }
    } finally {
      setOpenRequestsLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to approve this event request?')) {
      return;
    }

    try {
      const response = await customizeEventRequestAPI.approveRequest(requestId);
      if (response.data.success) {
        alert('Request approved successfully! Request Details sent By mail.');
        fetchOpenRequests(); // Refresh the list
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }

    if (!formData.eventType) {
      newErrors.eventType = 'Event type is required';
    }

    if (formData.eventType === 'other' && !formData.eventTypeOther.trim()) {
      newErrors.eventTypeOther = 'Please specify event type';
    }

    if (!formData.numberOfGuests || formData.numberOfGuests < 1) {
      newErrors.numberOfGuests = 'Number of guests must be at least 1';
    }

    if (!formData.estimatedBudget.trim()) {
      newErrors.estimatedBudget = 'Estimated budget is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (userBalance < hscCharge) {
      alert(`Insufficient HSC balance. Required: ${hscCharge} HSC, Available: ${userBalance} HSC`);
      return;
    }

    try {
      setLoading(true);
      const response = await customizeEventRequestAPI.submitRequest(formData);

      if (response.data.success) {
        alert('Event request submitted successfully!');
        setUserBalance(response.data.newBalance);
        
        // Reset form
        setFormData({
          fullName: formData.fullName,
          email: formData.email,
          contactNumber: formData.contactNumber,
          eventType: '',
          eventTypeOther: '',
          numberOfGuests: 1,
          estimatedBudget: '',
          activities: [],
          specialRequests: ''
        });

        // Switch to my requests tab
        setActiveTab('my-requests');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'under-review': { color: 'bg-blue-100 text-blue-800', icon: Eye },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const getEventTypeLabel = (eventType, eventTypeOther) => {
    if (eventType === 'other' && eventTypeOther) {
      return eventTypeOther;
    }
    const type = eventTypeOptions.find(opt => opt.value === eventType);
    return type ? type.label : eventType;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Customize Your Event
              </h1>
              <p className="text-sm text-gray-600">
                Submit your event customization request and let us help you plan the perfect event
              </p>
            </div>
          </div>
        </div>

        {/* HSC Balance Card */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-sm p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Your HSC Balance</p>
              <p className="text-3xl font-bold">{userBalance} HSC</p>
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm">Request Charge</p>
              <p className="text-2xl font-bold">{hscCharge} HSC</p>
            </div>
          </div>
          {userBalance < hscCharge && (
            <div className="mt-4 bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-3">
              <p className="text-sm flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                Insufficient balance. Please purchase more HSC to submit a request.
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('submit')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'submit'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Submit Request
              </button>
              <button
                onClick={() => setActiveTab('my-requests')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'my-requests'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Requests
              </button>
              {(isPartner || isMember) && (
                <button
                  onClick={() => setActiveTab('open-requests')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'open-requests'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Open Requests {openRequests.length > 0 && `(${openRequests.length})`}
                </button>
              )}
              <button
                onClick={() => setActiveTab('hire-professionals')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'hire-professionals'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Hire Event Professionals
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'submit' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number *
                      </label>
                      <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                          errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your contact number"
                      />
                      {errors.contactNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Type *
                      </label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                          errors.eventType ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select event type</option>
                        {eventTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.eventType && (
                        <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>
                      )}
                    </div>

                    {formData.eventType === 'other' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Specify Event Type *
                        </label>
                        <input
                          type="text"
                          name="eventTypeOther"
                          value={formData.eventTypeOther}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                            errors.eventTypeOther ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter event type"
                        />
                        {errors.eventTypeOther && (
                          <p className="mt-1 text-sm text-red-600">{errors.eventTypeOther}</p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests *
                      </label>
                      <input
                        type="number"
                        name="numberOfGuests"
                        value={formData.numberOfGuests}
                        onChange={handleInputChange}
                        min="1"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                          errors.numberOfGuests ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter number of guests"
                      />
                      {errors.numberOfGuests && (
                        <p className="mt-1 text-sm text-red-600">{errors.numberOfGuests}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Budget (LKR) *
                      </label>
                      <input
                        type="text"
                        name="estimatedBudget"
                        value={formData.estimatedBudget}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                          errors.estimatedBudget ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., LKR 500,000"
                      />
                      {errors.estimatedBudget && (
                        <p className="mt-1 text-sm text-red-600">{errors.estimatedBudget}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Activities & Services</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {activityOptions.map(activity => (
                      <label
                        key={activity}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.activities.includes(activity)}
                          onChange={() => handleActivityToggle(activity)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{activity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Requests</h3>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Any special requirements or additional information..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || userBalance < hscCharge}
                    className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Submit Request ({hscCharge} HSC)
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : activeTab === 'my-requests' ? (
              // My Requests Tab
              <div className="space-y-4">
                {/* Filter */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Filter by status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="under-review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Requests List */}
                {requestsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading requests...</p>
                  </div>
                ) : myRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No requests found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myRequests.map((request) => (
                      <div
                        key={request._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {getEventTypeLabel(request.eventType, request.eventTypeOther)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Submitted on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Guests</p>
                            <p className="text-sm font-medium text-gray-900 flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {request.numberOfGuests}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Budget</p>
                            <p className="text-sm font-medium text-gray-900 flex items-center">
                            
                              {request.estimatedBudget} LKR
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">HSC Charge</p>
                            <p className="text-sm font-medium text-gray-900">
                              {request.hscCharge} HSC
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Payment</p>
                            <p className="text-sm font-medium text-green-600 capitalize">
                              {request.paymentStatus}
                            </p>
                          </div>
                        </div>

                        {request.activities && request.activities.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-2">Activities & Services</p>
                            <div className="flex flex-wrap gap-2">
                              {request.activities.map((activity, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {request.specialRequests && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Special Requests</p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                              {request.specialRequests}
                            </p>
                          </div>
                        )}

                        {request.adminNote && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1 flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Admin Note
                            </p>
                            <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded border border-blue-200">
                              {request.adminNote}
                            </p>
                          </div>
                        )}

                        <button
                          onClick={() => setExpandedRequest(expandedRequest === request._id ? null : request._id)}
                          className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {expandedRequest === request._id ? 'Hide Details' : 'View Details'}
                        </button>

                        {expandedRequest === request._id && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">Full Name</p>
                                <p className="text-sm font-medium text-gray-900">{request.fullName}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-900">{request.email}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Contact Number</p>
                                <p className="text-sm font-medium text-gray-900">{request.contactNumber}</p>
                              </div>
                              {request.processedBy && (
                                <>
                                  <div>
                                    <p className="text-xs text-gray-500">Processed By</p>
                                    <p className="text-sm font-medium text-gray-900">{request.processedBy}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Processed At</p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {new Date(request.processedAt).toLocaleString()}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'open-requests' ? (
              // Open Requests Tab (for Partners & Members)
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900">
                        Open Event Requests
                      </h3>
                      <p className="text-sm text-purple-700 mt-1">
                        {isPartner ? 'Partner' : 'Member'} Access - Review and approve event requests
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-900">{openRequests.length}</p>
                      <p className="text-xs text-purple-700">Available Requests</p>
                    </div>
                  </div>
                </div>

                {openRequestsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading open requests...</p>
                  </div>
                ) : openRequests.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No open requests available at the moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {openRequests.map((request) => (
                      <div
                        key={request._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {getEventTypeLabel(request.eventType, request.eventTypeOther)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Submitted on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => setExpandedOpenRequest(
                              expandedOpenRequest === request._id ? null : request._id
                            )}
                            className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            {expandedOpenRequest === request._id ? 'Hide' : 'View'} Details
                          </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Guests</p>
                            <p className="text-sm font-medium text-gray-900 flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {request.numberOfGuests}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Budget</p>
                            <p className="text-sm font-medium text-gray-900">
                              {request.estimatedBudget} LKR
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">HSC Charge</p>
                            <p className="text-sm font-medium text-gray-900">
                              {request.hscCharge} HSC
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Contact</p>
                            <p className="text-sm font-medium text-gray-900">
                              {request.contactNumber}
                            </p>
                          </div>
                        </div>

                        {request.activities && request.activities.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-2">Activities & Services</p>
                            <div className="flex flex-wrap gap-2">
                              {request.activities.map((activity, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {expandedOpenRequest === request._id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Customer Name</p>
                              <p className="text-sm font-medium text-gray-900">{request.fullName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Email</p>
                              <p className="text-sm font-medium text-gray-900">{request.email}</p>
                            </div>
                            {request.specialRequests && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Special Requests</p>
                                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                  {request.specialRequests}
                                </p>
                              </div>
                            )}
                            {request.adminNote && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Admin Note</p>
                                <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                                  {request.adminNote}
                                </p>
                              </div>
                            )}
                            <div className="pt-3">
                              <button
                                onClick={() => handleApproveRequest(request._id)}
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                              >
                                <CheckCircle className="w-5 h-5" />
                                Approve This Request
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Hire Event Professionals Tab
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Hire Event Professionals
                  </h3>
                  <p className="text-gray-600">
                    Connect with our network of talented professionals to make your event extraordinary
                  </p>
                </div>

                {/* Professional Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* Event Planners & Day Coordinators */}
                  <div
                    onClick={() => navigate('/event-planners-coordinators')}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-purple-300 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                        <Briefcase className="w-8 h-8 text-purple-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Event Planners & Day Coordinators
                      </h4>
                      <p className="text-sm text-gray-600">
                        Expert planners to organize and coordinate your perfect event
                      </p>
                    </div>
                  </div>

                  {/* Creative Photographers */}
                  <div
                    onClick={() => navigate('/ads/events/photographers')}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <Camera className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Creative Photographers
                      </h4>
                      <p className="text-sm text-gray-600">
                        Talented photographers to capture your special moments
                      </p>
                    </div>
                  </div>

                  {/* Talented Entertainers */}
                  <div
                    onClick={() => navigate('/event-planners-coordinators')}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-pink-300 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                        <Music className="w-8 h-8 text-pink-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Talented Entertainers
                      </h4>
                      <p className="text-sm text-gray-600">
                        Musicians, DJs, performers to keep your guests entertained
                      </p>
                    </div>
                  </div>

                  {/* Decorators & Florists */}
                  <div
                    onClick={() => navigate('/decorators-florists')}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-green-300 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                        <Flower2 className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Decorators & Florists
                      </h4>
                      <p className="text-sm text-gray-600">
                        Creative decor specialists to transform your venue
                      </p>
                    </div>
                  </div>

                  {/* Salon & Makeup Artists */}
                  <div
                    onClick={() => navigate('/salon-makeup-artists')}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-yellow-300 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                        <Sparkles className="w-8 h-8 text-yellow-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Salon & Makeup Artists
                      </h4>
                      <p className="text-sm text-gray-600">
                        Beauty professionals to make you look your best
                      </p>
                    </div>
                  </div>

                  {/* Fashion Designers */}
                  <div
                    onClick={() => navigate('/ads/events/fashion-designers')}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-indigo-300 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                        <Shirt className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Fashion Designers
                      </h4>
                      <p className="text-sm text-gray-600">
                        Designers to create custom outfits for your event
                      </p>
                    </div>
                  </div>

                  {/* Other Professionals */}
                  <div
                    onClick={() => navigate('/other-professionals-services')}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-gray-400 group md:col-span-2 lg:col-span-3"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                        <Wrench className="w-8 h-8 text-gray-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Other Professionals
                      </h4>
                      <p className="text-sm text-gray-600">
                        Find specialized professionals for all your unique event needs
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeEventForm;

