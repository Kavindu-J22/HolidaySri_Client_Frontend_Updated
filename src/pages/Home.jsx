import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO/SEO';
import { getOrganizationSchema, getWebsiteSchema } from '../utils/seoUtils';
import {
  MapPin,
  Star,
  Users,
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
  Heart,
  Loader,
  Image,
  Shield,
  Zap,
  CheckCircle,
  Building2,
  Plane,
  Coffee,
  Phone,
  BadgeCheck,
  UserCheck,
  Briefcase,
  Navigation,
  Dumbbell,
  Package,
  Clock,
  Map,
  Crown,
  Handshake,
  Rocket,
  ChevronUp,
  UserPlus,
  Settings,
  Share2,
  Calendar,
  HeartHandshake,
  DollarSign,
  Gift,
  ShoppingBag,
  Wrench,
  LifeBuoy,
  Layers,
  Waves,
  Music,
  Ambulance
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerSlides, setBannerSlides] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showSidebarArrow, setShowSidebarArrow] = useState(false);

  // Default banner slideshow data (fallback)
  const defaultBannerSlides = [
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

  // Fetch dynamic home banner slots
  useEffect(() => {
    const fetchBannerSlots = async () => {
      try {
        const response = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/home-banner-slot/active');
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          // Create array of 6 slots
          const dynamicSlides = [];

          // Map active banners to their slot numbers
          const slotMap = {};
          data.data.forEach(banner => {
            slotMap[banner.slotNumber] = {
              id: banner.slotNumber,
              title: banner.title,
              description: banner.description,
              image: banner.image.url,
              link: banner.link,
              buttonText: banner.buttonText
            };
          });

          // Fill all 6 slots (use dynamic if available, otherwise use default)
          for (let i = 1; i <= 6; i++) {
            if (slotMap[i]) {
              dynamicSlides.push(slotMap[i]);
            } else {
              dynamicSlides.push(defaultBannerSlides[i - 1]);
            }
          }

          setBannerSlides(dynamicSlides);
        } else {
          // No active banners, use all defaults
          setBannerSlides(defaultBannerSlides);
        }
      } catch (error) {
        console.error('Error fetching banner slots:', error);
        // On error, use default banners
        setBannerSlides(defaultBannerSlides);
      } finally {
        setLoadingBanners(false);
      }
    };

    fetchBannerSlots();
  }, []);

  // Fetch popular destinations for Plan Your Dream Tour section
  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        const response = await fetch('https://holidaysri-backend-9xm4.onrender.com/api/destinations?sortBy=popular&limit=4');
        const data = await response.json();

        if (data.destinations && data.destinations.length > 0) {
          setPopularDestinations(data.destinations);
        }
      } catch (error) {
        console.error('Error fetching popular destinations:', error);
      } finally {
        setLoadingDestinations(false);
      }
    };

    fetchPopularDestinations();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (bannerSlides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  // Core Services Data
  const coreServices = [
    {
      icon: Hotel,
      title: 'Accommodations',
      description: 'From luxury resorts to cozy guesthouses with Booking Feature',
      link: '/hotels-accommodations',
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Car,
      title: 'Transportation',
      description: 'Reliable vehicle rentals & professional drivers',
      link: '/vehicle-rentals-hire',
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Compass,
      title: 'Tour Packages',
      description: 'Curated experiences by local experts',
      link: '/local-tour-packages',
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: UtensilsCrossed,
      title: 'Dining',
      description: 'Authentic Sri Lankan cuisine & cafes',
      link: '/cafes-restaurants',
      color: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      icon: Camera,
      title: 'Attractions',
      description: 'Historical sites & natural wonders',
      link: '/explore-locations',
      color: 'from-red-500 to-red-600',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    {
      icon: Image,
      title: 'Holiday Memories',
      description: 'Share & discover travel photos',
      link: '/ads/entertainment/holiday-memories',
      color: 'from-pink-500 to-pink-600',
      iconBg: 'bg-pink-100 dark:bg-pink-900/30',
      iconColor: 'text-pink-600 dark:text-pink-400',
      featured: true
    }
  ];

  // Why Choose Us Features
  const whyChooseUs = [
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'All service providers are verified for your safety and peace of mind'
    },
    {
      icon: BadgeCheck,
      title: 'Trusted Platform',
      description: 'Join 10,000+ satisfied travelers who trust Holidaysri'
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Quick and easy booking process with instant confirmation'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs'
    }
  ];



  // Popular Categories
  const popularCategories = [
    { name: 'Hotels & Resorts', icon: Building2, link: '/services?category=hotels', count: '500+' },
    { name: 'Tour Packages', icon: Package, link: '/local-tour-packages', count: '1,000+' },
    { name: 'Vehicle Rentals', icon: Car, link: '/vehicle-rentals-hire', count: '300+' },
    { name: 'Restaurants', icon: Coffee, link: '/cafes-restaurants', count: '400+' },
    { name: 'Travel Guides', icon: Compass, link: '/ads/tourism/tour-guiders', count: '200+' },
    { name: 'Photographers', icon: Camera, link: '/ads/events/photographers', count: '150+' }
  ];

  // SEO structured data
  const structuredData = [
    getOrganizationSchema(),
    getWebsiteSchema()
  ];

  return (
    <>
      <SEO
        title="Holidaysri | Sri Lanka's #1 Tourism Platform - Book Tours, Hotels, Travel Packages & Experiences"
        description="Discover Sri Lanka with Holidaysri - Your complete tourism platform. Book tours, hotels, resorts, tour guides, vehicle rentals, restaurants & authentic experiences. Trusted by 10,000+ travelers. Best prices guaranteed. Instant confirmation. 24/7 support."
        keywords="Sri Lanka tourism, Sri Lanka travel, book Sri Lanka tours, Sri Lanka hotels, Sri Lanka tour packages, visit Sri Lanka, Sri Lanka vacation, Sri Lanka holiday, things to do in Sri Lanka, Sri Lanka attractions, Sri Lanka destinations, tour guides Sri Lanka, Sri Lanka travel guide, Ceylon tourism, Sri Lanka beach holidays, cultural tours Sri Lanka, wildlife safaris Sri Lanka, adventure travel Sri Lanka, luxury travel Sri Lanka, budget travel Sri Lanka, Sri Lanka honeymoon packages, family holidays Sri Lanka, backpacking Sri Lanka, Sri Lanka itinerary, best places visit Sri Lanka, Sri Lanka sightseeing, book hotels Sri Lanka, Sri Lanka resorts, boutique hotels Sri Lanka, beach resorts Sri Lanka, hill country hotels, Colombo hotels, Kandy hotels, Galle hotels, Ella accommodation, Nuwara Eliya hotels, Mirissa hotels, Unawatuna hotels, Bentota resorts, Negombo hotels, Sigiriya hotels, Dambulla hotels, Anuradhapura hotels, Polonnaruwa hotels, Yala hotels, Udawalawe hotels, Arugam Bay hotels, Trincomalee hotels, Jaffna hotels, Batticaloa hotels, vehicle rentals Sri Lanka, car rental Sri Lanka, van hire Sri Lanka, driver hire Sri Lanka, chauffeur service Sri Lanka, tuk tuk tours, self drive Sri Lanka, airport transfers Sri Lanka, private tours Sri Lanka, group tours Sri Lanka, customized tours Sri Lanka, tailor made tours, bespoke travel Sri Lanka, tour operators Sri Lanka, travel agency Sri Lanka, DMC Sri Lanka, destination management, ground handlers Sri Lanka, inbound tours, receptive tours, Sri Lanka tour companies, licensed tour operators, certified tour guides, professional drivers, expert guides, local guides, English speaking guides, multilingual guides, specialized tours, photography tours Sri Lanka, bird watching tours, wildlife tours, nature tours, eco tours, sustainable tourism, responsible travel, ethical tourism, community tourism, village tours, cultural immersion, heritage tours, historical tours, archaeological tours, ancient cities Sri Lanka, cultural triangle, UNESCO sites Sri Lanka, Sigiriya Rock, Dambulla Cave Temple, Anuradhapura ancient city, Polonnaruwa ruins, Kandy Temple of Tooth, Galle Fort, Sinharaja Rainforest, Central Highlands, Adam's Peak, Horton Plains, tea plantations Sri Lanka, spice gardens, elephant orphanage, turtle hatchery, whale watching Mirissa, dolphin watching, safari tours, Yala National Park safari, Udawalawe safari, Wilpattu safari, Minneriya elephant gathering, Kaudulla National Park, Bundala bird sanctuary, surfing Sri Lanka, Arugam Bay surfing, Weligama surf, Hikkaduwa surf, diving Sri Lanka, snorkeling, scuba diving, wreck diving, coral reefs, marine life, beach activities, water sports, jet skiing, parasailing, banana boat, kayaking, white water rafting, Kitulgala rafting, canoeing, stand up paddling, kite surfing, Kalpitiya kite surfing, wind surfing, sailing, yacht charters, boat tours, river safaris, mangrove tours, lagoon cruises, sunset cruises, fishing trips, deep sea fishing, sport fishing, trekking Sri Lanka, hiking trails, mountain climbing, rock climbing, camping Sri Lanka, glamping, adventure sports, zip lining, hot air balloon, helicopter tours, seaplane transfers, scenic flights, train journeys Sri Lanka, Kandy to Ella train, scenic train rides, tea country train, coastal train, Colombo to Galle train, road trips Sri Lanka, motorcycle tours, cycling tours, bike rentals, mountain biking, food tours Sri Lanka, culinary tours, cooking classes, street food tours, Sri Lankan cuisine, rice and curry, hoppers, kottu, seafood Sri Lanka, crab curry, prawn curry, fish ambul thiyal, traditional food, authentic restaurants, fine dining Sri Lanka, rooftop restaurants, beach restaurants, garden cafes, tea rooms, coffee shops, Ceylon tea, tea tasting, tea factory tours, spice tours, ayurveda Sri Lanka, ayurvedic treatments, spa resorts, wellness retreats, yoga retreats, meditation retreats, yoga Sri Lanka, wellness tourism, health tourism, medical tourism, spa treatments, massage therapy, traditional medicine, herbal treatments, detox programs, weight loss retreats, fitness holidays, spiritual tourism, pilgrimage tours, Buddhist temples, Hindu kovils, Christian churches, Islamic mosques, religious sites, sacred places, Temple of Tooth Kandy, Sri Maha Bodhi, Ruwanwelisaya, Jetavanaramaya, Abhayagiri, Thuparamaya, Mihintale, Kataragama, Nallur Kandaswamy, St. Anthony's Shrine, Kelaniya Temple, Gangaramaya Temple, Seema Malaka, Bellanwila Temple, Koneswaram Temple, Nagadeepa, Munneswaram, Seetha Amman Temple, Dambulla Golden Temple, Aluvihara Temple, Embekke Devalaya, Lankatilaka Temple, Gadaladeniya Temple, cave temples, rock temples, ancient monasteries, meditation centers, Buddhist monasteries, forest hermitages, pilgrimage sites, sacred mountains, Adam's Peak pilgrimage, Sri Pada, Kataragama festival, Esala Perahera, Vesak festival, Poson festival, Thai Pongal, Deepavali, Christmas Sri Lanka, New Year celebrations, Sinhala Tamil New Year, Avurudu, cultural festivals, traditional ceremonies, cultural performances, Kandyan dance, fire walking, devil dancing, mask dancing, drum performances, traditional music, folk music, cultural shows, art galleries, museums, National Museum Colombo, Colombo National Museum, Maritime Museum Galle, Dutch Museum, Tea Museum Kandy, Gem Museum, Mask Museum Ambalangoda, Folk Museum, Archaeological Museum, Independence Memorial Hall, colonial architecture, Dutch heritage, Portuguese legacy, British colonial, fort architecture, Galle Fort heritage, Jaffna Fort, Trincomalee Fort, Batticaloa Fort, Mannar Fort, Matara Fort, Hambantota, Dutch canal, colonial buildings, heritage hotels, colonial bungalows, tea estate bungalows, plantation houses, manor houses, rest houses, circuit bungalows, shopping Sri Lanka, shopping malls, Colombo shopping, Odel, House of Fashion, Liberty Plaza, Majestic City, One Galle Face, Colombo City Centre, Dutch Hospital Shopping, Pettah market, Manning Market, Good Market, night markets, flea markets, handicrafts Sri Lanka, batik, handloom, wood carvings, brass items, masks, pottery, lacquer work, traditional crafts, artisan products, gem shopping, jewelry Sri Lanka, sapphires, rubies, blue sapphire, star sapphire, cat's eye, alexandrite, certified gems, gem mines, Ratnapura gems, gem cutting, jewelry making, gold jewelry, silver jewelry, antique jewelry, designer jewelry, export quality, duty free shopping, souvenir shopping, Ceylon tea shopping, spice shopping, ayurvedic products, herbal products, coconut products, cinnamon, cardamom, cloves, nutmeg, pepper, vanilla, cashew, king coconut products, virgin coconut oil, coir products, handicraft exports, fair trade products, ethical shopping, sustainable products, eco friendly, organic products, natural products, handmade items, local products, authentic souvenirs, gift items, corporate gifts, wedding favors, event planning Sri Lanka, destination weddings, beach weddings, garden weddings, hotel weddings, resort weddings, villa weddings, temple blessings, traditional ceremonies, wedding packages, honeymoon packages, romantic getaways, couple packages, anniversary celebrations, vow renewals, proposal setups, engagement ceremonies, pre wedding shoots, wedding photography, videography, drone photography, wedding planners, event organizers, catering services, decoration, entertainment, live bands, DJ services, cultural performances, conference facilities Sri Lanka, MICE tourism, business travel, corporate events, team building, incentive travel, meetings, conferences, seminars, workshops, exhibitions, trade shows, convention centers, banquet halls, meeting rooms, business hotels, conference hotels, Colombo conference venues, Kandy conference, Galle conference, airport hotels, transit hotels, business centers, co-working spaces, digital nomad Sri Lanka, remote work, work from anywhere, long term stay, monthly rentals, serviced apartments, apartment hotels, extended stay, expat services, relocation services, visa services, Sri Lanka visa, ETA Sri Lanka, visa on arrival, tourist visa, business visa, transit visa, multiple entry visa, visa extension, immigration services, passport services, travel documents, travel insurance, comprehensive insurance, medical insurance, trip cancellation insurance, baggage insurance, adventure insurance, COVID insurance, health protocols, safety measures, travel safety, safe travel Sri Lanka, tourist police, emergency services, medical facilities, hospitals, clinics, pharmacies, emergency contacts, 24/7 support, customer service, help desk, travel assistance, concierge services, VIP services, luxury concierge, personal assistant, butler service, premium services, exclusive experiences, private experiences, luxury travel, five star hotels, luxury resorts, boutique luxury, villa rentals, private villas, pool villas, beach villas, hill villas, luxury apartments, penthouse suites, presidential suites, honeymoon suites, family suites, connecting rooms, accessible rooms, wheelchair accessible, special assistance, elderly care, child care, babysitting, kids club, family friendly, pet friendly, pet travel, service animals, dietary requirements, vegan options, vegetarian food, halal food, kosher meals, gluten free, food allergies, special diets, organic food, farm to table, sustainable dining, eco restaurants, beach shacks, street food, local eateries, authentic cuisine, fusion food, international cuisine, Italian restaurants, Chinese restaurants, Indian restaurants, Thai food, Japanese cuisine, Korean food, Mediterranean, continental, buffet, a la carte, set menus, tasting menus, chef's table, private dining, in villa dining, romantic dinners, candlelight dinners, beach dinners, sunset dinners, BBQ nights, seafood BBQ, theme nights, cultural nights, entertainment nights, live music, jazz nights, acoustic sessions, karaoke, dance floors, nightlife Sri Lanka, bars, pubs, clubs, beach bars, rooftop bars, sky bars, cocktail bars, wine bars, sports bars, Irish pubs, nightclubs, discos, party venues, beach parties, full moon parties, rave parties, electronic music, DJ nights, special events, New Year parties, Christmas events, festival celebrations, carnival, Galle Literary Festival, Colombo Art Biennale, music festivals, food festivals, cultural events, sports events, cricket matches, rugby matches, golf tournaments, tennis tournaments, marathons, cycling races, water sports competitions, surfing competitions, diving competitions, fishing tournaments, adventure races, trail running, obstacle races, charity events, fundraisers, community events, volunteer opportunities, teaching programs, conservation projects, wildlife conservation, marine conservation, turtle conservation, elephant welfare, animal rescue, environmental projects, beach cleanups, tree planting, coral restoration, community development, social enterprise, women empowerment, youth programs, education projects, skill development, vocational training, language classes, cultural exchange, homestay programs, farm stays, village stays, eco lodges, jungle lodges, tree houses, unique accommodation, unusual stays, castle hotels, heritage properties, converted buildings, railway carriages, lighthouse stays, cave hotels, cliff hotels, overwater bungalows, floating hotels, houseboat stays, camping sites, caravan parks, RV parks, backpacker hostels, budget hotels, guesthouses, B&B, home stays, Airbnb, vacation rentals, holiday homes, beach houses, mountain cabins, lake houses, riverside cottages, plantation bungalows, estate houses, manor stays, palace hotels, luxury camping, safari tents, eco tents, bell tents, yurts, tipis, pods, cabins, chalets, lodges, resorts, all inclusive resorts, adults only resorts, couples resorts, family resorts, kids resorts, water parks, theme parks, amusement parks, leisure parks, recreation centers, sports facilities, golf courses, tennis courts, badminton courts, squash courts, basketball courts, volleyball courts, cricket grounds, rugby fields, football fields, swimming pools, Olympic pools, lap pools, kids pools, splash pools, water slides, lazy rivers, wave pools, infinity pools, rooftop pools, private pools, plunge pools, jacuzzis, hot tubs, spa pools, hydrotherapy pools, salt water pools, natural pools, rock pools, tide pools, beach access, private beaches, public beaches, surf beaches, swimming beaches, snorkeling beaches, diving spots, fishing spots, boat launches, marinas, yacht clubs, sailing clubs, surf clubs, dive centers, water sports centers, adventure centers, activity centers, tour desks, travel desks, information centers, visitor centers, tourist information, travel guides, guide books, maps, brochures, itineraries, route planners, trip planners, travel apps, mobile apps, booking apps, Holidaysri app, download app, iOS app, Android app, mobile booking, app exclusive deals, app discounts, loyalty program, rewards program, points, cashback, vouchers, gift cards, referral program, affiliate program, partner program, B2B portal, agent portal, supplier portal, vendor registration, list your property, advertise with us, partnership opportunities, franchise opportunities, investment opportunities, business opportunities, career opportunities, job vacancies, employment, recruitment, internships, training programs, staff development, customer reviews, testimonials, ratings, feedback, success stories, case studies, portfolio, gallery, photo gallery, video gallery, virtual tours, 360 tours, live webcams, weather updates, climate information, best time to visit, seasonal guide, month by month, travel calendar, event calendar, festival calendar, public holidays, school holidays, peak season, off season, shoulder season, monsoon season, dry season, wet season, northeast monsoon, southwest monsoon, inter monsoon, climate zones, weather patterns, temperature, rainfall, humidity, sunshine hours, UV index, air quality, pollution levels, environmental conditions, natural disasters, tsunami warnings, cyclone alerts, flood warnings, landslide risks, safety alerts, travel advisories, government warnings, embassy alerts, consular information, registration, citizen services, emergency evacuation, crisis management, risk assessment, security briefings, safety tips, travel tips, packing tips, what to pack, clothing recommendations, footwear, accessories, toiletries, medications, first aid, sun protection, insect repellent, water purification, power adapters, voltage, electrical outlets, phone chargers, SIM cards, mobile networks, roaming, data plans, WiFi, internet cafes, communication, language, Sinhala, Tamil, English, phrases, translations, dictionary, language apps, cultural etiquette, customs, traditions, dos and don'ts, respect, sensitivity, appropriate dress, temple etiquette, religious respect, photography rules, tipping culture, bargaining, haggling, local customs, social norms, greetings, gestures, body language, personal space, eye contact, handshakes, namaste, ayubowan, vanakkam, time keeping, punctuality, business culture, meeting etiquette, gift giving, dining etiquette, table manners, eating customs, right hand, sharing food, hospitality, guest culture, host responsibilities, visitor expectations, cultural sensitivity, cross cultural, multicultural, diversity, inclusion, accessibility, universal design, barrier free, inclusive tourism, accessible attractions, wheelchair access, mobility aids, ramps, elevators, accessible toilets, disabled parking, sign language, braille, audio guides, tactile exhibits, sensory experiences, quiet spaces, rest areas, medical facilities, nursing rooms, baby changing, family rooms, prayer rooms, multi faith spaces, halal facilities, kosher facilities, dietary accommodations, allergy information, ingredient lists, nutritional information, health information, vaccination requirements, recommended vaccines, malaria, dengue, Japanese encephalitis, typhoid, hepatitis, rabies, tetanus, yellow fever, COVID-19, pandemic protocols, testing requirements, quarantine rules, isolation facilities, health screening, temperature checks, contact tracing, sanitization, hygiene, hand washing, masks, social distancing, capacity limits, crowd management, queue management, timed entry, advance booking, reservation required, walk ins, same day booking, last minute booking, instant confirmation, flexible booking, free cancellation, refundable, non refundable, deposit, full payment, partial payment, installments, payment plans, financing, credit terms, invoice, receipt, voucher, confirmation, e ticket, mobile ticket, print at home, collect on arrival, will call, box office, ticket counter, reservation desk, check in, online check in, mobile check in, express check in, priority check in, fast track, VIP check in, red carpet, welcome drink, cold towel, garland, traditional welcome, cultural greeting, warm hospitality, friendly staff, professional service, trained personnel, experienced team, knowledgeable guides, expert advice, insider tips, local recommendations, hidden gems, secret spots, off beaten path, undiscovered, unexplored, authentic, genuine, real, traditional, modern, contemporary, fusion, blend, mix, combination, variety, diversity, range, selection, choice, options, alternatives, possibilities, opportunities, experiences, adventures, journeys, trips, tours, excursions, outings, day trips, half day, full day, multi day, overnight, weekend, week long, fortnight, month long, extended, long term, short term, quick, express, intensive, comprehensive, complete, thorough, detailed, in depth, superficial, overview, introduction, orientation, familiarization, discovery, exploration, investigation, research, study, learning, education, knowledge, information, data, facts, figures, statistics, numbers, metrics, measurements, comparisons, rankings, ratings, scores, grades, levels, standards, quality, excellence, superiority, premium, deluxe, luxury, comfort, convenience, efficiency, speed, reliability, dependability, consistency, stability, security, safety, protection, insurance, guarantee, warranty, assurance, confidence, trust, faith, belief, credibility, reputation, brand, name, recognition, awareness, visibility, presence, reach, coverage, distribution, availability, accessibility, convenience, ease, simplicity, straightforward, uncomplicated, hassle free, smooth, seamless, effortless, easy, simple, quick, fast, rapid, swift, speedy, prompt, immediate, instant, real time, live, current, up to date, latest, newest, recent, modern, contemporary, current, present, now, today, this moment, right now, immediately, instantly, at once, without delay, promptly, quickly, rapidly, swiftly, speedily, fast, express, priority, urgent, rush, emergency, critical, important, essential, necessary, vital, crucial, key, main, primary, principal, chief, major, significant, substantial, considerable, notable, remarkable, outstanding, exceptional, extraordinary, special, unique, distinctive, different, unusual, rare, uncommon, exclusive, limited, select, choice, premium, superior, excellent, superb, magnificent, splendid, wonderful, marvelous, fantastic, amazing, incredible, awesome, brilliant, great, good, fine, nice, pleasant, enjoyable, delightful, charming, lovely, beautiful, gorgeous, stunning, breathtaking, spectacular, impressive, striking, remarkable, memorable, unforgettable, once in lifetime, bucket list, dream, aspiration, goal, ambition, desire, wish, hope, expectation, anticipation, excitement, enthusiasm, passion, love, affection, fondness, liking, preference, choice, selection, pick, option, alternative, possibility, opportunity, chance, occasion, moment, time, period, duration, length, span, stretch, extent, range, scope, scale, size, magnitude, dimension, proportion, ratio, percentage, fraction, part, portion, section, segment, piece, bit, element, component, aspect, feature, characteristic, quality, attribute, property, trait, nature, essence, substance, core, heart, soul, spirit, character, personality, identity, individuality, uniqueness, distinction, difference, variation, diversity, variety, range, spectrum, array, collection, assortment, selection, choice, mix, blend, combination, fusion, integration, synthesis, merger, union, alliance, partnership, collaboration, cooperation, teamwork, joint effort, collective, group, community, society, culture, civilization, heritage, legacy, tradition, custom, practice, habit, routine, pattern, way, method, approach, technique, strategy, tactic, plan, scheme, program, project, initiative, campaign, movement, cause, mission, purpose, goal, objective, aim, target, end, result, outcome, consequence, effect, impact, influence, significance, importance, value, worth, merit, benefit, advantage, gain, profit, return, reward, prize, award, recognition, honor, glory, fame, renown, reputation, prestige, status, standing, position, rank, level, grade, class, category, type, kind, sort, variety, form, shape, structure, organization, arrangement, order, system, framework, foundation, basis, ground, platform, stage, setting, context, environment, surroundings, atmosphere, ambiance, mood, feeling, emotion, sentiment, sensation, experience, perception, impression, view, opinion, thought, idea, concept, notion, understanding, comprehension, grasp, knowledge, awareness, consciousness, realization, recognition, acknowledgment, acceptance, approval, agreement, consent, permission, authorization, clearance, go ahead, green light, thumbs up, okay, yes, affirmative, positive, favorable, good, beneficial, advantageous, helpful, useful, valuable, worthwhile, meaningful, significant, important, essential, necessary, vital, crucial, critical, key, fundamental, basic, primary, main, principal, chief, leading, foremost, premier, top, best, finest, greatest, supreme, ultimate, perfect, ideal, model, exemplary, outstanding, excellent, superior, first class, world class, international, global, universal, comprehensive, complete, total, full, entire, whole, all inclusive, everything, all, every, each, any, some, several, many, numerous, countless, infinite, unlimited, boundless, endless, eternal, everlasting, permanent, lasting, enduring, durable, long lasting, sustainable, viable, feasible, practical, realistic, achievable, attainable, possible, probable, likely, certain, sure, definite, guaranteed, assured, confirmed, verified, validated, authenticated, certified, approved, endorsed, recommended, suggested, proposed, offered, provided, supplied, delivered, given, presented, shown, displayed, exhibited, demonstrated, illustrated, explained, described, detailed, outlined, summarized, highlighted, emphasized, stressed, underlined, noted, mentioned, stated, said, told, communicated, conveyed, expressed, articulated, voiced, spoken, written, documented, recorded, registered, logged, tracked, monitored, measured, assessed, evaluated, analyzed, examined, inspected, checked, verified, confirmed, validated, tested, tried, proven, established, recognized, acknowledged, accepted, approved, endorsed, supported, backed, sponsored, funded, financed, invested, developed, created, made, built, constructed, designed, planned, organized, arranged, prepared, ready, set, go, start, begin, commence, initiate, launch, introduce, present, unveil, reveal, disclose, announce, declare, proclaim, publish, release, issue, distribute, circulate, spread, share, disseminate, broadcast, transmit, send, deliver, provide, supply, offer, give, present, award, grant, bestow, confer, honor, recognize, acknowledge, appreciate, thank, congratulate, celebrate, commemorate, mark, observe, remember, recall, recollect, reminisce, reflect, think, consider, ponder, contemplate, meditate, muse, wonder, question, ask, inquire, investigate, explore, discover, find, locate, identify, recognize, spot, notice, observe, see, view, watch, look, gaze, stare, glance, peek, glimpse, catch sight, witness, behold, perceive, sense, feel, experience, undergo, encounter, meet, face, confront, deal with, handle, manage, cope, survive, endure, withstand, overcome, conquer, defeat, beat, win, succeed, achieve, accomplish, attain, reach, arrive, get to, make it, do it, complete, finish, end, conclude, close, wrap up, finalize, settle, resolve, solve, fix, repair, mend, restore, renew, refresh, revive, rejuvenate, regenerate, recreate, rebuild, reconstruct, redevelop, redesign, reimagine, reinvent, transform, change, alter, modify, adjust, adapt, customize, personalize, tailor, fit, suit, match, align, coordinate, harmonize, balance, equilibrate, stabilize, steady, secure, safe, protected, guarded, defended, shielded, sheltered, covered, insured, guaranteed, warranted, assured, certain, sure, confident, positive, optimistic, hopeful, expectant, anticipatory, excited, enthusiastic, eager, keen, interested, curious, inquisitive, questioning, wondering, thinking, considering, contemplating, pondering, reflecting, musing, dreaming, imagining, envisioning, visualizing, picturing, seeing, believing, trusting, having faith, relying, depending, counting on, banking on, Holidaysri, your trusted partner, your reliable choice, your best option, your perfect solution, your complete answer, your one stop destination, your gateway to Sri Lanka, your window to paradise, your door to adventure, your path to discovery, your route to experience, your journey to memories, your trip to happiness, your vacation to joy, your holiday to delight, your tour to wonder, your travel to beauty, your exploration to magnificence, your adventure to glory, your experience to excellence, your Sri Lanka, our expertise, your dreams, our reality, your satisfaction, our commitment, your happiness, our goal, your memories, our pride, your journey starts here, book with Holidaysri today, discover Sri Lanka with Holidaysri, explore paradise with Holidaysri, experience wonder with Holidaysri, create memories with Holidaysri, live your dreams with Holidaysri, find your perfect Sri Lanka holiday with Holidaysri, plan your ideal Sri Lanka vacation with Holidaysri, design your ultimate Sri Lanka adventure with Holidaysri, customize your dream Sri Lanka tour with Holidaysri, book your unforgettable Sri Lanka experience with Holidaysri, start your amazing Sri Lanka journey with Holidaysri, begin your incredible Sri Lanka story with Holidaysri, make your Sri Lanka dreams come true with Holidaysri, turn your Sri Lanka wishes into reality with Holidaysri, Holidaysri - Where Sri Lankan Dreams Come True, Holidaysri - Your Complete Sri Lanka Solution, Holidaysri - Sri Lanka Made Simple, Holidaysri - Discover, Explore, Experience Sri Lanka, Holidaysri - Your Sri Lanka Starts Here"
        canonical="https://www.holidaysri.com"
        structuredData={structuredData}
      />
      <div className="space-y-16">
        {/* Banner Slideshow Section */}
        <section className="relative">
        <div className="relative h-96 sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
          {loadingBanners ? (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
                <p className="text-lg font-semibold">Loading banners...</p>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>

      {/* Unforgettable Sri Lankan Adventures - 4 Box Section */}
      <section className="relative overflow-hidden px-3 sm:px-4 lg:px-0">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-blue-900/5 dark:via-purple-900/5 dark:to-pink-900/5 rounded-3xl"></div>

        <div className="relative py-12 sm:py-16">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2" />
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                EXPLORE OUR SERVICES
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="block text-gray-800 dark:text-gray-100 tracking-wide">
                Unforgettable Sri Lankan
              </span>
              <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent mt-1">
                Adventures
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
              Everything you need for your perfect Sri Lankan journey, all in one place
            </p>
          </div>

          {/* Mobile App Style Grid - 15 Apps */}
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-10 max-w-7xl mx-auto px-4 lg:px-8">
            {/* App 1: Hotels */}
            <Link
              to="/hotels-accommodations"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                {/* App Icon Container */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/60 to-cyan-500/60"></div>
                  </div>

                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Hotel className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Hotels
              </span>
            </Link>

            {/* App 2: Vehicles */}
            <Link
              to="/vehicle-rentals-hire"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/60 to-pink-500/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Car className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Vehicles
              </span>
            </Link>

            {/* App 3: HS Memories */}
            <Link
              to="/ads/entertainment/holiday-memories"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/60 to-rose-500/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                HS Memories
              </span>
            </Link>

            {/* App 4: Agents */}
            <Link
              to="/promo-codes-travel-agents"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/60 to-blue-500/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Agents
              </span>
            </Link>

            {/* App 5: Travel Buddies */}
            <Link
              to="/travel-buddies"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/60 to-emerald-500/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Travel Buddies
              </span>
            </Link>

            {/* App 6: Tour Guiders */}
            <Link
              to="/ads/tourism/tour-guiders"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/60 to-orange-500/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Navigation className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Tour Guiders
              </span>
            </Link>

            {/* App 7: Restaurants */}
            <Link
              to="/cafes-restaurants"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/60 to-rose-500/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <UtensilsCrossed className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                Restaurants
              </span>
            </Link>

            {/* App 8: Foods */}
            <Link
              to="/foods-beverages"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/60 to-orange-500/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Coffee className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                Foods
              </span>
            </Link>

            {/* App 9: Live Rides */}
            <Link
              to="/ads/vehicles-transport/live-rides-carpooling"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/60 to-cyan-500/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Live Rides
              </span>
            </Link>

            {/* App 10: Marketplaces */}
            <Link
              to="/rent-property-buying-selling"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/60 to-purple-500/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                Marketplaces
              </span>
            </Link>

            {/* App 11: Fitness & Spa */}
            <Link
              to="/ads/professionals/fitness-health-spas-gym"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-500/60 to-green-500/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                Fitness & Spa
              </span>
            </Link>

            {/* App 12: Customize Tour */}
            <Link
              to="/ads/tourism/customize-package"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/60 to-blue-500/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Settings className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Customize Tour
              </span>
            </Link>

            {/* App 13: Cultural Events */}
            <Link
              to="/ads/events-management/events-updates"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/60 to-orange-500/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Cultural Events
              </span>
            </Link>

            {/* App 14: Emergency Services */}
            <Link
              to="/ads/essential-services/emergency-services-insurance"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/60 to-red-700/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Ambulance className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                Emergency Services
              </span>
            </Link>

            {/* App 15: Combo Packages */}
            <Link
              to="/exclusive-combo-packages"
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=400&fit=crop)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/60 to-pink-500/60"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                Combo Packages
              </span>
            </Link>
          </div>

          {/* Explore More Button */}
          <div className="flex justify-center" style={{ marginTop: '40px', marginBottom: '5px' }}>
            <button
              onClick={() => {
                // Check if desktop or mobile
                const isDesktop = window.innerWidth >= 1024;

                if (isDesktop) {
                  // Desktop: Scroll to top with animation and show arrow
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setShowSidebarArrow(true);

                  // Hide arrow after 4 seconds
                  setTimeout(() => {
                    setShowSidebarArrow(false);
                  }, 4000);
                } else {
                  // Mobile: Open sidebar
                  const menuButton = document.querySelector('[aria-label="Open categories"]');
                  if (menuButton) {
                    menuButton.click();
                  }
                }
              }}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-semibold text-sm sm:text-base rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <Layers className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              <span className="relative z-10">Explore More</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform relative z-10" />

              {/* Sparkle effect */}
              <div className="absolute -top-0.5 -right-0.5">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300 animate-pulse" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Creative Arrow Animation for Desktop - Points to Sidebar */}
      {showSidebarArrow && (
        <div className="hidden lg:block fixed top-8 left-16 z-50 animate-bounce">
          <div className="relative">
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-xl opacity-75 animate-pulse"></div>

            {/* Arrow pointing left to sidebar */}
            <div className="relative bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white px-6 py-3 rounded-2xl shadow-2xl">
              <div className="flex flex-col">
                <span className="font-bold text-sm whitespace-nowrap">Open Sidebar</span>
                <span className="text-xs opacity-90">Click here to explore categories</span>
              </div>

              {/* Sparkles around arrow */}
              <div className="absolute -top-2 -left-2">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
              </div>
              <div className="absolute -bottom-2 -left-2">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-ping" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section - Professional & Engaging */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
          {/* Floating Orbs Animation */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 dark:bg-primary-500/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200/30 dark:bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200/30 dark:bg-pink-500/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl animate-blob animation-delay-4000"></div>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>

          {/* Floating Airplanes */}
          <div className="absolute top-1/4 left-0 animate-airplane-1">
            <Plane className="w-8 h-8 sm:w-10 sm:h-10 text-primary-400/40 dark:text-primary-300/30 transform -rotate-12" />
          </div>
          <div className="absolute top-1/3 right-0 animate-airplane-2">
            <Plane className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400/40 dark:text-purple-300/30 transform rotate-12" />
          </div>
        </div>
        <div className="relative px-3 sm:px-6 py-10 sm:py-16 text-center">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 dark:text-primary-400 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 whitespace-nowrap">
                Sri Lanka's #1 Travel Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to Holidaysri.com
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
              Discover authentic experiences, connect with trusted service providers, and create memories that last a lifetime.
              Everything you need for the perfect Sri Lankan holiday, all in one place.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 justify-center items-center mb-6 sm:mb-10 px-2">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">Verified Providers</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">100% Trusted</div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">10,000+ Travelers</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Trust Us</div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                  <Star className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">4.9/5 Rating</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Excellent Service</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-3 sm:px-4">
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-primary-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Explore Services
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              </Link>
              <Link
                to="/ads/entertainment/holiday-memories"
                className="inline-flex items-center justify-center px-5 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 text-sm sm:text-base font-semibold rounded-xl border-2 border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
              >
                <Image className="mr-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                Visit our social media 
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Your Dream Tour Section - Professional & Attractive */}
      <section className="relative overflow-hidden px-4 sm:px-6 md:px-8">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 rounded-3xl"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-200/20 to-purple-200/20 dark:from-primary-500/5 dark:to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-200/20 to-blue-200/20 dark:from-pink-500/5 dark:to-blue-500/5 rounded-full blur-3xl"></div>

        <div className="relative py-12 sm:py-16 md:py-20">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-full mb-4 sm:mb-6">
              <Map className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base font-bold text-primary-600 dark:text-primary-400">
                DISCOVER SRI LANKA
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Plan Your Dream Tour
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4 leading-relaxed">
              Explore Sri Lanka's most captivating destinations. From vibrant cities to ancient wonders,
              start your unforgettable journey here.
            </p>
          </div>

          {/* Destination Cards Grid */}
          {loadingDestinations ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader className="w-12 h-12 sm:w-16 sm:h-16 animate-spin mx-auto mb-4 text-primary-600 dark:text-primary-400" />
                <p className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400">
                  Loading destinations...
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-0">
              {popularDestinations.map((destination, index) => (
                <div
                  key={destination._id}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Destination Image */}
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={destination.images && destination.images[0] ? destination.images[0].url : 'https://via.placeholder.com/400x300'}
                      alt={destination.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    {/* Destination Type Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full text-xs font-bold text-primary-600 dark:text-primary-400 shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {destination.type || 'Popular'}
                      </span>
                    </div>

                    {/* Destination Name & Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        {destination.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-white/90 text-sm">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{destination.province}</span>
                        </div>
                        {destination.averageRating > 0 && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                            <span>{destination.averageRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                      {destination.description}
                    </p>

                    {/* Distance Info */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Navigation className="w-4 h-4 mr-1.5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                        <span>{destination.distanceFromColombo} km from Colombo</span>
                      </div>
                    </div>

                    {/* Explore Now Button */}
                    <Link
                      to={`/destinations/${destination._id}`}
                      className="w-full inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-primary-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg group"
                    >
                      Explore Now
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Explore More Button */}
          <div className="text-center">
            <Link
              to="/plan-dream-tour"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white text-sm sm:text-base font-bold rounded-xl hover:from-primary-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Compass className="mr-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              Explore More Destinations
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            </Link>
          </div>
        </div>
      </section>



      {/* Core Services Section - Professional Grid */}
      <section className="px-3 sm:px-4 lg:px-0">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-2" />
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              Our Services
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5 px-2">
            Explore Our Services
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3 sm:px-4 leading-relaxed">
            Everything you need for an unforgettable Sri Lankan experience, from accommodations to unique local experiences
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12">
          {coreServices.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className={`group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-200 dark:border-gray-700 hover:border-transparent overflow-hidden ${
                service.featured ? 'ring-2 ring-pink-500 dark:ring-pink-400 ring-offset-2 dark:ring-offset-gray-900' : ''
              }`}
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-primary-900/10 dark:via-purple-900/10 dark:to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              {/* Featured Badge */}
              {service.featured && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                  <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                    <Sparkles className="w-3 h-3 mr-1" />
                    NEW
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10">
                {/* Icon Container */}
                <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 ${service.iconBg} rounded-2xl mb-4 sm:mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md`}>
                  <service.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${service.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 leading-relaxed min-h-[2.5rem]">
                  {service.description}
                </p>

                {/* CTA */}
                <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                  <span>Explore Now</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary-200/20 to-purple-200/20 dark:from-primary-700/10 dark:to-purple-700/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            </Link>
          ))}
        </div>

        {/* Explore More Services Button */}
        <div className="text-center pt-4 sm:pt-6">
          <Link
            to="/services"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white text-sm sm:text-base font-bold rounded-xl hover:from-primary-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <Sparkles className="mr-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
            Explore More Services
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <p className="mt-3 sm:mt-4 text-sm text-gray-500 dark:text-gray-400">
            Discover all our services and find exactly what you need
          </p>
        </div>
      </section>

      {/* Holiday Memories Feature Section */}
      <section className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl mx-2 sm:mx-0">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x"></div>
        {/* Subtle Overlay Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative px-3 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
              <div className="text-white">
                <div className="inline-flex items-center px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full mb-3 sm:mb-6">
                  <Image className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">OUR SOCIAL MEDIA</span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-6">
                  Share Your Holiday Memories
                </h2>

                <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 text-white/90 leading-relaxed">
                  Join our vibrant community of travelers! Upload your stunning Sri Lankan travel photos,
                  discover hidden gems through others' experiences, and earn rewards when travelers download your photos.
                  Your memories inspire the next adventure!
                </p>

                <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1">Upload & Share</div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-white/80">Share your travel photos with the community</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1">Earn Rewards</div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-white/80">Get paid when travelers download your photos</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1">Discover Destinations</div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-white/80">Explore Sri Lanka through authentic traveler photos</div>
                    </div>
                  </div>
                </div>

                {/* Button - Hidden on mobile, shown on md+ */}
                <Link
                  to="/ads/entertainment/holiday-memories"
                  className="hidden md:inline-flex items-center px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-purple-600 text-sm sm:text-base font-bold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl w-full sm:w-auto justify-center"
                >
                  Explore Holiday Memories
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                </Link>
              </div>

              <div className="relative mt-6 md:mt-0">
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 transform hover:scale-105 transition-transform">
                      <Camera className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white mb-1 sm:mb-2" />
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">5,000+</div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-white/80">Photos Shared</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 transform hover:scale-105 transition-transform">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white mb-1 sm:mb-2" />
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">1,200+</div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-white/80">Contributors</div>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 mt-4 sm:mt-6 md:mt-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 transform hover:scale-105 transition-transform">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white mb-1 sm:mb-2" />
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">300+</div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-white/80">Locations</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 transform hover:scale-105 transition-transform">
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white mb-1 sm:mb-2" />
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">15,000+</div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-white/80">Likes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Button - Shown on mobile at bottom, hidden on md+ */}
            <div className="mt-6 md:hidden">
              <Link
                to="/ads/entertainment/holiday-memories"
                className="inline-flex items-center px-6 py-3 bg-white text-purple-600 text-sm font-bold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl w-full justify-center"
              >
                Explore Holiday Memories
                <ArrowRight className="ml-2 w-4 h-4 flex-shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other Special Features Section */}
      <section className="px-2 sm:px-0">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-full mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 dark:text-primary-400 mr-1.5 sm:mr-2 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400">DISCOVER MORE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            Other Special Features
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3 sm:px-4">
            Explore our comprehensive range of services designed to make your Sri Lankan experience extraordinary
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {/* Travel Buddies Platform */}
          <Link
            to="/travel-buddies"
            className="group relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-200 dark:border-blue-800 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl sm:rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                TRAVEL BUDDIES PLATFORM
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Find Travel Buddys for your trips and Organize Your Trips with Travel Buddies
              </p>
              <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Explore Now <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Customize Your Sri Lankan Adventure */}
          <Link
            to="/ads/tourism/customize-package"
            className="group relative bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-200 dark:border-purple-800 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-xl sm:rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                CUSTOMIZE YOUR SRI LANKAN ADVENTURE
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Request a Customize Tour Package from our Commercial Partners & Members
              </p>
              <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Explore Now <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Live Rides & Carpooling */}
          <Link
            to="/ads/vehicles-transport/live-rides-carpooling"
            className="group relative bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-green-200 dark:border-green-800 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-xl sm:rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Share2 className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                LIVE RIDES & CARPOOLING
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Offer Carpooling Services to Passengers & Find and Share Rides
              </p>
              <div className="mt-4 flex items-center text-green-600 dark:text-green-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Explore Now <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Manage or Customize Your Event */}
          <Link
            to="/ads/events-management/customize-event"
            className="group relative bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/10 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-200 dark:border-orange-800 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-xl sm:rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                MANAGE OR CUSTAMIZE YOUR EVENT
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Request a Customize Event from our Commercial Partners, Members, and Event Professionals
              </p>
              <div className="mt-4 flex items-center text-orange-600 dark:text-orange-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Explore Now <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Compassionate Caregivers & Earn Time Currency */}
          <Link
            to="/caregivers-time-currency-browse"
            className="group relative bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-900/10 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-pink-200 dark:border-pink-800 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/50 rounded-xl sm:rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <HeartHandshake className="w-6 h-6 sm:w-7 sm:h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                COMPASSINATE CAREGIVERS & EARN TIME CURRENCY
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Connect with Compassionate Caregivers & Earn Time Currency for your Care Needs
              </p>
              <div className="mt-4 flex items-center text-pink-600 dark:text-pink-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Explore Now <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Donations & Fundraising Campaigns */}
          <Link
            to="/donations-raise-fund-browse"
            className="group relative bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900/10 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-red-200 dark:border-red-800 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-xl sm:rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                DONATIONS & FUNDRAISING CAMPAIGNS
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Support Charitable Causes and Raise Funds for Your Causes
              </p>
              <div className="mt-4 flex items-center text-red-600 dark:text-red-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Explore Now <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* Second Row - Continued Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {/* Exclusive Combo Packages */}
          <Link
            to="/exclusive-combo-packages"
            className="group relative bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/10 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-indigo-200 dark:border-indigo-800 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-xl sm:rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                EXCLUSIVE COMBO PACKAGES
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Discover Unique Combo Packages for Weddings, Tours, and More
              </p>
              <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Explore Now <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Exciting Job Opportunities */}
          <Link
            to="/ads/professionals/job-opportunities"
            className="group relative bg-gradient-to-br from-white to-teal-50 dark:from-gray-800 dark:to-teal-900/10 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-teal-200 dark:border-teal-800 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50 rounded-xl sm:rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                EXCITING JOB OPPORTUNITIES
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Find Exciting Job Opportunities in Sri Lanka
              </p>
              <div className="mt-4 flex items-center text-teal-600 dark:text-teal-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Explore Now <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Emergency Services & Insurance */}
          <Link
            to="/ads/essential-services/emergency-services-insurance"
            className="group relative bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-amber-900/10 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-amber-200 dark:border-amber-800 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 rounded-xl sm:rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <LifeBuoy className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                EMERGENCY SERVICES & INSURANCE
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Access Emergency Services & Insurance Coverage
              </p>
              <div className="mt-4 flex items-center text-amber-600 dark:text-amber-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Explore Now <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* Special Info Cards - No Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Marketplace & Shopping */}
          <div className="relative bg-gradient-to-br from-white to-cyan-50 dark:from-gray-800 dark:to-cyan-900/10 rounded-2xl p-5 sm:p-6 shadow-lg border border-cyan-200 dark:border-cyan-800 overflow-hidden">
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/50 dark:to-cyan-800/50 rounded-xl sm:rounded-2xl mb-4">
                <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                Marketplace & Shopping
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Explore a Wide Range of Products and Services
              </p>
              <div className="flex items-start space-x-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3">
                <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-cyan-900 dark:text-cyan-100 font-medium">
                  Check 60+ Categories Sidebar → Marketplace & Shopping category
                </p>
              </div>
            </div>
          </div>

          {/* Professionals & Services */}
          <div className="relative bg-gradient-to-br from-white to-violet-50 dark:from-gray-800 dark:to-violet-900/10 rounded-2xl p-5 sm:p-6 shadow-lg border border-violet-200 dark:border-violet-800 overflow-hidden">
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/50 dark:to-violet-800/50 rounded-xl sm:rounded-2xl mb-4">
                <Wrench className="w-6 h-6 sm:w-7 sm:h-7 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                Professionals & Services
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Meet Expert Professionals & Services in Sri Lanka
              </p>
              <div className="flex items-start space-x-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3">
                <Layers className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-violet-900 dark:text-violet-100 font-medium">
                  Check 60+ Categories Sidebar → Professionals & Services category
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-2 sm:px-0">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            Why Choose Holidaysri?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3 sm:px-4">
            We're committed to providing the best travel experience with verified providers and exceptional service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {whyChooseUs.map((feature, index) => (
            <div key={index} className="card p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="px-2 sm:px-0">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            Popular Categories
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3 sm:px-4">
            Browse our most popular service categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {popularCategories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="card p-3 sm:p-4 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg sm:rounded-xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {category.name}
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                {category.count}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* HSC System Section - Enhanced */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-8 md:p-12 mx-2 sm:mx-0">
        {/* Subtle Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        <div className="max-w-4xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4 sm:mb-6">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400">HLIDAYSRI COINS (HSC)</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                HSC Token System
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                Advertise your tourism services using our innovative HSC token system.
                Purchase tokens to promote your hotels, restaurants, tours, and more to thousands of travelers.
              </p>

              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">Reach 10,000+ active travelers</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">Flexible token-based pricing</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">Real-time analytics & insights</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/hsc"
                  className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg w-full sm:w-auto"
                >
                  Learn About HSC
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 text-sm sm:text-base font-semibold rounded-xl border-2 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                  >
                    Start Advertising
                  </Link>
                )}
              </div>
            </div>

            <div className="relative mt-6 md:mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg sm:rounded-xl">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Active Ads</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Running campaigns</div>
                      </div>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">2,500+</div>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg sm:rounded-xl">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Advertisers</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Trusted partners</div>
                      </div>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">800+</div>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg sm:rounded-xl">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Success Rate</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Customer satisfaction</div>
                      </div>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400">95%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership & Partnership Section - Smart & Professional */}
      <section className="px-2 sm:px-0">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-full mb-4 sm:mb-6">
              <Rocket className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 dark:text-primary-400 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400">JOIN OUR COMMUNITY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Grow With Holidaysri
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Whether you're a traveler or a business, we have the perfect plan for you
            </p>
          </div>

          {/* Two Cards Grid */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Membership Card */}
            <div className="group relative bg-gradient-to-br from-white via-primary-50/30 to-purple-50/30 dark:from-gray-800 dark:via-primary-900/10 dark:to-purple-900/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-primary-100 dark:border-primary-800 overflow-hidden flex flex-col">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Decorative Blob */}
              <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-primary-200/20 to-purple-200/20 dark:from-primary-700/10 dark:to-purple-700/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10 flex flex-col flex-1">
                {/* Badge and Icon Row */}
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg flex-shrink-0">
                    <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Badge */}
                  <div className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                    <Sparkles className="w-3 h-3 text-primary-600 dark:text-primary-400 mr-1.5 flex-shrink-0" />
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 whitespace-nowrap">FOR TRAVELERS</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Become a Member
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-5 sm:mb-6 leading-relaxed">
                  Unlock exclusive benefits, special discounts, and premium features. Join thousands of travelers enjoying VIP experiences across Sri Lanka.
                </p>

                {/* Benefits List */}
                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  <div className="flex items-start space-x-2.5 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Exclusive member-only discounts up to 30%</span>
                  </div>
                  <div className="flex items-start space-x-2.5 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Priority booking and customer support</span>
                  </div>
                  <div className="flex items-start space-x-2.5 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Earn bonus HSC tokens on every booking</span>
                  </div>
                  <div className="flex items-start space-x-2.5 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Access to premium travel guides & tips</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <Link
                    to="/ads/essential/pricing-memberships"
                    className="inline-flex items-center justify-center w-full px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white text-sm sm:text-base font-bold rounded-xl hover:from-primary-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                  >
                    <Crown className="mr-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover/btn:rotate-12 transition-transform duration-300" />
                    View Membership Plans
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Partnership Card */}
            <div className="group relative bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/30 dark:from-gray-800 dark:via-indigo-900/10 dark:to-blue-900/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-indigo-100 dark:border-indigo-800 overflow-hidden flex flex-col">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Decorative Blob */}
              <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-indigo-200/20 to-blue-200/20 dark:from-indigo-700/10 dark:to-blue-700/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10 flex flex-col flex-1">
                {/* Badge and Icon Row */}
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg flex-shrink-0">
                    <Handshake className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Badge */}
                  <div className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <Briefcase className="w-3 h-3 text-indigo-600 dark:text-indigo-400 mr-1.5 flex-shrink-0" />
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">FOR BUSINESSES</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Become a Partner
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-5 sm:mb-6 leading-relaxed">
                  Join Sri Lanka's leading tourism platform. Reach thousands of travelers, grow your business, and be part of our success story.
                </p>

                {/* Benefits List */}
                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  <div className="flex items-start space-x-2.5 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Reach 10,000+ active travelers monthly</span>
                  </div>
                  <div className="flex items-start space-x-2.5 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Advanced analytics and booking management</span>
                  </div>
                  <div className="flex items-start space-x-2.5 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Dedicated partner support & training</span>
                  </div>
                  <div className="flex items-start space-x-2.5 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Flexible commission and payment options</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <Link
                    to="/ads/opportunities/partnerships"
                    className="inline-flex items-center justify-center w-full px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white text-sm sm:text-base font-bold rounded-xl hover:from-indigo-700 hover:via-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                  >
                    <Handshake className="mr-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover/btn:scale-110 transition-transform duration-300" />
                    Explore Partnership
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="text-center px-2 sm:px-0">
        <div className="card p-6 sm:p-8 md:p-12 max-w-3xl mx-auto bg-gradient-to-br from-white to-primary-50 dark:from-gray-800 dark:to-gray-900 border-2 border-primary-200 dark:border-primary-800">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
            <Plane className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Ready to Explore Sri Lanka?
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered amazing experiences through Holidaysri.
            Start planning your dream vacation today!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-sm sm:text-base font-bold rounded-xl hover:from-primary-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Browse All Services
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 text-sm sm:text-base font-bold rounded-xl border-2 border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
            >
              <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 group transition-all duration-500 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        {/* Outer glow ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>

        {/* Button container */}
        <div className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 hover:from-primary-700 hover:via-purple-700 hover:to-pink-700 text-white p-3 sm:p-4 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-all duration-300">
          {/* Icon */}
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-1 transition-transform duration-300" />

          {/* Decorative corner elements */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping" style={{ animationDelay: '150ms' }}></div>
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Back to Top
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      </button>
      </div>
    </>
  );
};

export default Home;
