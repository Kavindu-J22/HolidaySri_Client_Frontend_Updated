import React, { useState, useMemo } from 'react';
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
  Search,
  X,
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
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const advertisementCategories = [
    {
      id: 'tourism-travel',
      name: 'Tourism And Travel',
      icon: Compass,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      subcategories: [
        { name: 'Explore Locations', path: '/explore-locations' },
        { name: 'Find Travel Buddies', path: '/travel-buddies' },
        { name: 'Expert Tour Guiders', path: '/ads/tourism/tour-guiders' },
        { name: 'Local Tour Packages', path: '/local-tour-packages' },
        { name: 'Customize Tour Package', path: '/ads/tourism/customize-package' },
        { name: 'TravelSafe & Help Professionals', path: '/ads/tourism/travel-safe' },
        { name: 'Rent a Land for Camping or Parking purposes', path: '/rent-land-camping-parking' },
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
        { name: 'Cafes & Restaurants', path: '/cafes-restaurants' },
        { name: 'Foods & Beverages', path: '/foods-beverages' },
      ]
    },
    {
      id: 'vehicles-transport',
      name: 'Vehicles & Transport',
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      subcategories: [
        { name: 'Vehicle Rentals & Hire Services', path: '/vehicle-rentals-hire' },
        { name: 'Live Rides Updates & Carpooling', path: '/ads/transport/rides-carpooling' },
        { name: 'Professional Drivers', path: '/professional-drivers' },
        { name: 'Vehicle Repairs & Mechanics', path: '/vehicle-repairs-mechanics' },
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
        { name: 'Expert Event Planners & day Coordinators', path: '/event-planners-coordinators' },
        { name: 'Creative Photographers', path: '/ads/events/photographers' },
        { name: 'Decorators & Florists', path: '/decorators-florists' },
        { name: 'Salon & Makeup Artists', path: '/salon-makeup-artists' },
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
        { name: 'Meet Expert Doctors', path: '/expert-doctors' },
        { name: 'Professional Lawyers', path: '/professional-lawyers' },
        { name: 'Experienced Advisors & Counselors', path: '/advisors-counselors' },
        { name: 'Language Translators & Interpreters', path: '/language-translators' },
        { name: 'Expert Architects', path: '/expert-architects-browse' },
        { name: 'Trusted Astrologists', path: '/ads/professionals/astrologists' },
        { name: 'Delivery Partners', path: '/delivery-partners' },
        { name: 'Graphics/IT Supports & Tech Repair Services', path: '/graphics-it-tech-repair' },
        { name: 'Educational & Tutoring Services', path: '/educational-tutoring' },
        { name: 'Currency Exchange Rates & Services', path: '/currency-exchange' },
        { name: 'Other Professionals & Services', path: '/other-professionals-services' },
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
        { name: 'Trusted Babysitters & Childcare Help', path: '/babysitters-childcare' },
        { name: 'Pet Care & Animal Services', path: '/pet-care-animal-services' },
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
        { name: 'Become a Holidaysri Member', path: '/ads/essential/pricing-memberships' },
        { name: 'Com.Partners & Partnerships', path: '/ads/opportunities/partnerships' },
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

  // Filter categories and subcategories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return advertisementCategories;
    }

    const searchLower = searchTerm.toLowerCase();
    return advertisementCategories.map(category => {
      // Check if category name matches
      const categoryMatches = category.name.toLowerCase().includes(searchLower);

      // Filter subcategories that match the search term
      const filteredSubcategories = category.subcategories.filter(subcategory =>
        subcategory.name.toLowerCase().includes(searchLower)
      );

      // Include category if either the category name matches or it has matching subcategories
      if (categoryMatches || filteredSubcategories.length > 0) {
        return {
          ...category,
          subcategories: categoryMatches ? category.subcategories : filteredSubcategories,
          // Auto-expand categories when searching and they have matching subcategories
          autoExpand: !categoryMatches && filteredSubcategories.length > 0
        };
      }
      return null;
    }).filter(Boolean);
  }, [searchTerm, advertisementCategories]);

  // Auto-expand categories when searching
  React.useEffect(() => {
    if (searchTerm.trim()) {
      const newExpandedCategories = {};
      filteredCategories.forEach(category => {
        if (category.autoExpand) {
          newExpandedCategories[category.id] = true;
        }
      });
      setExpandedCategories(prev => ({ ...prev, ...newExpandedCategories }));
    }
  }, [searchTerm, filteredCategories]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && isOpen) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto shadow-xl lg:shadow-none
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Categories
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Categories
              </h3>
              {searchTerm && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {filteredCategories.length} found
                </span>
              )}
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* No Results Message */}
            {searchTerm && filteredCategories.length === 0 && (
              <div className="text-center py-8">
                <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No categories found for "{searchTerm}"
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                >
                  Clear search
                </button>
              </div>
            )}

            <div className="space-y-2">
              {filteredCategories.map((category) => (
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
                    <div className="ml-6 mt-3 space-y-1 relative animate-slide-down">
                      {/* Connecting line */}
                      <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-gray-300 via-gray-200 to-transparent dark:from-gray-600 dark:via-gray-700 dark:to-transparent" />

                      {category.subcategories.map((subcategory, index) => {
                        const isActiveSubcat = isActive(subcategory.path);
                        const categoryColorClass = category.color;
                        const categoryBgClass = category.bgColor;

                        return (
                          <Link
                            key={subcategory.path}
                            to={subcategory.path}
                            className={`sidebar-subcategory flex items-center space-x-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-300 group relative transform hover:translate-x-1 animate-slide-in-left ${
                              isActiveSubcat
                                ? `${categoryBgClass} dark:bg-gray-800 ${categoryColorClass} dark:text-white border-l-3 shadow-sm`
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 hover:shadow-sm'
                            } ${
                              isActiveSubcat && categoryColorClass === 'text-blue-600' ? 'border-blue-600' :
                              isActiveSubcat && categoryColorClass === 'text-green-600' ? 'border-green-600' :
                              isActiveSubcat && categoryColorClass === 'text-purple-600' ? 'border-purple-600' :
                              isActiveSubcat && categoryColorClass === 'text-red-600' ? 'border-red-600' :
                              isActiveSubcat && categoryColorClass === 'text-indigo-600' ? 'border-indigo-600' :
                              isActiveSubcat && categoryColorClass === 'text-pink-600' ? 'border-pink-600' :
                              isActiveSubcat && categoryColorClass === 'text-orange-600' ? 'border-orange-600' :
                              isActiveSubcat && categoryColorClass === 'text-cyan-600' ? 'border-cyan-600' :
                              isActiveSubcat && categoryColorClass === 'text-yellow-600' ? 'border-yellow-600' :
                              isActiveSubcat && categoryColorClass === 'text-gray-600' ? 'border-gray-600' :
                              'hover:border-l-3 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            onClick={onClose}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {/* Creative bullet point with category-specific colors */}
                            <div className={`relative flex-shrink-0 ${isActiveSubcat ? 'animate-pulse' : ''}`}>
                              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                isActiveSubcat
                                  ? `shadow-lg ${
                                      categoryColorClass === 'text-blue-600' ? 'bg-blue-600' :
                                      categoryColorClass === 'text-green-600' ? 'bg-green-600' :
                                      categoryColorClass === 'text-purple-600' ? 'bg-purple-600' :
                                      categoryColorClass === 'text-red-600' ? 'bg-red-600' :
                                      categoryColorClass === 'text-indigo-600' ? 'bg-indigo-600' :
                                      categoryColorClass === 'text-pink-600' ? 'bg-pink-600' :
                                      categoryColorClass === 'text-orange-600' ? 'bg-orange-600' :
                                      categoryColorClass === 'text-cyan-600' ? 'bg-cyan-600' :
                                      categoryColorClass === 'text-yellow-600' ? 'bg-yellow-600' :
                                      'bg-gray-600'
                                    }`
                                  : `bg-gray-300 dark:bg-gray-600 group-hover:shadow-md group-hover:scale-110 ${
                                      categoryColorClass === 'text-blue-600' ? 'group-hover:bg-blue-600' :
                                      categoryColorClass === 'text-green-600' ? 'group-hover:bg-green-600' :
                                      categoryColorClass === 'text-purple-600' ? 'group-hover:bg-purple-600' :
                                      categoryColorClass === 'text-red-600' ? 'group-hover:bg-red-600' :
                                      categoryColorClass === 'text-indigo-600' ? 'group-hover:bg-indigo-600' :
                                      categoryColorClass === 'text-pink-600' ? 'group-hover:bg-pink-600' :
                                      categoryColorClass === 'text-orange-600' ? 'group-hover:bg-orange-600' :
                                      categoryColorClass === 'text-cyan-600' ? 'group-hover:bg-cyan-600' :
                                      categoryColorClass === 'text-yellow-600' ? 'group-hover:bg-yellow-600' :
                                      'group-hover:bg-gray-600'
                                    }`
                              }`} />
                              {/* Outer ring on hover */}
                              <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-300 group-hover:scale-150 ${
                                categoryColorClass === 'text-blue-600' ? 'bg-blue-600' :
                                categoryColorClass === 'text-green-600' ? 'bg-green-600' :
                                categoryColorClass === 'text-purple-600' ? 'bg-purple-600' :
                                categoryColorClass === 'text-red-600' ? 'bg-red-600' :
                                categoryColorClass === 'text-indigo-600' ? 'bg-indigo-600' :
                                categoryColorClass === 'text-pink-600' ? 'bg-pink-600' :
                                categoryColorClass === 'text-orange-600' ? 'bg-orange-600' :
                                categoryColorClass === 'text-cyan-600' ? 'bg-cyan-600' :
                                categoryColorClass === 'text-yellow-600' ? 'bg-yellow-600' :
                                'bg-gray-600'
                              }`} />
                            </div>

                            {/* Subcategory name with enhanced typography */}
                            <span className="flex-1 leading-relaxed font-medium group-hover:font-semibold transition-all duration-200">
                              {subcategory.name}
                            </span>

                            {/* Enhanced arrow indicator with slide animation */}
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                              <div className={`w-1 h-1 rounded-full ${
                                isActiveSubcat
                                  ? categoryColorClass.replace('text-', 'bg-')
                                  : `bg-gray-400 dark:bg-gray-500 ${
                                      categoryColorClass === 'text-blue-600' ? 'group-hover:bg-blue-600' :
                                      categoryColorClass === 'text-green-600' ? 'group-hover:bg-green-600' :
                                      categoryColorClass === 'text-purple-600' ? 'group-hover:bg-purple-600' :
                                      categoryColorClass === 'text-red-600' ? 'group-hover:bg-red-600' :
                                      categoryColorClass === 'text-indigo-600' ? 'group-hover:bg-indigo-600' :
                                      categoryColorClass === 'text-pink-600' ? 'group-hover:bg-pink-600' :
                                      categoryColorClass === 'text-orange-600' ? 'group-hover:bg-orange-600' :
                                      categoryColorClass === 'text-cyan-600' ? 'group-hover:bg-cyan-600' :
                                      categoryColorClass === 'text-yellow-600' ? 'group-hover:bg-yellow-600' :
                                      'group-hover:bg-gray-600'
                                    }`
                              }`} />
                              <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${
                                isActiveSubcat
                                  ? categoryColorClass
                                  : `text-gray-400 dark:text-gray-500 ${categoryColorClass.replace('text-', 'group-hover:text-')}`
                              }`} />
                            </div>
                          </Link>
                        );
                      })}
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
