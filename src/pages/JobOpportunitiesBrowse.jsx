import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Loader, Star, Eye } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const JobOpportunitiesBrowse = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    priority: '',
    province: '',
    city: '',
    specialization: ''
  });

  const [cities, setCities] = useState([]);

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

  useEffect(() => {
    fetchJobs();
  }, [page, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(filters.search && { search: filters.search }),
        ...(filters.type && { type: filters.type }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.province && { province: filters.province }),
        ...(filters.city && { city: filters.city })
      });

      const response = await fetch(`${API_BASE_URL}/job-opportunities/browse?${params}`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
        setTotalPages(data.pagination.totalPages);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load job opportunities');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);

    if (name === 'province') {
      setCities(provincesAndDistricts[value] || []);
      setFilters(prev => ({ ...prev, city: '' }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.round(rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          {rating ? rating.toFixed(1) : 'No ratings'}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Exciting Job Opportunities</h1>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              name="search"
              placeholder="Search by title, company, or specialization..."
              value={filters.search}
              onChange={handleFilterChange}
              className="flex-1 px-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-2.5 sm:py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              Search
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Employment Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract Basis">Contract Basis</option>
              <option value="Task">Task</option>
            </select>

            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              name="province"
              value={filters.province}
              onChange={handleFilterChange}
              className="px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Provinces</option>
              {Object.keys(provincesAndDistricts).map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>

            <select
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              disabled={!filters.province}
              className="px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">No job opportunities found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {jobs.map(job => (
                <div key={job._id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                  {/* Header with Logo */}
                  <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    {job.companyLogo?.url && (
                      <img src={job.companyLogo.url} alt={job.company} className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate">{job.company}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{job.type}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 space-y-3 flex flex-col flex-grow">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg line-clamp-1">{job.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{job.specialization}</p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 truncate">{job.salary}</span>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        job.priority === 'Urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {job.priority}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex-grow">
                      {renderStars(job.averageRating)}
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/job-opportunities/${job._id}`)}
                      className="w-full mt-auto px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobOpportunitiesBrowse;

