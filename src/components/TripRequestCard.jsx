import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  User,
  Trash2,
  Clock
} from 'lucide-react';

const TripRequestCard = ({ request, onDelete, showDelete = false }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const openWhatsApp = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 mb-3 sm:mb-4">
      {/* Main Bar - Always Visible */}
      <div className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Organizer Avatar and Name - Mobile Layout */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <img
              src={request.organizerAvatar || '/default-avatar.png'}
              alt={request.organizerName}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-blue-500 object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0 sm:hidden">
              <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                {request.organizerName}
              </h3>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{request.destinations.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Main Info - Desktop */}
          <div className="flex-1 min-w-0 hidden sm:block">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {request.organizerName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{request.destinations.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Bar - Desktop */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-600 dark:text-blue-400" />
                <span className="font-medium">{formatDate(request.startDate)}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-600 dark:text-green-400" />
                <span className="font-medium">{request.days} Days</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-purple-600 dark:text-purple-400" />
                <span className="font-medium">{request.requiredBuddies} Buddies</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-orange-600 dark:text-orange-400" />
                <span className="font-medium">LKR {request.budgetPerPerson.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar - Mobile */}
          <div className="flex flex-wrap items-center gap-3 text-xs w-full sm:hidden">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Calendar className="w-3 h-3 mr-1 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">{formatDate(request.startDate)}</span>
            </div>
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Clock className="w-3 h-3 mr-1 text-green-600 dark:text-green-400" />
              <span className="font-medium">{request.days}D</span>
            </div>
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Users className="w-3 h-3 mr-1 text-purple-600 dark:text-purple-400" />
              <span className="font-medium">{request.requiredBuddies}</span>
            </div>
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <DollarSign className="w-3 h-3 mr-1 text-orange-600 dark:text-orange-400" />
              <span className="font-medium">LKR {request.budgetPerPerson.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
            {!showDelete && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/travel-buddy/${request.organizerTravelBuddyId}`);
                  }}
                  className="flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-initial"
                  title="View Profile"
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openWhatsApp(request.organizerWhatsapp);
                  }}
                  className="flex items-center justify-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-initial"
                  title="Chat for Join"
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Chat</span>
                </button>
              </>
            )}
            {showDelete && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(request._id);
                }}
                className="flex items-center justify-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-initial"
                title="Delete Request"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Delete</span>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
              title={isExpanded ? 'Show Less' : 'Show More'}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Contact Info */}
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center text-sm sm:text-base">
                <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Organizer Contact
              </h5>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm break-all">{request.organizerEmail}</p>
            </div>

            {/* Full Description */}
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Description</h5>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{request.description}</p>
            </div>

            {/* Trip Dates */}
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center text-sm sm:text-base">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Trip Duration
              </h5>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                <span className="font-medium">{formatDate(request.startDate)}</span> to <span className="font-medium">{formatDate(request.endDate)}</span>
              </p>
            </div>

            {/* Locations */}
            <div className="md:col-span-1">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center text-sm sm:text-base">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Locations
              </h5>
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Start Location</p>
                  <a
                    href={request.startLocation.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-xs sm:text-sm font-medium break-all"
                  >
                    {request.startLocation.name}
                  </a>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">End Location</p>
                  <a
                    href={request.endLocation.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-xs sm:text-sm font-medium break-all"
                  >
                    {request.endLocation.name}
                  </a>
                </div>
              </div>
            </div>

            {/* Activities */}
            {request.activities && request.activities.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Activities</h5>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {request.activities.map((activity, index) => (
                    <span
                      key={index}
                      className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Wish to Explore */}
            {request.wishToExplore && request.wishToExplore.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Wish to Explore</h5>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {request.wishToExplore.map((wish, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm"
                    >
                      {wish}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Accommodation & Transport */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:col-span-2">
              <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-1 text-xs sm:text-sm">Accommodation</h5>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{request.accommodation}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-1 text-xs sm:text-sm">Transport</h5>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{request.transport}</p>
              </div>
            </div>

            {/* WhatsApp Group Link */}
            {request.whatsappGroupLink && (
              <div className="bg-green-50 dark:bg-green-900/20 p-2 sm:p-3 rounded-lg border border-green-200 dark:border-green-800 md:col-span-2">
                <h5 className="font-semibold text-green-800 dark:text-green-300 mb-1 text-xs sm:text-sm">WhatsApp Group</h5>
                <a
                  href={request.whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 dark:text-green-400 hover:underline text-xs sm:text-sm font-medium break-all"
                >
                  Join WhatsApp Group →
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripRequestCard;

