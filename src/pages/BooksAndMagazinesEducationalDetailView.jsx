import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  AlertCircle,
  Loader,
  Star,
  Send,
  BookOpen,
  User,
  Calendar,
  Eye,
  MessageSquare,
  Phone,
  MessageCircle,
  Globe,
  Facebook,
  FileText,
  Download
} from 'lucide-react';

const BooksAndMagazinesEducationalDetailView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: ''
  });

  // Load book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books-magazines-educational/${id}`);
        const data = await response.json();

        if (data.success) {
          setBook(data.data);
          // Check if user already reviewed
          const userReview = data.data.reviews?.find(r => r.userId === user?._id);
          if (userReview) {
            setReviewForm({
              rating: userReview.rating,
              review: userReview.review
            });
          }
        } else {
          setError('Failed to load book details');
        }
      } catch (error) {
        console.error('Error loading book:', error);
        setError('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, user]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to add a review');
      return;
    }

    if (!reviewForm.review.trim()) {
      setError('Review cannot be empty');
      return;
    }

    setSubmittingReview(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/books-magazines-educational/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: parseInt(reviewForm.rating),
          review: reviewForm.review
        })
      });

      const data = await response.json();

      if (data.success) {
        setBook(data.data);
        setReviewForm({ rating: 5, review: '' });
      } else {
        setError(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to add review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Render star rating
  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type={interactive ? 'button' : 'div'}
            onClick={() => interactive && onChange && onChange(i + 1)}
            className={interactive ? 'cursor-pointer' : ''}
          >
            <Star
              className={`w-5 h-5 ${
                i < Math.round(rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              } ${interactive ? 'hover:text-yellow-400' : ''}`}
            />
          </button>
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {rating ? rating.toFixed(1) : 'No ratings'}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors mb-4"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Book not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors mb-6"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Images and Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {book.images && book.images[0] ? (
                <img
                  src={book.images[0].url}
                  alt={book.name}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Book Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {book.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  by <span className="font-semibold">{book.author}</span>
                </p>
              </div>

              {/* Rating and Stats */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {book.averageRating ? book.averageRating.toFixed(1) : '0'}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {book.totalReviews || 0}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reviews</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {book.viewCount || 0}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Views</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Specializations, Languages, Categories */}
              <div className="space-y-3">
                {book.specialization && book.specialization.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Specializations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {book.specialization.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {book.languages && book.languages.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Languages
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {book.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {book.categories && book.categories.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {book.categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {book.includes && book.includes.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      What's Included
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {book.includes.map((inc, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm"
                        >
                          {inc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* PDF Download */}
              {book.pdfDocument && book.pdfDocument.url && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-300">
                        {book.pdfDocument.fileName}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-400">PDF Document</p>
                    </div>
                  </div>
                  <a
                    href={book.pdfDocument.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Price and Contact */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white space-y-4">
              <div>
                <p className="text-sm opacity-90">Price</p>
                <p className="text-4xl font-bold">
                  LKR {book.price.toLocaleString()}
                </p>
              </div>

              <div className="pt-4 border-t border-white/20">
                <p className="text-sm opacity-90 mb-2">Availability</p>
                <p className="font-semibold">
                  {book.available ? '✓ Available' : '✗ Not Available'}
                </p>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Seller
              </h3>

              {book.contact && (
                <a
                  href={`tel:${book.contact}`}
                  className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {book.contact}
                    </p>
                  </div>
                </a>
              )}

              {book.whatsapp && (
                <a
                  href={`https://wa.me/${book.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">WhatsApp</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {book.whatsapp}
                    </p>
                  </div>
                </a>
              )}

              {book.facebook && (
                <a
                  href={book.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Facebook</p>
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      Visit Profile
                    </p>
                  </div>
                </a>
              )}

              {book.website && (
                <a
                  href={book.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                >
                  <Globe className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Website</p>
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      Visit Website
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <MessageSquare className="w-6 h-6" />
            <span>Reviews & Ratings</span>
          </h2>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleSubmitReview} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Rating
                </label>
                {renderStars(reviewForm.rating, true, (rating) =>
                  setReviewForm(prev => ({ ...prev, rating }))
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                  placeholder="Share your thoughts about this book..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
              >
                {submittingReview ? (
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
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {book.reviews && book.reviews.length > 0 ? (
              book.reviews.map((review, idx) => (
                <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {review.userName}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {review.review}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksAndMagazinesEducationalDetailView;

