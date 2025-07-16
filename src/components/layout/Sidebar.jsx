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
  DollarSign
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const location = useLocation();

  const advertisementCategories = [
    {
      id: 'hotels',
      name: 'Hotels & Accommodation',
      icon: Hotel,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      subcategories: [
        { name: 'Luxury Hotels', path: '/ads/hotels/luxury' },
        { name: 'Budget Hotels', path: '/ads/hotels/budget' },
        { name: 'Boutique Hotels', path: '/ads/hotels/boutique' },
        { name: 'Resorts', path: '/ads/hotels/resorts' },
        { name: 'Guesthouses', path: '/ads/hotels/guesthouses' },
        { name: 'Homestays', path: '/ads/hotels/homestays' },
      ]
    },
    {
      id: 'guides',
      name: 'Tour Guides & Services',
      icon: Compass,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      subcategories: [
        { name: 'Professional Guides', path: '/ads/guides/professional' },
        { name: 'Local Guides', path: '/ads/guides/local' },
        { name: 'Adventure Guides', path: '/ads/guides/adventure' },
        { name: 'Cultural Tours', path: '/ads/guides/cultural' },
        { name: 'Wildlife Tours', path: '/ads/guides/wildlife' },
        { name: 'Photography Tours', path: '/ads/guides/photography' },
      ]
    },
    {
      id: 'vehicles',
      name: 'Transportation',
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      subcategories: [
        { name: 'Car Rentals', path: '/ads/vehicles/cars' },
        { name: 'Van Rentals', path: '/ads/vehicles/vans' },
        { name: 'Bus Services', path: '/ads/vehicles/buses' },
        { name: 'Tuk Tuk Services', path: '/ads/vehicles/tuktuk' },
        { name: 'Bike Rentals', path: '/ads/vehicles/bikes' },
        { name: 'Boat Services', path: '/ads/vehicles/boats' },
      ]
    },
    {
      id: 'restaurants',
      name: 'Restaurants & Dining',
      icon: UtensilsCrossed,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      subcategories: [
        { name: 'Fine Dining', path: '/ads/restaurants/fine-dining' },
        { name: 'Local Cuisine', path: '/ads/restaurants/local' },
        { name: 'Street Food', path: '/ads/restaurants/street-food' },
        { name: 'Cafes & Bakeries', path: '/ads/restaurants/cafes' },
        { name: 'Seafood', path: '/ads/restaurants/seafood' },
        { name: 'Vegetarian', path: '/ads/restaurants/vegetarian' },
      ]
    },
    {
      id: 'attractions',
      name: 'Attractions & Activities',
      icon: Camera,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      subcategories: [
        { name: 'Historical Sites', path: '/ads/attractions/historical' },
        { name: 'Natural Attractions', path: '/ads/attractions/natural' },
        { name: 'Adventure Sports', path: '/ads/attractions/adventure' },
        { name: 'Water Sports', path: '/ads/attractions/water-sports' },
        { name: 'Cultural Shows', path: '/ads/attractions/cultural' },
        { name: 'Wildlife Parks', path: '/ads/attractions/wildlife' },
      ]
    },
    {
      id: 'destinations',
      name: 'Popular Destinations',
      icon: MapPin,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      subcategories: [
        { name: 'Colombo', path: '/ads/destinations/colombo' },
        { name: 'Kandy', path: '/ads/destinations/kandy' },
        { name: 'Galle', path: '/ads/destinations/galle' },
        { name: 'Nuwara Eliya', path: '/ads/destinations/nuwara-eliya' },
        { name: 'Sigiriya', path: '/ads/destinations/sigiriya' },
        { name: 'Ella', path: '/ads/destinations/ella' },
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
