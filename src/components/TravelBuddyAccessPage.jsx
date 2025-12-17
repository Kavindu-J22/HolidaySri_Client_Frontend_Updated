import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Users,
  Clock,
  AlertTriangle,
  User,
  MapPin,
  Star,
  TrendingUp,
  Calendar,
  MessageCircle,
  ChevronRight,
  Loader2,
  LogIn,
  UserPlus
} from 'lucide-react';
import { travelBuddyAPI } from '../config/api';

const TravelBuddyAccessPage = ({ reason, message, redirectTo }) => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [topProfiles, setTopProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformStats();
  }, []);

  const fetchPlatformStats = async () => {
    try {
      setLoading(true);
      const response = await travelBuddyAPI.getPlatformStats();
      if (response.data.success) {
        setStatistics(response.data.data.statistics);
        setTopProfiles(response.data.data.topRatedProfiles);
      }
    } catch (error) {
      console.error('Error fetching platform statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrimaryAction = () => {
    if (reason === 'not_logged_in') {
      navigate('/login', { state: { from: { pathname: '/travel-buddies' } } });
    } else if (reason === 'expired') {
      navigate('/profile', { state: { activeSection: 'advertisements' } });
    } else {
      navigate(redirectTo);
    }
  };

  const handleSecondaryAction = () => {
    if (reason === 'not_logged_in') {
      navigate('/register');
    } else if (reason === 'no_profile') {
      navigate('/profile', { state: { activeSection: 'advertisements' } });
    }
  };

  const getAccessContent = () => {
    switch (reason) {
      case 'not_logged_in':
        return {
          icon: <User className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-500" />,
          title: 'Join the Travel Buddies Platform',
          description: 'Connect with amazing travel companions from around the world. Login to your account or create a new one to get started!',
          primaryButton: 'Login',
          secondaryButton: 'Register',
          bgGradient: 'from-indigo-500 to-purple-600',
          showLoginRegister: true
        };

      case 'no_profile':
        return {
          icon: <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" />,
          title: 'Purchase Travel Buddy Advertisement Slot',
          description: 'To access the Travel Buddies Platform and connect with other travel companions, you need to purchase a Travel Buddy advertisement slot first and publish your profile.',
          primaryButton: 'Purchase Slot',
          secondaryButton: 'Check Purchased Slots',
          bgGradient: 'from-blue-500 to-purple-600'
        };

      case 'no_ad':
      case 'inactive':
        return {
          icon: <Users className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500" />,
          title: 'Publish Your Travel Buddy Profile',
          description: 'You have purchased a Travel Buddy slot but haven\'t published your profile yet. Complete your profile to start connecting with other travel buddies.',
          primaryButton: 'Publish Profile',
          secondaryButton: 'Check Purchased Slots',
          bgGradient: 'from-orange-500 to-red-500'
        };

      case 'expired':
        return {
          icon: <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />,
          title: 'Profile Expired - Renew Now',
          description: 'Your Travel Buddy profile has expired. Renew your advertisement to continue connecting with travel companions and accessing platform features.',
          primaryButton: 'Renew Profile',
          secondaryButton: null,
          bgGradient: 'from-red-500 to-pink-600'
        };

      default:
        return {
          icon: <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />,
          title: 'Access Restricted',
          description: message || 'You don\'t have access to the Travel Buddies Platform.',
          primaryButton: 'Get Access',
          secondaryButton: null,
          bgGradient: 'from-yellow-500 to-orange-500'
        };
    }
  };

  const content = getAccessContent();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className={`bg-gradient-to-r ${content.bgGradient} text-white py-8 sm:py-12 lg:py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              {content.icon}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              {content.title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl opacity-90 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              {content.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <button
                onClick={handlePrimaryAction}
                className="w-full sm:w-auto bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                {content.showLoginRegister && <LogIn className="w-5 h-5" />}
                {content.primaryButton}
                {!content.showLoginRegister && <ChevronRight className="w-5 h-5" />}
              </button>
              {content.secondaryButton && (
                <button
                  onClick={handleSecondaryAction}
                  className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white/30 transition-all border border-white/30 flex items-center justify-center gap-2"
                >
                  {content.showLoginRegister && <UserPlus className="w-5 h-5" />}
                  {content.secondaryButton}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {/* Platform Statistics */}
            {statistics && (
              <div className="mb-8 sm:mb-12">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Platform Statistics
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Join our growing community of travel enthusiasts
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Male Buddies */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 rounded-lg">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {statistics.maleBuddies}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Male Buddies
                    </div>
                  </div>

                  {/* Female Buddies */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-pink-100 dark:bg-pink-900/30 p-2 sm:p-3 rounded-lg">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 dark:text-pink-400" />
                      </div>
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {statistics.femaleBuddies}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Female Buddies
                    </div>
                  </div>

                  {/* Total Buddies */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 sm:p-3 rounded-lg">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {statistics.totalBuddies}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Total Buddies
                    </div>
                  </div>

                  {/* Trip Requests */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 rounded-lg">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {statistics.tripRequests}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Trip Requests
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Rated Profiles */}
            {topProfiles && topProfiles.length > 0 && (
              <div>
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Top Rated Travel Buddies
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Meet some of our highly-rated community members
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {topProfiles.map((profile) => (
                    <div
                      key={profile._id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
                      onClick={() => navigate(`/travel-buddy/${profile._id}`)}
                    >
                      {/* Avatar */}
                      <div className="relative">
                        <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                          <img
                            src={profile.avatarImage?.url}
                            alt={profile.userName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {profile.user?.isMember && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                            ⭐ Member
                          </div>
                        )}
                      </div>

                      {/* Profile Info */}
                      <div className="p-4">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                          {profile.userName}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-3">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm truncate">{profile.country}</span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {renderStars(profile.averageRating || 0)}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {profile.averageRating ? profile.averageRating.toFixed(1) : '0.0'} ({profile.totalReviews || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Call to Action Footer */}
      <div className={`bg-gradient-to-r ${content.bgGradient} text-white py-8 sm:py-12 mt-8 sm:mt-12`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-sm sm:text-base lg:text-lg opacity-90 mb-6 sm:mb-8">
            Join thousands of travelers and find your perfect travel companion today!
          </p>
          <button
            onClick={handlePrimaryAction}
            className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
          >
            {content.showLoginRegister && <LogIn className="w-5 h-5" />}
            {content.primaryButton}
            {!content.showLoginRegister && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelBuddyAccessPage;

