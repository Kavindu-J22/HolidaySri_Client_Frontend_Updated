import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Globe, Facebook, Instagram, Calendar, Award, Briefcase, Star, MessageCircle } from 'lucide-react';

const CreativePhotographersDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        const response = await fetch(`/api/creative-photographers/${id}`);
        const data = await response.json();
        if (data.success) {
          setPhotographer(data.data);
        } else {
          setError('Photographer not found');
        }
      } catch (error) {
        console.error('Error fetching photographer:', error);
        setError('Failed to load photographer details');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotographer();
  }, [id]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/creative-photographers')}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
        >
          ← Back to Photographers
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <div className="flex items-start gap-6">
              <img
                src={photographer.avatar?.url}
                alt={photographer.name}
                className="w-32 h-32 rounded-lg object-cover border-4 border-white"
              />
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{photographer.name}</h1>
                <p className="text-blue-100 text-lg mb-4">{photographer.specialization}</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <Award className="w-4 h-4" />
                    <span>{photographer.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4" />
                    <span>{photographer.city}, {photographer.province}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Category & Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{photographer.category}</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rating</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(photographer.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">({photographer.totalReviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">About</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{photographer.description}</p>
            </div>

            {/* Services Included */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Services Included</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photographer.includes?.map((service, index) => (
                  <div key={index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Availability</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weekdays</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{photographer.availability?.weekdays || 'Not specified'}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weekends</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{photographer.availability?.weekends || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Contact Information</h2>
              <div className="space-y-3">
                <a href={`tel:${photographer.contact}`} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-900 dark:text-white">{photographer.contact}</span>
                </a>

                {photographer.website && (
                  <a href={photographer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-900 dark:text-white truncate">{photographer.website}</span>
                  </a>
                )}

                {photographer.social?.facebook && (
                  <a href={photographer.social.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-900 dark:text-white">Facebook</span>
                  </a>
                )}

                {photographer.social?.instagram && (
                  <a href={photographer.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Instagram className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-900 dark:text-white">Instagram</span>
                  </a>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {photographer.available ? '✓ Currently Available' : '✗ Not Available'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => navigate('/creative-photographers')}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => window.location.href = `tel:${photographer.contact}`}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativePhotographersDetail;

