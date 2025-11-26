import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Star,
  MapPin,
  Mail,
  Phone,
  ArrowLeft,
  Heart,
  Coins,
  Loader,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Link as LinkIcon,
  X,
  Check,
  Eye,
  Users,
  Target,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../config/api';

const DonationsRaiseFundDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [error, setError] = useState('');

  // Fund transfer states
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmountHSC, setTransferAmountHSC] = useState('');
  const [transferComment, setTransferComment] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [hscValue, setHscValue] = useState(100);
  const [userBalance, setUserBalance] = useState(0);

  // Withdrawal request state
  const [requestingWithdrawal, setRequestingWithdrawal] = useState(false);

  // Share functionality states
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    fetchCampaignDetails();
    fetchHSCValue();
    if (user) {
      // Set initial balance from user context if available
      if (user.hscBalance !== undefined) {
        setUserBalance(user.hscBalance);
      }
      // Then fetch latest balance from API
      fetchUserBalance();
    }
  }, [id, user]);

  const fetchCampaignDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://holidaysri-backend-9xm4.onrender.com/api/donations-raise-fund/${id}`);
      if (response.data.success) {
        setCampaign(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      setError('Failed to load campaign details');
    } finally {
      setLoading(false);
    }
  };

  const fetchHSCValue = async () => {
    try {
      const response = await axios.get('https://holidaysri-backend-9xm4.onrender.com/api/donations-raise-fund/current-hsc-value');
      if (response.data.success) {
        setHscValue(response.data.data.hscValue);
      }
    } catch (error) {
      console.error('Error fetching HSC value:', error);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await userAPI.getHSCBalance();
      setUserBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Error fetching user balance:', error);
      setUserBalance(0);
    }
  };

  const calculateProgress = (raised, requested) => {
    return Math.min((raised / requested) * 100, 100);
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            size={interactive ? 24 : 16}
            onClick={() => interactive && onStarClick && onStarClick(star)}
          />
        ))}
      </div>
    );
  };

  const handleSubmitRating = async () => {
    if (!user) {
      setError('Please login to add a rating');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!review.trim()) {
      setError('Please write a review');
      return;
    }

    setSubmittingRating(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://holidaysri-backend-9xm4.onrender.com/api/donations-raise-fund/${id}/rating`,
        { rating, review },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setShowRatingModal(false);
        setRating(0);
        setReview('');
        fetchCampaignDetails(); // Refresh to show new rating
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleTransferFund = async () => {
    if (!user) {
      setError('Please login to transfer funds');
      return;
    }

    const amount = parseFloat(transferAmountHSC);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > userBalance) {
      setError(`Insufficient balance. Your current balance is ${userBalance.toFixed(2)} HSC`);
      return;
    }

    setTransferring(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://holidaysri-backend-9xm4.onrender.com/api/donations-raise-fund/${id}/transfer-fund`,
        {
          amountHSC: amount,
          comment: transferComment.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Update user balance in context
        updateUser({ hscBalance: response.data.data.newBalance });
        setUserBalance(response.data.data.newBalance);

        // Close modal and reset
        setShowTransferModal(false);
        setTransferAmountHSC('');
        setTransferComment('');

        // Refresh campaign details
        fetchCampaignDetails();

        alert(`✅ Transfer Successful!\n\nYou donated ${amount.toFixed(2)} HSC (${(amount * hscValue).toLocaleString()} LKR)\nTransaction ID: ${response.data.data.transactionId}`);
      }
    } catch (error) {
      console.error('Error transferring funds:', error);
      setError(error.response?.data?.message || 'Failed to transfer funds');
    } finally {
      setTransferring(false);
    }
  };

  const handleRequestWithdrawal = async () => {
    if (!user) {
      alert('Please login to request withdrawal');
      return;
    }

    if (!window.confirm('Are you sure you want to request withdrawal? This action cannot be undone.')) {
      return;
    }

    setRequestingWithdrawal(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://holidaysri-backend-9xm4.onrender.com/api/donations-raise-fund/${id}/request-withdrawal`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert('✅ Withdrawal Request Submitted!\n\nYour request has been sent to the admin for review.');
        fetchCampaignDetails(); // Refresh to show updated status
      }
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      alert(error.response?.data?.message || 'Failed to request withdrawal');
    } finally {
      setRequestingWithdrawal(false);
    }
  };

  // Handle share functionality
  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = `Support ${campaign.title} - Fundraising Campaign`;
    const text = `Help us reach our goal! ${campaign.title} by ${campaign.organizer}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setShareSuccess(true);
          setShowShareModal(false);
          setTimeout(() => setShareSuccess(false), 3000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Campaign not found</h2>
          <button
            onClick={() => navigate('/donations-raise-fund-browse')}
            className="text-blue-600 hover:underline"
          >
            Back to campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-4 sm:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button and Share */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/donations-raise-fund-browse')}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors group w-fit"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base">Back to Campaigns</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-sm sm:text-base w-fit"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Share Campaign</span>
          </button>
        </div>

        {/* Success Message for Share */}
        {shareSuccess && (
          <div className="mb-4 sm:mb-6 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
            <Check className="w-5 h-5" />
            <span className="text-sm sm:text-base font-medium">Link copied to clipboard!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] overflow-hidden group">
                <img
                  src={campaign.images[selectedImage]?.url || campaign.images[selectedImage]}
                  alt={campaign.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              {campaign.images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {campaign.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url || image}
                      alt={`${campaign.title} ${index + 1}`}
                      className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 object-cover rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedImage === index
                          ? 'ring-3 ring-blue-600 dark:ring-blue-400 shadow-lg scale-105'
                          : 'ring-1 ring-gray-200 dark:ring-gray-600 hover:ring-2 hover:ring-blue-400'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Campaign Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-800 dark:text-blue-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
                      {campaign.category}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight">
                    {campaign.title}
                  </h1>
                  <div className="flex items-center gap-2 text-base sm:text-lg text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                    <span>Organized by <span className="font-semibold text-gray-900 dark:text-white">{campaign.organizer}</span></span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Views</p>
                    <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{campaign.viewCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-2.5 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Donations</p>
                    <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{campaign.donationCount}</p>
                  </div>
                </div>
                {campaign.averageRating > 0 && (
                  <div className="flex items-center gap-2 sm:gap-3 col-span-2 sm:col-span-1">
                    <div className="p-2 sm:p-2.5 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Rating</p>
                      <div className="flex items-center gap-1">
                        <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{campaign.averageRating.toFixed(1)}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({campaign.totalRatings})</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  About this campaign
                </h2>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{campaign.description}</p>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{campaign.address}, {campaign.city}, {campaign.province}</span>
              </div>
            </div>

            {/* Fund Transfers Section */}
            {campaign.fundTransfers && campaign.fundTransfers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  Recent Donations
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {campaign.fundTransfers.slice().reverse().map((transfer, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 sm:p-4 rounded-lg transition-colors duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                            {transfer.userName}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            {new Date(transfer.createdAt).toLocaleDateString()} at {new Date(transfer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="text-left sm:text-right bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="font-bold text-sm sm:text-base text-green-600 dark:text-green-400">{transfer.amountHSC.toFixed(2)} HSC</p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">≈ {transfer.amountLKR.toLocaleString()} LKR</p>
                        </div>
                      </div>
                      {transfer.comment && (
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 rounded-lg border-l-4 border-blue-400 dark:border-blue-600 mt-2">
                          "{transfer.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings and Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
                  Ratings & Reviews
                </h2>
                {user && (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-sm sm:text-base w-full sm:w-auto"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {campaign.ratings && campaign.ratings.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {campaign.ratings.map((rating, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 sm:p-4 rounded-lg transition-colors duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">{rating.userName}</p>
                          <div className="flex items-center gap-2">
                            {renderStars(rating.rating)}
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{rating.review}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Star className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    No reviews yet. Be the first to review this campaign!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Funding Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 sticky top-4 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                Funding Progress
              </h3>

              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {campaign.totalDonatedHSC.toFixed(2)}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-gray-600 dark:text-gray-400">HSC</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">of</span>
                    <span className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-300">
                      {campaign.requestedAmountHSC.toFixed(2)}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">HSC</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${calculateProgress(campaign.totalDonatedHSC, campaign.requestedAmountHSC)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2 sm:mt-3">
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {campaign.totalDonatedLKR.toLocaleString()} LKR
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Goal: {campaign.requestedAmountLKR.toLocaleString()} LKR
                  </p>
                </div>

                {/* Progress Percentage */}
                <div className="mt-3 sm:mt-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-full text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">
                    {calculateProgress(campaign.totalDonatedHSC, campaign.requestedAmountHSC).toFixed(1)}% Funded
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 sm:p-4 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Donations</span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{campaign.donationCount}</span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 sm:p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Views</span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{campaign.viewCount}</span>
                </div>
              </div>

              {/* Transfer Fund / Withdrawal Request Buttons */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 mb-4 sm:mb-6">
                {campaign.totalDonatedHSC >= campaign.requestedAmountHSC ? (
                  // Goal Reached
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-center border-2 border-green-300 dark:border-green-700 shadow-md">
                      <p className="font-bold text-base sm:text-lg text-green-800 dark:text-green-200 mb-1">🎉 Goal Reached!</p>
                      <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">This campaign has successfully reached its funding goal</p>
                    </div>

                    {/* Show withdrawal request button only for campaign owner */}
                    {user && campaign.publishedAdId && String(campaign.publishedAdId.userId) === String(user.id) && (
                      <div>
                        {campaign.withdrawalRequest.status === 'none' && (
                          <button
                            onClick={handleRequestWithdrawal}
                            disabled={requestingWithdrawal}
                            className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 font-bold text-sm sm:text-base"
                          >
                            {requestingWithdrawal ? 'Requesting...' : 'Request for Withdrawal'}
                          </button>
                        )}
                        {campaign.withdrawalRequest.status === 'pending' && (
                          <div className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-center border-2 border-yellow-300 dark:border-yellow-700">
                            <p className="font-bold text-sm sm:text-base text-yellow-800 dark:text-yellow-200">⏳ Withdrawal Pending</p>
                            <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 mt-1">Your withdrawal request is under review</p>
                          </div>
                        )}
                        {campaign.withdrawalRequest.status === 'approved' && (
                          <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-center border-2 border-green-300 dark:border-green-700">
                            <p className="font-bold text-sm sm:text-base text-green-800 dark:text-green-200">✅ Withdrawal Approved</p>
                            <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 mt-1">Your withdrawal has been approved</p>
                          </div>
                        )}
                        {campaign.withdrawalRequest.status === 'rejected' && (
                          <div className="bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-center border-2 border-red-300 dark:border-red-700">
                            <p className="font-bold text-sm sm:text-base text-red-800 dark:text-red-200">❌ Withdrawal Rejected</p>
                            {campaign.withdrawalRequest.adminNote && (
                              <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mt-1">{campaign.withdrawalRequest.adminNote}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  // Goal Not Reached - Show Transfer Button
                  user && (
                    <button
                      onClick={() => setShowTransferModal(true)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 group"
                    >
                      <Coins className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                      Donate Now (HSC)
                    </button>
                  )
                )}
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
                <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  Contact Information
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <a
                    href={`mailto:${campaign.email}`}
                    className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 group"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="break-all">{campaign.email}</span>
                  </a>
                  <a
                    href={`tel:${campaign.contact}`}
                    className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 group"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{campaign.contact}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 transform transition-all animate-scale-in border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                Share Campaign
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 p-3 sm:p-3.5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-all duration-300 group border border-blue-200 dark:border-blue-800"
              >
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Share on Facebook</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 p-3 sm:p-3.5 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/40 rounded-xl transition-all duration-300 group border border-sky-200 dark:border-sky-800"
              >
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600 dark:text-sky-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Share on Twitter</span>
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center gap-3 p-3 sm:p-3.5 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-xl transition-all duration-300 group border border-green-200 dark:border-green-800"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Share on WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center gap-3 p-3 sm:p-3.5 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl transition-all duration-300 group border border-purple-200 dark:border-purple-800"
              >
                <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 max-w-md w-full transform transition-all animate-scale-in border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
              Write a Review
            </h3>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200 p-3 rounded-xl mb-4 border border-red-300 dark:border-red-700 text-sm sm:text-base">
                {error}
              </div>
            )}

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Your Rating
              </label>
              <div className="flex justify-center">
                {renderStars(rating, true, setRating)}
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Your Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="4"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base transition-all"
                placeholder="Share your thoughts about this campaign..."
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setRating(0);
                  setReview('');
                  setError('');
                }}
                className="flex-1 px-4 py-2 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold text-sm sm:text-base"
                disabled={submittingRating}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={submittingRating}
                className="flex-1 px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all disabled:opacity-50 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl"
              >
                {submittingRating ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Fund Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 max-w-md w-full transform transition-all animate-scale-in border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              Donate to Campaign
            </h3>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200 p-3 rounded-xl mb-4 border border-red-300 dark:border-red-700 text-sm sm:text-base">
                {error}
              </div>
            )}

            {/* User Balance Display */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 border border-blue-200 dark:border-blue-800">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Your HSC Balance</p>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{userBalance.toFixed(2)} HSC</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">≈ {(userBalance * hscValue).toLocaleString()} LKR</p>
            </div>

            {/* Amount Input */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Donation Amount (HSC)
              </label>
              <input
                type="number"
                value={transferAmountHSC}
                onChange={(e) => setTransferAmountHSC(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base transition-all"
                placeholder="Enter amount in HSC"
              />
              {transferAmountHSC && parseFloat(transferAmountHSC) > 0 && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-1">
                  <span className="font-semibold">≈ {(parseFloat(transferAmountHSC) * hscValue).toLocaleString()} LKR</span>
                </p>
              )}
            </div>

            {/* Comment Input */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Message (Optional)
              </label>
              <textarea
                value={transferComment}
                onChange={(e) => setTransferComment(e.target.value)}
                rows="3"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base transition-all resize-none"
                placeholder="Add a message with your donation..."
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setTransferAmountHSC('');
                  setTransferComment('');
                  setError('');
                }}
                className="flex-1 px-4 py-2 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold text-sm sm:text-base"
                disabled={transferring}
              >
                Cancel
              </button>
              <button
                onClick={handleTransferFund}
                disabled={transferring}
                className="flex-1 px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl"
              >
                {transferring ? (
                  <>
                    <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Donate Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsRaiseFundDetail;

