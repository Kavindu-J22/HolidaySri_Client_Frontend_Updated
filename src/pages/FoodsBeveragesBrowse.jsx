import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Loader,
  AlertCircle,
  Filter,
  X,
  ArrowLeft,
  UtensilsCrossed,
  Eye,
  MessageCircle
} from 'lucide-react';

const FoodsBeveragesBrowse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [foodsBeverages, setFoodsBeverages] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState('');
  const [provincesData, setProvincesData] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'restaurants'

  // Get destination info from URL params
  const fromDestination = searchParams.get('fromDestination') || '';
  const destinationName = searchParams.get('destinationName') || '';
  const cityFromUrl = searchParams.get('city') || '';

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    province: searchParams.get('province') || '',
    city: cityFromUrl,
    productType: searchParams.get('productType') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  // Search input state
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [menuSearchInput, setMenuSearchInput] = useState('');

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1
  });

  const [menuPagination, setMenuPagination] = useState({
    total: 0,
    pages: 0,
    page: 1
  });

  // Category options
const categoryOptions = [
  // RESTAURANT TYPES
  'Fine Dining',
  'Casual Dining',
  'Fast Casual',
  'Fast Food',
  'Family Restaurant',
  'Buffet Restaurant',
  'All-You-Can-Eat',
  'Themed Restaurant',
  
  // CUISINE TYPES
  'American',
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'Mediterranean',
  'French',
  'Korean',
  'Vietnamese',
  'Middle Eastern',
  'Greek',
  'Spanish',
  'Brazilian',
  'Caribbean',
  'African',
  'Fusion Cuisine',
  
  // SPECIALTY FOOD ESTABLISHMENTS
  'Steakhouse',
  'Seafood Restaurant',
  'Barbecue & Grill',
  'Pizzeria',
  'Burger Joint',
  'Sushi Bar',
  'Ramen Shop',
  'Taco Shop',
  'Sandwich Shop',
  'Deli',
  
  // HEALTH & DIETARY FOCUS
  'Vegetarian Restaurant',
  'Vegan Restaurant',
  'Organic Food',
  'Health Food',
  'Gluten-Free',
  'Farm-to-Table',
  
  // BEVERAGE ESTABLISHMENTS
  'Coffee Shop',
  'Cafe',
  'Tea House',
  'Juice Bar',
  'Smoothie Shop',
  'Bubble Tea Shop',
  'Wine Bar',
  'Cocktail Bar',
  'Pub',
  'Brewery',
  'Microbrewery',
  
  // SWEETS & DESSERTS
  'Bakery',
  'Patisserie',
  'Dessert Shop',
  'Ice Cream Parlor',
  'Gelato Shop',
  'Donut Shop',
  'Chocolatier',
  'Candy Store',
  
  // QUICK SERVICE & STREET FOOD
  'Food Truck',
  'Food Stall',
  'Street Food',
  'Snack Bar',
  'Food Court',
  'Pop-Up Restaurant',
  
  // MEAL-SPECIFIC
  'Breakfast Spot',
  'Brunch Restaurant',
  'Lunch Counter',
  
  // SERVICES & OTHER
  'Catering Service',
  'Meal Delivery',
  'Takeaway Only',
  'Grocery Store with Dining',
  'Food Hall',
  'Other'
];

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/foods-beverages/provinces');
        const data = await response.json();
        if (data.success) {
          setProvincesData(data.data);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch foods & beverages
  useEffect(() => {
    if (activeTab !== 'products') return;

    const fetchFoodsBeverages = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.province) params.append('province', filters.province);
        if (filters.city) params.append('city', filters.city);
        if (filters.productType) params.append('productType', filters.productType);
        params.append('page', filters.page);
        params.append('limit', 12);

        // Preserve destination parameters
        if (fromDestination) params.append('fromDestination', fromDestination);
        if (destinationName) params.append('destinationName', destinationName);

        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/foods-beverages/browse?${params}`);
        const data = await response.json();

        if (data.success) {
          setFoodsBeverages(data.data);
          setPagination(data.pagination);
          setSearchParams(params);
        } else {
          setError('Failed to load foods & beverages');
        }
      } catch (error) {
        console.error('Error fetching foods & beverages:', error);
        setError('Failed to load foods & beverages');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodsBeverages();
  }, [filters, setSearchParams, activeTab]);

  // Fetch menu items from restaurants
  useEffect(() => {
    if (activeTab !== 'restaurants') return;

    const fetchMenuItems = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (menuSearchInput) params.append('search', menuSearchInput);
        params.append('page', menuPagination.page);
        params.append('limit', 12);

        const response = await fetch(`https://holidaysri-backend-9xm4.onrender.com/api/cafes-restaurants/menu-items/browse?${params}`);
        const data = await response.json();

        if (data.success) {
          setMenuItems(data.data);
          setMenuPagination(data.pagination);
        } else {
          setError('Failed to load menu items');
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [activeTab, menuSearchInput, menuPagination.page]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchInput,
      page: 1
    }));
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchInput('');
    setFilters(prev => ({
      ...prev,
      search: '',
      page: 1
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setSearchInput('');
    setFilters({
      search: '',
      category: '',
      province: '',
      city: '',
      productType: '',
      page: 1
    });
  };

  // Handle menu search
  const handleMenuSearch = (e) => {
    e.preventDefault();
    setMenuPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle WhatsApp contact
  const handleWhatsAppContact = (contact, restaurantName, itemName) => {
    const message = `Hi! I'm interested in ordering ${itemName} from ${restaurantName}.`;
    const whatsappUrl = `https://wa.me/${contact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Product Type options
  const productTypeOptions = [
    'Vegetarian',
    'Vegan Options',
    'Gluten-Free Options',
    'Halal',
    'Kosher',
    'Organic',
    'Sugar-Free',
    'Dairy-Free',
    'Nut-Free',
    'Keto-Friendly',
    'Paleo-Friendly',
    'Low-Carb',
    'High-Protein',
    'Raw Food',
    'Locally Sourced',
    'Fair Trade',
    'Non-GMO',
    'Preservative-Free',
    'Artisan',
    'Homemade'
  ];

  // Get available cities
  const availableCities = filters.province ? provincesData[filters.province] || [] : [];

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Foods & Beverages{cityFromUrl && ` - ${cityFromUrl}`}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {fromDestination ? `Discover delicious food and beverage products in ${destinationName}` : 'Discover delicious food and beverage products from local businesses'}
          </p>
          {fromDestination && (
            <button
              onClick={() => navigate(`/destinations/${fromDestination}`)}
              className="mt-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to {destinationName}</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Food Products
              </button>
              <button
                onClick={() => setActiveTab('restaurants')}
                className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm sm:text-base transition-all duration-200 flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'restaurants'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span className="hidden xs:inline">Restaurant Publishers</span>
                <span className="xs:hidden">Restaurant Menus</span>
              </button>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Filters Sidebar - Only show for products tab */}
          {activeTab === 'products' && (
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 sticky top-4 sm:top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-600 dark:text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Province Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Province
                </label>
                <select
                  name="province"
                  value={filters.province}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="">All Provinces</option>
                  {Object.keys(provincesData).map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  disabled={!filters.province}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm disabled:opacity-50"
                >
                  <option value="">All Cities</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Product Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Type
                </label>
                <select
                  name="productType"
                  value={filters.productType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="">All Types</option>
                  {productTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {(filters.search || filters.category || filters.province || filters.city || filters.productType) && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
          )}

          {/* Main Content */}
          <div className={activeTab === 'products' ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {/* Search Bar */}
            <div className="mb-6">
              {activeTab === 'products' ? (
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={handleSearchInputChange}
                      placeholder="Search by name, description, or business name..."
                      className="w-full pl-12 pr-24 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Search
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleMenuSearch} className="relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={menuSearchInput}
                      onChange={(e) => setMenuSearchInput(e.target.value)}
                      placeholder="Search by restaurant name, item name, or category..."
                      className="w-full pl-12 pr-24 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {menuSearchInput && (
                      <button
                        type="button"
                        onClick={() => setMenuSearchInput('')}
                        className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Search
                    </button>
                  </div>
                </form>
              )}
              {activeTab === 'products' && filters.search && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Searching for: <strong className="text-gray-900 dark:text-white">{filters.search}</strong></span>
                  <button
                    onClick={clearSearch}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Filter Toggle - Only for products tab */}
            {activeTab === 'products' && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-800 dark:text-red-200">{error}</span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : activeTab === 'products' ? (
              foodsBeverages.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Products Found</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try adjusting your filters or search terms to find what you're looking for.
                    </p>
                  </div>
                </div>
              ) : (
              <>
                {/* Results Count */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Showing {foodsBeverages.length} of {pagination.total} results
                </p>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                  {foodsBeverages.map(item => (
                    <div
                      key={item._id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative bg-gray-200 dark:bg-gray-700 h-48 sm:h-52 overflow-hidden">
                        <img
                          src={item.images[0]?.url}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                          LKR {item.price.toLocaleString()}
                        </div>
                        {item.available && (
                          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Available
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 flex flex-col flex-grow">
                        <div className="flex-grow">
                          <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
                            {item.name}
                          </h3>

                          {/* Business Name */}
                          {item.businessName && (
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <span className="text-gray-500 dark:text-gray-400">By:</span> {item.businessName}
                            </p>
                          )}

                          <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium mb-3">
                            {item.category}
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{item.location.city}, {item.location.province}</span>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-4">
                            {renderStars(Math.round(item.averageRating))}
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {item.averageRating.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ({item.totalReviews} {item.totalReviews === 1 ? 'review' : 'reviews'})
                            </span>
                          </div>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => navigate(`/foods-beverages/${item._id}`)}
                          className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={filters.page === 1}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setFilters(prev => ({ ...prev, page }))}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          filters.page === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={filters.page === pagination.pages}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
              )
            ) : (
              // Restaurant Publishers Tab
              menuItems.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center">
                      <UtensilsCrossed className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Menu Items Found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      We couldn't find any menu items matching your search.
                    </p>
                    {menuSearchInput && (
                      <button
                        onClick={() => setMenuSearchInput('')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      Showing <span className="font-semibold text-gray-900 dark:text-white">{menuItems.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{menuPagination.total}</span> menu items
                    </p>
                    {menuSearchInput && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Search:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{menuSearchInput}</span>
                        <button
                          onClick={() => setMenuSearchInput('')}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Menu Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8">
                    {menuItems.map((item, idx) => (
                      <div
                        key={`${item.restaurantId}-${idx}`}
                        className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700"
                      >
                        {/* Image */}
                        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 h-40 sm:h-44 overflow-hidden">
                          <img
                            src={item.image.url}
                            alt={item.itemName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          {/* Price Badge */}
                          <div className="absolute top-2 right-2 bg-gradient-to-br from-emerald-500 to-green-600 text-white px-2.5 py-1 rounded-lg shadow-lg">
                            <p className="text-xs font-bold">LKR {item.price.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3.5 flex flex-col flex-grow">
                          {/* Item Name */}
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-2">
                            {item.itemName}
                          </h3>

                          {/* Category */}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2.5 line-clamp-1 italic">
                            {item.category}
                          </p>

                          {/* Restaurant Name */}
                          <div className="flex items-center gap-1.5 mb-3 pb-2.5 border-b border-gray-100 dark:border-gray-700">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-1">
                              {item.restaurantName}
                            </p>
                          </div>

                          {/* Buttons */}
                          <div className="mt-auto space-y-1.5">
                            <button
                              onClick={() => navigate(`/cafes-restaurants/${item.restaurantId}`)}
                              className="w-full px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View More</span>
                            </button>
                            <button
                              onClick={() => handleWhatsAppContact(item.restaurantContact, item.restaurantName, item.itemName)}
                              className="w-full px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Order Now</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {menuPagination.pages > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={() => setMenuPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={menuPagination.page === 1}
                        className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium"
                      >
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </button>

                      <div className="flex gap-1 sm:gap-2">
                        {Array.from({ length: menuPagination.pages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setMenuPagination(prev => ({ ...prev, page }))}
                            className={`px-2.5 sm:px-3 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base font-medium ${
                              menuPagination.page === page
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setMenuPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={menuPagination.page === menuPagination.pages}
                        className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodsBeveragesBrowse;

