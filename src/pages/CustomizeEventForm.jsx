import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, CheckCircle, XCircle, Eye, Clock, MessageSquare, Briefcase, Camera, Music, Flower2, Sparkles, Shirt, Wrench, User, Mail, Phone, Coins, Upload, FileText, Send } from 'lucide-react';
import { customizeEventRequestAPI, userAPI } from '../config/api';
import { useTheme } from '../contexts/ThemeContext';

const CustomizeEventForm = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
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

  // Proposal state
  const [proposalPDF, setProposalPDF] = useState({ url: '', publicId: '', uploading: false });
  const [sendingProposal, setSendingProposal] = useState(false);
  const [requestProposals, setRequestProposals] = useState({});

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

  // Handle PDF upload to Cloudinary
  const handleProposalPDFUpload = async (e, requestId) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setProposalPDF({ ...proposalPDF, uploading: true });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    formData.append('cloud_name', 'daa9e83as');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/daa9e83as/raw/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.secure_url) {
        setProposalPDF({
          url: data.secure_url,
          publicId: data.public_id,
          uploading: false
        });
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF. Please try again.');
      setProposalPDF({ url: '', publicId: '', uploading: false });
    }
  };

  // Send proposal
  const handleSendProposal = async (requestId) => {
    if (!proposalPDF.url) {
      alert('Please upload a proposal PDF first');
      return;
    }

    try {
      setSendingProposal(true);
      const response = await customizeEventRequestAPI.sendProposal(requestId, {
        proposalPDF: {
          url: proposalPDF.url,
          publicId: proposalPDF.publicId
        }
      });

      if (response.data.success) {
        alert('Proposal sent successfully! The client will be notified.');
        setProposalPDF({ url: '', publicId: '', uploading: false });
        setExpandedOpenRequest(null);
        fetchOpenRequests();
      }
    } catch (error) {
      console.error('Error sending proposal:', error);
      alert(error.response?.data?.message || 'Failed to send proposal');
    } finally {
      setSendingProposal(false);
    }
  };

  // Fetch proposals for a request
  const fetchProposalsForRequest = async (requestId) => {
    try {
      const response = await customizeEventRequestAPI.getProposals(requestId);
      if (response.data.success) {
        setRequestProposals(prev => ({
          ...prev,
          [requestId]: response.data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  // Accept a proposal
  const handleAcceptProposal = async (requestId, proposalId, partnerName) => {
    if (!window.confirm(`Are you sure you want to accept the proposal from ${partnerName}? This will reject all other proposals.`)) {
      return;
    }

    try {
      const response = await customizeEventRequestAPI.acceptProposal(requestId, proposalId);
      if (response.data.success) {
        alert('Proposal accepted successfully! The partner/member has been notified with your contact details.');
        fetchMyRequests();
        setRequestProposals(prev => ({
          ...prev,
          [requestId]: []
        }));
      }
    } catch (error) {
      console.error('Error accepting proposal:', error);
      alert(error.response?.data?.message || 'Failed to accept proposal');
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
      pending: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300', icon: Clock },
      'under-review': { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300', icon: Eye },
      approved: { color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300', icon: CheckCircle },
      rejected: { color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300', icon: XCircle },
      'show-partners-members': { color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300', icon: Users },
      'proposal-accepted': { color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300', icon: CheckCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ')}
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Customize Your Event
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Submit your event customization request and let us help you plan the perfect event
              </p>
            </div>
          </div>
        </div>

        {/* HSC Balance Card */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 rounded-lg shadow-sm p-4 sm:p-6 mb-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm">Your HSC Balance</p>
              <p className="text-2xl sm:text-3xl font-bold">{userBalance} HSC</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-purple-100 text-xs sm:text-sm">Request Charge</p>
              <p className="text-xl sm:text-2xl font-bold">{hscCharge} HSC</p>
            </div>
          </div>
          {userBalance < hscCharge && (
            <div className="mt-4 bg-red-500 bg-opacity-20 border border-red-300 dark:border-red-400 rounded-lg p-3">
              <p className="text-xs sm:text-sm flex items-center">
                <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                Insufficient balance. Please purchase more HSC to submit a request.
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
            <nav className="-mb-px flex min-w-max">
              <button
                onClick={() => setActiveTab('submit')}
                className={`flex-shrink-0 py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'submit'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Submit
              </button>
              <button
                onClick={() => setActiveTab('my-requests')}
                className={`flex-shrink-0 py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'my-requests'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                My Requests
              </button>
              {(isPartner || isMember) && (
                <button
                  onClick={() => setActiveTab('open-requests')}
                  className={`flex-shrink-0 py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'open-requests'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span className="hidden sm:inline">Open Requests</span>
                  <span className="sm:hidden">Open</span>
                  {openRequests.length > 0 && <span className="ml-1">({openRequests.length})</span>}
                </button>
              )}
              <button
                onClick={() => setActiveTab('hire-professionals')}
                className={`flex-shrink-0 py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'hire-professionals'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="hidden sm:inline">Hire Professionals</span>
                <span className="sm:hidden">Hire</span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            {activeTab === 'submit' ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Form Header */}
                <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Event Customization Request
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Fill in the details below to create your perfect event experience
                  </p>
                </div>

                {/* Personal Information */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-xl p-6 sm:p-8 border border-purple-100 dark:border-purple-800/30">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Let us know who you are</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-full">
                    <div className="md:col-span-2">
                      <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <User className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${
                          errors.fullName ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Mail className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${
                          errors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                        Contact Number *
                      </label>
                      <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${
                          errors.contactNumber ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                        }`}
                        placeholder="+94 XX XXX XXXX"
                      />
                      {errors.contactNumber && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />
                          {errors.contactNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-6 sm:p-8 border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Event Details</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Tell us about your event</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-full">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Event Type *
                      </label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all ${
                          errors.eventType ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
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
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />
                          {errors.eventType}
                        </p>
                      )}
                    </div>

                    {formData.eventType === 'other' && (
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Specify Event Type *
                        </label>
                        <input
                          type="text"
                          name="eventTypeOther"
                          value={formData.eventTypeOther}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${
                            errors.eventTypeOther ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                          }`}
                          placeholder="Enter event type"
                        />
                        {errors.eventTypeOther && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <XCircle className="w-4 h-4 mr-1" />
                            {errors.eventTypeOther}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Users className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Number of Guests *
                      </label>
                      <input
                        type="number"
                        name="numberOfGuests"
                        value={formData.numberOfGuests}
                        onChange={handleInputChange}
                        min="1"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${
                          errors.numberOfGuests ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                        }`}
                        placeholder="e.g., 150"
                      />
                      {errors.numberOfGuests && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />
                          {errors.numberOfGuests}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <DollarSign className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Estimated Budget (LKR) *
                      </label>
                      <input
                        type="text"
                        name="estimatedBudget"
                        value={formData.estimatedBudget}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${
                          errors.estimatedBudget ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                        }`}
                        placeholder="e.g., LKR 500,000"
                      />
                      {errors.estimatedBudget && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />
                          {errors.estimatedBudget}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-6 sm:p-8 border border-green-100 dark:border-green-800/30">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-green-600 dark:bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Activities & Services</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Select all that apply to your event</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full max-w-full">
                    {activityOptions.map(activity => (
                      <label
                        key={activity}
                        className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 bg-white dark:bg-gray-800 cursor-pointer transition-all hover:shadow-md group"
                      >
                        <input
                          type="checkbox"
                          checked={formData.activities.includes(activity)}
                          onChange={() => handleActivityToggle(activity)}
                          className="w-5 h-5 text-green-600 dark:text-green-400 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{activity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Special Requests */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl p-6 sm:p-8 border border-amber-100 dark:border-amber-800/30">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-amber-600 dark:bg-amber-500 rounded-lg flex items-center justify-center mr-3">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Special Requests & Dates</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Enter Dates or date range you planed also additional requirements or preferences</p>
                    </div>
                  </div>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all hover:border-amber-300 dark:hover:border-amber-600"
                    placeholder="Tell us about any special requirements, dietary restrictions, accessibility needs, theme preferences, or any other details that will help us make your event perfect..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 sm:p-6 mb-6 border border-purple-200 dark:border-purple-800/30">
                    <div className="flex flex-col sm:flex-row items-start sm:space-x-4 space-y-3 sm:space-y-0">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center">
                          <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 w-full">
                        <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1">Request Summary</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Review your request details before submitting
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-purple-200 dark:border-purple-700">
                          <div className="flex-1 text-center sm:text-left p-3 sm:p-0 bg-purple-50 dark:bg-purple-900/20 sm:bg-transparent rounded-lg sm:rounded-none">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Request Charge</p>
                            <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{hscCharge} HSC</p>
                          </div>
                          <div className="hidden sm:block w-px h-12 bg-purple-200 dark:bg-purple-700"></div>
                          <div className="flex-1 text-center sm:text-right p-3 sm:p-0 bg-gray-50 dark:bg-gray-900/20 sm:bg-transparent rounded-lg sm:rounded-none">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Balance</p>
                            <p className={`text-xl sm:text-2xl font-bold ${userBalance >= hscCharge ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {userBalance} HSC
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center font-semibold"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Reset Form
                    </button>
                    <button
                      type="submit"
                      disabled={loading || userBalance < hscCharge}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting Request...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Submit Request ({hscCharge} HSC)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : activeTab === 'my-requests' ? (
              // My Requests Tab
              <div className="space-y-4">
                {/* Filter */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="under-review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="show-partners-members">Show Partners & Members</option>
                    <option value="proposal-accepted">Proposal Accepted</option>
                  </select>
                </div>

                {/* Requests List */}
                {requestsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading requests...</p>
                  </div>
                ) : myRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No requests found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myRequests.map((request) => (
                      <div
                        key={request._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {getEventTypeLabel(request.eventType, request.eventTypeOther)}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Submitted on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 w-full max-w-full">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Guests</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {request.numberOfGuests}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">

                              {request.estimatedBudget} LKR
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">HSC Charge</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {request.hscCharge} HSC
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Payment</p>
                            <p className="text-sm font-medium text-green-600 dark:text-green-400 capitalize">
                              {request.paymentStatus}
                            </p>
                          </div>
                        </div>

                        {request.activities && request.activities.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Activities & Services</p>
                            <div className="flex flex-wrap gap-2">
                              {request.activities.map((activity, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {request.specialRequests && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Special Requests</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                              {request.specialRequests}
                            </p>
                          </div>
                        )}

                        {request.adminNote && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Admin Note
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 p-2 rounded border border-blue-200 dark:border-blue-800">
                              {request.adminNote}
                            </p>
                          </div>
                        )}

                        {/* Proposal Count Badge */}
                        {request.status === 'show-partners-members' && request.proposals && request.proposals.length > 0 && (
                          <div className="mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                              <FileText className="w-3 h-3 mr-1" />
                              {request.proposals.length} Proposal{request.proposals.length !== 1 ? 's' : ''} Received
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setExpandedRequest(expandedRequest === request._id ? null : request._id);
                            if (expandedRequest !== request._id && request.status === 'show-partners-members') {
                              fetchProposalsForRequest(request._id);
                            }
                          }}
                          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {expandedRequest === request._id ? 'Hide Details' : 'View Details'}
                        </button>

                        {expandedRequest === request._id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-full">
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
                              {request.processedBy && (
                                <>
                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Processed By</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{request.processedBy}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Processed At</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {new Date(request.processedAt).toLocaleString()}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Proposals Section */}
                            {request.status === 'show-partners-members' && (
                              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                  <FileText className="w-4 h-4 mr-2" />
                                  Received Proposals
                                </h5>
                                {requestProposals[request._id] && requestProposals[request._id].length > 0 ? (
                                  <div className="space-y-3">
                                    {requestProposals[request._id].map((proposal) => (
                                      <div
                                        key={proposal._id}
                                        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                                      >
                                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                                          <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white mb-1">
                                              {proposal.partnerName}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                              {proposal.partnerEmail}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                              Submitted on {new Date(proposal.submittedAt).toLocaleDateString()} at {new Date(proposal.submittedAt).toLocaleTimeString()}
                                            </p>
                                          </div>
                                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                            <a
                                              href={proposal.proposalPDF.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm"
                                            >
                                              <FileText className="w-4 h-4" />
                                              View Proposal
                                            </a>
                                            {proposal.status === 'pending' && (
                                              <button
                                                onClick={() => handleAcceptProposal(request._id, proposal._id, proposal.partnerName)}
                                                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm"
                                              >
                                                <CheckCircle className="w-4 h-4" />
                                                Accept Proposal
                                              </button>
                                            )}
                                            {proposal.status === 'accepted' && (
                                              <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                                                <CheckCircle className="w-4 h-4" />
                                                Accepted
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                    No proposals received yet
                                  </p>
                                )}
                              </div>
                            )}
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
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-purple-900 dark:text-purple-300">
                        Open Event Requests
                      </h3>
                      <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-400 mt-1">
                        {isPartner ? 'Partner' : 'Member'} Access - Review and send proposals for event requests
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-purple-300">{openRequests.length}</p>
                      <p className="text-xs text-purple-700 dark:text-purple-400">Available Requests</p>
                    </div>
                  </div>
                </div>

                {openRequestsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">Loading open requests...</p>
                  </div>
                ) : openRequests.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No open requests available at the moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {openRequests.map((request) => (
                      <div
                        key={request._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {getEventTypeLabel(request.eventType, request.eventTypeOther)}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Submitted on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                            {/* Proposal Count Badge */}
                            {request.proposals && request.proposals.length > 0 && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {request.proposals.length} Proposal{request.proposals.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => setExpandedOpenRequest(
                              expandedOpenRequest === request._id ? null : request._id
                            )}
                            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            {expandedOpenRequest === request._id ? 'Hide' : 'View'} Details
                          </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 w-full max-w-full">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Guests</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {request.numberOfGuests}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {request.estimatedBudget} LKR
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">HSC Charge</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {request.hscCharge} HSC
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {request.contactNumber}
                            </p>
                          </div>
                        </div>

                        {request.activities && request.activities.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Activities & Services</p>
                            <div className="flex flex-wrap gap-2">
                              {request.activities.map((activity, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {expandedOpenRequest === request._id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Customer Name</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{request.fullName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{request.email}</p>
                            </div>
                            {request.specialRequests && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Special Requests</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                                  {request.specialRequests}
                                </p>
                              </div>
                            )}
                            {request.adminNote && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Admin Note</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                                  {request.adminNote}
                                </p>
                              </div>
                            )}

                            {/* Proposal Count Badge */}
                            {request.proposals && request.proposals.length > 0 && (
                              <div className="mb-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {request.proposals.length} Proposal{request.proposals.length !== 1 ? 's' : ''} Submitted
                                </span>
                              </div>
                            )}

                            {/* Send Proposal Section */}
                            <div className="pt-3 space-y-3">
                              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
                                <h6 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                  <Send className="w-4 h-4 mr-2" />
                                  Send Your Proposal
                                </h6>

                                {/* PDF Upload Area */}
                                <div className="mb-3">
                                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                                    Upload Proposal PDF (Max 10MB)
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="file"
                                      accept="application/pdf"
                                      onChange={(e) => handleProposalPDFUpload(e, request._id)}
                                      disabled={proposalPDF.uploading || sendingProposal}
                                      className="hidden"
                                      id={`pdf-upload-${request._id}`}
                                    />
                                    <label
                                      htmlFor={`pdf-upload-${request._id}`}
                                      className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                        proposalPDF.uploading
                                          ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed'
                                          : proposalPDF.url
                                          ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                                          : 'border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                                      }`}
                                    >
                                      {proposalPDF.uploading ? (
                                        <>
                                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
                                        </>
                                      ) : proposalPDF.url ? (
                                        <>
                                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                          <span className="text-sm text-green-700 dark:text-green-300 font-medium">PDF Uploaded Successfully</span>
                                        </>
                                      ) : (
                                        <>
                                          <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                          <span className="text-sm text-gray-700 dark:text-gray-300">Click to upload PDF</span>
                                        </>
                                      )}
                                    </label>
                                  </div>
                                  {proposalPDF.url && (
                                    <a
                                      href={proposalPDF.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-purple-600 dark:text-purple-400 hover:underline mt-2 inline-flex items-center"
                                    >
                                      <FileText className="w-3 h-3 mr-1" />
                                      View uploaded PDF
                                    </a>
                                  )}
                                </div>

                                {/* Send Proposal Button */}
                                <button
                                  onClick={() => handleSendProposal(request._id)}
                                  disabled={!proposalPDF.url || sendingProposal || proposalPDF.uploading}
                                  className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                    !proposalPDF.url || sendingProposal || proposalPDF.uploading
                                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                      : 'bg-purple-600 dark:bg-purple-700 text-white hover:bg-purple-700 dark:hover:bg-purple-600'
                                  }`}
                                >
                                  {sendingProposal ? (
                                    <>
                                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-5 h-5" />
                                      Send Proposal
                                    </>
                                  )}
                                </button>
                              </div>
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
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Hire Event Professionals
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Connect with our network of talented professionals to make your event extraordinary
                  </p>
                </div>

                {/* Professional Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full">

                  {/* Event Planners & Day Coordinators */}
                  <div
                    onClick={() => navigate('/event-planners-coordinators')}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer hover:border-purple-300 dark:hover:border-purple-600 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                        <Briefcase className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Event Planners & Day Coordinators
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Expert planners to organize and coordinate your perfect event
                      </p>
                    </div>
                  </div>

                  {/* Creative Photographers */}
                  <div
                    onClick={() => navigate('/ads/events/photographers')}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                        <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Creative Photographers
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Talented photographers to capture your special moments
                      </p>
                    </div>
                  </div>

                  {/* Talented Entertainers */}
                  <div
                    onClick={() => navigate('/event-planners-coordinators')}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer hover:border-pink-300 dark:hover:border-pink-600 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-200 dark:group-hover:bg-pink-900/50 transition-colors">
                        <Music className="w-7 h-7 sm:w-8 sm:h-8 text-pink-600 dark:text-pink-400" />
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Talented Entertainers
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Musicians, DJs, performers to keep your guests entertained
                      </p>
                    </div>
                  </div>

                  {/* Decorators & Florists */}
                  <div
                    onClick={() => navigate('/decorators-florists')}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer hover:border-green-300 dark:hover:border-green-600 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                        <Flower2 className="w-7 h-7 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Decorators & Florists
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Creative decor specialists to transform your venue
                      </p>
                    </div>
                  </div>

                  {/* Salon & Makeup Artists */}
                  <div
                    onClick={() => navigate('/salon-makeup-artists')}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer hover:border-yellow-300 dark:hover:border-yellow-600 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50 transition-colors">
                        <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Salon & Makeup Artists
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Beauty professionals to make you look your best
                      </p>
                    </div>
                  </div>

                  {/* Fashion Designers */}
                  <div
                    onClick={() => navigate('/ads/events/fashion-designers')}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                        <Shirt className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Fashion Designers
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Designers to create custom outfits for your event
                      </p>
                    </div>
                  </div>

                  {/* Other Professionals */}
                  <div
                    onClick={() => navigate('/other-professionals-services')}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 group md:col-span-2 lg:col-span-3"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                        <Wrench className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600 dark:text-gray-400" />
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Other Professionals
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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

