import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  ArrowLeft, Save, Loader, X, Upload, MapPin, Phone, Mail,
  Globe, Facebook, MessageCircle, CheckCircle, ImageIcon,
  Utensils, PartyPopper, ChevronLeft, ChevronRight, Building2
} from 'lucide-react';

const EditHotelsAccommodations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Climate options
  const climateOptions = [
    { value: "", label: "Select a climate zone" },
    { value: "Dry Zone", label: "🌵 Dry Zone" },
    { value: "Wet Zone", label: "🌧️ Wet Zone" },
    { value: "Intermediate Zone", label: "🌤️ Intermediate Zone" },
    { value: "Coastal", label: "🏖️ Coastal" },
    { value: "Hill Country", label: "⛰️ Hill Country" },
    { value: "Tropical Rainforest", label: "🌴 Tropical Rainforest" },
    { value: "Arid", label: "☀️ Arid" },
    { value: "Semi-Arid", label: "🌾 Semi-Arid" },
    { value: "Montane", label: "🏔️ Montane" }
  ];

  // Provinces and districts
  const provincesData = {
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Northern Province": ["Jaffna", "Mannar", "Vavuniya", "Kilinochchi", "Mullaitivu"],
    "Eastern Province": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Sabaragamuwa Province": ["Kegalle", "Ratnapura"]
  };

  // Form state
  const [formData, setFormData] = useState({
    hotelName: '',
    category: '',
    description: '',
    climate: '',
    location: {
      address: '',
      city: '',
      province: '',
      mapUrl: ''
    },
    contactInfo: {
      email: '',
      contactNumber: '',
      whatsappNumber: '',
      facebookUrl: '',
      websiteUrl: ''
    },
    facilities: {},
    diningOptions: {
      breakfastIncluded: false,
      breakfastInfo: '',
      breakfastCharge: '',
      restaurantOnSite: false,
      restaurantInfo: '',
      menuPDF: { url: '', publicId: '' }
    },
    functionOptions: {
      weddingHall: false,
      conferenceHall: false,
      banquetFacility: false,
      meetingRooms: false,
      eventSpace: false,
      packagesPDF: { url: '', publicId: '' }
    },
    policies: {
      checkInTime: '',
      checkOutTime: '',
      allowsLiquor: false,
      allowsSmoking: false,
      pets: false,
      parties: false,
      acceptedPaymentMethods: []
    },
    activities: {
      onsiteActivities: [],
      nearbyAttractions: [],
      nearbyActivities: []
    },
    otherInfo: [],
    isHaveStars: false,
    howManyStars: 0,
    isVerified: false,
    isHaveCertificate: false,
    isHaveLicense: false,
    acceptTeams: false
  });

  const [images, setImages] = useState([]);
  const [menuPDF, setMenuPDF] = useState(null);
  const [packagesPDF, setPackagesPDF] = useState(null);

  // Input states for arrays
  const [onsiteActivityInput, setOnsiteActivityInput] = useState('');
  const [nearbyAttractionInput, setNearbyAttractionInput] = useState('');
  const [nearbyActivityInput, setNearbyActivityInput] = useState('');
  const [otherInfoInput, setOtherInfoInput] = useState('');

  // Fetch hotel data
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/hotels-accommodations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const hotel = response.data.data;
          
          setFormData({
            hotelName: hotel.hotelName || '',
            category: hotel.category || '',
            description: hotel.description || '',
            climate: hotel.climate || '',
            location: hotel.location || {
              address: '',
              city: '',
              province: '',
              mapUrl: ''
            },
            contactInfo: hotel.contactInfo || {
              email: '',
              contactNumber: '',
              whatsappNumber: '',
              facebookUrl: '',
              websiteUrl: ''
            },
            facilities: hotel.facilities || {},
            diningOptions: hotel.diningOptions || {
              breakfastIncluded: false,
              breakfastInfo: '',
              breakfastCharge: '',
              restaurantOnSite: false,
              restaurantInfo: '',
              menuPDF: { url: '', publicId: '' }
            },
            functionOptions: hotel.functionOptions || {
              weddingHall: false,
              conferenceHall: false,
              banquetFacility: false,
              meetingRooms: false,
              eventSpace: false,
              packagesPDF: { url: '', publicId: '' }
            },
            policies: hotel.policies || {
              checkInTime: '',
              checkOutTime: '',
              allowsLiquor: false,
              allowsSmoking: false,
              pets: false,
              parties: false,
              acceptedPaymentMethods: []
            },
            activities: hotel.activities || {
              onsiteActivities: [],
              nearbyAttractions: [],
              nearbyActivities: []
            },
            otherInfo: hotel.otherInfo || [],
            isHaveStars: hotel.isHaveStars || false,
            howManyStars: hotel.howManyStars || 0,
            isVerified: hotel.isVerified || false,
            isHaveCertificate: hotel.isHaveCertificate || false,
            isHaveLicense: hotel.isHaveLicense || false,
            acceptTeams: hotel.acceptTeams || false
          });

          setImages(hotel.images || []);
          
          if (hotel.diningOptions?.menuPDF?.url) {
            setMenuPDF(hotel.diningOptions.menuPDF);
          }
          
          if (hotel.functionOptions?.packagesPDF?.url) {
            setPackagesPDF(hotel.functionOptions.packagesPDF);
          }
        }
      } catch (error) {
        console.error('Error fetching hotel data:', error);
        setError('Failed to load hotel data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotelData();
    }
  }, [id]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle facility change
  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        [facility]: !prev.facilities[facility]
      }
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setFormData(prev => {
      const methods = prev.policies.acceptedPaymentMethods || [];
      const newMethods = methods.includes(method)
        ? methods.filter(m => m !== method)
        : [...methods, method];
      
      return {
        ...prev,
        policies: {
          ...prev.policies,
          acceptedPaymentMethods: newMethods
        }
      };
    });
  };

  // Upload image to Cloudinary
  const uploadImages = async (files) => {
    setUploading(true);
    setError('');

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');

        const response = await fetch(
          'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
          {
            method: 'POST',
            body: formData
          }
        );

        const data = await response.json();
        return {
          url: data.secure_url,
          publicId: data.public_id
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Upload PDF to Cloudinary
  const uploadPDF = async (file, type) => {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/daa9e83as/raw/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      const pdfData = {
        url: data.secure_url,
        publicId: data.public_id
      };

      if (type === 'menu') {
        setMenuPDF(pdfData);
        setFormData(prev => ({
          ...prev,
          diningOptions: {
            ...prev.diningOptions,
            menuPDF: pdfData
          }
        }));
      } else if (type === 'packages') {
        setPackagesPDF(pdfData);
        setFormData(prev => ({
          ...prev,
          functionOptions: {
            ...prev.functionOptions,
            packagesPDF: pdfData
          }
        }));
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setError('Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  // Add/Remove array items
  const addOnsiteActivity = () => {
    if (onsiteActivityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        activities: {
          ...prev.activities,
          onsiteActivities: [...prev.activities.onsiteActivities, onsiteActivityInput.trim()]
        }
      }));
      setOnsiteActivityInput('');
    }
  };

  const addNearbyAttraction = () => {
    if (nearbyAttractionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        activities: {
          ...prev.activities,
          nearbyAttractions: [...prev.activities.nearbyAttractions, nearbyAttractionInput.trim()]
        }
      }));
      setNearbyAttractionInput('');
    }
  };

  const addNearbyActivity = () => {
    if (nearbyActivityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        activities: {
          ...prev.activities,
          nearbyActivities: [...prev.activities.nearbyActivities, nearbyActivityInput.trim()]
        }
      }));
      setNearbyActivityInput('');
    }
  };

  const addOtherInfo = () => {
    if (otherInfoInput.trim()) {
      setFormData(prev => ({
        ...prev,
        otherInfo: [...prev.otherInfo, otherInfoInput.trim()]
      }));
      setOtherInfoInput('');
    }
  };

  const removeItem = (e, index, arrayName) => {
    if (arrayName === 'otherInfo') {
      setFormData(prev => ({
        ...prev,
        otherInfo: prev.otherInfo.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        activities: {
          ...prev.activities,
          [arrayName]: prev.activities[arrayName].filter((_, i) => i !== index)
        }
      }));
    }
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  // Validation
  const validateStep = (step) => {
    setError('');

    switch (step) {
      case 1:
        if (!formData.hotelName.trim()) {
          setError('Hotel name is required');
          return false;
        }
        if (!formData.category) {
          setError('Category is required');
          return false;
        }
        if (!formData.climate) {
          setError('Climate zone is required');
          return false;
        }
        if (!formData.description.trim()) {
          setError('Description is required');
          return false;
        }
        return true;

      case 2:
        if (!formData.location.address.trim()) {
          setError('Address is required');
          return false;
        }
        if (!formData.location.province) {
          setError('Province is required');
          return false;
        }
        if (!formData.location.city) {
          setError('City is required');
          return false;
        }
        if (!formData.location.mapUrl.trim()) {
          setError('Map URL is required');
          return false;
        }
        return true;

      case 3:
        if (!formData.contactInfo.email.trim()) {
          setError('Email is required');
          return false;
        }
        if (!formData.contactInfo.contactNumber.trim()) {
          setError('Contact number is required');
          return false;
        }
        if (!formData.contactInfo.whatsappNumber.trim()) {
          setError('WhatsApp number is required');
          return false;
        }
        return true;

      case 4:
        return true;

      case 5:
        if (images.length === 0) {
          setError('At least 1 image is required');
          return false;
        }
        if (images.length > 5) {
          setError('Maximum 5 images allowed');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(5)) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/hotels-accommodations/${id}`,
        {
          ...formData,
          images,
          diningOptions: {
            ...formData.diningOptions,
            menuPDF: menuPDF || { url: '', publicId: '' }
          },
          functionOptions: {
            ...formData.functionOptions,
            packagesPDF: packagesPDF || { url: '', publicId: '' }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/profile', { state: { activeSection: 'advertisements' } });
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating hotel:', error);
      setError(error.response?.data?.message || 'Failed to update hotel profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading hotel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to My Advertisements</span>
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Edit Hotel & Accommodation
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Update your hotel listing information
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {step < 6 && (
                  <div
                    className={`w-12 h-1 mx-1 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
            <span>Basic</span>
            <span>Location</span>
            <span>Contact</span>
            <span>Facilities</span>
            <span>Images</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Basic Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hotel Name *
                </label>
                <input
                  type="text"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Hotels">Hotels</option>
                  <option value="Apartments">Apartments</option>
                  <option value="Resorts">Resorts</option>
                  <option value="Villas">Villas</option>
                  <option value="Guest Houses">Guest Houses</option>
                  <option value="Homestays">Homestays</option>
                  <option value="Boutique Hotels">Boutique Hotels</option>
                  <option value="Eco Lodges">Eco Lodges</option>
                  <option value="Beach Hotels">Beach Hotels</option>
                  <option value="City Hotels">City Hotels</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Climate Zone *
                </label>
                <select
                  name="climate"
                  value={formData.climate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {climateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Location Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                Location Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Province *
                  </label>
                  <select
                    name="location.province"
                    value={formData.location.province}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select province</option>
                    {Object.keys(provincesData).map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <select
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    disabled={!formData.location.province}
                  >
                    <option value="">Select city</option>
                    {formData.location.province &&
                      provincesData[formData.location.province]?.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Maps URL *
                </label>
                <input
                  type="url"
                  name="location.mapUrl"
                  value={formData.location.mapUrl}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Phone className="w-6 h-6" />
                Contact Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contactInfo.contactNumber"
                    value={formData.contactInfo.contactNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    name="contactInfo.whatsappNumber"
                    value={formData.contactInfo.whatsappNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    Facebook URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="contactInfo.facebookUrl"
                    value={formData.contactInfo.facebookUrl}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="contactInfo.websiteUrl"
                    value={formData.contactInfo.websiteUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Facilities & Policies - Condensed for Edit */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Facilities & Policies
              </h2>

              {/* Key Facilities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Facilities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {['internet', 'parking', 'swimmingPool', 'gym', 'spa', 'restaurant', 'roomService', 'airportShuttle', 'petFriendly', 'bar', 'wheelchairAccess', 'garden'].map((facility) => (
                    <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.facilities[facility] || false}
                        onChange={() => handleFacilityChange(facility)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {facility.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dining Options */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Dining Options
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="diningOptions.breakfastIncluded"
                      checked={formData.diningOptions.breakfastIncluded}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Breakfast Included</span>
                  </label>

                  {formData.diningOptions.breakfastIncluded && (
                    <div className="ml-6 space-y-3">
                      <input
                        type="text"
                        name="diningOptions.breakfastInfo"
                        value={formData.diningOptions.breakfastInfo}
                        onChange={handleInputChange}
                        placeholder="Breakfast details"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                      <input
                        type="number"
                        name="diningOptions.breakfastCharge"
                        value={formData.diningOptions.breakfastCharge}
                        onChange={handleInputChange}
                        placeholder="Breakfast charge (LKR)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  )}

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="diningOptions.restaurantOnSite"
                      checked={formData.diningOptions.restaurantOnSite}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Restaurant On-Site</span>
                  </label>

                  {formData.diningOptions.restaurantOnSite && (
                    <div className="ml-6 space-y-3">
                      <input
                        type="text"
                        name="diningOptions.restaurantInfo"
                        value={formData.diningOptions.restaurantInfo}
                        onChange={handleInputChange}
                        placeholder="Restaurant information"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Upload Menu PDF (Optional)</label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => e.target.files[0] && uploadPDF(e.target.files[0], 'menu')}
                          className="w-full text-sm"
                        />
                        {menuPDF && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Menu PDF uploaded</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Function Options */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <PartyPopper className="w-5 h-5" />
                  Function & Event Facilities
                </h3>
                <div className="space-y-3">
                  {['weddingHall', 'conferenceHall', 'banquetFacility', 'meetingRooms', 'eventSpace'].map((func) => (
                    <label key={func} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name={`functionOptions.${func}`}
                        checked={formData.functionOptions[func]}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {func.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                  <div className="mt-3">
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Upload Packages PDF (Optional)</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => e.target.files[0] && uploadPDF(e.target.files[0], 'packages')}
                      className="w-full text-sm"
                    />
                    {packagesPDF && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Packages PDF uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Policies */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Policies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Check-in Time</label>
                    <input
                      type="text"
                      name="policies.checkInTime"
                      value={formData.policies.checkInTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Check-out Time</label>
                    <input
                      type="text"
                      name="policies.checkOutTime"
                      value={formData.policies.checkOutTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {['allowsLiquor', 'allowsSmoking', 'pets', 'parties'].map((policy) => (
                    <label key={policy} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name={`policies.${policy}`}
                        checked={formData.policies[policy]}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {policy.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Accepted Payment Methods</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Card', 'Cash', 'Bank Transfer', 'Mobile Payment'].map((method) => (
                      <label key={method} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.policies.acceptedPaymentMethods.includes(method)}
                          onChange={() => handlePaymentMethodChange(method)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Images & Activities */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <ImageIcon className="w-6 h-6" />
                Images & Activities
              </h2>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Images * (Max 5 images)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (images.length + files.length <= 5) {
                      uploadImages(files);
                    } else {
                      setError('Maximum 5 images allowed');
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={images.length >= 5 || uploading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {images.length}/5 images uploaded
                </p>

                {uploading && (
                  <div className="flex items-center gap-2 mt-2 text-blue-600 dark:text-blue-400">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activities & Attractions</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">On-site Activities</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={onsiteActivityInput}
                        onChange={(e) => setOnsiteActivityInput(e.target.value)}
                        placeholder="Add activity"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOnsiteActivity())}
                      />
                      <button
                        type="button"
                        onClick={addOnsiteActivity}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.activities.onsiteActivities.map((activity, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2">
                          {activity}
                          <button type="button" onClick={() => removeItem(null, index, 'onsiteActivities')}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Nearby Attractions</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nearbyAttractionInput}
                        onChange={(e) => setNearbyAttractionInput(e.target.value)}
                        placeholder="Add attraction"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNearbyAttraction())}
                      />
                      <button
                        type="button"
                        onClick={addNearbyAttraction}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.activities.nearbyAttractions.map((attraction, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm flex items-center gap-2">
                          {attraction}
                          <button type="button" onClick={() => removeItem(null, index, 'nearbyAttractions')}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Nearby Activities</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nearbyActivityInput}
                        onChange={(e) => setNearbyActivityInput(e.target.value)}
                        placeholder="Add activity"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNearbyActivity())}
                      />
                      <button
                        type="button"
                        onClick={addNearbyActivity}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.activities.nearbyActivities.map((activity, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm flex items-center gap-2">
                          {activity}
                          <button type="button" onClick={() => removeItem(null, index, 'nearbyActivities')}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Other Information</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otherInfoInput}
                        onChange={(e) => setOtherInfoInput(e.target.value)}
                        placeholder="Add information"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOtherInfo())}
                      />
                      <button
                        type="button"
                        onClick={addOtherInfo}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.otherInfo.map((info, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm flex items-center gap-2">
                          {info}
                          <button type="button" onClick={() => removeItem(null, index, 'otherInfo')}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isHaveStars"
                        checked={formData.isHaveStars}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Star Rating Available</span>
                    </label>

                    {formData.isHaveStars && (
                      <input
                        type="number"
                        name="howManyStars"
                        value={formData.howManyStars}
                        onChange={handleInputChange}
                        min="1"
                        max="5"
                        placeholder="Number of stars (1-5)"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {['isVerified', 'isHaveCertificate', 'isHaveLicense', 'acceptTeams'].map((field) => (
                      <label key={field} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name={field}
                          checked={formData[field]}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {field.replace(/([A-Z])/g, ' $1').replace('is', '').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Review Changes
              </h2>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">Summary</h3>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <p><strong>Hotel Name:</strong> {formData.hotelName}</p>
                  <p><strong>Category:</strong> {formData.category}</p>
                  <p><strong>Location:</strong> {formData.location.city}, {formData.location.province}</p>
                  <p><strong>Contact:</strong> {formData.contactInfo.email}</p>
                  <p><strong>Images:</strong> {images.length} uploaded</p>
                  {menuPDF && <p><strong>Menu PDF:</strong> ✓ Uploaded</p>}
                  {packagesPDF && <p><strong>Packages PDF:</strong> ✓ Uploaded</p>}
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Important</h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Please review all changes carefully before saving. Your updated listing will be visible to all users.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
            )}

            {currentStep < 6 && (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {currentStep === 6 && (
              <button
                type="submit"
                disabled={saving}
                className="ml-auto flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Successfully Updated!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your hotel listing has been updated successfully. Redirecting to My Advertisements...
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Redirecting...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditHotelsAccommodations;

