import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader, Star, MapPin, Briefcase, DollarSign, AlertCircle, Send, ArrowLeft, Share2, X, Copy, CheckCircle, Facebook } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const JobOpportunitiesDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const [review, setReview] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/job-opportunities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setJob(data.job);
      } else {
        setError('Job opportunity not found');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('Failed to load job opportunity');
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!review.comment.trim()) {
      setError('Please write a review');
      return;
    }

    setSubmittingReview(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/job-opportunities/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(review)
      });

      const data = await response.json();

      if (data.success) {
        setReview({ rating: 5, comment: '' });
        fetchJobDetails();
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle share functionality
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Check out ${job?.title} - Job Opportunity on HolidaySri`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        setShowShareModal(false);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setShowShareModal(false);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
        break;
      default:
        break;
    }
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type={interactive ? 'button' : 'div'}
            onClick={() => interactive && onRate && onRate(i + 1)}
            className={interactive ? 'cursor-pointer' : ''}
          >
            <Star
              className={`w-5 h-5 ${
                i < (rating || 0)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              } ${interactive ? 'hover:text-yellow-400' : ''}`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">{error || 'Job opportunity not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back and Share Buttons */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Go Back</span>
            <span className="sm:hidden">Back</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Share Success Message */}
        {shareSuccess && (
          <div className="mb-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-300 text-sm sm:text-base">Link copied to clipboard!</p>
          </div>
        )}

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {job.companyLogo?.url && (
                <img src={job.companyLogo.url} alt={job.company} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-white p-2" />
              )}
              <div className="flex-1 text-white">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
                <p className="text-lg sm:text-xl opacity-90 mb-3 sm:mb-4">{job.company}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{job.city}, {job.province}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">Overall Rating</p>
                <div className="flex items-center gap-3">
                  {renderStars(job.averageRating)}
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {job.averageRating ? job.averageRating.toFixed(1) : 'No ratings'}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    ({job.reviews?.length || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Job Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* PDF Document */}
            {job.pdfDocument?.url && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Job Description Document</h2>
                <a
                  href={job.pdfDocument.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Download PDF
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                {/* Phone */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Phone</p>
                  <a
                    href={`tel:${job.contact}`}
                    className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {job.contact}
                  </a>
                </div>

                {/* Email */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Email</p>
                  <a
                    href={`mailto:${job.email}`}
                    className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline break-all"
                    title={job.email}
                  >
                    {job.email}
                  </a>
                </div>

                {/* Website */}
                {job.website && (
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Website</p>
                    <a
                      href={job.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline break-all"
                      title={job.website}
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {/* LinkedIn */}
                {job.linkedin && (
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">LinkedIn</p>
                    <a
                      href={job.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline break-all"
                      title={job.linkedin}
                    >
                      View Profile
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Job Details</h3>
              <div className="space-y-4">
                {/* Specialization */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Specialization</p>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold break-words">{job.specialization}</p>
                </div>

                {/* Work Type */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Work Type</p>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold break-words">{job.workType}</p>
                </div>

                {/* Priority */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">Priority</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    job.priority === 'Urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {job.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reviews & Ratings</h2>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Your Review</h3>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Rating</label>
                {renderStars(review.rating, true, (rating) => setReview(prev => ({ ...prev, rating })))}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Comment</label>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                  rows="4"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-2 transition"
              >
                {submittingReview ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {job.reviews && job.reviews.length > 0 ? (
              job.reviews.map((rev, idx) => (
                <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{rev.userName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                    {renderStars(rev.rating)}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Share Job</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <Facebook className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Facebook</span>
                </button>

                <button
                  onClick={() => handleShare('twitter')}
                  className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded-xl transition group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sky-500 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Twitter</span>
                </button>

                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleShare('copy')}
                  className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <Copy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobOpportunitiesDetailView;

