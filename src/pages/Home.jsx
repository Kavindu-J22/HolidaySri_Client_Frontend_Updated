import React, { useState, useEffect } from 'react';
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
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Globe,
  Heart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Banner slideshow data
  const bannerSlides = [
    {
      id: 1,
      title: "Discover Ancient Wonders",
      description: "Explore the magnificent ruins of Sigiriya Rock Fortress and immerse yourself in Sri Lanka's rich history.",
      image: "https://www.tourslanka.com/wp-content/uploads/2019/05/Yapahuwa-banner.jpg",
      link: "/services?category=attractions",
      buttonText: "Explore Attractions"
    },
    {
      id: 2,
      title: "Luxury Beach Resorts",
      description: "Experience world-class hospitality at Sri Lanka's finest beachfront hotels and resorts.",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      link: "/services?category=hotels",
      buttonText: "Book Hotels"
    },
    {
      id: 3,
      title: "Authentic Culinary Journey",
      description: "Savor the exotic flavors of traditional Sri Lankan cuisine at our recommended restaurants.",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      link: "/services?category=restaurants",
      buttonText: "Find Restaurants"
    },
    {
      id: 4,
      title: "Wildlife Safari Adventures",
      description: "Witness majestic elephants and leopards in their natural habitat at Yala National Park.",
      image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      link: "/services?category=tours",
      buttonText: "Book Safari"
    },
    {
      id: 5,
      title: "Tea Plantation Tours",
      description: "Journey through the emerald hills of Nuwara Eliya and discover Ceylon tea heritage.",
      image: "https://dxk1acp76n912.cloudfront.net/images/articles/tea-article2.png",
      link: "/services?category=tours",
      buttonText: "Explore Tours"
    },
    {
      id: 6,
      title: "Cultural Heritage Sites",
      description: "Visit the sacred Temple of the Tooth and other UNESCO World Heritage sites.",
      image: "https://2troubletravelers.com/wp-content/uploads/2024/03/Sigiriya_rock.jpg",
      link: "/services?category=attractions",
      buttonText: "Visit Sites"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

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
      title: 'Anything You Want "Sri Lanka"',
      description: 'Tailored experiences curated by local experts',
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
    { label: 'Others', value: '50,000+', icon: Compass }
  ];

  return (
    <div className="space-y-16">
      {/* Banner Slideshow Section */}
      <section className="relative">
        <div className="relative h-96 sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
          {/* Slideshow Container */}
          <div className="relative w-full h-full">
            {bannerSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 transform translate-x-0'
                    : index < currentSlide
                      ? 'opacity-0 transform -translate-x-full'
                      : 'opacity-0 transform translate-x-full'
                }`}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
                </div>

                {/* Content */}
                <div className="relative h-full flex items-center justify-start px-8 sm:px-16">
                  <div className="max-w-2xl text-white">
                    <h2 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-lg sm:text-xl mb-8 opacity-90 leading-relaxed">
                      {slide.description}
                    </p>
                    <Link
                      to={slide.link}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {slide.buttonText}
                      <ExternalLink className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

           {/* Smart Welcome Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
        <div className="relative px-8 py-12 text-center">
          <div className="max-w-4xl mx-auto">
            
            <h1 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to Holidaysri.com
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your intelligent gateway to authentic Sri Lankan experiences. Discover, connect, and create unforgettable memories with our smart platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Globe className="w-4 h-4" />
                <span>Trusted by 10,000+ travelers</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Heart className="w-4 h-4" />
                <span>2,500+ verified listings</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Star className="w-4 h-4" />
                <span>4.9/5 average rating</span>
              </div>
            </div>
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
