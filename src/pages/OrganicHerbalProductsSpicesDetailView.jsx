import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Globe, Facebook, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function OrganicHerbalProductsSpicesDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/organic-herbal-products-spices/${id}`);
        const result = await response.json();
        if (result.success) {
          setProduct(result.data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to add a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/organic-herbal-products-spices/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, reviewText })
      });

      const result = await response.json();
      if (result.success) {
        setSuccess('Review added successfully!');
        setRating(0);
        setReviewText('');
        setProduct({
          ...product,
          averageRating: result.data.averageRating,
          totalReviews: result.data.totalReviews,
          reviews: result.data.reviews
        });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to add review');
      }
    } catch (err) {
      setError('Error adding review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!product) return <div className="flex justify-center items-center h-screen">Product not found</div>;

  return (
    <div className={`min-h-screen py-8 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className={`mb-6 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
        >
          ← Back
        </button>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg mb-8`}>
          {/* Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.images[currentImageIndex]?.url}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`${product.name} ${idx}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                      currentImageIndex === idx
                        ? 'border-blue-500'
                        : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.round(product.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
                  />
                ))}
              </div>
              <span className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
              </span>
            </div>

            {/* Details */}
            <div className={`space-y-3 mb-6 pb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-2xl font-bold text-green-600`}>LKR {product.price.toLocaleString()}</p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <strong>Specialization:</strong> {product.specialization}
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <strong>Category:</strong> {product.category}
              </p>
              <p className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <MapPin size={18} />
                <strong>{product.location.city}, {product.location.province}</strong>
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <strong>Available:</strong> {product.available ? '✓ Yes' : '✗ No'}
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <strong>Delivery:</strong> {product.deliveryAvailable ? '✓ Available' : '✗ Not Available'}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Description
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {product.description}
              </p>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Payment Methods
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.paymentMethods.map(method => (
                  <span
                    key={method}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
              <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Contact Information
              </h3>
              <div className="space-y-2">
                <a href={`tel:${product.contact.phone}`} className="flex items-center gap-2 hover:text-blue-500">
                  <Phone size={18} />
                  <span>{product.contact.phone}</span>
                </a>
                <a href={`mailto:${product.contact.email}`} className="flex items-center gap-2 hover:text-blue-500">
                  <Mail size={18} />
                  <span>{product.contact.email}</span>
                </a>
                {product.contact.facebook && (
                  <a href={product.contact.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-500">
                    <Facebook size={18} />
                    <span>Facebook</span>
                  </a>
                )}
                {product.contact.whatsapp && (
                  <a href={`https://wa.me/${product.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-500">
                    <MessageCircle size={18} />
                    <span>WhatsApp</span>
                  </a>
                )}
                {product.website && (
                  <a href={product.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-500">
                    <Globe size={18} />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Reviews & Ratings
          </h2>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleReviewSubmit} className="mb-8 pb-8 border-b border-gray-300">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center gap-2">
                  <CheckCircle size={18} />
                  {success}
                </div>
              )}

              <div className="mb-4">
                <label className={`block mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="Write your review (optional)"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="4"
                className={`w-full px-4 py-2 rounded-lg border mb-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              />

              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, idx) => (
                <div key={idx} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {review.userName}
                    </h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
                        />
                      ))}
                    </div>
                  </div>
                  {review.reviewText && (
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {review.reviewText}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

