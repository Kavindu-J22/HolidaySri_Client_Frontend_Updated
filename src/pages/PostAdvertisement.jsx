import React, { useState, useEffect } from 'react';
import {
  Star,
  Zap,
  TrendingUp,
  Users,
  MapPin,
  Car,
  Camera,
  Briefcase,
  Heart,
  ShoppingBag,
  Music,
  Target,
  Shield,
  Info,
  Eye,
  Search,
  X,
  Filter,
  ArrowRight,
  Gem,
  Diamond
} from 'lucide-react';
import { hscAPI, advertisementAPI } from '../config/api';
import AdvertisementPlanPopup from '../components/common/AdvertisementPlanPopup';

const PostAdvertisement = () => {
  const [hscValue, setHscValue] = useState(100);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [slotCharges, setSlotCharges] = useState(null);

  // Popup state management
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [selectedSlotForPopup, setSelectedSlotForPopup] = useState(null);

  // Fetch current HSC value and slot charges
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch HSC value
        const hscResponse = await hscAPI.getInfo();
        setHscValue(hscResponse.data.hscValue || 100);
        
        // Fetch slot charges from admin configuration
        const slotResponse = await advertisementAPI.getSlotCharges();
        setSlotCharges(slotResponse.data.config);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setHscValue(100);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Convert LKR to HSC
  const convertToHSC = (lkrAmount) => {
    return parseFloat((lkrAmount / hscValue).toFixed(2));
  };

  // Get pricing from admin configuration
  const getPricing = (categoryKey, slotKey) => {
    if (!slotCharges) return null;
    
    if (categoryKey === 'home_banner') {
      const homeBanner = slotCharges.homeBanner;
      return {
        hourly: homeBanner?.hourlyCharge ? { lkr: homeBanner.hourlyCharge, hsc: convertToHSC(homeBanner.hourlyCharge) } : null,
        daily: { lkr: homeBanner?.dailyCharge || 5000, hsc: convertToHSC(homeBanner?.dailyCharge || 5000) },
        monthly: { lkr: homeBanner?.monthlyCharge || 100000, hsc: convertToHSC(homeBanner?.monthlyCharge || 100000) },
        yearly: { lkr: homeBanner?.yearlyCharge || 1000000, hsc: convertToHSC(homeBanner?.yearlyCharge || 1000000) }
      };
    }
    
    // Category and slot mapping
    const categoryMapping = {
      'tourism_travel': 'tourismTravel',
      'accommodation_dining': 'accommodationDining',
      'vehicles_transport': 'vehiclesTransport',
      'events_management': 'eventsManagement',
      'professionals_services': 'professionalsServices',
      'caring_donations': 'caringDonations',
      'marketplace_shopping': 'marketplaceShopping',
      'entertainment_fitness': 'entertainmentFitness',
      'special_opportunities': 'specialOpportunities',
      'essential_services': 'essentialServices'
    };
    
    const slotMapping = {
      'travel_buddys': 'travelBuddys',
      'tour_guiders': 'tourGuiders',
      'local_tour_packages': 'localTourPackages',
      'customize_tour_package': 'customizeTourPackage',
      'travelsafe_help_professionals': 'travelSafeHelpProfessionals',
      'rent_land_camping_parking': 'rentLandCampingParking',
      'hotels_accommodations': 'hotelsAccommodations',
      'cafes_restaurants': 'cafesRestaurants',
      'foods_beverages': 'foodsBeverages',
      'vehicle_rentals_hire': 'vehicleRentalsHire',
      'live_rides_carpooling': 'liveRidesCarpooling',
      'professional_drivers': 'professionalDrivers',
      'vehicle_repairs_mechanics': 'vehicleRepairsMechanics',
      'events_updates': 'eventsUpdates',
      'event_planners_coordinators': 'eventPlannersCoordinators',
      'creative_photographers': 'creativePhotographers',
      'decorators_florists': 'decoratorsFlorists',
      'salon_makeup_artists': 'salonMakeupArtists',
      'fashion_designers': 'fashionDesigners',
      'expert_doctors': 'expertDoctors',
      'professional_lawyers': 'professionalLawyers',
      'advisors_counselors': 'advisorsCounselors',
      'language_translators': 'languageTranslators',
      'expert_architects': 'expertArchitects',
      'trusted_astrologists': 'trustedAstrologists',
      'delivery_partners': 'deliveryPartners',
      'graphics_it_tech_repair': 'graphicsItTechRepair',
      'educational_tutoring': 'educationalTutoring',
      'currency_exchange': 'currencyExchange',
      'other_professionals_services': 'otherProfessionalsServices',
      'caregivers_time_currency': 'caregiversTimeCurrency',
      'babysitters_childcare': 'babysittersChildcare',
      'pet_care_animal_services': 'petCareAnimalServices',
      'donations_raise_fund': 'donationsRaiseFund',
      'rent_property_buying_selling': 'rentPropertyBuyingSelling',
      'exclusive_gift_packs': 'exclusiveGiftPacks',
      'souvenirs_collectibles': 'souvenirsCollectibles',
      'jewelry_gem_sellers': 'jewelryGemSellers',
      'home_office_accessories_tech': 'homeOfficeAccessoriesTech',
      'fashion_beauty_clothing': 'fashionBeautyClothing',
      'daily_grocery_essentials': 'dailyGroceryEssentials',
      'organic_herbal_products_spices': 'organicHerbalProductsSpices',
      'books_magazines_educational': 'booksMagazinesEducational',
      'other_items': 'otherItems',
      'create_link_own_store': 'createLinkOwnStore',
      'exclusive_combo_packages': 'exclusiveComboPackages',
      'talented_entertainers_artists': 'talentedEntertainersArtists',
      'fitness_health_spas_gym': 'fitnessHealthSpasGym',
      'cinema_movie_hub': 'cinemaMovieHub',
      'social_media_promotions': 'socialMediaPromotions',
      'job_opportunities': 'jobOpportunities',
      'crypto_consulting_signals': 'cryptoConsultingSignals',
      'local_sim_mobile_data': 'localSimMobileData',
      'custom_ads_campaigns': 'customAdsCampaigns',
      'exclusive_offers_promotions': 'exclusiveOffersPromotions',
      'emergency_services_insurance': 'emergencyServicesInsurance'
    };
    
    const backendCategoryKey = categoryMapping[categoryKey];
    const backendSlotKey = slotMapping[slotKey];
    
    if (!backendCategoryKey || !backendSlotKey) return null;
    
    const categoryData = slotCharges[backendCategoryKey];
    const slotData = categoryData?.[backendSlotKey];
    
    if (!slotData) return null;
    
    return {
      daily: { lkr: slotData.dailyCharge || 1000, hsc: convertToHSC(slotData.dailyCharge || 1000) },
      monthly: { lkr: slotData.monthlyCharge || 25000, hsc: convertToHSC(slotData.monthlyCharge || 25000) },
      yearly: { lkr: slotData.yearlyCharge || 250000, hsc: convertToHSC(slotData.yearlyCharge || 250000) }
    };
  };

  // Handle Post Now button click
  const handlePostNow = (category, slot) => {
    const selectedSlot = {
      categoryId: category.id,
      slotId: slot.id,
      name: slot.name,
      description: slot.description,
      categoryName: category.name
    };

    setSelectedSlotForPopup(selectedSlot);
    setShowPlanPopup(true);
  };

  // Handle popup close
  const handlePopupClose = () => {
    setShowPlanPopup(false);
    setSelectedSlotForPopup(null);
  };

  // Advertisement slot categories with their slots
  const advertisementCategories = [
    {
      id: 'home_banner',
      name: 'Home Banner',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      description: 'Premium placement on the home page with maximum visibility',
      isSpecial: true,
      slots: [
        {
          id: 'home_banner_slot',
          name: 'Home Banner Advertisement Slot',
          description: 'Get maximum exposure with our premium home page banner placement. Your advertisement will be the first thing visitors see.',
          features: ['Maximum visibility', 'Premium placement', 'High click-through rates', 'Mobile optimized']
        }
      ]
    },
    {
      id: 'tourism_travel',
      name: 'Tourism & Travel',
      icon: MapPin,
      color: 'from-blue-500 to-indigo-600',
      description: 'Travel buddies, tour guides, packages, and travel services',
      slots: [
        {
          id: 'travel_buddys',
          name: 'Travel Buddys Advertisement',
          description: 'Connect with fellow travelers and build your travel community. Perfect for travel enthusiasts and group organizers.',
          features: ['Community building', 'Group travel focus', 'Social networking', 'Travel matching']
        },
        {
          id: 'tour_guiders',
          name: 'Tour Guiders Advertisement',
          description: 'Showcase your expertise as a professional tour guide. Reach tourists looking for authentic local experiences.',
          features: ['Professional credibility', 'Local expertise showcase', 'Tourist targeting', 'Experience highlights']
        },
        {
          id: 'local_tour_packages',
          name: 'Local Tour Packages Advertisement',
          description: 'Promote your carefully crafted local tour packages. Ideal for tour operators and travel agencies.',
          features: ['Package highlights', 'Itinerary showcase', 'Pricing transparency', 'Booking integration']
        },
        {
          id: 'customize_tour_package',
          name: 'Customize Tour Package Advertisement',
          description: 'Offer personalized tour experiences tailored to individual preferences. Perfect for bespoke travel services.',
          features: ['Customization options', 'Personal touch', 'Flexible itineraries', 'Premium positioning'],
          hidden: true
        },
        {
          id: 'travelsafe_help_professionals',
          name: 'TravelSafe & Help Professionals Advertisement',
          description: 'Provide essential travel safety and assistance services. Build trust with safety-conscious travelers.',
          features: ['Safety assurance', 'Emergency support', 'Professional help', 'Trust building']
        },
        {
          id: 'rent_land_camping_parking',
          name: 'Rent a Land for Camping or Parking Advertisement',
          description: 'Offer your land for camping, parking, or outdoor activities. Great for property owners in scenic locations.',
          features: ['Property showcase', 'Location benefits', 'Facility details', 'Booking system']
        }
      ]
    },
    {
      id: 'accommodation_dining',
      name: 'Accommodation & Dining',
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      description: 'Hotels, restaurants, cafes, and food services',
      slots: [
        {
          id: 'hotels_accommodations',
          name: 'Hotels & Accommodations Advertisement',
          description: 'Showcase your hotel, guesthouse, or accommodation facility. Attract travelers looking for comfortable stays.',
          features: ['Room showcases', 'Amenity highlights', 'Location benefits', 'Booking integration']
        },
        {
          id: 'cafes_restaurants',
          name: 'Cafes & Restaurants Advertisement',
          description: 'Promote your dining establishment and attract food lovers. Perfect for restaurants, cafes, and eateries.',
          features: ['Menu highlights', 'Ambiance showcase', 'Special offers', 'Location visibility']
        },
        {
          id: 'foods_beverages',
          name: 'Foods & Beverages Advertisement',
          description: 'Market your food products, beverages, or catering services. Ideal for food producers and suppliers.',
          features: ['Product showcase', 'Quality highlights', 'Distribution info', 'Special promotions']
        }
      ]
    },
    {
      id: 'vehicles_transport',
      name: 'Vehicles & Transport',
      icon: Car,
      color: 'from-orange-500 to-red-500',
      description: 'Vehicle rentals, rides, drivers, and transport services',
      slots: [
        {
          id: 'vehicle_rentals_hire',
          name: 'Vehicle Rentals & Hire Services Advertisement',
          description: 'Promote your vehicle rental business. Connect with travelers needing reliable transportation.',
          features: ['Fleet showcase', 'Rental terms', 'Service areas', 'Booking system']
        },
        {
          id: 'live_rides_carpooling',
          name: 'Live Rides Updates & Carpooling Advertisement',
          description: 'Offer ride-sharing and carpooling services. Help travelers find affordable transportation options.',
          features: ['Real-time updates', 'Route information', 'Cost sharing', 'Community building']
        },
        {
          id: 'professional_drivers',
          name: 'Professional Drivers Advertisement',
          description: 'Showcase your driving services and expertise. Perfect for professional chauffeurs and tour drivers.',
          features: ['Experience highlights', 'Service areas', 'Vehicle types', 'Professional credentials']
        },
        {
          id: 'vehicle_repairs_mechanics',
          name: 'Vehicle Repairs & Mechanics Advertisement',
          description: 'Promote your automotive repair and maintenance services. Essential for travelers with vehicle issues.',
          features: ['Service specialties', 'Emergency support', 'Location details', 'Contact information']
        }
      ]
    },
    {
      id: 'events_management',
      name: 'Events & Management',
      icon: Camera,
      color: 'from-pink-500 to-rose-500',
      description: 'Event planning, photography, decoration, and related services',
      slots: [
        {
          id: 'events_updates',
          name: 'Events Updates Advertisement',
          description: 'Keep travelers informed about upcoming events, festivals, and cultural activities in your area.',
          features: ['Event promotion', 'Cultural highlights', 'Date & venue info', 'Ticket integration']
        },
        {
          id: 'event_planners_coordinators',
          name: 'Expert Event Planners & Day Coordinators Advertisement',
          description: 'Showcase your event planning expertise for weddings, corporate events, and special occasions.',
          features: ['Portfolio showcase', 'Service packages', 'Client testimonials', 'Booking system']
        },
        {
          id: 'creative_photographers',
          name: 'Creative Photographers Advertisement',
          description: 'Display your photography skills and attract clients looking for professional photo services.',
          features: ['Portfolio gallery', 'Service types', 'Pricing packages', 'Contact booking']
        },
        {
          id: 'decorators_florists',
          name: 'Decorators & Florists Advertisement',
          description: 'Promote your decoration and floral arrangement services for events and special occasions.',
          features: ['Design showcase', 'Seasonal offerings', 'Custom arrangements', 'Event specialization']
        },
        {
          id: 'salon_makeup_artists',
          name: 'Salon & Makeup Artists Advertisement',
          description: 'Attract clients looking for beauty services, makeup, and salon treatments for special occasions.',
          features: ['Service menu', 'Before/after gallery', 'Appointment booking', 'Special packages']
        },
        {
          id: 'fashion_designers',
          name: 'Fashion Designers Advertisement',
          description: 'Showcase your fashion designs and attract clients looking for custom clothing and styling services.',
          features: ['Design portfolio', 'Custom services', 'Fashion trends', 'Client gallery']
        }
      ]
    },
    {
      id: 'professionals_services',
      name: 'Professionals & Services',
      icon: Briefcase,
      color: 'from-indigo-500 to-purple-600',
      description: 'Professional services including doctors, lawyers, and consultants',
      slots: [
        {
          id: 'expert_doctors',
          name: 'Expert Doctors Advertisement',
          description: 'Promote your medical practice and attract patients seeking quality healthcare services.',
          features: ['Specialization highlight', 'Credentials display', 'Appointment booking', 'Emergency services']
        },
        {
          id: 'professional_lawyers',
          name: 'Professional Lawyers Advertisement',
          description: 'Showcase your legal expertise and attract clients needing professional legal services.',
          features: ['Practice areas', 'Success stories', 'Consultation booking', 'Legal resources']
        },
        {
          id: 'advisors_counselors',
          name: 'Experienced Advisors & Counselors Advertisement',
          description: 'Connect with clients seeking professional advice, counseling, and consultation services.',
          features: ['Expertise areas', 'Session types', 'Confidential services', 'Flexible scheduling']
        },
        {
          id: 'language_translators',
          name: 'Language Translators & Interpreters Advertisement',
          description: 'Offer your translation and interpretation services to international travelers and businesses.',
          features: ['Language pairs', 'Service types', 'Certification display', 'Quick turnaround']
        },
        {
          id: 'expert_architects',
          name: 'Expert Architects Advertisement',
          description: 'Showcase your architectural services and attract clients for construction and design projects.',
          features: ['Project portfolio', 'Design styles', 'Service packages', 'Consultation offers']
        },
        {
          id: 'trusted_astrologists',
          name: 'Trusted Astrologists Advertisement',
          description: 'Provide astrological services and guidance to clients seeking spiritual and life advice.',
          features: ['Service types', 'Reading options', 'Consultation methods', 'Client testimonials']
        },
        {
          id: 'delivery_partners',
          name: 'Delivery Partners Advertisement',
          description: 'Promote your delivery and logistics services to businesses and individuals needing reliable transport.',
          features: ['Service areas', 'Delivery types', 'Tracking system', 'Competitive rates']
        },
        {
          id: 'graphics_it_tech_repair',
          name: 'Graphics/IT Supports & Tech Repair Services Advertisement',
          description: 'Offer technical support, IT services, and device repair solutions to travelers and businesses.',
          features: ['Service categories', 'Emergency support', 'Remote assistance', 'Warranty options']
        },
        {
          id: 'educational_tutoring',
          name: 'Educational & Tutoring Services Advertisement',
          description: 'Promote your educational services, tutoring, and skill development programs.',
          features: ['Subject expertise', 'Teaching methods', 'Success rates', 'Flexible scheduling']
        },
        {
          id: 'currency_exchange',
          name: 'Currency Exchange Rates & Services Advertisement',
          description: 'Provide currency exchange services with competitive rates for international travelers.',
          features: ['Live rates', 'Multiple currencies', 'Quick service', 'Secure transactions']
        },
        {
          id: 'other_professionals_services',
          name: 'Other Professionals & Services Advertisement',
          description: 'Promote any other professional services including cleaning, maintenance, and specialized support.',
          features: ['Service description', 'Availability', 'Contact options', 'Service areas']
        }
      ]
    },
    {
      id: 'caring_donations',
      name: 'Caring & Donations',
      icon: Heart,
      color: 'from-rose-500 to-pink-500',
      description: 'Caregiving, childcare, pet care, and donation services',
      slots: [
        {
          id: 'caregivers_time_currency',
          name: 'Compassionate Caregivers & Earn Time Currency Advertisement',
          description: 'Offer caregiving services and participate in the time currency system for community support.',
          features: ['Care services', 'Time currency', 'Community support', 'Flexible scheduling']
        },
        {
          id: 'babysitters_childcare',
          name: 'Trusted Babysitters & Childcare Help Advertisement',
          description: 'Provide reliable childcare services for traveling families and local parents.',
          features: ['Background checks', 'Experience highlights', 'Age specialization', 'Emergency training']
        },
        {
          id: 'pet_care_animal_services',
          name: 'Pet Care & Animal Services Advertisement',
          description: 'Offer pet care, veterinary services, and animal-related support for travelers with pets.',
          features: ['Pet services', 'Veterinary care', 'Pet boarding', 'Emergency support']
        },
        {
          id: 'donations_raise_fund',
          name: 'Donations / Raise Your Fund Advertisement',
          description: 'Promote charitable causes, fundraising campaigns, and community support initiatives.',
          features: ['Cause promotion', 'Donation tracking', 'Impact stories', 'Community engagement']
        }
      ]
    },
    {
      id: 'marketplace_shopping',
      name: 'Marketplace & Shopping',
      icon: ShoppingBag,
      color: 'from-emerald-500 to-teal-600',
      description: 'E-commerce, retail, and marketplace services',
      slots: [
        {
          id: 'rent_property_buying_selling',
          name: 'Rent & Property Buying & Selling Platform Advertisement',
          description: 'Promote your real estate services, property listings, and rental opportunities.',
          features: ['Property listings', 'Virtual tours', 'Price comparisons', 'Legal support']
        },
        {
          id: 'exclusive_gift_packs',
          name: 'Exclusive Gift Packs Advertisement',
          description: 'Showcase your curated gift packages and special collections for tourists and locals.',
          features: ['Gift collections', 'Custom packaging', 'Seasonal offers', 'Delivery options']
        },
        {
          id: 'souvenirs_collectibles',
          name: 'Souvenirs & Collectibles Advertisement',
          description: 'Market your unique souvenirs, local crafts, and collectible items to tourists.',
          features: ['Product showcase', 'Cultural significance', 'Authenticity guarantee', 'Shipping options']
        },
        {
          id: 'jewelry_gem_sellers',
          name: 'Jewelry & Gem Sellers Advertisement',
          description: 'Promote your jewelry collections, precious gems, and luxury accessories.',
          features: ['Product gallery', 'Certification display', 'Custom designs', 'Secure transactions']
        },
        {
          id: 'home_office_accessories_tech',
          name: 'Home/Office Accessories & Tech Gadgets Advertisement',
          description: 'Sell home, office accessories, and technology products to travelers and locals.',
          features: ['Product categories', 'Tech specifications', 'Warranty info', 'Support services']
        },
        {
          id: 'fashion_beauty_clothing',
          name: 'Fashion/Beauty & Clothing Items Advertisement',
          description: 'Showcase your fashion collections, beauty products, and clothing lines.',
          features: ['Fashion trends', 'Size guides', 'Style recommendations', 'Seasonal collections']
        },
        {
          id: 'daily_grocery_essentials',
          name: 'Daily Grocery Essentials Advertisement',
          description: 'Promote your grocery store, essential items, and daily necessities for travelers.',
          features: ['Product availability', 'Fresh produce', 'Delivery services', 'Bulk discounts']
        },
        {
          id: 'organic_herbal_products_spices',
          name: 'Organic Herbal Products & Spices Advertisement',
          description: 'Market your organic products, herbal remedies, and authentic Sri Lankan spices.',
          features: ['Organic certification', 'Health benefits', 'Traditional recipes', 'Export quality']
        },
        {
          id: 'books_magazines_educational',
          name: 'Books, Magazines & Educational Materials Advertisement',
          description: 'Promote your bookstore, educational materials, and learning resources.',
          features: ['Book categories', 'Educational content', 'Digital versions', 'Reading recommendations']
        },
        {
          id: 'other_items',
          name: 'Other Items Advertisement',
          description: 'Advertise any other products or items not covered in specific categories.',
          features: ['Product flexibility', 'Custom descriptions', 'Various categories', 'Special offers']
        },
        {
          id: 'create_link_own_store',
          name: 'Create or Link Your Own Store Advertisement',
          description: 'Promote your e-commerce store or link to your existing online marketplace presence.',
          features: ['Store integration', 'Product catalogs', 'Payment systems', 'Brand promotion'],
          hidden: true
        }
      ]
    },
    {
      id: 'entertainment_fitness',
      name: 'Entertainment & Fitness',
      icon: Music,
      color: 'from-violet-500 to-purple-600',
      description: 'Entertainment, fitness, health, and wellness services',
      slots: [
        {
          id: 'exclusive_combo_packages',
          name: 'Exclusive Combo Packages Advertisement',
          description: 'Promote your special combination packages for weddings, tours, and comprehensive service bundles.',
          features: ['Package deals', 'Value combinations', 'Custom options', 'All-inclusive services']
        },
        {
          id: 'talented_entertainers_artists',
          name: 'Talented Entertainers & Artists Advertisement',
          description: 'Showcase your entertainment services, artistic performances, and creative talents.',
          features: ['Performance portfolio', 'Event types', 'Booking availability', 'Client reviews']
        },
        {
          id: 'fitness_health_spas_gym',
          name: 'Fitness & Health: Spas, Gym Etc. & Professionals Advertisement',
          description: 'Promote your fitness centers, spas, wellness services, and health professionals.',
          features: ['Facility showcase', 'Service menu', 'Professional staff', 'Health programs']
        },
        {
          id: 'cinema_movie_hub',
          name: 'Cinema & Movie Hub Advertisement',
          description: 'Advertise your cinema, movie screenings, and entertainment venue services.',
          features: ['Movie listings', 'Screening times', 'Facility features', 'Special events'],
          hidden: true
        },
        {
          id: 'social_media_promotions',
          name: 'Social Media Promotions Advertisement',
          description: 'Offer social media marketing, promotion services, and digital marketing solutions.',
          features: ['Platform expertise', 'Campaign management', 'Analytics reporting', 'Content creation'],
          hidden: true
        }
      ]
    },
    {
      id: 'special_opportunities',
      name: 'Special Opportunities',
      icon: Target,
      color: 'from-amber-500 to-orange-500',
      description: 'Job opportunities, crypto, promotions, and special offers',
      slots: [
        {
          id: 'job_opportunities',
          name: 'Exciting Job Opportunities Advertisement',
          description: 'Post job openings, career opportunities, and employment positions in the tourism industry.',
          features: ['Job descriptions', 'Requirements', 'Application process', 'Company info']
        },
        {
          id: 'crypto_consulting_signals',
          name: 'Crypto Consulting & Signals Advertisement',
          description: 'Provide cryptocurrency consulting, trading signals, and blockchain-related services.',
          features: ['Expert analysis', 'Signal accuracy', 'Market insights', 'Educational content']
        },
        {
          id: 'local_sim_mobile_data',
          name: 'Local SIM Cards & Mobile Data Plans Advertisement',
          description: 'Offer local SIM cards, mobile data plans, and telecommunications services for travelers.',
          features: ['Plan comparisons', 'Coverage maps', 'Data packages', 'Tourist specials']
        },
        {
          id: 'custom_ads_campaigns',
          name: 'Custom Ads Campaigns Advertisement',
          description: 'Create and manage custom advertising campaigns with specialized targeting and messaging.',
          features: ['Custom targeting', 'Campaign management', 'Performance tracking', 'Creative services'],
          hidden: true
        },
        {
          id: 'exclusive_offers_promotions',
          name: 'Exclusive Offers & Promotions Advertisement',
          description: 'Promote special deals, limited-time offers, and exclusive promotions for your services.',
          features: ['Deal highlights', 'Time-limited offers', 'Exclusive access', 'Promotional codes']
        }
      ]
    },
    {
      id: 'essential_services',
      name: 'Essential Services',
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      description: 'Emergency services, insurance, and essential utilities',
      slots: [
        {
          id: 'emergency_services_insurance',
          name: 'Emergency Services & Insurance Advertisement',
          description: 'Provide critical emergency services, insurance products, and safety solutions for travelers.',
          features: ['24/7 availability', 'Emergency response', 'Insurance coverage', 'Safety protocols'],
        }
      ]
    }
  ];

  // Search and filter functionality
  const searchSlots = (categories) => {
    if (!searchTerm) return categories;
    
    return categories.map(category => ({
      ...category,
      slots: category.slots.filter(slot => 
        slot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })).filter(category => category.slots.length > 0);
  };

  // Filter categories based on selection and search
  const filteredCategories = searchSlots(
    selectedCategory === 'all' 
      ? advertisementCategories 
      : advertisementCategories.filter(cat => cat.id === selectedCategory)
  );

  // Professional Pricing Card Component with HSC Priority
  const PricingCard = ({ pricing, isSpecial = false }) => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-center">Pricing Options</h4>
      <div className="space-y-3">
        {isSpecial && pricing?.hourly && (
          <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
            <span className="text-sm text-gray-600 dark:text-gray-400">Hourly</span>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {pricing.hourly.hsc} HSC
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {pricing.hourly.lkr.toLocaleString()} LKR
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
          <span className="text-sm text-gray-600 dark:text-gray-400">Daily</span>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {pricing?.daily?.hsc || 0} HSC
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {pricing?.daily?.lkr?.toLocaleString() || 0} LKR
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
          <span className="text-sm text-gray-600 dark:text-gray-400">Monthly</span>
          <div className="text-right">
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {pricing?.monthly?.hsc || 0} HSC
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {pricing?.monthly?.lkr?.toLocaleString() || 0} LKR
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
          <span className="text-sm text-gray-600 dark:text-gray-400">Yearly</span>
          <div className="text-right">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {pricing?.yearly?.hsc || 0} HSC
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {pricing?.yearly?.lkr?.toLocaleString() || 0} LKR
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading advertisement slots...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Post Your Advertisement
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Choose from our comprehensive range of advertisement slots to showcase your tourism services. 
          Reach thousands of travelers and grow your business with HolidaySri.
        </p>
      </div>

      {/* Step Guidance */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            How to Get Started
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Follow these simple steps to advertise your business
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold text-sm">
              1
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Select Advertisement Type
            </span>
          </div>

          <div className="hidden md:block text-gray-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold text-sm">
              2
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Choose a Plan
            </span>
          </div>

          <div className="hidden md:block text-gray-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full font-bold text-sm">
              3
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Choose Payment Method
            </span>
          </div>

          <div className="hidden md:block text-gray-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full font-bold text-sm">
              4
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Use Your Slot & Publish
            </span>
          </div>
        </div>
      </div>



      {/* Search Bar */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by slot name, features, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          All Categories
        </button>
        {advertisementCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Found {filteredCategories.reduce((total, cat) => total + cat.slots.length, 0)} slots matching "{searchTerm}"
          </p>
        </div>
      )}

      {/* No Results */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No slots found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms or browse all categories</p>
        </div>
      )}

      {/* Advertisement Categories */}
      {filteredCategories.map((category) => (
        <div key={category.id} className="space-y-4">
          {/* Category Header */}
          <div className={`bg-gradient-to-r ${category.color} text-white p-6 rounded-lg`}>
            <div className="flex items-center space-x-3">
              <category.icon className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <p className="text-white/90">{category.description}</p>
              </div>
            </div>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {category.slots.filter(slot => !slot.hidden).map((slot) => {
              const pricing = getPricing(category.id, slot.id);
              return (
                <div key={slot.id} className="card p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                  {/* Slot Header */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {slot.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {slot.description}
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {slot.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <PricingCard pricing={pricing} isSpecial={category.isSpecial} />
                  </div>

                  {/* Action Buttons - Fixed at Bottom */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => handlePostNow(category, slot)}
                      className="btn-primary flex-1 flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Post Now</span>
                    </button>
                    <button className="btn-secondary flex items-center justify-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>View Examples</span>
                    </button>
                  </div>

                  {/* Payment Options Info */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        <Gem className="w-4 h-4 text-green-500" />
                        <Diamond className="w-4 h-4 text-purple-500" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Multiple Payment Options
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      You can use <span className="font-semibold text-green-600 dark:text-green-400">HSG</span> and <span className="font-semibold text-purple-600 dark:text-purple-400">HSD</span> also for buying advertisement slots
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Call to Action */}
      <div className="card p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Start Advertising?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Join thousands of successful tourism businesses who have grown their customer base through HolidaySri. 
          Start advertising today and watch your business flourish!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary flex items-center justify-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Get Started Now</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Info className="w-5 h-5" />
            <span>Learn More</span>
          </button>
        </div>
      </div>

      {/* Advertisement Plan Selection Popup */}
      <AdvertisementPlanPopup
        isOpen={showPlanPopup}
        onClose={handlePopupClose}
        selectedSlot={selectedSlotForPopup}
        slotCharges={slotCharges}
        hscValue={hscValue}
      />
    </div>
  );
};

export default PostAdvertisement;
