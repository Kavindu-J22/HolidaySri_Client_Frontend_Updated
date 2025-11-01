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
  Mail,
  Eye,
  MessageSquare
} from 'lucide-react';
import SuccessModal from '../components/common/SuccessModal';

const SalonMakeupArtistsDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  // Fetch profile and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/salon-makeup-artists/${id}`).then(r => r.json());

        if (response.success && response.data) {
          setProfile(response.data);
          setReviews(response.data.reviews || []);
        } else {
          setError('Profile not found');
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

    if (!user) {
      setError('Please login to add a review');
      return;
    }

    if (!reviewForm.rating) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/salon-makeup-artists/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setReviews(data.data.reviews || []);
        setReviewForm({ rating: 5, comment: '' });
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to add review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Profile not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Success Modal */}
        {showSuccessModal && (
          <SuccessModal
            title="Review Added Successfully!"
            message="Thank you for your review. It has been added to the profile."
            onClose={() => setShowSuccessModal(false)}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
              {profile.avatar?.url ? (
                <img
                  src={profile.avatar.url}
                  alt={profile.name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-blue-500"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{profile.name.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {profile.name}
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {profile.specialization}
              </p>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(profile.averageRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profile.averageRating || 'N/A'}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  ({profile.totalReviews} reviews)
                </span>
              </div>

              {/* Category and Location */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    {profile.category}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span>{profile.location?.city}, {profile.location?.province}</span>
                </div>

                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{profile.experience}</span> years experience
                </div>

                <div className="text-gray-600 dark:text-gray-400">
                  Availability: <span className="font-medium">{profile.available ? 'Available' : 'Not Available'}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex space-x-6">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.viewCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>Views</span>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.contactCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>Contacts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
            {profile.description}
          </p>
        </div>

        {/* Services */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Services Offered</h2>
          <div className="flex flex-wrap gap-2">
            {profile.includes?.map((service, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Phone className="w-5 h-5 text-blue-600" />
              <a href={`tel:${profile.contact}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                {profile.contact}
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="w-5 h-5 text-blue-600" />
              <a href={`mailto:${profile.email}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                {profile.email}
              </a>
            </div>
            {profile.facebook && (
              <div className="flex items-center space-x-4">
                <Facebook className="w-5 h-5 text-blue-600" />
                <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Facebook Page
                </a>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center space-x-4">
                <Globe className="w-5 h-5 text-blue-600" />
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Packages PDF */}
        {profile.packages?.url && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Packages & Pricing</h2>
            <a
              href={profile.packages.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <span>📄</span>
              <span>Download Packages PDF</span>
            </a>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reviews & Ratings</h2>

          {/* Add Review Form */}
          {user ? (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Your Review</h3>

              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating *
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || reviewForm.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">
                Please <button onClick={() => navigate('/login')} className="font-semibold underline">login</button> to add a review.
              </p>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {review.userId?.name || 'Anonymous'}
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
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
                  {review.comment && (
                    <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonMakeupArtistsDetailView;

