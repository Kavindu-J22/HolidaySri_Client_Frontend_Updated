import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Clock, 
  Calendar, 
  DollarSign, 
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
  ArrowRight,
  Eye,
  Sparkles
} from 'lucide-react';
import { hscAPI } from '../config/api';

const PostAdvertisement = () => {
  const [hscValue, setHscValue] = useState(100); // Default HSC value
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch current HSC value
  useEffect(() => {
    const fetchHSCValue = async () => {
      try {
        const response = await hscAPI.getInfo();
        setHscValue(response.data.hscValue || 100);
      } catch (error) {
        console.error('Error fetching HSC value:', error);
        setHscValue(100); // Fallback value
      } finally {
        setLoading(false);
      }
    };

    fetchHSCValue();
  }, []);

  // Convert LKR to HSC
  const convertToHSC = (lkrAmount) => {
    return Math.ceil(lkrAmount / hscValue);
  };

  // Advertisement slot categories with their slots and pricing
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
          features: ['Maximum visibility', 'Premium placement', 'High click-through rates', 'Mobile optimized'],
          pricing: {
            hourly: { lkr: 500, hsc: convertToHSC(500) },
            daily: { lkr: 5000, hsc: convertToHSC(5000) },
            monthly: { lkr: 100000, hsc: convertToHSC(100000) },
            yearly: { lkr: 1000000, hsc: convertToHSC(1000000) }
          }
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
          features: ['Community building', 'Group travel focus', 'Social networking', 'Travel matching'],
          pricing: {
            daily: { lkr: 1000, hsc: convertToHSC(1000) },
            monthly: { lkr: 25000, hsc: convertToHSC(25000) },
            yearly: { lkr: 250000, hsc: convertToHSC(250000) }
          }
        },
        {
          id: 'tour_guiders',
          name: 'Tour Guiders Advertisement',
          description: 'Showcase your expertise as a professional tour guide. Reach tourists looking for authentic local experiences.',
          features: ['Professional credibility', 'Local expertise showcase', 'Tourist targeting', 'Experience highlights'],
          pricing: {
            daily: { lkr: 800, hsc: convertToHSC(800) },
            monthly: { lkr: 20000, hsc: convertToHSC(20000) },
            yearly: { lkr: 200000, hsc: convertToHSC(200000) }
          }
        },
        {
          id: 'local_tour_packages',
          name: 'Local Tour Packages Advertisement',
          description: 'Promote your carefully crafted local tour packages. Ideal for tour operators and travel agencies.',
          features: ['Package highlights', 'Itinerary showcase', 'Pricing transparency', 'Booking integration'],
          pricing: {
            daily: { lkr: 1200, hsc: convertToHSC(1200) },
            monthly: { lkr: 30000, hsc: convertToHSC(30000) },
            yearly: { lkr: 300000, hsc: convertToHSC(300000) }
          }
        },
        {
          id: 'customize_tour_package',
          name: 'Customize Tour Package Advertisement',
          description: 'Offer personalized tour experiences tailored to individual preferences. Perfect for bespoke travel services.',
          features: ['Customization options', 'Personal touch', 'Flexible itineraries', 'Premium positioning'],
          pricing: {
            daily: { lkr: 1500, hsc: convertToHSC(1500) },
            monthly: { lkr: 35000, hsc: convertToHSC(35000) },
            yearly: { lkr: 350000, hsc: convertToHSC(350000) }
          }
        },
        {
          id: 'travelsafe_help_professionals',
          name: 'TravelSafe & Help Professionals Advertisement',
          description: 'Provide essential travel safety and assistance services. Build trust with safety-conscious travelers.',
          features: ['Safety assurance', 'Emergency support', 'Professional help', 'Trust building'],
          pricing: {
            daily: { lkr: 900, hsc: convertToHSC(900) },
            monthly: { lkr: 22000, hsc: convertToHSC(22000) },
            yearly: { lkr: 220000, hsc: convertToHSC(220000) }
          }
        },
        {
          id: 'rent_land_camping_parking',
          name: 'Rent a Land for Camping or Parking Advertisement',
          description: 'Offer your land for camping, parking, or outdoor activities. Great for property owners in scenic locations.',
          features: ['Property showcase', 'Location benefits', 'Facility details', 'Booking system'],
          pricing: {
            daily: { lkr: 700, hsc: convertToHSC(700) },
            monthly: { lkr: 18000, hsc: convertToHSC(18000) },
            yearly: { lkr: 180000, hsc: convertToHSC(180000) }
          }
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
          features: ['Room showcases', 'Amenity highlights', 'Location benefits', 'Booking integration'],
          pricing: {
            daily: { lkr: 1500, hsc: convertToHSC(1500) },
            monthly: { lkr: 40000, hsc: convertToHSC(40000) },
            yearly: { lkr: 400000, hsc: convertToHSC(400000) }
          }
        },
        {
          id: 'cafes_restaurants',
          name: 'Cafes & Restaurants Advertisement',
          description: 'Promote your dining establishment and attract food lovers. Perfect for restaurants, cafes, and eateries.',
          features: ['Menu highlights', 'Ambiance showcase', 'Special offers', 'Location visibility'],
          pricing: {
            daily: { lkr: 1200, hsc: convertToHSC(1200) },
            monthly: { lkr: 30000, hsc: convertToHSC(30000) },
            yearly: { lkr: 300000, hsc: convertToHSC(300000) }
          }
        },
        {
          id: 'foods_beverages',
          name: 'Foods & Beverages Advertisement',
          description: 'Market your food products, beverages, or catering services. Ideal for food producers and suppliers.',
          features: ['Product showcase', 'Quality highlights', 'Distribution info', 'Special promotions'],
          pricing: {
            daily: { lkr: 800, hsc: convertToHSC(800) },
            monthly: { lkr: 20000, hsc: convertToHSC(20000) },
            yearly: { lkr: 200000, hsc: convertToHSC(200000) }
          }
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
          features: ['Fleet showcase', 'Rental terms', 'Service areas', 'Booking system'],
          pricing: {
            daily: { lkr: 1300, hsc: convertToHSC(1300) },
            monthly: { lkr: 32000, hsc: convertToHSC(32000) },
            yearly: { lkr: 320000, hsc: convertToHSC(320000) }
          }
        },
        {
          id: 'live_rides_carpooling',
          name: 'Live Rides Updates & Carpooling Advertisement',
          description: 'Offer ride-sharing and carpooling services. Help travelers find affordable transportation options.',
          features: ['Real-time updates', 'Route information', 'Cost sharing', 'Community building'],
          pricing: {
            daily: { lkr: 600, hsc: convertToHSC(600) },
            monthly: { lkr: 15000, hsc: convertToHSC(15000) },
            yearly: { lkr: 150000, hsc: convertToHSC(150000) }
          }
        },
        {
          id: 'professional_drivers',
          name: 'Professional Drivers Advertisement',
          description: 'Showcase your driving services and expertise. Perfect for professional chauffeurs and tour drivers.',
          features: ['Experience highlights', 'Service areas', 'Vehicle types', 'Professional credentials'],
          pricing: {
            daily: { lkr: 800, hsc: convertToHSC(800) },
            monthly: { lkr: 20000, hsc: convertToHSC(20000) },
            yearly: { lkr: 200000, hsc: convertToHSC(200000) }
          }
        },
        {
          id: 'vehicle_repairs_mechanics',
          name: 'Vehicle Repairs & Mechanics Advertisement',
          description: 'Promote your automotive repair and maintenance services. Essential for travelers with vehicle issues.',
          features: ['Service specialties', 'Emergency support', 'Location details', 'Contact information'],
          pricing: {
            daily: { lkr: 700, hsc: convertToHSC(700) },
            monthly: { lkr: 18000, hsc: convertToHSC(18000) },
            yearly: { lkr: 180000, hsc: convertToHSC(180000) }
          }
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
          features: ['Event promotion', 'Cultural highlights', 'Date & venue info', 'Ticket integration'],
          pricing: {
            daily: { lkr: 1000, hsc: convertToHSC(1000) },
            monthly: { lkr: 25000, hsc: convertToHSC(25000) },
            yearly: { lkr: 250000, hsc: convertToHSC(250000) }
          }
        },
        {
          id: 'event_planners_coordinators',
          name: 'Expert Event Planners & Day Coordinators Advertisement',
          description: 'Showcase your event planning expertise for weddings, corporate events, and special occasions.',
          features: ['Portfolio showcase', 'Service packages', 'Client testimonials', 'Booking system'],
          pricing: {
            daily: { lkr: 1400, hsc: convertToHSC(1400) },
            monthly: { lkr: 35000, hsc: convertToHSC(35000) },
            yearly: { lkr: 350000, hsc: convertToHSC(350000) }
          }
        },
        {
          id: 'creative_photographers',
          name: 'Creative Photographers Advertisement',
          description: 'Display your photography skills and attract clients looking for professional photo services.',
          features: ['Portfolio gallery', 'Service types', 'Pricing packages', 'Contact booking'],
          pricing: {
            daily: { lkr: 1200, hsc: convertToHSC(1200) },
            monthly: { lkr: 30000, hsc: convertToHSC(30000) },
            yearly: { lkr: 300000, hsc: convertToHSC(300000) }
          }
        },
        {
          id: 'decorators_florists',
          name: 'Decorators & Florists Advertisement',
          description: 'Promote your decoration and floral arrangement services for events and special occasions.',
          features: ['Design showcase', 'Seasonal offerings', 'Custom arrangements', 'Event specialization'],
          pricing: {
            daily: { lkr: 900, hsc: convertToHSC(900) },
            monthly: { lkr: 22000, hsc: convertToHSC(22000) },
            yearly: { lkr: 220000, hsc: convertToHSC(220000) }
          }
        },
        {
          id: 'salon_makeup_artists',
          name: 'Salon & Makeup Artists Advertisement',
          description: 'Attract clients looking for beauty services, makeup, and salon treatments for special occasions.',
          features: ['Service menu', 'Before/after gallery', 'Appointment booking', 'Special packages'],
          pricing: {
            daily: { lkr: 1100, hsc: convertToHSC(1100) },
            monthly: { lkr: 28000, hsc: convertToHSC(28000) },
            yearly: { lkr: 280000, hsc: convertToHSC(280000) }
          }
        },
        {
          id: 'fashion_designers',
          name: 'Fashion Designers Advertisement',
          description: 'Showcase your fashion designs and attract clients looking for custom clothing and styling services.',
          features: ['Design portfolio', 'Custom services', 'Fashion trends', 'Client gallery'],
          pricing: {
            daily: { lkr: 1300, hsc: convertToHSC(1300) },
            monthly: { lkr: 32000, hsc: convertToHSC(32000) },
            yearly: { lkr: 320000, hsc: convertToHSC(320000) }
          }
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
          features: ['Specialization highlight', 'Credentials display', 'Appointment booking', 'Emergency services'],
          pricing: {
            daily: { lkr: 2000, hsc: convertToHSC(2000) },
            monthly: { lkr: 50000, hsc: convertToHSC(50000) },
            yearly: { lkr: 500000, hsc: convertToHSC(500000) }
          }
        },
        {
          id: 'professional_lawyers',
          name: 'Professional Lawyers Advertisement',
          description: 'Showcase your legal expertise and attract clients needing professional legal services.',
          features: ['Practice areas', 'Success stories', 'Consultation booking', 'Legal resources'],
          pricing: {
            daily: { lkr: 1800, hsc: convertToHSC(1800) },
            monthly: { lkr: 45000, hsc: convertToHSC(45000) },
            yearly: { lkr: 450000, hsc: convertToHSC(450000) }
          }
        },
        {
          id: 'advisors_counselors',
          name: 'Experienced Advisors & Counselors Advertisement',
          description: 'Connect with clients seeking professional advice, counseling, and consultation services.',
          features: ['Expertise areas', 'Session types', 'Confidential services', 'Flexible scheduling'],
          pricing: {
            daily: { lkr: 1200, hsc: convertToHSC(1200) },
            monthly: { lkr: 30000, hsc: convertToHSC(30000) },
            yearly: { lkr: 300000, hsc: convertToHSC(300000) }
          }
        },
        {
          id: 'language_translators',
          name: 'Language Translators & Interpreters Advertisement',
          description: 'Offer your translation and interpretation services to international travelers and businesses.',
          features: ['Language pairs', 'Service types', 'Certification display', 'Quick turnaround'],
          pricing: {
            daily: { lkr: 800, hsc: convertToHSC(800) },
            monthly: { lkr: 20000, hsc: convertToHSC(20000) },
            yearly: { lkr: 200000, hsc: convertToHSC(200000) }
          }
        },
        {
          id: 'expert_architects',
          name: 'Expert Architects Advertisement',
          description: 'Showcase your architectural services and attract clients for construction and design projects.',
          features: ['Project portfolio', 'Design styles', 'Service packages', 'Consultation offers'],
          pricing: {
            daily: { lkr: 1600, hsc: convertToHSC(1600) },
            monthly: { lkr: 40000, hsc: convertToHSC(40000) },
            yearly: { lkr: 400000, hsc: convertToHSC(400000) }
          }
        },
        {
          id: 'trusted_astrologists',
          name: 'Trusted Astrologists Advertisement',
          description: 'Provide astrological services and guidance to clients seeking spiritual and life advice.',
          features: ['Service types', 'Reading options', 'Consultation methods', 'Client testimonials'],
          pricing: {
            daily: { lkr: 600, hsc: convertToHSC(600) },
            monthly: { lkr: 15000, hsc: convertToHSC(15000) },
            yearly: { lkr: 150000, hsc: convertToHSC(150000) }
          }
        },
        {
          id: 'delivery_partners',
          name: 'Delivery Partners Advertisement',
          description: 'Promote your delivery and logistics services to businesses and individuals needing reliable transport.',
          features: ['Service areas', 'Delivery types', 'Tracking system', 'Competitive rates'],
          pricing: {
            daily: { lkr: 500, hsc: convertToHSC(500) },
            monthly: { lkr: 12000, hsc: convertToHSC(12000) },
            yearly: { lkr: 120000, hsc: convertToHSC(120000) }
          }
        },
        {
          id: 'graphics_it_tech_repair',
          name: 'Graphics/IT Supports & Tech Repair Services Advertisement',
          description: 'Offer technical support, IT services, and device repair solutions to travelers and businesses.',
          features: ['Service categories', 'Emergency support', 'Remote assistance', 'Warranty options'],
          pricing: {
            daily: { lkr: 1000, hsc: convertToHSC(1000) },
            monthly: { lkr: 25000, hsc: convertToHSC(25000) },
            yearly: { lkr: 250000, hsc: convertToHSC(250000) }
          }
        },
        {
          id: 'educational_tutoring',
          name: 'Educational & Tutoring Services Advertisement',
          description: 'Promote your educational services, tutoring, and skill development programs.',
          features: ['Subject expertise', 'Teaching methods', 'Success rates', 'Flexible scheduling'],
          pricing: {
            daily: { lkr: 900, hsc: convertToHSC(900) },
            monthly: { lkr: 22000, hsc: convertToHSC(22000) },
            yearly: { lkr: 220000, hsc: convertToHSC(220000) }
          }
        },
        {
          id: 'currency_exchange',
          name: 'Currency Exchange Rates & Services Advertisement',
          description: 'Provide currency exchange services with competitive rates for international travelers.',
          features: ['Live rates', 'Multiple currencies', 'Quick service', 'Secure transactions'],
          pricing: {
            daily: { lkr: 1500, hsc: convertToHSC(1500) },
            monthly: { lkr: 35000, hsc: convertToHSC(35000) },
            yearly: { lkr: 350000, hsc: convertToHSC(350000) }
          }
        },
        {
          id: 'other_professionals_services',
          name: 'Other Professionals & Services Advertisement',
          description: 'Promote any other professional services including cleaning, maintenance, and specialized support.',
          features: ['Service description', 'Availability', 'Contact options', 'Service areas'],
          pricing: {
            daily: { lkr: 700, hsc: convertToHSC(700) },
            monthly: { lkr: 18000, hsc: convertToHSC(18000) },
            yearly: { lkr: 180000, hsc: convertToHSC(180000) }
          }
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
          features: ['Care services', 'Time currency', 'Community support', 'Flexible scheduling'],
          pricing: {
            daily: { lkr: 800, hsc: convertToHSC(800) },
            monthly: { lkr: 20000, hsc: convertToHSC(20000) },
            yearly: { lkr: 200000, hsc: convertToHSC(200000) }
          }
        },
        {
          id: 'babysitters_childcare',
          name: 'Trusted Babysitters & Childcare Help Advertisement',
          description: 'Provide reliable childcare services for traveling families and local parents.',
          features: ['Background checks', 'Experience highlights', 'Age specialization', 'Emergency training'],
          pricing: {
            daily: { lkr: 900, hsc: convertToHSC(900) },
            monthly: { lkr: 22000, hsc: convertToHSC(22000) },
            yearly: { lkr: 220000, hsc: convertToHSC(220000) }
          }
        },
        {
          id: 'pet_care_animal_services',
          name: 'Pet Care & Animal Services Advertisement',
          description: 'Offer pet care, veterinary services, and animal-related support for travelers with pets.',
          features: ['Pet services', 'Veterinary care', 'Pet boarding', 'Emergency support'],
          pricing: {
            daily: { lkr: 700, hsc: convertToHSC(700) },
            monthly: { lkr: 18000, hsc: convertToHSC(18000) },
            yearly: { lkr: 180000, hsc: convertToHSC(180000) }
          }
        },
        {
          id: 'donations_raise_fund',
          name: 'Donations / Raise Your Fund Advertisement',
          description: 'Promote charitable causes, fundraising campaigns, and community support initiatives.',
          features: ['Cause promotion', 'Donation tracking', 'Impact stories', 'Community engagement'],
          pricing: {
            daily: { lkr: 500, hsc: convertToHSC(500) },
            monthly: { lkr: 12000, hsc: convertToHSC(12000) },
            yearly: { lkr: 120000, hsc: convertToHSC(120000) }
          }
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
          features: ['Property listings', 'Virtual tours', 'Price comparisons', 'Legal support'],
          pricing: {
            daily: { lkr: 2000, hsc: convertToHSC(2000) },
            monthly: { lkr: 50000, hsc: convertToHSC(50000) },
            yearly: { lkr: 500000, hsc: convertToHSC(500000) }
          }
        },
        {
          id: 'exclusive_gift_packs',
          name: 'Exclusive Gift Packs Advertisement',
          description: 'Showcase your curated gift packages and special collections for tourists and locals.',
          features: ['Gift collections', 'Custom packaging', 'Seasonal offers', 'Delivery options'],
          pricing: {
            daily: { lkr: 800, hsc: convertToHSC(800) },
            monthly: { lkr: 20000, hsc: convertToHSC(20000) },
            yearly: { lkr: 200000, hsc: convertToHSC(200000) }
          }
        },
        {
          id: 'souvenirs_collectibles',
          name: 'Souvenirs & Collectibles Advertisement',
          description: 'Market your unique souvenirs, local crafts, and collectible items to tourists.',
          features: ['Product showcase', 'Cultural significance', 'Authenticity guarantee', 'Shipping options'],
          pricing: {
            daily: { lkr: 600, hsc: convertToHSC(600) },
            monthly: { lkr: 15000, hsc: convertToHSC(15000) },
            yearly: { lkr: 150000, hsc: convertToHSC(150000) }
          }
        },
        {
          id: 'jewelry_gem_sellers',
          name: 'Jewelry & Gem Sellers Advertisement',
          description: 'Promote your jewelry collections, precious gems, and luxury accessories.',
          features: ['Product gallery', 'Certification display', 'Custom designs', 'Secure transactions'],
          pricing: {
            daily: { lkr: 1500, hsc: convertToHSC(1500) },
            monthly: { lkr: 35000, hsc: convertToHSC(35000) },
            yearly: { lkr: 350000, hsc: convertToHSC(350000) }
          }
        },
        {
          id: 'home_office_accessories_tech',
          name: 'Home/Office Accessories & Tech Gadgets Advertisement',
          description: 'Sell home, office accessories, and technology products to travelers and locals.',
          features: ['Product categories', 'Tech specifications', 'Warranty info', 'Support services'],
          pricing: {
            daily: { lkr: 1200, hsc: convertToHSC(1200) },
            monthly: { lkr: 30000, hsc: convertToHSC(30000) },
            yearly: { lkr: 300000, hsc: convertToHSC(300000) }
          }
        },
        {
          id: 'fashion_beauty_clothing',
          name: 'Fashion/Beauty & Clothing Items Advertisement',
          description: 'Showcase your fashion collections, beauty products, and clothing lines.',
          features: ['Fashion trends', 'Size guides', 'Style recommendations', 'Seasonal collections'],
          pricing: {
            daily: { lkr: 1000, hsc: convertToHSC(1000) },
            monthly: { lkr: 25000, hsc: convertToHSC(25000) },
            yearly: { lkr: 250000, hsc: convertToHSC(250000) }
          }
        },
        {
          id: 'daily_grocery_essentials',
          name: 'Daily Grocery Essentials Advertisement',
          description: 'Promote your grocery store, essential items, and daily necessities for travelers.',
          features: ['Product availability', 'Fresh produce', 'Delivery services', 'Bulk discounts'],
          pricing: {
            daily: { lkr: 800, hsc: convertToHSC(800) },
            monthly: { lkr: 20000, hsc: convertToHSC(20000) },
            yearly: { lkr: 200000, hsc: convertToHSC(200000) }
          }
        },
        {
          id: 'organic_herbal_products_spices',
          name: 'Organic Herbal Products & Spices Advertisement',
          description: 'Market your organic products, herbal remedies, and authentic Sri Lankan spices.',
          features: ['Organic certification', 'Health benefits', 'Traditional recipes', 'Export quality'],
          pricing: {
            daily: { lkr: 900, hsc: convertToHSC(900) },
            monthly: { lkr: 22000, hsc: convertToHSC(22000) },
            yearly: { lkr: 220000, hsc: convertToHSC(220000) }
          }
        },
        {
          id: 'books_magazines_educational',
          name: 'Books, Magazines & Educational Materials Advertisement',
          description: 'Promote your bookstore, educational materials, and learning resources.',
          features: ['Book categories', 'Educational content', 'Digital versions', 'Reading recommendations'],
          pricing: {
            daily: { lkr: 600, hsc: convertToHSC(600) },
            monthly: { lkr: 15000, hsc: convertToHSC(15000) },
            yearly: { lkr: 150000, hsc: convertToHSC(150000) }
          }
        },
        {
          id: 'other_items',
          name: 'Other Items Advertisement',
          description: 'Advertise any other products or items not covered in specific categories.',
          features: ['Product flexibility', 'Custom descriptions', 'Various categories', 'Special offers'],
          pricing: {
            daily: { lkr: 500, hsc: convertToHSC(500) },
            monthly: { lkr: 12000, hsc: convertToHSC(12000) },
            yearly: { lkr: 120000, hsc: convertToHSC(120000) }
          }
        },
        {
          id: 'create_link_own_store',
          name: 'Create or Link Your Own Store Advertisement',
          description: 'Promote your e-commerce store or link to your existing online marketplace presence.',
          features: ['Store integration', 'Product catalogs', 'Payment systems', 'Brand promotion'],
          pricing: {
            daily: { lkr: 1800, hsc: convertToHSC(1800) },
            monthly: { lkr: 45000, hsc: convertToHSC(45000) },
            yearly: { lkr: 450000, hsc: convertToHSC(450000) }
          }
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
          features: ['Package deals', 'Value combinations', 'Custom options', 'All-inclusive services'],
          pricing: {
            daily: { lkr: 2500, hsc: convertToHSC(2500) },
            monthly: { lkr: 60000, hsc: convertToHSC(60000) },
            yearly: { lkr: 600000, hsc: convertToHSC(600000) }
          }
        },
        {
          id: 'talented_entertainers_artists',
          name: 'Talented Entertainers & Artists Advertisement',
          description: 'Showcase your entertainment services, artistic performances, and creative talents.',
          features: ['Performance portfolio', 'Event types', 'Booking availability', 'Client reviews'],
          pricing: {
            daily: { lkr: 1200, hsc: convertToHSC(1200) },
            monthly: { lkr: 30000, hsc: convertToHSC(30000) },
            yearly: { lkr: 300000, hsc: convertToHSC(300000) }
          }
        },
        {
          id: 'fitness_health_spas_gym',
          name: 'Fitness & Health: Spas, Gym Etc. & Professionals Advertisement',
          description: 'Promote your fitness centers, spas, wellness services, and health professionals.',
          features: ['Facility showcase', 'Service menu', 'Professional staff', 'Health programs'],
          pricing: {
            daily: { lkr: 1500, hsc: convertToHSC(1500) },
            monthly: { lkr: 35000, hsc: convertToHSC(35000) },
            yearly: { lkr: 350000, hsc: convertToHSC(350000) }
          }
        },
        {
          id: 'cinema_movie_hub',
          name: 'Cinema & Movie Hub Advertisement',
          description: 'Advertise your cinema, movie screenings, and entertainment venue services.',
          features: ['Movie listings', 'Screening times', 'Facility features', 'Special events'],
          pricing: {
            daily: { lkr: 2000, hsc: convertToHSC(2000) },
            monthly: { lkr: 50000, hsc: convertToHSC(50000) },
            yearly: { lkr: 500000, hsc: convertToHSC(500000) }
          }
        },
        {
          id: 'social_media_promotions',
          name: 'Social Media Promotions Advertisement',
          description: 'Offer social media marketing, promotion services, and digital marketing solutions.',
          features: ['Platform expertise', 'Campaign management', 'Analytics reporting', 'Content creation'],
          pricing: {
            daily: { lkr: 800, hsc: convertToHSC(800) },
            monthly: { lkr: 20000, hsc: convertToHSC(20000) },
            yearly: { lkr: 200000, hsc: convertToHSC(200000) }
          }
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
          features: ['Job descriptions', 'Requirements', 'Application process', 'Company info'],
          pricing: {
            daily: { lkr: 1000, hsc: convertToHSC(1000) },
            monthly: { lkr: 25000, hsc: convertToHSC(25000) },
            yearly: { lkr: 250000, hsc: convertToHSC(250000) }
          }
        },
        {
          id: 'crypto_consulting_signals',
          name: 'Crypto Consulting & Signals Advertisement',
          description: 'Provide cryptocurrency consulting, trading signals, and blockchain-related services.',
          features: ['Expert analysis', 'Signal accuracy', 'Market insights', 'Educational content'],
          pricing: {
            daily: { lkr: 1500, hsc: convertToHSC(1500) },
            monthly: { lkr: 35000, hsc: convertToHSC(35000) },
            yearly: { lkr: 350000, hsc: convertToHSC(350000) }
          }
        },
        {
          id: 'local_sim_mobile_data',
          name: 'Local SIM Cards & Mobile Data Plans Advertisement',
          description: 'Offer local SIM cards, mobile data plans, and telecommunications services for travelers.',
          features: ['Plan comparisons', 'Coverage maps', 'Data packages', 'Tourist specials'],
          pricing: {
            daily: { lkr: 800, hsc: convertToHSC(800) },
            monthly: { lkr: 20000, hsc: convertToHSC(20000) },
            yearly: { lkr: 200000, hsc: convertToHSC(200000) }
          }
        },
        {
          id: 'custom_ads_campaigns',
          name: 'Custom Ads Campaigns Advertisement',
          description: 'Create and manage custom advertising campaigns with specialized targeting and messaging.',
          features: ['Custom targeting', 'Campaign management', 'Performance tracking', 'Creative services'],
          pricing: {
            daily: { lkr: 3000, hsc: convertToHSC(3000) },
            monthly: { lkr: 75000, hsc: convertToHSC(75000) },
            yearly: { lkr: 750000, hsc: convertToHSC(750000) }
          }
        },
        {
          id: 'exclusive_offers_promotions',
          name: 'Exclusive Offers & Promotions Advertisement',
          description: 'Promote special deals, limited-time offers, and exclusive promotions for your services.',
          features: ['Deal highlights', 'Time-limited offers', 'Exclusive access', 'Promotional codes'],
          pricing: {
            daily: { lkr: 1200, hsc: convertToHSC(1200) },
            monthly: { lkr: 30000, hsc: convertToHSC(30000) },
            yearly: { lkr: 300000, hsc: convertToHSC(300000) }
          }
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
          pricing: {
            daily: { lkr: 2500, hsc: convertToHSC(2500) },
            monthly: { lkr: 60000, hsc: convertToHSC(60000) },
            yearly: { lkr: 600000, hsc: convertToHSC(600000) }
          }
        }
      ]
    }
  ];

  // Filter categories based on selection
  const filteredCategories = selectedCategory === 'all' 
    ? advertisementCategories 
    : advertisementCategories.filter(cat => cat.id === selectedCategory);

  const PricingCard = ({ pricing, isSpecial = false }) => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Pricing Options</h4>
      <div className="space-y-2">
        {isSpecial && pricing.hourly && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Hourly</span>
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-white">
                {pricing.hourly.lkr.toLocaleString()} LKR
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                {pricing.hourly.hsc} HSC
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Daily</span>
          <div className="text-right">
            <div className="font-semibold text-gray-900 dark:text-white">
              {pricing.daily.lkr.toLocaleString()} LKR
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {pricing.daily.hsc} HSC
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Monthly</span>
          <div className="text-right">
            <div className="font-semibold text-gray-900 dark:text-white">
              {pricing.monthly.lkr.toLocaleString()} LKR
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {pricing.monthly.hsc} HSC
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Yearly</span>
          <div className="text-right">
            <div className="font-semibold text-gray-900 dark:text-white">
              {pricing.yearly.lkr.toLocaleString()} LKR
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {pricing.yearly.hsc} HSC
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SlotCard = ({ slot, categoryColor, isSpecial = false }) => (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {slot.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            {slot.description}
          </p>
        </div>
        {isSpecial && (
          <div className="ml-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </span>
          </div>
        )}
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
      <PricingCard pricing={slot.pricing} isSpecial={isSpecial} />

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button className="btn-primary flex-1 flex items-center justify-center space-x-2">
          <Zap className="w-4 h-4" />
          <span>Post Now</span>
        </button>
        <button className="btn-secondary flex items-center justify-center space-x-2">
          <Eye className="w-4 h-4" />
          <span>View Examples</span>
        </button>
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
    <div className="space-y-8">
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

      {/* HSC Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current HSC Exchange Rate
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-semibold">1 HSC = {hscValue} LKR</span> • All prices shown in both LKR and HSC
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          HSC tokens can be purchased from your wallet and used to pay for advertisements
        </p>
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

      {/* Advertisement Categories */}
      {filteredCategories.map((category) => (
        <div key={category.id} className="space-y-6">
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
            {category.slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                categoryColor={category.color}
                isSpecial={category.isSpecial}
              />
            ))}
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
    </div>
  );
};

export default PostAdvertisement;
