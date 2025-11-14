import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Loader, MapPin, Eye, TrendingUp, Sparkles, Award } from 'lucide-react';

const FeaturedAds = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [advertisements, setAdvertisements] = useState([]);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch featured advertisements
  useEffect(() => {
    fetchFeaturedAds(1);
  }, []);

  const fetchFeaturedAds = async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/advertisements/featured?page=${page}&limit=12`);
      const data = await response.json();

      if (data.success) {
        setAdvertisements(data.data);
        setPagination(data.pagination);
      } else {
        setError('Failed to load featured advertisements');
      }
    } catch (err) {
      console.error('Error fetching featured ads:', err);
      setError('Failed to load featured advertisements');
    } finally {
      setLoading(false);
    }
  };

  // Get detail page route based on category
  const getDetailRoute = (ad) => {
    const categoryRouteMap = {
      'tour_guiders': `/tour-guider/${ad.publishedAdId?._id}`,
      'local_tour_packages': `/local-tour-package/${ad.publishedAdId?._id}`,
      'travelsafe_help_professionals': `/travel-safe-help-professional/${ad.publishedAdId?._id}`,
      'rent_land_camping_parking': `/rent-land-camping-parking/${ad.publishedAdId?._id}`,
      'hotels_accommodations': `/hotels-accommodations/${ad.publishedAdId?._id}`,
      'cafes_restaurants': `/cafes-restaurants/${ad.publishedAdId?._id}`,
      'foods_beverages': `/foods-beverages/${ad.publishedAdId?._id}`,
      'vehicle_rentals_hire': `/vehicle-rentals-hire/${ad.publishedAdId?._id}`,
      'professional_drivers': `/professional-drivers/${ad.publishedAdId?._id}`,
      'vehicle_repairs_mechanics': `/vehicle-repairs-mechanics/${ad.publishedAdId?._id}`,
      'event_planners_coordinators': `/event-planners-coordinators/${ad.publishedAdId?._id}`,
      'creative_photographers': `/creative-photographers/${ad.publishedAdId?._id}`,
      'decorators_florists': `/decorators-florists/${ad.publishedAdId?._id}`,
      'salon_makeup_artists': `/salon-makeup-artists/${ad.publishedAdId?._id}`,
      'fashion_designers': `/fashion-designers/${ad.publishedAdId?._id}`,
      'expert_doctors': `/expert-doctors/${ad.publishedAdId?._id}`,
      'professional_lawyers': `/professional-lawyers/${ad.publishedAdId?._id}`,
      'advisors_counselors': `/advisors-counselors/${ad.publishedAdId?._id}`,
      'language_translators': `/language-translators/${ad.publishedAdId?._id}`,
      'expert_architects': `/expert-architects/${ad.publishedAdId?._id}`,
      'trusted_astrologists': `/trusted-astrologists/${ad.publishedAdId?._id}`,
      'delivery_partners': `/delivery-partners/${ad.publishedAdId?._id}`,
      'graphics_it_tech_repair': `/graphics-it-tech-repair/${ad.publishedAdId?._id}`,
      'educational_tutoring': `/educational-tutoring/${ad.publishedAdId?._id}`,
      'currency_exchange': `/currency-exchange/${ad.publishedAdId?._id}`,
      'other_professionals_services': `/other-professionals-services/${ad.publishedAdId?._id}`,
      'babysitters_childcare': `/babysitters-childcare/${ad.publishedAdId?._id}`,
      'pet_care_animal_services': `/pet-care-animal-services/${ad.publishedAdId?._id}`,
      'rent_property_buying_selling': `/rent-property-buying-selling/${ad.publishedAdId?._id}`,
      'exclusive_gift_packs': `/exclusive-gift-packs/${ad.publishedAdId?._id}`,
      'souvenirs_collectibles': `/souvenirs-collectibles/${ad.publishedAdId?._id}`,
      'jewelry_gem_sellers': `/jewelry-gem-sellers/${ad.publishedAdId?._id}`,
      'home_office_accessories_tech': `/home-office-accessories-tech/${ad.publishedAdId?._id}`,
      'fashion_beauty_clothing': `/fashion-beauty-clothing/${ad.publishedAdId?._id}`,
      'daily_grocery_essentials': `/daily-grocery-essentials/${ad.publishedAdId?._id}`,
      'organic_herbal_products_spices': `/organic-herbal-products-spices/${ad.publishedAdId?._id}`,
      'books_magazines_educational': `/books-magazines-educational/${ad.publishedAdId?._id}`,
      'other_items': `/other-items/${ad.publishedAdId?._id}`,
      'exclusive_combo_packages': `/exclusive-combo-packages/${ad.publishedAdId?._id}`,
      'talented_entertainers_artists': `/talented-entertainers-artists/${ad.publishedAdId?._id}`,
      'fitness_health_spas_gym': `/fitness-health-spas-gym/${ad.publishedAdId?._id}`,
      'job_opportunities': `/job-opportunities/${ad.publishedAdId?._id}`,
      'local_sim_mobile_data': `/local-sim-mobile-data/${ad.publishedAdId?._id}`,
      'emergency_services_insurance': `/emergency-services-insurance/${ad.publishedAdId?._id}`,
      'live_rides_carpooling': `/live-rides-carpooling/${ad.publishedAdId?._id}`,
      'events_updates': `/events-updates/${ad.publishedAdId?._id}`,
      'donations_raise_fund': `/donations-raise-fund/${ad.publishedAdId?._id}`,
      'crypto_consulting_signals': `/crypto-consulting-signals/${ad.publishedAdId?._id}`
    };

    return categoryRouteMap[ad.category] || '#';
  };

  // Format category name for display
  const formatCategoryName = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get display data from published ad
  const getDisplayData = (ad) => {
    const publishedAd = ad.publishedAdId;
    if (!publishedAd) return null;

    // Common fields across most schemas
    return {
      title: publishedAd.title || publishedAd.name || publishedAd.businessName || publishedAd.companyName || 'Featured Ad',
      description: publishedAd.description || publishedAd.bio || '',
      image: publishedAd.images?.[0]?.url || publishedAd.avatar?.url || publishedAd.coverPhoto?.url || publishedAd.image?.url || null,
      location: publishedAd.location || publishedAd.city || null,
      rating: publishedAd.averageRating || 0,
      reviews: publishedAd.totalReviews || 0,
      price: publishedAd.price || null,
      specialization: publishedAd.specialization || publishedAd.category || null
    };
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchFeaturedAds(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Featured Advertisements
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover premium listings from verified members and partners
              </p>
            </div>
          </div>

          {/* Stats */}
          {!loading && (
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{pagination.totalCount} Featured Ads</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Premium Quality</span>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Advertisements Grid */}
        {!loading && advertisements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisements.map(ad => {
              const displayData = getDisplayData(ad);
              if (!displayData) return null;

              return (
                <div
                  key={ad._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={displayData.image || 'https://res.cloudinary.com/dqdcmluxj/image/upload/v1734691465/DALL_E_2024-12-20_16.08.46_-_A_realistic_and_vibrant_icon_representing_a_gift_for__Holidaysri___featuring_a_beautifully_wrapped_gift_box_with_a_glossy_finish__adorned_with_a_ribbo-removebg-preview_nmajyb.webp'}
                      alt={displayData.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://res.cloudinary.com/dqdcmluxj/image/upload/v1734691465/DALL_E_2024-12-20_16.08.46_-_A_realistic_and_vibrant_icon_representing_a_gift_for__Holidaysri___featuring_a_beautifully_wrapped_gift_box_with_a_glossy_finish__adorned_with_a_ribbo-removebg-preview_nmajyb.webp';
                      }}
                    />
                    {/* Member/Partner Badge */}
                    {ad.userId?.isMember && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Member
                      </div>
                    )}
                    {ad.userId?.isPartner && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Partner
                      </div>
                    )}
                  </div>

                  {/* Content - flex-grow to push button to bottom */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                        {formatCategoryName(ad.category)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
                      {displayData.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 min-h-[2.5rem]">
                      {displayData.description || 'No description available'}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3 min-h-[1.5rem]">
                      {displayData.rating > 0 ? (
                        <>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.round(displayData.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {displayData.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            ({displayData.reviews})
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-500">No ratings yet</span>
                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4 min-h-[1.25rem]">
                      {displayData.location ? (
                        <>
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {typeof displayData.location === 'object'
                              ? `${displayData.location.city}, ${displayData.location.province}`
                              : displayData.location
                            }
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-500">Location not specified</span>
                      )}
                    </div>

                    {/* Spacer to push button to bottom */}
                    <div className="flex-grow"></div>

                    {/* View Details Button - Always at bottom */}
                    <button
                      onClick={() => {
                        const route = getDetailRoute(ad);
                        if (route !== '#') {
                          navigate(route);
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium mt-auto"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, pagination.currentPage - 2) + i;
              if (pageNum > pagination.totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pageNum === pagination.currentPage
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && advertisements.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Sparkles className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Featured Ads Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for premium listings from our members and partners.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedAds;

