import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, Mail, Phone, ArrowLeft, Heart, Coins, Loader } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/donations-raise-fund-browse')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Campaigns
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
              <div className="h-96 overflow-hidden">
                <img
                  src={campaign.images[selectedImage]?.url || campaign.images[selectedImage]}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {campaign.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {campaign.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url || image}
                      alt={`${campaign.title} ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer ${
                        selectedImage === index ? 'ring-2 ring-blue-600' : ''
                      }`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Campaign Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm mb-2">
                    {campaign.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {campaign.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Organized by {campaign.organizer}
                  </p>
                </div>
              </div>

              {/* Rating */}
              {campaign.averageRating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  {renderStars(campaign.averageRating)}
                  <span className="text-gray-600 dark:text-gray-400">
                    ({campaign.totalRatings} {campaign.totalRatings === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About this campaign</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{campaign.description}</p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>{campaign.address}, {campaign.city}, {campaign.province}</span>
              </div>
            </div>

            {/* Fund Transfers Section */}
            {campaign.fundTransfers && campaign.fundTransfers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Fund Transfers</h2>
                <div className="space-y-4">
                  {campaign.fundTransfers.slice().reverse().map((transfer, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{transfer.userName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(transfer.createdAt).toLocaleDateString()} at {new Date(transfer.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600 dark:text-green-400">{transfer.amountHSC.toFixed(2)} HSC</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{transfer.amountLKR.toLocaleString()} LKR</p>
                        </div>
                      </div>
                      {transfer.comment && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm italic bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          "{transfer.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings and Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Ratings & Reviews</h2>
                {user && (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {campaign.ratings && campaign.ratings.length > 0 ? (
                <div className="space-y-4">
                  {campaign.ratings.map((rating, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{rating.userName}</p>
                          {renderStars(rating.rating)}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{rating.review}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  No reviews yet. Be the first to review this campaign!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Funding Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 sticky top-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Funding Progress</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-lg font-bold mb-2">
                  <span className="text-blue-600">{campaign.totalDonatedHSC.toFixed(2)} HSC</span>
                  <span className="text-gray-500 dark:text-gray-400">of {campaign.requestedAmountHSC.toFixed(2)} HSC</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all"
                    style={{ width: `${calculateProgress(campaign.totalDonatedHSC, campaign.requestedAmountHSC)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {campaign.totalDonatedLKR.toLocaleString()}/{campaign.requestedAmountLKR.toLocaleString()} LKR
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Donations</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{campaign.donationCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Views</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{campaign.viewCount}</span>
                </div>
              </div>

              {/* Transfer Fund / Withdrawal Request Buttons */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                {campaign.totalDonatedHSC >= campaign.requestedAmountHSC ? (
                  // Goal Reached
                  <div>
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg text-center mb-3">
                      <p className="font-semibold text-lg">🎉 Goal Reached!</p>
                      <p className="text-sm mt-1">This campaign has successfully reached its funding goal</p>
                    </div>

                    {/* Show withdrawal request button only for campaign owner */}
                    {user && campaign.publishedAdId && String(campaign.publishedAdId.userId) === String(user.id) && (
                      <div>
                        {campaign.withdrawalRequest.status === 'none' && (
                          <button
                            onClick={handleRequestWithdrawal}
                            disabled={requestingWithdrawal}
                            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 font-semibold"
                          >
                            {requestingWithdrawal ? 'Requesting...' : 'Request for Withdrawal'}
                          </button>
                        )}
                        {campaign.withdrawalRequest.status === 'pending' && (
                          <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg text-center">
                            <p className="font-semibold">⏳ Withdrawal Pending</p>
                            <p className="text-sm mt-1">Your withdrawal request is under review</p>
                          </div>
                        )}
                        {campaign.withdrawalRequest.status === 'approved' && (
                          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg text-center">
                            <p className="font-semibold">✅ Withdrawal Approved</p>
                            <p className="text-sm mt-1">Your withdrawal has been approved</p>
                          </div>
                        )}
                        {campaign.withdrawalRequest.status === 'rejected' && (
                          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-center">
                            <p className="font-semibold">❌ Withdrawal Rejected</p>
                            {campaign.withdrawalRequest.adminNote && (
                              <p className="text-sm mt-1">{campaign.withdrawalRequest.adminNote}</p>
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
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Coins className="w-5 h-5" />
                      Transfer Funds (HSC)
                    </button>
                  )
                )}
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <a href={`mailto:${campaign.email}`} className="hover:underline">{campaign.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <a href={`tel:${campaign.contact}`} className="hover:underline">{campaign.contact}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h3>
            
            {error && (
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Rating
              </label>
              {renderStars(rating, true, setRating)}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={submittingRating}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={submittingRating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submittingRating ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Fund Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Transfer Funds</h3>

            {error && (
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* User Balance Display */}
            <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">Your HSC Balance</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userBalance.toFixed(2)} HSC</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{(userBalance * hscValue).toLocaleString()} LKR</p>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount (HSC)
              </label>
              <input
                type="number"
                value={transferAmountHSC}
                onChange={(e) => setTransferAmountHSC(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter amount in HSC"
              />
              {transferAmountHSC && parseFloat(transferAmountHSC) > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ≈ {(parseFloat(transferAmountHSC) * hscValue).toLocaleString()} LKR
                </p>
              )}
            </div>

            {/* Comment Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={transferComment}
                onChange={(e) => setTransferComment(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={transferring}
              >
                Cancel
              </button>
              <button
                onClick={handleTransferFund}
                disabled={transferring}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {transferring ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Transferring...
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4" />
                    Transfer
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

