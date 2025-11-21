import { useNavigate } from 'react-router-dom';
import { 
  Filter, 
  Hotel, 
  UtensilsCrossed, 
  Users, 
  Compass, 
  Car, 
  UserCheck, 
  Camera, 
  TreePine, 
  Package, 
  Shield, 
  Calendar, 
  Building, 
  Gift, 
  AlertTriangle,
  Star,
  Handshake
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const provinces = [
  'Western Province',
  'Central Province',
  'Southern Province',
  'Northern Province',
  'Eastern Province',
  'North Western Province',
  'North Central Province',
  'Uva Province',
  'Sabaragamuwa Province'
];

const services = [
  { name: 'Find Accommodations', path: '/hotels-accommodations', icon: Hotel },
  { name: 'Find Cafes & Restaurants', path: '/cafes-restaurants', icon: UtensilsCrossed },
  { name: 'Find Travel Buddies', path: '/travel-buddies', icon: Users },
  { name: 'Find Expert Tour Guiders', path: '/ads/tourism/tour-guiders', icon: Compass },
  { name: 'Find Vehicle Rentals & Hire Services', path: '/vehicle-rentals-hire', icon: Car },
  { name: 'Find Professional Drivers', path: '/professional-drivers', icon: UserCheck },
  { name: 'Find Creative Photographers', path: '/ads/events/photographers', icon: Camera },
  { name: 'Rent Land for Camping/Parking', path: '/rent-land-camping-parking', icon: TreePine },
  { name: 'Find Local Tour Packages', path: '/local-tour-packages', icon: Package },
  { name: 'Find TravelSafe & Help Professionals', path: '/ads/tourism/travel-safe', icon: Shield },
  { name: 'Find Events Updates', path: '/ads/events-management/events-updates', icon: Calendar },
  { name: 'Rent & Property Platform', path: '/rent-property-buying-selling', icon: Building },
  { name: 'Find Exclusive Combo Packages', path: '/exclusive-combo-packages', icon: Gift },
  { name: 'Find Emergency Services & Insurance', path: '/ads/essential-services/emergency-services-insurance', icon: AlertTriangle }
];

const LeftSidebar = ({ provinceFilter, setProvinceFilter }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      {/* Province Filter */}
      <div className={`rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm p-4`}>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-500" />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Filter by Province
          </h3>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => setProvinceFilter('')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
              provinceFilter === ''
                ? 'bg-blue-600 text-white'
                : isDarkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            All Provinces
          </button>
          {provinces.map((province) => (
            <button
              key={province}
              onClick={() => setProvinceFilter(province)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                provinceFilter === province
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {province}
            </button>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className={`rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm p-4`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Explore Services
        </h3>
        <div className="space-y-1">
          {services.map((service) => (
            <button
              key={service.path}
              onClick={() => navigate(service.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                  : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
              }`}
            >
              <service.icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-left">{service.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Membership Section */}
      <div className={`rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-blue-900 to-purple-900 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'} border shadow-sm p-4`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Join Holidaysri
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/ads/essential/pricing-memberships')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } shadow-md hover:shadow-lg`}
          >
            <Star className="w-5 h-5 flex-shrink-0" />
            <span>Become a Member</span>
          </button>
          <button
            onClick={() => navigate('/ads/opportunities/partnerships')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
              isDarkMode
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            } shadow-md hover:shadow-lg`}
          >
            <Handshake className="w-5 h-5 flex-shrink-0" />
            <span>Commercial Partners</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;

