import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Building2, MapPin, Phone, Utensils, PartyPopper, FileText,
  Image as ImageIcon, CheckCircle, Loader, X, Upload, ChevronRight,
  ChevronLeft, Home, Mail, Globe, Facebook, MessageCircle
} from 'lucide-react';

const HotelsAccommodationsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const advertisementId = location.state?.advertisementId;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Climate options
  const climateOptions = [
    { value: "", label: "Select a climate zone" },
    { value: "Dry zone", label: "Dry zone 🌵" },
    { value: "Intermediate zone", label: "Intermediate zone" },
    { value: "Montane zone", label: "Montane zone 🥶" },
    { value: "Semi-Arid zone", label: "Semi-Arid zone 🌾" },
    { value: "Oceanic zone", label: "Oceanic zone 🌊" },
    { value: "Tropical Wet zone", label: "Tropical Wet zone 🌴" },
    { value: "Tropical Submontane", label: "Tropical Submontane 🌿" },
    { value: "Tropical Dry Zone", label: "Tropical Dry Zone 🍂" },
    { value: "Tropical Monsoon Climate", label: "Tropical Monsoon Climate 🌧️" }
  ];

  // Provinces and districts
  const provincesAndDistricts = {
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

  const [formData, setFormData] = useState({
    hotelName: '',
    userEmail: user?.email || '',
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
      email: user?.email || '',
      contactNumber: user?.contactNumber || '',
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
      restaurantInfo: ''
    },
    functionOptions: {
      weddingHall: false,
      conferenceHall: false,
      banquetFacility: false,
      meetingRooms: false,
      eventSpace: false
    },
    policies: {
      allowsLiquor: false,
      allowsSmoking: false,
      cancellationPolicy: 'Free cancellation within 24 hours of booking. Charges may apply beyond this period.',
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM',
      pets: false,
      petPolicyDetails: '',
      parties: false,
      partyPolicyDetails: '',
      childPolicy: 'Children of all ages are welcome. Additional charges may apply for extra bedding.',
      ageRestriction: false,
      minimumCheckInAge: 18,
      damageDeposit: false,
      damageDepositAmount: 0,
      refundPolicy: 'Refunds are processed within 7 business days of cancellation.',
      noShowPolicy: 'No-shows are charged 100% of the booking amount.',
      lateCheckOutPolicy: 'Late check-out is subject to availability and may incur additional charges.',
      earlyCheckInPolicy: 'Early check-in is subject to availability and may incur additional charges.',
      quietHours: '',
      additionalCharges: 'Additional charges may apply for extra guests, special requests, or facilities usage.',
      taxAndCharges: false,
      taxAndChargesAmount: 0,
      acceptedPaymentMethods: []
    },
    activities: {
      onsiteActivities: [],
      nearbyAttractions: [],
      nearbyActivities: []
    },
    otherInfo: [],
    isHaveStars: false,
    howManyStars: '',
    isVerified: false,
    isHaveCertificate: false,
    isHaveLicense: false,
    acceptTeams: false
  });

  const [images, setImages] = useState([]);
  const [menuPDF, setMenuPDF] = useState(null);
  const [packagesPDF, setPackagesPDF] = useState(null);
  const [cities, setCities] = useState([]);

  // Activity inputs
  const [onsiteActivityInput, setOnsiteActivityInput] = useState('');
  const [nearbyAttractionInput, setNearbyAttractionInput] = useState('');
  const [nearbyActivityInput, setNearbyActivityInput] = useState('');
  const [otherInfoInput, setOtherInfoInput] = useState('');

  useEffect(() => {
    if (!advertisementId) {
      setError('No advertisement ID provided');
      setTimeout(() => navigate('/profile', { state: { activeSection: 'advertisements' } }), 2000);
    }
  }, [advertisementId, navigate]);

  useEffect(() => {
    if (formData.location.province) {
      setCities(provincesAndDistricts[formData.location.province] || []);
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, city: '' }
      }));
    }
  }, [formData.location.province]);

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

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        [facility]: !prev.facilities[facility]
      }
    }));
  };

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

  // Add activity/info functions
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

  // Remove functions
  const removeItem = (array, index, key) => {
    if (key === 'otherInfo') {
      setFormData(prev => ({
        ...prev,
        otherInfo: prev.otherInfo.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        activities: {
          ...prev.activities,
          [key]: prev.activities[key].filter((_, i) => i !== index)
        }
      }));
    }
  };

  // Image upload to Cloudinary
  const uploadImages = async (files) => {
    setUploading(true);
    try {
      const uploadedImages = [];
      
      for (const file of files) {
        const formDataCloud = new FormData();
        formDataCloud.append('file', file);
        formDataCloud.append('upload_preset', 'ml_default');
        formDataCloud.append('cloud_name', 'daa9e83as');

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
          formDataCloud
        );

        uploadedImages.push({
          url: response.data.secure_url,
          publicId: response.data.public_id
        });
      }

      setImages(prev => [...prev, ...uploadedImages]);
      setError('');
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // PDF upload to Cloudinary
  const uploadPDF = async (file, type) => {
    setUploading(true);
    try {
      const formDataCloud = new FormData();
      formDataCloud.append('file', file);
      formDataCloud.append('upload_preset', 'ml_default');
      formDataCloud.append('cloud_name', 'daa9e83as');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/daa9e83as/raw/upload',
        formDataCloud
      );

      const pdfData = {
        url: response.data.secure_url,
        publicId: response.data.public_id
      };

      if (type === 'menu') {
        setMenuPDF(pdfData);
      } else if (type === 'packages') {
        setPackagesPDF(pdfData);
      }

      setError('');
    } catch (err) {
      console.error('Error uploading PDF:', err);
      setError('Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  // Validation for each step
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.hotelName || !formData.category || !formData.description || !formData.climate) {
          setError('Please fill in all required fields in Basic Information');
          return false;
        }
        break;
      case 2:
        if (!formData.location.address || !formData.location.province || !formData.location.city || !formData.location.mapUrl) {
          setError('Please fill in all required location fields');
          return false;
        }
        break;
      case 3:
        if (!formData.contactInfo.email || !formData.contactInfo.contactNumber || !formData.contactInfo.whatsappNumber) {
          setError('Please fill in all required contact information');
          return false;
        }
        break;
      case 4:
        // Facilities and policies are optional
        break;
      case 5:
        if (images.length === 0) {
          setError('Please upload at least 1 image');
          return false;
        }
        if (images.length > 5) {
          setError('Maximum 5 images allowed');
          return false;
        }
        break;
      default:
        break;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(5)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const submitData = {
        advertisementId,
        ...formData,
        images,
        diningOptions: {
          ...formData.diningOptions,
          menuPDF: menuPDF || undefined
        },
        functionOptions: {
          ...formData.functionOptions,
          packagesPDF: packagesPDF || undefined
        }
      };

      const response = await fetch('/api/hotels-accommodations/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/profile', { state: { activeSection: 'advertisements' } });
        }, 3000);
      } else {
        setError(data.message || 'Failed to publish hotel profile');
      }
    } catch (err) {
      console.error('Error publishing hotel profile:', err);
      setError('Failed to publish hotel profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 6;
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  if (!advertisementId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">No advertisement ID provided</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Building2 className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Publish Your Hotel or Accommodation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete all steps to publish your property listing
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Basic Info</span>
            <span>Location</span>
            <span>Contact</span>
            <span>Facilities</span>
            <span>Images</span>
            <span>Review</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Home className="w-6 h-6" />
                Basic Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hotel/Property Name *
                </label>
                <input
                  type="text"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter hotel or property name"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Hotels">Hotels</option>
                  <option value="Apartments">Apartments</option>
                  <option value="Resorts">Resorts</option>
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Describe your property, amenities, unique features..."
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter full address"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Select province</option>
                    {Object.keys(provincesAndDistricts).map((province) => (
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                    disabled={!formData.location.province}
                  >
                    <option value="">Select city</option>
                    {cities.map((city) => (
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://maps.google.com/..."
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="contact@hotel.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="text"
                    name="contactInfo.contactNumber"
                    value={formData.contactInfo.contactNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+94 XX XXX XXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    name="contactInfo.whatsappNumber"
                    value={formData.contactInfo.whatsappNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+94 XX XXX XXXX"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Facebook URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="contactInfo.facebookUrl"
                    value={formData.contactInfo.facebookUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="contactInfo.websiteUrl"
                    value={formData.contactInfo.websiteUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://yourhotel.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Facilities, Dining, Functions & Policies */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Facilities, Dining & Policies
              </h2>

              {/* Key Facilities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Facilities (Select all that apply)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {['internet', 'parking', 'swimmingPool', 'gym', 'spa', 'restaurant', 'roomService', 'airportShuttle', 'petFriendly', 'bar', 'wheelchairAccess', 'garden'].map((facility) => (
                    <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.facilities[facility] || false}
                        onChange={() => handleFacilityChange(facility)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
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
                        placeholder="Breakfast details (e.g., Continental, Buffet)"
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
                        placeholder="Add activity (e.g., Swimming, Yoga)"
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
                        placeholder="Add attraction (e.g., Beach, Temple)"
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
                        placeholder="Add activity (e.g., Surfing, Hiking)"
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
                        placeholder="Add any other important information"
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

          {/* Step 6: Review & Confirm */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Review & Confirm
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
                  Please review all information carefully before submitting. Once published, your hotel listing will be visible to all users on the platform.
                </p>
              </div>

              <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <input
                  type="checkbox"
                  id="confirm"
                  required
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="confirm" className="text-sm text-gray-700 dark:text-gray-300">
                  I confirm that all the information provided is accurate and I agree to the terms and conditions
                </label>
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
                disabled={loading}
                className="ml-auto flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Publish Now
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
              Successfully Published!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your hotel listing has been published successfully. Redirecting to My Advertisements...
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

export default HotelsAccommodationsForm;
