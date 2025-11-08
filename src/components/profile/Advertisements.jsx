import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  Plus,
  Eye,
  Calendar,
  Clock,
  Star,
  Loader,
  AlertCircle,
  Pause,
  PlayCircle,
  RefreshCw,
  Search,
  Filter,
  X,
  ChevronDown,
  BarChart3,
  Shield,
  CheckCircle
} from 'lucide-react';
import { advertisementAPI, userAPI } from '../../config/api';
import UserVerificationModal from './UserVerificationModal';

const Advertisements = () => {
  const navigate = useNavigate();
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    plan: 'all',
    category: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    statuses: [],
    plans: []
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });

  // User verification state
  const [userVerificationStatus, setUserVerificationStatus] = useState({
    isVerified: false,
    verificationStatus: 'pending',
    loading: true
  });
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Fetch user advertisements
  const fetchAdvertisements = async (page = 1, search = searchTerm, currentFilters = filters) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page,
        limit: 9, // 3x3 grid
        search: search.trim(),
        ...currentFilters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'all') {
          delete params[key];
        }
      });

      const response = await advertisementAPI.getMyAdvertisements(params);
      setAdvertisements(response.data.advertisements || []);
      setPagination(response.data.pagination || {});
      setFilterOptions(response.data.filterOptions || {});
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      setError('Failed to load advertisements');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user verification status
  const fetchUserVerificationStatus = async () => {
    try {
      const response = await userAPI.getUserVerificationStatus();
      setUserVerificationStatus({
        isVerified: response.data.isVerified,
        verificationStatus: response.data.verificationStatus,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching user verification status:', error);
      setUserVerificationStatus(prev => ({ ...prev, loading: false }));
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAdvertisements();
    fetchUserVerificationStatus();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchAdvertisements(1, searchTerm, filters);
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    fetchAdvertisements(1, searchTerm, newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = { status: 'all', plan: 'all', category: 'all' };
    setFilters(clearedFilters);
    setSearchTerm('');
    fetchAdvertisements(1, '', clearedFilters);
  };

  // Handle verification completion
  const handleVerificationComplete = () => {
    fetchUserVerificationStatus();
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchAdvertisements(page, searchTerm, filters);
  };

  // Format category name for display
  const formatCategoryName = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'expired':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'Published':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'draft':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  // Get plan icon
  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'hourly':
        return <Clock className="w-4 h-4" />;
      case 'daily':
        return <Calendar className="w-4 h-4" />;
      case 'monthly':
        return <Calendar className="w-4 h-4" />;
      case 'yearly':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Handle pause expiration
  const handlePauseExpiration = async (adId) => {
    try {
      setActionLoading(prev => ({ ...prev, [adId]: 'pausing' }));
      await advertisementAPI.pauseExpiration(adId);

      // Update the advertisement in the local state
      setAdvertisements(prev => prev.map(ad =>
        ad._id === adId
          ? { ...ad, expiresAt: null }
          : ad
      ));

      setError('');
    } catch (error) {
      console.error('Error pausing expiration:', error);
      setError('Failed to pause expiration. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [adId]: null }));
    }
  };

  // Handle publish now
  const handlePublishNow = (adId) => {
    const advertisement = advertisements.find(ad => ad._id === adId);

    if (!advertisement) {
      setError('Advertisement not found');
      return;
    }

    // Check if it's a travel buddy advertisement
    if (advertisement.category === 'travel_buddys') {
      // Navigate to travel buddy form
      navigate('/travel-buddy-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'tour_guiders') {
      // Navigate to tour guider form
      navigate('/tour-guider-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'local_tour_packages') {
      // Navigate to local tour package form
      navigate('/local-tour-package-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'travelsafe_help_professionals') {
      // Navigate to travel safe help professional form
      navigate('/travel-safe-help-professional-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'rent_land_camping_parking') {
      // Navigate to rent land camping parking form
      navigate('/rent-land-camping-parking-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'hotels_accommodations') {
      // Navigate to hotels accommodations form
      navigate('/hotels-accommodations-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'cafes_restaurants') {
      // Navigate to cafes restaurants form
      navigate('/cafes-restaurants-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'foods_beverages') {
      // Navigate to foods beverages form
      navigate('/foods-beverages-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'souvenirs_collectibles') {
      // Navigate to souvenirs & collectibles form
      navigate('/souvenirs-collectibles-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'vehicle_rentals_hire') {
      // Navigate to vehicle rentals hire form
      navigate('/vehicle-rentals-hire-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'professional_drivers') {
      // Navigate to professional drivers form
      navigate('/professional-drivers-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'vehicle_repairs_mechanics') {
      // Navigate to vehicle repairs mechanics form
      navigate('/vehicle-repairs-mechanics-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'event_planners_coordinators') {
      // Navigate to event planners coordinators form
      navigate('/event-planners-coordinators-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'creative_photographers') {
      // Navigate to creative photographers form
      navigate('/creative-photographers-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'decorators_florists') {
      // Navigate to decorators florists form
      navigate('/decorators-florists-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'salon_makeup_artists') {
      // Navigate to salon makeup artists form
      navigate('/salon-makeup-artists-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'fashion_designers') {
      // Navigate to fashion designers form
      navigate('/fashion-designers-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'expert_doctors') {
      // Navigate to expert doctors form
      navigate('/expert-doctors-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'professional_lawyers') {
      // Navigate to professional lawyers form
      navigate('/professional-lawyers-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'advisors_counselors') {
      // Navigate to advisors counselors form
      navigate('/advisors-counselors-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'language_translators') {
      // Navigate to language translators form
      navigate('/language-translators-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'expert_architects') {
      // Navigate to expert architects form
      navigate('/expert-architects-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'trusted_astrologists') {
      // Navigate to trusted astrologists form
      navigate('/trusted-astrologists-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'delivery_partners') {
      // Navigate to delivery partners form
      navigate('/delivery-partners-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'graphics_it_tech_repair') {
      // Navigate to graphics IT tech repair form
      navigate('/graphics-it-tech-repair-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'educational_tutoring') {
      // Navigate to educational tutoring form
      navigate('/educational-tutoring-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'currency_exchange') {
      // Navigate to currency exchange form
      navigate('/currency-exchange-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'other_professionals_services') {
      // Navigate to other professionals services form
      navigate('/other-professionals-services-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'babysitters_childcare') {
      // Navigate to babysitters childcare form
      navigate('/babysitters-childcare-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'pet_care_animal_services') {
      // Navigate to pet care animal services form
      navigate('/pet-care-animal-services-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'rent_property_buying_selling') {
      // Navigate to rent property buying selling form
      navigate('/rent-property-buying-selling-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'exclusive_gift_packs') {
      // Navigate to exclusive gift packs form
      navigate('/exclusive-gift-packs-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'jewelry_gem_sellers') {
      // Navigate to jewelry gem sellers form
      navigate('/jewelry-gem-sellers-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'home_office_accessories_tech') {
      // Navigate to home office accessories tech form
      navigate('/home-office-accessories-tech-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'fashion_beauty_clothing') {
      // Navigate to fashion beauty clothing form
      navigate('/fashion-beauty-clothing-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'daily_grocery_essentials') {
      // Navigate to daily grocery essentials form
      navigate('/daily-grocery-essentials-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'organic_herbal_products_spices') {
      // Navigate to organic herbal products spices form
      navigate('/organic-herbal-products-spices-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'books_magazines_educational') {
      // Navigate to books magazines educational form
      navigate('/books-magazines-educational-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'other_items') {
      // Navigate to other items form
      navigate('/other-items-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'exclusive_combo_packages') {
      // Navigate to exclusive combo packages form
      navigate('/exclusive-combo-packages-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'talented_entertainers_artists') {
      // Navigate to talented entertainers artists form
      navigate('/talented-entertainers-artists-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'fitness_health_spas_gym') {
      // Navigate to fitness health spas gym form
      navigate('/fitness-health-spas-gym-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'job_opportunities') {
      // Navigate to job opportunities form
      navigate('/job-opportunities-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'local_sim_mobile_data') {
      // Navigate to local SIM mobile data form
      navigate('/local-sim-mobile-data-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'emergency_services_insurance') {
      // Navigate to emergency services insurance form
      navigate('/emergency-services-insurance-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'live_rides_carpooling') {
      // Navigate to live rides carpooling form
      navigate('/live-rides-carpooling-form', {
        state: { advertisementId: adId }
      });
    } else if (advertisement.category === 'events_updates') {
      // Navigate to events updates form
      navigate('/events-updates-form', {
        state: { advertisementId: adId }
      });
    } else {
      // For other categories, show a message that functionality will be implemented later
      setError('Publishing functionality for this category will be available soon');
    }
  };

  // Handle renew
  const handleRenew = (adId) => {
    const advertisement = advertisements.find(ad => ad._id === adId);

    if (!advertisement.expiresAt) {
      // Show professional message for paused expiration
      setError('No need to renew at this time. because your expiration is paused. Please publish your advertisement first.');
      return;
    }

    // Navigate to renewal process with advertisement data
    navigate('/renew-advertisement', {
      state: {
        advertisement: advertisement,
        renewalType: 'renew'
      }
    });
  };

  // Handle Publish Now for tour_guiders
  const handlePublishTourGuider = (adId) => {
    navigate('/tour-guider-form', {
      state: {
        advertisementId: adId
      }
    });
  };

  // Handle Manage
  const handleViewAd = (adId) => {
    const advertisement = advertisements.find(ad => ad._id === adId);

    if (advertisement && advertisement.category === 'travel_buddys') {
      // Navigate to manage travel buddy profile page
      navigate(`/manage-travel-buddy/${adId}`);
    } else if (advertisement && advertisement.category === 'tour_guiders') {
      // Navigate to edit tour guider profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-tour-guider/${advertisement.publishedAdId}`);
      } else {
        setError('Tour guider profile not found');
      }
    } else if (advertisement && advertisement.category === 'local_tour_packages') {
      // Navigate to edit local tour package page
      if (advertisement.publishedAdId) {
        navigate(`/edit-local-tour-package/${advertisement.publishedAdId}`);
      } else {
        setError('Local tour package not found');
      }
    } else if (advertisement && advertisement.category === 'travelsafe_help_professionals') {
      // Navigate to edit travel safe help professional profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-travel-safe-help-professional/${advertisement.publishedAdId}`);
      } else {
        setError('Travel Safe Help Professional profile not found');
      }
    } else if (advertisement && advertisement.category === 'rent_land_camping_parking') {
      // Navigate to edit rent land camping parking page
      if (advertisement.publishedAdId) {
        navigate(`/edit-rent-land-camping-parking/${advertisement.publishedAdId}`);
      } else {
        setError('Rent Land Camping Parking listing not found');
      }
    } else if (advertisement && advertisement.category === 'hotels_accommodations') {
      // Navigate to edit hotels accommodations page
      if (advertisement.publishedAdId) {
        navigate(`/edit-hotels-accommodations/${advertisement.publishedAdId}`);
      } else {
        setError('Hotel/Accommodation listing not found');
      }
    } else if (advertisement && advertisement.category === 'cafes_restaurants') {
      // Navigate to edit cafes restaurants page
      if (advertisement.publishedAdId) {
        navigate(`/edit-cafes-restaurants/${advertisement.publishedAdId}`);
      } else {
        setError('Cafe/Restaurant listing not found');
      }
    } else if (advertisement && advertisement.category === 'foods_beverages') {
      // Navigate to edit foods beverages page
      if (advertisement.publishedAdId) {
        navigate(`/edit-foods-beverages/${advertisement.publishedAdId}`);
      } else {
        setError('Foods & Beverages listing not found');
      }
    } else if (advertisement && advertisement.category === 'souvenirs_collectibles') {
      // Navigate to edit souvenirs & collectibles page
      if (advertisement.publishedAdId) {
        navigate(`/edit-souvenirs-collectibles/${advertisement.publishedAdId}`);
      } else {
        setError('Souvenirs & Collectibles listing not found');
      }
    } else if (advertisement && advertisement.category === 'vehicle_rentals_hire') {
      // Navigate to edit vehicle rentals hire page
      if (advertisement.publishedAdId) {
        navigate(`/edit-vehicle-rentals-hire/${advertisement.publishedAdId}`);
      } else {
        setError('Vehicle Rentals Hire listing not found');
      }
    } else if (advertisement && advertisement.category === 'professional_drivers') {
      // Navigate to edit professional drivers profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-professional-drivers/${advertisement.publishedAdId}`);
      } else {
        setError('Professional Drivers profile not found');
      }
    } else if (advertisement && advertisement.category === 'vehicle_repairs_mechanics') {
      // Navigate to edit vehicle repairs mechanics profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-vehicle-repairs-mechanics/${advertisement.publishedAdId}`);
      } else {
        setError('Vehicle Repairs & Mechanics profile not found');
      }
    } else if (advertisement && advertisement.category === 'event_planners_coordinators') {
      // Navigate to edit event planners coordinators profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-event-planners-coordinators/${advertisement.publishedAdId}`);
      } else {
        setError('Event Planner & Coordinator profile not found');
      }
    } else if (advertisement && advertisement.category === 'creative_photographers') {
      // Navigate to edit creative photographers profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-creative-photographers/${advertisement.publishedAdId}`);
      } else {
        setError('Creative Photographer profile not found');
      }
    } else if (advertisement && advertisement.category === 'decorators_florists') {
      // Navigate to edit decorators florists profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-decorators-florists/${advertisement.publishedAdId}`);
      } else {
        setError('Decorator/Florist profile not found');
      }
    } else if (advertisement && advertisement.category === 'salon_makeup_artists') {
      // Navigate to edit salon makeup artists profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-salon-makeup-artists/${advertisement.publishedAdId}`);
      } else {
        setError('Salon Makeup Artist profile not found');
      }
    } else if (advertisement && advertisement.category === 'fashion_designers') {
      // Navigate to edit fashion designers profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-fashion-designers/${advertisement.publishedAdId}`);
      } else {
        setError('Fashion Designer profile not found');
      }
    } else if (advertisement && advertisement.category === 'expert_doctors') {
      // Navigate to edit expert doctors profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-expert-doctors/${advertisement.publishedAdId}`);
      } else {
        setError('Expert Doctor profile not found');
      }
    } else if (advertisement && advertisement.category === 'professional_lawyers') {
      // Navigate to edit professional lawyers profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-professional-lawyers/${advertisement.publishedAdId}`);
      } else {
        setError('Professional Lawyer profile not found');
      }
    } else if (advertisement && advertisement.category === 'advisors_counselors') {
      // Navigate to edit advisors counselors profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-advisors-counselors/${advertisement.publishedAdId}`);
      } else {
        setError('Advisor/Counselor profile not found');
      }
    } else if (advertisement && advertisement.category === 'language_translators') {
      // Navigate to edit language translators profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-language-translators/${advertisement.publishedAdId}`);
      } else {
        setError('Language Translator profile not found');
      }
    } else if (advertisement && advertisement.category === 'expert_architects') {
      // Navigate to edit expert architects profile page
      if (advertisement.publishedAdId) {
        navigate(`/expert-architects-edit/${advertisement.publishedAdId}`);
      } else {
        setError('Expert Architect profile not found');
      }
    } else if (advertisement && advertisement.category === 'trusted_astrologists') {
      // Navigate to edit trusted astrologists profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-trusted-astrologists/${advertisement.publishedAdId}`);
      } else {
        setError('Trusted Astrologist profile not found');
      }
    } else if (advertisement && advertisement.category === 'delivery_partners') {
      // Navigate to edit delivery partners profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-delivery-partners/${advertisement.publishedAdId}`);
      } else {
        setError('Delivery Partner profile not found');
      }
    } else if (advertisement && advertisement.category === 'graphics_it_tech_repair') {
      // Navigate to edit graphics IT tech repair profile page
      if (advertisement.publishedAdId) {
        navigate(`/graphics-it-tech-repair/${advertisement.publishedAdId}/edit`);
      } else {
        setError('Graphics IT Tech Repair profile not found');
      }
    } else if (advertisement && advertisement.category === 'educational_tutoring') {
      // Navigate to edit educational tutoring profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-educational-tutoring/${advertisement.publishedAdId}`);
      } else {
        setError('Educational Tutoring profile not found');
      }
    } else if (advertisement && advertisement.category === 'currency_exchange') {
      // Navigate to edit currency exchange profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-currency-exchange/${advertisement.publishedAdId}`);
      } else {
        setError('Currency Exchange profile not found');
      }
    } else if (advertisement && advertisement.category === 'other_professionals_services') {
      // Navigate to edit other professionals services profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-other-professionals-services/${advertisement.publishedAdId}`);
      } else {
        setError('Professional/Service profile not found');
      }
    } else if (advertisement && advertisement.category === 'babysitters_childcare') {
      // Navigate to edit babysitters childcare profile page
      if (advertisement.publishedAdId) {
        navigate(`/babysitters-childcare-edit/${advertisement.publishedAdId}`);
      } else {
        setError('Babysitter/Childcare profile not found');
      }
    } else if (advertisement && advertisement.category === 'pet_care_animal_services') {
      // Navigate to edit pet care animal services profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-pet-care-animal-services/${advertisement.publishedAdId}`);
      } else {
        setError('Pet Care & Animal Services profile not found');
      }
    } else if (advertisement && advertisement.category === 'exclusive_gift_packs') {
      // Navigate to edit exclusive gift packs profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-exclusive-gift-packs/${advertisement.publishedAdId}`);
      } else {
        setError('Exclusive Gift Pack not found');
      }
    } else if (advertisement && advertisement.category === 'jewelry_gem_sellers') {
      // Navigate to edit jewelry gem sellers profile page
      if (advertisement.publishedAdId) {
        navigate(`/jewelry-gem-sellers/${advertisement.publishedAdId}/edit`);
      } else {
        setError('Jewelry Gem Seller profile not found');
      }
    } else if (advertisement && advertisement.category === 'home_office_accessories_tech') {
      // Navigate to edit home office accessories tech profile page
      if (advertisement.publishedAdId) {
        navigate(`/home-office-accessories-tech/${advertisement.publishedAdId}/edit`);
      } else {
        setError('Home Office Accessories & Tech product not found');
      }
    } else if (advertisement && advertisement.category === 'fashion_beauty_clothing') {
      // Navigate to edit fashion beauty clothing profile page
      if (advertisement.publishedAdId) {
        navigate(`/fashion-beauty-clothing/${advertisement.publishedAdId}/edit`);
      } else {
        setError('Fashion Beauty Clothing product not found');
      }
    } else if (advertisement && advertisement.category === 'daily_grocery_essentials') {
      // Navigate to edit daily grocery essentials profile page
      if (advertisement.publishedAdId) {
        navigate(`/daily-grocery-essentials/${advertisement.publishedAdId}/edit`);
      } else {
        setError('Daily Grocery Essentials listing not found');
      }
    } else if (advertisement && advertisement.category === 'organic_herbal_products_spices') {
      // Navigate to edit organic herbal products spices profile page
      if (advertisement.publishedAdId) {
        navigate(`/organic-herbal-products-spices/${advertisement.publishedAdId}/edit`);
      } else {
        setError('Organic Herbal Products & Spices listing not found');
      }
    } else if (advertisement && advertisement.category === 'books_magazines_educational') {
      // Navigate to edit books magazines educational profile page
      if (advertisement.publishedAdId) {
        navigate(`/books-magazines-educational/${advertisement.publishedAdId}/edit`);
      } else {
        setError('Books & Magazines Educational listing not found');
      }
    } else if (advertisement && advertisement.category === 'other_items') {
      // Navigate to edit other items profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-other-items/${advertisement.publishedAdId}`);
      } else {
        setError('Other Items listing not found');
      }
    } else if (advertisement && advertisement.category === 'exclusive_combo_packages') {
      // Navigate to edit exclusive combo packages profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-exclusive-combo-packages/${advertisement.publishedAdId}`);
      } else {
        setError('Exclusive Combo Package not found');
      }
    } else if (advertisement && advertisement.category === 'talented_entertainers_artists') {
      // Navigate to edit talented entertainers artists profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-talented-entertainers-artists/${advertisement.publishedAdId}`);
      } else {
        setError('Talented Entertainers & Artists profile not found');
      }
    } else if (advertisement && advertisement.category === 'fitness_health_spas_gym') {
      // Navigate to edit fitness health spas gym profile page
      if (advertisement.publishedAdId) {
        navigate(`/fitness-health-spas-gym/${advertisement.publishedAdId}/edit`);
      } else {
        setError('Fitness Health Spas Gym profile not found');
      }
    } else if (advertisement && advertisement.category === 'job_opportunities') {
      // Navigate to edit job opportunities profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-job-opportunities/${advertisement.publishedAdId}`);
      } else {
        setError('Job Opportunity not found');
      }
    } else if (advertisement && advertisement.category === 'local_sim_mobile_data') {
      // Navigate to edit local SIM mobile data profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-local-sim-mobile-data/${advertisement.publishedAdId}`);
      } else {
        setError('Local SIM Mobile Data profile not found');
      }
    } else if (advertisement && advertisement.category === 'emergency_services_insurance') {
      // Navigate to edit emergency services insurance profile page
      if (advertisement.publishedAdId) {
        navigate(`/edit-emergency-services-insurance/${advertisement.publishedAdId}`);
      } else {
        setError('Emergency Services Insurance profile not found');
      }
    } else if (advertisement && advertisement.category === 'live_rides_carpooling') {
      // Navigate to edit live rides carpooling page
      if (advertisement.publishedAdId) {
        navigate(`/edit-live-rides-carpooling/${advertisement.publishedAdId}`);
      } else {
        setError('Live Rides Carpooling not found');
      }
    } else if (advertisement && advertisement.category === 'events_updates') {
      // Navigate to edit events updates page
      console.log('Events Updates advertisement:', advertisement);
      console.log('publishedAdId:', advertisement.publishedAdId);

      if (advertisement.publishedAdId) {
        console.log('Navigating to edit page with ID:', advertisement.publishedAdId);
        navigate(`/edit-events-updates/${advertisement.publishedAdId}`);
      } else {
        console.error('No publishedAdId found for events_updates advertisement');
        setError('Events Updates not found. Please publish the event first.');
      }
    } else {
      console.log('Manage clicked for ad:', adId);
      // Other category management functionality will be implemented later
    }
  };

  // Handle View Published Profile
  const handleViewPublishedProfile = (adId) => {
    const advertisement = advertisements.find(ad => ad._id === adId);

    if (advertisement && advertisement.category === 'travel_buddys') {
      // Navigate to travel buddy detail view
      if (advertisement.publishedAdId) {
        navigate(`/travel-buddy/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'tour_guiders') {
      // Navigate to tour guider detail view
      if (advertisement.publishedAdId) {
        navigate(`/tour-guider/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'local_tour_packages') {
      // Navigate to local tour package detail view
      if (advertisement.publishedAdId) {
        navigate(`/local-tour-package/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'travelsafe_help_professionals') {
      // Navigate to travel safe help professional detail view
      if (advertisement.publishedAdId) {
        navigate(`/travel-safe-help-professional/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'rent_land_camping_parking') {
      // Navigate to rent land camping parking detail view
      if (advertisement.publishedAdId) {
        navigate(`/rent-land-camping-parking/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'hotels_accommodations') {
      // Navigate to hotels accommodations detail view
      if (advertisement.publishedAdId) {
        navigate(`/hotels-accommodations/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'cafes_restaurants') {
      // Navigate to cafes restaurants detail view
      if (advertisement.publishedAdId) {
        navigate(`/cafes-restaurants/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'foods_beverages') {
      // Navigate to foods beverages detail view
      if (advertisement.publishedAdId) {
        navigate(`/foods-beverages/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'souvenirs_collectibles') {
      // Navigate to souvenirs & collectibles detail view
      if (advertisement.publishedAdId) {
        navigate(`/souvenirs-collectibles/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'vehicle_rentals_hire') {
      // Navigate to vehicle rentals hire detail view
      if (advertisement.publishedAdId) {
        navigate(`/vehicle-rentals-hire/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'professional_drivers') {
      // Navigate to professional drivers detail view
      if (advertisement.publishedAdId) {
        navigate(`/professional-drivers/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'vehicle_repairs_mechanics') {
      // Navigate to vehicle repairs mechanics detail view
      if (advertisement.publishedAdId) {
        navigate(`/vehicle-repairs-mechanics/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'event_planners_coordinators') {
      // Navigate to event planners coordinators detail view
      if (advertisement.publishedAdId) {
        navigate(`/event-planners-coordinators/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'creative_photographers') {
      // Navigate to creative photographers detail view
      if (advertisement.publishedAdId) {
        navigate(`/creative-photographers/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'decorators_florists') {
      // Navigate to decorators florists detail view
      if (advertisement.publishedAdId) {
        navigate(`/decorators-florists/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'salon_makeup_artists') {
      // Navigate to salon makeup artists detail view
      if (advertisement.publishedAdId) {
        navigate(`/salon-makeup-artists/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'fashion_designers') {
      // Navigate to fashion designers detail view
      if (advertisement.publishedAdId) {
        navigate(`/fashion-designers/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'expert_doctors') {
      // Navigate to expert doctors detail view
      if (advertisement.publishedAdId) {
        navigate(`/expert-doctors/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'professional_lawyers') {
      // Navigate to professional lawyers detail view
      if (advertisement.publishedAdId) {
        navigate(`/professional-lawyers/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'advisors_counselors') {
      // Navigate to advisors counselors detail view
      if (advertisement.publishedAdId) {
        navigate(`/advisors-counselors/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'language_translators') {
      // Navigate to language translators detail view
      if (advertisement.publishedAdId) {
        navigate(`/language-translators/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'expert_architects') {
      // Navigate to expert architects detail view
      if (advertisement.publishedAdId) {
        navigate(`/expert-architects/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'trusted_astrologists') {
      // Navigate to trusted astrologists detail view
      if (advertisement.publishedAdId) {
        navigate(`/trusted-astrologists/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'delivery_partners') {
      // Navigate to delivery partners detail view
      if (advertisement.publishedAdId) {
        navigate(`/delivery-partners/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'graphics_it_tech_repair') {
      // Navigate to graphics IT tech repair detail view
      if (advertisement.publishedAdId) {
        navigate(`/graphics-it-tech-repair/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'educational_tutoring') {
      // Navigate to educational tutoring detail view
      if (advertisement.publishedAdId) {
        navigate(`/educational-tutoring/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'currency_exchange') {
      // Navigate to currency exchange detail view
      if (advertisement.publishedAdId) {
        navigate(`/currency-exchange/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'other_professionals_services') {
      // Navigate to other professionals services detail view
      if (advertisement.publishedAdId) {
        navigate(`/other-professionals-services/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'babysitters_childcare') {
      // Navigate to babysitters childcare detail view
      if (advertisement.publishedAdId) {
        navigate(`/babysitters-childcare-detail/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'pet_care_animal_services') {
      // Navigate to pet care animal services detail view
      if (advertisement.publishedAdId) {
        navigate(`/pet-care-animal-services/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'exclusive_gift_packs') {
      // Navigate to exclusive gift packs detail view
      if (advertisement.publishedAdId) {
        navigate(`/exclusive-gift-packs/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'jewelry_gem_sellers') {
      // Navigate to jewelry gem sellers detail view
      if (advertisement.publishedAdId) {
        navigate(`/jewelry-gem-sellers/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'home_office_accessories_tech') {
      // Navigate to home office accessories tech detail view
      if (advertisement.publishedAdId) {
        navigate(`/home-office-accessories-tech/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'fashion_beauty_clothing') {
      // Navigate to fashion beauty clothing detail view
      if (advertisement.publishedAdId) {
        navigate(`/fashion-beauty-clothing/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'daily_grocery_essentials') {
      // Navigate to daily grocery essentials detail view
      if (advertisement.publishedAdId) {
        navigate(`/daily-grocery-essentials/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'organic_herbal_products_spices') {
      // Navigate to organic herbal products spices detail view
      if (advertisement.publishedAdId) {
        navigate(`/organic-herbal-products-spices/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'books_magazines_educational') {
      // Navigate to books magazines educational detail view
      if (advertisement.publishedAdId) {
        navigate(`/books-magazines-educational/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'other_items') {
      // Navigate to other items detail view
      if (advertisement.publishedAdId) {
        navigate(`/other-items/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'exclusive_combo_packages') {
      // Navigate to exclusive combo packages detail view
      if (advertisement.publishedAdId) {
        navigate(`/exclusive-combo-packages/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'talented_entertainers_artists') {
      // Navigate to talented entertainers artists detail view
      if (advertisement.publishedAdId) {
        navigate(`/talented-entertainers-artists/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'fitness_health_spas_gym') {
      // Navigate to fitness health spas gym detail view
      if (advertisement.publishedAdId) {
        navigate(`/fitness-health-spas-gym/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'job_opportunities') {
      // Navigate to job opportunities detail view
      if (advertisement.publishedAdId) {
        navigate(`/job-opportunities/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'local_sim_mobile_data') {
      // Navigate to local SIM mobile data detail view
      if (advertisement.publishedAdId) {
        navigate(`/local-sim-mobile-data/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'emergency_services_insurance') {
      // Navigate to emergency services insurance detail view
      if (advertisement.publishedAdId) {
        navigate(`/emergency-services-insurance/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'live_rides_carpooling') {
      // Navigate to live rides carpooling detail view
      if (advertisement.publishedAdId) {
        navigate(`/live-rides-carpooling/${advertisement.publishedAdId}`);
      }
    } else if (advertisement && advertisement.category === 'events_updates') {
      // Navigate to events updates detail view
      if (advertisement.publishedAdId) {
        navigate(`/events-updates/${advertisement.publishedAdId}`);
      }
    }
  };

  // Handle View Published Profile for rent_property_buying_selling
  const handleViewPublishedRentProperty = (adId) => {
    const advertisement = advertisements.find(ad => ad._id === adId);

    if (advertisement && advertisement.category === 'rent_property_buying_selling') {
      // Navigate to rent property buying selling detail view
      if (advertisement.publishedAdId) {
        navigate(`/rent-property-buying-selling/${advertisement.publishedAdId}`);
      }
    }
  };

  // Handle expired slot renew
  const handleExpiredSlotRenew = (adId) => {
    const advertisement = advertisements.find(ad => ad._id === adId);

    // Navigate to renewal process with advertisement data
    navigate('/renew-advertisement', {
      state: {
        advertisement: advertisement,
        renewalType: 'expired'
      }
    });
  };

  // Check if advertisement is expired
  const isAdvertisementExpired = (ad) => {
    if (!ad.expiresAt) return false;
    return new Date(ad.expiresAt) < new Date();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Advertisements
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your travel advertisements and promotional content
            </p>
          </div>
          <button
            onClick={() => navigate('/post-advertisement')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Ad</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Slot ID (e.g., AD12345678)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1.5 text-sm font-medium"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-1.5 text-sm font-medium"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </form>

          {/* Filter Options */}
          {showFilters && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="expired">Expired</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Plan Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Plan
                  </label>
                  <select
                    value={filters.plan}
                    onChange={(e) => handleFilterChange('plan', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Plans</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {filterOptions.categories?.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {pagination.totalCount || 0} advertisement{(pagination.totalCount || 0) !== 1 ? 's' : ''} found
                </span>
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* User Verification Notice */}
      {!loading && !error && advertisements.length > 0 && !userVerificationStatus.loading && !userVerificationStatus.isVerified && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                  Verify Your Identity
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Verify now to get a verified badge for all your advertisements
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowVerificationModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Verify Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Advertisements List */}
      {!loading && !error && (
        <>
          {advertisements.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                  <Megaphone className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Start Your Advertising Journey
                </h2>

                <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-6">
                  Create, manage, and track your travel advertisements. Promote your services
                  and reach more customers with our powerful advertising platform.
                </p>

                <button
                  onClick={() => navigate('/post-advertisement')}
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Advertisement</span>
                </button>
              </div>

              {/* Features Preview */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Track Performance
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Monitor views, clicks, and engagement metrics
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mb-4">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Analytics Dashboard
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Detailed insights and performance reports
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Premium Placement
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Get maximum visibility for your business
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Advertisements Grid */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advertisements.map((ad) => (
                <div key={ad._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
                  {/* Ad Header */}
                  <div className="p-6 flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getPlanIcon(ad.selectedPlan)}
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                          {ad.selectedPlan === 'hourly' && ad.planDuration?.hours
                            ? `${ad.selectedPlan} (${ad.planDuration.hours}h)`
                            : ad.selectedPlan
                          }
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                        {ad.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCategoryName(ad.category)}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          {ad.slotId}
                        </span>
                        {isAdvertisementExpired(ad) && (
                          <span className="text-xs font-bold bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-2 py-1 rounded-full border border-red-200 dark:border-red-800">
                            INVISIBLE
                          </span>
                        )}
                        {userVerificationStatus.isVerified && (
                          <div className="relative inline-flex items-center justify-center">
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
                                fill="#1D9BF0"
                                stroke="#FFFFFF"
                                strokeWidth="1"
                              />
                              <path
                                d="M9 12L11 14L15 10"
                                stroke="#FFFFFF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Advertisement Slot
                    </p>

                    {/* Ad Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Slot ID:</span>
                        <span className="font-mono text-gray-900 dark:text-white">
                          {ad.slotId}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {ad.finalAmount} {ad.paymentMethod}
                        </span>
                      </div>

                      {ad.usedPromoCode && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Promo Code:</span>
                          <span className="font-medium text-green-600">
                            {ad.usedPromoCode}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Expires:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {ad.expiresAt ? (
                            new Date(ad.expiresAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })
                          ) : (
                            <span className="text-orange-600 dark:text-orange-400 font-semibold">
                              Expiration Paused
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Warning Message for slots without paused expiration */}
                  {ad.status === 'active' && ad.expiresAt && !isAdvertisementExpired(ad) && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-4 mx-6">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="text-sm text-amber-700 dark:text-amber-300">
                          <p className="font-medium mb-1">Expiration Notice</p>
                          <p>
                            If you are not ready to publish your advertisement now, use the "Pause Expiration" option to prevent your slot from expiring.
                            Without pausing, your advertisement slot might expire before you publish your content.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ad Info */}
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Advertisement Status: <span className="font-medium text-gray-900 dark:text-white capitalize">{ad.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ad Actions */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                    <div className="flex space-x-2">
                      {/* Active status with expiration date - Show Pause Expiration + Publish Now */}
                      {ad.status === 'active' && ad.expiresAt && !isAdvertisementExpired(ad) && (
                        <>
                          {/* Pause Expiration Button */}
                          <button
                            onClick={() => handlePauseExpiration(ad._id)}
                            disabled={actionLoading[ad._id] === 'pausing'}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading[ad._id] === 'pausing' ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Pause className="w-4 h-4" />
                            )}
                            <span>Pause Expiration</span>
                          </button>

                          {/* Publish Now Button */}
                          <button
                            onClick={() => handlePublishNow(ad._id)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors text-sm"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>Publish Now</span>
                          </button>
                        </>
                      )}

                      {/* Active status with no expiration (paused) - Show Publish Now + Renew */}
                      {ad.status === 'active' && !ad.expiresAt && !isAdvertisementExpired(ad) && (
                        <>
                          {/* Publish Now Button */}
                          <button
                            onClick={() => handlePublishNow(ad._id)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors text-sm"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>Publish Now</span>
                          </button>

                          {/* Renew Button */}
                          <button
                            onClick={() => handleRenew(ad._id)}
                            disabled={!ad.expiresAt}
                            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors text-sm ${
                              !ad.expiresAt
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
                                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/30'
                            }`}
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Renew</span>
                          </button>
                        </>
                      )}

                      {/* Published status - Show Manage + View + Renew */}
                      {ad.status === 'Published' && !isAdvertisementExpired(ad) && (
                        <>
                          {/* Manage Button */}
                          <button
                            onClick={() => handleViewAd(ad._id)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Manage</span>
                          </button>

                          {/* View Button */}
                          <button
                            onClick={() => {
                              if (ad.category === 'rent_property_buying_selling') {
                                handleViewPublishedRentProperty(ad._id);
                              } else if (ad.category === 'events_updates') {
                                handleViewPublishedProfile(ad._id);
                              } else {
                                handleViewPublishedProfile(ad._id);
                              }
                            }}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>

                          {/* Renew Button */}
                          <button
                            onClick={() => handleRenew(ad._id)}
                            disabled={!ad.expiresAt}
                            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors text-sm ${
                              !ad.expiresAt
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
                                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/30'
                            }`}
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Renew</span>
                          </button>
                        </>
                      )}

                      {/* Expired status or expired advertisement - Show only Expired Slot Renew Now */}
                      {(ad.status === 'expired' || isAdvertisementExpired(ad)) && (
                        <button
                          onClick={() => handleExpiredSlotRenew(ad._id)}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm font-semibold border-2 border-red-200 dark:border-red-800"
                        >
                          <RefreshCw className="w-5 h-5" />
                          <span>Expired Slot Renew Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
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
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        pageNum === pagination.currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
            </div>
          )}
        </>
      )}

      {/* User Verification Modal */}
      <UserVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerificationComplete={handleVerificationComplete}
      />
    </div>
  );
};

export default Advertisements;
