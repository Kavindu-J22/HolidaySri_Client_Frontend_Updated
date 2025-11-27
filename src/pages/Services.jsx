import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO/SEO';
import { getServiceSchema } from '../utils/seoUtils';
import {
  Compass,
  Hotel,
  Car,
  Calendar,
  Briefcase,
  Heart,
  ShoppingBag,
  Music,
  Zap,
  Settings,
  Search,
  ArrowRight,
  MapPin,
  Users,
  UtensilsCrossed,
  Camera,
  Wrench,
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
  Gift,
  Sparkles,
  TrendingUp,
  ChevronRight,
  X,
  UserCheck,
  Shield,
  Tent,
  Coffee,
  Palette,
  Scissors,
  Building,
  DollarSign,
  Flower2,
  Image,
  Headphones,
  Coins
} from 'lucide-react';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // All service categories with their details
  const serviceCategories = [
    {
      id: 'tourism-travel',
      name: 'Tourism & Travel',
      icon: Compass,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-900/20',
      description: 'Explore Sri Lanka with expert guides, tour packages, and travel companions',
      services: [
        { name: 'Explore Locations', path: '/explore-locations', description: 'Discover amazing destinations across Sri Lanka', icon: MapPin },
        { name: 'Find Travel Buddies', path: '/travel-buddies', description: 'Connect with fellow travelers', icon: Users },
        { name: 'Expert Tour Guiders', path: '/ads/tourism/tour-guiders', description: 'Professional local tour guides', icon: Compass },
        { name: 'Local Tour Packages', path: '/local-tour-packages', description: 'Curated tour packages for every budget', icon: Package },
        { name: 'Customize Tour Package', path: '/ads/tourism/customize-package', description: 'Create your personalized tour', icon: Target },
        { name: 'TravelSafe & Help Professionals', path: '/ads/tourism/travel-safe', description: 'Travel assistance and safety services', icon: Shield },
        { name: 'Rent a Land for Camping or Parking', path: '/rent-land-camping-parking', description: 'Find perfect camping spots', icon: Tent },
      ]
    },
    {
      id: 'accommodation-dining',
      name: 'Accommodation & Dining',
      icon: Hotel,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      darkBgColor: 'dark:bg-green-900/20',
      description: 'Comfortable stays and delicious dining experiences',
      services: [
        { name: 'Hotels & Accommodations', path: '/hotels-accommodations', description: 'Book hotels, resorts, and guesthouses', icon: Hotel },
        { name: 'Cafes & Restaurants', path: '/cafes-restaurants', description: 'Discover local and international cuisine', icon: UtensilsCrossed },
        { name: 'Foods & Beverages', path: '/foods-beverages', description: 'Order food and beverages', icon: Coffee },
      ]
    },
    {
      id: 'vehicles-transport',
      name: 'Vehicles & Transport',
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      darkBgColor: 'dark:bg-purple-900/20',
      description: 'Reliable transportation solutions for your journey',
      services: [
        { name: 'Vehicle Rentals & Hire Services', path: '/vehicle-rentals-hire', description: 'Rent cars, vans, bikes, and more', icon: Car },
        { name: 'Live Rides Updates & Carpooling', path: '/ads/vehicles-transport/live-rides-carpooling', description: 'Share rides and save money', icon: Share2 },
        { name: 'Professional Drivers', path: '/professional-drivers', description: 'Hire experienced drivers', icon: UserCheck },
        { name: 'Vehicle Repairs & Mechanics', path: '/vehicle-repairs-mechanics', description: 'Trusted vehicle repair services', icon: Wrench },
      ]
    },
    {
      id: 'events-management',
      name: 'Events & Management',
      icon: Calendar,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      darkBgColor: 'dark:bg-red-900/20',
      description: 'Make your special events unforgettable',
      services: [
        { name: 'Events & Festivals Updates', path: '/ads/events-management/events-updates', description: 'Stay updated on local events', icon: Calendar },
        { name: 'Manage or Customize Your Event', path: '/ads/events-management/customize-event', description: 'Plan your perfect event', icon: Target },
        { name: 'Expert Event Planners & Coordinators', path: '/event-planners-coordinators', description: 'Professional event planning', icon: Briefcase },
        { name: 'Creative Photographers', path: '/ads/events/photographers', description: 'Capture your precious moments', icon: Camera },
        { name: 'Decorators & Florists', path: '/decorators-florists', description: 'Beautiful decorations and flowers', icon: Flower2 },
        { name: 'Salon & Makeup Artists', path: '/salon-makeup-artists', description: 'Look your best for any occasion', icon: Scissors },
        { name: 'Fashion Designers', path: '/ads/events/fashion-designers', description: 'Custom fashion and styling', icon: Shirt },
      ]
    },
    {
      id: 'professionals-services',
      name: 'Professionals & Services',
      icon: Briefcase,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      darkBgColor: 'dark:bg-indigo-900/20',
      description: 'Expert professional services for all your needs',
      services: [
        { name: 'Meet Expert Doctors', path: '/expert-doctors', description: 'Consult with medical professionals', icon: Stethoscope },
        { name: 'Professional Lawyers', path: '/professional-lawyers', description: 'Legal advice and representation', icon: Scale },
        { name: 'Experienced Advisors & Counselors', path: '/advisors-counselors', description: 'Professional guidance and counseling', icon: MessageCircle },
        { name: 'Language Translators & Interpreters', path: '/language-translators', description: 'Translation and interpretation services', icon: Languages },
        { name: 'Expert Architects', path: '/expert-architects-browse', description: 'Architectural design and planning', icon: Building },
        { name: 'Trusted Astrologists', path: '/ads/professionals/astrologists', description: 'Astrological consultations', icon: Stars },
        { name: 'Delivery Partners', path: '/delivery-partners', description: 'Reliable delivery services', icon: Truck },
        { name: 'Graphics/IT Supports & Tech Repair', path: '/graphics-it-tech-repair', description: 'IT support and tech repairs', icon: Monitor },
        { name: 'Educational & Tutoring Services', path: '/educational-tutoring', description: 'Quality education and tutoring', icon: GraduationCap },
        { name: 'Currency Exchange Rates & Services', path: '/currency-exchange', description: 'Best currency exchange rates', icon: DollarSign },
        { name: 'Other Professionals & Services', path: '/other-professionals-services', description: 'Various professional services', icon: Briefcase },
      ]
    },
    {
      id: 'caring-donations',
      name: 'Caring & Donations',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      darkBgColor: 'dark:bg-pink-900/20',
      description: 'Compassionate care and community support',
      services: [
        { name: 'Compassionate Caregivers & Time Currency', path: '/caregivers-time-currency-browse', description: 'Professional caregiving services', icon: HandHeart },
        { name: 'Trusted Babysitters & Childcare', path: '/babysitters-childcare', description: 'Safe and reliable childcare', icon: Baby },
        { name: 'Pet Care & Animal Services', path: '/pet-care-animal-services', description: 'Care for your beloved pets', icon: PawPrint },
        { name: 'Donations / Raise Your Fund', path: '/donations-raise-fund-browse', description: 'Support causes and fundraising', icon: Heart },
      ]
    },
    {
      id: 'marketplace-shopping',
      name: 'Marketplace & Shopping',
      icon: ShoppingBag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      darkBgColor: 'dark:bg-orange-900/20',
      description: 'Shop for everything you need',
      services: [
        { name: 'Rent & Property Buying & Selling', path: '/rent-property-buying-selling', description: 'Find your dream property', icon: HomeIcon },
        { name: 'Exclusive Gift Packs', path: '/ads/marketplace/gift-packs', description: 'Unique gift packages', icon: Gift },
        { name: 'Souvenirs & Collectibles', path: '/ads/marketplace/souvenirs', description: 'Memorable souvenirs', icon: Store },
        { name: 'Jewelry & Gem Sellers', path: '/ads/marketplace/jewelry-gem-sellers', description: 'Precious gems and jewelry', icon: Gem },
        { name: 'Home/Office Accessories & Tech', path: '/ads/marketplace/home-office-accessories-tech', description: 'Tech gadgets and accessories', icon: Laptop },
        { name: 'Fashion/Beauty & Clothing', path: '/ads/marketplace/fashion-beauty-clothing', description: 'Latest fashion trends', icon: Shirt },
        { name: 'Daily Grocery Essentials', path: '/ads/marketplace/daily-grocery-essentials', description: 'Fresh groceries delivered', icon: Apple },
        { name: 'Organic Herbal Products & Spices', path: '/ads/marketplace/organic-herbal-products-spices', description: 'Natural and organic products', icon: Leaf },
        { name: 'Books, Magazines & Educational', path: '/books-magazines-educational', description: 'Educational materials', icon: Book },
        { name: 'Other Items', path: '/other-items', description: 'Various marketplace items', icon: ShoppingBag },
      ]
    },
    {
      id: 'entertainment-fitness',
      name: 'Entertainment & Fitness',
      icon: Music,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      darkBgColor: 'dark:bg-cyan-900/20',
      description: 'Stay entertained and healthy',
      services: [
        { name: 'Exclusive Combo Packages', path: '/exclusive-combo-packages', description: 'Wedding, tour, and event packages', icon: Package },
        { name: 'Talented Entertainers & Artists', path: '/ads/entertainment/entertainers-artists', description: 'Book entertainers for events', icon: Music },
        { name: 'Fitness & Health: Spas, Gym & Professionals', path: '/ads/professionals/fitness-health-spas-gym', description: 'Wellness and fitness services', icon: Dumbbell },
      ]
    },
    {
      id: 'special-opportunities',
      name: 'Special Opportunities',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      darkBgColor: 'dark:bg-yellow-900/20',
      description: 'Unique opportunities and offers',
      services: [
        { name: 'Exciting Job Opportunities', path: '/ads/professionals/job-opportunities', description: 'Find your next career move', icon: Briefcase },
        { name: 'Local SIM Cards & Mobile Data', path: '/ads/special-opportunities/local-sim-mobile-data', description: 'Stay connected in Sri Lanka', icon: Smartphone },
      ]
    },
    {
      id: 'essential-services',
      name: 'Essential Services',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      darkBgColor: 'dark:bg-gray-900/20',
      description: 'Critical services for your peace of mind',
      services: [
        { name: 'Emergency Services & Insurance', path: '/ads/essential-services/emergency-services-insurance', description: 'Emergency assistance and insurance', icon: AlertTriangle },
      ]
    }
  ];

  // Filter categories based on search term
  const filteredCategories = serviceCategories.filter(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) return false;

    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const categoryMatches = category.name.toLowerCase().includes(searchLower);
    const serviceMatches = category.services.some(service =>
      service.name.toLowerCase().includes(searchLower) ||
      service.description.toLowerCase().includes(searchLower)
    );

    return categoryMatches || serviceMatches;
  });

  // Get total services count
  const totalServices = serviceCategories.reduce((acc, cat) => acc + cat.services.length, 0);

  return (
    <>
      <SEO
        title="Services | Holidaysri - Complete Tourism & Travel Services in Sri Lanka"
        description="Explore our comprehensive range of tourism services in Sri Lanka. From tour guides and hotels to vehicle rentals, restaurants, and professional services - everything you need for your Sri Lankan adventure."
        keywords="Sri Lanka services, tourism services Sri Lanka, tour guides Sri Lanka, hotels Sri Lanka, vehicle rentals Sri Lanka, restaurants Sri Lanka, travel services, professional services Sri Lanka"
        canonical="https://www.holidaysri.com/services"
      />
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Services
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6 max-w-2xl mx-auto">
            Discover {totalServices}+ amazing services across {serviceCategories.length} categories to make your Sri Lankan experience unforgettable
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white/95 backdrop-blur-sm text-gray-900 rounded-xl focus:ring-2 focus:ring-white focus:outline-none shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            {serviceCategories.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Categories
          </div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {totalServices}+
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Services
          </div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            10K+
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Active Listings
          </div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            24/7
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Support
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All Categories
        </button>
        {serviceCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedCategory === category.id
                ? `${category.bgColor} ${category.color} shadow-lg`
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <category.icon className="w-4 h-4" />
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Service Categories */}
      {filteredCategories.length > 0 ? (
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <div key={category.id} className="card p-6 md:p-8">
              {/* Category Header */}
              <div className="flex items-start space-x-4 mb-6">
                <div className={`p-3 rounded-xl ${category.bgColor} ${category.darkBgColor}`}>
                  <category.icon className={`w-8 h-8 ${category.color}`} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                    {category.services.length} services available
                  </div>
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.services
                  .filter(service => {
                    if (!searchTerm.trim()) return true;
                    const searchLower = searchTerm.toLowerCase();
                    return service.name.toLowerCase().includes(searchLower) ||
                           service.description.toLowerCase().includes(searchLower);
                  })
                  .map((service, index) => {
                    const ServiceIcon = service.icon;
                    return (
                      <Link
                        key={index}
                        to={service.path}
                        className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-gray-50 hover:to-white dark:hover:from-gray-800 dark:hover:to-gray-700"
                      >
                        <div className="flex items-start space-x-3 mb-2">
                          <div className={`p-2 rounded-lg ${category.bgColor} ${category.darkBgColor} flex-shrink-0`}>
                            <ServiceIcon className={`w-4 h-4 ${category.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {service.name}
                              </h3>
                              <ChevronRight className={`w-5 h-5 ${category.color} opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2`} />
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 ml-11">
                          {service.description}
                        </p>
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No services found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or filter to find what you're looking for
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* CTA Section */}
      <div className="card p-8 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-2 border-primary-200 dark:border-primary-800">
        <div className="text-center max-w-2xl mx-auto">
          <TrendingUp className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Want to List Your Service?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Join thousands of service providers on Holidaysri and reach travelers from around the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/post-advertisement" className="btn-primary">
              Post Your Service
            </Link>
            <Link to="/contact" className="btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Services;
