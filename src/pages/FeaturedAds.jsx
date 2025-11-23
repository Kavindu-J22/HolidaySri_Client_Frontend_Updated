import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Loader, MapPin, Eye, TrendingUp, Sparkles, Award, Search, Filter, X, Crown, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

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

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('random');
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch featured advertisements
  useEffect(() => {
    fetchFeaturedAds(1);
  }, [searchQuery, selectedCategory, sortBy, premiumOnly]);

  const fetchFeaturedAds = async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (sortBy) params.append('sortBy', sortBy);
      if (premiumOnly) params.append('premiumOnly', 'true');

      const response = await fetch(`${API_BASE_URL}/advertisements/featured?${params}`);
      const data = await response.json();

      if (data.success) {
        setAdvertisements(data.data);
        setPagination(data.pagination);

        // Extract unique categories if not already set
        if (categories.length === 0 && data.categories) {
          setCategories(data.categories);
        }
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

    // Extract title from various possible fields
    let title = publishedAd.title ||
                publishedAd.name ||
                publishedAd.businessName ||
                publishedAd.companyName ||
                publishedAd.eventTitle ||
                publishedAd.hotelName ||
                publishedAd.restaurantName ||
                publishedAd.serviceName ||
                publishedAd.packageTitle ||
                publishedAd.propertyName ||
                'Featured Ad';

    // Common fields across most schemas
    return {
      title: title,
      description: publishedAd.description || publishedAd.bio || publishedAd.overview || publishedAd.about || '',
      image: publishedAd.images?.[0]?.url || publishedAd.avatar?.url || publishedAd.coverPhoto?.url || publishedAd.image?.url || publishedAd.photos?.[0]?.url || null,
      location: publishedAd.location || publishedAd.city || publishedAd.address || null,
      rating: publishedAd.averageRating || 0,
      reviews: publishedAd.totalReviews || 0,
      price: publishedAd.price || null,
      specialization: publishedAd.specialization || publishedAd.category || null
    };
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('random');
    setPremiumOnly(false);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchFeaturedAds(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg sm:rounded-xl flex-shrink-0">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Featured Advertisements
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1 line-clamp-2">
                Discover premium listings from verified members and partners
              </p>
            </div>
          </div>

          {/* Stats */}
          {!loading && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>{pagination.totalCount} Featured Ads</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Premium Quality</span>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          {/* Search Bar and Premium Toggle */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Premium Only Toggle and Filter Button - Side by side on mobile */}
            <div className="flex gap-2 sm:gap-3">
              {/* Premium Only Toggle */}
              <button
                onClick={() => setPremiumOnly(!premiumOnly)}
                className={`flex-1 sm:flex-none px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                  premiumOnly
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden xs:inline sm:inline">Premium</span>
                <span className="xs:hidden sm:hidden">Premium</span>
              </button>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 sm:flex-none px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Filter Options</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="tour_guiders">Tour Guiders</option>
                    <option value="local_tour_packages">Local Tour Packages</option>
                    <option value="travelsafe_help_professionals">Travel Safe Help Professionals</option>
                    <option value="rent_land_camping_parking">Rent Land Camping Parking</option>
                    <option value="hotels_accommodations">Hotels Accommodations</option>
                    <option value="cafes_restaurants">Cafes Restaurants</option>
                    <option value="foods_beverages">Foods Beverages</option>
                    <option value="vehicle_rentals_hire">Vehicle Rentals Hire</option>
                    <option value="professional_drivers">Professional Drivers</option>
                    <option value="vehicle_repairs_mechanics">Vehicle Repairs Mechanics</option>
                    <option value="event_planners_coordinators">Event Planners Coordinators</option>
                    <option value="creative_photographers">Creative Photographers</option>
                    <option value="decorators_florists">Decorators Florists</option>
                    <option value="salon_makeup_artists">Salon Makeup Artists</option>
                    <option value="fashion_designers">Fashion Designers</option>
                    <option value="expert_doctors">Expert Doctors</option>
                    <option value="professional_lawyers">Professional Lawyers</option>
                    <option value="advisors_counselors">Advisors Counselors</option>
                    <option value="language_translators">Language Translators</option>
                    <option value="expert_architects">Expert Architects</option>
                    <option value="trusted_astrologists">Trusted Astrologists</option>
                    <option value="delivery_partners">Delivery Partners</option>
                    <option value="graphics_it_tech_repair">Graphics IT Tech Repair</option>
                    <option value="educational_tutoring">Educational Tutoring</option>
                    <option value="currency_exchange">Currency Exchange</option>
                    <option value="other_professionals_services">Other Professionals Services</option>
                    <option value="babysitters_childcare">Babysitters Childcare</option>
                    <option value="pet_care_animal_services">Pet Care Animal Services</option>
                    <option value="rent_property_buying_selling">Rent Property Buying Selling</option>
                    <option value="exclusive_gift_packs">Exclusive Gift Packs</option>
                    <option value="souvenirs_collectibles">Souvenirs Collectibles</option>
                    <option value="jewelry_gem_sellers">Jewelry Gem Sellers</option>
                    <option value="home_office_accessories_tech">Home Office Accessories Tech</option>
                    <option value="fashion_beauty_clothing">Fashion Beauty Clothing</option>
                    <option value="daily_grocery_essentials">Daily Grocery Essentials</option>
                    <option value="organic_herbal_products_spices">Organic Herbal Products Spices</option>
                    <option value="books_magazines_educational">Books Magazines Educational</option>
                    <option value="other_items">Other Items</option>
                    <option value="exclusive_combo_packages">Exclusive Combo Packages</option>
                    <option value="talented_entertainers_artists">Talented Entertainers Artists</option>
                    <option value="fitness_health_spas_gym">Fitness Health Spas Gym</option>
                    <option value="job_opportunities">Job Opportunities</option>
                    <option value="local_sim_mobile_data">Local SIM Mobile Data</option>
                    <option value="emergency_services_insurance">Emergency Services Insurance</option>
                    <option value="live_rides_carpooling">Live Rides Carpooling</option>
                    <option value="events_updates">Events Updates</option>
                    <option value="donations_raise_fund">Donations Raise Fund</option>
                    <option value="crypto_consulting_signals">Crypto Consulting Signals</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="random">Random (Premium First)</option>
                    <option value="rating_high">Highest Rating</option>
                    <option value="rating_low">Lowest Rating</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex justify-end pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={clearFilters}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm sm:text-base text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Advertisements Grid */}
        {!loading && advertisements.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {advertisements.map(ad => {
              const displayData = getDisplayData(ad);
              if (!displayData) return null;

              return (
                <div
                  key={ad._id}
                  className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative h-48 sm:h-44 md:h-40 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={displayData.image || 'https://res.cloudinary.com/dqdcmluxj/image/upload/v1734691465/DALL_E_2024-12-20_16.08.46_-_A_realistic_and_vibrant_icon_representing_a_gift_for__Holidaysri___featuring_a_beautifully_wrapped_gift_box_with_a_glossy_finish__adorned_with_a_ribbo-removebg-preview_nmajyb.webp'}
                      alt={displayData.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://res.cloudinary.com/dqdcmluxj/image/upload/v1734691465/DALL_E_2024-12-20_16.08.46_-_A_realistic_and_vibrant_icon_representing_a_gift_for__Holidaysri___featuring_a_beautifully_wrapped_gift_box_with_a_glossy_finish__adorned_with_a_ribbo-removebg-preview_nmajyb.webp';
                      }}
                    />
                    {/* Member/Partner Badge - Partner takes priority */}
                    {ad.userId?.isPartner ? (
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-1.5 py-0.5 sm:px-2 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-0.5 sm:gap-1 shadow-lg">
                        <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                        <span>Partner</span>
                      </div>
                    ) : ad.userId?.isMember ? (
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-1.5 py-0.5 sm:px-2 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-0.5 sm:gap-1 shadow-lg">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                        <span>Member</span>
                      </div>
                    ) : null}

                    {/* Verified Badge - Shows for verified users */}
                    {ad.userId?.verificationStatus === 'verified' && (
                      <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-1.5 py-0.5 sm:px-2 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-0.5 sm:gap-1 shadow-lg">
                        <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Content - flex-grow to push button to bottom */}
                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    {/* Category Badge */}
                    <div className="mb-1.5 sm:mb-2">
                      <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-[10px] sm:text-xs font-medium rounded-full">
                        {formatCategoryName(ad.category)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-1.5 line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem]">
                      {displayData.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2 line-clamp-2 min-h-[1.75rem] sm:min-h-[2rem]">
                      {displayData.description || 'No description available'}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2 min-h-[1.125rem] sm:min-h-[1.25rem]">
                      {displayData.rating > 0 ? (
                        <>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                  i < Math.round(displayData.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-900 dark:text-white">
                            {displayData.rating.toFixed(1)}
                          </span>
                          <span className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
                            ({displayData.reviews})
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-500">No ratings yet</span>
                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 min-h-[0.875rem] sm:min-h-[1rem]">
                      {displayData.location ? (
                        <>
                          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                          <span className="line-clamp-1 text-[11px] sm:text-xs">
                            {typeof displayData.location === 'object'
                              ? `${displayData.location.city}, ${displayData.location.province}`
                              : displayData.location
                            }
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-500">Location not specified</span>
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
                      className="w-full px-3 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium mt-auto"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden xs:inline">Previous</span>
              <span className="xs:hidden">Prev</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                if (pageNum > pagination.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors min-w-[2rem] sm:min-w-[2.5rem] ${
                      pageNum === pagination.currentPage
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && advertisements.length === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-3 sm:mb-4">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
              No Featured Ads Available
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Check back later for premium listings from our members and partners.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedAds;

