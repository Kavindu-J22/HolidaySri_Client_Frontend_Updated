import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Star,
  Eye,
  ArrowLeft,
  Loader,
  AlertCircle,
  BookOpen,
  Globe,
  Languages,
  Grid3x3,
  X
} from 'lucide-react';

const BooksAndMagazinesEducationalBrowse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});

  // Filter states
  const [filters, setFilters] = useState({
    specialization: searchParams.get('specialization') || '',
    language: searchParams.get('language') || '',
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || ''
  });

  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [showFilters, setShowFilters] = useState(false);

  // Available filter options
  const [filterOptions, setFilterOptions] = useState({
    specializations: [],
    languages: [],
    categories: []
  });

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (filters.specialization) params.append('specialization', filters.specialization);
        if (filters.language) params.append('language', filters.language);
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        params.append('page', page);
        params.append('limit', 12);

        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/books-magazines-educational/browse?${params}`);
        const data = await response.json();

        if (data.success) {
          setBooks(data.data);
          setPagination(data.pagination);

          // Extract filter options from results
          const specs = new Set();
          const langs = new Set();
          const cats = new Set();

          data.data.forEach(book => {
            book.specialization?.forEach(s => specs.add(s));
            book.languages?.forEach(l => langs.add(l));
            book.categories?.forEach(c => cats.add(c));
          });

          setFilterOptions({
            specializations: Array.from(specs).sort(),
            languages: Array.from(langs).sort(),
            categories: Array.from(cats).sort()
          });
        } else {
          setError('Failed to fetch books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [filters, page]);

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      specialization: '',
      language: '',
      category: '',
      search: ''
    });
    setPage(1);
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {rating ? rating.toFixed(1) : 'No ratings'}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 sm:p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 flex-shrink-0" />
                <span>Books & Magazines</span>
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">Explore educational materials</p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto px-4 py-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm sm:text-base font-medium"
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Search books..."
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Specialization Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Specialization
                  </label>
                  <select
                    value={filters.specialization}
                    onChange={(e) => handleFilterChange('specialization', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Specializations</option>
                    {filterOptions.specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Language
                  </label>
                  <select
                    value={filters.language}
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Languages</option>
                    {filterOptions.languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {filterOptions.categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {(filters.specialization || filters.language || filters.category || filters.search) && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Books Grid */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {loading ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-600" />
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">No books found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {books.map(book => (
                    <div
                      key={book._id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative h-44 sm:h-48 lg:h-52 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden flex-shrink-0">
                        {book.images && book.images[0] ? (
                          <img
                            src={book.images[0].url}
                            alt={book.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3 sm:p-4 lg:p-5 space-y-3 flex flex-col flex-grow">
                        {/* Title */}
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[3rem]">
                            {book.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                            by {book.author}
                          </p>
                        </div>

                        {/* Rating */}
                        <div>
                          {renderStars(book.averageRating || 0)}
                        </div>

                        {/* Price */}
                        <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                          LKR {book.price.toLocaleString()}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-grow">
                          {book.specialization && book.specialization[0] && (
                            <span className="px-2 py-0.5 sm:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                              {book.specialization[0]}
                            </span>
                          )}
                          {book.languages && book.languages[0] && (
                            <span className="px-2 py-0.5 sm:py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                              {book.languages[0]}
                            </span>
                          )}
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => navigate(`/books-magazines-educational/${book._id}`)}
                          className="w-full mt-3 sm:mt-4 px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg flex-shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                    >
                      Previous
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 font-medium ${
                          page === i + 1
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                      disabled={page === pagination.pages}
                      className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksAndMagazinesEducationalBrowse;

