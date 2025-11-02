import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const EditPetCareAnimalServicesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    specialization: [],
    category: 'Veterinary',
    description: '',
    experience: '',
    city: '',
    province: '',
    available: true,
    services: [],
    availability: [],
    facebook: '',
    website: '',
    contact: ''
  });

  const [images, setImages] = useState({
    avatar: null
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [provincesData, setProvincesData] = useState({});

  const specializations = ['Dogs', 'Cats', 'Birds', 'Rabbits', 'Hamsters', 'Guinea Pigs', 'Reptiles', 'Fish', 'Exotic Animals', 'Other'];
  const categories = ['Veterinary', 'Grooming', 'Training', 'Pet Sitting', 'Pet Boarding', 'Pet Supplies', 'Other'];
  const serviceOptions = ['Checkups', 'Vaccinations', 'Surgery', 'Dental', 'Grooming', 'Training', 'Boarding', 'Pet Sitting', 'Consultation', 'Emergency Care'];
  const availabilityOptions = ['Mon-Fri: 9am-6pm', 'Sat: 9am-2pm', 'Sun: Closed', '24/7 Available', 'By Appointment Only'];

  // Fetch profile data and provinces
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch provinces
        const provincesResponse = await axios.get('/api/pet-care-animal-services/provinces');
        if (provincesResponse.data.success) {
          setProvincesData(provincesResponse.data.data);
        }

        // Fetch profile data
        const profileResponse = await axios.get(`/api/pet-care-animal-services/edit/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (profileResponse.data.success) {
          const profile = profileResponse.data.data;
          setFormData({
            name: profile.name,
            specialization: profile.specialization || [],
            category: profile.category,
            description: profile.description,
            experience: profile.experience,
            city: profile.city,
            province: profile.province,
            available: profile.available,
            services: profile.services || [],
            availability: profile.availability || [],
            facebook: profile.facebook || '',
            website: profile.website || '',
            contact: profile.contact
          });

          if (profile.avatar) {
            setImages({
              avatar: {
                url: profile.avatar.url,
                publicId: profile.avatar.publicId
              }
            });
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const formDataCloud = new FormData();
    formDataCloud.append('file', file);
    formDataCloud.append('upload_preset', 'ml_default');
    formDataCloud.append('cloud_name', 'daa9e83as');

    try {
      setSubmitting(true);
      const response = await fetch('https://api.cloudinary.com/v1_1/daa9e83as/image/upload', {
        method: 'POST',
        body: formDataCloud
      });

      const data = await response.json();
      if (data.secure_url) {
        setImages(prev => ({
          ...prev,
          [imageType]: {
            url: data.secure_url,
            publicId: data.public_id
          }
        }));
        setError('');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle checkbox arrays
  const handleCheckboxChange = (e, fieldName) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [fieldName]: checked
        ? [...prev[fieldName], value]
        : prev[fieldName].filter(item => item !== value)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.specialization.length || !formData.category || 
        !formData.description || !formData.experience || !formData.city || 
        !formData.province || !formData.contact || !images.avatar || 
        !formData.services.length || !formData.availability.length) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.put(
        `/api/pet-care-animal-services/${id}`,
        {
          name: formData.name,
          specialization: formData.specialization,
          category: formData.category,
          description: formData.description,
          experience: parseInt(formData.experience),
          city: formData.city,
          province: formData.province,
          available: formData.available,
          avatar: images.avatar,
          services: formData.services,
          availability: formData.availability,
          facebook: formData.facebook,
          website: formData.website,
          contact: formData.contact
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/my-advertisements');
        }, 3000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Pet Care Profile</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Avatar Image *
              </label>
              <div className="flex items-center gap-4">
                {images.avatar && (
                  <img src={images.avatar.url} alt="Avatar" className="w-20 h-20 rounded-lg object-cover" />
                )}
                <label className="flex-1 flex items-center justify-center px-6 py-4 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                  <div className="text-center">
                    <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload image</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'avatar')}
                    className="hidden"
                    disabled={submitting}
                  />
                </label>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                disabled={submitting}
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Specialization *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {specializations.map(spec => (
                  <label key={spec} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={spec}
                      checked={formData.specialization.includes(spec)}
                      onChange={(e) => handleCheckboxChange(e, 'specialization')}
                      className="w-4 h-4 text-indigo-600 rounded"
                      disabled={submitting}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                disabled={submitting}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                disabled={submitting}
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience (Years) *
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                disabled={submitting}
              />
            </div>

            {/* Province and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Province *
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  disabled={submitting}
                >
                  <option value="">Select Province</option>
                  {Object.keys(provincesData).map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  disabled={submitting || !formData.province}
                >
                  <option value="">Select City</option>
                  {formData.province && provincesData[formData.province]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Services *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {serviceOptions.map(service => (
                  <label key={service} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={service}
                      checked={formData.services.includes(service)}
                      onChange={(e) => handleCheckboxChange(e, 'services')}
                      className="w-4 h-4 text-indigo-600 rounded"
                      disabled={submitting}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Availability *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availabilityOptions.map(option => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option}
                      checked={formData.availability.includes(option)}
                      onChange={(e) => handleCheckboxChange(e, 'availability')}
                      className="w-4 h-4 text-indigo-600 rounded"
                      disabled={submitting}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact (Phone or Email) *
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                disabled={submitting}
              />
            </div>

            {/* Facebook and Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook (Optional)
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Available Status */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-indigo-600 rounded"
                  disabled={submitting}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Currently Available</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-advertisements')}
                disabled={submitting}
                className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 disabled:bg-gray-400 text-gray-900 dark:text-white font-medium py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Success!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Your profile has been updated successfully.</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Redirecting to My Advertisements...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPetCareAnimalServicesForm;

