import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, Users, Clock, Home, Activity, MessageSquare, DollarSign, CheckCircle, XCircle, Eye, FileText, Upload, X } from 'lucide-react';
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
  const [proposalPDF, setProposalPDF] = useState({ url: '', publicId: '', uploading: false });
  const [sendingProposal, setSendingProposal] = useState(false);
  const [requestProposals, setRequestProposals] = useState({});
  const [loadingProposals, setLoadingProposals] = useState({});
  const [acceptingProposal, setAcceptingProposal] = useState(false);

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

  // Upload PDF to Cloudinary
  const handleProposalPDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('PDF file must be less than 10MB');
      return;
    }

    setProposalPDF(prev => ({ ...prev, uploading: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'daa9e83as');

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
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF. Please try again.');
      setProposalPDF({ url: '', publicId: '', uploading: false });
    }
  };

  const handleSendProposal = async (requestId) => {
    if (!proposalPDF.url) {
      alert('Please upload a proposal PDF first');
      return;
    }

    if (!window.confirm('Are you sure you want to send this proposal? The client will be notified.')) {
      return;
    }

    try {
      setSendingProposal(true);
      const response = await api.post(`/customize-tour-package/partner/request/${requestId}/send-proposal`, {
        proposalPDF: {
          url: proposalPDF.url,
          publicId: proposalPDF.publicId
        }
      });

      if (response.data.success) {
        alert('Proposal sent successfully! The client will be notified.');
        setProposalPDF({ url: '', publicId: '', uploading: false });
        setExpandedRequest(null);
        fetchPartnerRequests();
        fetchPartnerRequestsCount();
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
    if (requestProposals[requestId]) return; // Already loaded

    try {
      setLoadingProposals(prev => ({ ...prev, [requestId]: true }));
      const response = await api.get(`/customize-tour-package/request/${requestId}/proposals`);
      if (response.data.success) {
        setRequestProposals(prev => ({
          ...prev,
          [requestId]: response.data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoadingProposals(prev => ({ ...prev, [requestId]: false }));
    }
  };

  // Accept a proposal
  const handleAcceptProposal = async (requestId, proposalId, partnerName) => {
    if (!window.confirm(`Are you sure you want to accept the proposal from ${partnerName}? This will notify all partners who submitted proposals.`)) {
      return;
    }

    try {
      setAcceptingProposal(true);
      const response = await api.put(`/customize-tour-package/request/${requestId}/proposal/${proposalId}/accept`);

      if (response.data.success) {
        alert('Proposal accepted successfully! The partner will be notified with your contact details.');
        fetchMyRequests();
        setRequestProposals(prev => ({ ...prev, [requestId]: null }));
      }
    } catch (error) {
      console.error('Error accepting proposal:', error);
      alert(error.response?.data?.message || 'Failed to accept proposal');
    } finally {
      setAcceptingProposal(false);
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
      'show-partners': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-400', icon: Package },
      'partner-approved': { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-800 dark:text-teal-400', icon: CheckCircle }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-3 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Package className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 px-2">
            CUSTOMIZE YOUR SRI LANKAN ADVENTURE
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
            Tell us your preferences and we'll create the perfect tour package for you
          </p>

          {/* HSC Balance & Charge Info */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 px-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Your Balance: <span className="font-semibold text-blue-600 dark:text-blue-400">{userBalance} HSC</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Request Charge: <span className="font-semibold text-orange-600 dark:text-orange-400">{hscCharge} HSC</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <nav className="flex min-w-full">
            <button
              onClick={() => setActiveTab('submit')}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === 'submit'
                  ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Submit Request
            </button>
            <button
              onClick={() => setActiveTab('my-requests')}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
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
                className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap ${
                  activeTab === 'partner-requests'
                    ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Partner Requests
                {partnerRequestsCount > 0 && (
                  <span className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {partnerRequestsCount}
                  </span>
                )}
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-lg p-4 sm:p-6">
          {activeTab === 'submit' ? (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="w-full">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`input-field text-sm sm:text-base w-full max-w-full ${errors.fullName ? 'border-red-500' : ''}`}
                      placeholder="Enter your full name"
                      style={{ minWidth: '0' }}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  <div className="w-full">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input-field text-sm sm:text-base w-full max-w-full ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="your.email@example.com"
                      style={{ minWidth: '0' }}
                    />
                    {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div className="md:col-span-2 w-full">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className={`input-field text-sm sm:text-base w-full max-w-full ${errors.contactNumber ? 'border-red-500' : ''}`}
                      placeholder="Enter any type of contact number"
                      style={{ minWidth: '0' }}
                    />
                    {errors.contactNumber && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.contactNumber}</p>}
                  </div>
                </div>
              </div>

              {/* Travel Details */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
                  Travel Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="w-full">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`input-field text-sm sm:text-base w-full max-w-full ${errors.startDate ? 'border-red-500' : ''}`}
                      style={{ minWidth: '0' }}
                    />
                    {errors.startDate && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.startDate}</p>}
                  </div>
                  <div className="w-full">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      Number of Travelers *
                    </label>
                    <input
                      type="number"
                      name="numberOfTravelers"
                      value={formData.numberOfTravelers}
                      onChange={handleInputChange}
                      min="1"
                      className={`input-field text-sm sm:text-base w-full max-w-full ${errors.numberOfTravelers ? 'border-red-500' : ''}`}
                      style={{ minWidth: '0' }}
                    />
                    {errors.numberOfTravelers && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.numberOfTravelers}</p>}
                  </div>
                  <div className="sm:col-span-2 md:col-span-1 w-full">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      Duration (Days) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="1"
                      className={`input-field text-sm sm:text-base w-full max-w-full ${errors.duration ? 'border-red-500' : ''}`}
                      style={{ minWidth: '0' }}
                    />
                    {errors.duration && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.duration}</p>}
                  </div>
                </div>
              </div>

              {/* Accommodation */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                  <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
                  Accommodation Preference
                </h2>
                <div className="space-y-2.5 sm:space-y-3">
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
                      <span className="ml-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 capitalize">
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
                      className={`input-field text-sm sm:text-base ml-7 w-full max-w-full ${errors.accommodationOther ? 'border-red-500' : ''}`}
                      placeholder="Please specify accommodation type"
                      style={{ minWidth: '0' }}
                    />
                  )}
                  {errors.accommodationOther && <p className="text-red-500 text-xs sm:text-sm mt-1 ml-7">{errors.accommodationOther}</p>}
                </div>
              </div>

              {/* Activities & Interests */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
                  Activities & Interests
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
                  {activityOptions.map((activity) => (
                    <label key={activity} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.activities.includes(activity)}
                        onChange={() => handleActivityToggle(activity)}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500 rounded flex-shrink-0"
                      />
                      <span className="ml-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        {activity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div className="w-full">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
                  Special Requests / Description
                </h2>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows="4"
                  className="input-field text-sm sm:text-base w-full max-w-full resize-none"
                  placeholder="Tell us about any special requirements, dietary restrictions, accessibility needs, or specific places you'd like to visit..."
                  style={{ minWidth: '0' }}
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || userBalance < hscCharge}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white text-sm sm:text-base rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? 'Submitting...' : `Submit Request (${hscCharge} HSC)`}
                </button>
              </div>

              {userBalance < hscCharge && (
                <p className="text-red-500 text-center text-xs sm:text-sm">
                  Insufficient HSC balance. Please purchase more HSC to submit your request.
                </p>
              )}
            </form>
          ) : activeTab === 'my-requests' ? (
            // My Requests Tab
            <div className="space-y-3 sm:space-y-4">
              {/* Filter */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  My Requests
                </h2>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field text-sm sm:text-base w-full sm:w-auto"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="show-partners">Show Partners</option>
                  <option value="partner-approved">Partner Approved</option>
                  <option value="proposal-accepted">Proposal Accepted</option>
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
                <div className="space-y-3 sm:space-y-4">
                  {myRequests.map((request) => {
                    const statusInfo = getStatusBadge(request.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <div key={request._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-3 sm:mb-4">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                              {request.numberOfTravelers} Traveler{request.numberOfTravelers > 1 ? 's' : ''} • {request.duration} Day{request.duration > 1 ? 's' : ''}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Starting: {new Date(request.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusInfo.bg} ${statusInfo.text} whitespace-nowrap`}>
                            <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            {request.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Accommodation</p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white capitalize break-words">
                              {request.accommodation === 'other' ? request.accommodationOther : request.accommodation.replace('-', ' ')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">HSC Charge</p>
                            <p className="text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">
                              {request.hscCharge} HSC
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Activities</p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {request.activities?.length || 0} selected
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Proposals</p>
                            <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {request.proposals?.length || 0} received
                            </p>
                          </div>
                        </div>

                        {request.specialRequests && (
                          <div className="bg-gray-50 dark:bg-gray-900 rounded p-2.5 sm:p-3 mb-2.5 sm:mb-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Special Requests</p>
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-words">{request.specialRequests}</p>
                          </div>
                        )}

                        {request.adminNote && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2.5 sm:p-3 mb-2.5 sm:mb-3">
                            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Admin Note</p>
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-words">{request.adminNote}</p>
                          </div>
                        )}

                        {/* Proposals Section - Show if status is show-partners */}
                        {request.status === 'show-partners' && request.proposals && request.proposals.length > 0 && (
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4 mt-3 sm:mt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                Received Proposals ({request.proposals.length})
                              </h4>
                              {!requestProposals[request._id] && (
                                <button
                                  onClick={() => fetchProposalsForRequest(request._id)}
                                  disabled={loadingProposals[request._id]}
                                  className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {loadingProposals[request._id] ? 'Loading...' : 'View Proposals'}
                                </button>
                              )}
                            </div>

                            {requestProposals[request._id] && (
                              <div className="space-y-2 sm:space-y-3">
                                {requestProposals[request._id].map((proposal) => (
                                  <div key={proposal._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                      <div className="flex-1">
                                        <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                          {proposal.partnerName}
                                        </h5>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                          Submitted: {new Date(proposal.submittedAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                        <a
                                          href={proposal.proposalPDF.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
                                        >
                                          <Eye className="w-4 h-4" />
                                          View Proposal
                                        </a>
                                        <button
                                          onClick={() => handleAcceptProposal(request._id, proposal._id, proposal.partnerName)}
                                          disabled={acceptingProposal}
                                          className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                          {acceptingProposal ? 'Accepting...' : 'Accept Proposal'}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
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
            <div className="space-y-3 sm:space-y-4">
              {/* Header with Count */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    Partner Requests
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
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
                <div className="space-y-3 sm:space-y-4">
                  {partnerRequests.map((request) => {
                    const isExpanded = expandedRequest === request._id;

                    return (
                      <div key={request._id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        {/* Request Header */}
                        <div
                          className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => setExpandedRequest(isExpanded ? null : request._id)}
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-3 sm:mb-4">
                            <div className="flex-1">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                                {request.numberOfTravelers} Traveler{request.numberOfTravelers > 1 ? 's' : ''} • {request.duration} Day{request.duration > 1 ? 's' : ''}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Starting: {new Date(request.startDate).toLocaleDateString()}
                              </p>
                            </div>
                            <button className="text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-medium whitespace-nowrap">
                              {isExpanded ? 'Collapse' : 'Expand'} Details
                            </button>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Accommodation</p>
                              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white capitalize break-words">
                                {request.accommodation === 'other' ? request.accommodationOther : request.accommodation.replace('-', ' ')}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">HSC Charge</p>
                              <p className="text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">
                                {request.hscCharge} HSC
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
                              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Activities</p>
                              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                                {request.activities?.length || 0} selected
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Proposals</p>
                              <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {request.proposals?.length || 0} received
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 space-y-3 sm:space-y-4">
                            {/* Customer Information */}
                            <div>
                              <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                                Customer Information
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white break-words">{request.fullName}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white break-all">{request.email}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Contact Number</p>
                                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white break-words">{request.contactNumber}</p>
                                </div>
                              </div>
                            </div>

                            {/* Activities */}
                            {request.activities && request.activities.length > 0 && (
                              <div>
                                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                                  Activities & Interests
                                </h4>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                  {request.activities.map((activity, index) => (
                                    <span key={index} className="px-2 sm:px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 rounded-full text-xs sm:text-sm">
                                      {activity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Special Requests */}
                            {request.specialRequests && (
                              <div>
                                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                                  Special Requests
                                </h4>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{request.specialRequests}</p>
                                </div>
                              </div>
                            )}

                            {/* Admin Note */}
                            {request.adminNote && (
                              <div>
                                <h4 className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-400 mb-2 sm:mb-3 flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                                  Admin Note
                                </h4>
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4">
                                  <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-300 whitespace-pre-wrap break-words">{request.adminNote}</p>
                                </div>
                              </div>
                            )}

                            {/* Send Proposal Section */}
                            <div className="pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                              {/* PDF Upload */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Upload Proposal (PDF) *
                                </label>
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleProposalPDFUpload}
                                    disabled={proposalPDF.uploading || sendingProposal}
                                    className="hidden"
                                    id={`proposal-upload-${request._id}`}
                                  />
                                  <label
                                    htmlFor={`proposal-upload-${request._id}`}
                                    className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                                      proposalPDF.uploading
                                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                                        : proposalPDF.url
                                        ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-400'
                                    }`}
                                  >
                                    {proposalPDF.uploading ? (
                                      <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
                                        <span className="text-sm text-orange-600 dark:text-orange-400">Uploading...</span>
                                      </>
                                    ) : proposalPDF.url ? (
                                      <>
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm text-green-600 dark:text-green-400">PDF Uploaded</span>
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setProposalPDF({ url: '', publicId: '', uploading: false });
                                          }}
                                          className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                        >
                                          <X className="w-4 h-4 text-red-600" />
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload proposal PDF</span>
                                      </>
                                    )}
                                  </label>
                                </div>
                                {proposalPDF.url && (
                                  <a
                                    href={proposalPDF.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-flex items-center gap-1"
                                  >
                                    <FileText className="w-3 h-3" />
                                    View uploaded PDF
                                  </a>
                                )}
                              </div>

                              {/* Send Proposal Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendProposal(request._id);
                                }}
                                disabled={!proposalPDF.url || sendingProposal}
                                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm sm:text-base rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                              >
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                                {sendingProposal ? 'Sending...' : 'Send Proposal'}
                              </button>
                              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                Upload your proposal PDF and send it to the client for review
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

