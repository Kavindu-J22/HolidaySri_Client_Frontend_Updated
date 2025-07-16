import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Users, 
  Award, 
  ArrowRight,
  Hotel,
  Car,
  Compass,
  UtensilsCrossed,
  Camera,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Hotel,
      title: 'Premium Hotels',
      description: 'Discover luxury accommodations across Sri Lanka',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Compass,
      title: 'Expert Guides',
      description: 'Connect with certified local tour guides',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Car,
      title: 'Transportation',
      description: 'Reliable vehicle rentals and transport services',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: UtensilsCrossed,
      title: 'Local Cuisine',
      description: 'Experience authentic Sri Lankan dining',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Camera,
      title: 'Attractions',
      description: 'Explore historical sites and natural wonders',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: TrendingUp,
      title: 'HSC System',
      description: 'Advertise your services with our token system',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const stats = [
    { label: 'Active Listings', value: '2,500+', icon: MapPin },
    { label: 'Happy Customers', value: '10,000+', icon: Users },
    { label: 'Partner Hotels', value: '500+', icon: Hotel },
    { label: 'Tour Guides', value: '200+', icon: Compass }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative px-8 py-16 sm:py-24 text-center text-white">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Discover Beautiful
            <span className="block text-yellow-300">Sri Lanka</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Your gateway to authentic Sri Lankan experiences. Find the best hotels, guides, 
            restaurants, and attractions all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Explore Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                Join Us Today
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
              <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Holidaysri?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We connect travelers with authentic Sri Lankan experiences through our comprehensive platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card p-6 hover:shadow-lg transition-shadow duration-200">
              <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} dark:bg-gray-800 rounded-lg mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HSC System Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-xl mb-6">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            HSC Token System
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Advertise your tourism services using our innovative HSC token system. 
            Purchase tokens to promote your hotels, restaurants, tours, and more to thousands of travelers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/hsc"
              className="btn-primary"
            >
              Learn About HSC
            </Link>
            {!user && (
              <Link
                to="/register"
                className="btn-outline"
              >
                Start Advertising
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <div className="card p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Explore Sri Lanka?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Join thousands of travelers who have discovered amazing experiences through Holidaysri
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="btn-primary"
            >
              Browse Services
            </Link>
            <Link
              to="/contact"
              className="btn-secondary"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
