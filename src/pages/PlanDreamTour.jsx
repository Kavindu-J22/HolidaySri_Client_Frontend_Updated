import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Eye, Heart, SlidersHorizontal } from 'lucide-react';
import DestinationCard from '../components/destinations/DestinationCard';
import FilterPanel from '../components/destinations/FilterPanel';

const PlanDreamTour = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    climate: '',
    province: '',
    district: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDestinations, setTotalDestinations] = useState(0);

  useEffect(() => {
    fetchDestinations();
  }, [currentPage, searchTerm, filters, sortBy, sortOrder]);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (filters.type) params.append('type', filters.type);
      if (filters.climate) params.append('climate', filters.climate);
      if (filters.province) params.append('province', filters.province);
      if (filters.district) params.append('district', filters.district);

      const response = await fetch(`/api/destinations?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setDestinations(data.destinations);
        setTotalPages(data.pagination.pages);
        setTotalDestinations(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      type: '',
      climate: '',
      province: '',
      district: ''
    });
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || filters.type || filters.climate || filters.province || filters.district;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Plan Your Dream Tour
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover amazing destinations across Sri Lanka and plan your perfect getaway
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={handleSearch}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          {/* Sort and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="input min-w-[150px]"
            >
              <option value="createdAt">Latest</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
              <option value="distance">Distance</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : ''}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                  Active
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-secondary text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
            />
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">
          {loading ? 'Loading...' : `${totalDestinations} destinations found`}
        </p>
        
        {sortOrder && (
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Sorted by {sortBy} ({sortOrder === 'asc' ? 'ascending' : 'descending'})
          </p>
        )}
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="card p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No destinations found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {hasActiveFilters 
              ? 'Try adjusting your search or filters to find more destinations'
              : 'No destinations are available at the moment'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination._id}
                destination={destination}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNum = currentPage <= 3 
                    ? index + 1 
                    : currentPage + index - 2;
                  
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlanDreamTour;
