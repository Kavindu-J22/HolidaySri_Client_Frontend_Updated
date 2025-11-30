import React from 'react';
import SEO from '../components/SEO/SEO';
import { getOrganizationSchema } from '../utils/seoUtils';
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
    { year: '2023', event: 'Holidaysri.com PVT LTD Founded', description: 'Started our journey on November 11, 2023' },
    { year: '2024', event: 'Platform Launch', description: 'Launched our comprehensive travel platform' },
    { year: '2024', event: 'HSC Token System', description: 'Introduced innovative HSC token ecosystem' },
    { year: '2025', event: 'Global Expansion', description: 'Expanding services to international markets' },
  ];

  return (
    <>
      <SEO
        title="About Holidaysri | Sri Lanka's #1 Trusted Tourism & Travel Platform Since 2024"
        description="Holidaysri is Sri Lanka's leading tourism platform connecting 10,000+ travelers with authentic experiences, 500+ verified tour operators, 1,000+ quality hotels, and 200+ expert guides. Licensed, certified, and trusted. Award-winning service. 24/7 support. Best price guarantee."
        keywords="about Holidaysri, Holidaysri company, who is Holidaysri, Holidaysri Sri Lanka, Sri Lanka tourism company, Sri Lanka travel platform, leading tourism platform, best travel website Sri Lanka, trusted tour operators Sri Lanka, licensed tour guides Sri Lanka, verified accommodations Sri Lanka, certified hotels Sri Lanka, authentic Sri Lanka experiences, genuine local experiences, tourism technology Sri Lanka, travel innovation, online booking platform, digital tourism, e-tourism Sri Lanka, travel tech, tourism startup, travel company Sri Lanka, destination management company, DMC Sri Lanka, ground handler, inbound tour operator, receptive tour operator, Sri Lanka travel agency, online travel agency, OTA Sri Lanka, travel marketplace, tourism marketplace, tour booking platform, hotel booking site, accommodation booking, activity booking, experience booking, tour package booking, holiday booking, vacation booking, trip planning platform, itinerary builder, travel planner, trip organizer, vacation designer, holiday creator, tour customizer, bespoke travel, tailor made tours, personalized travel, customized holidays, flexible itineraries, dynamic packaging, real time booking, instant confirmation, secure payment, safe booking, trusted platform, verified suppliers, quality assurance, customer reviews, ratings and reviews, testimonials, traveler feedback, satisfaction guarantee, best price guarantee, price match promise, lowest rates, competitive pricing, transparent pricing, no hidden fees, all inclusive pricing, comprehensive packages, complete solutions, end to end service, one stop shop, everything included, full service, concierge service, VIP service, premium service, luxury travel, budget travel, mid range travel, backpacker friendly, family friendly, couple friendly, solo traveler, group travel, corporate travel, MICE tourism, business travel, leisure travel, adventure travel, cultural travel, eco tourism, sustainable tourism, responsible tourism, ethical travel, community tourism, volunteer tourism, educational travel, student travel, senior travel, accessible tourism, inclusive travel, diverse offerings, wide selection, extensive network, comprehensive coverage, island wide, nationwide, all destinations, every corner, complete Sri Lanka, whole island, north to south, east to west, coast to hills, beaches to mountains, cities to villages, urban to rural, modern to traditional, ancient to contemporary, heritage to innovation, culture to nature, wildlife to wellness, adventure to relaxation, action to peace, excitement to tranquility, exploration to retreat, discovery to sanctuary, journey to destination, travel to experience, tour to memory, vacation to story, holiday to adventure, trip to transformation, visit to connection, stay to immersion, explore to understand, discover to appreciate, experience to love, enjoy to cherish, live to remember, Holidaysri mission, Holidaysri vision, Holidaysri values, company culture, team Holidaysri, our story, our journey, our passion, our commitment, our promise, our guarantee, our service, our quality, our standards, our excellence, our expertise, our experience, our knowledge, our understanding, our dedication, our devotion, our focus, our specialty, our strength, our advantage, our difference, our uniqueness, our distinction, our edge, our benefit, our value, our worth, our contribution, our impact, our influence, our role, our position, our standing, our reputation, our brand, our name, our identity, our recognition, our awards, our achievements, our milestones, our success, our growth, our development, our evolution, our progress, our advancement, our innovation, our technology, our platform, our system, our solution, our approach, our method, our strategy, our philosophy, our ethos, our principles, our beliefs, our standards, our ethics, our integrity, our honesty, our transparency, our accountability, our responsibility, our reliability, our dependability, our trustworthiness, our credibility, our authenticity, our genuineness, our sincerity, our professionalism, our competence, our capability, our capacity, our potential, our resources, our assets, our strengths, our advantages, our benefits, our offerings, our services, our products, our packages, our deals, our offers, our promotions, our discounts, our savings, our value, our quality, our excellence, our superiority, our leadership, our pioneering, our innovation, our creativity, our originality, our uniqueness, our distinction, our differentiation, our competitive edge, our market position, our industry standing, our sector leadership, our category dominance, our niche expertise, our specialized knowledge, our deep understanding, our comprehensive insight, our extensive experience, our proven track record, our successful history, our satisfied customers, our happy travelers, our delighted guests, our loyal clients, our repeat customers, our referrals, our recommendations, our testimonials, our reviews, our ratings, our feedback, our appreciation, our recognition, our awards, our accolades, our honors, our achievements, our accomplishments, our successes, our victories, our triumphs, our wins, our goals achieved, our targets met, our objectives accomplished, our mission fulfilled, our vision realized, our dreams achieved, our aspirations met, our ambitions fulfilled, our purpose served, our calling answered, our passion pursued, our love shared, our commitment kept, our promise delivered, our guarantee honored, our service provided, our quality maintained, our standards upheld, our excellence sustained, our expertise applied, our experience utilized, our knowledge shared, our understanding demonstrated, our care shown, our concern expressed, our support given, our assistance provided, our help offered, our guidance shared, our advice given, our recommendations made, our suggestions offered, our solutions provided, our answers delivered, our results achieved, our outcomes produced, our impacts made, our differences created, our changes implemented, our improvements made, our enhancements added, our upgrades delivered, our innovations introduced, our advancements made, our progress achieved, our development realized, our growth attained, our expansion accomplished, our reach extended, our coverage increased, our presence expanded, our visibility enhanced, our awareness raised, our recognition gained, our reputation built, our brand established, our name known, our identity recognized, our position secured, our standing elevated, our status enhanced, our prestige increased, our influence grown, our impact magnified, our contribution valued, our role appreciated, our importance recognized, our significance acknowledged, our value understood, our worth appreciated, our merit recognized, our quality acknowledged, our excellence celebrated, our superiority confirmed, our leadership recognized, our pioneering acknowledged, our innovation celebrated, our creativity appreciated, our originality valued, our uniqueness recognized, our distinction acknowledged, our differentiation appreciated, our advantage understood, our benefit realized, our value delivered, our promise kept, why choose Holidaysri, why Holidaysri, why us, what makes us different, what sets us apart, our competitive advantages, our unique selling points, our key differentiators, our core strengths, our main benefits, our primary advantages, our top features, our best qualities, our finest attributes, our greatest assets, our strongest points, our most valuable offerings, our exceptional services, our outstanding quality, our superior standards, our excellent performance, our remarkable results, our impressive outcomes, our notable achievements, our significant accomplishments, our substantial successes, our considerable victories, our meaningful impacts, our valuable contributions, our important roles, our essential services, our vital functions, our crucial support, our key assistance, our main help, our primary guidance, our chief advice, our principal recommendations, our leading solutions, our foremost answers, our premier services, our top tier quality, our first class standards, our world class excellence, our international quality, our global standards, our universal appeal, our widespread recognition, our broad acceptance, our general approval, our common preference, our popular choice, our favorite option, our preferred selection, our best pick, our top choice, our number one, our first choice, our primary option, our main selection, our chief pick, our principal choice, our leading option, our foremost selection, our premier choice, our supreme option, our ultimate selection, our perfect choice, our ideal option, our optimal selection, our best solution, our finest answer, our greatest response, our most suitable choice, our most appropriate option, our most fitting selection, our most relevant choice, our most applicable option, our most pertinent selection, our most suitable solution, our most effective answer, our most efficient response, our most productive choice, our most beneficial option, our most advantageous selection, our most valuable choice, our most worthwhile option, our most meaningful selection, our most significant choice, our most important option, our most essential selection, our most necessary choice, our most vital option, our most crucial selection, our most critical choice, our most key option, our most fundamental selection, our most basic choice, our most primary option, our most principal selection, our most main choice, our most chief option, our most leading selection, our most foremost choice, our most premier option, our most top selection, our most best choice, our most finest option, our most greatest selection, our most supreme choice, our most ultimate option, our most perfect selection, our most ideal choice, our most optimal option, Holidaysri team, meet our team, our experts, our professionals, our specialists, our consultants, our advisors, our planners, our coordinators, our managers, our executives, our directors, our leaders, our founders, our owners, our partners, our staff, our employees, our workforce, our people, our human resources, our talent, our expertise, our skills, our capabilities, our competencies, our qualifications, our certifications, our accreditations, our licenses, our permits, our authorizations, our approvals, our endorsements, our recognitions, our awards, our honors, our achievements, our accomplishments, our successes, our track record, our history, our background, our experience, our journey, our story, our narrative, our tale, our account, our description, our profile, our overview, our introduction, our presentation, our showcase, our portfolio, our gallery, our collection, our compilation, our assortment, our selection, our range, our variety, our diversity, our offerings, our services, our products, our solutions, our packages, our deals, our offers, contact Holidaysri, get in touch, reach us, connect with us, talk to us, speak with us, chat with us, message us, email us, call us, phone us, write to us, visit us, find us, locate us, our office, our location, our address, our contact details, our phone number, our email address, our website, our social media, follow us, like us, subscribe, join us, become a member, sign up, register, Holidaysri - Your Trusted Sri Lanka Travel Partner, Holidaysri - Connecting You with Authentic Sri Lanka, Holidaysri - Where Quality Meets Affordability, Holidaysri - Your Complete Sri Lanka Solution, Holidaysri - Making Sri Lanka Accessible to Everyone"
        canonical="https://www.holidaysri.com/about"
        structuredData={getOrganizationSchema()}
      />
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
            <span className="font-bold text-primary-600 dark:text-primary-400">Holidaysri.com PVT LTD</span> is a pioneering travel technology company dedicated to revolutionizing the way people experience Sri Lanka. Founded on November 11, 2023, we've quickly become a trusted platform connecting travelers with authentic Sri Lankan experiences.
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
    </>
  );
};

export default About;

