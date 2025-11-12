import React from 'react';
import { 
  Target, 
  Eye, 
  Award, 
  Users, 
  Globe, 
  Heart, 
  TrendingUp, 
  Shield,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const About = () => {
  const { isDarkMode } = useTheme();

  const stats = [
    { icon: Users, label: 'Happy Travelers', value: '10,000+', color: 'text-blue-600' },
    { icon: MapPin, label: 'Destinations', value: '500+', color: 'text-green-600' },
    { icon: Award, label: 'Service Partners', value: '1,000+', color: 'text-purple-600' },
    { icon: Globe, label: 'Countries Reached', value: '50+', color: 'text-orange-600' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We prioritize our customers\' needs and satisfaction above all else, ensuring every journey is memorable.',
      color: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Your safety and security are paramount. We maintain the highest standards of trust and reliability.',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'We continuously innovate with cutting-edge technology to enhance your travel experience.',
      color: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: TrendingUp,
      title: 'Excellence',
      description: 'We strive for excellence in every service we provide, setting new standards in the industry.',
      color: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400'
    }
  ];

  const milestones = [
    { year: '2023', event: 'Holidaysri PVT LTD Founded', description: 'Started our journey on November 11, 2023' },
    { year: '2024', event: 'Platform Launch', description: 'Launched our comprehensive travel platform' },
    { year: '2024', event: 'HSC Token System', description: 'Introduced innovative HSC token ecosystem' },
    { year: '2025', event: 'Global Expansion', description: 'Expanding services to international markets' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 p-8 md:p-16 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src={isDarkMode 
                ? "https://res.cloudinary.com/dqdcmluxj/image/upload/v1752712704/4_xi6zj7.png"
                : "https://res.cloudinary.com/dqdcmluxj/image/upload/v1752712704/4_xi6zj7.png"
              }
              alt="Holidaysri Logo"
              className="h-24 md:h-32 w-auto drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Holidaysri
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-4 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in discovering the beauty and wonder of Sri Lanka since 2023
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm md:text-base opacity-80">
            <Calendar className="w-5 h-5" />
            <span>Established: November 11, 2023</span>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Who We Are
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-purple-600 mx-auto mb-6"></div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            <span className="font-bold text-primary-600 dark:text-primary-400">Holidaysri PVT LTD</span> is a pioneering travel technology company dedicated to revolutionizing the way people experience Sri Lanka. Founded on November 11, 2023, we've quickly become a trusted platform connecting travelers with authentic Sri Lankan experiences.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Our innovative platform combines cutting-edge technology with local expertise to offer a comprehensive ecosystem of travel services. From tour packages and accommodations to local guides and unique experiences, we provide everything you need for an unforgettable journey through the Pearl of the Indian Ocean.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            With our unique <span className="font-semibold text-purple-600 dark:text-purple-400">HSC Token System</span>, we've created a sustainable marketplace that benefits both travelers and service providers, fostering a vibrant community of tourism enthusiasts.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision Section */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 md:p-10 text-white shadow-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Eye className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg opacity-90 leading-relaxed">
            To become the world's leading platform for Sri Lankan tourism, empowering travelers to discover authentic experiences while supporting local communities and preserving the island's natural and cultural heritage for future generations.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 md:p-10 text-white shadow-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Target className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg opacity-90 leading-relaxed">
            To connect travelers with exceptional Sri Lankan experiences through innovative technology, trusted partnerships, and a commitment to sustainable tourism that benefits both visitors and local communities.
          </p>
        </div>
      </section>

      {/* Goals Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Goals
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We're committed to achieving excellence through strategic objectives
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: 'Expand Service Network',
              description: 'Grow our network to include 5,000+ verified service providers across all provinces of Sri Lanka by 2026.'
            },
            {
              title: 'Enhance User Experience',
              description: 'Continuously improve our platform with AI-powered recommendations and seamless booking experiences.'
            },
            {
              title: 'Promote Sustainable Tourism',
              description: 'Partner with eco-friendly businesses and promote responsible travel practices throughout Sri Lanka.'
            },
            {
              title: 'Community Empowerment',
              description: 'Support local communities by creating economic opportunities through our platform and HSC ecosystem.'
            },
            {
              title: 'Global Recognition',
              description: 'Establish Holidaysri as the go-to platform for Sri Lankan tourism in international markets.'
            },
            {
              title: 'Innovation Leadership',
              description: 'Lead the industry in adopting new technologies like blockchain, AI, and virtual reality for travel.'
            }
          ].map((goal, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {goal.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {goal.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Core Values
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`inline-flex items-center justify-center w-14 h-14 ${value.color} rounded-xl mb-4`}>
                <value.icon className={`w-7 h-7 ${value.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline/Milestones */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Journey
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Key milestones in our growth story
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative pl-8 md:pl-12">
                {/* Timeline line */}
                {index !== milestones.length - 1 && (
                  <div className="absolute left-3 md:left-5 top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary-600 to-purple-600"></div>
                )}
                
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-2 top-1 w-6 h-6 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"></div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {milestone.year}
                    </span>
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                      {milestone.event}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <Sparkles className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Journey
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
            Be part of Sri Lanka's fastest-growing travel community. Whether you're a traveler seeking adventure or a service provider looking to grow your business, Holidaysri is your perfect partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Get Started Today
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-colors duration-200 border-2 border-white/30"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

