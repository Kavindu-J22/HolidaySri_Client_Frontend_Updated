import React from 'react';
import { Eye, MapPin, Briefcase, Star } from 'lucide-react';
import SimpleRatingDisplay from '../common/SimpleRatingDisplay';

/**
 * TourGuiderCard Component
 * Displays tour guide profile summary with name, experience, rating, city, province, and View button
 * 
 * Props:
 * - tourGuider: object - Tour guide profile data
 * - onView: function - Callback when View button is clicked
 */
const TourGuiderCard = ({ tourGuider, onView }) => {
  if (!tourGuider) return null;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      {/* Header with Avatar */}
      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden flex-shrink-0">
        {tourGuider.avatar?.url && (
          <img
            src={tourGuider.avatar.url}
            alt={tourGuider.name}
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-lg px-3 py-1 shadow-lg flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-gray-900 dark:text-white text-sm">
            {tourGuider.averageRating?.toFixed(1) || '0.0'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
          {tourGuider.name}
        </h3>

        {/* Gender and Age */}
        <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
            {tourGuider.gender}
          </span>
          <span className="text-gray-500 dark:text-gray-500">•</span>
          <span>{tourGuider.age} years</span>
        </div>

        {/* Experience */}
        <div className="flex items-center space-x-2 mb-3 text-sm text-gray-700 dark:text-gray-300">
          <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="font-medium">
            {tourGuider.experience} {tourGuider.experience === 1 ? 'year' : 'years'} experience
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 mb-4 text-sm text-gray-700 dark:text-gray-300">
          <MapPin className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span>
            {tourGuider.city}, {tourGuider.province}
          </span>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
          {tourGuider.description}
        </p>

        {/* Rating Display */}
        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <SimpleRatingDisplay
            averageRating={tourGuider.averageRating || 0}
            totalReviews={tourGuider.totalReviews || 0}
            size="sm"
          />
        </div>

        {/* View Button */}
        <button
          onClick={() => onView(tourGuider._id)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium flex-shrink-0"
        >
          <Eye className="w-4 h-4" />
          <span>View Profile</span>
        </button>
      </div>
    </div>
  );
};

export default TourGuiderCard;

