import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Globe,
  Heart,
  Shield,
  Award,
  Users
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isDarkMode } = useTheme();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Download App', path: '/download' }
  ];

  const categories = [
    { name: 'Tourism & Travel', path: '/categories/tourism' },
    { name: 'Accommodation & Dining', path: '/categories/accommodation' },
    { name: 'Vehicles & Transport', path: '/categories/transport' },
    { name: 'Events & Management', path: '/categories/events' },
    { name: 'Marketplace & Shopping', path: '/categories/marketplace' }
  ];

  const support = [
    { name: 'Help Center', path: '/help' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'Safety Guidelines', path: '/safety' }
  ];

  const business = [
    { name: 'Post Advertisement', path: '/post-ad' },
    { name: 'Business Solutions', path: '/business' },
    { name: 'HSC Token System', path: '/hsc' },
    { name: 'Partner with Us', path: '/partners' },
    { name: 'Advertise with Us', path: '/advertise' }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4 group">
              <div className="logo-container logo-lg">
                <img
                  src={isDarkMode
                    ? "https://res.cloudinary.com/dqdcmluxj/image/upload/v1752712704/4_xi6zj7.png"
                    : "https://res.cloudinary.com/dqdcmluxj/image/upload/v1752712705/Hsllogo_3_gye6nd.png"
                  }
                  alt="Holidaysri Logo"
                  className="logo-image group-hover:scale-105"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Holidaysri
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
              Your trusted partner for authentic Sri Lankan travel experiences. Connecting travelers with local businesses, guides, and unique opportunities across the beautiful island of Sri Lanka.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 text-primary-600" />
                <span>+94 11 234 5678</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 text-primary-600" />
                <span>info@holidaysri.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-primary-600" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Popular Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link
                    to={category.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business & Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Business & Support
            </h3>
            <ul className="space-y-3">
              {business.slice(0, 3).map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {support.slice(0, 2).map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Secure Platform</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Safe & trusted transactions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Quality Service</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Verified businesses only</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Community</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Connect with locals</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Globe className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Island Wide</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">All across Sri Lanka</p>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-pink-600 hover:bg-pink-700 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <span>© {currentYear} Holidaysri. Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>in Sri Lanka. All rights reserved.</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              {support.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
