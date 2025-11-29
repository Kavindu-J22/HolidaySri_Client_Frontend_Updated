import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, MapPin, Filter } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { API_BASE_URL } from '../config/api';

const provincesAndDistricts = {
  'Western Province': ['Colombo', 'Gampaha', 'Kalutara'],
  'Central Province': ['Kandy', 'Matale', 'Nuwara Eliya'],
  'Southern Province': ['Galle', 'Matara', 'Hambantota'],
  'Northern Province': ['Jaffna', 'Mullaitivu', 'Vavuniya'],
  'Eastern Province': ['Trincomalee', 'Batticaloa', 'Ampara'],
  'North Western Province': ['Kurunegala', 'Puttalam'],
  'North Central Province': ['Polonnaruwa', 'Anuradhapura'],
  'Uva Province': ['Badulla', 'Monaragala'],
  'Sabaragamuwa Province': ['Ratnapura', 'Kegalle']
};

const specializations = ['Organic & Handpicked', 'Certified Organic', 'Fair Trade', 'Premium Selection', 'Bulk Wholesale'];
const categories = ['Spices', 'Herbs', 'Tea & Infusions', 'Dried Fruits', 'Seeds & Nuts', 'Powders & Blends'];

export default function OrganicHerbalProductsSpicesBrowse() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    category: '',
    province: '',
    city: ''
  });
  const [cities, setCities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.specialization) params.append('specialization', filters.specialization);
      if (filters.category) params.append('category', filters.category);
      if (filters.province) params.append('province', filters.province);
      if (filters.city) params.append('city', filters.city);

      const response = await fetch(`${API_BASE_URL}/organic-herbal-products-spices/browse?${params}`);
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setFilters({ ...filters, province, city: '' });
    setCities(provincesAndDistricts[province] || []);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen py-4 sm:py-6 lg:py-8 px-3 sm:px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Organic Herbal Products & Spices
          </h1>
          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Browse premium organic products from trusted sellers
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className={`flex-1 flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <Search size={18} className={`sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 outline-none text-sm sm:text-base ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
          >
            <Filter size={18} className="sm:w-5 sm:h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className={`mb-6 sm:mb-8 p-4 sm:p-5 lg:p-6 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <select
              value={filters.specialization}
              onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="">All Specializations</option>
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={filters.province}
              onChange={handleProvinceChange}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="">All Provinces</option>
              {Object.keys(provincesAndDistricts).map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              disabled={!filters.province}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} disabled:opacity-50`}
            >
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-16">
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filteredProducts.map(product => (
              <div
                key={product._id}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                {/* Image */}
                <div className="relative h-44 sm:h-48 lg:h-52 overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute top-2 sm:top-3 right-2 sm:right-3 rounded-full px-2 sm:px-3 py-1 flex items-center gap-1 shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                    <Star size={14} className="sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-xs sm:text-sm">{product.averageRating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-grow">
                  <h3 className={`text-base sm:text-lg font-bold mb-2 line-clamp-2 min-h-[3rem] ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {product.name}
                  </h3>

                  <p className={`text-xs sm:text-sm mb-2 line-clamp-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {product.specialization}
                  </p>

                  <p className={`text-xs sm:text-sm mb-3 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <MapPin size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{product.location.city}, {product.location.province}</span>
                  </p>

                  <p className="text-xl sm:text-2xl font-bold text-green-600 mb-4 flex-grow">
                    LKR {product.price.toLocaleString()}
                  </p>

                  <button
                    onClick={() => navigate(`/organic-herbal-products-spices/${product._id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex-shrink-0"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 sm:py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg`}>
            <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No products found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

