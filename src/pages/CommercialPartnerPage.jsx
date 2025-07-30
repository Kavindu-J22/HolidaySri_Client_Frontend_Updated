import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Star,
  Check,
  Loader,
  AlertCircle,
  Calendar,
  Coins,
  Users,
  Crown,
  Upload,
  FileText,
  Building,
  Camera
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { commercialPartnerAPI, hscAPI } from '../config/api';

const CommercialPartnerPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [partnerConfig, setPartnerConfig] = useState(null);
  const [partnerStatus, setPartnerStatus] = useState(null);
  const [currentPartners, setCurrentPartners] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [hscValue, setHscValue] = useState(100);

  // Registration form state
  const [formData, setFormData] = useState({
    companyName: '',
    businessType: 'Tourism Agency',
    businessLogo: '',
    documents: {
      nicFront: '',
      nicBack: '',
      passport: ''
    }
  });
  const [uploading, setUploading] = useState({
    logo: false,
    nicFront: false,
    nicBack: false,
    passport: false
  });

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    try {
      setLoading(true);
      const [configResponse, statusResponse, partnersResponse, hscResponse] = await Promise.all([
        commercialPartnerAPI.getConfig(),
        user ? commercialPartnerAPI.getStatus() : Promise.resolve({ data: null }),
        commercialPartnerAPI.getPartners(),
        hscAPI.getInfo()
      ]);

      setPartnerConfig(configResponse.data.config);
      if (statusResponse.data) {
        setPartnerStatus(statusResponse.data);
      }
      setCurrentPartners(partnersResponse.data.partners || []);
      setHscValue(hscResponse.data.hscValue || 100);
    } catch (error) {
      console.error('Error fetching partner data:', error);
      setError('Failed to load commercial partner information');
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    formData.append('cloud_name', 'daa9e83as');

    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      const response = await fetch('https://api.cloudinary.com/v1_1/daa9e83as/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload image');
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(file, type);
      
      if (type === 'logo') {
        setFormData(prev => ({ ...prev, businessLogo: imageUrl }));
      } else {
        setFormData(prev => ({
          ...prev,
          documents: { ...prev.documents, [type]: imageUrl }
        }));
      }
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleJoinNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowRegistrationForm(true);
  };

  const handleSubmitRegistration = async () => {
    try {
      // Validate form
      if (!formData.companyName.trim()) {
        setError('Company name is required');
        return;
      }
      if (!formData.businessLogo) {
        setError('Business logo is required');
        return;
      }
      if (!formData.documents.passport && (!formData.documents.nicFront || !formData.documents.nicBack)) {
        setError('Please upload either passport or both NIC front and back images');
        return;
      }

      setPurchasing(true);
      setError('');

      const response = await commercialPartnerAPI.purchase({
        partnershipType: selectedPlan,
        companyName: formData.companyName.trim(),
        businessType: formData.businessType,
        businessLogo: formData.businessLogo,
        documents: formData.documents
      });

      // Refresh user data and partner status
      await refreshUser();
      await fetchPartnerData();
      
      setShowRegistrationForm(false);
      setFormData({
        companyName: '',
        businessType: 'Tourism Agency',
        businessLogo: '',
        documents: { nicFront: '', nicBack: '', passport: '' }
      });

    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to register as commercial partner. Please try again.');
      }
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!partnerConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Failed to load commercial partner information</p>
        </div>
      </div>
    );
  }

  // If user is already a partner
  if (partnerStatus?.isPartner && partnerStatus?.partnerDetails) {
    const expirationDate = new Date(partnerStatus.partnerExpirationDate);
    const isExpired = expirationDate < new Date();

    if (!isExpired) {
      return (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Briefcase className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              You are a Holidaysri Commercial Partner!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Enjoying premium business benefits with enhanced visibility
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Partner Status Card */}
            <div className="card p-8">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={partnerStatus.partnerDetails.businessLogo}
                  alt={partnerStatus.partnerDetails.companyName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {partnerStatus.partnerDetails.companyName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {partnerStatus.partnerDetails.businessType}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Partnership Type:</span>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">
                    {partnerStatus.partnerDetails.partnershipType}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Valid Until:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {expirationDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    <Check className="w-4 h-4 mr-1" />
                    Active Partner
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      try {
                        setError('');
                        const imageUrl = await uploadToCloudinary(file, 'logo');

                        // Update logo via API
                        await commercialPartnerAPI.updateLogo({ businessLogo: imageUrl });

                        // Refresh partner data
                        await fetchPartnerData();

                        setError('');
                      } catch (error) {
                        setError('Failed to update logo. Please try again.');
                      }
                    };
                    input.click();
                  }}
                  disabled={uploading.logo}
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  {uploading.logo ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <span>{uploading.logo ? 'Updating...' : 'Update Logo'}</span>
                </button>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="card p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Your Partner Benefits
              </h3>
              <div className="space-y-3">
                {partnerConfig.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Partners Section */}
          {currentPartners.length > 0 && (
            <div className="card p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Current Commercial Partners
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPartners.map((partner) => (
                  <div key={partner._id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <img
                      src={partner.businessLogo}
                      alt={partner.companyName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {partner.companyName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {partner.businessType}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  }

  const monthlyHSC = Math.ceil(partnerConfig.monthlyCharge / partnerConfig.hscValue);
  const yearlyHSC = Math.ceil(partnerConfig.yearlyCharge / partnerConfig.hscValue);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <Briefcase className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Com.Partners & Partnerships
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Join as a Commercial Partner and unlock premium business features with enhanced visibility and exclusive benefits
        </p>
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Commercial Partner Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerConfig.features.map((feature, index) => (
            <div key={index} className="card p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-900 dark:text-white font-medium">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Choose Your Partnership Plan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className={`card p-8 relative cursor-pointer transition-all duration-200 ${
            selectedPlan === 'monthly' 
              ? 'ring-2 ring-blue-500 shadow-lg' 
              : 'hover:shadow-lg'
          }`} onClick={() => setSelectedPlan('monthly')}>
            <div className="text-center">
              <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Monthly Plan</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {partnerConfig.monthlyCharge.toLocaleString()} LKR
                </span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {monthlyHSC} HSC
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Current HSC Rate: {partnerConfig.hscValue} LKR
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPlan === 'monthly' 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`} />
              </div>
            </div>
          </div>

          {/* Yearly Plan */}
          <div className={`card p-8 relative cursor-pointer transition-all duration-200 ${
            selectedPlan === 'yearly' 
              ? 'ring-2 ring-blue-500 shadow-lg' 
              : 'hover:shadow-lg'
          }`} onClick={() => setSelectedPlan('yearly')}>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Best Value
              </span>
            </div>
            <div className="text-center">
              <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Yearly Plan</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {partnerConfig.yearlyCharge.toLocaleString()} LKR
                </span>
                <span className="text-gray-600 dark:text-gray-400">/year</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {yearlyHSC} HSC
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Current HSC Rate: {partnerConfig.hscValue} LKR
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPlan === 'yearly' 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Join Now Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {user ? (
              <>Your current HSC balance: <span className="font-semibold">{partnerStatus?.hscBalance || 0} HSC</span></>
            ) : (
              'Please login to become a commercial partner'
            )}
          </p>
          {user && partnerStatus && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Required: {selectedPlan === 'monthly' ? monthlyHSC : yearlyHSC} HSC
            </p>
          )}
        </div>

        <button
          onClick={handleJoinNow}
          disabled={purchasing}
          className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {user ? `Join Now - ${selectedPlan === 'monthly' ? monthlyHSC : yearlyHSC} HSC` : 'Login to Join'}
        </button>

        {!user && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <button 
              onClick={() => navigate('/login')} 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Login
            </button> or <button 
              onClick={() => navigate('/register')} 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Register
            </button> to get started
          </p>
        )}
      </div>

      {/* Current Partners Section */}
      {currentPartners.length > 0 && (
        <div className="card p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Current Commercial Partners
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPartners.map((partner) => (
              <div key={partner._id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <img
                  src={partner.businessLogo}
                  alt={partner.companyName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {partner.companyName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {partner.businessType}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Complete Your Registration
                </h3>
                <button
                  onClick={() => setShowRegistrationForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company or Business Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="input pl-10"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Type *
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                    className="input"
                  >
                    <option value="Tourism Agency">Tourism Agency</option>
                    <option value="Event Planning Company">Event Planning Company</option>
                    <option value="Advertising Agency">Advertising Agency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Business Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Logo *
                  </label>
                  <div className="flex items-center space-x-4">
                    {formData.businessLogo && (
                      <img
                        src={formData.businessLogo}
                        alt="Business Logo"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <button
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => handleFileUpload(e, 'logo');
                        input.click();
                      }}
                      disabled={uploading.logo}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      {uploading.logo ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>{uploading.logo ? 'Uploading...' : 'Upload Logo'}</span>
                    </button>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Identity Documents * (Upload NIC Front & Back OR Passport)
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* NIC Front */}
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">NIC Front</label>
                      <div className="space-y-2">
                        {formData.documents.nicFront && (
                          <img
                            src={formData.documents.nicFront}
                            alt="NIC Front"
                            className="w-full h-24 object-cover rounded"
                          />
                        )}
                        <button
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => handleFileUpload(e, 'nicFront');
                            input.click();
                          }}
                          disabled={uploading.nicFront}
                          className="btn-secondary w-full text-sm flex items-center justify-center space-x-1"
                        >
                          {uploading.nicFront ? (
                            <Loader className="w-3 h-3 animate-spin" />
                          ) : (
                            <FileText className="w-3 h-3" />
                          )}
                          <span>{uploading.nicFront ? 'Uploading...' : 'Upload'}</span>
                        </button>
                      </div>
                    </div>

                    {/* NIC Back */}
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">NIC Back</label>
                      <div className="space-y-2">
                        {formData.documents.nicBack && (
                          <img
                            src={formData.documents.nicBack}
                            alt="NIC Back"
                            className="w-full h-24 object-cover rounded"
                          />
                        )}
                        <button
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => handleFileUpload(e, 'nicBack');
                            input.click();
                          }}
                          disabled={uploading.nicBack}
                          className="btn-secondary w-full text-sm flex items-center justify-center space-x-1"
                        >
                          {uploading.nicBack ? (
                            <Loader className="w-3 h-3 animate-spin" />
                          ) : (
                            <FileText className="w-3 h-3" />
                          )}
                          <span>{uploading.nicBack ? 'Uploading...' : 'Upload'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Passport */}
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Passport (Alternative)</label>
                      <div className="space-y-2">
                        {formData.documents.passport && (
                          <img
                            src={formData.documents.passport}
                            alt="Passport"
                            className="w-full h-24 object-cover rounded"
                          />
                        )}
                        <button
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => handleFileUpload(e, 'passport');
                            input.click();
                          }}
                          disabled={uploading.passport}
                          className="btn-secondary w-full text-sm flex items-center justify-center space-x-1"
                        >
                          {uploading.passport ? (
                            <Loader className="w-3 h-3 animate-spin" />
                          ) : (
                            <FileText className="w-3 h-3" />
                          )}
                          <span>{uploading.passport ? 'Uploading...' : 'Upload'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowRegistrationForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitRegistration}
                    disabled={purchasing}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {purchasing ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Proceed - {selectedPlan === 'monthly' ? monthlyHSC : yearlyHSC} HSC</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommercialPartnerPage;
