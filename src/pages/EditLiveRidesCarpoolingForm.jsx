import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Upload, X, Loader, CheckCircle, ArrowLeft, 
  Car, User, MapPin, Calendar, DollarSign, Users, Clock
} from 'lucide-react';

const EditLiveRidesCarpoolingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    vehicleNumber: '',
    vehicleBrand: '',
    vehicleOwnerName: '',
    ownerLocation: {
      address: '',
      city: '',
      province: ''
    },
    phoneNumber: '',
    rideRoute: {
      from: '',
      to: ''
    },
    description: '',
    maxPassengerCount: '',
    availablePassengerCount: '',
    status: 'Upcoming Ride',
    pricePerSeat: '',
    rideDate: '',
    rideTime: '',
    approximateTimeToRide: ''
  });

  const [images, setImages] = useState({
    vehicleImage: { url: '', publicId: '', uploading: false },
    numberPlate: { url: '', publicId: '', uploading: false },
    ownerPhoto: { url: '', publicId: '', uploading: false },
    ownerNICFront: { url: '', publicId: '', uploading: false },
    ownerNICBack: { url: '', publicId: '', uploading: false }
  });

  const [availableCities, setAvailableCities] = useState([]);

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/live-rides-carpooling/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();

        if (data.success) {
          const ride = data.data;
          
          setFormData({
            vehicleNumber: ride.vehicleNumber || '',
            vehicleBrand: ride.vehicleBrand || '',
            vehicleOwnerName: ride.vehicleOwnerName || '',
            ownerLocation: {
              address: ride.ownerLocation?.address || '',
              city: ride.ownerLocation?.city || '',
              province: ride.ownerLocation?.province || ''
            },
            phoneNumber: ride.phoneNumber || '',
            rideRoute: {
              from: ride.rideRoute?.from || '',
              to: ride.rideRoute?.to || ''
            },
            description: ride.description || '',
            maxPassengerCount: ride.maxPassengerCount || '',
            availablePassengerCount: ride.availablePassengerCount || '',
            status: ride.status || 'Upcoming Ride',
            pricePerSeat: ride.pricePerSeat || '',
            rideDate: ride.rideDate ? new Date(ride.rideDate).toISOString().split('T')[0] : '',
            rideTime: ride.rideTime || '',
            approximateTimeToRide: ride.approximateTimeToRide || ''
          });

          setImages({
            vehicleImage: ride.images?.vehicleImage || { url: '', publicId: '', uploading: false },
            numberPlate: ride.images?.numberPlate || { url: '', publicId: '', uploading: false },
            ownerPhoto: ride.images?.ownerPhoto || { url: '', publicId: '', uploading: false },
            ownerNICFront: ride.images?.ownerNICFront || { url: '', publicId: '', uploading: false },
            ownerNICBack: ride.images?.ownerNICBack || { url: '', publicId: '', uploading: false }
          });
        } else {
          setError('Failed to load ride data');
        }
      } catch (err) {
        console.error('Error fetching ride:', err);
        setError('Failed to load ride data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (formData.ownerLocation.province) {
      setAvailableCities(provincesAndDistricts[formData.ownerLocation.province] || []);
    }
  }, [formData.ownerLocation.province]);

  // Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');
    formDataUpload.append('cloud_name', 'daa9e83as');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
        {
          method: 'POST',
          body: formDataUpload
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        return {
          url: data.secure_url,
          publicId: data.public_id
        };
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  // Handle image upload
  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(`${imageType} must be an image file`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(`${imageType} must be less than 5MB`);
      return;
    }

    setImages(prev => ({
      ...prev,
      [imageType]: { ...prev[imageType], uploading: true }
    }));

    try {
      const result = await uploadToCloudinary(file);
      setImages(prev => ({
        ...prev,
        [imageType]: {
          url: result.url,
          publicId: result.publicId,
          uploading: false
        }
      }));
      setError('');
    } catch (error) {
      setError(`Failed to upload ${imageType}`);
      setImages(prev => ({
        ...prev,
        [imageType]: { ...prev[imageType], uploading: false }
      }));
    }
  };

  // Remove image
  const removeImage = (imageType) => {
    setImages(prev => ({
      ...prev,
      [imageType]: { url: '', publicId: '', uploading: false }
    }));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.vehicleNumber || !formData.vehicleBrand || !formData.vehicleOwnerName ||
        !formData.ownerLocation.address || !formData.ownerLocation.city || !formData.ownerLocation.province ||
        !formData.phoneNumber || !formData.rideRoute.from || !formData.rideRoute.to ||
        !formData.description || !formData.maxPassengerCount || !formData.availablePassengerCount ||
        !formData.status || !formData.pricePerSeat || !formData.rideDate || !formData.rideTime ||
        !formData.approximateTimeToRide) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseInt(formData.availablePassengerCount) > parseInt(formData.maxPassengerCount)) {
      setError('Available passenger count cannot exceed maximum passenger count');
      return;
    }

    if (!images.vehicleImage.url || !images.numberPlate.url || !images.ownerPhoto.url ||
        !images.ownerNICFront.url || !images.ownerNICBack.url) {
      setError('All 5 images are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/live-rides-carpooling/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          images,
          ...formData,
          maxPassengerCount: parseInt(formData.maxPassengerCount),
          availablePassengerCount: parseInt(formData.availablePassengerCount),
          pricePerSeat: parseFloat(formData.pricePerSeat)
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/profile', { state: { activeSection: 'advertisements' } });
        }, 3000);
      } else {
        setError(data.message || 'Failed to update. Please try again.');
      }
    } catch (err) {
      console.error('Error updating:', err);
      setError('Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Advertisements
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Live Ride Carpooling
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your ride details
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
            <X className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-8">
          {/* Images Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Upload className="w-6 h-6 mr-2" />
              Images
            </h2>

            {Object.entries({
              vehicleImage: 'Vehicle Image',
              numberPlate: 'Number Plate',
              ownerPhoto: 'Owner Photo',
              ownerNICFront: 'Owner NIC Front',
              ownerNICBack: 'Owner NIC Back'
            }).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label} *
                </label>
                {!images[key].url ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, key)}
                      disabled={images[key].uploading}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        dark:file:bg-blue-900/20 dark:file:text-blue-400
                        dark:hover:file:bg-blue-900/30
                        cursor-pointer"
                    />
                    {images[key].uploading && (
                      <div className="absolute right-2 top-2">
                        <Loader className="w-5 h-5 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={images[key].url}
                      alt={label}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(key)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Car className="w-6 h-6 mr-2" />
              Vehicle Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle Brand *
                </label>
                <input
                  type="text"
                  name="vehicleBrand"
                  value={formData.vehicleBrand}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle Owner Name *
                </label>
                <input
                  type="text"
                  name="vehicleOwnerName"
                  value={formData.vehicleOwnerName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Owner Location & Contact */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPin className="w-6 h-6 mr-2" />
              Owner Location & Contact
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address *
              </label>
              <input
                type="text"
                name="ownerLocation.address"
                value={formData.ownerLocation.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Province *
                </label>
                <select
                  name="ownerLocation.province"
                  value={formData.ownerLocation.province}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Province</option>
                  {Object.keys(provincesAndDistricts).map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <select
                  name="ownerLocation.city"
                  value={formData.ownerLocation.city}
                  onChange={handleChange}
                  disabled={!formData.ownerLocation.province}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  required
                >
                  <option value="">Select City</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Ride Route & Description */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPin className="w-6 h-6 mr-2" />
              Ride Route & Description
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From *
                </label>
                <input
                  type="text"
                  name="rideRoute.from"
                  value={formData.rideRoute.from}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To *
                </label>
                <input
                  type="text"
                  name="rideRoute.to"
                  value={formData.rideRoute.to}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                maxLength="2000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.description.length}/2000 characters
              </p>
            </div>
          </div>

          {/* Ride Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              Ride Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Max Passenger Count *
                </label>
                <input
                  type="number"
                  name="maxPassengerCount"
                  value={formData.maxPassengerCount}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Available Passenger Count *
                </label>
                <input
                  type="number"
                  name="availablePassengerCount"
                  value={formData.availablePassengerCount}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ride Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="Upcoming Ride">Upcoming Ride</option>
                <option value="Starting Soon">Starting Soon</option>
                <option value="Ongoing Ride">Ongoing Ride</option>
                <option value="Over Soon">Over Soon</option>
                <option value="Over">Over</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Price per Seat (LKR) *
              </label>
              <input
                type="number"
                name="pricePerSeat"
                value={formData.pricePerSeat}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Ride Date *
                </label>
                <input
                  type="date"
                  name="rideDate"
                  value={formData.rideDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Ride Time *
                </label>
                <input
                  type="time"
                  name="rideTime"
                  value={formData.rideTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Approximate Time to Ride *
              </label>
              <input
                type="text"
                name="approximateTimeToRide"
                value={formData.approximateTimeToRide}
                onChange={handleChange}
                placeholder="3 hours"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Update Ride
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Updated Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your live ride carpooling has been updated successfully.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Redirecting to My Advertisements...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditLiveRidesCarpoolingForm;

