import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Globe,
  Facebook,
  Loader,
  AlertCircle,
  Send,
  Briefcase,
  Award,
  Clock
} from 'lucide-react';
import { vehicleRepairsMechanicsAPI } from '../config/api';
import SuccessModal from '../components/common/SuccessModal';

const VehicleRepairsMechanicsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  // Fetch profile and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, reviewsRes] = await Promise.all([
          vehicleRepairsMechanicsAPI.getMechanicProfile(id),
          vehicleRepairsMechanicsAPI.getReviews(id)
        ]);

        if (profileRes.data && profileRes.data.data) {
          setProfile(profileRes.data.data);
        }

        if (reviewsRes.data && reviewsRes.data.data) {
          setReviews(reviewsRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');

    if (!reviewForm.title || !reviewForm.comment) {
      setError('Please fill in all review fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await vehicleRepairsMechanicsAPI.addReview(id, reviewForm);

      if (response.data && response.data.success) {
        setReviews([response.data.data, ...reviews]);
        setReviewForm({ rating: 5, title: '', comment: '' });
        setShowSuccessModal(true);
        
        // Update profile with new rating
        if (profile) {
          const updatedProfile = { ...profile };
          const allReviews = [response.data.data, ...reviews];
          const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
          updatedProfile.averageRating = parseFloat((totalRating / allReviews.length).toFixed(1));
          updatedProfile.totalReviews = allReviews.length;
          setProfile(updatedProfile);
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={profile.avatar?.url}
                alt={profile.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{profile.name}</h1>
              <p className="text-lg text-blue-600 dark:text-blue-400 mb-4">{profile.specialization}</p>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(profile.averageRating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {profile.averageRating || 'No ratings'} ({profile.totalReviews || 0} reviews)
                </span>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">{profile.experience} years experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">{profile.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">{profile.location?.city}, {profile.location?.province}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">{profile.available ? 'Available' : 'Not Available'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profile.description}</p>
        </div>

        {/* Services */}
        {profile.services && profile.services.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Services</h2>
            <div className="flex flex-wrap gap-2">
              {profile.services.map((service, index) => (
                <span key={index} className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-full text-sm font-medium">
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {profile.images && profile.images.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profile.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-40 rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <a href={`tel:${profile.contact}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                {profile.contact}
              </a>
            </div>
            {profile.website && (
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {profile.website}
                </a>
              </div>
            )}
            {profile.facebook && (
              <div className="flex items-center space-x-3">
                <Facebook className="w-5 h-5 text-blue-600" />
                <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Facebook
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Availability */}
        {profile.availability && (profile.availability.weekdays || profile.availability.weekends) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Availability</h2>
            <div className="space-y-2">
              {profile.availability.weekdays && (
                <p className="text-gray-700 dark:text-gray-300"><strong>Weekdays:</strong> {profile.availability.weekdays}</p>
              )}
              {profile.availability.weekends && (
                <p className="text-gray-700 dark:text-gray-300"><strong>Weekends:</strong> {profile.availability.weekends}</p>
              )}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reviews & Ratings</h2>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Your Review</h3>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || reviewForm.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  placeholder="e.g., Excellent Service"
                />
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  placeholder="Share your experience..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{review.userId?.name || 'Anonymous'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{review.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          title="Review Submitted!"
          message="Thank you for your review. It has been posted successfully."
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default VehicleRepairsMechanicsDetail;

