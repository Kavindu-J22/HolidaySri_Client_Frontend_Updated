import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  Calendar,
  Clock,
  AlertCircle,
  Info
} from 'lucide-react';
import { hscAPI, advertisementAPI } from '../config/api';
import AdvertisementPlanPopup from '../components/common/AdvertisementPlanPopup';

const RenewAdvertisement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from navigation state
  const { advertisement, renewalType } = location.state || {};
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [slotCharges, setSlotCharges] = useState(null);
  const [hscValue, setHscValue] = useState(100);
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [selectedSlotForPopup, setSelectedSlotForPopup] = useState(null);

  // Helper function to get frontend category ID from backend category name
  const getFrontendCategoryId = (backendCategory) => {
    const categoryMapping = {
      'home_banner': 'home_banner',
      'travel_buddys': 'tourism_travel',
      'tour_guiders': 'tourism_travel',
      'local_tour_packages': 'tourism_travel',
      'customize_tour_package': 'tourism_travel',
      'travelsafe_help_professionals': 'tourism_travel',
      'rent_land_camping_parking': 'tourism_travel',
      'hotels_accommodations': 'accommodation_dining',
      'cafes_restaurants': 'accommodation_dining',
      'foods_beverages': 'accommodation_dining',
      'vehicle_rentals_hire': 'vehicles_transport',
      'live_rides_carpooling': 'vehicles_transport',
      'professional_drivers': 'vehicles_transport',
      'vehicle_repairs_mechanics': 'vehicles_transport',
      'events_updates': 'events_management',
      'event_planners_coordinators': 'events_management',
      'creative_photographers': 'events_management',
      'decorators_florists': 'events_management',
      'salon_makeup_artists': 'events_management',
      'fashion_designers': 'events_management',
      'expert_doctors': 'professionals_services',
      'professional_lawyers': 'professionals_services',
      'advisors_counselors': 'professionals_services',
      'language_translators': 'professionals_services',
      'expert_architects': 'professionals_services',
      'trusted_astrologists': 'professionals_services',
      'delivery_partners': 'professionals_services',
      'graphics_it_tech_repair': 'professionals_services',
      'educational_tutoring': 'professionals_services',
      'currency_exchange': 'professionals_services',
      'other_professionals_services': 'professionals_services',
      'caregivers_time_currency': 'caring_donations',
      'babysitters_childcare': 'caring_donations',
      'pet_care_animal_services': 'caring_donations',
      'donations_raise_fund': 'caring_donations',
      'rent_property_buying_selling': 'marketplace_shopping',
      'exclusive_gift_packs': 'marketplace_shopping',
      'souvenirs_collectibles': 'marketplace_shopping',
      'jewelry_gem_sellers': 'marketplace_shopping',
      'home_office_accessories_tech': 'marketplace_shopping',
      'fashion_beauty_clothing': 'marketplace_shopping',
      'daily_grocery_essentials': 'marketplace_shopping',
      'organic_herbal_products_spices': 'marketplace_shopping',
      'books_magazines_educational': 'marketplace_shopping',
      'other_items': 'marketplace_shopping',
      'create_link_own_store': 'marketplace_shopping',
      'exclusive_combo_packages': 'marketplace_shopping',
      'talented_entertainers_artists': 'entertainment_fitness',
      'fitness_health_spas_gym': 'entertainment_fitness',
      'cinema_movie_hub': 'entertainment_fitness',
      'social_media_promotions': 'entertainment_fitness',
      'job_opportunities': 'special_opportunities',
      'crypto_consulting_signals': 'special_opportunities',
      'local_sim_mobile_data': 'special_opportunities',
      'custom_ads_campaigns': 'special_opportunities',
      'exclusive_offers_promotions': 'special_opportunities',
      'emergency_services_insurance': 'essential_services'
    };

    return categoryMapping[backendCategory] || backendCategory;
  };

  // Helper function to get slot name for display
  const getSlotDisplayName = (backendCategory) => {
    const slotNames = {
      'travel_buddys': 'Travel Buddys',
      'tour_guiders': 'Tour Guiders',
      'local_tour_packages': 'Local Tour Packages',
      'customize_tour_package': 'Customize Tour Package',
      'travelsafe_help_professionals': 'TravelSafe & Help Professionals',
      'rent_land_camping_parking': 'Rent a Land for Camping or Parking',
      'hotels_accommodations': 'Hotels & Accommodations',
      'cafes_restaurants': 'Cafes & Restaurants',
      'foods_beverages': 'Foods & Beverages',
      'vehicle_rentals_hire': 'Vehicle Rentals & Hire',
      'live_rides_carpooling': 'Live Rides & Carpooling',
      'professional_drivers': 'Professional Drivers',
      'vehicle_repairs_mechanics': 'Vehicle Repairs & Mechanics',
      'events_updates': 'Events & Updates',
      'event_planners_coordinators': 'Event Planners & Coordinators',
      'creative_photographers': 'Creative Photographers',
      'decorators_florists': 'Decorators & Florists',
      'salon_makeup_artists': 'Salon & Makeup Artists',
      'fashion_designers': 'Fashion Designers',
      'expert_doctors': 'Expert Doctors',
      'professional_lawyers': 'Professional Lawyers',
      'advisors_counselors': 'Advisors & Counselors',
      'language_translators': 'Language Translators',
      'expert_architects': 'Expert Architects',
      'trusted_astrologists': 'Trusted Astrologists',
      'delivery_partners': 'Delivery Partners',
      'graphics_it_tech_repair': 'Graphics, IT & Tech Repair',
      'educational_tutoring': 'Educational & Tutoring',
      'currency_exchange': 'Currency Exchange',
      'other_professionals_services': 'Other Professionals & Services',
      'caregivers_time_currency': 'Caregivers & Time Currency',
      'babysitters_childcare': 'Babysitters & Childcare',
      'pet_care_animal_services': 'Pet Care & Animal Services',
      'donations_raise_fund': 'Donations & Raise Fund',
      'rent_property_buying_selling': 'Rent Property & Buying/Selling',
      'exclusive_gift_packs': 'Exclusive Gift Packs',
      'souvenirs_collectibles': 'Souvenirs & Collectibles',
      'jewelry_gem_sellers': 'Jewelry & Gem Sellers',
      'home_office_accessories_tech': 'Home/Office Accessories & Tech',
      'fashion_beauty_clothing': 'Fashion, Beauty & Clothing',
      'daily_grocery_essentials': 'Daily Grocery & Essentials',
      'organic_herbal_products_spices': 'Organic/Herbal Products & Spices',
      'books_magazines_educational': 'Books, Magazines & Educational',
      'other_items': 'Other Items',
      'create_link_own_store': 'Create Link to Own Store',
      'exclusive_combo_packages': 'Exclusive Combo Packages',
      'talented_entertainers_artists': 'Talented Entertainers & Artists',
      'fitness_health_spas_gym': 'Fitness, Health, Spas & Gym',
      'cinema_movie_hub': 'Cinema & Movie Hub',
      'social_media_promotions': 'Social Media Promotions',
      'job_opportunities': 'Job Opportunities',
      'crypto_consulting_signals': 'Crypto Consulting & Signals',
      'local_sim_mobile_data': 'Local SIM & Mobile Data',
      'custom_ads_campaigns': 'Custom Ads & Campaigns',
      'exclusive_offers_promotions': 'Exclusive Offers & Promotions',
      'emergency_services_insurance': 'Emergency Services & Insurance',
      'home_banner': 'Home Banner'
    };

    return slotNames[backendCategory] || backendCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Redirect if no advertisement data
  useEffect(() => {
    if (!advertisement || !renewalType) {
      navigate('/profile', { state: { activeTab: 'advertisements' } });
      return;
    }

    // Get the frontend category ID and slot display name
    const frontendCategoryId = getFrontendCategoryId(advertisement.category);
    const slotDisplayName = getSlotDisplayName(advertisement.category);

    // Set up the slot data for the popup
    const slotData = {
      categoryId: frontendCategoryId,
      slotId: advertisement.category, // Use the backend category as slotId
      name: slotDisplayName,
      description: `Renew your ${slotDisplayName} advertisement slot`,
      categoryName: slotDisplayName,
      isRenewal: true,
      renewalType: renewalType,
      advertisementId: advertisement._id
    };

    console.log('Advertisement category:', advertisement.category);
    console.log('Frontend category ID:', frontendCategoryId);
    console.log('Slot display name:', slotDisplayName);
    console.log('Final slot data:', slotData);

    setSelectedSlotForPopup(slotData);

    // Load required data
    loadData();
  }, [advertisement, renewalType, navigate]);

  // Load slot charges and HSC value
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load slot charges and HSC value in parallel
      const [slotChargesResponse, hscResponse] = await Promise.all([
        advertisementAPI.getSlotCharges(),
        hscAPI.getInfo()
      ]);

      if (slotChargesResponse.data.success) {
        setSlotCharges(slotChargesResponse.data.config);
      } else {
        console.warn('Failed to load slot charges, using fallback');
      }

      if (hscResponse.data) {
        setHscValue(hscResponse.data.hscValue || 100);
      } else {
        console.warn('Failed to load HSC value, using default');
        setHscValue(100);
      }

      // Auto-open the plan popup once data is loaded
      setShowPlanPopup(true);

    } catch (error) {
      console.error('Error loading data:', error);
      // Set fallback values and still show popup
      setHscValue(100);
      setShowPlanPopup(true);
      // Only show error if it's a critical failure
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Authentication required. Please log in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle popup close
  const handlePopupClose = () => {
    setShowPlanPopup(false);
    // Navigate back to advertisements page
    navigate('/profile', { state: { activeTab: 'advertisements' } });
  };

  // Format category name for display
  const formatCategoryName = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Check if advertisement is expired
  const isAdvertisementExpired = (ad) => {
    if (!ad.expiresAt) return false;
    return new Date(ad.expiresAt) < new Date();
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading renewal options...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Renewal
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/profile', { state: { activeTab: 'advertisements' } })}
            className="btn-primary"
          >
            Back to Advertisements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile', { state: { activeTab: 'advertisements' } })}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to My Advertisements</span>
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Renew Advertisement
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {renewalType === 'expired' ? 'Renew your expired advertisement slot' : 'Extend your advertisement duration'}
              </p>
            </div>
          </div>
        </div>

        {/* Advertisement Details Card */}
        {advertisement && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {formatCategoryName(advertisement.category)} Advertisement
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Slot ID: <span className="font-mono font-medium">{advertisement.slotId}</span>
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                advertisement.status === 'expired' || isAdvertisementExpired(advertisement)
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  : advertisement.status === 'active'
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
              }`}>
                {advertisement.status === 'expired' || isAdvertisementExpired(advertisement) ? 'Expired' : 
                 advertisement.status === 'Published' ? 'Published' : advertisement.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {advertisement.selectedPlan.charAt(0).toUpperCase() + advertisement.selectedPlan.slice(1)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isAdvertisementExpired(advertisement) ? 'Expired On' : 'Expires On'}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(advertisement.expiresAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Renewal Notice */}
            <div className={`mt-4 p-4 rounded-lg border-l-4 ${
              renewalType === 'expired'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-400'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
            }`}>
              <div className="flex items-start">
                <Info className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${
                  renewalType === 'expired' ? 'text-red-400' : 'text-blue-400'
                }`} />
                <div className={`text-sm ${
                  renewalType === 'expired'
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-blue-700 dark:text-blue-300'
                }`}>
                  <p className="font-medium mb-1">
                    {renewalType === 'expired' ? 'Slot Expired' : 'Renewal Process'}
                  </p>
                  <p>
                    {renewalType === 'expired'
                      ? 'Your advertisement slot has expired. Renew now to reactivate your advertisement and extend its duration.'
                      : 'Extend your advertisement duration by selecting a new plan. Your current expiration date will be extended accordingly.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading state for popup */}
        {!showPlanPopup && (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Preparing renewal options...</p>
          </div>
        )}
      </div>

      {/* Advertisement Plan Selection Popup */}
      <AdvertisementPlanPopup
        isOpen={showPlanPopup}
        onClose={handlePopupClose}
        selectedSlot={selectedSlotForPopup}
        slotCharges={slotCharges}
        hscValue={hscValue}
        isRenewal={true}
        renewalType={renewalType}
        advertisementId={advertisement?._id}
      />
    </div>
  );
};

export default RenewAdvertisement;
