import React, { useState, useEffect } from 'react';
import { Heart, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DestinationCard from '../components/destinations/DestinationCard';

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [user, currentPage]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12
      });

      const response = await fetch(`/api/favorites?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = () => {
    // Refresh the favorites list when a favorite is removed
    fetchFavorites();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/plan-dream-tour')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Destinations</span>
          </button>
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Favorite Destinations
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Your saved destinations for future travel planning
        </p>
      </div>

      {/* Content */}
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
      ) : favorites.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start exploring destinations and add them to your favorites for easy access later
          </p>
          <button
            onClick={() => navigate('/plan-dream-tour')}
            className="btn-primary"
          >
            Explore Destinations
          </button>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400">
              {favorites.length} favorite destination{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Favorites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <DestinationCard
                key={favorite._id}
                destination={favorite.destinationId}
                onFavoriteChange={handleRemoveFavorite}
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

export default Favorites;
