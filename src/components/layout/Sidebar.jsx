import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Hotel,
  MapPin,
  Car,
  UtensilsCrossed,
  Camera,
  Compass,
  Mountain,
  Waves,
  TreePine,
  Building,
  ChevronDown,
  ChevronRight,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  PlusCircle,
  Gift,
  Coins,
  Users,
  Shield,
  Wrench,
  Calendar,
  Briefcase,
  Heart,
  ShoppingBag,
  Music,
  Zap,
  Settings,
  Stethoscope,
  Scale,
  MessageCircle,
  Languages,
  Home as HomeIcon,
  Stars,
  Truck,
  Monitor,
  GraduationCap,
  CreditCard,
  Baby,
  PawPrint,
  HandHeart,
  Store,
  Package,
  Gem,
  Laptop,
  Shirt,
  Apple,
  Leaf,
  Book,
  Plus,
  Dumbbell,
  Film,
  Share2,
  Bitcoin,
  Smartphone,
  Target,
  Handshake,
  Percent,
  AlertTriangle,
  FileText,
  Bell
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const location = useLocation();

  const advertisementCategories = [
    {
      id: 'tourism-travel',
      name: 'Tourism And Travel',
      icon: Compass,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      subcategories: [
        { name: 'Explore Locations', path: '/ads/tourism/explore-locations' },
        { name: 'Find Travel Buddys', path: '/ads/tourism/travel-buddys' },
        { name: 'Expert Tour Guiders', path: '/ads/tourism/tour-guiders' },
        { name: 'Local Tour Packages', path: '/ads/tourism/local-packages' },
        { name: 'Customize Tour Package', path: '/ads/tourism/customize-package' },
        { name: 'TravelSafe & Help Professionals', path: '/ads/tourism/travel-safe' },
        { name: 'Rent a Land for Camping or Parking purposes', path: '/ads/tourism/land-rental' },
      ]
    },
    {
      id: 'accommodation-dining',
      name: 'Accommodation & Dining',
      icon: Hotel,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      subcategories: [
        { name: 'Hotels & Accommodations', path: '/ads/accommodation/hotels' },
        { name: 'Cafes & restaurants', path: '/ads/accommodation/cafes-restaurants' },
        { name: 'Foods & Beverages', path: '/ads/accommodation/foods-beverages' },
      ]
    },
    {
      id: 'vehicles-transport',
      name: 'Vehicles & Transport',
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      subcategories: [
        { name: 'Vehicle Rentals & Hire Services', path: '/ads/transport/vehicle-rentals' },
        { name: 'Live Rides Updates & Carpooling', path: '/ads/transport/rides-carpooling' },
        { name: 'Professional Drivers', path: '/ads/transport/professional-drivers' },
        { name: 'Vehicle Repairs & Mechanics', path: '/ads/transport/repairs-mechanics' },
      ]
    },
    {
      id: 'events-management',
      name: 'Events & Management',
      icon: Calendar,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      subcategories: [
        { name: 'Events Updates & Manage or Customize Your Event', path: '/ads/events/manage-events' },
        { name: 'Expert Event Planners & day Coordinators', path: '/ads/events/planners-coordinators' },
        { name: 'Creative Photographers', path: '/ads/events/photographers' },
        { name: 'Decorators & Florists', path: '/ads/events/decorators-florists' },
        { name: 'Salon & Makeup Artists', path: '/ads/events/salon-makeup' },
        { name: 'Fashion Designers', path: '/ads/events/fashion-designers' },
      ]
    },
    {
      id: 'professionals-services',
      name: 'Professionals & Services',
      icon: Briefcase,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      subcategories: [
        { name: 'Meet Expert Doctors', path: '/ads/professionals/doctors' },
        { name: 'Professional Lawyers', path: '/ads/professionals/lawyers' },
        { name: 'Experienced Advisors & Counselors', path: '/ads/professionals/advisors-counselors' },
        { name: 'Language Translators & Interpreters', path: '/ads/professionals/translators' },
        { name: 'Expert Architects', path: '/ads/professionals/architects' },
        { name: 'Trusted Astrologists', path: '/ads/professionals/astrologists' },
        { name: 'Delivery Partners', path: '/ads/professionals/delivery' },
        { name: 'Graphics/IT Supports & Tech Repair Services', path: '/ads/professionals/it-tech' },
        { name: 'Educational & Tutoring Services', path: '/ads/professionals/education' },
        { name: 'Currency Exchange Rates & Services', path: '/ads/professionals/currency-exchange' },
        { name: 'Other Professionals & Services (Cleaning, Clinic Ect.)', path: '/ads/professionals/other' },
      ]
    },
    {
      id: 'caring-donations',
      name: 'Caring & Donations',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      subcategories: [
        { name: 'Compassionate Caregivers & Earn Time Currency', path: '/ads/caring/caregivers' },
        { name: 'Trusted Babysitters & Childcare Help', path: '/ads/caring/babysitters' },
        { name: 'Pet Care & Animal Services', path: '/ads/caring/pet-care' },
        { name: 'Donations / Raise Your Fund', path: '/ads/caring/donations' },
      ]
    },
    {
      id: 'marketplace-shopping',
      name: 'Marketplace & Shopping',
      icon: ShoppingBag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      subcategories: [
        { name: 'Rent & Property Buying & Selling Platform', path: '/ads/marketplace/property' },
        { name: 'Exclusive Gift Packs', path: '/ads/marketplace/gift-packs' },
        { name: 'Souvenirs & Collectibles', path: '/ads/marketplace/souvenirs' },
        { name: 'Jewelry & Gem Sellers', path: '/ads/marketplace/jewelry-gems' },
        { name: 'Home/Office Accessories & Tech Gadgets', path: '/ads/marketplace/accessories-gadgets' },
        { name: 'Fashion/Beauty & Clothing Items', path: '/ads/marketplace/fashion-beauty' },
        { name: 'Daily Grocery Essentials', path: '/ads/marketplace/grocery' },
        { name: 'Organic Herbal Products & Spices', path: '/ads/marketplace/herbal-spices' },
        { name: 'Books, Magazines & Educational Materials', path: '/ads/marketplace/books-education' },
        { name: 'Other Items', path: '/ads/marketplace/other-items' },
        { name: 'Create Your Own Store : It\'s Time To Shoping', path: '/ads/marketplace/create-store' },
      ]
    },
    {
      id: 'entertainment-fitness',
      name: 'Entertainment & Fitness',
      icon: Music,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      subcategories: [
        { name: 'Holiday Memories (BLog Posts & Photos)', path: '/ads/entertainment/holiday-memories' },
        { name: 'Exclusive Combo Packages (Wedding, Tour and More)', path: '/ads/entertainment/combo-packages' },
        { name: 'Talented Entertainers & Artists', path: '/ads/entertainment/entertainers-artists' },
        { name: 'Fitness & Health : Spas, Gym Ect. & Professionals', path: '/ads/entertainment/fitness-health' },
        { name: 'Cinema & Movie Hub', path: '/ads/entertainment/cinema-movies' },
        { name: 'Social Media Promotions', path: '/ads/entertainment/social-media' },
      ]
    },
    {
      id: 'special-opportunities',
      name: 'Special Opportunities',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      subcategories: [
        { name: 'Exciting Job Opportunities', path: '/ads/opportunities/jobs' },
        { name: 'Crypto Consulting & Signals', path: '/ads/opportunities/crypto' },
        { name: 'Local SIM Cards & Mobile Data Plans', path: '/ads/opportunities/sim-data' },
        { name: 'Custom Ads Campaigns', path: '/ads/opportunities/ads-campaigns' },
        { name: 'Com.Partners & Partnerships', path: '/ads/opportunities/partnerships' },
        { name: 'Exclusive Offers & Promotions', path: '/ads/opportunities/offers-promotions' },
      ]
    },
    {
      id: 'essential-services',
      name: 'Essential Services',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      subcategories: [
        { name: 'Emergency Services & insurance', path: '/ads/essential/emergency-insurance' },
        { name: 'Pricing & Memberships', path: '/ads/essential/pricing-memberships' },
        { name: 'Mission Board, User Manual & Important Notice', path: '/ads/essential/mission-manual' },
      ]
    }
  ];

  const featuredSections = [
        {
      title: 'Featured Ads',
      icon: Star,
      color: 'text-yellow-600',
      path: '/ads/featured'
    },
    {
      title: 'Trending Now',
      icon: TrendingUp,
      color: 'text-pink-600',
      path: '/ads/trending'
    },
    {
      title: 'Recently Added',
      icon: Clock,
      color: 'text-gray-600',
      path: '/ads/recent'
    },
    {
      title: 'Premium Listings',
      icon: DollarSign,
      color: 'text-emerald-600',
      path: '/ads/premium'
    },
    {
      title: 'Post Your Advertisement',
      icon: PlusCircle,
      color: 'text-blue-600',
      path: '/post-advertisement'
    },
    {
      title: 'Promo codes & Travel Agents',
      icon: Gift,
      color: 'text-purple-600',
      path: '/promo-codes-travel-agents'
    },
    {
      title: 'Coins (HSC) and Treasure',
      icon: Coins,
      color: 'text-yellow-600',
      path: '/hsc-treasure'
    },
    {
      title: 'Plan Your Dream Tour',
      icon: MapPin,
      color: 'text-green-600',
      path: '/plan-dream-tour'
    }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Advertisement Categories
          </h2>

          {/* Featured Sections */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Featured
            </h3>
            <div className="space-y-1">
              {featuredSections.map((section) => (
                <Link
                  key={section.title}
                  to={section.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive(section.path)
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={onClose}
                >
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                  <span className="text-sm font-medium">{section.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Advertisement Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="space-y-2">
              {advertisementCategories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-md ${category.bgColor} dark:bg-gray-800`}>
                        <category.icon className={`w-4 h-4 ${category.color}`} />
                      </div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    {expandedCategories[category.id] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {/* Subcategories */}
                  {expandedCategories[category.id] && (
                    <div className="ml-6 mt-2 space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.path}
                          to={subcategory.path}
                          className={`block px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                            isActive(subcategory.path)
                              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                          }`}
                          onClick={onClose}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* HSC Information */}
          <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg">
            <h4 className="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-2">
              HSC Token System
            </h4>
            <p className="text-xs text-primary-700 dark:text-primary-300 mb-3">
              Use HSC tokens to publish your advertisements and reach more customers.
            </p>
            <Link
              to="/hsc"
              className="inline-flex items-center text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              onClick={onClose}
            >
              Buy HSC Tokens →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
