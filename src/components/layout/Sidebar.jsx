import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Hotel,
  MapPin,
  Car,
  UtensilsCrossed,
  Compass,
  Mountain,
  Star,
  PlusCircle,
  Gift,
  Coins,
  Users,
  Shield,
  Wrench,
  Calendar,
  Search,
  X,
  Settings,
  Truck,
  Package,
  Apple,
  Download,
  Handshake,
  AlertTriangle,
  PanelLeftClose,
  PanelLeftOpen,
  Crown,
  Sparkles,
  UserCheck
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const location = useLocation();

  React.useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const effectiveCollapsed = isDesktop && isCollapsed;

  const categorySections = [
    {
      title: 'Tourism And Travel',
      items: [
        {
          name: 'Explore Locations',
          path: '/explore-locations',
          icon: MapPin,
          color: 'text-sky-600 dark:text-sky-400',
          bgColor: 'bg-sky-50 dark:bg-sky-950/40',
          activeBorder: 'border-sky-500'
        },
        {
          name: 'Find Travel Buddies',
          path: '/travel-buddies',
          icon: Users,
          color: 'text-indigo-600 dark:text-indigo-400',
          bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
          activeBorder: 'border-indigo-500'
        },
        {
          name: 'Expert Tour Guiders',
          path: '/ads/tourism/tour-guiders',
          icon: Compass,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/40',
          activeBorder: 'border-blue-500'
        },
        {
          name: 'Local Tour Packages',
          path: '/local-tour-packages',
          icon: Package,
          color: 'text-teal-600 dark:text-teal-400',
          bgColor: 'bg-teal-50 dark:bg-teal-950/40',
          activeBorder: 'border-teal-500'
        },
        {
          name: 'Customize Tour Package',
          path: '/ads/tourism/customize-package',
          icon: Settings,
          color: 'text-violet-600 dark:text-violet-400',
          bgColor: 'bg-violet-50 dark:bg-violet-950/40',
          activeBorder: 'border-violet-500'
        },
        {
          name: 'TravelSafe & Help Professionals',
          path: '/ads/tourism/travel-safe',
          icon: Shield,
          color: 'text-emerald-600 dark:text-emerald-400',
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
          activeBorder: 'border-emerald-500'
        },
        {
          name: 'Rent a Land for Camping or Parking purposes',
          path: '/rent-land-camping-parking',
          icon: Mountain,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-950/40',
          activeBorder: 'border-green-500'
        },
      ]
    },
    {
      title: 'Accommodation & Dining',
      items: [
        {
          name: 'Hotels & Accommodations',
          path: '/hotels-accommodations',
          icon: Hotel,
          color: 'text-rose-600 dark:text-rose-400',
          bgColor: 'bg-rose-50 dark:bg-rose-950/40',
          activeBorder: 'border-rose-500'
        },
        {
          name: 'Cafes & Restaurants',
          path: '/cafes-restaurants',
          icon: UtensilsCrossed,
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-50 dark:bg-amber-950/40',
          activeBorder: 'border-amber-500'
        },
        {
          name: 'Foods & Beverages',
          path: '/foods-beverages',
          icon: Apple,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-950/40',
          activeBorder: 'border-orange-500'
        },
      ]
    },
    {
      title: 'Vehicles & Transport',
      items: [
        {
          name: 'Vehicle Rentals & Hire Services',
          path: '/vehicle-rentals-hire',
          icon: Car,
          color: 'text-cyan-600 dark:text-cyan-400',
          bgColor: 'bg-cyan-50 dark:bg-cyan-950/40',
          activeBorder: 'border-cyan-500'
        },
        {
          name: 'Live Rides Updates & Carpooling',
          path: '/ads/vehicles-transport/live-rides-carpooling',
          icon: Truck,
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-50 dark:bg-purple-950/40',
          activeBorder: 'border-purple-500'
        },
        {
          name: 'Professional Drivers',
          path: '/professional-drivers',
          icon: UserCheck,
          color: 'text-blue-700 dark:text-blue-300',
          bgColor: 'bg-blue-100 dark:bg-blue-900/50',
          activeBorder: 'border-blue-700'
        },
        {
          name: 'Vehicle Repairs & Mechanics',
          path: '/vehicle-repairs-mechanics',
          icon: Wrench,
          color: 'text-slate-700 dark:text-slate-300',
          bgColor: 'bg-slate-100 dark:bg-slate-800',
          activeBorder: 'border-slate-600'
        },
      ]
    },
    {
      title: 'Events & Management',
      items: [
        {
          name: 'Events & Festivals Updates',
          path: '/ads/events-management/events-updates',
          icon: Calendar,
          color: 'text-fuchsia-600 dark:text-fuchsia-400',
          bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
          activeBorder: 'border-fuchsia-500'
        },
        {
          name: 'Manage or Customize Your Event',
          path: '/ads/events-management/customize-event',
          icon: Sparkles,
          color: 'text-pink-600 dark:text-pink-400',
          bgColor: 'bg-pink-50 dark:bg-pink-950/40',
          activeBorder: 'border-pink-500'
        },
      ]
    },
    {
      title: 'Essential Services',
      items: [
        {
          name: 'Emergency Services & Insurance',
          path: '/ads/essential-services/emergency-services-insurance',
          icon: AlertTriangle,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-950/40',
          activeBorder: 'border-red-500'
        },
        {
          name: 'Become a Holidaysri Member',
          path: '/ads/essential/pricing-memberships',
          icon: Crown,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/40',
          activeBorder: 'border-yellow-500'
        },
        {
          name: 'Com.Partners & Partnerships',
          path: '/ads/opportunities/partnerships',
          icon: Handshake,
          color: 'text-lime-600 dark:text-lime-400',
          bgColor: 'bg-lime-50 dark:bg-lime-950/40',
          activeBorder: 'border-lime-500'
        },
      ]
    }
  ];

  const promoCodesSection = {
    title: 'Promo Codes & Travel Agents',
    subtitle: 'Exclusive Deals & Trusted Travel Partners 🎁',
    icon: Gift,
    color: 'text-purple-600',
    path: '/promo-codes-travel-agents'
  };

  const planYourDreamTourSection = {
    title: 'Plan Your Dream Tour',
    subtitle: 'Create Your Perfect Sri Lankan Adventure 🗺️',
    icon: MapPin,
    color: 'text-green-600',
    path: '/plan-dream-tour'
  };

  const coinsTreasureSection = {
    title: 'Coins (HSC) & Treasure',
    subtitle: 'Buy HSC Coins Tokens & Discover Rewards 💰💎',
    icon: Coins,
    color: 'text-yellow-600',
    path: '/hsc-treasure'
  };

  const featuredSections = [
    {
      title: 'All & Featured Ads',
      icon: Star,
      color: 'text-yellow-600',
      path: '/ads/featured'
    },
    {
      title: 'Post Your Advertisement',
      icon: PlusCircle,
      color: 'text-blue-600',
      path: '/post-advertisement'
    },
    {
      title: 'Download App',
      icon: Download,
      color: 'text-indigo-600',
      path: '/download'
    }
  ];

  // Filter sections and items based on search term
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) {
      return categorySections;
    }

    const searchLower = searchTerm.toLowerCase();
    return categorySections
      .map(section => {
        const sectionMatches = section.title.toLowerCase().includes(searchLower);
        const filteredItems = section.items.filter(item =>
          item.name.toLowerCase().includes(searchLower)
        );

        if (sectionMatches || filteredItems.length > 0) {
          return {
            ...section,
            items: sectionMatches ? section.items : filteredItems
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [searchTerm, categorySections]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

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
    if (distance > 50 && isOpen) {
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

      {/* Sidebar container */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${effectiveCollapsed ? 'w-20' : 'w-80'}
          bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm
          border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto overflow-x-hidden shadow-xl lg:shadow-none
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Desktop collapse toggle button */}
        <div className="hidden lg:flex justify-end p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
            title={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {effectiveCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile header */}
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

        <div className={`${effectiveCollapsed ? 'p-3' : 'p-6'} transition-all duration-300`}>
          {/* Header - only show when expanded */}
          {!effectiveCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Advertisement Categories
            </h2>
          )}

          {/* Featured Sections */}
          <div className={`${effectiveCollapsed ? 'mb-4' : 'mb-8'}`}>
            {!effectiveCollapsed && (
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Featured
              </h3>
            )}
            <div className={`${effectiveCollapsed ? 'space-y-2' : 'space-y-1'}`}>
              {featuredSections.map((section) => (
                <Link
                  key={section.title}
                  to={section.path}
                  className={`group relative flex items-center ${effectiveCollapsed ? 'justify-center p-3' : 'space-x-3 px-3 py-2'} rounded-lg transition-all duration-200 ${
                    isActive(section.path)
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={onClose}
                  title={effectiveCollapsed ? section.title : undefined}
                >
                  <section.icon className={`w-5 h-5 ${section.color} flex-shrink-0`} />
                  {!effectiveCollapsed && <span className="text-sm font-medium">{section.title}</span>}

                  {effectiveCollapsed && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                      {section.title}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                    </div>
                  )}
                </Link>
              ))}

              {/* Promo Codes & Travel Agents */}
              <Link
                to={promoCodesSection.path}
                className={`group relative flex items-center ${effectiveCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'} rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isActive(promoCodesSection.path)
                    ? 'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 shadow-md'
                    : 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 shadow-sm hover:shadow-md'
                }`}
                onClick={onClose}
                title={effectiveCollapsed ? promoCodesSection.title : undefined}
              >
                <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                  <promoCodesSection.icon className={`w-5 h-5 ${promoCodesSection.color}`} />
                </div>
                {!effectiveCollapsed && (
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {promoCodesSection.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {promoCodesSection.subtitle}
                    </div>
                  </div>
                )}

                {effectiveCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                    <div className="font-semibold">{promoCodesSection.title}</div>
                    <div className="text-xs opacity-90">{promoCodesSection.subtitle}</div>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                  </div>
                )}
              </Link>

              {/* Plan Your Dream Tour */}
              <Link
                to={planYourDreamTourSection.path}
                className={`group relative flex items-center ${effectiveCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'} rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isActive(planYourDreamTourSection.path)
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 shadow-md'
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 shadow-sm hover:shadow-md'
                }`}
                onClick={onClose}
                title={effectiveCollapsed ? planYourDreamTourSection.title : undefined}
              >
                <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                  <planYourDreamTourSection.icon className={`w-5 h-5 ${planYourDreamTourSection.color}`} />
                </div>
                {!effectiveCollapsed && (
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {planYourDreamTourSection.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {planYourDreamTourSection.subtitle}
                    </div>
                  </div>
                )}

                {effectiveCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                    <div className="font-semibold">{planYourDreamTourSection.title}</div>
                    <div className="text-xs opacity-90">{planYourDreamTourSection.subtitle}</div>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                  </div>
                )}
              </Link>

              {/* Coins (HSC) & Treasure */}
              <Link
                to={coinsTreasureSection.path}
                className={`group relative flex items-center ${effectiveCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'} rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isActive(coinsTreasureSection.path)
                    ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 shadow-md'
                    : 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-900/30 dark:hover:to-amber-900/30 shadow-sm hover:shadow-md'
                }`}
                onClick={onClose}
                title={effectiveCollapsed ? coinsTreasureSection.title : undefined}
              >
                <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                  <coinsTreasureSection.icon className={`w-5 h-5 ${coinsTreasureSection.color}`} />
                </div>
                {!effectiveCollapsed && (
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {coinsTreasureSection.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {coinsTreasureSection.subtitle}
                    </div>
                  </div>
                )}

                {effectiveCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                    <div className="font-semibold">{coinsTreasureSection.title}</div>
                    <div className="text-xs opacity-90">{coinsTreasureSection.subtitle}</div>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                  </div>
                )}
              </Link>
            </div>
          </div>

          {/* Advertisement Categories */}
          <div>
            {effectiveCollapsed && (
              <div className="border-t border-gray-200 dark:border-gray-700 mb-4" />
            )}

            {!effectiveCollapsed && (
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categories
                </h3>
                {searchTerm && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {filteredSections.reduce((acc, sec) => acc + sec.items.length, 0)} found
                  </span>
                )}
              </div>
            )}

            {/* Search Input */}
            {!effectiveCollapsed && (
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
            )}

            {/* No Results Message */}
            {!effectiveCollapsed && searchTerm && filteredSections.length === 0 && (
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

            {/* Categories List */}
            <div className="space-y-5">
              {filteredSections.map((section) => (
                <div key={section.title} className="space-y-1.5">
                  {/* Section Title Header */}
                  {!effectiveCollapsed && (
                    <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800/60 mb-2 pb-1">
                      {section.title}
                    </div>
                  )}

                  {section.items.map((item) => {
                    const active = isActive(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`group relative flex items-center ${
                          effectiveCollapsed ? 'justify-center p-3' : 'space-x-3 px-3 py-2.5'
                        } rounded-xl transition-all duration-200 ${
                          active
                            ? `${item.bgColor} ${item.color} font-semibold shadow-sm border-l-4 ${item.activeBorder}`
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        title={effectiveCollapsed ? `${item.name} (${section.title})` : undefined}
                      >
                        <div
                          className={`flex-shrink-0 ${
                            effectiveCollapsed ? 'p-2' : 'p-1.5'
                          } rounded-lg ${item.bgColor} transition-transform duration-200 group-hover:scale-110`}
                        >
                          <ItemIcon className={`${effectiveCollapsed ? 'w-5 h-5' : 'w-4 h-4'} ${item.color}`} />
                        </div>

                        {!effectiveCollapsed && (
                          <span className="text-sm leading-snug flex-1">
                            {item.name}
                          </span>
                        )}

                        {/* Collapsed mode tooltip */}
                        {effectiveCollapsed && (
                          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-xs text-gray-300">{section.title}</div>
                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* HSC Information */}
          {effectiveCollapsed ? (
            <div className="mt-4 flex justify-center">
              <Link
                to="/hsc"
                onClick={onClose}
                className="group relative p-3 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-lg hover:shadow-md transition-all duration-200"
                title="HSC Token System"
              >
                <Coins className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                  HSC Token System
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                </div>
              </Link>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
