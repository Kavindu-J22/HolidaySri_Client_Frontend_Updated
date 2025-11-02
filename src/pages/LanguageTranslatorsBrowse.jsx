import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star, MapPin, Globe, Search, X } from 'lucide-react';

const provincesAndDistricts = {
  "Western Province": ["Colombo", "Gampaha", "Kalutara"],
  "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
  "Southern Province": ["Galle", "Matara", "Hambantota"],
  "Northern Province": ["Jaffna", "Mannar", "Vavuniya", "Kilinochchi", "Mullaitivu"],
  "Eastern Province": ["Batticaloa", "Ampara", "Trincomalee"],
  "North Western Province": ["Kurunegala", "Puttalam"],
  "North Central Province": ["Anuradhapura", "Polonnaruwa"],
  "Uva Province": ["Badulla", "Monaragala"],
  "Sabaragamuwa Province": ["Kegalle", "Ratnapura"]
};

const LanguageTranslatorsBrowse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [translators, setTranslators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    languages: searchParams.get('languages') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    province: searchParams.get('province') || ''
  });

  const [availableCities, setAvailableCities] = useState([]);
  const [allLanguages, setAllLanguages] = useState(new Set());
  const [allCategories, setAllCategories] = useState(new Set());

  // Fetch translators
  useEffect(() => {
    const fetchTranslators = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.languages) params.append('languages', filters.languages);
        if (filters.category) params.append('category', filters.category);
        if (filters.city) params.append('city', filters.city);
        if (filters.province) params.append('province', filters.province);
        params.append('page', page);
        params.append('limit', 12);

        const response = await fetch(`/api/language-translators?${params}`);
        const data = await response.json();

        if (data.success) {
          setTranslators(data.data);
          setTotalPages(data.pagination.pages);

          // Collect all languages and categories
          data.data.forEach(translator => {
            translator.languages.forEach(lang => allLanguages.add(lang));
            allCategories.add(translator.category);
          });
        } else {
          setError('Failed to load translators');
        }
      } catch (error) {
        console.error('Error fetching translators:', error);
        setError('Failed to load translators');
      } finally {
        setLoading(false);
      }
    };

    fetchTranslators();
  }, [filters, page]);

  // Update available cities when province changes
  useEffect(() => {
    if (filters.province) {
      setAvailableCities(provincesAndDistricts[filters.province] || []);
      setFilters(prev => ({ ...prev, city: '' }));
    } else {
      setAvailableCities([]);
    }
  }, [filters.province]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      languages: '',
      category: '',
      city: '',
      province: ''
    });
    setPage(1);
  };

  const handleViewProfile = (id) => {
    navigate(`/language-translators/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Language Translators & Interpreters
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find professional language translation services
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Filters
                </h2>
                {(filters.languages || filters.category || filters.city || filters.province) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Province Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Province
                  </label>
                  <select
                    name="province"
                    value={filters.province}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Provinces</option>
                    {Object.keys(provincesAndDistricts).map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    disabled={!filters.province}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  >
                    <option value="">All Cities</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <input
                    type="text"
                    name="languages"
                    value={filters.languages}
                    onChange={handleFilterChange}
                    placeholder="e.g., Sinhala, English"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    placeholder="e.g., Certified Translator"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading translators...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : translators.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {translators.map(translator => (
                    <div
                      key={translator._id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {/* Avatar */}
                      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-indigo-600">
                        <img
                          src={translator.avatar.url}
                          alt={translator.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {translator.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.round(translator.rating || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {(translator.rating || 0).toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            ({translator.reviewCount || 0})
                          </span>
                        </div>

                        {/* Category */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {translator.category}
                        </p>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <MapPin className="w-4 h-4" />
                          {translator.city}, {translator.province}
                        </div>

                        {/* Languages */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {translator.languages.slice(0, 3).map(lang => (
                              <span
                                key={lang}
                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded"
                              >
                                {lang}
                              </span>
                            ))}
                            {translator.languages.length > 3 && (
                              <span className="text-xs text-gray-600 dark:text-gray-400 px-2 py-1">
                                +{translator.languages.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Experience */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {translator.experienceYears} years experience
                        </p>

                        {/* View Button */}
                        <button
                          onClick={() => handleViewProfile(translator._id)}
                          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          page === i + 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No translators found. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageTranslatorsBrowse;

