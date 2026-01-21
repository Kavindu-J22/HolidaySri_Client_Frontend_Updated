import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Globe, Facebook, Instagram, Calendar, Award, Briefcase,
  Star, MessageCircle, Send, Trash2, Edit2, FileText, ArrowLeft,
  Share2, Clock, Users, CheckCircle, Camera, ExternalLink
} from 'lucide-react';

const CreativePhotographersDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photographer, setPhotographer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
          // Get current user info
          const userResponse = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setCurrentUser(userData.data);
          }
        }

        // Fetch photographer
        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/creative-photographers/${id}`);
        const data = await response.json();
        if (data.success) {
          console.log('Creative Photographer Data:', data.data);
          console.log('Packages Data:', data.data.packages);
          setPhotographer(data.data);
        } else {
          setError('Photographer not found');
        }

        // Fetch reviews
        const reviewsResponse = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/creative-photographers/${id}/reviews`);
        const reviewsData = await reviewsResponse.json();
        if (reviewsData.success) {
          setReviews(reviewsData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load photographer details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setReviewError('Please login to add a review');
      return;
    }

    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      setReviewError('Please fill in all fields');
      return;
    }

    setReviewLoading(true);
    setReviewError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/creative-photographers/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (data.success) {
        // Add new review to the list
        setReviews([data.data, ...reviews]);
        setReviewForm({ rating: 5, title: '', comment: '' });
        setShowReviewForm(false);

        // Update photographer rating
        const updatedPhotographer = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/creative-photographers/${id}`);
        const updatedData = await updatedPhotographer.json();
        if (updatedData.success) {
          setPhotographer(updatedData.data);
        }
      } else {
        setReviewError(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewError('Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/creative-photographers/${id}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        setReviews(reviews.filter(r => r._id !== reviewId));

        // Update photographer rating
        const updatedPhotographer = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/creative-photographers/${id}`);
        const updatedData = await updatedPhotographer.json();
        if (updatedData.success) {
          setPhotographer(updatedData.data);
        }
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading photographer details...</p>
        </div>
      </div>
    );
  }

  if (error || !photographer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/creative-photographers')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Photographers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-4 sm:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button and Share */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/creative-photographers')}
            className="group flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">Back</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: photographer.name,
                  text: `Check out ${photographer.name} - ${photographer.specialization}`,
                  url: window.location.href
                });
              }
            }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">Share</span>
          </button>
        </div>

        {/* Hero Section - Enhanced */}
        <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl shadow-2xl p-[2px] mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 sm:p-6 lg:p-8">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
              <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>

              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-2xl sm:rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <img
                    src={photographer.avatar?.url}
                    alt={photographer.name}
                    className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-2xl sm:rounded-3xl object-cover border-4 border-white shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-2 sm:p-3 shadow-lg">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
                    {photographer.name}
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-3 sm:mb-4">
                    {photographer.specialization}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/30">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                      <span className="text-xs sm:text-sm font-semibold text-white">{photographer.experience} years</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/30">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-300" />
                      <span className="text-xs sm:text-sm font-semibold text-white">{photographer.city}, {photographer.province}</span>
                    </div>
                    {photographer.available && (
                      <div className="flex items-center gap-1.5 sm:gap-2 bg-green-500/30 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-green-300/50">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-200" />
                        <span className="text-xs sm:text-sm font-semibold text-white">Available</span>
                      </div>
                    )}
                  </div>

                  {/* View On Map Button */}
                  <div className="mt-4">
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(photographer.city + ', ' + photographer.province + ', Sri Lanka')}`, '_blank')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-colors shadow-md hover:shadow-lg border border-white/30"
                    >
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base font-medium">View On Map</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category & Rating Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Category Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Category</h3>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400">{photographer.category}</p>
          </div>

          {/* Rating Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Rating</h3>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex gap-0.5 sm:gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.round(photographer.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  />
                ))}
              </div>
              <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {photographer.averageRating.toFixed(1)}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                ({photographer.totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Description - Enhanced */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">About</h2>
          </div>
          <div className="relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed pl-4 sm:pl-6">
              {photographer.description}
            </p>
          </div>
        </div>

        {/* Services Included - Enhanced */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Services Included</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {photographer.includes?.map((service, index) => (
              <div
                key={index}
                className="group relative px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="relative z-10">{service}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Availability - Enhanced */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Availability Schedule</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="group relative overflow-hidden p-4 sm:p-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-white/10 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Weekdays</h3>
                </div>
                <p className="text-xs sm:text-sm text-white/90 font-medium">
                  {photographer.availability?.weekdays || 'Not specified'}
                </p>
              </div>
            </div>
            <div className="group relative overflow-hidden p-4 sm:p-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-white/10 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Weekends</h3>
                </div>
                <p className="text-xs sm:text-sm text-white/90 font-medium">
                  {photographer.availability?.weekends || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information - Enhanced */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Get In Touch</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <a
              href={`tel:${photographer.contact}`}
              className="group flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <div className="p-2 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Phone</div>
                <div className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold truncate">
                  {photographer.contact}
                </div>
              </div>
            </a>

            {photographer.website && (
              <a
                href={photographer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="p-2 bg-purple-500 rounded-lg group-hover:bg-purple-600 transition-colors">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Website</div>
                  <div className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold truncate">
                    Visit Website
                  </div>
                </div>
              </a>
            )}

            {photographer.social?.facebook && (
              <a
                href={photographer.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Social</div>
                  <div className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold truncate">
                    Facebook Profile
                  </div>
                </div>
              </a>
            )}

            {photographer.social?.instagram && (
              <a
                href={photographer.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl border border-pink-200 dark:border-pink-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg group-hover:from-purple-600 group-hover:to-pink-600 transition-colors">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Social</div>
                  <div className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold truncate">
                    Instagram Profile
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Packages PDF - Enhanced */}
        {photographer.packages && photographer.packages.url && (
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-[2px] mb-6 sm:mb-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 h-full">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Service Packages
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                Download our comprehensive service packages and pricing information
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href={photographer.packages.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-indigo-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-2xl text-sm sm:text-base font-bold transform hover:scale-105"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Packages PDF</span>
                </a>
                <a
                  href={photographer.packages.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-2xl text-sm sm:text-base font-bold transform hover:scale-105"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View Packages</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Enhanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/creative-photographers')}
            className="group flex items-center justify-center space-x-2 px-6 py-3 sm:py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Browse</span>
          </button>
          <button
            onClick={() => window.location.href = `tel:${photographer.contact}`}
            className="group flex items-center justify-center space-x-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 font-bold shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            <Phone className="w-5 h-5" />
            <span>Contact Now</span>
          </button>
        </div>

        {/* Reviews Section - Enhanced */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6 sm:mb-8">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Reviews & Ratings
            </h2>
          </div>

          {/* Overall Rating - Enhanced */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-amber-900/20 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-yellow-600 dark:text-yellow-400">
                  {photographer.averageRating.toFixed(1)}
                </div>
                <div className="flex gap-0.5 sm:gap-1 mt-2 justify-center sm:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.round(photographer.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {photographer.totalReviews} {photographer.totalReviews === 1 ? 'Review' : 'Reviews'}
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Based on customer feedback
                </p>
              </div>
            </div>
          </div>

          {/* Add Review Button - Enhanced */}
          {isAuthenticated && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="mb-6 sm:mb-8 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
            </button>
          )}

          {/* Review Form - Enhanced */}
          {showReviewForm && isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-700 dark:via-gray-700 dark:to-gray-700 rounded-2xl border-2 border-blue-200 dark:border-gray-600 shadow-lg">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Share Your Experience
                </h3>
              </div>

              {reviewError && (
                <div className="mb-4 p-3 sm:p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm sm:text-base">
                  {reviewError}
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-1 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 sm:w-8 sm:h-8 ${star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Review Title
                    </label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      placeholder="e.g., Excellent photographer!"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      maxLength={100}
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your experience with this photographer..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      maxLength={1000}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}

            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
                Please <button onClick={() => navigate('/login')} className="underline font-semibold">login</button> to add a review.
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{review.userId?.name || 'Anonymous'}</p>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      {currentUser?._id === review.userId?._id && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{review.title}</h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreativePhotographersDetail;

